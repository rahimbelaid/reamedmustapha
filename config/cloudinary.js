const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configuration depuis .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ✅ Stockage pour le carousel (images uniquement)
const carouselStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'carousel',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  },
});

// ✅ Stockage pour les posters (images uniquement)
const posterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posters',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  },
});

// ✅ Stockage pour les formations (PDF, vidéos, etc.)
const formationStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'formations',
    resource_type: 'auto', // gère mp4, pdf, ppt, etc.
    allowed_formats: ['pdf', 'mp4', 'ppt', 'pptx'],
  },
});

module.exports = {
  cloudinary,
  carouselStorage,
  posterStorage,
  formationStorage,
};
