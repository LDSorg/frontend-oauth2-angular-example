'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'oauth3',
  'lds.io',
  'myApp.version',
  'myApp.profile',
  'myApp.directory',
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({ redirectTo: '/profile' });

}]).run(['$rootScope', 'LdsApi', 'LdsApi', function($rootScope, LdsApi) {

  // This should happen in the config step, before other modules are run
  return LdsApi.init({
    appId: 'TEST_ID_9e78b54c44a8746a5727c972'
  }).then(function () {
    console.log("Now ready to accept login click events");
    $rootScope.R = { ready: true };
  }, function (err) {
    console.error('Error initializing LdsApi');
    console.error(err);
  });

}]);

angular.module('myApp').controller('MyNavCtrl', [
    '$rootScope'
  , '$scope'
  , '$timeout'
  , '$window'
  , 'Oauth3'
  , 'LdsApiSession'
  , 'LdsApiRequest'
  , 'LdsApi'
  , function ($rootScope, $scope, $timeout, $window, Oauth3, LdsApiSession, LdsApiRequest, LdsApi) {
  var MNC = this;

  // I wrote my own modal code instead of including angular-ui-bootstrap
  // If I were to do this all proper-like, it would go in a directive
  // (or I'd just use angular-bootstrap)
  MNC.toggleLogin = function () {
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
  MNC.closeLogin = MNC.openLogin = MNC.toggleLogin;

  MNC.oauth3Login = function (providerUri, opts) {
    opts = opts || {};
    // TODO in the future the discovery process will happen in oauth3.html
    // so that we can discover a provider without losing the click event
    // (which would thus prevent a popup). Also, we'll allow (click-jack proof) iframe access
    // Oauth3.discover("https://facebook.com");
    var fbDirectives = {
      "authorization_dialog": {
        "method": "GET"
      , "url": "https://www.facebook.com/dialog/oauth"
      }
    , "access_token": {
        "method": "POST"
      , "url": "https://graph.facebook.com/oauth/access_token"
      }
    , "profile": {
        "method": "GET"
      , "url": "https://graph.facebook.com/me"
      }
    , "authn_scope": ""
    };

    Oauth3.login(
      'https://facebook.com'
    , { appId: '1592518370979179', directives: fbDirectives, authorizationRedirect: opts.authorizationRedirect }
    ).then(function () {
      MNC.closeLogin();
      window.alert("facebook login succeeded");
    }, function () {
      window.alert("facebook login failed");
    });
  };

  // This must be called from a click
  MNC.ldsLogin = function (opts) {
    opts = opts || {};
    LdsApiSession.login({
      popup: true
    , authorizationRedirect: opts.authorizationRedirect
    , scope: 'directories'
    }).then(function () {
      MNC.closeLogin();
      console.log('should be handled by onLogin handler');
      // LdsApiSession.onLogin will fire
    }, function (err) {
      console.error(err);
      $window.alert('Implicit Grant Login Failed');
    });
  };

  function displayLogin(session) {
    console.log('session exists');
    // the session contains logins (tokens) and accounts (access)

    // Note: the session module can handle multiple accounts
    // but most 3rd party apps will only use the default
    MNC.session = session;
  }

  LdsApiSession.onLogin($scope, displayLogin);
}]);
