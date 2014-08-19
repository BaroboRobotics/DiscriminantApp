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
	}).when('/explore', {
		controller: 'exploreController',
		templateUrl: 'views/explore.html'
	}).when('/example1', {
		controller: 'exampleOneController',
		templateUrl: 'views/example1.html'
	})
	.when('/example2', {
		controller: 'exampleTwoController',
		templateUrl: 'views/example2.html'
	})
	.when('/example3', {
		controller: 'exampleThreeController',
		templateUrl: 'views/example3.html'
	})
	.otherwise({ redirectTo: '/'});

}]);


app.controller('setupController', ['$scope', 'navigationFactory', 'robotFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, $timeout) {

		// Set Navigation
		navigationFactory.setName('Setup');
		navigationFactory.setLink('#/');
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
]).controller('predictController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$location',
	function($scope, navigationFactory, robotFactory, predictFactory, $location) {
		// Set Navigation
		navigationFactory.setName('Predict');
		navigationFactory.setLink('#/predict');
		// Set Scope.
		$scope.model = {
			data: [],
			options: { xaxis: {tickSize: 1} }

		};
		$scope.predict = function(value) {
			predictFactory.setPrediction(value);
			return $location.path('/calculate');

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
		navigationFactory.setLink('#/calculate');
		// Define private function. TODO: make this a sevice.
		function calc(x) {
			var y = (x * x) - (8 * x) + 7;
			return y;
		}
		function exampleOneFunction(x) {
			var y = (x * x) - x - 6;
			return y;
		}
		function exampleTwoFunction(x) {
			var y = (2 * x * x) + (12 * x) + 18;
			return y;
		}
		function exampleThreeFunction(x) {
			var y = (x * x) + (2 * x) + 6;
			return y;
		}
		function generateData(arr, func, min, max, inc) {
			for (var x = min; x <= max; x+= inc) {
				arr.data.push([x, func(x)]);
			}
		}
		// Set Scope.
		$scope.model = {
			data: [],
			exmp1Data: [],
			exmp2Data: [],
			exmp3Data: [],
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
				$timeout($scope.startSimulation, 250);
			} else {
				$timeout($scope.moveRobotForwardOnGraph, 500);
			}
		}
		$scope.moveRobotForwardOnGraph = function() {
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
				$timeout($scope.moveRobotForwardOnGraph, 500);
			} else {
				$timeout($scope.moveRobotBackwardOnGraph, 500);
			}
		};
		$scope.moveRobotBackwardOnGraph = function() {
			if ($scope.model.x > 0) { 
				$scope.model.x -= .50;
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
				$timeout($scope.moveRobotBackwardOnGraph, 500);
			} else {
				$timeout($scope.finishSimulation, 500);
			}
		};
		$scope.finishSimulation = function() {
			if ($scope.model.y > 0) {
				$scope.model.y -= 1;
				$scope.model.data = [];
				var functionLine = { data: []};
				for (var x = 0; x <= 8; x+= .25) {
					functionLine.data.push([x, calc(x)]);
				}
				$scope.model.data.push(functionLine);
				$scope.model.data.push({ data: [[$scope.model.x, $scope.model.y]],
						 color:"blue",
						 points: { show: true } });
				$timeout($scope.finishSimulation, 250);
			}
		}
		// Generate Graph Data.
		var functionLine = { data: []};
		var example1Calc = { data: []};
		var example2Calc = { data: [], xaxis: {tickSize: 10}};
		var example3Calc = { data: [], xaxis: {tickSize: 10}};
		generateData(functionLine, calc, 0, 8, .25);
		generateData(example1Calc, exampleOneFunction, -5, 5, .25);
		generateData(example2Calc, exampleTwoFunction, -5, 5, .125);
		generateData(example3Calc, exampleThreeFunction, -5, 5, .125);
		
		$scope.model.data.push(functionLine);
		$scope.model.exmp1Data.push(example1Calc);
		$scope.model.exmp2Data.push(example2Calc);
		$scope.model.exmp3Data.push(example3Calc);
		$scope.model.data.push({ data: [[0,0]], color:"blue", points: { show: true } });
		
		// Start Moving the robot and graph.
		$timeout($scope.startSimulation, 250);
	}
]).controller('exploreController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, predictFactory, $timeout) {
		function exploreFunction(x, a, b, c) {
			var y = (parseFloat(a) * x * x) + (parseFloat(b)* x) + parseFloat(c);
			return y;
		}
		// Set Scope.
		$scope.model = {
			a: 1,
			b: 1,
			c: 0,
			type: 'positive',
			data: [],
			options: { }
		};
		$scope.calculate = function() {
			$scope.model.data = [];
			var calcData = { data: [] };
			for (var x = -20; x <= 20; x+= .25) {
				calcData.data.push([x, exploreFunction(x, $scope.model.a, $scope.model.b, $scope.model.c)]);
			}
			$scope.model.data.push(calcData);
		};
		$scope.displayType = function() {
			var aVal = parseFloat($scope.model.a);
			var bVal = parseFloat($scope.model.b);
			var cVal = parseFloat($scope.model.c);
			var val = (bVal * bVal) - (4 * aVal * cVal);
			if (val > 0) {
				$scope.model.type = 'positive';
			} else if (val < 0) {
				$scope.model.type = 'negative';
			} else {
				$scope.model.type = 'zero';
			}
		}
		$scope.$watch("model.a", function(newValue, oldValue) {
			$scope.displayType();
		});
		$scope.$watch("model.b", function(newValue, oldValue) {
			$scope.displayType();
		});
		$scope.$watch("model.c", function(newValue, oldValue) {
			$scope.displayType();
		});
		$scope.calculate();
		$scope.displayType();
	}
]).controller('exampleOneController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, predictFactory, $timeout) {
		function exploreFunction(x, a, b, c) {
			var y = (parseFloat(a) * x * x) + (parseFloat(b)* x) + parseFloat(c);
			return y;
		}
		// Set Scope.
		$scope.model = {
			a: 1,
			b: -4,
			c: 3,
			type: 'positive',
			data: [],
			options: { }
		};
		$scope.calculate = function() {
			$scope.model.data = [];
			var calcData = { data: [] };
			for (var x = -5; x <= 5; x+= .25) {
				calcData.data.push([x, exploreFunction(x, $scope.model.a, $scope.model.b, $scope.model.c)]);
			}
			$scope.model.data.push(calcData);
		};
		$scope.displayType = function() {
			var aVal = parseFloat($scope.model.a);
			var bVal = parseFloat($scope.model.b);
			var cVal = parseFloat($scope.model.c);
			var val = (bVal * bVal) - (4 * aVal * cVal);
			if (val > 0) {
				$scope.model.type = 'positive';
			} else if (val < 0) {
				$scope.model.type = 'negative';
			} else {
				$scope.model.type = 'zero';
			}
		}
		$scope.calculate();
		$scope.displayType();
	}
]).controller('exampleTwoController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, predictFactory, $timeout) {
		function exploreFunction(x, a, b, c) {
			var y = (parseFloat(a) * x * x) + (parseFloat(b)* x) + parseFloat(c);
			return y;
		}
		// Set Scope.
		$scope.model = {
			a: 1,
			b: 2,
			c: 1,
			type: 'positive',
			data: [],
			options: { }
		};
		$scope.calculate = function() {
			$scope.model.data = [];
			var calcData = { data: [] };
			for (var x = -5; x <= 5; x+= .25) {
				calcData.data.push([x, exploreFunction(x, $scope.model.a, $scope.model.b, $scope.model.c)]);
			}
			$scope.model.data.push(calcData);
		};
		$scope.displayType = function() {
			var aVal = parseFloat($scope.model.a);
			var bVal = parseFloat($scope.model.b);
			var cVal = parseFloat($scope.model.c);
			var val = (bVal * bVal) - (4 * aVal * cVal);
			if (val > 0) {
				$scope.model.type = 'positive';
			} else if (val < 0) {
				$scope.model.type = 'negative';
			} else {
				$scope.model.type = 'zero';
			}
		}
		$scope.calculate();
		$scope.displayType();
	}
]).controller('exampleThreeController', ['$scope', 'navigationFactory', 'robotFactory', 'predictFactory', '$timeout',
	function($scope, navigationFactory, robotFactory, predictFactory, $timeout) {
		function exploreFunction(x, a, b, c) {
			var y = (parseFloat(a) * x * x) + (parseFloat(b)* x) + parseFloat(c);
			return y;
		}
		// Set Scope.
		$scope.model = {
			a: 1,
			b: -2,
			c: 2,
			type: 'positive',
			data: [],
			options: { }
		};
		$scope.calculate = function() {
			$scope.model.data = [];
			var calcData = { data: [] };
			for (var x = -5; x <= 5; x+= .25) {
				calcData.data.push([x, exploreFunction(x, $scope.model.a, $scope.model.b, $scope.model.c)]);
			}
			$scope.model.data.push(calcData);
		};
		$scope.displayType = function() {
			var aVal = parseFloat($scope.model.a);
			var bVal = parseFloat($scope.model.b);
			var cVal = parseFloat($scope.model.c);
			var val = (bVal * bVal) - (4 * aVal * cVal);
			if (val > 0) {
				$scope.model.type = 'positive';
			} else if (val < 0) {
				$scope.model.type = 'negative';
			} else {
				$scope.model.type = 'zero';
			}
		}
		$scope.calculate();
		$scope.displayType();
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
	var prediction = -1;
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
