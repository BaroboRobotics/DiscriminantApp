var app = angular.module('DiscriminantApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		controller: 'setupController',
		templateUrl: 'views/setup.html'
	})
	.otherwise({ redirectTo: '/'});

}]);


app.controller('setupController', ['$scope',
	function($scope) {

	}

]);

app.directive('robotManager', function() {
	return {
		restrict: 'E',
		link: function(scope, elem) {
			return elem.replaceWith(Linkbots.managerElement());
		}
	}
});
