var app = angular.module('DiscriminantApp', ['ngRoute', 'angular-flot']);

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


app.controller('setupController', ['$scope', 'navigationFactory', 'robotFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, $timeout) {
		$scope.model = {
			acquired: false
		};
		navigationFactory.setName('Setup');
		navigationFactory.setLink('/#');
		$scope.waitForRobot = function() {
			var x;
			x = Linkbots.acquire(1);
			if (x.robots.length === 1) {
				$scope.model.robotIndex = robotFactory.addRobot(x.robots[0]);
				$scope.setAcquired(true);
			} else {
				$timeout($scope.waitForRobot, 1000);
			}	
		}
		$scope.setAcquired = function(val) {
			$scope.model.acquired = val;
		}
		$scope.next = function(event) {
			if (event) event.preventDefault();
			if ($scope.model.acquired) {
				return true;
			}
			return false;
		}
		if (!robotFactory.getRobot(0)) {
			$timeout($scope.waitForRobot, 1000);
		} else {
			$scope.setAcquired(true);
		}
	}
])
app.controller('predictController', ['$scope', 'navigationFactory', 'robotFactory',
	function($scope, navigationFactory, robotFactory) {
		navigationFactory.setName('Predict');
		navigationFactory.setLink('/#predict');
		$scope.data = [];
		$scope.options = {};
			
		$scope.dataset = [{ data: [], yaxis: 1}];
			
		function calc(x) {
			y = (x * x) - (8 * x) + 7;
			return y;
		}
		for (var x = 0; x <= 8; x+= .25) {
			$scope.data.push([x, calc(x)]);
			$scope.dataset[0].data.push([x, calc(x)]);
		}
	}
]).controller('navigationController', ['$scope', 'navigationFactory',
	function($scope, navigationFactory) {
		var nav = {
			"name": navigationFactory.getName(),
			"link": navigationFactory.getLink()
		};
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
	};
}).directive('chart', function() {
	return{
        restrict: 'E',
        link: function(scope, elem, attrs){
        	// var chartOptions = scope[attrs.chartOptions];
            var chart = null,
                options = {};
                    
            var data = scope[attrs.ngModel];            
            
            // If the data changes somehow, update it in the chart
            scope.$watch('data', function(v){
                 if(!chart){
                    chart = $.plot(elem, [v] , options);
                    elem.show();
                }else{
                    chart.setData([v]);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
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
}).factory('robotFactory', function() {
	var data = {
		robots: []
	};
	return {
		addRobot: function(robot) {
			var index = data.robots.push(robot);
			return (index - 1);
		},
		getRobot: function(pos) {
			return data.robots[pos];
		}
	}
});
