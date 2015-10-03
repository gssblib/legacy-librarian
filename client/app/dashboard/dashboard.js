angular.module('library')
.controller('dashboardCtrl', ['$scope', function ($scope) {
  $scope.$emit('nav-item-changed', null);
}]);
