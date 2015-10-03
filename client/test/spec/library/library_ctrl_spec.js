describe('Library Controller', function () {
  var mockScope;

  beforeEach(module('library'));
  beforeEach(function () {
    inject(function ($controller, $rootScope) {
      mockScope = $rootScope.$new();
      $controller('libraryCtrl', {$scope: mockScope});
    });
  });

  it('should set error message', function () {
    mockScope.$emit('new-error-message', 'Some error message.');
  });
});
