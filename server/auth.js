/**
 * Simple authentication and authorization module.
 */
const config = require('config'),
      crypto = require('crypto'),
      http = require('request-promise'),
      Q = require('q');

var crud = ['create', 'read', 'update', 'delete'];

var roles = {
  anonymous: {
    permissions: []
  },
  borrower: {
    permissions: [
      {resource: "items", operations: ['read']}
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
      {resource: 'items', operations: crud.concat('checkin', 'checkout', 'renew')},
      {resource: 'borrowers', operations: crud.concat('payFees', 'renewAllItems')},
      {resource: 'fees', operations: crud},
      {resource: 'checkouts', operations: crud},
      {resource: 'reports', operations: crud}
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
  function authenticate(login) {
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
            username: user.username,
            roles: user.roles,
            permissions: permissions
          }
        };
      });
  }

  function authenticateSycamore(user, password) {
    var options = {
      method: 'POST',
      uri: config['sycamore-auth']['url'],
      form: {
        'entered_schid' : config['sycamore-auth']['school-id'],
        'entered_login': user,
        'entered_password': password
      },
      headers: {
      }
    };
    return http(options)
      .then(function (body) {
        if (body.indexOf(config['sycamore-auth']['success-text']) >= 0) {
          return db.selectRow('select * from borrowers where sycamoreid = ?', user, true)
            .then(function(borrower) {
              return {
                authenticated: true,
                user: {
                  'id': borrower.borrowernumber,
                  'user': user,
                  'surname': borrower.surname
                }
              };
            });
        } else {
          return {
            authenticated: false,
            message: 'Authentication failed.'
          };
        }
      });
  }

  function logout() {
    return Q(true);
  }

  return {
    authenticateSycamore: authenticateSycamore,
    authenticate: authenticate,
    logout: logout,
    hashPassword: saltedHash
  };
};
