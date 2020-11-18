const server = require('./server/src/library_server_function');
const functions = require('firebase-functions');
const express = require('express');

exports.api = functions.https.onRequest(server.server);
