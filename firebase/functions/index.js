const server = require('gssblib-server');
const functions = require('firebase-functions');
const express = require('express');

exports.api = functions.https.onRequest(server.server);
