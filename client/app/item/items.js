/**
 * Controller for the view for searching and managing items.
 */
angular.module('library')
.controller('itemsCtrl',
            ['$scope', '$location', '$routeParams', 'library', 'util', 'itemService',
             function($scope, $location, $routeParams, library, util, itemService) {
  var self = this;
  $scope.$emit('nav-item-changed', 'items');

  self.refdata = itemService.refdata;
  self.tabActive = {
    'title': false,
    'barcode': false,
    'form': false
  };

  function selectTab(tab) {
    if (tab) {
      for (t in self.tabActive) {
        self.tabActive[t] = false;
      }
      self.tabActive[tab] = true;
    }
  }

  self.data = {
    showItems: false,
    items: []
  };
  self.lookup = {};

  /**
   * Returns the items whose titles contain the titlePart (for typeahead).
   */
  self.getItems = function (titlePart) {
    return library.getItems({title: titlePart}, 0, 20).then(
      function (data) {
        return data.rows;
      });
  };

  self.selectItem = function (item) {
    $location.path('/item/' + item.barcode);
  };

  self.selectItemByBarcode = function (barcode) {
    $location.path('/item/' + barcode);
  };

  self.searchItems = function (criteria, page) {
    $location.search(angular.extend(criteria || {}, {page: page, tab: 'form'}));
  };

  var pageSize = 10;

  /**
   * Sets the controller data to a results page.
   */
  function searchItems(criteria, page) {
    page = page || 0;
    self.data.items = [];
    var offset = page * pageSize;
    library.getItems(criteria, offset, pageSize, true).then(
      function (data) {
        var pagination = util.pagination(data.count, pageSize, page);
        self.data.pagination = pagination;
        self.data.items = data.rows;
        self.data.showItems = true;
      });
  }

  function clearSearch() {
    self.search = {};
    self.data.showItems = false;
  }

  var formFields = [
    'author', 'title', 'barcode', 'state', 'subject', 'classification',
    'seriestitle', 'antolin'
  ];

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path().indexOf("/items") == 0) {
      selectTab($routeParams['tab'] || 'barcode');
      var criteria = util.fields($routeParams, formFields);
      if (criteria) {
        self.search = criteria;
        var page = $routeParams['page'];
        searchItems(criteria, page);
      } else {
        self.data.showItems = false;
      }
    }
  });

  self.pageClass = function (page) {
    return {'btn-primary': page == self.data.pagination.page};
  };

  self.clearSearchForm = function (event) {
    clearSearch();
    event.preventDefault();
  };
}]);

