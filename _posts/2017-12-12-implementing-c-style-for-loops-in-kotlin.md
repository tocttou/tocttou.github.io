---
title: Implementing C-Style For-Loops In Kotlin
published: true
---
Kotlin does not have [C-style for-loops](http://wiki.bash-hackers.org/syntax/ccmd/c_for). This is fine because I prefer using the idiomatic for-loops (built to use iterators) anyway. But there is a big problem: Kotlin does not allow dynamic limiting conditions in its for-loops ([See this thread](https://discuss.kotlinlang.org/t/for-loop-with-dynamic-condition/57)). This can sometimes get very annoying. To achieve the same functionality, we have to use a while loop.

Kotlin has two features that I love the most (among many many others):
1. in case a lambda expression has a single parameter, kotlin puts its value in a special variable `it` (unless otherwise specified).
2. if the last parameter of a function is a lambda, that lambda can be put outside the function call.

These two features (along with operator overloading, infix functions, and extension functions) make Kotlin great for writing DSL. We can make a simple polyfill for C-style for-loops like this:

{% highlight kotlin linenos %}
package utils

inline fun oldFor(
    initialSetter: () -> Int,
    limitingCondition: (Int) -> Boolean,
    updater: (Int) -> Int,
    codeBlock: (Int) -> Unit) {
    var i = initialSetter()
    while (limitingCondition(i)) {
        codeBlock(i)
        i = updater(i)
    }
}
{% endhighlight %}

Which can be driven like this:

{% highlight kotlin linenos %}
package main

import utils.oldFor

fun main(args: Array<String>) {
    var n = 12
    oldFor({ 0 }, { it < n }, { it + 1 }) {
        println(it)
        n /= 2
    }
}
{% endhighlight %}

Which prints out:

```
0
1
2
```
Notice how we use the special variable `it` to make `oldFor` terse. We specify the code block as a lambda expression outside the `oldFor` call, giving the impression that `oldFor` is an in-built language construct. Also notice that we can use dynamic limiting condition with `oldFor` (`n` gets updated on each pass).
