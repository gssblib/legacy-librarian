/**
 * Defines the controller for the "return items" view.
 */
angular.module("library")
.controller("returnCtrl",
            ['$log', '$scope', 'library', function ($log, $scope, library) {

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

  function errorText(barcode, reason) {
    return 'Unable to return item ' + barcode + ': ' + reason;
  }

  self.data = {};
  self.data.returnedItems = library.returnedItems();

  self.returnItem = function(barcode) {
    library.returnItem(barcode)
      .then(
        function(data) {
          self.data.returnedItems = library.returnedItems();
          self.barcode = '';
        },
        function(res) {
          var err = res.data;
          if (err && err.code) {
            $scope.$emit('new-error-message', errorText(barcode, errorMessage(err.code)));
          } else {
            $scope.$emit('new-error-message', errorText(barcode, 'Server error'));
          }
          self.barcode = '';
        }
    );
  };
}]);
