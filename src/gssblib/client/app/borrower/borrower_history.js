angular.module('library')
.controller('borrowerHistoryCtrl',
    ['$scope', 'library', 'util', function($scope, library, util) {
  var self = this;
  self.borrower = {};

  $scope.sortKey = '-checkout_date';

  // Load history in background after the borrower has changed.
  $scope.$on('borrower-changed', function (event, borrower) {
    self.borrower = borrower;
    library.getBorrower(borrower.borrowernumber, {options: 'history'}).then(
      function (borrower) {
        var history = borrower.history;
        self.borrower.history = history;
        self.pagination = util.pagination(history.length, 10);
      });
  });

  self.setPage = function (page) {
    if (self.pagination) self.pagination.setPage(page);
  };

  self.pageClass = function (page) {
    return {'btn-primary': page == self.pagination.page};
  };

  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };
}]); 
