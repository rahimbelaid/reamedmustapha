// models/Image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

module.exports = mongoose.model('Image', imageSchema);