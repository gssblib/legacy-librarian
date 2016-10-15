/**
 * Defines the controllers for the borrower views.
 */
angular.module("library")
.factory('borrowerService', function () {
  return {
    refdata: {
      states: [
        'ACTIVE', 'INACTIVE'
      ]
    }
  };
})
/**
 * Constroller for the borrower view (showing a single borrower and his/her
 * checked-out items.
 */
.controller("borrowerCtrl",
            ['$scope', '$location', '$routeParams', '$timeout', 'util', 'library',
             'borrowerService',
             function ($scope, $location, $routeParams, $timeout, util, library,
               borrowerService) {
  var self = this;
  self.refdata = borrowerService.refdata;
  $scope.$emit('nav-item-changed', 'borrowers');

  self.borrower = {};

  self.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };

  self.itemCountClass = '';

  /**
   * Lets the item count pulse (used to draw attention to a change).
   */
  function pulseCount() {
    self.itemCountClass = 'pulse';
    $timeout(function () { self.itemCountClass = ''; }, 1000);
  }

  function getBorrower(borrowerNumber) {
    library.getBorrower(borrowerNumber, {options: 'items,fees'}).then(
      function (borrower) {
        self.borrower = borrower;
        $scope.$broadcast('borrower-changed', self.borrower);
      });
  }

  $scope.$on('update-borrower', function() {
    getBorrower(self.borrower.borrowernumber);
  });

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
        pulseCount();
      });
  };

  self.renewItem = function (item) {
    library.renewItem(item.barcode)
      .then(function (data) {
        console.log('renewItem: data=', data);
        getBorrower(data.borrower.borrowernumber);
      });
  };

  self.renewAll = function (item) {
    library.renewBorrowerItems(self.borrower.borrowernumber).then(
      function (data) {
        getBorrower(self.borrower.borrowernumber);
        var rows_changed = data[0].rowsChanged;
        // show number of rows changed?
      },
      function (err) {
        $scope.$emit('new-error-message', {
            header: 'Unable to renew items',
            text: 'Server Error'
        });
      });
  };

  self.selectItem = function (item) {
    $location.path('/item/' + item.barcode);
  };

  var errorMessages = {
    'ENTITY_NOT_FOUND': "Unknown barcode.",
    'ITEM_ALREADY_CHECKED_OUT': "This item is already checked out."
  };

  // Error messages depending on a non-circulating item's state.
  var nonCirculatingItemMessages = {
    'STORED': 'Item is in storage.',
    'DELETED': 'Item has been deleted.',
    'LOST': 'Item was reported as lost.'
  };

  function errorMessage(err) {
    if (!err || !err.code) {
      return 'Server error';
    }
    var code = err.code;
    if (code === 'ITEM_NOT_CIRCULATING') {
      return nonCirculatingItemMessages[err.item.state];
    } else {
      return errorMessages[code] || 'Server error (' + code + ')';
    }
  }

  self.checkOutItem = function (barcode) {
    var borrowerNumber = self.borrower.borrowernumber;
    library.checkOutItem(barcode, borrowerNumber)
      .then(
        function (data) {
          getBorrower(borrowerNumber);
          self.barcode = '';
          pulseCount();
        },
        function (res) {
          var err = res.data;
          $scope.$emit('new-error-message', {
              header: 'Could not check out item ' + barcode,
              text: errorMessage(err)
          });
          self.barcode = '';
        });
  };

  self.sortKey = '-id';

  /**
   * Sets the sort key for the table showing the checked out items of a
   * borrower.
   */
  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };

  /**
   * Focus on the barcode field if a number key is pressed.
   *
   * The barcode field is the only field on the checkout form.  This event
   * handler makes sure that the scanner input is sent to this field even
   * if the field has lost focus, for example, by accidentally touching
   * the mouse or touch pad.
   *
   * The refocusing is only done if the checkout form is visible.
   */
  self.keyDown = function (event) {
    if (!$('#borrowerCheckoutsPanel').is(':visible')) {
      return;
    }
    if (!event.ctrlKey && !event.altKey) {
      var keyCode = event.keyCode;
      if (keyCode >= 48 && keyCode < 58) {
        document.getElementById('checkoutBarcode').focus();
      }
    }
  };

  self.onSelect = function () {
    $scope.$emit('set-keydown-handler', self.keyDown);
  };

  self.onDeselect = function () {
    $scope.$emit('set-keydown-handler', null);
  };

  // Reset the keydown handler when this controller is destroyed.
  $scope.$on('$destroy', self.onDeselect);
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
        return data.rows;
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

