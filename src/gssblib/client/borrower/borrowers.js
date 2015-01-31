/**
 * Defines the controllers for the borrower views.
 */
angular.module("library")
/**
 * Constroller for the borrower view (showing a single borrower and his/her
 * checked-out items.
 */
.controller("borrowerCtrl",
            ['$scope', '$location', '$routeParams', 'util', 'library',
             function ($scope, $location, $routeParams, util, library) {
  var self = this;
  $scope.$emit('nav-item-changed', 'borrowers');

  self.borrower = {};

  self.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };

  function getBorrower(borrowerNumber) {
    library.getBorrower(borrowerNumber, {options: 'items'}).then(
      function (borrower) {
        self.borrower = borrower;
        $scope.$broadcast('borrower-changed', self.borrower);
      });
  }

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path().indexOf("/borrower/") == 0) {
      var borrowerNumber = $routeParams["number"];
      getBorrower(borrowerNumber);
    }
  });

  $scope.$on('borrower-profile-updated', function (event, borrower) {
    self.borrower = borrower;
  });

  self.returnItem = function (item) {
    library.returnItem(item.barcode)
      .then(function (data) {
        console.log('returnItem: data=', data);
        getBorrower(data.borrower.borrowernumber);
      });
  };

  self.renewItem = function (item) {
    library.renewItem(item.barcode)
      .then(function (data) {
        console.log('renewItem: data=', data);
        getBorrower(data.borrower.borrowernumber);
      });
  };

  self.selectItem = function (item) {
    $location.path('/item/' + item.barcode);
  };

  var errorMessages = {
    'ENTITY_NOT_FOUND': "Unknown barcode.",
    'ITEM_ALREADY_CHECKED_OUT': "This item is already checked out."
  };

  function errorMessage(code) {
    return errorMessages[code] || 'Server error (' + code + ')';
  }

  function errorText(barcode, reason) {
    return 'Could not check out item ' + barcode + ': ';
  }

  self.checkOutItem = function (barcode) {
    var borrowerNumber = self.borrower.borrowernumber;
    library.checkOutItem(barcode, borrowerNumber)
      .then(
        function (data) {
          getBorrower(borrowerNumber);
          self.barcode = '';
        },
        function (res) {
          console.log('checkOutItem: res=', res);
          var err = res.data;
          if (err && err.code) {
            $scope.$emit('new-error-message', errorText(barcode, errorMessage(err.code)));
          } else {
            $scope.$emit('new-error-message', errorText(barcode, 'Server error'));
          }
          self.barcode = '';
        });
  };

  self.sortKey = 'title';

  /**
   * Sets the sort key for the table showing the checked out items of a
   * borrower.
   */
  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };
}])
/**
 * Controller for the borrower search page.
 */
.controller('borrowersCtrl',
            ['$scope', '$location', 'library', 'util',
             function ($scope, $location, library, util) {
  var self = this;
  $scope.$emit('nav-item-changed', 'borrowers');

  self.getBorrowers = function (surname) {
    return library.getBorrowers(surname, 0, 20)
      .then(function (data) {
        return data;
      });
  };

  self.selectBorrower = function (borrower, path) {
    path = path || '/borrower/';
    $location.path(path + borrower.borrowernumber);
  };

  self.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };
}]);

