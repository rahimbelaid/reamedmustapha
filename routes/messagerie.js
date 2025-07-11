const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/message');
require('dotenv').config();

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ✅ Route POST pour répondre à un message reçu
router.post('/:id/repondre', async (req, res) => {
  const { objet, messageTexte } = req.body;

  try {
    const messageOriginal = await Message.findById(req.params.id);
    if (!messageOriginal) return res.status(404).send('Message non trouvé.');

    const mailOptions = {
      from: `"Service de réanimation médicale polyvalente CHU Mustapha" <${process.env.MAIL_USER}>`,
      to: messageOriginal.email,
      subject: objet,
      text: messageTexte
    };

    await transporter.sendMail(mailOptions);

    // Enregistrement du message envoyé
    const messageEnvoye = new Message({
      nom: messageOriginal.nom,
      email: messageOriginal.email,
      objet,
      message: messageTexte,
      type: 'envoye'
    });
    await messageEnvoye.save();

    res.redirect('/messagerie');
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error.message);
    res.status(500).send('Erreur lors de l’envoi de l’email');
  }
});


// ✅ Route POST pour "Nouveau message" (depuis le bouton en haut à droite)
router.post('/envoyer', async (req, res) => {
  const { email, objet, message } = req.body;

  if (!email || !message) {
    return res.status(400).send('Email et message sont requis.');
  }

  try {
    const mailOptions = {
      from: `"Service de réanimation médicale polyvalente CHU Mustapha" <${process.env.MAIL_USER}>`,
      to: email,
      subject: objet || '(Pas d\'objet)',
      text: message
    };

    await transporter.sendMail(mailOptions);

    // Enregistrer ce message comme "envoyé"
    const messageEnvoye = new Message({
      nom: 'Admin', // Ou autre nom par défaut
      email,
      objet,
      message,
      type: 'envoye'
    });
    await messageEnvoye.save();

    res.redirect('/messagerie');
  } catch (error) {
    console.error('Erreur envoi nouveau message :', error.message);
    res.status(500).send('Erreur lors de l’envoi du message.');
  }
});

module.exports = router;