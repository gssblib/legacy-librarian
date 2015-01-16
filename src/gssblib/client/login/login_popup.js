angular.module('library')
.controller('loginCtrl',
	    ['$log', '$scope', '$location', '$timeout',
             'Auth', 'AppEvents',
	     function ($log, $scope, $location, $timeout,
                       Auth, AppEvents) {
  self = this;
  self.showError = false;
  self.errorMessage = null;

  function showError(message) {
    self.errorMessage = message;
    self.showError = true;
    $timeout(function () {
      self.showError = false;
    }, 3000);
  }

  self.closeAlert = function () {
    self.showError = false;
  };

  $scope.$emit('nav-item-changed', null);

  self.authenticate = function (login) {
    Auth.authenticate(login).then(
      function (result) {
        console.log('login result:', result);
	if (!result) {
          showError('Incorrect username and/or password');
	} else {
          $scope.$close();
        }
      });
  };
}]);
