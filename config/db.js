// config/db.js
const mongoose = require('mongoose');
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');

const MONGO_URL = process.env.MONGO_URL;
mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connecté à MongoDB');

    const superadminEmail = 'rahimbelaid@gmail.com';
    const superadminMotDePasse = 'rymoushka';
    const superadminExiste = await Utilisateur.findOne({ email: superadminEmail });

    if (!superadminExiste) {
      await Utilisateur.create({
        nom: 'BELAID Abderrahim',
        email: superadminEmail,
        motdepasse: await bcrypt.hash(superadminMotDePasse, 10),
        role: 'adminprincipal',
        actif: true,
        superadmin: true
      });
      console.log('✅ Superadmin ajouté.');
    }

    const deja = await Utilisateur.findOne({ email: 'medecin@example.com' });
    if (!deja) {
      await Utilisateur.insertMany([
        { email: 'medecin@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'medecin', actif: true },
        { email: 'infirmier@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'infirmier', actif: true },
        { email: 'kine@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'kinesitherapeute', actif: true },
        { email: 'aide@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'aide-soignant', actif: true },
        { email: 'malade@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'malade', actif: false },
        { email: 'adminprincipal@example.com', motdepasse: await bcrypt.hash('1234', 10), role: 'adminprincipal', actif: true }
      ]);
      console.log('✅ Utilisateurs ajoutés.');
    }
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB:', err);
  });

module.exports = mongoose;