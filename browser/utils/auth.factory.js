'use strict';

app.factory('AuthFactory', function ($http, $state) {
  var AuthFactory = {};

  var currentUser = null;

  function setUser (user) {
    currentUser = user;
  }

  function getData (res) {
    return res.data;
  }

  AuthFactory.setUser = setUser;

  AuthFactory.login = function (user) {
    return $http.post('/login', user)
    .then(getData)
    .then(function (returnedUser) {
      if (returnedUser) {
        return returnedUser;
      } else {
        return $http.post('/api/users', user)
        .then(getData);
      }
    })
    .then(function (returnedUser) {
      setUser(returnedUser);
      $state.go('home');
    })
    .catch(function (err) {
      alert(err.statusText);
    });
  };

  AuthFactory.getUser = function () {
    return currentUser;
  };

  AuthFactory.logout = function () {
    return $http.post('/logout')
    .then(function () {
      setUser(null);
      $state.go('home');
    })
    .catch(function (err) {
      alert(err.statusText);
    });
  };

  AuthFactory.runUser = function () {
    return $http.get('/auth/me')
    .then(getData);
  };

  AuthFactory.permissions = function () {
    var user = AuthFactory.getUser();
    if (!user) return false;
    else return user;
  };

  return AuthFactory;
});