require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur');

const MONGO_URL = process.env.MONGO_URL;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connecté à MongoDB');

    const existing = await Utilisateur.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('⚠️ Superadmin existe déjà :', existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);

    const superadmin = new Utilisateur({
      nom: 'Dr BELAID Abderrahim',
      email: 'rahimbelaid@gmail.com',
      motdepasse: hashedPassword,
      role: 'adminprincipal',
    });

    await superadmin.save();
    console.log('✅ Superadmin créé avec succès');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
};

run();