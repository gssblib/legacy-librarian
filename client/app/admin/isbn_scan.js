/**
 * Controller for the ISBN scan view.
 */
angular.module("library")
.controller("isbnScanCtrl",
    ['$scope', '$log', 'library', function ($scope, $log, library) {
  var self = this;

  self.items = [];

  function focus(id) {
    setTimeout(function () {
      document.getElementById(id).focus();
    }, 0);
  }

  self.findItem = function(barcode) {
    $log.log(barcode);
    library.getItem(barcode, {options: 'antolin'}).then(
      function (item) {
        self.item = item;
        self.items.push(self.item);
        $log.log(item);
        focus('isbnScanIsbn');
      },
      function (err) {
        if (err.data.code == 'ENTITY_NOT_FOUND') {
          $scope.$emit('new-error-message', {
              header: 'barcode not found',
              text: 'Item with barcode ' + barcode + ' not found'
          });
        } else {
          $scope.$emit('new-error-message', {
              header: 'System Error',
              text: 'Unknown error while looking for barcode ' + barcode
          });
        }
        self.barcode = '';
      });
  };

  self.setIsbn = function(isbn) {
    var item = self.item;
    var itemStored = angular.copy(self.item);
    if (!isbn) {
      itemStored.isbn13 = 'XXX';
    } else if (isbn.length == 10) {
      itemStored.isbn10 = isbn;
    } else if (isbn.length == 13) {
      itemStored.isbn13 = isbn;
    }
    itemStored.antolin = undefined;
    library.saveItem(itemStored).then(
      function (data) {
        library.getItem(item.barcode, {options: 'antolin'}).then(function (newItem) {
          item.antolin = newItem.antolin;
          item.isbn13 = newItem.isbn13;
          item.isbn10 = newItem.isbn10;
        })
      },
      function (err) {
        $log.log('getItem: err=', err);
      }
    );
    self.isbn = '';
    self.barcode = '';
    focus('isbnScanBarcode');
  };
}]);
