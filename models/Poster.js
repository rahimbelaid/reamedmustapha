// models/Poster.js
const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
  url: String,
  cloudinaryId: String,
  lien: String
});

module.exports = mongoose.model('Poster', posterSchema);