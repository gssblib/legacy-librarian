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
      publisher: data.publisher,
      antolin: data.book_id
    };
  }

  self.searchIsbn = function(isbn) {
    library.searchIsbn(isbn).then(
      function (data) {
        console.log('data', data);
        itemService.item(toItem(data));
        $location.path('/item/new');
      },
      function (err) {
        $scope.$emit('new-error-message', {
            header: 'ISBN not found',
            text: 'ISBN ' + isbn + ' not found in databases'
        });
        self.search.isbn = '';
      });
  };
}]);

