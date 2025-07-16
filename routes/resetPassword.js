const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

require('dotenv').config();

router.get('/reset-password', (req, res) => {
  res.render('reset-password');
});
// Transporteur d'e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Étape 1 : Demande d’envoi de code
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(404).send('Aucun utilisateur trouvé avec cet e-mail.');

    const code = crypto.randomInt(100000, 999999).toString();
    utilisateur.codeVerification = code;
    utilisateur.verificationExpire = new Date(Date.now() + 15 * 60 * 1000); // expire dans 15 min
    await utilisateur.save();

    await transporter.sendMail({
      from: `"Support" <${process.env.MAIL_USER}>`,
      to: utilisateur.email,
      subject: "Code de réinitialisation",
      text: `Voici votre code de réinitialisation : ${code}`
    });

    res.send('Code de vérification envoyé à votre adresse e-mail.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l’envoi du code.');
  }
});

// Étape 2 : Réinitialisation avec code
router.post('/reset-password', async (req, res) => {
  const { code, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({
      codeVerification: code,
      verificationExpire: { $gt: new Date() }
    });

    if (!utilisateur) return res.status(400).send("Code invalide ou expiré.");

    const hashedPassword = await bcrypt.hash(password, 10);
    utilisateur.motdepasse = hashedPassword;
    utilisateur.codeVerification = null;
    utilisateur.verificationExpire = null;
    await utilisateur.save();

    res.send('Votre mot de passe a été réinitialisé avec succès.');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la réinitialisation du mot de passe.");
  }
});

module.exports = router;