// Initialisation de GSAP
gsap.registerPlugin(ScrollTrigger);

// Configuration des mots et variables d'état
const words = [
  "multilingue.",
  "facile.",
  "accessible.",
  "conforme.",
  "animé.",
  "visible.",
  "mobile.",
  "webflow.",
];
let currentWord = words[0];
let currentAnimation = null;
let isAnimating = false;
const container = document.querySelector(".word-container");

// Fonction pour changer le mot affiché
function setWord(newWord) {
  if (newWord === currentWord || isAnimating) return;

  // Arrêter toute animation en cours
  if (currentAnimation) {
    currentAnimation.kill();
  }

  isAnimating = true;

  // Nettoyer tous les éléments word existants sauf le premier
  const existingWords = container.querySelectorAll(".word");
  if (existingWords.length > 1) {
    for (let i = 1; i < existingWords.length; i++) {
      existingWords[i].remove();
    }
  }

  // S'assurer qu'il n'y a qu'une seule bulle
  const bubbles = container.querySelectorAll(".word-bubble");
  if (bubbles.length > 1) {
    for (let i = 1; i < bubbles.length; i++) {
      bubbles[i].remove();
    }
  }

  const oldWordEl = container.querySelector(".word");
  const newWordEl = document.createElement("div");
  newWordEl.className = "word";
  newWordEl.textContent = newWord;
  newWordEl.style.transform = "translateY(100%)";

  // Trouver la bulle existante ou en créer une nouvelle
  let wordBubble = container.querySelector(".word-bubble");
  if (!wordBubble) {
    wordBubble = document.createElement("div");
    wordBubble.className = "word-bubble";
    container.appendChild(wordBubble);
  }

  wordBubble.appendChild(newWordEl);

  // Créer une timeline pour synchroniser les animations
  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      currentAnimation = null;
      // Nettoyer l'ancien élément
      if (oldWordEl && oldWordEl.parentNode) {
        oldWordEl.remove();
      }
      // S'assurer qu'il n'y a qu'un seul mot dans la bulle
      const cleanupBubble = container.querySelector(".word-bubble");
      if (cleanupBubble) {
        const wordsInBubble = cleanupBubble.querySelectorAll(".word");
        if (wordsInBubble.length > 1) {
          for (let i = 1; i < wordsInBubble.length; i++) {
            wordsInBubble[i].remove();
          }
        }
      }
    },
  });

  // Animer l'ancien mot vers le haut
  tl.to(
    oldWordEl,
    {
      y: "-100%",
      duration: 0.4,
      ease: "power2.out",
    },
    0
  );

  // Animer le nouveau mot vers sa position finale
  tl.to(
    newWordEl,
    {
      y: "0%",
      duration: 0.4,
      ease: "power2.out",
    },
    0
  );

  // S'assurer que l'animation de basculement continue
  const currentBubble = container.querySelector(".word-bubble");
  if (currentBubble) {
    currentBubble.style.animation = "gentleRock 3s ease-in-out infinite";
  }

  currentAnimation = tl;
  currentWord = newWord;
}

// Créer les triggers ScrollTrigger avec une logique robuste
words.forEach((word, i) => {
  ScrollTrigger.create({
    trigger: `.content-${i + 1}`,
    start: "top center",
    end: "bottom center",
    onEnter: () => setWord(word),
    onEnterBack: () => setWord(word),
    onLeave: () => {
      // Si on sort vers le bas, aller au mot suivant
      if (i < words.length - 1) {
        setWord(words[i + 1]);
      }
    },
    onLeaveBack: () => {
      // Si on sort vers le haut, aller au mot précédent
      if (i > 0) {
        setWord(words[i - 1]);
      }
    },
  });
});

// Afficher le sticky wrapper après le scroll du Hero
ScrollTrigger.create({
  trigger: ".hero",
  start: "bottom center",
  end: "bottom top",
  onEnter: () => {
    gsap.to(".sticky-wrapper", {
      opacity: 1,
      transform: "translateY(0)",
      duration: 0.5,
      ease: "power2.out",
    });
  },
  onLeaveBack: () => {
    gsap.to(".sticky-wrapper", {
      opacity: 0,
      transform: "translateY(-100%)",
      duration: 0.5,
      ease: "power2.out",
    });
  },
});

// Masquer le sticky wrapper à partir de la section "Notre méthode"
ScrollTrigger.create({
  trigger: ".process-section",
  start: "top center",
  end: "bottom center",
  onEnter: () => {
    gsap.to(".sticky-wrapper", {
      opacity: 0,
      transform: "translateY(-100%)",
      duration: 0.5,
      ease: "power2.out",
    });
  },
  onLeaveBack: () => {
    // Réafficher le sticky quand on remonte avant la section process
    gsap.to(".sticky-wrapper", {
      opacity: 1,
      transform: "translateY(0)",
      duration: 0.5,
      ease: "power2.out",
    });
  },
});

// Animation d'entrée au chargement de la page
gsap.from(".sticky-content h1", {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: "power2.out",
});

gsap.from(".phrase-container", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.3,
  ease: "power2.out",
});

// Animation des sections au scroll
gsap.utils.toArray(".section-content").forEach((section, i) => {
  gsap.from(section, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 90%",
      end: "bottom 10%",
      toggleActions: "play none none reverse",
    },
  });
});

// Animation des features
gsap.utils.toArray(".feature").forEach((feature, i) => {
  gsap.from(feature, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: feature,
      start: "top 95%",
      end: "bottom 5%",
      toggleActions: "play none none reverse",
    },
    delay: i * 0.05,
  });
});

// Animation des services
gsap.utils.toArray(".service-item").forEach((service, i) => {
  gsap.from(service, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: service,
      start: "top 95%",
      end: "bottom 5%",
      toggleActions: "play none none reverse",
    },
    delay: i * 0.05,
  });
});

// Animation des tarifs
gsap.utils.toArray(".pricing-item").forEach((pricing, i) => {
  gsap.from(pricing, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: pricing,
      start: "top 95%",
      end: "bottom 5%",
      toggleActions: "play none none reverse",
    },
    delay: i * 0.05,
  });
});

// Animation des autres éléments
gsap.utils
  .toArray(".step, .guarantee, .addon-item:not(.featured-addon), .module-item")
  .forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
      },
      delay: i * 0.02,
    });
  });

// Animation spécifique pour le featured-addon (plus tôt)
gsap.utils.toArray(".addon-item.featured-addon").forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    y: 15,
    duration: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 90%",
      end: "bottom 10%",
      toggleActions: "play none none reverse",
    },
  });
});

// Animation des titres de sections
gsap.utils.toArray(".section-content h2").forEach((title, i) => {
  gsap.from(title, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: title,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play none none reverse",
    },
  });
});

// Animation spécifique pour la section pricing
gsap.utils
  .toArray(
    ".pricing-section .intro-text, .pricing-main, .addons-section, .modules-section, .payment-section"
  )
  .forEach((section, i) => {
    gsap.from(section, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      delay: i * 0.1,
    });
  });

// Animation des éléments de pricing spécifiques
gsap.utils
  .toArray(
    ".pricing-main h3, .pricing-main .price, .addons-section h3, .modules-section h3, .payment-section h3"
  )
  .forEach((element, i) => {
    gsap.from(element, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
      },
      delay: i * 0.05,
    });
  });

// Menu Burger
const burger = document.querySelector(".nav-burger");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll(".nav-link, .nav-button").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Effet de parallaxe subtil sur les backgrounds
gsap.utils.toArray("section").forEach((section, i) => {
  gsap.to(section, {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
