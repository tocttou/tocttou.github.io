---
title: Better Error Handling In Kotlin With Either Type
published: true
---
Note: This is not an authoritative article on how to handle errors in Kotlin/Java, but it is accurate. This is something that I wanted to try out for a long time. I would suggest you to look at [Try](http://arrow-kt.io/docs/datatypes/try/) from Arrow lib after reading this blog post. I use the terms "error" and "exception" interchangeably - what is meant is "Exception" and not [Error](https://docs.oracle.com/javase/7/docs/api/java/lang/Error.html). 

One of the biggest pain points I face while working on any project in any language is to decide the points where errors and exceptions should be handled. Ideally one should handle all possible exceptions (the ones you can recover from). There are two places where an exception can be handled - function definition-site and function call-site.

Handling the exception at definition-site sounds more logical because that helps us encapsulate the implementation of that function completely. There are two major problems with this approach:
1. There is no way to tell the caller about the exception without throwing it again and handling it again at the call-site. This becomes necessary in cases where the event of an exception can alter the way in which the program proceeds instead of halting completely.
2. Definition-site may not be the best place to put rollback/recovery mechanisms.

Note that we want to avoid having to write multiple try/catch blocks for the same code. We also want to avoid consecutive and/or nested try/catch blocks because that reduces readability and quickly leads to pyramid of doom. And we most certainly do not want an all encompassing try/catch block at the top level.

Another solution to this problem is to avoid try/catch entirely for exceptions that the application can recover from. If the exception is fatal, the application should rightfully crash. With this scheme, an exceptional condition should return a value that indicates an exception/error instead of throwing the exception. This can simply be done by returning a nullable value (if the logic permits) and handling the cases at the call-site.

{% highlight kotlin linenos %}
val value: String? = someExec()
if (value != null) {
    // do something
}
{% endhighlight %}

Or instead of a nullable value, an `Error` value can be returned that provides more information to the call-site about how to handle the situation. This method is very popular in the javascript world where functions often return objects instead of primitives that indicates the status of an execution. Example:

{% highlight js linenos %}
function pass() {
  return { type: "success", value: "1" };
}
function fail() {
  return { type: "failure", message: "it failed!" };
}
{% endhighlight %}

In javascript, it is entirely the responsibility of the developer to adhere to this interface at all relevant points. This presents two problems:
1. There is no standardization of return types (javascript does not have a type system).
2. There is no guarantee that an exceptional condition will be dealt with at least once in a call stack.

Fortunately, we can handle both of these problems (respectively) in Kotlin with the use of:
1. `sealed class`.
2. `when` as an expression (Kotlin does not have pattern matching, but this is a close approximation).

Sealed classes in Kotlin let us mimick [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions). We want to implement something like an `Either` type as in various [functional programming languages](https://hackage.haskell.org/package/base-4.10.1.0/docs/Data-Either.html). This Either type can either have a value Left (Error/Failure) or a value Right (Success) (on a side-note: sealed classes are pretty useless if you want to mimick [union types](https://discuss.kotlinlang.org/t/union-types/77/36) but do not have ownership of all the types involved. Unfortunately, this means that it is not possible to use primitives like `Int` or `Long` directly with sealed classes without boxing them in a data class.) Here is how we can define the Either type:

{% highlight kotlin linenos %}
sealed class Either<out T> {
    data class Error(val message: String?, val e: Exception) : Either<Nothing>()
    data class Success<T>(val value: T) : Either<T>()
}
{% endhighlight %}

Any computation that has the potential of erroring out can return `Either` type instead. This makes sure that when the result of the computation is used in a `when` block (`when` does exhaustive smart cast checks only when used as an expression), the developer is forced to consider both the cases.

{% highlight kotlin linenos %}
fun doSomething(): String? {
    val result: Either<String> = echo("Hello World")
    return when(result) {
        is Either.Success -> result.value
        is Either.Error -> result.message
    }
}
{% endhighlight %}

In the above example, the `echo` function either returns an `Either.Success<String>` or an `Either.Error<Nothing>`. Depending upon the type of result, we can return an appropriate value from `doSomething`. We can also put any recovery mechanism here. The use `when` as an expression makes the compiler force us to consider all the possible values of `result`.

This much implementation is roughly equivalent to the javascript example above, but has the additional benefit of being type safe. The above example would outright suck for cases where there are multiple such _fail-able_ statements one after another, and even more so if those statements depend on each other. We can do better.

Let us make a special execution block named `attempt<T>`. `attempt` always returns an `Either<T>` value. `attempt` optionally takes a variable number of `Either<V>` values as an argument and checks whether any of them is of `Either.Error` type. If yes, it throws the exception back; if no, it calls the last argument to it, a lambda, with the given parameters. Multiple `attempt` blocks can be nested and finally we only need to handle the exception once in the end (and we are required by the compiler to handle it). Doing this with try/catch blocks would have required using an all encompassing try/catch block at the top level. Here is the code for the `attempt` block:

{% highlight kotlin linenos %}
fun <T> attempt(vararg args: Either<Any>, body: (args: List<Any>) -> Either<T>): Either<T> {
    args.filterIsInstance<Either.Error>().forEach { throw it.e }
    return try {
        body(args.filterIsInstance<Either.Success<Any>>().map { it.value }) as Either.Success
    } catch (e: Exception) {
        Either.Error(e.message, e)
    }
}
{% endhighlight %}

Now this block can be used like this:

{% highlight kotlin linenos %}
object Test {
    private fun echo(name: String): Either<String> {
        if (name == "ashish2") throw Exception("name: ashish2 is not allowed here")
        return Either.Success(name)
    }

    private fun getRandomInteger(): Either<Int> {
        return Either.Success((Math.random() * 1000).toInt())
    }

    private fun execute(): String? {
        val result = attempt {
            val helloAshish = attempt { echo("ashish") }
            val randomInt = attempt { getRandomInteger() }
            val helloCombined = attempt(helloAshish, randomInt) {
                echo((it[0] as String) + (it[1] as Int).toString())
            }
            helloCombined
        }
        return when (result) {
            is Either.Success -> result.value
            is Either.Error -> result.message
        }
    }

    @JvmStatic
    fun main(args: Array<String>) {
        println(execute())
    }
}
{% endhighlight %}

Notice the use of nested `attempt` calls in `execute`. If any of those calls raise an exception, the value returned from that call becomes `Either.Error(message: String?, e: Exception)`. It depends on the outer block to handle it appropriately. We are required to handle it at least once in the `when` block in line 20. In case the value of a computation depends on whether the preceding computations were successful or not, `attempt` takes those previous results and forwards the success values to its code block as a list (line 16) if all of those are not `Either.Error`. If any of them is an `Either.Error`, `attempt` assigns the same exception to `helloCombined`, which becomes `Either.Error` itself. Finally, `helloCombined` is returned as the final result, and then is handled appropriately in line 20.

Also notice that we do not need to specify `Either<T>` as the type for `attempt` calls. Kotlin is smart enough to guess that from the return type of the lambda.

The above code produces the following output:

```
ashish279
```

If we change the line 13 to `val helloAshish = attempt { echo("ashish2") }`, we raise an exception in line 3, and the final output becomes:

```
name: ashish2 is not allowed here
```

I have not yet used this pattern in actual code yet, but most certainly will do.
