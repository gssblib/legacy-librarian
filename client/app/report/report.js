angular.module('library')
.controller('itemUsageReportCtrl',
            ['$scope', '$location', 'library', 'util', 'itemService',
             function($scope, $location, library, util, itemService) {
  var self = this;
  self.report = null;
  self.lastCheckoutDate = new Date();
  self.refdata = itemService.refdata;
  self.query = {};

  self.getReport = function(query) {
    library.getItemUsageReport(query).then(function (report) {
      self.report = report.rows;
      self.pagination = util.pagination(report.length, 30);
    });
  };

  self.setPage = function (page) {
    if (self.pagination) self.pagination.setPage(page);
  };

  self.pageClass = function (page) {
    return {'btn-primary': page == self.pagination.page};
  };

  self.sortKey = 'barcode';

  self.setSortKey = function (field) {
    self.sortKey = (field === self.sortKey ? "-" : "") + field;
  };

  self.showItem = function (barcode) {
    $location.path('/item/' + barcode);
  };

}]);
