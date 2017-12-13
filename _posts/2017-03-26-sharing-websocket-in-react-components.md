---
published: true
---
Often times there is a requirement to share a common websocket connection between React components. I have been using the [React Context API](https://facebook.github.io/react/docs/context.html) to do that. Example for socket.io:

In this case there is a top level component file `App.js` where the socket is initialized and then made available to other React Components like `HomePageComponent.js` (which are its children) using Context.

{% highlight js linenos %}
import React, { Component, PropTypes } from "react";
import io from "socket.io-client";

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      message: null
    };
    this.socket = io("https://localhost:3001");
  }

  getChildContext() {
    return {
      socket: this.socket
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

App.childContextTypes = {
  socket: PropTypes.object.isRequired
};

export default App;
{% endhighlight %}

A common pattern while using Context is to write a `Provider` for the children. In that case, after initializing the websocket in `App.js`, any other component(s) can be provided access to the websocket via its props by wrapping it in the provider like this:

{% highlight js linenos %}
render() {
  return (
    <SocketProvider>
      <MyComponent1 />
      <MyComponent2 />
    </SocketProvider> 
  );
}
{% endhighlight %}

Here the `SocketProvider` is:

{% highlight js linenos %}
import React, { Component, PropTypes } from "react";

class SocketProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.socket = context.socket;
  }

  render() {
    return (
      <span>
        {React.cloneElement(this.props.children, {
          ...this.props,
          ...{ socket: this.socket }
        })}
      </span>
    );
  }
}

SocketProvider.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default SocketProvider;
{% endhighlight %}

and is accessible in `MyComponent1` and `MyComponent2` as `this.props.socket`. Note that this `SocketProvider` only provides the websocket one level deep - children of `MyComponent1` do not get to use the websocket unless they are wrapped in `SocketProvider` themsevles. Also note that `{...this.props, { socket: this.socket }}` is a shallow merge.
