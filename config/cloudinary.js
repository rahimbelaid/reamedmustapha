const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ✅ Deux stockages différents
const carouselStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'carousel',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const posterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posters',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

module.exports = {
  cloudinary,
  carouselStorage,
  posterStorage
};