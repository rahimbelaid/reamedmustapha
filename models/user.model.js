const Utilisateur = require('./utilisateur'); // ← Assure-toi que c'est bien le bon chemin vers ton modèle Mongoose

// Trouver un utilisateur par email
exports.findUserByEmail = async (email) => {
  return await Utilisateur.findOne({ email });
};

// Mettre à jour le mot de passe d’un utilisateur par son ID
exports.updateUserPassword = async (id, hashedPassword) => {
  return await Utilisateur.findByIdAndUpdate(
    id,
    { motdepasse: hashedPassword },
    { new: true }
  );
};