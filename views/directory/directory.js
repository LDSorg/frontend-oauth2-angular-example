'use strict';

angular.module('myApp.directory', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/directory', {
    templateUrl: 'views/directory/directory.html',
    controller: 'DirectoryController as MDC'
  });
}])

.controller('DirectoryController', [
  '$scope'
, '$location'
, '$q'
, 'LdsApiSession'
, 'LdsApiRequest'
, function ($scope, $location, $q, LdsApiSession, LdsApiRequest) {
  var MDC = this;

  function onLogin(/*session*/) {
    // Get the default account
    //
    // Note: the session module can handle multiple accounts
    // but most 3rd party apps will only use the default
    var account = LdsApiSession.selectAccount();
    // This can be used on its own like so
    // LdsApiRequest.profile(account)
    var api = LdsApiRequest.create(account);
    api.me().then(function (me) {
      $q.all([
        api.ward(me.homeStakeAppScopedId, me.homeWardAppScopedId)
      , api.wardPhotos(me.homeStakeAppScopedId, me.homeWardAppScopedId)
      ]).then(function (things) {
        //var ward = things[0];
        var photos = things[1];

        console.log('photos');
        console.log(photos);

        photos.members.forEach(function (photo) {
          photo.url = api.photoUrl(photo);
        });

        MDC.ward = photos.members;
      });
    });
  }

  function onLogout() {
    MDC.wardPhotos = null;
  }

  // Note that checkSession cannot be called until init has completed
  // (hence we put it in the run stage)
  LdsApiSession.checkSession().then(onLogin, onLogout);

  LdsApiSession.onLogin($scope, onLogin);
  LdsApiSession.onLogout($scope, onLogout);
}]);
