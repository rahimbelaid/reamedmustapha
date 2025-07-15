// models/actualite.model.js
const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true }, // ✅ Description ajoutée
  contenu: { type: String, required: true },
  datePublication: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Actualite', actualiteSchema);