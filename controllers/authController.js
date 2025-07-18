const authService = require('../services/auth.service');

exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  try {
    await authService.sendCode(email);
    res.send("Code envoyé à votre adresse e-mail.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'envoi du code.");
  }
};

exports.resetPassword = async (req, res) => {
  const { code, password } = req.body;
  try {
    await authService.resetPassword(code, password);
    res.send("Mot de passe réinitialisé avec succès !");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message || "Erreur lors de la réinitialisation.");
  }
};