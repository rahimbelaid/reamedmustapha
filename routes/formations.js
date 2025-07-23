const express = require('express');
const router = express.Router();
const multer = require('multer');
const methodOverride = require('method-override');
const Formation = require('../models/Formation');
const { formationStorage } = require('../config/cloudinary'); // ✅ stockage Cloudinary
const cloudinary = require('cloudinary').v2;

const upload = multer({ storage: formationStorage });
router.use(methodOverride('_method'));

// 🔍 Déduction du type de fichier pour la suppression
const getResourceType = (url) => {
  if (!url) return 'raw'; // fallback
  if (url.endsWith('.mp4')) return 'video';
  if (url.endsWith('.pdf') || url.endsWith('.ppt') || url.endsWith('.pptx')) return 'raw';
  return 'image';
};

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
app.post('/formations/:id/like', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    formation.likes = (formation.likes || 0) + 1;
    await formation.save();
    res.json({ success: true, likes: formation.likes });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.post('/formations/:id/comment', async (req, res) => {
  try {
    const { texte } = req.body;
    const formation = await Formation.findById(req.params.id);
    formation.commentaires.push({ texte });
    await formation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


app.get('/formations/:id/comments', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    res.json({ success: true, comments: formation.commentaires });
  } catch (err) {
    res.status(500).json({ success: false });
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
      url: req.file.path, // ✅ URL Cloudinary
      publicId: req.file.filename // ✅ public_id Cloudinary
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

    if (formation.publicId) {
      const resourceType = getResourceType(formation.url);
      await cloudinary.uploader.destroy(formation.publicId, { resource_type: resourceType });
    }

    await formation.deleteOne();
    res.redirect('/site');
  } catch (err) {
    console.error('Erreur suppression formation :', err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
