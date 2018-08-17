const bluebird = require('bluebird');
const ListItem = require('../models/list-item');
const service = {};

service.getByID = GetByID;
service.getByListID = GetByListID;
service.insert = Insert;
service.update = Update;
service.delete = Delete;

module.exports = service;

function GetByID (_id) {

  return new Promise((resolve, reject) => {

    ListItem
      .findOne({ _id: _id })
      .exec((e, listItem) => {
        if (e) reject(e);
        else resolve(listItem);
      });

  });

}

function GetByListID (_list) {

  return new Promise((resolve, reject) => {

    ListItem
      .find({ List: _list })
      .exec((e, listItems) => {
        if (e) reject(e);
        else resolve(listItems);
      });

  });

}

function Insert (data) {

  return new Promise((resolve, reject) => {

    var listItem = new ListItem(data);
    listItem.save((e, doc) => {
      if (e) reject(e);
      else resolve(doc);
    });

  });

}

function Update (_id, data) {

  return new Promise((resolve, reject) => {

    ListItem
      .findOne({ _id: _id })
      .exec((e, listItem) => {
        if (e) reject(e);
        else {
          Object.keys(data).forEach(function (element, key, _array) {
            listItem[element] = data[element];
          });
          listItem.save(e => {
            if (e) reject(e);
            else resolve();
          });
        }
      });

  });

}

function Delete (_id) {

  return new Promise((resolve, reject) => {

    ListItem
      .remove({ _id: _id })
      .exec((e) => {
        if (e) reject(e);
        else resolve();
      });

  });

}
