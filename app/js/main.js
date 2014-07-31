var app = angular.module('DiscriminantApp', ['ngRoute', 'angular-flot']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		controller: 'setupController',
		templateUrl: 'views/setup.html'
	}).when('/predict', {
		controller: 'predictController',
		templateUrl: 'views/predict.html'
	}).when('/calculate', {
		controller: 'calculateController',
		templateUrl: 'views/calculate.html'
	})
	.otherwise({ redirectTo: '/'});

}]);


app.controller('setupController', ['$scope', 'navigationFactory', 'robotFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, $timeout) {

		// Set Navigation
		navigationFactory.setName('Setup');
		navigationFactory.setLink('/#');
		// Set Scope.
		$scope.model = {
			acquired: false
		};
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
		// Check For Robot.
		if (!robotFactory.getRobot(0)) {
			$timeout($scope.waitForRobot, 1000);
		} else {
			$scope.setAcquired(true);
		}
	}
]).controller('predictController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory',
	function($scope, navigationFactory, robotFactory, predictFactory) {
		// Set Navigation
		navigationFactory.setName('Predict');
		navigationFactory.setLink('/#predict');
		// Set Scope.
		$scope.model = {
			data: [],
			options: { xaxis: {tickSize: 1} }

		};
		$scope.predict = function(value) {
			predictFactory.setPrediction(value);
		};
		// Generate Graph Data. TODO: make this a sevice.
		function calc(x) {
			y = (x * x) - (8 * x) + 7;
			return y;
		}
		$scope.model.data.push({ data: [[0,0]], color:"blue", points: { show: true } });
		var functionLine = { data: []};
		for (var x = 0; x <= 8; x+= .25) {
			functionLine.data.push([x, calc(x)]);
		}
		$scope.model.data.push(functionLine);

	}
]).controller('calculateController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, predictFactory, $timeout) {
		// Set Navigation
		navigationFactory.setName('Calculate');
		navigationFactory.setLink('/#calculate');
		// Define private function. TODO: make this a sevice.
		function calc(x) {
			y = (x * x) - (8 * x) + 7;
			return y;
		}
		// Set Scope.
		$scope.model = {
			data: [],
			options: { xaxis: {tickSize: 1} },
			prediction: predictFactory.getPrediction(),
			x: 0,
			y: 0
		};
		$scope.startSimulation = function() {
			if ($scope.model.y < 7) {
				$scope.model.y += 1;
				$scope.model.data = [];
				var functionLine = { data: []};
				for (var x = 0; x <= 8; x+= .25) {
					functionLine.data.push([x, calc(x)]);
				}
				$scope.model.data.push(functionLine);
				$scope.model.data.push({ data: [[$scope.model.x, $scope.model.y]],
						 color:"blue",
						 points: { show: true } });
				$timeout($scope.startSimulation, 1000);
			} else {
				$timeout($scope.moveRobotOnGraph, 1000);
			}
		}
		$scope.moveRobotOnGraph = function() {
			if ($scope.model.x < 8) { 
				$scope.model.x += .50;
				var color = "blue";
				if (calc($scope.model.x) == 0) {
					color = "red";
				}
				$scope.model.data = [];
				var functionLine = { data: []};
				for (var x = 0; x <= 8; x+= .25) {
					functionLine.data.push([x, calc(x)]);
				}
				$scope.model.data.push(functionLine);
				$scope.model.data.push({ data: [[$scope.model.x,calc($scope.model.x)]],
										 color:color,
										 points: { show: true } });
				$timeout($scope.moveRobotOnGraph, 1000);
			}
		};
		// Generate Graph Data.
		var functionLine = { data: []};
		for (var x = 0; x <= 8; x+= .25) {
			functionLine.data.push([x, calc(x)]);
		}
		$scope.model.data.push(functionLine);
		$scope.model.data.push({ data: [[0,0]], color:"blue", points: { show: true } });
		
		// Start Moving the robot and graph.
		$timeout($scope.startSimulation, 1000);
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
                    
            var data = scope.$eval(attrs.ngModel);
            var dataOptions = scope.$eval(attrs.chartOptions);
            if (dataOptions) {
            	options = dataOptions;
            }
            // If the data changes somehow, update it in the chart
            scope.$watchCollection(attrs.ngModel, function(v){
                 if(!chart){
                    chart = $.plot(elem, v, options);
                    elem.show();
                }else{
                    chart.setData(v);
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
}).factory('predictFactory', function() {
	var prediction = 0;
	return {
		setPrediction: function(value) {
			prediction = value;
		},
		getPrediction: function() {
			return prediction;
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
