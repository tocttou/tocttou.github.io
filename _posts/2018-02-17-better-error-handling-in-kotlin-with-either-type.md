---
title: Better Error Handling In Kotlin With Either Type
published: true
---

Here is a nice experiment (borrowed from FP languages). Define the Either type:

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

Let us make a special execution block named `attempt<T>`. `attempt` always returns an `Either<T>` value. `attempt` optionally takes a variable number of `Either<V>` values as an argument and checks whether any of them is of `Either.Error` type. If yes, it throws the exception back; if no, it calls the last argument to it, a lambda, with the given parameters. Multiple `attempt` blocks can be nested and finally we only need to handle the exception once in the end (and we are required by the compiler to handle it). Doing this with try/catch blocks would have required using an all encompassing try/catch block at the top level. Here is the code for the `attempt` block:

{% highlight kotlin linenos %}
inline fun <T> attempt(vararg args: Either<Any>, body: (args: List<Any>) -> Either<T>): Either<T> {
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
