'use strict';

(function () {

	var app = angular.module('mainApp', ['LocalStorageModule']);
	
	app.config(function (localStorageServiceProvider) {
		localStorageServiceProvider
		  .setPrefix('scotch-todo');
	});

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
  
	app.service('calcService', function(){	
	
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
		
		this.calculate = function (data, x){	
			var result = 0;
			for (var j = 0; j < data.length; j++) {
				var rate = data[j].rate;
				var price = data[j].price;
				if (x > rate && rate != 0) {
					result += rate * price;
					x = x - rate;
				} else {
					result += x * price;
					return result.toFixed(2);
				}
			}
			return result.toFixed(2);
		}
		
		this.formatDate = function(date)  {
			return [
				date.getDate(),
				date.getMonth() + 1,
				date.getFullYear() % 100
			].map(function(val){
				return val < 10 ? '0' + val : val;
			}).join('.');
		}
		
	});

	app.controller('mainCtrl', 
		['$scope', '$http', 
		function ($scope, $http) {
		
			//DATA FROM JSON
			$http.get('data.json')
				.success(function(data){
				  $scope.services = data;
				  console.log( $scope.services);
				})
				.error(function(data){
				  console.log('not found data file')
				})
			

			$scope.isSelected = function(checkTab) {
				return this.tab === checkTab;
			};

			$scope.selectTab = function(setTab) {
				$scope.tab = setTab;
			}
			
		}]
	)

	app.controller('servicesCtrl', 
		['$scope', '$http', '$log', 'calcService', 'localStorageService',
		function ($scope, $http, $log, calcService, localStorageService) {

		$scope.CURRENCY = "грн";		
		
		$scope.getTariffs = function (service) {
			//fetches tariffs from local storage
			console.log(service);
			if (localStorageService.get(service.storage)) {
				service.data.tariffs = localStorageService.get(service.storage);
			} else {
				service.data.tariffs = [];
			}		
		}
	   
	    $scope.createTariff = function (service) {
			//creates a new tariff
			service.data.tariffs.push($scope.tariff);
			localStorageService.set(service.storage, service.data.tariffs);
			$scope.tariff = {};
		};

		$scope.removeTariff = function (service, index) {
			//removes a tariff
			service.data.tariffs.splice(index, 1);
			localStorageService.set(service.storage, service.data.tariffs);
		};
	   		
		$scope.saveTariff = function(service) {	
			//save a tariff		
			localStorageService.set(service.storage, service.data.tariffs); 
		}; 
		
		$scope.getRecords = function (service) {
			//fetches records from local storage			
			if (localStorageService.get(service.hist)) {
				service.data.records = localStorageService.get(service.hist);
			} else {
				service.data.records = [];
			}
		}
	   
	    $scope.createRecord = function (service) {
			//creates a new record
			console.log(service);
			var date = new Date();
			$scope.record = {
				date: date,
				rate: $scope.curr,
				payment: $scope.calculate(service)				
			}
			var lastDateInStorage = (service.data.records.length>0) ?
				new Date(service.data.records[(service.data.records.length)-1].date) :
				new Date(1);
			if (! date.getMonth() == lastDateInStorage.getMonth() &&
				date.getFullYear() == lastDateInStorage.getFullYear() 
			){
				service.data.records.push($scope.record);
				localStorageService.set(service.hist, service.data.records);
				$scope.record = {};
				$scope.prev = $scope.curr;
				$scope.curr = "";
				alert('збережено!');
			} else alert('вже сплачували цього місяця!');
		};		
	
		$scope.difference = function() {
			var difference = calcService.subtract(
				$scope.prev, $scope.curr
			);
			if (calcService.check([
					calcService.isNumber,
					calcService.greaterZero
				], [$scope.prev, 
					$scope.curr,
					difference
				]))
				return difference;
		};
	
		$scope.calculate = function(service) {
			if (calcService.check([
					calcService.greaterZero
				], [$scope.difference()]))
				return calcService.calculate(service.data.tariffs, $scope.difference()) + ' ' + $scope.CURRENCY;			
		};
		
		$scope.formatDate = function(date) {
			return calcService.formatDate(new Date(date));		
		};
		
		$scope.lastRate = function(service){
			return (service.data.records.length>0) ?
				service.data.records[(service.data.records.length)-1].rate : 0;
		}
		
		$scope.clearAll = function() {
		   return localStorageService.clearAll();
		}

	}]); 

}) (); 