const mongoose = require('mongoose');

const FormationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  url: { type: String }, // ✅ bien structuré
  type: { type: String },
  apparatus: { type: String },
  fichierUrl: { type: String },
  dateAjout: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  commentaires: [
    {
      auteur: { type: String },
      texte: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Formation', FormationSchema);