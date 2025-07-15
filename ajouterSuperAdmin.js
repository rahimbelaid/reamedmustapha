const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./models/utilisateur'); // vérifie le chemin si ton modèle est ailleurs

async function ajouterSuperAdmin() {
  // ✅ Remplace par le nom réel de ta base
  await mongoose.connect('mongodb://localhost:27017/reamedDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const email = 'rahimbelaid@gmail.com';

  // Vérifie s’il existe déjà
  const dejaExistant = await Utilisateur.findOne({ email });
  if (dejaExistant) {
    console.log('Le super admin existe déjà.');
    return mongoose.disconnect();
  }

  // 🔐 Hacher le mot de passe
  const hashedPassword = await bcrypt.hash('rymoushka', 12);

  // ➕ Créer l’utilisateur
  const superAdmin = new Utilisateur({
    nom: 'Belaid Abderrahim',
    email: 'rahimbelaid@gmail.com',
    motdepasse: hashedPassword,
    role: 'adminprincipal', 
    superadmin: true, // Il a un accès total
    actif: true // On l’active directement
  });

  await superAdmin.save();
  console.log('✅ Super admin ajouté avec succès.');

  mongoose.disconnect();
}

ajouterSuperAdmin();
