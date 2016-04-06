'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
  $urlRouterProvider.when('/auth/:provider', function () {
    window.location.reload();
  });
  $urlRouterProvider.otherwise('/');
});

app.run(function ($http, AuthFactory) {
  AuthFactory.runUser()
  .then(function (user) {
    if (!user) AuthFactory.setUser(null);
    else AuthFactory.setUser(user);
  });
});