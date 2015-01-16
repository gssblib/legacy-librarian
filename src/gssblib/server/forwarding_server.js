#!/usr/bin/env node
/**
 * HTTP server that serves the ../client directory as static content and
 * forwards requests starting with the api_prefix to another HTTP server.
 */

const express = require('express'),
      logger = require('express-logger'),
      http = require('http'),
      port = 3001,
      api_host = '10.106.17.32',
      api_port = 5000,
      api_prefix = '/api',
      server = express();

server.use(logger({path: 'requests.log'}));

// Serve the client web application as static content.
server.use(express.static(__dirname + '/../client'));

// Requests starting with the api_prefix are forwarded to the api server.
server.use(api_prefix + '/*', function(req, res) {
  http.request(
    {host: api_host, port: api_port, path: req.originalUrl},
    function (response) {
      var data = '';
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function () {
        var response = JSON.parse(data);
        res.status(response.status).json(response);
      });
    }).on('error', function (err) {
        console.log(err);
        res.status(500);
    }).end();
});

// Start server.
server.listen(port, function(){
  console.log("forwarding library server is listening on port", port);
});
