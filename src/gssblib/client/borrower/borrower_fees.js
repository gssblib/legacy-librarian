angular.module('library')
.controller('borrowerFeesCtrl',
    ['$scope', 'library', function($scope, library) {
  var self = this;
  self.borrower = {};

  function allItems(borrower) {
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

  function getBorrowerFees() {
    library.getBorrower(self.borrower.borrowernumber, {options: 'fees'}).then(
      function (borrower) {
        self.borrower = borrower;
        self.items = allItems(borrower);
      });
  }

  // Load fees and associated check-outs after the borrower has changed.
  $scope.$on('borrower-changed', function(event, borrower) {
    self.borrower = borrower;
    getBorrowerFees();
  });

  self.payAllFees = function () {
    var borrowerNumber = self.borrower.borrowernumber;
    library.payFees(borrowerNumber).then(function (data) {
      getBorrowerFees();
    });   
  };

  self.payFee = function (item) {
    library.payFee(item).then(function (data) {
      getBorrowerFees();
    });
  };

  self.waiveFee = function (item) {
    library.waiveFee(item).then(function (data) {
      getBorrowerFees();
    });
  };
}]);

