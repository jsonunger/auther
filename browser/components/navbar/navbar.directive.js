'use strict';

app.directive('navbar', function ($state, $location, $http, AuthFactory) {
	return {
		restrict: 'E',
		templateUrl: '/browser/components/navbar/navbar.html',
		link: function (scope) {
			scope.pathStartsWithStatePath = function (state) {
				var partial = $state.href(state);
				var path = $location.path();
				return path.startsWith(partial);
			};
			scope.email = function () {
				var user = AuthFactory.getUser();
				if (!user) return 'login';
				else return user.email;
			};

			scope.logout = function () {
				return AuthFactory.logout();
			};
		}
	};
});