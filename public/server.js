const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({
  secret: "secret-medical",
  resave: false,
  saveUninitialized: false
}));

// ⚠️ Simuler des utilisateurs
const utilisateurs = [
  { email: "medecin@example.com", motdepasse: "1234", actif: true, role: "medecin" },
  { email: "malade@example.com", motdepasse: "1234", actif: true, role: "malade" },
  { email: "attente@example.com", motdepasse: "1234", actif: false, role: "malade" }
];

// ➤ Page d'accueil
app.get("/", (req, res) => {
  res.render("index", { user: req.session.utilisateur });
});

// ➤ Formulaire de connexion
app.get("/login", (req, res) => {
  res.render("login", { erreur: null });
});

// ➤ Traitement du formulaire
// Connexion
app.post("/api/login", (req, res) => {
  const { email, motdepasse } = req.body;
  const utilisateur = utilisateurs.find(u => u.email === email && u.motdepasse === motdepasse);

  if (!utilisateur) {
    return res.json({ success: false, error: "identifiants" });
  }
  if (!utilisateur.actif) {
    return res.json({ success: false, error: "non_active" });
  }

  req.session.utilisateur = { email: utilisateur.email, role: utilisateur.role };
  res.json({ success: true, utilisateur: req.session.utilisateur });
});

// Vérification session
app.get("/api/session", (req, res) => {
  if (req.session.utilisateur) {
    res.json({ connecte: true, utilisateur: req.session.utilisateur });
  } else {
    res.json({ connecte: false });
  }
});


// ➤ Déconnexion
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ➤ Exemple de route sécurisée
app.get("/personnel", (req, res) => {
  if (!req.session.utilisateur || req.session.utilisateur.role !== "personnel") {
    return res.status(403).send("Accès refusé.");
  }
  res.send("Bienvenue dans l'espace personnel !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
app.use(express.static('public'));