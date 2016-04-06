'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: '/browser/app/login/login.html',
    controller: function ($scope, AuthFactory) {
      $scope.submit = function () {
        AuthFactory.login($scope.user);
      };
    }
	});
});