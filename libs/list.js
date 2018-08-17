const List = require('../services/list');
const library = {};

library.getList = GetList;
library.getLists = GetLists;
library.post = Post;
library.put = Put;
library.delete = Delete;

module.exports = library;

function GetList (req, res, next) {

  List.getByID(req.params._id).then(list => {
    req.data = { status: 200, result: list };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function GetLists (req, res, next) {

  List.getByUserID(req.user._id).then(list => {
    req.data = { status: 200, result: list };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Post (req, res, next) {

  var payload = req.body;
  payload.User = req.user._id;

  List.insert(payload).then(list => {
    req.data = { status: 200, result: { _id: list._id } };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Put (req, res, next) {

  List.update(req.params._id, req.body).then(() => {
    req.data = { status: 200, result: {} };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Delete (req, res, next) {

  List.delete(req.params._id).then(() => {
    req.data = { status: 200, result: {} };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

