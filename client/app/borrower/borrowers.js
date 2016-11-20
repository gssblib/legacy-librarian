/**
 * Defines the controllers for the borrower views.
 */
angular.module("library")
/**
 * Controller for the borrower search page.
 */
.controller('borrowersCtrl',
            ['$scope', '$location', '$routeParams', 'library', 'util',
             'borrowerService',
             function ($scope, $location, $routeParams, library, util,
                       borrowerService) {
  var self = this;
  $scope.$emit('nav-item-changed', 'borrowers');

  self.refdata = borrowerService.refdata;
  self.search = { _order: 'surname' }
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

  var formFields = [
    'surname', 'firstname', 'emailaddress', 'contactname', 'state', '_order'
  ];

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path().indexOf("/borrowers") == 0) {
      selectTab($routeParams['tab'] || 'surname');
      var criteria = util.fields($routeParams, formFields);
      if (criteria) {
        self.search = criteria;
        var page = $routeParams['page'];
        searchBorrowers(criteria, page);
      } else {
        self.data.showBorrowers = false;
      }
    }
  });

  self.data = {
    showBorrowers: false,
    borrowers: []
  };

  self.setSortKey = function (field) {
    self.search._order = (field === self.search._order ? "-" : "") + field;
    self.searchBorrowers(self.search, 0);
  };

  self.getBorrowers = function (surname) {
    return library.getBorrowers({surname: surname, state: 'ACTIVE'}, 0, 20)
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

  self.searchBorrowers = function (criteria, page) {
    $location.search(angular.extend(criteria || {}, {page: page, tab: 'form'}));
  };

  var pageSize = 10;

  /**
   * Sets the controller data to a results page.
   */
  function searchBorrowers(criteria, page) {
    page = page || 0;
    self.data.borrowers = [];
    var offset = page * pageSize;
    library.getBorrowers(criteria, offset, pageSize, true).then(
      function (data) {
        var pagination = util.pagination(data.count, pageSize, page);
        self.data.pagination = pagination;
        self.data.borrowers = data.rows;
        self.data.showBorrowers = true;
      },
      function (err) {
        console.log('searchBorrowers err', err);
      });
  }

  function clearSearch() {
    self.search = {};
    self.data.showBorrowers = false;
  }

  self.clearSearchForm = function (event) {
    clearSearch();
    event.preventDefault();
  };
}]);

