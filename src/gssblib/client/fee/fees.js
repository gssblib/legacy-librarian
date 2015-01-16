angular.module('library')
.controller('feesCtrl',
            ['$scope', '$location', 'library', 'util',
              function($scope, $location, library, util) {
  var self = this;
  self.feeDate = new Date();
  $scope.$emit('nav-item-changed', 'fees');

  function getFees() {
    library.getFees().then(function (fees) {
      self.fees = fees;
    });
  }

  getFees();

  self.updateFees = function (date) {
    console.log(date);
    library.updateFees(date).then(function () { getFees(); });
  };

  self.sortKey = 'surname';

  /**
   * Sets the sort key for the table showing the checked out items of a
   * borrower.
   */
  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };

  self.showBorrower = function (borrowerNumber) {
    $location.path('/borrower/' + borrowerNumber);
  };

  self.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };
}]);

