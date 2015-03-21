Implicit (Client-Side) OAuth2 AngularJS (seed-style)
====================================

An example for using the Implicit Grant OAuth2 strategy (Facebook Connect)
with LDS Connect and AngularJS
(in the style of [angular-seed](https://github.com/angular/angular-seed))

Implicit Grant (`response_type=token`) is the correct solution for

  * Browser Apps
  * Mobile Apps with WebView
  * Desktop Clients with WebView
  * Non-secure Environments
  
The key difference with this style of OAuth2 and the better known server-side strategy
is that it **DOES NOT use the app sercet key**.

It's the perfect match for situations where you can't include your app's private key
because users have the ability to view the source or bytecode of your app.

It's also great for situations where, as a provider, you're fine with the user's data
passing to the user's browser through an app, but your privacy policy dictates that the
user's data should never touch an app's server (and you trust app developers to abide
by the privacy policy).

This is a template for gracefully handling the browser component of **client-side** OAuth2.

An https secured server is included for convenience, but only the static file-serving feature
is used.

Angular Service for LDS Connect
-----------------

~~There are already some pre-built convenience functions for using LDS Connect with AngularJS.~~

~~See <https://github.com/LDSorg/lds-connect-angular>~~ (**not yet updated for LDS Connect v2**).

Screencast
=========

~~See <https://youtu.be/3lnSjV8m1Jg>~~ (**not yet updated for LDS Connect v2**).

Zero-Config Install and Run
================

You can start working with test user data immediately.

1. Clone Backend
----------------

If you haven't already, clone a backend first

```bash
git clone git@github.com:LDSorg/passport-lds-connect-example.git

pushd passport-lds-connect-example

npm install
```

2. Clone Frontend
-----------------

You need to clone the frontend 

See [github.com/ldsorg](https://github.com/ldsorg?query=frontend-) for a list of frontends examples / seed projects.

```bash
# The AngularJS angular-seed Example
git clone https://github.com/LDSorg/frontend-oauth2-browser-angular-seed-example.git public

npm install -g bower

pushd public
bower install
popd
```

3. Run Server
-------------

```bash
node ./serve.js
```

4. Go to <https://local.ldsconnect.org:8043>
----------

**This domain points to YOUR computer**.

**DO NOT USE 127.0.0.1 or localhost**.

<https://local.ldsconnect.org:8043> uses a valid SSL certificate for
HTTPS and points to 127.0.0.1.

Even in development you should never be using insecure connections.
Welcome to 2015. [Get used to it](https://letsencrypt.org)!

The development test keys are already installed. Once you've fired up the server navigate to <https://local.ldsconnect.org:8043>.

**Note**:
It's important that you use `local.ldsconnect.org` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.

5. Login ~~as dumbledore~~ with your lds account
-----------

NOTE: the lds.io beta (lds connect v2) requires the use of an actual user account at this time.

~~You **cannot** login as a real lds.org user as a test application.
If you try, you will get an error.~~

~~The login you must use for test applications is `dumbledore` with the passphrase `secret`.~~

API
===

* Login Success / Failure Callback
* Open a Window
* Test the Bearer (Access) Token
* oauth2-close.html

NOTE: LDS Connect v2 is staged at https://lds.io, but it will be release on https://ldsconnect.org

Login Success / Failure Callback
--------------

The browser is going to receive the token directly. In order to simplify

```
window.completeLogin = function (name, url) {
  var match;
  var token;

  if (!/access_token=/.test(url)) {
    window.alert("looks like the login failed");
    return;
  }

  match = url.match(/(^|\#|\?|\&)access_token=([^\&]+)(\&|$)/);
  if (!match || !match[2]) {
    window.alert("could not parse token!");
    return;
  }

  token = match[2];

  testAccessToken(token);
};
```

Invoke the Login Dialog
-----------------------

```
var myAppDomain = 'https://local.ldsconnect.org:8043';
var myAppId = 'TEST_ID_9e78b54c44a8746a5727c972';
var requestedScope = 'me';

var url = 'https://lds.io/oauth/dialog/authorize'
  + '?response_type=token'
  // WARNING: never provide a client_secret in a browser, mobile app, or desktop app
  + '&client_id=' + myAppId
  + '&redirect_uri=' + myAppDomain + '/oauth-close.html?type=/auth/ldsconnect/callback/'
  + '&scope=' + encodeURIComponent(requestedScope)
  + '&state=' + Math.random().toString().replace(/^0./, '')
  ;

window.open(url, 'ldsconnectLogin', 'height=720,width=620');
```

**IMPORTANT:** All scopes are optional. The user may choose to deny any, or all
of the scopes you request.

TODO: I need to pass back a `granted_scope=` parameter in the url...

Test the Token
--------------

```javascript
function testAccessToken(token) {
  // TODO get account list
  return $http.get("https://lds.io/api/ldsconnect/"
    + 'undefined' // intentionally left as 'undefined'
    + "/me", {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(function (resp) {
    console.info('testAccessToken response');
    console.log(resp);

    if (!resp.data) {
      window.alert("failed to retrieve data");
      return;
    }

    window.alert("check the console to see the data");
    console.log(resp.data);
    return resp.data;
  });
}
```

oauth2-close.html
-------

This file is used to handle a seemless login without taking the user
out of their flow.

It has a teeny bitsy bit of JavaScript to make sure that the login
will work across browsers, mobile devices, and webviews, in a variety
of OAuth2 strategies.

FIY: Server-Side vs Client-Only OAuth2
==============

Just an FYI for the curious...

Bottom Line: client-only oauth2 is convenient and seamless,
but can't be secured from spoofing by malicious clients
(hacked android apks, rooted iphones, non-standard browsers like curl, mechanize, phantom).

With server-side oauth2, you must provide your App ID and App Secret.
In client-only (browser, android, etc) oauth2, you only provide your App ID
and use some other means of authenticating - such as a username and password
or restricted access to a single TLS/SSL secured HTTPS domain.

With server-side oauth2 you generally get a token that lasts longer
(days instead of hours) and you may be able to request certain scopes
that are not allowed to be requested by client-only oauth2 strategies.
