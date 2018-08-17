const bluebird = require('bluebird');
const List = require('../models/list');
const service = {};

service.getByID = GetByID;
service.getByUserID = GetByUserID;
service.insert = Insert;
service.update = Update;
service.delete = Delete;

module.exports = service;

function GetByID (_id) {

  return new Promise((resolve, reject) => {

    List
      .findOne({ _id: _id })
      .exec((e, list) => {
        if (e) reject(e);
        else resolve(list);
      });

  });

}

function GetByUserID (_user) {

  return new Promise((resolve, reject) => {

    List
      .find({ User: _user })
      .exec((e, lists) => {
        if (e) reject(e);
        else resolve(lists);
      });

  });

}

function Insert (data) {

  return new Promise((resolve, reject) => {

    var list = new List(data);
    list.save((e, doc) => {
      if (e) reject(e);
      else resolve(doc);
    });

  });

}

function Update (_id, data) {

  return new Promise((resolve, reject) => {

    List
      .findOne({ _id: _id })
      .exec((e, list) => {
        if (e) reject(e);
        else {
          Object.keys(data).forEach(function (element, key, _array) {
            list[element] = data[element];
          });
          list.save(e => {
            if (e) reject(e);
            else resolve();
          });
        }
      });

  });

}

function Delete (_id) {

  return new Promise((resolve, reject) => {

    List
      .remove({ _id: _id })
      .exec((e) => {
        if (e) reject(e);
        else resolve();
      });

  });

}
