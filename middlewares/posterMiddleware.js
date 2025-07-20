const Poster = require('../models/Poster');

module.exports = async (req, res, next) => {
  try {
    const poster = await Poster.findOne({});
    res.locals.poster = poster; // rendu accessible dans toutes les vues EJS
  } catch (err) {
    console.error('Erreur chargement du poster :', err);
    res.locals.poster = null;
  }
  next();
};