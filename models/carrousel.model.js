const mongoose = require('mongoose');

const carrouselSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  titre: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  dateAjout: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Carrousel', carrouselSchema);
