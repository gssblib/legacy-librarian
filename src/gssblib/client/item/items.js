/**
 * Controller for the view for searching and managing items.
 */
angular.module('library')
.controller('itemsCtrl',
            ['$scope', '$location', '$routeParams', 'library', 'util',
             function($scope, $location, $routeParams, library, util) {
  var self = this;
  $scope.$emit('nav-item-changed', 'items');

  self.data = {
    showItems: false,
    items: []
  };

  /**
   * Returns the items whose titles contain the titlePart (for typeahead).
   */
  self.getItems = function (titlePart) {
    return library.getItems({title: titlePart}, 0, 20).then(
      function (data) {
        return data;
      });
  };

  self.selectItem = function (item) {
    $location.path('/item/' + item.barcode);
  };

  self.searchItems = function (criteria, page) {
    $location.search(angular.extend(criteria || {}, {page: page}));
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

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path().indexOf("/items") == 0) {
      var criteria = util.fields($routeParams, ['author', 'title', 'barcode']);
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

