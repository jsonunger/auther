'use strict';

app.controller('UserListCtrl', function ($scope, users, User, AuthFactory) {
	$scope.users = users;
	$scope.addUser = function () {
		$scope.userAdd.save()
		.then(function (user) {
			$scope.userAdd = new User();
			$scope.users.unshift(user);
		});
	};
	
	$scope.userSearch = new User();

	$scope.userAdd = new User();

	$scope.permissions = function () {
		var user = AuthFactory.getUser();
		if (!user) return false;
		if (user.isAdmin) return 'admin';
		else return 'user';
	};
});