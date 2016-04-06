'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: '/browser/app/signup/signup.html',
    controller: function ($scope, AuthFactory) {
      $scope.submit = function () {
        AuthFactory.signup($scope.user);
      };
    }
	});
});