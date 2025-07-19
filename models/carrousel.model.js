const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
url: String,
  public_id: String,
});

module.exports = mongoose.model('Carousel', carouselSchema);
