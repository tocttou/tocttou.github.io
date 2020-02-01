---
title: 'Typescript on steroids&#58; Implementing Promisify'
published: true
---

Typescript 2.8 introduced conditional types and the `infer` keyword. A conditional type performs a pattern match on a generic variable and based on the match it can assign a type value. We can use this pattern matching to extract the types of arguments supplied to a function.

For a function that accepts an argument and a callback, we can extract both of these as follows:

{% highlight typescript linenos %}
type Argument<T> = T extends (arg: infer U, callback: infer X) => any ? U : any;
type Callback<T> = T extends (arg: infer U, callback: infer X) => any ? X : any;
{% endhighlight %}

Note that this requires making sure that the function supplied only has 1 argument in addition to the callback, and that argument must be supplied first (which is consistent with how callbacks are typically used). If more arguments are required, more genenric types can be added accordingly. Libraries typically provide upto 5 generic types. This problem arises because there is [no way](https://github.com/Microsoft/TypeScript/issues/1360) to specify a typed, fixed last argument to a function with variable types in Typescript currently.

This is not possible currently:

{% highlight typescript linenos %}
function test(args: ...string[], callback: () => void) {}
{% endhighlight %}

---

Let's say there is a function `testFn` that is of the given format and accepts a callback:

{% highlight typescript linenos %}
const testFn = (arg1: number, callback: (d: string) => void) => {
  callback(`string is ${arg1}`);
};
{% endhighlight %}

We want to use this function with the async/await pattern and for that we need to wrap it in a promise. The generic promisify functionality (applicable to any such function) can be implemented like this:

{% highlight typescript linenos %}
export function promisify<
  V,
  S extends (arg: Argument<S>, callback: Callback<S>) => void
>(fn: S): (arg: Argument<S>) => Promise<V> {
  return arg =>
    new Promise((resolve, reject) => {
      try {
        const callback = (d: V) => {
          resolve(d);
        };
        fn(arg, callback as Callback<typeof fn>);
      } catch (e) {
        reject(e);
      }
    });
}
{% endhighlight %}

This piece of code can be used like this:

{% highlight typescript linenos %}
const asyncTestFn = promisify(testFn); // typeof asyncTestFn === (arg: number) => Promise<any>
const value = await asyncTestFn(300); // typeof value === any
{% endhighlight %}

Notice that the Typescript compiler is not able to infer the value for the generic parameter `V` and thus puts it as `any` type. We can specify `V` explicitly during the function call, but we need to specify the value of the generic parameter `S` as well because Typescript currently does not support partial inference - either you specify everything or you let the compiler handle everything. There is a [github issue](https://github.com/Microsoft/TypeScript/issues/10571) that tracks this feature. [Flow](https://flow.org/), on the other hand, does have support for partial inference using [existential types](http://sitr.us/2015/05/31/advanced-features-in-flow.html#existential-types).

To fix the above code, we modify it as follows:

{% highlight typescript linenos %}
const asyncTestFn = promisify<string, typeof testFn>(testFn); // typeof asyncTestFn === (arg: number) => Promise<string>
const value = await asyncTestFn(300); // typeof value === string
{% endhighlight %}

Luckily for us, we can piggyback on the type inference for the generic variable `S`. We can do away with generic variable `V` completely by replacing it with `Argument<Callback<S>>`, where `Argument` and `Callback` are the conditional types defined before. Then we can also avoid specifying `S` explicitly (remember that its type can be infered automatically by the compiler because we are passing it in as an argument to the `promisify` function).

The final `promisify` function will be:

{% highlight typescript linenos %}
export function promisify<
  S extends (arg: Argument<S>, callback: Callback<S>) => void
>(fn: S): (arg: Argument<S>) => Promise<Argument<Callback<S>>> {
  return arg =>
    new Promise((resolve, reject) => {
      try {
        const callback = (d: Argument<Callback<S>>) => {
          resolve(d);
        };
        fn(arg, callback as Callback<typeof fn>);
      } catch (e) {
        reject(e);
      }
    });
}
{% endhighlight %}

Which can then be used as:

{% highlight typescript linenos %}
const asyncTestFn = promisify(testFn); // typeof asyncTestFn === (arg: number) => Promise<string>
const value = await asyncTestFn(300); // typeof value === string
{% endhighlight %}

And we get full type-safety!
