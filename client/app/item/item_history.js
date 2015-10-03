angular.module('library')
.controller('itemHistoryCtrl',
    ['$scope', 'library', 'util', function($scope, library, util) {
  var self = this;
  self.item = {};

  $scope.sortKey = '-checkout_date';

  // Load history in background after the item has changed.
  $scope.$on('item-changed', function (event, item) {
    self.item = item;
    library.getItem(item.barcode, {options: 'history'}).then(
      function (item) {
        var history = item.history;
        self.item.history = history;
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
