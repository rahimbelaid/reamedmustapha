const express = require('express');
const router = express.Router();
const uploadPoster = require('../middlewares/uploadPoster');
const Poster = require('../models/Poster');
const { cloudinary } = require('../config/cloudinary');

router.post('/admin/poster', uploadPoster.single('image'), async (req, res) => {
  try {
    const { lien } = req.body;

    const oldPoster = await Poster.findOne({});
    if (oldPoster) {
      await cloudinary.uploader.destroy(oldPoster.cloudinaryId);
      await oldPoster.deleteOne();
    }

    const newPoster = new Poster({
      url: req.file.path,
      cloudinaryId: req.file.filename,
      lien
    });

    await newPoster.save();
    res.redirect('/admin/poster');
  } catch (err) {
    console.error('❌ Erreur lors de l\'upload du poster :', err);
    res.status(500).send('Erreur serveur');
  }
});
router.post('/admin/poster/delete', async (req, res) => {
  try {
    const { cloudinaryId } = req.body;
    if (!cloudinaryId) {
      return res.status(400).send('ID Cloudinary manquant.');
    }

    // Supprimer de Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId);

    // Supprimer de MongoDB
    await Poster.findOneAndDelete({ cloudinaryId });

    res.redirect('/admin/poster'); // retour à la page admin
  } catch (err) {
    console.error('❌ Erreur suppression poster :', err);
    res.status(500).send('Erreur serveur.');
  }
});

module.exports = router;
