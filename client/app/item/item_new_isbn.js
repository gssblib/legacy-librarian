/**
 * Controller for new item entry with isbn search.
 */
angular.module("library")
.controller('itemNewIsbnCtrl',
            ['$scope', '$log', '$location', '$routeParams', 'library', 'itemService',
             function($scope, $log, $location, $routeParams, library, itemService) {
  var self = this;
  $scope.$emit('nav-item-changed', 'items');

  // Data for the search form (external search by ISBN 13).
  self.search = {};

  function toItem(data) {
    return {
      title: data.title,
      author: data.author,
      isbn13: data.isbn13,
      isbn10: data.isbn10,
      publishercode: data.publisher,
      antolin: data.book_id
    };
  }

  self.searchIsbn = function(isbn13) {
    console.log('isbn', isbn13);
    library.searchIsbn(isbn13).then(
      function (data) {
        console.log('data', data);
        itemService.item(toItem(data));
        $location.path('/item/new');
      },
      function (err) {
        $scope.$emit('new-error-message', {
            header: 'ISBN not found',
            text: 'ISBN ' + isbn13 + ' not found in databases'
        });
        self.search.isbn13 = '';
      });
  };
}]);

