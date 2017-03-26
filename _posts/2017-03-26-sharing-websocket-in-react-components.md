---
published: true
---
Often times there is a requirement to share a common websocket connection between React components. I have been using the [React Context API](https://facebook.github.io/react/docs/context.html) to do that. Example for socket.io:

In this case there is a top level component file `App.js` where the socket is initialized and then made available to other React Components like `HomePageComponent.js` (which are its children) using Context.

<script src="https://gist.github.com/tocttou/7a8b324146e206c7e6fb16638afff9b0.js"></script>

A common pattern while using Context is to write a `Provider` for the children. In that case, after initializing the websocket in `App.js`, any other component(s) can be provided access to the websocket via its props by wrapping it in the provider like this:

```
render() {
  return (
    <SocketProvider>
      <MyComponent1 />
      <MyComponent2 />
    </SocketProvider> 
  );
}
```

Here the `SocketProvider` is:

<script src="https://gist.github.com/tocttou/66a7fc0e1a3a02bd3b18f5a702f820d9.js"></script>

and is accessible in `MyComponent1` and `MyComponent2` as `this.props.socket`. Note that this `SocketProvider` only provides the websocket one level deep - children of `MyComponent1` do not get to use the websocket unless they are wrapped in `SocketProvider` themsevles. This is because `React.cloneElement(this.props.children, {...this.props, ...{ socket: this.socket }})` is a shallow copy.
