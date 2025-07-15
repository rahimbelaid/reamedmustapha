const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function envoyerCode(email, code) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Code de vérification',
    text: `Voici votre code de vérification : ${code}`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { envoyerCode };