const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom: String,
  email: String,
  message: String,
  objet: { type: String },
  date: { type: Date, default: Date.now },
  type: { type: String, default: 'recu' } // 'recu' ou 'envoye'
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);