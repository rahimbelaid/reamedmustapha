// controllers/authController.js

const Utilisateur = require('../models/utilisateur.model');
const bcrypt = require('bcrypt');

exports.resetPassword = async (req, res) => {
  const { code, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({
      resetPasswordCode: code,
      resetPasswordExpire: { $gt: Date.now() } // le code est encore valide
    });

    if (!utilisateur) {
      return res.status(400).send("Code invalide ou expiré.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    utilisateur.motdepasse = hashedPassword;
    utilisateur.resetPasswordCode = undefined;
    utilisateur.resetPasswordExpire = undefined;

    await utilisateur.save();

    res.send("Mot de passe réinitialisé avec succès.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la réinitialisation du mot de passe.");
  }
};
