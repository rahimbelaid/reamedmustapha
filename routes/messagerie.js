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

// ✅ GET /admin/messagerie — Affichage principal
router.get('/', async (req, res) => {
  const recherche = req.query.recherche || '';
  const tri = req.query.tri || 'date';
  const page = parseInt(req.query.page) || 1;
  const vue = req.query.vue === 'envoyes' ? 'envoyes' : 'recus';
  const messagesParPage = 10;

  try {
    const filtre = {
      ...(vue === 'envoyes' ? { type: 'envoye' } : { $or: [{ type: { $exists: false } }, { type: { $ne: 'envoye' } }] }),
      $or: [
        { nom: { $regex: recherche, $options: 'i' } },
        { email: { $regex: recherche, $options: 'i' } },
        { message: { $regex: recherche, $options: 'i' } },
      ]
    };

    const sortOptions = {
      date: { date: -1 },
      nom: { nom: 1 },
      email: { email: 1 },
    };

    const totalMessages = await Message.countDocuments(filtre);
    const totalPages = Math.ceil(totalMessages / messagesParPage);
    const messages = await Message.find(filtre)
      .sort(sortOptions[tri])
      .skip((page - 1) * messagesParPage)
      .limit(messagesParPage);

    res.render('/messagerie', {
      messages,
      currentPage: page,
      totalPages,
      tri,
      recherche,
      vue,
    });
  } catch (error) {
    console.error('Erreur chargement messagerie :', error.message);
    res.status(500).send('Erreur chargement messagerie');
  }
});

// ✅ POST /messagerie/:id/repondre — Répondre à un message reçu
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

    const messageEnvoye = new Message({
      nom: messageOriginal.nom,
      email: messageOriginal.email,
      objet,
      message: messageTexte,
      type: 'envoye'
    });

    await messageEnvoye.save();
    res.redirect('/messagerie?vue=envoyes');
  } catch (error) {
    console.error('Erreur lors de la réponse :', error.message);
    res.status(500).send('Erreur lors de la réponse');
  }
});

// ✅ POST /messagerie/envoyer — Nouveau message (admin)
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

    const messageEnvoye = new Message({
      nom: 'Admin',
      email,
      objet,
      message,
      type: 'envoye'
    });

    await messageEnvoye.save();
    res.redirect('messagerie?vue=envoyes');
  } catch (error) {
    console.error('Erreur envoi message :', error.message);
    res.status(500).send('Erreur envoi message');
  }
});

// ✅ POST /messagerie/:id/supprimer — Supprimer message
router.post('/:id/supprimer', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect('/messagerie');
  } catch (error) {
    console.error('Erreur suppression message :', error.message);
    res.status(500).send('Erreur suppression');
  }
});

module.exports = router;