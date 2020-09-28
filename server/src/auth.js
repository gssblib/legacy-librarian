/**
 * Simple authentication and authorization module.
 */
const config = require('config'),
      crypto = require('crypto'),
      http = require('request-promise'),
      Q = require('q');

const crud = ['create', 'read', 'update', 'delete'];

const roles = {
  anonymous: {
    permissions: []
  },
  borrower: {
    permissions: [
      {resource: "items", operations: ['read']},
      {resource: "profile", operations: ['read']}
    ]
  },
  clerk: {
    permissions: [
      {resource: 'items', operations: ['read', 'checkin', 'checkout', 'renew']},
      {resource: 'borrowers', operations: ['read', 'payFees', 'renewAllItems']}
    ]
  },
  librarian: {
    permissions: [
      {resource: 'items', operations: crud.concat('checkin', 'checkout', 'renew', 'order')},
      {resource: 'borrowers', operations: crud.concat('payFees', 'renewAllItems')},
      {resource: 'fees', operations: crud},
      {resource: 'checkouts', operations: crud},
      {resource: 'reports', operations: crud},
      {resource: 'ordercycles', operations: crud},
      {resource: 'orders', operations: crud},
    ]
  },
  admin: {
    permissions: [
      {resource: 'users', operations: crud},
      {resource: 'items', operations: crud.concat('checkin', 'checkout', 'renew')},
      {resource: 'borrowers', operations: crud},
      {resource: 'reports', operations: crud}
    ]
  }
};

module.exports = function (db) {

  function hash(s) {
    return crypto.createHash('sha256').update(s).digest('hex');
  }

  function saltedHash(s) {
    return hash(config.auth.salt + s);
  }

  /**
   * Authenticates a user given the login containing the 'username' and
   * 'password' against the database. If authenticated, returns the user
   * with his/her roles and permissions.
   */
  function authenticateInternal(login) {
    return db.selectRow('select * from users where username = ?',
                        login.username, true)
      .then(function (user) {
        if (!user) {
          return {
            authenticated: false,
            reason: 'UNKNOWN_USER'
          };
        }
        if (saltedHash(login.password) !== user.hashed_password) {
          return {
            authenticated: false,
            reason: 'INCORRECT_PASSWORD'
          };
        }
        var permissions = [];
        user.roles.split(',').forEach(function (roleName) {
          var role = roles[roleName];
          if (role) {
            permissions = permissions.concat(role.permissions);
          }
        });
        return {
          authenticated: true,
          user: {
            type: 'internal',
            username: user.username,
            roles: user.roles,
            permissions: permissions
          }
        };
      });
  }

  function authenticateSycamore(login) {
    var options = {
      method: 'POST',
      uri: config['sycamore-auth']['url'],
      form: {
        'entered_schid' : config['sycamore-auth']['school-id'],
        'entered_login': login.username,
        'entered_password': login.password
      },
      headers: {
      }
    };
    return http(options)
      .then(function (body) {
        if (body == '') {
          return {
            authenticated: false,
            message: 'SYCAMORE_UNAVAILABLE'
          };
        }
        if (body.indexOf(config['sycamore-auth']['success-text']) >= 0) {
          return db.selectRow('select * from borrowers where sycamoreid = ?', login.username, true)
            .then(function(borrower) {
              return {
                authenticated: true,
                user: {
                  type: 'sycamore',
                  username: login.username,
                  roles: 'borrower',
                  permissions: roles['borrower'].permissions,
                  // Sycamore user specific.
                  id: borrower.borrowernumber,
                  surname: borrower.surname,
                }
              };
            });
        } else {
          return {
            authenticated: false,
            message: 'AUTHENTICATION_FAILED'
          };
        }
      });
  }

  var AuthenticationMethods = {
    'internal': authenticateInternal,
    'sycamore': authenticateSycamore
  };

  function authenticate(login) {
    var auth = AuthenticationMethods[login.type];
    if (auth === undefined)
      return Q({
        authenticated: false,
        message: 'UNKNOWN_SCHEME',
        scheme: login.type
      });
    return auth(login);
  }

  /**
   * Returns true if the action is authorized by the permissions.
   */
  function isAuthorized(permissions, action) {
    for (var i = 0; i < permissions.length; ++i) {
      var permission = permissions[i];
      if (action.resource === permission.resource
	  && permission.operations.indexOf(action.operation) >= 0) {
	return true;
      }
    }
    return false;
  };

  return {
    authenticate: authenticate,
    hashPassword: saltedHash,
    isAuthorized: isAuthorized,
  };
};
