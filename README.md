OAuth2 AngularJS (seed-style)
=============

An example for using OAuth2 (Facebook Connect)
with LDS Connect and AngularJS
(in the style of [angular-seed](https://github.com/angular/angular-seed))

This is a template for gracefully handling the browser component of **server-side** OAuth2.

Although it does rely on a server, you can remove the server redirects so that you
provide your users with a seamless experience that doesn't disrupt their flow in
your application.

Angular Service for LDS Connect
-----------------

There are already some pre-built convenience functions for using LDS Connect with AngularJS.

See <https://github.com/LDSorg/lds-connect-angular>.

Screencast
=========

See <https://youtu.be/3lnSjV8m1Jg>.

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

See [github.com/ldsorg](https://github.com/ldsorg?query=oauth2-) for a list of frontends examples / seed projects.

```bash
# The AngularJS angular-seed Example
git clone git@github.com:LDSorg/oauth2-angular-seed public

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

5. Login as dumbledore
-----------

You **cannot** login as a real lds.org user as a test application.
If you try, you will get an error.

The login you must use for test applications is `dumbledore` with the passphrase `secret`.

Create a Backend in your Favorite Language
=====

1. Create a backend in the language of your choice
2. Follow the API outlined below
3. Clone this project as your public folder
4. Run your server, serving the public folder staticly

And remember:

```bash
bower install
```

API
===

For this example you must create a server that implements the following endpoints:

(replace `facebook` with `ldsconnect` for lds connect)

/auth/facebook (/auth/ldsconnect)
--------------

This will set some options and redirect to

  * (facebook) https://www.facebook.com/dialog/oauth
  * (ldsconnect) https://ldsconnect.org/dialog/authorize

/auth/facebook/callback
-----------------------

This is the endpoint to which facebook (or lds connect) will respond with your
grant code (`https://example.com/auth/facebook/callback?code=xxxxxxxxxxxx`).

Old school style would be to set this endpoint as any arbitrary string and your server
would redirect to (hopefully) the page that your user was on with everything retemplated.

However, to make for a seamless user experience, you will instead send the contents
of `oauth-close.html` as the response (DO NOT REDIRECT) and jQuery will grab the
session info based on the success or failure indicated in the url
(i.e. it may be
`https://example.com/auth/facebook/callback?error=NOT_AUTHORIZED`
instead of having a code).

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
