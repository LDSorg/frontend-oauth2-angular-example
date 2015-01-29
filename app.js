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

  MNC.login = function (name) {
    $window.completeLogin = function (name, url) {
      $window.completeLogin = null;

      // login was probably successful if it had a code
      if (/code=/.test(url)) {
        testLogin();
      }
      else {
        $window.alert("looks like the login failed");
      }
    };
    $window.open('/auth/' + name);
  };
}]);
