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

function updatePassword(username, hashedPassword) {
  return db.query(
    'update users set hashed_password = ? where username = ?',
    [hashedPassword, username]);
}

function main() {
  var args = process.argv.slice(2);
  var username = args[0];
  var password = args[1];
  var hashedPassword = saltedHash(password);

  updatePassword(username, hashedPassword)
    .then(
      function (data) {
        console.log('password changed for ', username);
      },
      function (err) {
        console.log('error changing password:', err);
      })
    .fin(function () {
      db.pool.end();
    });
}

main();
