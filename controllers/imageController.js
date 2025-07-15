const Image = require('../models/Image');
const path = require('path');
const fs = require('fs');

// Accueil (index.ejs)
exports.afficherAccueil = async (req, res) => {
  try {
    const imagesCarrousel = await Image.find(); // récupère toutes les images de la BDD
    res.render('index', { imagesCarrousel }); // on les envoie à la vue
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page d\'accueil.');
  }
};

// Admin (site.ejs)
exports.afficherSite = async (req, res) => {
  const imagesCarrousel = await Image.find().sort({ createdAt: -1 });
  res.render('site', { imagesCarrousel });
};

exports.ajouterImage = async (req, res) => {
  try {
    const image = new Image({ url: req.file.filename });
    await image.save();
    res.redirect('/site');
  } catch (err) {
    res.status(500).send('Erreur upload');
  }
};

exports.supprimerImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    const imagePath = path.join(__dirname, '../public/uploads', image.url);
    fs.unlinkSync(imagePath);
    await Image.findByIdAndDelete(req.params.id);
    res.redirect('/site');
  } catch (err) {
    res.status(500).send('Erreur suppression');
  }
};
