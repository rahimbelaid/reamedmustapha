// imageController.js
const Carrousel = require('../models/carrousel.model'); // au lieu de Image
const Actualite = require('../models/actualite.model');
const path = require('path');
const fs = require('fs');

// Afficher page d’accueil
exports.afficherAccueil = async (req, res) => {
  try {
    const imagesCarrousel = await Carrousel.find(); // Carrousel au lieu de Image
    res.render('index', { imagesCarrousel });
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page d\'accueil.');
  }
};

// Afficher page admin
exports.afficherSite = async (req, res) => {
  try {
    const imagesCarrousel = await Carrousel.find().sort({ createdAt: -1 });
    const actualites = await Actualite.find().sort({ datePublication: -1 }); // ou createdAt si tu préfères
    res.render('site', { imagesCarrousel, actualites });
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page d\'administration.');
  }
};

// Ajouter une image
exports.ajouterImage = async (req, res) => {
  try {
    const image = new Carrousel({
      url: req.file.path, // ✅ L’URL Cloudinary complète
      public_id: req.file.filename // optionnel mais utile si tu veux supprimer après
    });
    await image.save();
    res.redirect('/admin/site');
  } catch (err) {
    res.status(500).send('Erreur lors de l\'upload.');
  }
};

// Supprimer une image
exports.supprimerImage = async (req, res) => {
  try {
    const image = await Carrousel.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image non trouvée.");
    }
    const imagePath = path.join(__dirname, '../public/uploads', image.url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await Carrousel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/site');
  } catch (err) {
    console.error("Erreur suppression :", err);
    res.status(500).send('Erreur suppression');
  }
};
