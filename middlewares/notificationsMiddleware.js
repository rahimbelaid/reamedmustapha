// middlewares/notificationsMiddleware.js
const Notification = require('../models/notification.model');

module.exports = async (req, res, next) => {
  try {
    const utilisateur = req.session.utilisateur;

    if (utilisateur) {
      const notifications = await Notification.find({
        destinataireRole: utilisateur.role
      }).sort({ date: -1 }).limit(10);

      res.locals.notifications = notifications;
    } else {
      res.locals.notifications = [];
    }
  } catch (err) {
    console.error('Erreur lors du chargement des notifications :', err);
    res.locals.notifications = [];
  }

  next();
};
