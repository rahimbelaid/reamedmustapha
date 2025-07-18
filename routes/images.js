const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Image = require('../models/Image');

// Route d’upload
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      url: req.file.path,
      public_id: req.file.filename,
    });
    await image.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur upload image');
  }
});

module.exports = router;