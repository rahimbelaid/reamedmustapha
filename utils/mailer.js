const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // ex: votre adresse Gmail
    pass: process.env.MAIL_PASS // ex: mot de passe ou App Password
  }
});

/**
 * Envoie un e-mail avec un sujet et un texte personnalisés
 */
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Envoie un code de vérification à un email
 */
async function envoyerCode(email, code) {
  const text = `Voici votre code de vérification : ${code}`;
  return sendEmail(email, 'Code de vérification', text);
}

module.exports = {
  envoyerCode,
  sendEmail
};