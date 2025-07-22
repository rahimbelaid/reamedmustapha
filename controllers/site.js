const Carousel = require('../models/carrousel.model');
const Actualite = require('../models/actualite.model');
const Formation = require('../models/formation.model'); // 🔹 Assure-toi que ce modèle existe et est bien importé

// Afficher la page admin avec actualités, images carrousel et formations
exports.renderAdminPage = async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ createdAt: -1 });
    const imagesCarousel = await Carousel.find();
    const formations = await Formation.find().sort({ createdAt: -1 }); // 🔹 On récupère les formations

    res.render('site', {
      utilisateur: req.session.utilisateur || null,
      actualites,
      imagesCarousel,
      formations, // 🔹 On transmet la variable à la vue
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// Ajouter une actualité
exports.addActualite = async (req, res) => {
  try {
    const { titre, description, contenu } = req.body;
    await Actualite.create({ titre, description, contenu });
    res.redirect('/admin');
  } catch (err) {
    console.error('Erreur lors de l’ajout :', err);
    res.status(500).send('Erreur serveur');
  }
};

// Supprimer une actualité
exports.deleteActualite = async (req, res) => {
  try {
    await Actualite.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
    res.status(500).send('Erreur serveur');
  }
};
