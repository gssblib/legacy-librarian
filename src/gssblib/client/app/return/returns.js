/**
 * Defines the controller for the "return items" view.
 */
angular.module("library")
.controller("returnCtrl",
            ['$log', '$scope', '$timeout', 'library',
              function ($log, $scope, $timeout, library) {

  var self = this;

  $scope.$emit('nav-item-changed', 'returns');

  var errorMessages = {
    'ER_PARSE_ERROR': 'Invalid barcode',
    'ENTITY_NOT_FOUND': 'Unknown barcode',
    'ITEM_NOT_CHECKED_OUT': 'Item not checked out'
  };

  function errorMessage(errorCode) {
    return errorMessages[errorCode] || 'Unknown error (' + errorCode + ')';
  }

  self.itemCountClass = '';

  /**
   * Lets the item count pulse (used to draw attention to a change).
   */
  function pulseCount() {
    self.itemCountClass = 'pulse';
    $timeout(function () { self.itemCountClass = ''; }, 1000);
  }

  self.data = {};
  self.data.returnedItems = library.returnedItems();

  function onCloseErrorDialog() {
    // using DOM directly - not very angularly, but simple.
    document.getElementById('returnBarcode').focus();
  }

  self.returnItem = function(barcode) {
    library.returnItem(barcode)
      .then(
        function(data) {
          self.data.returnedItems = library.returnedItems();
          self.data.returnedItem = self.data.returnedItems.filter(
            function (item) { return item.barcode == barcode; })[0];
          $timeout(function () {
            self.data.returnedItem = null;
          }, 1000);
          self.barcode = '';
          pulseCount();
        },
        function(res) {
          var err = res.data;
          $scope.$emit('new-error-message', {
              header: 'Unable to return item ' + barcode,
              text: err && err.code ? errorMessage(err.code) : 'Server error'
          }, onCloseErrorDialog);
          self.barcode = '';
        }
    );
  };
}]);
