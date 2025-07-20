const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Stockage Cloudinary pour le poster
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posters',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;