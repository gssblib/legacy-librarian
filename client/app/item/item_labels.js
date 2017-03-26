angular.module('library')
.controller('itemLabelsCtrl',
    ['$scope', '$http', function($scope, $http) {
  var self = this;
  self.labels_server = 'http://localhost:3001/';
  self.item = null;
  self.category = null;
  self.categories = [];
  self.previewImage = null;

  function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  $scope.$on('item-changed', function (event, item) {
    self.item = item;
    self.loadCategories(item);
  });

  self.loadCategories = function(item) {
    return $http.get(self.labels_server + item.barcode + '/categories').then(
      function (response) {
        self.categories = response.data.categories;
        self.category = self.categories[0];
        self.updatePreview(item, self.category);
      });
  };

  self.onCategoryChange = function(item, category) {
    self.updatePreview(item, category);
  };

  self.updatePreview = function (item, category) {
    return $http({
      'method': 'GET',
      'url': self.labels_server + item.barcode + '/' + category + '/preview',
      'responseType': 'arraybuffer'}
    ).then(
      function (response) {
        self.previewImage = _arrayBufferToBase64(response.data);
      });
  };

  self.printLabel = function (item, category) {
    return $http.get(
      self.labels_server + item.barcode + '/' + category + '/print').then(
      function (response) {
        return;
      });
  };

}]);
