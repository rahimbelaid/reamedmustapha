const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');

// ✅ Valider un utilisateur (le rendre actif)
router.post('/valider/:id', async (req, res) => {
  await Utilisateur.findByIdAndUpdate(req.params.id, { actif: true });
  res.sendStatus(200);
});

// ✅ Supprimer un utilisateur
router.delete('/supprimer/:id', async (req, res) => {
  await Utilisateur.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// ✅ Promouvoir un utilisateur (changer rôle en admin)
router.post('/promouvoir/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) return res.status(404).send('Utilisateur non trouvé');

    const update = { role: 'admin' };

    // Enregistrer le rôle initial s’il n'existe pas
    if (!utilisateur.roleInitial) {
      update.roleInitial = utilisateur.role;
    }

    await Utilisateur.findByIdAndUpdate(req.params.id, update);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ✅ Promouvoir en admin principal
router.post('/promouvoir-principal/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) return res.status(404).send('Utilisateur non trouvé');

    const update = { role: 'adminprincipal' };

    if (!utilisateur.roleInitial) {
      update.roleInitial = utilisateur.role;
    }

    await Utilisateur.findByIdAndUpdate(req.params.id, update);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ✅ Revenir au rôle initial
router.post('/retablir-role/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur || !utilisateur.roleInitial) {
      return res.status(400).send('Rôle initial introuvable');
    }

    await Utilisateur.findByIdAndUpdate(req.params.id, { role: utilisateur.roleInitial });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ✅ Revenir à un rôle admin (depuis adminPrincipal par exemple)
router.post('/revenir-admin/:id', async (req, res) => {
  try {
    await Utilisateur.findByIdAndUpdate(req.params.id, { role: 'admin' });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;