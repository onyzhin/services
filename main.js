'use strict';

(function () {

	var app = angular.module('mainApp', []);

	app.directive('toggleClass', function() {
		return {
		  restrict: 'A',
		  link: function(scope, element, attrs) {
			  element.on('focusin', function() {
				element.addClass(attrs.toggleClass)
			  });
			  element.on('focusout', function() {
				element.removeClass(attrs.toggleClass)
			  });
		  }
		};
	});

	app.directive('datePicker', function() {
		return {
		  restrict: 'E',
		  templateUrl: 'templates/date-picker.html',
		  link: function(scope, element, attrs) {
		  }
		};
	});
  
	app.service('CalcService', function(){	
	
		this.greaterZero = function(value) {
		  return value > 0; 
		}
		
		this.isNumber = function(value) {
		  return typeof value == 'number';
		}		

		this.subtract = function(a, b) {
			return b-a;
		}
		
		this.check = function(checkFunc, checkValue) {		
			for (var j = 0; j < checkFunc.length; j++) {
				for (var i = 0; i < checkValue.length; i++) {
				  if (!checkFunc[j](checkValue[i])) {
					return false
				  }
				}
			}
			return true;
		}
		
	});

	app.controller('mainCtrl', ['$scope', '$http', '$log', 'CalcService', function ($scope, $http, $log, CalcService) {

		$scope.editting = function() {
		  $scope.isEdditing = !$scope.isEdditing;
		  console.log($scope.isEdditing);
		}; 
	
		$scope.difference = function() {
			var difference = CalcService.subtract(
				$scope.prev, $scope.curr
			);
			if (CalcService.check([
					CalcService.isNumber,
					CalcService.greaterZero
				], [$scope.prev, 
					$scope.curr,
					difference
				]))
				return difference;
		};
	
		$scope.calculate = function() {
			var difference = $scope.difference();
			
		};

	}]); 


}) ();


  
