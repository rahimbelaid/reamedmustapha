const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middlewares/upload'); // assure-toi que ce fichier existe

router.get('/site', imageController.afficherSite);
router.post('/upload', upload.single('image'), imageController.ajouterImage);
router.get('/supprimer/:id', imageController.supprimerImage);

module.exports = router;
