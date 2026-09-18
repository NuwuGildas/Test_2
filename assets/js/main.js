/*
  Cabinet Vétérinaire Wouri — comportements de la page d'accueil.
  Aucune dépendance externe. Chargé avec defer depuis index.html.

  Crochets data-* utilisés (présents dans index.html) :
    data-entete       en-tête collant, passe en mode compact au défilement
    data-menu         navigation principale, ouverte/fermée sur mobile
    data-menu-bouton  bouton hamburger qui pilote data-menu
    data-statut       texte « ouvert / fermé » calculé en direct
    data-faq          conteneur des <details> : un seul ouvert à la fois
    data-haut         bouton « revenir en haut »
    data-annee        année courante dans le pied de page
*/
(function () {
  'use strict';

  var doc = document;

  /* ------------------------------------------------------------------
     Horaires d'ouverture — heure de Douala (UTC+1, pas de changement d'heure).
     Mêmes valeurs que les openingHoursSpecification de index.html.
     Index : 0 = dimanche … 6 = samedi. null = fermé (urgences sur appel).
     Valeurs en minutes depuis minuit.
     ------------------------------------------------------------------ */
  var HORAIRES = {
    0: null,
    1: [480, 1080],
    2: [480, 1080],
    3: [480, 1080],
    4: [480, 1080],
    5: [480, 1080],
    6: [480, 840]
  };

  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  function heureDouala() {
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000);
  }

  function formatHeure(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return h + 'h' + (m < 10 ? '0' + m : m);
  }

  function prochaineOuverture(date) {
    var jour = date.getDay();
    var minutes = date.getHours() * 60 + date.getMinutes();
    for (var i = 0; i < 8; i++) {
      var j = (jour + i) % 7;
      var plage = HORAIRES[j];
      if (!plage) continue;
      if (i === 0 && minutes >= plage[0]) continue;
      if (i === 0) return 'ouverture à ' + formatHeure(plage[0]);
      if (i === 1) return 'ouverture demain à ' + formatHeure(plage[0]);
      return 'ouverture ' + JOURS[j] + ' à ' + formatHeure(plage[0]);
    }
    return 'urgences sur appel';
  }

  function majStatut() {
    var cible = doc.querySelector('[data-statut]');
    if (!cible) return;

    var d = heureDouala();
    var plage = HORAIRES[d.getDay()];
    var minutes = d.getHours() * 60 + d.getMinutes();
    var ouvert = !!plage && minutes >= plage[0] && minutes < plage[1];

    cible.textContent = ouvert
      ? 'Ouvert maintenant — jusqu\u2019à ' + formatHeure(plage[1])
      : 'Fermé — ' + prochaineOuverture(d);

    cible.setAttribute('data-statut', ouvert ? 'ouvert' : 'ferme');
    cible.setAttribute('aria-live', 'polite');
  }

  /* ------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------ */
  function initMenu() {
    var bouton = doc.querySelector('[data-menu-bouton]');
    var menu = doc.querySelector('[data-menu]');
    if (!bouton || !menu) return;

    function fermer() {
      menu.setAttribute('data-menu', 'ferme');
      bouton.setAttribute('aria-expanded', 'false');
    }

    function basculer() {
      var ouvert = bouton.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('data-menu', ouvert ? 'ferme' : 'ouvert');
      bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
    }

    bouton.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-menu', 'ferme');

    bouton.addEventListener('click', basculer);

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fermer();
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bouton.getAttribute('aria-expanded') === 'true') {
        fermer();
        bouton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) fermer();
    });
  }

  /* ------------------------------------------------------------------
     En-tête compact au défilement + bouton « revenir en haut »
     ------------------------------------------------------------------ */
  function initDefilement() {
    var entete = doc.querySelector('[data-entete]');
    var haut = doc.querySelector('[data-haut]');
    var enCours = false;

    function appliquer() {
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      if (entete) entete.setAttribute('data-entete', y > 40 ? 'compact' : 'normal');
      if (haut) {
        if (y > 600) haut.removeAttribute('hidden');
        else haut.setAttribute('hidden', '');
      }
      enCours = false;
    }

    window.addEventListener('scroll', function () {
      if (enCours) return;
      enCours = true;
      window.requestAnimationFrame(appliquer);
    }, { passive: true });

    if (haut) {
      haut.addEventListener('click', function () {
        var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: doux ? 'smooth' : 'auto' });
      });
    }

    appliquer();
  }

  /* ------------------------------------------------------------------
     FAQ : un seul <details> ouvert à la fois
     ------------------------------------------------------------------ */
  function initFaq() {
    var zone = doc.querySelector('[data-faq]') || doc;
    var items = zone.querySelectorAll('details');
    if (!items.length) return;

    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        Array.prototype.forEach.call(items, function (autre) {
          if (autre !== item) autre.open = false;
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Année du pied de page
     ------------------------------------------------------------------ */
  function initAnnee() {
    var cibles = doc.querySelectorAll('[data-annee]');
    var annee = String(heureDouala().getFullYear());
    Array.prototype.forEach.call(cibles, function (c) {
      c.textContent = annee;
    });
  }

  function init() {
    initMenu();
    initDefilement();
    initFaq();
    initAnnee();
    majStatut();
    window.setInterval(majStatut, 60000);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
