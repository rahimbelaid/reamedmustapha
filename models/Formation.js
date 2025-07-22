const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: String,
  description: String,
  type: String, // "video", "pdf", etc.
  apparatus: String, // "cardiovasculaire", "digestif", etc.
  url: String,
  publicId: String, // ✅ AJOUT MANQUANT !
  dateAjout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formation', formationSchema);