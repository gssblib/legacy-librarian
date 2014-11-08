/**
 * Defines the controller for the "return items" view.
 */
angular.module("library")
.controller("returnCtrl", function ($scope, $http, $timeout) {
  $scope.data = {};
  $scope.data.returnedItems = [];
  $scope.returnItem = function(barcode) {
    $http.get('/api/checkin', {params: {barcode: barcode}}).then(
        function(response) {
            console.log(response.data);
            $scope.data.returnedItems.push(response.data);
            $scope.errorMessage = null;
        },
        function(response) {
            console.log(response);
            $scope.errorMessage = response.data.status_msg;
        }
    );
  };

});
