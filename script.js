//
//  script.js
//  
//
//  Created by Aimé TOSSOU on 24/06/2026.
//

/*
  =========================
  SCRIPT PRINCIPAL DU SITE
  =========================

  Ce fichier contient :
  1. Une validation simple du formulaire de contact
  2. Un espace où l'étudiant pourra ajouter d'autres fonctionnalités JavaScript

  Exemples de fonctionnalités à ajouter ensuite :
  - menu responsive
  - slider
  - FAQ accordéon
  - bouton retour en haut
  - dark mode
*/

/* =========================
   VALIDATION DU FORMULAIRE
========================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Récupération des champs
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    // Nettoyage des messages d'erreur précédents
    clearErrors();

    let isValid = true;

    // Validation du nom
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Le nom est obligatoire.");
      isValid = false;
    }

    // Validation de l'email
    if (emailInput.value.trim() === "") {
      showError(emailInput, "L'email est obligatoire.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Veuillez entrer un email valide.");
      isValid = false;
    }

    // Validation du message
    if (messageInput.value.trim() === "") {
      showError(messageInput, "Le message est obligatoire.");
      isValid = false;
    }

    // Si tout est correct
    if (isValid) {
      alert("Formulaire envoyé avec succès !");
      contactForm.reset();

      /*
        Ici, l'étudiant pourra plus tard :
        - envoyer les données vers un backend
        - afficher un message de succès dans la page
        - sauvegarder des données localement
      */
    }
  });
}

/* =========================
   FONCTIONS UTILITAIRES
========================= */

// Affiche un message d'erreur sous le champ
function showError(input, message) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message");
  errorElement.textContent = message;
}

// Supprime tous les messages d'erreur
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => {
    error.textContent = "";
  });
}

// Vérifie si l'email a un format simple valide
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/* =========================
   MENU RESPONSIVE (MOBILE)
========================= */

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  // Ouvre / ferme le menu au clic sur le bouton hamburger
  navToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Ferme le menu quand on clique sur un lien (sur mobile)
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
   BOUTON RETOUR EN HAUT
========================= */

const backToTop = document.getElementById("backToTop");

if (backToTop) {
  // Affiche le bouton après avoir défilé de 400px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  // Remonte tout en haut au clic
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   HEADER DYNAMIQUE AU DÉFILEMENT
========================= */

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  });
}

/* =========================
   ANIMATIONS À L'APPARITION (SCROLL REVEAL)
========================= */

// Éléments qui apparaîtront en douceur au défilement
const revealSelectors = [
  ".hero-text",
  ".hero-visual",
  ".about-text",
  ".about-stats .stat",
  ".section-title",
  ".section-intro",
  ".project-card",
  ".contact-form",
];

const revealElements = document.querySelectorAll(revealSelectors.join(","));

if ("IntersectionObserver" in window) {
  revealElements.forEach((el, index) => {
    el.classList.add("reveal");
    // petit décalage en cascade pour un effet élégant
    el.style.transitionDelay = (index % 6) * 0.08 + "s";
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Navigateur ancien : on affiche tout directement
  revealElements.forEach((el) => el.classList.add("visible"));
}

/* =========================
   COMPTEURS ANIMÉS (statistiques)
========================= */

const counters = document.querySelectorAll(".stat-number");

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // courbe d'accélération douce
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

if (counters.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));
}

/* =========================
   LIGHTBOX (agrandir les réalisations)
========================= */

const projectImages = document.querySelectorAll(".project-card .thumb");

if (projectImages.length) {
  // Création de la fenêtre d'agrandissement
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">&times;</button>
    <img src="" alt="" />
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  projectImages.forEach((img) => {
    img.addEventListener("click", () => {
      const card = img.closest(".project-card");
      const title = card.querySelector("h3")?.textContent || "";
      const cat = card.querySelector(".project-cat")?.textContent || "";
      openLightbox(img.src, cat + " — " + title);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

console.log("Le fichier JavaScript est bien chargé.");
