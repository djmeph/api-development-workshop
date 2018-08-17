#!/usr/bin/env nodejs

//Declare constants, environment variables, dependencies.
const config = require('./config.json');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const inspect = require('util').inspect;
const opts = { colors: true, depth: Infinity };

//Bootstrap MongoDB with mongoose and promisify with bluebird
mongoose.Promise = bluebird;
mongoose.set('debug', true);
mongoose.connect(config.MONGODB_URI).then(go, fail);

//Triggered when MongoDB is connected
function go (db) {
  console.log(inspect({ "MongoDB connected on port": db.connections[0].port }, opts));

  var app = express();

  //Store global values that will be used elsewhere in the app.
  app.set('JWT_SECRET', config.JWT_SECRET);
  app.set('SALT_WORK_FACTOR', config.SALT_WORK_FACTOR);

  //Logs information about activity on the app to the console.
  app.use(logger('dev'));

  //Set CORS headers for cross-domain compatibility
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

  //Parse if the Content-Type header is of the json type
  app.use(bodyParser.json({ type: 'application/json'}));

  //Deny access to endpoints without valid jwt token
  app.use('/api', expressJwt({ secret: config.JWT_SECRET }));

  //Error handler outputs error stack
  app.use(function (e, req, res, next) {
    res.status(e.status || 500);
    res.status(500).json(e);
  });

  //Start the server
  var server = http.createServer(app)
    .listen(config.PORT, listening)
    .on('error', onError);

  //Triggered when server starts listening
  function listening () {
    console.log(inspect({ "HTTP Server listening on port": config.PORT }, opts));
  }

  //Triggered on errors
  function onError (e) {
    if (e.syscall !== 'listen') throw e;

    var bind = typeof config.PORT === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (e.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw e;
    }
  }

}

function fail (e) {
  console.error(e);
  process.exit(1);
}
