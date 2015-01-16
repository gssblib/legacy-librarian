angular.module('library')
.controller('borrowerProfileCtrl',
    ['$scope', 'library', function($scope, library) {
  var self = this;
  self.data = {};
  self.mode = 'view';

  $scope.$on('borrower-changed', function(event, borrower) {
    self.data.borrower = borrower;
  });

  self.editBorrower = function() {
    self.borrower = angular.copy(self.data.borrower);
    self.mode = 'edit';
  };
  self.saveBorrower = function() {
    library.saveBorrower(self.borrower).then(function (data) {
      console.log('saveBorrower', data);
      self.data.borrower = self.borrower;
      $scope.$emit('borrower-profile-updated', self.borrower);
    });
    self.mode = 'view';
  };
  self.cancelEdit = function() {
    self.mode = 'view';
  };
}]);
