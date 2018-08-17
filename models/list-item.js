const mongoose = require('mongoose');

var ListItemSchema = new mongoose.Schema({
  body: { type: String, required: true },
  description: { type: String },
  List: { type: mongoose.Schema.Types.ObjectId, ref: 'List', index: true }
});

module.exports = mongoose.model('ListItem', ListItemSchema);
