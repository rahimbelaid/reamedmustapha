const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');
const imageController = require('../controllers/imageController'); // Ne mélange pas les deux

const Actualite = require('../models/actualite.model');
const upload = require('../middlewares/upload');

// Page d'accueil (public)
router.get('/', publicController.afficherAccueil); // Ne touche pas à ça

// Page contact
router.get('/contact', publicController.afficherContact);
router.post('/contact', publicController.envoyerMessage);

// Page actualités
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
