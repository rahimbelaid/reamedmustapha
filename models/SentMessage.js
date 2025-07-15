const mongoose = require('mongoose');

const sentMessageSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Destinataire
  objet: { type: String, default: '' }, // Sujet
  message: { type: String, required: true }, // Contenu
  date: { type: Date, default: Date.now } // Date d'envoi
});

module.exports = mongoose.model('SentMessage', sentMessageSchema);