const express = require('express');
const router = express.Router();
const uploadPoster = require('../middlewares/uploadPoster');
const Poster = require('../models/Poster');
const { cloudinary } = require('../config/cloudinary');

router.post('/admin/poster', uploadPoster.single('image'), async (req, res) => {
  const { lien } = req.body;

  const oldPoster = await Poster.findOne({});
  if (oldPoster) {
    await cloudinary.uploader.destroy(oldPoster.cloudinaryId);
    await oldPoster.deleteOne();
  }

  const newPoster = new Poster({
    url: req.file.path,
    cloudinaryId: req.file.filename,
    lien
  });

  await newPoster.save();
  res.redirect('/admin/poster');
});
