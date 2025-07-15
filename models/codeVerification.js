// models/codeVerification.js
const mongoose = require('mongoose');

const codeVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now, expires: 300 } // expire en 5 minutes
});

module.exports = mongoose.model('CodeVerification', codeVerificationSchema);
