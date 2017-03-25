---
published: true
---
Some time back I was working on a project (webapp + android app) that uses [Postgrest](https://postgrest.com/en/v0.4/) as an API server. The project uses JWT authentication, which is supported out of the box by Postgrest. My project has the following requirements:

1. The webapp stores the JWT in a cookie instead of localstorage. This cookie is set with `HttpOnly` option to make it immune to XSS attacks (remember to take care of CSRF attacks while working with cookies!).

2. With the android app I am not concerned about the user's JWT getting stolen by XSS (no webview). I would like to use the standard Bearer authentication scheme here.

But setting the cookie as `HttpOnly` means that my legitimate javascript also cannot read the cookie and thus I cannot use the Bearer authentication scheme in the webapp, and Postgrest currently does not support JWT authentication using cookies. A simple solution here is to pass the API requests from the webapp through an Nginx reverse proxy that rewrites the token from the `Cookie` header to the `Authorization` header (for Bearer scheme) and relay it to the Postgrest backend.

I was able to achieve this by using the [lux-nginx-module](https://github.com/openresty/lua-nginx-module) (on a sidenote, I would recommend using [Openresty](https://github.com/openresty) directly for a lot of added goodness over Nginx).

If your Postgrest API server is on `http://localhost:3000` and your Nginx Proxy is on `http://localhost:3001`, you can use the following nginx proxy config and make request to your nginx proxy with a cookie `access_token` that contains the `jwt` (it rewrites the headers to include a `Authorization: Bearer <jwt>` header:

{% highlight nginx %}
server {
  listen  0.0.0.0:3001;

  location / {
     rewrite_by_lua_block {
       local cookie_value = ngx.req.get_headers()["Cookie"];
       if cookie_value ~= nil then
         local jwt = cookie_value:match("access_token=([^ ]+)");
         ngx.req.set_header("Authorization", "Bearer " .. jwt);
       end
       ngx.req.clear_header("Cookie");
     }
     proxy_pass http://0.0.0.0:3000;
  }
}
{% endhighlight %}
<br />

Actual request (to nginx proxy by the webapp):

{% highlight http %}
GET  HTTP/1.1
Host: localhost:3001
Cookie: access_token=mah.osum.token
{% endhighlight %}
<br />

Request relayed to Postgrest:

{% highlight http %}
GET  HTTP/1.1
Host: localhost:3000
Authorization: Bearer mah.osum.token
{% endhighlight %}
<br />

Note that the regex used to extract the `access_token` only works correctly when there is a single cookie. Modify the regex accordingly if you want to use multiple cookies.

Relevant issue on Github can be tracked at: [postgrest/issues/773](https://github.com/begriffs/postgrest/issues/773)
