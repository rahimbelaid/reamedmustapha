// controllers/publicController.js

const Message = require('../models/message');
const Actualite = require('../models/actualite.model');
const Carousel = require('../models/carrousel.model');
const Notification = require('../models/notification.model');
const Poster = require('../models/Poster');

// Page d'accueil
exports.afficherAccueil = async (req, res) => {
  try {
    const utilisateur = req.session.utilisateur;
    const actualites = await Actualite.find().sort({ datePublication: -1 }).limit(4);
    const imagesCarousel = await Carousel.find();
    const poster = await Poster.findOne({});

    let notifications = [];
    if (utilisateur) {
      notifications = await Notification.find({
        destinataireRole: utilisateur.role
      }).sort({ date: -1 }).limit(10);
    }

    res.render('index', {
      utilisateur,
      actualites,
      imagesCarousel,
      notifications,
      poster
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      utilisateur: req.session.utilisateur,
      actualites: [],
      imagesCarousel: [],
      notifications: [],
      poster: null
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
