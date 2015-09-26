/**
 * Controller for the views for a single item.
 */
angular.module("library")
// Service for sharing data between multiple instances of the item
// controllers.
.factory('itemService', function () {
  var savedItem;
  return {
    item: function (item) {
      if (item === undefined) return savedItem;
      savedItem = item;
    }
  };
})
.controller('itemCtrl',
            ['$scope', '$log', '$location', '$routeParams', 'library', 'itemService',
             function($scope, $log, $location, $routeParams, library, itemService) {
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
        $scope.$broadcast('item-changed', self.item);
      },
      function (err) {
        $log.log('getItem: err=', err);
      });
  }

  $scope.$on('$routeChangeSuccess', function (event) {
    if ($location.path() === "/item/new") {
      self.item = itemService.item();
      itemService.item(null);
    } else if ($location.path().indexOf("/item/") == 0) {
      var barcode = $routeParams["barcode"];
      getItem(barcode);
    }
  });

  self.addItem = function (item) {
    library.createItem(item).then(
      function (data) {
        $location.path('/item/' + item.barcode);
      },
      function (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          $scope.$emit('new-error-message', {
              header: 'Unable to add item',
              text: 'Duplicate barcode ' + barcode
          });
        } else {
          $scope.$emit('new-error-message', {
              header: 'Unable to add item',
              text: 'Server error'
          });
        }
      });
  };

  self.saveItem = function (item) {
    library.saveItem(item).then(
      function (data) {
        $location.path('/item/' + item.barcode);
      });
  };

  self.copyItem = function (item) {
    var newItem = angular.copy(item);
    newItem.barcode = "";
    newItem.id = undefined;
    itemService.item(newItem);
    $location.path('/item/new');
  }; 
}]);
