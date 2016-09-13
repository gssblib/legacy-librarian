angular.module('library')
.controller('borrowerNewCtrl',
    ['$scope', '$location', 'library', 'borrowerService',
     function($scope, $location, library, borrowerService) {
  var self = this;
  self.refdata = borrowerService.refdata;
  self.data = {};
  self.borrower = {'state': 'ACTIVE'};

  self.addBorrower = function (borrower) {
    library.createBorrower(borrower).then(
      function (borrower) {
        console.log('addBorrower', borrower);
        $location.path('/borrower/' + borrower.borrowernumber);
      });
  };
}]);
