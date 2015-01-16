angular.module('library')
.controller('loginCtrl',
	    ['$log', '$scope', '$location', 'Auth', 'AppEvents',
	     function ($log, $scope, $location, Auth, AppEvents) {
  self = this;
  $scope.$emit('nav-item-changed', null);
  self.authenticate = function (login) {
    Auth.authenticate(login).then(
      function (result) {
	if (result) {
	  $location.path('/dashboard');
	} else {
	  $scope.$emit(AppEvents.NEW_ERROR_MESSSAGE,
		       'Incorrect username and/or password');
	};
      });
  };
}]);
