// controllers/authController.js
require('dotenv').config()
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// 📩 Étape 1 : Demande de réinitialisation de mot de passe
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    // Réponse générique pour éviter les fuites
    if (!utilisateur) {
      return res.status(200).send('Si un compte existe, un mail a été envoyé.');
    }

    // Générer un code temporaire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes

    utilisateur.resetPasswordCode = code;
    utilisateur.resetPasswordExpire = expiration;
    await utilisateur.save();

    // Envoi du code par e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: utilisateur.email,
      subject: 'Code de réinitialisation de mot de passe',
      html: `
        <p>Bonjour,</p>
        <p>Voici votre code de réinitialisation :</p>
        <h2>${code}</h2>
        <p>Ce code est valable pendant 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Si un compte existe, un mail a été envoyé.');
  } catch (err) {
    console.error('Erreur lors de la demande de réinitialisation :', err);
    res.status(500).send("Une erreur est survenue.");
  }
};

// 🔒 Étape 2 : Réinitialisation avec le code
exports.resetPassword = async (req, res) => {
  const { code, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({
      resetPasswordCode: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!utilisateur) {
      return res.status(400).send("Code invalide ou expiré.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    utilisateur.motdepasse = hashedPassword;
    utilisateur.resetPasswordCode = undefined;
    utilisateur.resetPasswordExpire = undefined;

    await utilisateur.save();

    res.send("Mot de passe réinitialisé avec succès.");
  } catch (err) {
    console.error('Erreur lors de la réinitialisation :', err);
    res.status(500).send("Erreur lors de la réinitialisation du mot de passe.");
  }
};
