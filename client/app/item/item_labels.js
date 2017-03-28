angular.module('library')
.controller('itemLabelsCtrl',
    ['$scope', '$http', function($scope, $http) {
  var self = this;
  self.labels_server = 'http://localhost:3001/';
  self.item = null;
  self.category = null;
  self.categoryFields = null;
  self.data = {};
  self.categories = [];
  self.previewImage = null;
  self.status = null;
  self.status_type = null;

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
    return true;
  });

  self.loadCategories = function(item) {
    return $http.get(self.labels_server + item.barcode + '/categories').then(
      function (response) {
        self.categories = response.data.categories;
        self.category = self.categories[0];
        self.onCategoryChange(item, self.category);
      },
      function (response) {
        self.status = response.data.status;
        self.status_type = 'danger';
      });
  };

  self.onCategoryChange = function(item, category) {
    self.updateFields(item, category);
    self.updatePreview(item, category);
  };

  self.updateFields = function (item, category) {
    return $http.get(
      self.labels_server + item.barcode + '/' + category + '/details'
    ).then(
      function (response) {
        self.data = {};
        self.categoryFields = null;
        if (response.data.fields.length === 0) {
          return;
        }
        angular.forEach(response.data.fields, function(fld, key) {
          fld.templateOptions['onChange'] = function(
            $viewValue, $modelValue, $scope) {
              self.updatePreview(self.item, self.category);
          };
        });
        self.categoryFields = response.data.fields;
      });
  };

  self.updatePreview = function (item, category) {
    return $http({
      'method': 'POST',
      'url': self.labels_server + item.barcode + '/' + category + '/preview',
      'data': self.data,
      'responseType': 'arraybuffer'}
    ).then(
      function (response) {
        self.previewImage = _arrayBufferToBase64(response.data);
      });
  };

  self.printLabel = function (item, category) {
    return $http({
      'method': 'POST',
      'url': self.labels_server + item.barcode + '/' + category + '/print',
      'data': self.data}
    ).then(
      function (response) {
        self.status = response.data.status;
        self.status_type = 'success';
      },
      function (response) {
        self.status = response.data.status;
        self.status_type = 'danger';
      }
    );
  };

}]);
