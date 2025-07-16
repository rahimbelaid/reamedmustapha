const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  motdepasse: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [
      'admin', 'adminprincipal', 'superadmin',
      'medecin', 'infirmier', 'kinesitherapeute',
      'aide-soignant', 'manipulateur', 'malade'
    ],
    required: true
  },
  roleInitial: {
    type: String,
    enum: [
      'medecin', 'infirmier', 'kinesitherapeute',
      'aide-soignant', 'manipulateur', 'malade', null
    ],
    default: null
  },
  actif: {
    type: Boolean,
    default: false
  },
  superadmin: {
    type: Boolean,
    default: false
  },

  // ✅ Pour vérification de l'inscription
  codeVerification: { type: String },
  verificationExpire: { type: Date },

  // ✅ Pour réinitialisation de mot de passe
  resetPasswordCode: { type: String },
  resetPasswordExpire: { type: Date }

}, { timestamps: true });

utilisateurSchema.pre('save', function (next) {
  if (this.isNew && !this.roleInitial) {
    this.roleInitial = this.role;
  }
  next();
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);