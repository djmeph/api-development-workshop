const JWT_SECRET = require('../config.json').JWT_SECRET;
const EXPIRY = 86400;
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const service = {};

service.getByID = GetByID;
service.getByEmail = GetByEmail;
service.insert = Insert;
service.update = Update;
service.auth = Auth;

module.exports = service;

function GetByID (_id) {

  return new Promise((resolve, reject) => {

    User
      .findOne({ _id: _id })
      .exec((e, user) => {
        if (e) reject(e);
        else resolve(user);
      });

  });

}

function GetByEmail (email) {

  return new Promise((resolve, reject) => {

    User
      .findOne({ email: email.toLowerCase() })
      .exec((e, user) => {
        if (e) reject(e);
        else resolve(user ? user.toObject() : null);
      });

  });

}

function Insert (data) {

  return new Promise((resolve, reject) => {

    var user = new User(data);
    user.save((e, doc) => {
      if (e) reject(e);
      else resolve({ token: jwt.sign({ _id: doc._id }, JWT_SECRET, { expiresIn: EXPIRY }) });
    });

  });

}

function Update (_id, data) {

  return new Promise((resolve, reject) => {

    User
      .findOne({ _id: _id })
      .exec((e, user) => {
        if (e) reject(e);
        else {
          Object.keys(data).forEach(function (element, key, _array) {
            user[element] = data[element];
          });
          user.save(e => {
            if (e) reject(e);
            else resolve();
          });
        }
      });

  });

}

function Auth (email, password) {

  return new Promise((resolve, reject) => {

    User
      .getAuthenticated(email, password, (e, user, reason) => {
        if (user) resolve({ token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: EXPIRY }) });
        else reject({ message: "Invalid username or password" });
      });

  });

}
