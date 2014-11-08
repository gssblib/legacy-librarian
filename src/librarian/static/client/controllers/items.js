/**
 * Controller for the view for searching and managing items.
 */
angular.module("library")
.controller("itemCtrl", function($scope, $http, $timeout, $route) {
  $scope.refdata = {
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

  $scope.$on('$routeChangeSuccess', function (event) {
    console.log(event, $route.current);
    document.getElementById('item-query').focus();
  });

  /**
   * Retrieves the items whose title contains the viewValue from the server.
   */
  $scope.getItems = function (viewValue) {
    return $http.get(
      'api/items', { params: {title: viewValue, start: 0, count: 20}}
    ).then(function (response) {
      return response.data.result;
    });
  };

  $scope.showSelectedItem = function (item, model, label) {
    $scope.data.item = item;
  };

  $scope.addItem = function (item) {
    console.log(item);
  };
});
