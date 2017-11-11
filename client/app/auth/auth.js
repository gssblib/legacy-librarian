/**
 * Simple module for client-side authorization.
 *
 * This module provides a service and directives for client-side authorization.
 *
 * Permissions authorize a user to perform actions. An action is an operation
 * performed on a resource, possibly involving additional parameters (e.g., in
 * case of a limit on the amount of some value of the operation).
 *
 * Action examples:
 *
 *   {resource: 'items', operation: 'return'}
 *   {resource: 'borrowers', operation: 'create'}
 *   {resource: 'fines', operation: 'waive', params: {max: 10}}
 *
 * A permission is a resource id combined with a set of operations. In case
 * of a library application, the permission to check out and return items
 * could be represented by a permission of the form:
 *
 *   {resource: 'items', operations: ['return', 'check-out']}
 *
 * The 'Auth' service contains the current user and his/her permissions.
 * UI elements can be shown or hidden by calling Auth.authorized from ng-show.
 *
 * Routes can be associated with actions by adding the 'authAction' property
 * to a route definition when configurating the route provider.
 */
angular.module('lbAuth', [])
.constant('AuthEvents', {
  LOGIN_SUCCESS: 'auth-login-success',
  LOGIN_FAILURE: 'auth-login-failure',
  NOT_AUTHORIZED: 'auth-not-authorized'
})
.factory('Auth', ['$log', '$http', '$window', 'AuthEvents',
		  function ($log, $http, $window, AuthEvents) {
  var currentUser = null;

  function setUser(user) {
    currentUser = user;
    $window.sessionStorage['user'] = JSON.stringify(user);
  }

  function getUser() {
    if (!currentUser) {
      var s = $window.sessionStorage['user'];
      currentUser = s && JSON.parse(s);
    }
    return currentUser;
  }

  /**
   * Returns a promise for getting the curent user.
   */
  function user() {
    return $http.get('/api/users/current').then(function (response) {
      var user = response.data;
      setUser(user);
      return user;
    });
  }

  /**
   * Returns true if the action is authorized by the permissions.
   */
  function authorized(permissions, action) {
    for (var i = 0; i < permissions.length; ++i) {
      var permission = permissions[i];
      if (action.resource === permission.resource
	  && permission.operations.indexOf(action.operation) >= 0) {
	return true;
      }      
    }
    return false;
  };

  /**
   * Authenticates against the server. Sets the current user in case of
   * a successful authentication.
   */
  function authenticate(login) {
    login.type = 'internal';
    return $http.post('/api/users/authenticate', login).then(
      function (response) {
	var result = response.data;
	if (result.authenticated) {
          setUser(result.user);
	}
	return result.authenticated;
      });
  }

  function logout() {
    $http.post('/api/users/logout').then(function (response) {
      $window.sessionStorage['user'] = null;
      currentUser = null;
    });
  }

  return {
    authenticate: authenticate,
    logout: logout,
    authorized: function (action) {
      var user = getUser();
      return user && authorized(user.permissions, action);
    },
    getUser: getUser,
    user: user
  };
}])
/**
 * Adds authorization check to route changes.
 */
.run(['$rootScope', '$location', '$log', 'Auth', 'AuthEvents',
      function ($rootScope, $location, $log, Auth, AuthEvents) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    var action = next.authAction;
    if (action && !Auth.authorized(action)) {
      event.preventDefault();
      $rootScope.$broadcast(AuthEvents.NOT_AUTHORIZED);
    }
  });
}]);

