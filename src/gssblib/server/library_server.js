#!/usr/bin/env node

/**
 * HTTP server for the GSSB library system.
 *
 * This server serves the client web application as static content
 * and responds to the AJAX requests from the client.
 *
 * The AJAX requests are translated to calls to the library service
 * (defined in library.js).
 */

const config = require('config'),
      express = require('express'),
      fs = require('fs'),
      Q = require('q'),
      logger = require('morgan'),
      mysqlq = require('../lib/mysqlq'),
      api_prefix = '/api',
      db = mysqlq(require('mysql').createPool(config.get('db'))),
      library = require('./library').create(db),
      auth = require('./auth')(db),
      server = express(),
      httpcall = require('./httpcall')(server, api_prefix);

server.use(logger('combined', {
  stream: fs.createWriteStream(__dirname + '/requests.log', {flags: 'a'})}));

server.use(require('body-parser').json());
server.use(require('cookie-parser')(config.get('auth').cookie));
server.use(require('express-session')({
  secret: config.get('auth').session,
  resave: false,
  saveUninitialized: true
}));

// Serve the client web application as static content.
server.use(express.static(__dirname + '/../client'));

httpcall.handlePaths([
  { get: '/borrowers/fees',
    fn: function (call) {
      return library.borrowers.allFees();
    }},
  { post: '/history/:id/payFee',
    fn: function (call) {
      return library.history.payFee(call.param('id'));
    }},
  { post: '/checkouts/:barcode/payFee',
    fn: function (call) {
      return library.checkouts.payFee(call.param('barcode'));
    }},
  { post: '/checkouts/updateFees',
    fn: function (call) {
      return library.checkouts.updateFees(call.req.body.date);
    },
    action: {resource: 'checkouts', operation: 'update'}}]);

httpcall.handlePaths([
  { get: '/users/current',
    fn: function (call) {
      return Q(call.req.session.user);
    }},
  { post: '/users/authenticate',
    fn: function (call) {      
      return auth.authenticate(call.req.body).tap(function (result) {
        console.log('authenticate', result);
	if (result.authenticated) {
	  call.req.session.user = result.user;
	}
      });
    }},
  { post: '/users/logout',
    fn: function (call) {
      return auth.logout().then(function () {
        var loggedIn = !!call.req.session.user;
        if (loggedIn) {
          delete call.req.session.user;
          return {success: true};
        } else {
          return {success: false, reason: 'NOT_LOGGED_IN'};
        }
      });
    }}
]);

httpcall.handleEntity(library.items, ['checkout', 'checkin', 'renew']);
httpcall.handleEntity(library.borrowers, ['payFees']);

// Start server.
const port = config.get('server').port;
server.listen(port, function() {
  console.log("library server is listening on port", port);
});

// Shutdown connection pool on exit.
process.on('exit', function() {
  db.end();
});

