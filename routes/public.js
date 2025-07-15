const express = require('express');
const router = express.Router();
const { afficherAccueil, afficherContact, envoyerMessage } = require('../controllers/publicController');
const Actualite = require('../models/actualite.model');

// Page d'accueil
router.get('/', afficherAccueil);

// Page contact (GET)
router.get('/contact', afficherContact);

// Formulaire contact (POST)
router.post('/contact', envoyerMessage);

// Liste des actualités
router.get('/actualites', async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ datePublication: -1 });
    res.render('actualites', { actualites });
  } catch (err) {
    console.error(err);
    res.render('actualites', { actualites: [] });
  }
});

module.exports = router;
