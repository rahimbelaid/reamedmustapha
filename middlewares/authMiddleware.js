// middlewares/authMiddleware.js

function getUtilisateur(req) {
  return req.session.utilisateur || null;
}

function estconnecte(req, res, next) {
  const utilisateur = getUtilisateur(req);
  if (utilisateur) return next();
  return res.redirect('/login');
}

function estmedecin(req, res, next) {
  const utilisateur = getUtilisateur(req);
  if (utilisateur && utilisateur.role === 'medecin') return next();
  return res.redirect('/login');
}

function estadmin(req, res, next) {
  const utilisateur = getUtilisateur(req);
  if (utilisateur && (utilisateur.role === 'admin' || utilisateur.role === 'adminprincipal')) return next();
  return res.redirect('/login');
}

function estadminprincipal(req, res, next) {
  const utilisateur = getUtilisateur(req);
  if (utilisateur && utilisateur.role === 'adminprincipal') return next();
  return res.redirect('/login');
}

function estSuperAdmin(req, res, next) {
  if (req.session.utilisateur && req.session.utilisateur.role === 'superadmin') {
    return next();
  }
  return res.status(403).send('Accès interdit');
}

// ✅ Regrouper tous les middlewares dans un seul export
module.exports = {
  estconnecte,
  estmedecin,
  estadmin,
  estadminprincipal,
  estSuperAdmin,
};


