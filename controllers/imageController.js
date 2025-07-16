const Image = require('../models/Image');
const path = require('path');
const fs = require('fs');

// Afficher page d’accueil
exports.afficherAccueil = async (req, res) => {
  try {
    const imagesCarrousel = await Image.find();
    res.render('index', { imagesCarrousel });
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page d\'accueil.');
  }
};

// Afficher page admin
exports.afficherSite = async (req, res) => {
  try {
    const imagesCarrousel = await Image.find().sort({ createdAt: -1 });
    res.render('site', { imagesCarrousel });
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page d\'administration.');
  }
};

// Ajouter une image
exports.ajouterImage = async (req, res) => {
  try {
    const image = new Image({ url: req.file.filename });
    await image.save();
    res.redirect('/admin/site');
  } catch (err) {
    res.status(500).send('Erreur lors de l\'upload.');
  }
};

// Supprimer une image
exports.supprimerImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image non trouvée.");
    }

    const imagePath = path.join(__dirname, '../public/uploads', image.url);
    console.log("Suppression de :", imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Fichier supprimé du disque.");
    } else {
      console.log("Fichier introuvable.");
    }

    await Image.findByIdAndDelete(req.params.id);
    res.redirect('/admin/site');
  } catch (err) {
    console.error("Erreur suppression :", err);
    res.status(500).send('Erreur suppression');
  }
};