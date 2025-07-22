const express = require('express');
const router = express.Router();
const multer = require('multer');
const methodOverride = require('method-override');
const Formation = require('../models/Formation');
const { formationStorage } = require('../config/cloudinary'); // ✅ import du stockage formation Cloudinary

const upload = multer({ storage: formationStorage });
router.use(methodOverride('_method'));

// 📄 Liste des formations (affichage public)
router.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.find().sort({ dateAjout: -1 });
    res.render('formations', {
      utilisateur: req.user,
      formations,
      notifications: req.notifications || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// 🖼️ Page admin (upload et gestion)
router.get('/site', async (req, res) => {
  try {
    const formations = await Formation.find().sort({ dateAjout: -1 });
    res.render('site', { formations, utilisateur: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// 📤 Upload d’une nouvelle formation vers Cloudinary
router.post('/formations/upload', upload.single('fichier'), async (req, res) => {
  try {
    const formation = new Formation({
      titre: req.body.titre,
      description: req.body.description,
      type: req.body.type,
      apparatus: req.body.apparatus,
      url: req.file.path, // URL Cloudinary
      publicId: req.file.filename // ID Cloudinary (utile pour suppression)
    });

    await formation.save();
    res.redirect('/site');
  } catch (err) {
    console.error('Erreur upload formation :', err);
    res.status(500).send('Erreur serveur');
  }
});

// 🗑️ Suppression d’une formation
router.delete('/formations/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('Formation non trouvée');

    const cloudinary = require('cloudinary').v2;

    if (formation.publicId) {
      await cloudinary.uploader.destroy(formation.publicId, { resource_type: 'auto' });
    }

    await formation.deleteOne();
    res.redirect('/site');
  } catch (err) {
    console.error('Erreur suppression formation :', err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;

