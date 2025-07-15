const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Formulaire contact
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Traitement du message avec heure UTC+1
router.post('/contact', async (req, res) => {
  const { nom, email, message } = req.body;

  // Créer une date avec décalage +1 heure (UTC+1)
  const dateUTC1 = new Date();
  dateUTC1.setHours(dateUTC1.getHours() + 1);

  try {
    await new Message({ nom, email, message, date: dateUTC1 }).save();
    req.flash('success', 'Message envoyé avec succès.');
    res.redirect('/contact');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du message :', err);
    req.flash('error', 'Une erreur est survenue. Veuillez réessayer.');
    res.redirect('/contact');
  }
});

// Affichage des messages reçus
router.get('/messagerie', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.render('messagerie', { messages });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages :', err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;