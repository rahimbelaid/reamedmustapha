const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const path = require('path');
const fs = require('fs');
const Message = require('../models/message');
const upload = require('../middlewares/upload')
const Carrousel = require('../models/carrousel.model');
const Utilisateur = require('../models/utilisateur');
const { estadmin, estadminprincipal } = require('../middlewares/authMiddleware');
const { estSuperAdmin } = require('../middlewares/authMiddleware');
const siteController = require('../controllers/site');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.get('/admin-secret', estSuperAdmin, (req, res) => {
  res.send('Bienvenue superadmin');
});
// ✅ Dashboard admin
router.get('/admin', estadmin, async (req, res) => {
  const utilisateurs = await Utilisateur.find();
  res.render('admin', {
    utilisateurs,
    user: req.session.utilisateur
  });
});

// ✅ Changer le rôle d’un utilisateur
router.post('/changer-role/:id', estadmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  await Utilisateur.findByIdAndUpdate(id, { role });
  req.flash('success', 'Rôle mis à jour.');
  res.redirect('/admin');
});

// ✅ Gestion des utilisateurs
router.get('/utilisateurs', estadmin, async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    const utilisateursActifs = utilisateurs.filter(u => u.actif && u.role !== 'admin' && u.role !== 'adminprincipal');
    const utilisateursNonActifs = utilisateurs.filter(u => !u.actif);
    const administrateurs = utilisateurs.filter(u => u.role === 'admin');
    const adminprincipal = utilisateurs.filter(u => u.role === 'adminprincipal');

    res.render('utilisateurs', {
      utilisateurs,
      utilisateursActifs,
      utilisateursNonActifs,
      administrateurs,
      adminprincipal,
      user: req.session.utilisateur
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Page "Messagerie reçue"
router.get('/messagerie', estadmin, async (req, res) => {
  const recherche = req.query.recherche || '';
  const tri = req.query.tri || 'date';
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const filtre = {
    type: 'recu',
    $or: [
      { nom: new RegExp(recherche, 'i') },
      { email: new RegExp(recherche, 'i') },
      { message: new RegExp(recherche, 'i') }
    ]
  };

  const ordreTri = {};
  if (tri === 'nom') ordreTri.nom = 1;
  else if (tri === 'email') ordreTri.email = 1;
  else ordreTri.date = -1;

  try {
    const totalMessages = await Message.countDocuments(filtre);
    const totalPages = Math.ceil(totalMessages / limit);
    const messages = await Message.find(filtre)
      .sort(ordreTri)
      .skip((page - 1) * limit)
      .limit(limit);
    const vue = req.query.vue === 'envoyes' ? 'envoyes' : 'recus';

    res.render('messagerie', {
      messages,
      recherche,
      tri,
      utilisateur: req.session.utilisateur,
      currentPage: page,
      totalPages,
      showForm: true,
      vue // ✅ On l'ajoute ici pour l'utiliser dans le fichier EJS
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages :', err);
    res.status(500).send('Erreur serveur');
  }
});


// ✅ Supprimer un message
router.post('/admin/messagerie/:id/supprimer', estadmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Message.findByIdAndDelete(id);
    req.flash('success', 'Message supprimé.');
    res.redirect('back');
  } catch (err) {
    console.error('Erreur suppression message :', err);
    res.status(500).send('Erreur serveur');
  }
});
// ✅ Logs
router.get('/logs', estadmin, async (req, res) => {
  const emailRecherche = req.query.email || '';
  const actionRecherche = req.query.action || '';
  const dateDebut = req.query.dateDebut || '';
  const dateFin = req.query.dateFin || '';

  const filtre = {};
  if (emailRecherche) filtre.email = new RegExp(emailRecherche, 'i');
  if (actionRecherche) filtre.action = actionRecherche;
  if (dateDebut || dateFin) {
    filtre.date = {};
    if (dateDebut) filtre.date.$gte = new Date(dateDebut);
    if (dateFin) {
      const fin = new Date(dateFin);
      fin.setHours(23, 59, 59, 999);
      filtre.date.$lte = fin;
    }
  }

  try {
    const logs = await Log.find(filtre).sort({ date: -1 });
    res.render('logs', {
      logs,
      emailRecherche,
      actionRecherche,
      dateDebut,
      dateFin,
      user: req.session.utilisateur
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des logs :', err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Suppression multiple logs
router.post('/logs/supprimer-multiple', estadmin, async (req, res) => {
  const { logIds } = req.body;
  try {
    if (Array.isArray(logIds) && logIds.length > 0) {
      await Log.deleteMany({ _id: { $in: logIds } });
      req.flash('success', 'Logs supprimés.');
    }
    res.redirect('/logs');
  } catch (err) {
    console.error('Erreur lors de la suppression des logs :', err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ site

router.get('/site', estadmin, siteController.renderAdminPage);
router.post('/admin/ajouter-actualite', siteController.addActualite);
router.post('/admin/supprimer-actualite/:id', siteController.deleteActualite);

// Form POST pour uploader une image dans le carrousel
router.post('/admin/carrousel', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Aucun fichier envoyé');
    }

    const nouvelleImage = new Carrousel({
      url: req.file.filename, // Ne mets pas le chemin complet ici
    });

    await nouvelleImage.save();

    res.redirect('/admin'); // Ou autre page
  } catch (err) {
    console.error('Erreur upload carrousel :', err);
    res.status(500).send('Erreur serveur');
  }
});
router.get('/admin/supprimer/:id', async (req, res) => {
  try {
    const image = await Carrousel.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image non trouvée.");
    }

    const imagePath = path.join(__dirname, '../public/uploads', image.url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Carrousel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/site');
  } catch (err) {
    console.error("Erreur suppression image carrousel :", err);
    res.status(500).send("Erreur serveur.");
  }
});


module.exports = router;
