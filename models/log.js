const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  email: String,
  action: String, // 'login' ou 'logout'
  date: { type: Date, default: Date.now },
  ip: String // optionnel : adresse IP
});

module.exports = mongoose.model('Log', logSchema);