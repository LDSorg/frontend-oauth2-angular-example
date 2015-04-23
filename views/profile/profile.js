'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'views/profile/profile.html',
    controller: 'ProfileController as MP'
  });
}])

.controller('ProfileController', [
  '$scope'
, 'LdsApiSession'
, 'LdsApiRequest'
, function($scope, LdsApiSession, LdsApiRequest) {
  var MP = this;

  function onLogin(/*session*/) {
    // Get the default account
    //
    // Note: the session module can handle multiple accounts
    // but most 3rd party apps will only use the default
    var account = LdsApiSession.selectAccount();

    // Requests can be made without an account scope like so
    // LdsApiRequest.profile(account)

    // Or scoped to a specific account, like so:
    var api = LdsApiRequest.create(account);
    api.me().then(function (me) {
      MP.me = me;
      if (me.photos && me.photos.length) {
        MP.headshot = api.photoUrl(me.photos[0]);
      }
    });
  }

  function onLogout() {
    MP.me = null;
  }

  // Note that checkSession cannot be called until init has completed
  // (hence we put it in the run stage)
  LdsApiSession.checkSession().then(onLogin, onLogout);

  LdsApiSession.onLogin($scope, onLogin);
  LdsApiSession.onLogout($scope, onLogout);
}]);
