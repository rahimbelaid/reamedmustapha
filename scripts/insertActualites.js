// scripts/insertActualites.js
const mongoose = require('mongoose');
const Actualite = require('../models/actualite.model');

mongoose.connect('mongodb://localhost:3000/reamedDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const actualites = [
  {
    titre: 'Amélioration des protocoles de sédation',
    contenu: 'De nouvelles recommandations sur la sédation légère chez les patients intubés ont été publiées.',
    datePublication: new Date('2023-10-01T10:00:00Z'),
  },
  {
    titre: 'Mise à jour sur la ventilation non invasive',
    contenu: 'La SRLF propose une révision des pratiques concernant la VNI pour les patients post-chirurgie.',
  },
  {
    titre: 'Conférence sur le sepsis à Paris',
    contenu: 'Une conférence internationale sur le traitement du sepsis aura lieu en septembre à Paris.',
  },
  {
    titre: 'Nouvelle technologie de monitoring hémodynamique',
    contenu: 'Un dispositif non invasif pour surveiller la perfusion tissulaire est actuellement en test dans trois CHU.',
  }
];

Actualite.insertMany(actualites)
  .then(() => {
    console.log('Actualités ajoutées avec succès !');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Erreur lors de l\'ajout :', err);
  });
