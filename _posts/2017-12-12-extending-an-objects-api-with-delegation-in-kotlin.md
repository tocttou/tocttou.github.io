---
title: Extending An Object's API With Delegation In Kotlin
published: true
---

**Task**: Expose extra API methods for an object.

**Methods**:
1. Derive a new class from the class of that object, implement the extra functionality, make a new object from that new class.

	This method is suitable in cases where the new class has an "is-a" relationship with the actual class. In case you do not have access to the code that controls the actual class, you cannot be sure that it is not `final`. In that case you cannot use this method.

2. Define a new class that implements the interface of the original class and delegate the object to this new class. This enables us to "copy" all the functionality from the delegated object, saving us from implementing the methods in its interface on our own.

3. Use [Extension Functions](https://kotlinlang.org/docs/reference/extensions.html#extension-functions). This is the best method in case you do not need to store any state for the added methods.

Let us take a look at an example. We want to implement a `FrequencyMap<K, Int>` built upon the `MutableMap<K, V>` interface. This frequency map exposes new methods `add(element: K, freq: Int)`, to add a new element with a frequency or increment the frequency of that element by an amount `freq` if the element already exists, `add(vararg pairs: Pair<K, Int>)` to do the same thing using multiple pairs of element and their frequencies, and `remove(element: K, freq: Int)` to reduce the frequency of an element by 
an amount `freq` or remove it if the frequency goes below 1.

We cannot use the first method directly because the `MutableMap<K, V>` interface does not have any default methods (forcing us to implement all the methods in it). The `mutableMapOf<K, V>` method returns a `java.util.LinkedHashMap<K, V>` type of object. This means that to use the first method, we need to derive from the `java.util.LinkedHashMap<K, V>` class.

Let us use the second method to implement the `FrequencyMap`. We implement it as:
<script src="https://gist.github.com/tocttou/a11a6397b153911d39cf4230d7ffabeb.js"></script>

Here our class implements the `MutableMap<K, V>` interface and takes another object `b` as an instantiation variable that has implemented that interface and use its methods to avoid having to implement methods of `MutableMap<K, V>` on our own. This delegation happens using the `by` keyword in Kotlin. We can then add extra methods to work on that object. We drive the above code in these two ways:
<script src="https://gist.github.com/tocttou/5c3864c2f956c768fe8b190efb3d8e67.js"></script>

Which prints out:

```
FrequencyMap generated from MutableMap
1=5
Using methods of FrequencyMap directly on MutableMap
3=4
```
<br />
The type of `freqMapOne` is `FrequencyMap<Int, Int>` while the type of `mutableMapTwo` remains `MutableMap<Int, Int>`. The second way is preferable because two `FrequencyMap<K, V>` objects cannot be compared using the `equals` method inherited from the `MutableMap<Int, Int>` object. If we use the first way, we have to implement an equals method on our own that compares by value, not by reference. In the second way, the type of object remains the same, allowing us to use its `equals`.

Delegation can be used to implement multiple inheritance too! For example, if our `FrequencyMap` is a weird combination of a `MutableMap` and a `Map`, we can implement it as:
<script src="https://gist.github.com/tocttou/cae45b5009c8089ec3d4d5abff1fb343.js"></script>

But now we need to implement all the conflicting methods (present in both `MutableMap` and `Map`) in `FrequencyMap` to avoid conflicts. Also note that only interfaces can be delegated to, so you cannot use this syntax to combine methods from `MutableMap` interface and the `String` class. In that case, it is better to use [extension functions](https://kotlinlang.org/docs/reference/extensions.html#extension-functions). 

**Delegation is nothing but a form of composition.**
