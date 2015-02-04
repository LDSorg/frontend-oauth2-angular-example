'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'views/profile/profile.html',
    controller: 'ProfileCtrl as MP'
  });
}])

.controller('ProfileCtrl', [ 'MyAppSession', function(MyAppSession) {
  var MP = this
    ;

  // sharing session data between the service
  MP.session = MyAppSession.session;
}]);
