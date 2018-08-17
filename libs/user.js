const User = require('../services/user');
const library = {};

library.auth = Auth;
library.register = Register;
library.put = Put;
library.password = Password;

module.exports = library;

function Auth (req, res, next) {

  User.auth(req.body.email, req.body.password).then(res => {

    req.data = { status: 200, result: res };
    return next();

  }, e => {

    req.data = { status: 401, result: e };
    return next();

  });

}

function Register (req, res, next) {

  User.getByEmail(req.body.email).then(user => {

    if (user) {
      req.data = { status: 406, result: { message: "A User with that email already exists" } };
      return next();
    } else {
      User.insert(req.body).then(res => {
        req.data = { status: 200, result: res };
        return next();
      }, e => {
        req.data = { status: 500, result: e };
        return next();
      });
    }

  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Put (req, res, next) {

  var payload = req.body ? req.body : {};
  if (payload.password) delete payload.password;

  if (payload.email) User.getByEmail(req.body.email).then(user => {

    if (user && user._id != req.user._id) {
      req.data = { status: 406, result: { message: "A User with that email already exists" } };
      return next();
    } else {
      update();
    }

  });

  else update();

  function update () {
    User.update(req.user._id, req.body).then(() => {
      req.data = { status: 200, result: {} };
      return next();
    }, e => {
      req.data = { status: 500, result: e };
      return next();
    });
  }



}

function Password (req, res, next) {

  User.getByID(req.user._id).then(user => {

    User.auth(user.email, req.body.password).then(res => {

      User.update(req.user._id, { password: req.body.new }).then(() => {
        req.data = { status: 200, result: {} };
        return next();
      }, e => {
        req.data = { status: 500, result: e };
        return next();
      });

    }, e => {
      req.data = { status: 500, result: { message: "Invalid password" } };
      return next();
    });

  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

