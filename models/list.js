const mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
});

module.exports = mongoose.model('List', ListSchema);
