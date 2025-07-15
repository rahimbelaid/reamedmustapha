// config/db.js

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté.nom');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error.message);
    process.exit(1); // Arrête l'app si la connexion échoue
  }
};

module.exports = connectDB;