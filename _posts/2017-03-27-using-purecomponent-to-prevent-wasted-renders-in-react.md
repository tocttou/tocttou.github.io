---
published: true
---
The [shouldComponentUpdate](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) lifecycle event in React components provides a way to have more granular control over when a component should re-render as a result of an internal state update, or as dictated by the parent. Earlier this could be done by comparing `nextProps` with the current `props` using the now deprecated [ShallowCompare addon](https://facebook.github.io/react/docs/shallow-compare.html). React now has support for [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) to achieve the same thing.

Lets say you have a child component that simply displays a `text` prop passed to it:

```js
import React, { Component } from 'react';

export default class FirstChild extends Component {  
  render() {
    return (
      <div>
        {this.props.text}
      </div>
    );
  }
}
```

And you have another child component that displays another `text` prop passed to it and logs "Rendering" to the console for each render cycle pass:

```js
import React, { Component } from 'react';

export default class SecondChild extends Component {  
  render() {
    console.log("Rendering!");
    return (
      <div>
        {this.props.text}
      </div>
    );
  }
}
```

The common parent to these children updates a state `text` every 1 second and passes it as a prop to the first child:

```js
import React, { Component } from 'react';
import FirstChild from './FirstChild';
import SecondChild from './SecondChild';

export default class Parent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: Math.random()
    };
  }
  
  componentDidMount() {
    setInterval(() => this.setState({ text: Math.random() }), 1000);
  }
  
  render() {
    return (
      <div>
        <FirstChild
          text={this.state.text}
        />  
        <SecondChild
          text="some random data"
        />
      </div>
    );
  }
}
```

This periodic state update in turn causes re-renders for both the child components. **Ideally**, second child should not be affected by the parent state update at all, since the prop passed remains the same. Console log by running this code:

```
Rendering!
Rendering!
Rendering!
...
```
<br />

This could be solved by using a `PureComponent` to implement the second child:

```js
import React, { PureComponent } from 'react';

export default class SecondChild extends PureComponent {  
  render() {
    console.log("Rendering!");
    return (
      <div>
        {this.props.text}
      </div>
    );
  }
}
```

Console log with modified code:

```
Rendering!
```
<br />

Working example for this can be found [here](https://www.webpackbin.com/bins/-KgDvo4EG5QTmFinbUlL).

`PureComponent` does a shallow check on `this.props` and `nextProps` automatically to determine if it should update. Note that if the passed prop changes deeply, `PureComponent` will not be able to catch it. In that case you should do a deep equality check (maybe use underscorejs for it):

```
shouldComponentUpdate(nextProps, nextState) {
  return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
}
```
<br />

Or you could use ImmutableJS too.
