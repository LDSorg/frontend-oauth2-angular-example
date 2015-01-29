'use strict';

angular
  .module('myApp.session', [])
  .service('MyAppSession', [ '$http', function StSession($http) {
    var session = {}
      ;

    function get() {
      return $http.get('/account.json').then(function (resp) {
        var data = resp.data;

        if (!data || !data.user) {
          session.user = null;
          return null;
        }

        session.user = resp.data.user;

        if (session.user.photos && session.user.photos.length) {
          session.headshot = session.user.photos[0].value;
        }

        return session;
      });
    }

    get();

    return {
      get: get
    , session: session
    };
  }])
  ;
