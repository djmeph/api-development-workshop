const ListItem = require('../services/list-item');
const library = {};

library.getListItem = GetListItem;
library.getListItems = GetListItems;
library.post = Post;
library.put = Put;
library.delete = Delete;

module.exports = library;

function GetListItem (req, res, next) {

  ListItem.getByID(req.params._id).then(listItem => {
    req.data = { status: 200, result: listItem };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function GetListItems (req, res, next) {

  ListItem.getByListID(req.params._id).then(listItems => {
    req.data = { status: 200, result: listItems };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Post (req, res, next) {

  var payload = req.body;

  ListItem.insert(payload).then(listItem => {
    req.data = { status: 200, result: { _id: listItem._id } };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Put (req, res, next) {

  ListItem.update(req.params._id, req.body).then(() => {
    req.data = { status: 200, result: {} };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

function Delete (req, res, next) {

  ListItem.delete(req.params._id).then(() => {
    req.data = { status: 200, result: {} };
    return next();
  }, e => {
    req.data = { status: 500, result: e };
    return next();
  });

}

