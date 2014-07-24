var app = angular.module('DiscriminantApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		controller: 'setupController',
		templateUrl: 'views/setup.html'
	}).when('/predict', {
		controller: 'predictController',
		templateUrl: 'views/predict.html'
	})
	.otherwise({ redirectTo: '/'});

}]);


app.controller('setupController', ['$scope', 'navigationFactory',
	function($scope, navigationFactory) {
		navigationFactory.setName('Setup');
		navigationFactory.setLink('/#');
	}
])
app.controller('predictController', ['$scope', 'navigationFactory',
	function($scope, navigationFactory) {
		navigationFactory.setName('Predict');
		navigationFactory.setLink('/#predict');
	}
]).controller('navigationController', ['$scope', 'navigationFactory',
	function($scope, navigationFactory) {
		var nav = {
			"name": navigationFactory.getName(),
			"link": navigationFactory.getLink()
		}
		$scope.navigation = nav;

		$scope.$watch(function() { return navigationFactory.getName(); },
			function (value) {
				if (value) {
					$scope.navigation.name = value;
				}
			}
		);
		$scope.$watch(function() { return navigationFactory.getLink(); },
			function (value) {
				if (value) {
					$scope.navigation.link = value;
				}
			}
		);
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

app.factory('navigationFactory', function() {
	var data = { name: 'Setup', link: '/#'};
	return {
		getName: function() {
			return data.name;
		},
		setName: function(newName) {
			data.name = newName;
		},
		getLink: function() {
			return data.link;
		},
		setLink: function(newLink) {
			data.link = newLink;
		}
	}
});
