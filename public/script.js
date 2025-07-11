// Partie : affichage selon l'état de connexion
document.addEventListener("DOMContentLoaded", () => {
  const btnConnexion = document.getElementById("btnConnexion");
  const btnInscription = document.getElementById("btnInscription");
  const btnDeconnexion = document.getElementById("btnDeconnexion");
  const lienMalades = document.getElementById("lienMalades");
  const lienPersonnel = document.getElementById("lienPersonnel");
  const contenuConnecte = document.getElementById("contenuConnecte");
  const contenuInvite = document.getElementById("contenuInvite");

  // Valeur par défaut : utilisateur non connecté
  btnConnexion.style.display = "inline-block";
  btnInscription.style.display = "inline-block";
  btnDeconnexion.style.display = "none";

  lienMalades.style.display = "none";
  lienPersonnel.style.display = "none";

  contenuConnecte.style.display = "none";
  contenuInvite.style.display = "block";
});

// Fonction de déconnexion
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Partie : diaporama d'images
const images = [
  "images/panorama1.jpg",
  "images/panorama2.jpg",
  "images/panorama3.jpg"
];
let current = 0;

function changerImage() {
  const section = document.querySelector(".diapo-fond");
  if (section) {
    section.style.backgroundImage = `url('${images[current]}')`;
    current = (current + 1) % images.length;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  changerImage();
  setInterval(changerImage, 5000);
});
const form = document.getElementById('contactForm');
const overlay = document.getElementById('confirmationOverlay');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  form.reset();
  overlay.style.display = 'flex';
});

// Ferme le popup si on clique n'importe où
document.addEventListener('click', function () {
  overlay.style.display = 'none';
});
// Simule l'état d'un utilisateur (à remplacer par une vraie logique d'authentification)
const utilisateur = {
  isAuthenticated: true,
  role: 'personnel' // ou 'malade' ou null
};

window.addEventListener('DOMContentLoaded', () => {
  const btnConnexion = document.getElementById('btnConnexion');
  const btnInscription = document.getElementById('btnInscription');
  const btnDeconnexion = document.getElementById('btnDeconnexion');
  const lienMalades = document.getElementById('lienMalades');
  const lienPersonnel = document.getElementById('lienPersonnel');

  // Affiche les bons boutons/espaces selon l'état utilisateur
  if (utilisateur.isAuthenticated) {
    btnConnexion.style.display = 'none';
    btnInscription.style.display = 'none';
    btnDeconnexion.style.display = 'inline-block';

    if (utilisateur.role === 'malade') {
      lienMalades.style.display = 'inline';
    } else if (utilisateur.role === 'personnel') {
      lienPersonnel.style.display = 'inline';
    }
  } else {
    btnConnexion.style.display = 'inline-block';
    btnInscription.style.display = 'inline-block';
    btnDeconnexion.style.display = 'none';
  }

  // Gestion du formulaire de contact
  const form = document.getElementById('contactForm');
  const overlay = document.getElementById('confirmationOverlay');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Ici tu peux ajouter un envoi à un serveur avec fetch()

    overlay.style.display = 'flex';

    setTimeout(() => {
      overlay.style.display = 'none';
      form.reset();
    }, 4000); // Masque le message après 4 secondes
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  const confirmationOverlay = document.getElementById('confirmationOverlay');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      this.reset();
      confirmationOverlay.style.display = 'flex';
      setTimeout(() => {
        confirmationOverlay.style.display = 'none';
      }, 4000);
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  // Vérifie s’il n’existe pas déjà
  if (!document.querySelector('.poster-lateral')) {
    const poster = document.createElement('div');
    poster.className = 'poster-lateral';

    const image = document.createElement('img');
    image.src = 'ton-image.jpg'; // Remplace par le bon chemin si nécessaire
    image.alt = 'SARM Affiche';

    poster.appendChild(image);
    document.body.appendChild(poster);
  }
});
