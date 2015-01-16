/**
 * Controller for the views for a single item.
 */
angular.module("library")
.controller('itemCtrl',
            ['$rootScope', '$scope', '$log', '$location', '$routeParams', 'library', 'util',
             function($rootScope, $scope, $log, $location, $routeParams, library, util) {
  var self = this;
  $scope.$emit('nav-item-changed', 'items');

  self.item = {};

  // should come from server
  self.refdata = {
    types: [
      "Buch", "CD", "CD-ROM", "DVD", "Comic", "Multimedia", "Zeitschrift",
      "Kassette"
    ],
    subjects: [
      "CD", "CD-ROM", "DVD", "Bilderbuch B-gelb", "Comic C-orange",
      "Erzaehlung E-d gruen", "Fasching", "Halloween", "Leseleiter LL-klar",
      "Maerchen Mae-rot", "Multimedia MM-rosa", "Ostern", "Sachkunde S-blau",
      "Sachkunde Sevie - h blau", "St. Martin", "Teen T - h gruen",
      "Uebergroesse - lila", "Weihnachten", "Zeitschrift"
    ],
    ages: [
      "na", "A", "All Ages", "K-1", "K-2", "T", "T-17",
      "Leseleiter-1A", "Leseleiter-1B", "Leseleiter-1C", "Leseleiter-2",
      "Leseleiter-3", "Leseleiter-4", "Leseleiter-5",  "Leseleiter-6",
      "Leseleiter-7", "Leseleiter-8", "Leseleiter-9", "Leseleiter-10",
      "Lehrer"
    ],
    media: [
      "na", "DVD-Europa", "DVD-USA", "Software-Mac", "Software-Windows",
      "Software-Windows/Mac"
    ]
  };

  function getItem(barcode) {
    library.getItem(barcode).then(
      function (item) {
        self.item = item;
      },
      function (err) {
        $log.log('getItem: err=', err);
      });
  }

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path().indexOf("/item/") == 0) {
      var barcode = $routeParams["barcode"];
      getItem(barcode);
    }
  });

  self.addItem = function (item) {
    $log.log('addItem', item);
    library.createItem(item).then(
      function (data) {
        $log.log('added item', data);
        $location.path('/item/' + item.barcode);
      },
      function (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          $scope.$emit('new-error-message', 'Duplicate barcode.');
        }
      });
  };

  self.saveItem = function (item) {
    library.saveItem(item).then(
      function (data) {
        $location.path('/item/' + item.barcode);
      });
  };
}]);
