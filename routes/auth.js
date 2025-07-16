const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const Utilisateur = require('../models/utilisateur');
const Log = require('../models/log');
const { envoyerCode } = require('../utils/mailer');
const authController = require('../controllers/authController');

// --- GET /login
router.get('/login', (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');

  res.render('login', {
    title: 'Connexion - Service de Réanimation',
    messages: { error, success },
    utilisateur: req.utilisateur || null
  });
});

// --- POST /login
router.post('/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  const utilisateur = await Utilisateur.findOne({ email });
  if (!utilisateur) {
    req.flash('error', 'Utilisateur inconnu.');
    return res.redirect('/login');
  }

  if (!utilisateur.actif) {
    return res.render('login', {
      title: 'Connexion - Service de Réanimation',
      error: 'Votre compte est inactif , veuillez contacter un administrateur.',
      success: null,
      utilisateur: null
    });
  }

  if (!utilisateur.motdepasse) {
    req.flash('error', 'Mot de passe manquant.');
    return res.redirect('/login');
  }

  const match = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
  if (!match) {
    req.flash('error', 'Mot de passe incorrect.');
    return res.redirect('/login');
  }

  req.session.utilisateur = utilisateur;
  req.session.save(async err => {
    if (err) {
      console.error('❌ Erreur de session:', err);
      req.flash('error', 'Erreur de session');
      return res.redirect('/login');
    }

    await new Log({
      utilisateurId: utilisateur._id,
      email: utilisateur.email,
      action: 'login',
      ip: req.ip
    }).save();

    return res.redirect('/');
  });
});

// --- POST /demander-reset : Envoie le code par email
router.post('/demander-reset', authController.resetPasswordRequest);

// --- POST /reset-password : Confirme le code + change le mot de passe
router.post('/reset-password', authController.resetPassword);

// --- GET /logout
router.get('/logout', async (req, res) => {
  const utilisateur = req.session.utilisateur;
  if (utilisateur) {
    await new Log({
      utilisateurId: utilisateur._id,
      email: utilisateur.email,
      action: 'logout',
      ip: req.ip
    }).save();
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Erreur de session:', err);
      return res.redirect('/admin');
    }
    res.redirect('/login');
  });
});

// --- POST /logout
router.post('/logout', async (req, res) => {
  const utilisateur = req.session.utilisateur;
  if (utilisateur) {
    await new Log({
      utilisateurId: utilisateur._id,
      email: utilisateur.email,
      action: 'logout',
      ip: req.ip
    }).save();
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Erreur de session:', err);
      return res.redirect('/admin');
    }
    res.redirect('/login');
  });
});

// --- GET /register
router.get('/register', (req, res) => {
  res.render('register', {
    nom: '',
    email: '',
    role: '',
    erreur: '',
    codeSent: false,
    inscriptionReussie: false,
  });
});

// --- POST /register
router.post('/register', async (req, res) => {
  const { nom, email, motdepasse, role, codeSaisi } = req.body;

  if (codeSaisi) {
    const tempUtilisateur = req.session.tempUtilisateur;
    if (!tempUtilisateur) {
      req.flash('error', 'Session expirée. Veuillez recommencer.');
      return res.redirect('/register');
    }

    if (codeSaisi !== tempUtilisateur.code) {
      return res.render('register', {
        erreur: 'Code incorrect.',
        nom: tempUtilisateur.nom,
        email: tempUtilisateur.email,
        role: tempUtilisateur.role,
        codeSent: true,
        inscriptionReussie: false,
      });
    }

    const hash = await bcrypt.hash(tempUtilisateur.motdepasse, 10);
    await new Utilisateur({
      nom: tempUtilisateur.nom,
      email: tempUtilisateur.email,
      motdepasse: hash,
      role: tempUtilisateur.role
    }).save();

    delete req.session.tempUtilisateur;

    return res.render('register', {
      nom: '',
      email: '',
      role: '',
      erreur: '',
      codeSent: false,
      inscriptionReussie: true
    });
  }

  const existe = await Utilisateur.findOne({ email });
  if (existe) {
    return res.render('register', {
      erreur: 'Cet email est déjà utilisé.',
      nom,
      email,
      role,
      codeSent: false,
      inscriptionReussie: false,
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.tempUtilisateur = { nom, email, motdepasse, role, code };

  await envoyerCode(email, code);

  return res.render('register', {
    nom,
    email,
    role,
    erreur: '',
    codeSent: true,
    inscriptionReussie: false,
  });
});

module.exports = router;
