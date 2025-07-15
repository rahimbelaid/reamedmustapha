const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String, // le nom du fichier, ex: "photo1.jpg"
  createdAt: {
    type: Date,
    default: Date.now
  }
});