// routes/carousel.js

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Image = require('../models/carrousel.model');

// Formulaire upload (GET)
router.get('/upload-image', (req, res) => {
  res.render('upload-image'); // tu dois créer ce fichier EJS
});

// Upload image (POST)
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename, // ID unique dans Cloudinary
    });
    await image.save();
    res.redirect('/carousel');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de l\'upload');
  }
});

// Affichage des images
router.get('/carousel', async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.render('carousel', { images });
});

module.exports = router;
