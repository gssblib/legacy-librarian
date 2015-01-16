angular.module('library')
.controller('borrowerNewCtrl',
    ['$scope', '$location', 'library', function($scope, $location, library) {
  var self = this;
  self.data = {};

  self.addBorrower = function (borrower) {
    library.createBorrower(borrower).then(
      function (borrower) {
        console.log('addBorrower', borrower);
        $location.path('/borrower/' + borrower.borrowernumber);
      });
  };
}]);
