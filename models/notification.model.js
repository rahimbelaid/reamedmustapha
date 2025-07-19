const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  titre: String,
  message: String,
  lien: String, // lien cliquable vers la ressource liée
  destinataireRole: String, // ou destinataireId si tu veux plus de précision
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);