const mongoose = require('mongoose');

const carrouselSchema = new mongoose.Schema({
url: String,
  public_id: String,
});

module.exports = mongoose.model('Carrousel', carrouselSchema);
