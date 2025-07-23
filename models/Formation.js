const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: String,
  description: String,
  type: String, // "video", "pdf", etc.
  apparatus: String, // "cardiovasculaire", "digestif", etc.
  likes: { type: Number, default: 0 },
  commentaires: [
    { auteur: String, texte: String, 
date: { type: Date, default: Date.now } }
  ]
  url: String,
  publicId: String, // ✅ AJOUT MANQUANT !
  dateAjout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formation', formationSchema);