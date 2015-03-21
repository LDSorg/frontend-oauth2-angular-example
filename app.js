'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'myApp.profile',
  'myApp.directory',
  'myApp.session'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/profile' });
}]);

angular.module('myApp').controller('MyNavCtrl', [
    '$scope'
  , '$timeout'
  , '$window'
  , '$http'
  , 'MyAppSession'
  , function ($scope, $timeout, $window, $http, MyAppSession) {
  var MNC = this
    ;

  MNC.session = MyAppSession.session;

  // I wrote my own modal code instead of including angular-ui-bootstrap
  // If I were to do this all proper-like, it would go in a directive
  // (or I'd just use angular-bootstrap)
  MNC.openLogin = function () {
    if (!MNC.show) {
      MNC.show = true; //!MNC.show;
      $timeout(function () {
        MNC.showAnimate = !MNC.showAnimate;
      });
    }
    else {
      MNC.showAnimate = !MNC.showAnimate;
      // TODO how to listen for animation end?
      $timeout(function () {
        MNC.show = false; //!MNC.show;
      }, 150);
    }
  };
  MNC.closeLogin = MNC.openLogin;

  function testLogin() {
    $http.get('/account.json').then(function (resp) {
      var data = resp.data;

      if (!data || !data.user) {
        return;
      }

      MNC.closeLogin();
      MNC.session.user = resp.data.user;
      if (MNC.session.user.photos && MNC.session.user.photos.length) {
        MNC.session.headshot = MNC.session.user.photos[0].value;
      }
    });
  }

  function testAccess(token) {
    // TODO get account list
    $http.get("https://lds.io/api/ldsconnect/"
      + 'undefined'
      + "/me", {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(function (resp) {
      console.info('testAccess response');
      console.log(resp);

      if (!resp.data) {
        return;
      }

      MNC.closeLogin();
      MNC.session.user = resp.data;
      if (MNC.session.user.photos && MNC.session.user.photos.length) {
        MNC.session.headshot = MNC.session.user.photos[0].value;
      }
    });
  }

  MNC.login = function (/*name*/) {
    $window.completeLogin = function (name, url) {
      $window.completeLogin = null;
      var match;
      var token;

      // login was probably successful if it had a code
      if (/code=/.test(url)) {
        testLogin();
      }
      else if (/access_token=/.test(url)) {
        match = url.match(/(^|\#|\?|\&)access_token=([^\&]+)(\&|$)/);
        if (!match || !match[2]) {
          throw new Error("couldn't find token!");
        }

        token = match[2];
        testAccess(token);
      }
      else {
        $window.alert("looks like the login failed");
      }
    };

    // This would be for server-side oauth2
    //$window.open('/auth/' + name);

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

    // This is for client-side oauth2
    $window.open(url, 'ldsconnectLogin', 'height=720,width=620');
  };
}]);
