// routes/public.js
const express = require('express');
const router = express.Router();
const { afficherAccueil, afficherContact, envoyerMessage } = require('../controllers/publicController');

router.get('/', afficherAccueil);
router.get('/contact', afficherContact);
router.post('/contact', envoyerMessage);

module.exports = router;