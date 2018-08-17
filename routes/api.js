const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

/* Libraries */
const user = require('../libs/user');
const list = require('../libs/list');
const listItem = require('../libs/list-item')

/* User Routes */
router.post('/auth', [bodyParser.json(), user.auth], Process);
router.post('/register', [bodyParser.json(), user.register], Process);
router.post('/user', [bodyParser.json(), user.put], Process);
router.post('/password', [bodyParser.json(), user.password], Process);

/* List Routes */
router.get('/list/:_id', [bodyParser.json(), list.getList], Process);
router.get('/lists', [bodyParser.json(), list.getLists], Process);
router.post('/list', [bodyParser.json(), list.post], Process);
router.put('/list/:_id', [bodyParser.json(), list.put], Process);
router.delete('/list/:_id', [bodyParser.json(), list.delete], Process);

/* List Routes */
router.get('/list-item/:_id', [bodyParser.json(), listItem.getListItem], Process);
router.get('/list-items/:_id', [bodyParser.json(), listItem.getListItems], Process);
router.post('/list-item', [bodyParser.json(), listItem.post], Process);
router.put('/list-item/:_id', [bodyParser.json(), listItem.put], Process);
router.delete('/list-item/:_id', [bodyParser.json(), listItem.delete],Process);

module.exports = router;

function Process (req, res) {
 res.status(req.data.status).json(req.data.result);
}
