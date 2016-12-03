/**
 * Main angularjs file. Define the library module and the routes.
 */

angular.module('library', [
  'ngRoute', 'ngAnimate', 'ui.bootstrap', 'dialogs.main', 'lbAuth',
  'ngSanitize', 'ngCsv'],
  ['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(
      ['$location', '$q', '$rootScope', function ($location, $q, $rootScope) {
        return {
          'responseError': function (rejection) {
            if (rejection.status === 401) {
              $rootScope.$broadcast('http-not-authorized');
            }
            return $q.reject(rejection);
          }
        };
    }]);
  }])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/borrowers', {
      templateUrl: '/borrower/borrowers.html',
      authAction: {resource: 'borrowers', operation: 'read'}
    })
    .when('/borrower/new', {
      templateUrl: '/borrower/borrower_new.html',
      authAction: {resource: 'borrowers', operation: 'create'}
    })
    .when('/borrower/:number', {
      templateUrl: '/borrower/borrower.html',
      authAction: {resource: 'borrowers', operation: 'read'}
    })
    .when('/items', {
      templateUrl: '/item/items.html'
    })
    .when('/item/new/isbn', {
      templateUrl: '/item/item_new_isbn.html',
      authAction: {resource: 'items', operation: 'create'}
    })
    .when('/item/new', {
      templateUrl: '/item/item_new.html',
      authAction: {resource: 'items', operation: 'create'}
    })
    .when('/item/:barcode/edit', {
      templateUrl: '/item/item_edit.html',
      authAction: {resource: 'items', operation: 'update'}
    })
    .when('/item/:barcode', {
      templateUrl: '/item/item.html',
      authAction: {resource: 'items', operation: 'read'}
    })
    .when('/returns', {
      templateUrl: '/return/returns.html',
      authAction: {resource: 'items', operation: 'checkin'}
    })
    .when('/admin/isbn_scan', {
      templateUrl: '/admin/isbn_scan.html',
      authAction: {resource: 'items', operation: 'update'}
    })
    .when('/fees', {
      templateUrl: '/fee/fees.html',
      authAction: {resource: 'fees', operation: 'update'}
    })
    .when('/reports', {
      templateUrl: '/report/reports.html',
      authAction: {resource: 'reports', operation: 'read'}
    })
    .when('/dashboard', {
      templateUrl: '/dashboard/dashboard.html'
    })
    .otherwise({
      templateUrl: '/dashboard/dashboard.html'
    });
}]);
