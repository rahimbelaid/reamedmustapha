const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const Utilisateur = require('../models/utilisateur');
const Log = require('../models/log');
const { envoyerCode } = require('../utils/mailer');
const authController = require('../controllers/authController');
// GET /login
router.get('/login', (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');

  res.render('login', {
    title: 'Connexion - Service de Réanimation',
    messages: {
      error,
      success
    },
    utilisateur: req.utilisateur || null
  });
});

// POST /login
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
      error: 'Votre compte est inactif , veuillez contacter un administrateur. Merci ',
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
      console.error('❌ Erreur de sauvegarde session:', err);
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

// POST /reset-password
      router.post('/reset-password', authController.resetPassword);
;

    // Toujours répondre de la même façon pour éviter les fuites
    if (!utilisateur) {
      return res.status(200).send('Si un compte existe, un mail a été envoyé.');
    }

    // Générer un mot de passe temporaire (8 caractères alphanumériques)
    const tempPassword = Math.random().toString(36).slice(-8);

    // Hasher et enregistrer ce mot de passe temporaire
    utilisateur.motdepasse = await bcrypt.hash(tempPassword, 10);
    await utilisateur.save();

    // Configuration du transporteur e-mail
    const transporter = require('nodemailer').createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: utilisateur.email,
      subject: 'Votre nouveau mot de passe temporaire',
      html: `
        <p>Bonjour,</p>
        <p>Voici votre nouveau mot de passe temporaire :</p>
        <h3>${tempPassword}</h3>
        <p>Nous vous recommandons de le changer dès votre prochaine connexion.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Si un compte existe, un mail a été envoyé.');
  } catch (err) {
    console.error('Erreur lors de la réinitialisation :', err);
    res.status(500).send("Une erreur est survenue.");
  }
});

// GET /logout
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
      console.error('Erreur lors de la destruction de la session:', err);
      return res.redirect('/admin');
    }
    res.redirect('/login');
  });
});

// POST /logout
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
      console.error('Erreur lors de la destruction de la session:', err);
      return res.redirect('/admin');
    }
    res.redirect('/login');
  });
});

// GET /register
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

// POST /register
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