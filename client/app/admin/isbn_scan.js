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
    library.getItem(barcode).then(
      function (item) {
        self.item = item;
        self.items.push(self.item);
        $log.log(item);
        focus('isbnScanIsbn');
      },
      function (err) {
        $log.log('getItem: err=', err);
      });
  };

  self.setIsbn = function(isbn) {
    var item = self.item;
    item.isbn13 = isbn;
    library.saveItem(item).then(function (data) {
      $log.log("saved item", data);
    });
    self.isbn = '';
    self.barcode = '';
    focus('isbnScanBarcode');
  };
}]);
