const { envoyerCode } = require('../utils/mailer');
const { generateCode } = require('../utils/generateCode');
const bcrypt = require('bcrypt');
const db = require('../models/user.model');

const codeStore = new Map(); // Temporaire en mémoire — à remplacer par base de données plus tard

// ✅ Envoie un code à l'utilisateur si trouvé
exports.sendCode = async (email) => {
  const utilisateur = await db.findUserByEmail(email);
  if (!utilisateur) throw new Error("Utilisateur introuvable");

  const code = generateCode();
  codeStore.set(code, utilisateur._id.toString());

  // Envoie l'e-mail ici (dans la fonction !)
  await envoyerCode(email, code);
};

// ✅ Vérifie le code et réinitialise le mot de passe
exports.resetPassword = async (code, newPassword) => {
  const utilisateurId = codeStore.get(code);
  if (!utilisateurId) throw new Error("Code invalide ou expiré");

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.updateUtilisateurPassword(utilisateurId, hashed);

  codeStore.delete(code);
};