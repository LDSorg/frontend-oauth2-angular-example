'use strict';

angular.module('myApp.directory', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/directory', {
    templateUrl: 'views/directory/directory.html',
    controller: 'DirectoryCtrl as MDC'
  });
}])

.controller('DirectoryCtrl', [ 'MyAppSession', function(MyAppSession) {
  var MDC = this
    ;
}]);
