#!/usr/bin/env node

const config = require('config'),
      crypto = require('crypto'),
      mysql = require('mysql'),
      mysqlq = require('../lib/mysqlq'),
      db = mysqlq(mysql.createPool(config.get('db')));

function hash(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function saltedHash(s) {
  return hash(config.auth.salt + s);
}

function storeUser(username, hashedPassword, roles) {
  return db.query(
    'insert into users (username, hashed_password, roles, failed_login_attempts)'
      + ' values (?, ?, ?, 0)', [username, hashedPassword, roles]);
}

function main() {
  var args = process.argv.slice(2);
  var username = args[0];
  var password = args[1];
  var roles = args[2];
  var hashedPassword = saltedHash(password);

  storeUser(username, hashedPassword, roles)
    .then(
      function (data) {
        console.log('added user', username);
      },
      function (err) {
        console.log('error adding user:', err);
      })
    .fin(function () {
      db.pool.end();
    });
}

main();
