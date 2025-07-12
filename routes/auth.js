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

// GET /login
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Connexion - Service de Réanimation',
    error: req.flash('error'),
    success: req.flash('success'),
    utilisateur: req.user || null
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
})
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    // Toujours répondre pareil par sécurité
    if (!utilisateur) {
      return res.status(200).send('Si un compte existe, un mail a été envoyé.');
    }

    // Générer un token JWT valable 1h
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Transporter pour envoyer l'e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      }
    });

    // Contenu de l'e-mail
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: utilisateur.email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Si un compte existe, un mail a été envoyé.');
  } catch (err) {
    console.error('Erreur :', err);
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
    codeSent: false
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
        codeSent: true
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
    req.flash('success', 'Inscription réussie.');
    return res.redirect('/login');
  }

  const existe = await Utilisateur.findOne({ email });
  if (existe) {
    return res.render('register', {
      erreur: 'Cet email est déjà utilisé.',
      nom,
      email,
      role,
      codeSent: false
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
    codeSent: true
  });
});

module.exports = router;