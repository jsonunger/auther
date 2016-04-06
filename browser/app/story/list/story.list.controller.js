'use strict';

app.controller('StoryListCtrl', function ($scope, stories, Story, users, AuthFactory) {
	$scope.stories = stories;
	$scope.users = users;

	$scope.newStory = new Story();
	
	$scope.removeStory = function (story) {
		story.destroy()
		.then(function () {
			var idx = $scope.stories.indexOf(story);
			$scope.stories.splice(idx, 1);
		});
	};

	$scope.user = AuthFactory.getUser();
	$scope.permissions = AuthFactory.permissions;

	$scope.addStory = function () {
		$scope.newStory.author = $scope.newStory.author || $scope.user;
		console.log(1,$scope.newStory);
		$scope.newStory.save()
		.then(function (created) {
			console.log(2,created);
			created.author = $scope.newStory.author;
			$scope.newStory = new Story();
			$scope.stories.unshift(created);
		});
	};
});