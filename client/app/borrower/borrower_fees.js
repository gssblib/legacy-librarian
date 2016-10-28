angular.module('library')
.controller('borrowerFeesCtrl',
    ['$scope', 'library', function($scope, library) {
  var self = this;
  self.borrower = {};
  self.sortKey = '-checkout_date';


  /**
   * Sets the sort key for the table showing the checked out items of a
   * borrower.
   */
  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };

  function allItems(borrower) {
    console.log(borrower);
    var items = [];
    borrower.fees.items.forEach(function (item) {
      item.type = 'checkouts';
      items.push(item);
    });
    borrower.fees.history.forEach(function (item) {
      item.type = 'history';
      items.push(item);
    });
    return items; 
  }

  // Load fees and associated check-outs after the borrower has changed.
  $scope.$on('borrower-changed', function(event, borrower) {
    self.borrower = borrower;
    self.items = allItems(borrower);
  });

  self.payAllFees = function () {
    var borrowerNumber = self.borrower.borrowernumber;
    library.payFees(borrowerNumber).then(function (data) {
      $scope.$emit('update-borrower');
    });   
  };

  self.payFee = function (item) {
    library.payFee(item).then(function (data) {
      $scope.$emit('update-borrower');
    });
  };

  self.waiveFee = function (item) {
    library.waiveFee(item).then(function (data) {
      $scope.$emit('update-borrower');
    });
  };
}]);

