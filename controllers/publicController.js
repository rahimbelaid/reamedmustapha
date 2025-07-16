const Message = require('../models/message');
const Actualite = require('../models/actualite.model');
const Carrousel = require('../models/carrousel.model'); // ✅ Assure-toi que ce modèle existe

// Page d'accueil
exports.afficherAccueil = async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ datePublication: -1 }).limit(4);
    const imagesCarrousel = await Carrousel.find(); // ✅ Charge les images du carrousel

    res.render('index', {
      utilisateur: req.session.utilisateur,
      actualites,
      imagesCarrousel, // ✅ Envoie à EJS
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      utilisateur: req.session.utilisateur,
      actualites: [],
      imagesCarrousel: [], // ✅ Toujours envoyer même en cas d'erreur
    });
  }
};


// Page de contact (GET)
exports.afficherContact = (req, res) => {
  res.render('contact', { utilisateur: req.session.utilisateur || null });
};

// Formulaire de contact (POST)
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