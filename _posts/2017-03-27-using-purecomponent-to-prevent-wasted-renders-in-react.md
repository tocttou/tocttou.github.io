---
published: true
---
The [shouldComponentUpdate](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) lifecycle event in React components provides a way to have more granular control over when a component should re-render as a result of an internal state update, or as dictated by the parent. Earlier this could be done by comparing `nextProps` with the current `props` using the now deprecated [ShallowCompare addon](https://facebook.github.io/react/docs/shallow-compare.html). React now has support for [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) to achieve the same thing.

Often times there is a need in the parent to maintain a state and give its control to a child component. This state, along with a function to update it is passed into the child as props. I have used this pattern innumerable times in my own code and it is also mentioned in the [Thinking In React](https://facebook.github.io/react/docs/thinking-in-react.html#step-5-add-inverse-data-flow) docs. Calling this function in the child updates the state of the parent which in turn causes a re-render of the child, and other children too - some of which might not have any use for the newly updated state. This just causes wasted renders and could be avoided by using `PureComponent` by default.

Lets say you have a child component that simply displays a `text` prop passed to it:

<script src="https://gist.github.com/tocttou/65b78208a168a7f54aa2d888d70e3514.js"></script>

And you have another child component that displays another `text` prop passed to it and logs "Rendering" to the console for each render cycle pass:

<script src="https://gist.github.com/tocttou/42954e96f3eceec28a0b207927baabdd.js"></script>

The common parent to these children updates a state `text` every 1 second and passes it as a prop to the first child:

<script src="https://gist.github.com/tocttou/447eed019c83a5be8793ac9d04117488.js"></script>

This periodic state update in turn causes re-renders for both the child components. But it is clear that the second child should not be affected by the parent state update at all, since the prop passed remains the same. Console log by running this code:

```
Rendering!
Rendering!
Rendering!
...
```


This could be solved by using a `PureComponent` to implement the second child:

<script src="https://gist.github.com/tocttou/d283b67dc8d66704c3c737411e364557.js"></script>

Console log with modified code:

```
Rendering!
```


Working example for this can be found [here](https://www.webpackbin.com/bins/-KgDvo4EG5QTmFinbUlL).

`PureComponent` does a shallow check on `this.props` and `nextProps` automatically to determine if it should update. Note that if the passed prop changes deeply, `PureComponent` will not be able to catch it. In that case you should do a deep equality check (maybe use underscorejs for it):

```
shouldComponentUpdate(nextProps, nextState) {
  return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
}
```


Or you could use ImmutableJS too.
