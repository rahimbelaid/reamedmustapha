const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Formation = require('../models/Formation');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const { URL } = require('url');

// 📦 Config depuis .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const upload = multer({ dest: 'uploads/' });
router.use(methodOverride('_method'));

// 📄 Liste des formations (affichage public ou interface)
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

// 🖼️ Page d'upload (formulaire ou admin)
router.get('/site', async (req, res) => {
  try {
    const formations = await Formation.find().sort({ dateAjout: -1 });
    res.render('site', { formations, utilisateur: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// 📤 Upload d’une nouvelle formation
router.post('/formations/upload', upload.single('fichier'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto'
    });

    // Supprimer le fichier temporaire (async)
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Erreur suppression fichier temporaire :', err);
    });

    const formation = new Formation({
      titre: req.body.titre,
      description: req.body.description,
      type: req.body.type,
      apparatus: req.body.apparatus,
      url: result.secure_url,
      publicId: result.public_id // stocke le public_id
    });

    await formation.save();
    res.redirect('/site');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur upload');
  }
});

// 🗑️ Suppression d’une formation
router.delete('/formations/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).send('Formation non trouvée');

    if (formation.publicId) {
      await cloudinary.uploader.destroy(formation.publicId, { resource_type: 'auto' });
    } else {
      // fallback si publicId non stocké
      const publicId = path.parse(new URL(formation.url).pathname).name;
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    }

    await formation.deleteOne();
    res.redirect('/site');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur suppression');
  }
});

module.exports = router;
