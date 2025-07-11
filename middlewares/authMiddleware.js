// middlewares/authMiddleware.js

function getUtilisateur(req) {
  return req.session.utilisateur || req.session.user || null;
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

module.exports = {
  estconnecte,
  estmedecin,
  estadmin,
  estadminprincipal
};
