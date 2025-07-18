require('dotenv').config(); // Charger les variables d'environnement

const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectDB = require('./config/db'); // Importer la fonction de connexion à MongoDB
connectDB(); // Connecter à MongoDB
const cron = require('node-cron'); // 🔁 Cron pour exécuter receiveMail
const { exec } = require('child_process');

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGO_URL = process.env.MONGO_URL;

if (!SESSION_SECRET || !MONGO_URL) {
  console.error('❌ SESSION_SECRET ou MONGO_URL manquant dans .env');
  process.exit(1);
}

// ✅ Autoriser Express à faire confiance au proxy (Nginx, Railway, etc.)
app.set('trust proxy', 1);

// ✅ Configuration du moteur de vues et des dossiers statiques
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Middleware de session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
    cookie: {
      maxAge: 3600000, // 1 heure
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// ✅ Middleware Flash pour messages d'erreur/succès
app.use(flash());

// ✅ Middleware global : rendre utilisateur et flash visibles dans les vues
app.use((req, res, next) => {
  const utilisateur = req.session.utilisateur || null;
  res.locals.utilisateur = utilisateur;
  res.locals.utilisateurConnecte = !!utilisateur;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ✅ Importation des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const apiRoutes = require('./routes/api');
const contactRoutes = require('./routes/contact');
const messagerieRoutes = require('./routes/messagerie');
const siteRoutes = require('./routes/site');
const carouselRoutes = require('./routes/carousel');

// ✅ Utilisation des routes
app.use(authRoutes);
app.use(adminRoutes);
app.use(contactRoutes);
app.use(publicRoutes);
app.use('/api', apiRoutes);
app.use('/messagerie', messagerieRoutes);
app.use(adminRoutes);
app.use('/admin', siteRoutes);
app.use('/uploads', express.static('uploads'));
app.use(carouselRoutes);

// ✅ Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).render('404');
});

module.exports = app;