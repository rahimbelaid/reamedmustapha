// middleware/upload.js

const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // dossier de destination
  },
  filename: (req, file, cb) => {
    // nom unique pour éviter les conflits
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Export du middleware
const upload = multer({ storage });

module.exports = upload;
