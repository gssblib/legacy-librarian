/**
 * Controller for the ISBN scan view.
 */
angular.module("library")
.controller("isbnScanCtrl",
    ['$log', 'library', function ($log, library) {
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
        $log.log('getItem: err=', err);
      }
    );
  };

  self.setIsbn = function(isbn) {
    var item = self.item;
    var itemStore = angular.copy(self.item);
    itemStore.isbn13 = isbn;
    itemStore.antolin = undefined;
    itemStore.added = undefined; // datetime not handled yet
    library.saveItem(itemStore).then(
      function (data) {
        library.getItem(item.barcode, {options: 'antolin'}).then(function (newItem) {
          item.antolin = newItem.antolin;
          item.isbn13 = newItem.isbn13;
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
