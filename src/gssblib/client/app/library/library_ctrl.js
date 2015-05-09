angular.module('library')
.constant('AppEvents', {
  NEW_ERROR_MESSAGE: 'new-error-message',
  CLEAR_ERROR_MESSAGE: 'clear-error-message'
})
.controller('libraryCtrl',
            ['$log', '$scope', '$timeout', '$location', '$modal',
             'util', 'Auth', 'AuthEvents', 'AppEvents',
             function ($log, $scope, $timeout, $location, $modal,
                       util, Auth, AuthEvents, AppEvents) {
  var self = this;

  self.errorMessage = '';
  self.showError = false;

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

  $scope.$on(AppEvents.NEW_ERROR_MESSAGE, function (event, message) {
    showError(message);
  });

  $scope.$on(AppEvents.CLEAR_ERROR_MESSAGE, function (event) {
    self.errorMessage = '';
  });

  $scope.$on(AuthEvents.NOT_AUTHORIZED, function (event) {
    showError('Not authorized');
    //    $timeout(function () { $location.path('/login'); });
  });

  function openModalLogin() {
    $modal.open({
      templateUrl: '/login/login_popup.html'
    });
  }

  $scope.$on('http-not-authorized', function (event) {
    openModalLogin();
  });

  if (!Auth.getUser()) {
    openModalLogin();
  }
  // Auth.user().then(function (user) {
  //   console.log('user from server:', user);
  //   if (!user) {
  //     $modal.open({
  //       templateUrl: '/login/login_popup.html'
  //     });
  //   }
  // });

  /**
   * Formats the names of a borrower for display.
   */
  $scope.borrowerLabel = function (borrower) {
    return borrower ?
      util.joinFields(borrower, ['surname', 'firstname', 'contactname']) : '';
  };

  /**
   * Returns true if the current user is authorized to perform the
   * operation on the resource.
   */
  $scope.authorized = function (resource, operation) {
    return Auth.authorized({resource: resource, operation: operation});
  };

  self.logout = function () {
    Auth.logout();
    //    openModalLogin();
  };

  self.login = function () {
    openModalLogin();
  };

  self.getUser = function () {
    return Auth.getUser();
  };

  var currentNavItem = null;

  $scope.$on('nav-item-changed', function (event, navItem) {
    $log.debug('nav-item-changed: ', navItem);
    currentNavItem = navItem;
  });

  self.navClass = function (navItem) {
    return {active: navItem == currentNavItem};
  };

  // Allows to react to global keydown events.  A controller can register and
  // unregister (by setting the handler back to null) a handler using the
  // set-keydown-handler event.
  //
  // This is used to automatically focus on barcode input fields when noticing
  // that a number key is pressed on forms that only have a barcode field.
  var keyDownHandler = null;
  $scope.$on('set-keydown-handler', function (event, handler) {
    keyDownHandler = handler;
  });
  $(document).on('keydown', function (event) {
    if (keyDownHandler) {
      keyDownHandler(event);
    }
  });
}]);
