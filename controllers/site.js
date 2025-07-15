// controllers/site.js
const Actualite = require('../models/actualite.model');

// Afficher la page admin avec les actualités existantes
exports.renderAdminPage = async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ createdAt: -1 });
    res.render('site', {
      actualites,
      user: req.session.utilisateur
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
