const Message = require('../models/message');

exports.afficherAccueil = (req, res) => {
  res.render('index', { utilisateur: req.session.utilisateur || null });
};

exports.afficherContact = (req, res) => {
  res.render('contact', { utilisateur: req.session.utilisateur || null });
};

exports.envoyerMessage = async (req, res) => {
  const { nom, email, message } = req.body;
  if (!nom || !email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    await Message.create({ nom, email, message });
    res.status(200).json({ message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur /contact:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
