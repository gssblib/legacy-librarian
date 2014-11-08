/**
 * Defines the controller for the borrower view that allows for selecting a
 * borrower and managing the borrower's items.
 */
angular.module("library")
.controller("borrowerCtrl", function ($scope, $http, $timeout, util) {
  $scope.data = {};

  $scope.$on('$routeChangeSuccess', function (event) {
    document.getElementById('borrower-query').focus();
  });

  /**
   * Retrieves the borrowers whose surname contains the viewValue from the
   * server.
   */
  $scope.getNames = function (viewValue) {
    return $http.get(
      '/api/borrowers', { params: {surname: viewValue, start: 0, count: 20}}
    ).then(function (response) {
	return response.data.result;
    });
  };

  /**
   * Formats the names of a borrower for display.
   */
  $scope.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };

  /**
   * Stores the selected borrower in the scope and (asynchronously) gets the
   * borrower's checked out items from the server and sets them in the scope as
   * well.
   */
  $scope.showSelectedBorrower = function (borrower, model, label) {
    $scope.data.borrower = borrower;
    $http.get(
      '/api/checkouts', { params: {borrower: borrower.borrowernumber}}
    ).then(function (response) {
      $scope.data.items = response.data.result;
      $timeout(function () {
	document.getElementById('check-out-item-barcode').focus();
      });
    }, function (err) {
      console.log(err);
    });
  };

  /**
   * Returns the label displayed for the selected borrower.
   */
  $scope.formatSelectedBorrower = function () {
    return $scope.data.borrowerLabel;
  };

  /**
   * Resets the borrower's data so that a new one can be selected.
   */
  $scope.resetBorrower = function () {
    $scope.data.borrower = null;
    $scope.data.borrowerLabel = '';
    $scope.data.items = null;
    $timeout(function () {
      document.getElementById('borrower-query').focus();
    });
  };

  /**
   * Reviews a checked out item.
   */
  $scope.renewItem = function (item) {
    var date = new Date(item.date_due);
    date.setDate(date.getDate() + 14);
    item.date_due = date;
  };

  /**
   * Returns a checked out item.
   */
  $scope.returnItem = function (item) {

  };

  $scope.sortKey = 'title';

  /**
   * Sets the sort key for the table showing the checked out items of a
   * borrower.
   */
  $scope.setSortKey = function (field) {
    $scope.sortKey = (field === $scope.sortKey ? "-" : "") + field;
  };

  /**
   * Returns the sum of all the fines due for a borrower.
   */
  $scope.fineDue = function () {
    return util.sum($scope.data.items.map(util.getter('fine_due')));
  };
});
