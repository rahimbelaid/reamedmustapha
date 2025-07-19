const Carousel = require('../models/carrousel.model');
const Actualite = require('../models/actualite.model');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary'); // config Cloudinary

// ✅ Afficher page d’accueil
exports.afficherAccueil = async (req, res) => {
  try {
    const imagesCarousel = await Carousel.find();
    res.render('index', { imagesCarousel });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement de la page d'accueil.");
  }
};

// ✅ Afficher page admin
exports.afficherSite = async (req, res) => {
  try {
    const imagesCarousel = await Carousel.find().sort({ createdAt: -1 });
    const actualites = await Actualite.find().sort({ datePublication: -1 });
    res.render('site', { imagesCarousel, actualites });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement de la page d'administration.");
  }
};

// ✅ Ajouter une image (vers Cloudinary)
exports.ajouterImage = async (req, res) => {
  try {
    const image = new Carousel({
      url: req.file.path, // URL complète Cloudinary
      public_id: req.file.filename // utile pour suppression
    });
    await image.save();
    res.redirect('/admin/site');
  } catch (err) {
    res.status(500).send("Erreur lors de l'upload.");
  }
};

// ✅ Supprimer une image (Cloudinary + Mongo)
exports.supprimerImage = async (req, res) => {
  try {
    const image = await Carousel.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image non trouvée.");
    }

    // Supprimer de Cloudinary si public_id existe
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Supprimer de MongoDB
    await Carousel.findByIdAndDelete(req.params.id);

    res.redirect('/admin/site');
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).send("Erreur lors de la suppression.");
  }
}