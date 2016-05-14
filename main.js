(function () {

  var app = angular.module('paymentSysApp', []);

  app.controller('paymentSysController', ['$scope', '$http',  function ($scope, $http) {      
   
    /*
    //DATA FROM JSON
    $http.get('data.json')
    .success(function(data){
      $scope.services = data;
      console.log( $scope.services);
    })
    .error(function(data){
      console.log('not found data file')
    })
    */

    $scope.isSelected = function(checkTab) {
      return this.tab === checkTab;
    };

    $scope.selectTab = function(setTab) {
      $scope.tab = setTab;
      console.log(setTab);
    }
        
  }]);

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
        $('#datetimepicker1').datetimepicker({
          locale: 'fr'
        });
      }
    };
  });

  app.controller('servicesCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.editting = function() {
      $scope.isEdditing = !$scope.isEdditing;
      console.log($scope.isEdditing);
    }


    $scope.diff = function() {

    };

    $scope.calculate = function() {

    };

    $scope.isNumber = function(value) {
      return !isNaN(value)
    } 

  }]); 


}) ();


  
