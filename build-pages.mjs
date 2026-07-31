#!/usr/bin/env node
/* Générateur de pages — Di Dolce Desserts (V3)
   Usage : node build-pages.mjs
   Génère about.html, solutions.html, marque-privee.html, catalogue.html,
   contact.html, desserts.html, et une page par produit (produit-*.html). */
import { writeFileSync } from "node:fs";

const CSS_V = "31";
const JS_V = "31";

const LOGO_SVG = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="didolce-logo" viewBox="0 0 496.03 170.81">
      <g fill="currentColor">
        <path d="M69.43,95.92v.72h24.16c14.23,0,24.65-9.08,24.8-24.74.22-14.72-9.36-24.58-24.58-24.58h-24.38v.71c2.57,0,5.43.5,5.43,3.22v41.46c0,2.7-2.86,3.21-5.43,3.21M84.87,94.06v-44.25l8.72.07c7.94,0,14.07,8.57,14.01,22.08.06,12.72-5.21,22.1-13.79,22.1h-8.94ZM126.12,95.92v.72h20.87v-.72c-2.57,0-5.44-.51-5.44-3.21v-42.54c0-1.92,0-3.57.73-5.72-2.73,1.86-7.15,2.78-10.51,2.86h-5.64v.71c2.58,0,5.43.5,5.43,3.22v41.46c0,2.7-2.86,3.21-5.43,3.21M173.86,95.92v.72h24.16c14.23,0,24.67-9.08,24.81-24.74.21-14.72-9.37-24.58-24.59-24.58h-24.38v.71c2.57,0,5.43.5,5.43,3.22v41.46c0,2.7-2.86,3.21-5.43,3.21M189.3,94.06v-44.25l8.72.07c7.94,0,14.09,8.57,14.01,22.08.08,12.72-5.21,22.1-13.79,22.1h-8.94ZM256.86,97.35c14.22,0,24.65-9.8,24.8-25.45.22-14.72-9.01-25.3-24.23-25.3-14.23,0-24.67,9.8-24.73,25.3-.28,14.87,8.93,25.45,24.16,25.45M243.56,71.97c-1.65-12.58,2.5-21.59,11.07-21.59,7.94,0,14.58,8.08,16.23,21.59,1.57,12.72-2.57,21.74-11.15,21.74-8.01,0-14.73-8.16-16.16-21.74M289.39,95.92v.72h42.03c-2.72-3.22-4-5.72-3.86-8.94-7.57,0-8.08,6.43-17.95,6.43h-4.78v-43.95c0-1.92,0-3.57.71-5.72-2.72,1.86-7.15,2.78-10.51,2.86h-5.64v.71c2.57,0,5.43.5,5.43,3.22v41.46c0,2.7-2.86,3.21-5.43,3.21M355.93,50.17c-7.07,0-11.21,9.66-11.21,21.24s6.21,22.8,12.51,22.8,9.23-8.79,19.58-8.79c-.21,4.43-5.43,6.78-1.72,11.22-11.44-3.29-11.29.72-20.36.72-10.86,0-20.59-7.64-20.59-24.16,0-11.87,6.93-26.59,23.37-26.59,7.86,0,9.44,2.71,17.58.57-3,3.57-5.78,6.86-5.64,10.29-5.8-.29-6.29-7.29-13.52-7.29M384.52,95.92v.72h37.6l.29-.92,3.43-10.87-1.35-.42c-1.79,5.64-3.94,9.71-9.8,9.71h-14.01v-18.94c2.08-2.15,4.86-3.37,8.01-3.37,1.58,0,3.43.14,4.72.94.57-2.51,2.57-5.86,6.01-8.36h-6.93c-3.51,0-6.58,1.5-8.73,4.21l-3.08,3.8v-22.59h2.37c9.86,0,10.36,6.44,17.93,6.44-.14-3.22,1.15-5.73,3.86-8.94h-40.32v.71c2.58,0,5.43.5,5.43,3.22v41.46c0,2.7-2.86,3.21-5.43,3.21"/>
        <path d="M139.82,136.52v.27h9.23c5.44,0,9.41-3.47,9.48-9.45.08-5.62-3.59-9.39-9.4-9.39h-9.3v.27c.99,0,2.08.19,2.08,1.22v15.83c0,1.04-1.09,1.24-2.08,1.24M145.72,135.81v-16.89l3.32.04c3.03,0,5.38,3.27,5.34,8.42.04,4.86-1.99,8.43-5.26,8.43h-3.4ZM170.91,136.52v.27h14.36l.11-.35,1.31-4.16-.52-.15c-.69,2.16-1.51,3.7-3.74,3.7h-5.34v-7.23c.78-.82,1.84-1.29,3.05-1.29.6,0,1.31.05,1.79.36.22-.96.99-2.25,2.3-3.2h-2.65c-1.34,0-2.51.57-3.33,1.61l-1.17,1.44v-8.63h.89c3.77,0,3.95,2.46,6.85,2.46-.05-1.22.44-2.19,1.47-3.41h-15.39v.27c.99,0,2.08.19,2.08,1.22v15.83c0,1.04-1.09,1.24-2.08,1.24M206.17,119.41c2.43,0,3.25,2.35,5.68,2.51-.05-1.69.55-2.24,1.77-3.92-4.44,1.36-3.95-.3-7.87-.3-2.93,0-5.57,1.81-5.57,5.32,0,5.46,9.45,5.88,9.45,9.89,0,1.82-1.94,2.39-3.1,2.39-1.87,0-3.23-2.83-5.66-3,.05,1.7-.55,2.75-1.78,4.43,5.65-1.73,4.51.3,7.89.3s6.47-1.88,6.47-5.43c0-4.94-9.77-6.94-9.77-10.1,0-1.44,1.19-2.08,2.51-2.08M233.11,119.41c2.43,0,3.25,2.35,5.68,2.51-.06-1.69.55-2.24,1.77-3.92-4.44,1.36-3.95-.3-7.89-.3-2.91,0-5.57,1.81-5.57,5.32,0,5.46,9.44,5.88,9.44,9.89,0,1.82-1.94,2.39-3.08,2.39-1.89,0-3.25-2.83-5.68-3,.06,1.7-.55,2.75-1.77,4.43,5.66-1.73,4.5.3,7.89.3s6.46-1.88,6.46-5.43c0-4.94-9.76-6.94-9.76-10.1,0-1.44,1.2-2.08,2.51-2.08M252.96,136.52v.27h14.35l.12-.35,1.3-4.16-.52-.15c-.68,2.16-1.5,3.7-3.73,3.7h-5.36v-7.23c.79-.82,1.86-1.29,3.06-1.29.61,0,1.31.05,1.81.36.22-.96.99-2.25,2.29-3.2h-2.64c-1.34,0-2.52.57-3.34,1.61l-1.17,1.44v-8.63h.9c3.77,0,3.96,2.46,6.86,2.46-.06-1.22.43-2.19,1.47-3.41h-15.39v.27c.97,0,2.06.19,2.06,1.22v15.83c0,1.04-1.09,1.24-2.06,1.24M281.4,136.52v.27h7.7v-.27c-.99,0-2.08-.2-2.08-1.24v-4.47c.49-.79,1.39-1.42,2.43-1.99,1.8-.2,3.57.68,3.57,3.3v1.39c0,2.53,2.05,3.55,4.24,3.55,1.31,0,2.01-.35,2.53-1.09-.19-.03-.4-.2-.6-.44-.05.54-.52.99-1.12.99-1.14,0-1.23-1.91-1.23-2.98v-1.99c0-2.98-2.26-4.02-4.42-4.02-.1,0-.25,0-.38.02,2.46-1.17,4.8-2.46,4.8-4.89,0-3.08-3.19-4.72-6.55-4.72h-8.89v.27c.98,0,2.07.19,2.07,1.22v15.83c0,1.04-1.09,1.24-2.07,1.24M287.01,129.15v-9.25c.85-.65,1.64-.85,2.48-.85,2.08,0,3.55,1.86,3.55,3.63,0,3.79-3.97,4.62-6.03,6.47M315.7,136.52v.27h7.98v-.27c-.99,0-2.08-.2-2.08-1.24v-16.37c2.41,0,4.24,1.91,6.03,1.91-.05-1.22-.11-1.91.93-3.13-.77,0-1.73.27-2.46.27h-12.83c-.74,0-1.71-.27-2.46-.27,1.03,1.22.98,1.91.92,3.13,1.81,0,3.62-1.91,6.03-1.91v16.37c0,1.04-1.09,1.24-2.08,1.24M348.05,119.41c2.43,0,3.25,2.35,5.68,2.51-.05-1.69.55-2.24,1.76-3.92-4.44,1.36-3.95-.3-7.89-.3-2.91,0-5.56,1.81-5.56,5.32,0,5.46,9.45,5.88,9.45,9.89,0,1.82-1.95,2.39-3.09,2.39-1.89,0-3.25-2.83-5.68-3,.07,1.7-.54,2.75-1.76,4.43,5.65-1.73,4.5.3,7.89.3s6.47-1.88,6.47-5.43c0-4.94-9.78-6.94-9.78-10.1,0-1.44,1.2-2.08,2.51-2.08"/>
        <path d="M496,83.79v-.34h-.01c-.53-10.5-7.55-80.98-102.01-83.45,0,0-240.14.58-299.74.27C43.82,0-.45,42.81.02,86.05h-.02s0,.34.03.97c0,.11,0,.22,0,.34h.01c.52,10.51,7.55,80.98,102,83.45,0,0,10.33-.03,27.24-.06v-6.92c-8.02-.14-13.39-.31-15.19-.53-14.13-1.74-80.09-7.2-85.55-75.94h.06c0-31.13,21.67-80.5,100.35-80.5,0,0,238.76-1.09,252.98.65,14.12,1.74,80.08,7.21,85.54,75.94h-.06c0,31.13-21.67,80.5-100.35,80.5,0,0-.85,0-2.44.02v6.49c15.45,0,28.3.03,37.16.08,50.42.27,94.7-42.55,94.23-85.78h.01s0-.34-.03-.98"/>
      </g>
    </symbol>
  </svg>`;

// Items de nav — le href de "Accueil" est relatif à chaque page (géré via home param)
const NAV_ITEMS = [
  { i: "01", label: "Accueil", file: "index.html" },
  { i: "02", label: "À propos de nous", file: "about.html" },
  { i: "03", label: "Nos desserts", file: "desserts.html" },
  { i: "04", label: "Solutions professionnelles", file: "solutions.html" },
  { i: "05", label: "Marque privée", file: "marque-privee.html" },
  { i: "06", label: "Catalogue", file: "catalogue.html" },
  { i: "07", label: "Contact", file: "contact.html" },
];

function head(title, desc, ogImage = "assets/img/hero.jpg") {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#17120e" />
  <link rel="icon" href="assets/img/logo.svg" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${ogImage}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..600&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/style.css?v=${CSS_V}" />
</head>
<body>
  <script>
    document.documentElement.classList.add('js');
    setTimeout(function(){ var i=document.getElementById('intro'); if(i) i.classList.add('done'); }, 1400);
  </script>

  <!-- Logo réutilisable -->
  ${LOGO_SVG}

  <!-- Grain + curseur -->
  <div class="grain" aria-hidden="true"></div>
  <div class="cursor" id="cursor" aria-hidden="true"></div>
  <div class="cursor-follow" id="cursorFollow" aria-hidden="true"></div>
  <div class="cursor-media" id="cursorMedia" aria-hidden="true"></div>
  <div class="scroll-progress"><span id="progress"></span></div>

  <!-- Intro / loader -->
  <div class="intro" id="intro" aria-hidden="true">
    <div class="intro-inner">
      <svg class="intro-logo"><use href="#didolce-logo"></use></svg>
      <span class="intro-tag">L'excellence du dessert</span>
    </div>
  </div>
`;
}

function header(activeFile) {
  const items = NAV_ITEMS.map(
    (n) => `        <li><a href="${n.file}"${n.file === activeFile ? ' aria-current="page"' : ""}><span class="nm-i">${n.i}</span> ${n.label}</a></li>`
  ).join("\n");
  return `  <!-- HEADER -->
  <header class="nav" id="nav">
    <a href="index.html" class="brand" data-cursor="hide" aria-label="Di Dolce Desserts — accueil">
      <svg class="logo"><use href="#didolce-logo"></use></svg>
    </a>
    <div class="nav-right">
      <a class="nav-cat" href="catalogue.html" data-magnetic>Recevoir le catalogue</a>
      <a class="nav-call" href="tel:+33956597257" data-magnetic aria-label="Appeler le +33 9 56 59 72 57">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M6.6 2.5 4 3.2c-.6.2-1 .8-1 1.5C3 12.5 9.5 19 16.3 19c.7 0 1.3-.4 1.5-1l.7-2.6c.2-.6-.1-1.2-.6-1.5l-2.8-1.2c-.5-.2-1-.1-1.4.3l-1 1c-2-.9-3.6-2.5-4.5-4.5l1-1c.4-.4.5-.9.3-1.4L8 3.1c-.3-.5-.9-.8-1.4-.6Z"/></svg>
        <span class="nav-call-num">+33 9 56 59 72 57</span>
      </a>
      <a class="nav-wa" href="https://wa.me/33768408525" target="_blank" rel="noopener" data-magnetic aria-label="Contacter sur WhatsApp">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5c0-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5 0-.8.4a3.4 3.4 0 0 0-1 2.5 6 6 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.6-.3ZM12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2Z"/></svg>
      </a>
      <button class="menu-toggle" id="menuToggle" data-cursor="hide" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navOverlay">
        <span class="menu-label">Menu</span>
        <span class="menu-lines"><i></i><i></i></span>
      </button>
    </div>
  </header>

  <!-- MENU plein écran -->
  <nav class="nav-overlay" id="navOverlay" aria-hidden="true">
    <div class="nav-overlay-grid">
      <ul class="nav-menu">
${items}
      </ul>
      <div class="nav-feature">
        <div class="nav-feature-img" style="background-image:url('assets/img/nav-feature.jpg')"></div>
        <div class="nav-feature-txt">
          <p>« Créer la meilleure expérience de fin de repas possible. »</p>
        </div>
      </div>
    </div>
  </nav>
`;
}

function footer() {
  return `  <!-- FOOTER -->
  <footer class="footer">
    <div class="wrap">
      <div class="footer-mark"><svg class="logo logo-footer"><use href="#didolce-logo"></use></svg></div>
      <div class="footer-cols">
        <div class="footer-col">
          <span class="fc-k">Maison</span>
          <a href="about.html">À propos de nous</a>
          <a href="desserts.html">Nos desserts</a>
          <a href="solutions.html">Solutions professionnelles</a>
          <a href="marque-privee.html">Marque privée</a>
          <a href="catalogue.html">Catalogue</a>
        </div>
        <div class="footer-col">
          <span class="fc-k">Contact</span>
          <a href="tel:+33956597257">+33 9 56 59 72 57</a>
          <a href="https://wa.me/33768408525" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:contact@didolcedesserts.com">contact@didolcedesserts.com</a>
          <span>22 route Saint Pierre<br>27430 Porte de Seine</span>
        </div>
        <div class="footer-col">
          <span class="fc-k">Suivez-nous</span>
          <a href="#" onclick="return false">Instagram</a>
          <a href="#" onclick="return false">Facebook</a>
          <a href="https://wa.me/33768408525" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <div class="wrap footer-bar-in">
        <span>© <span id="year">2026</span> Di Dolce Desserts — Fatto in Italia.</span>
        <span class="footer-legal">SIRET : à compléter · <a href="#" onclick="return false">Mentions légales</a> · <a href="#" onclick="return false">Confidentialité</a></span>
      </div>
    </div>
  </footer>

  <!-- Cookies -->
  <div class="cookie" id="cookie" hidden>
    <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
    <div class="cookie-actions">
      <button class="btn btn-line btn-sm" id="cookieRefuse" data-magnetic>Refuser</button>
      <button class="btn btn-gold btn-sm" id="cookieAccept" data-magnetic>Accepter</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
  <script src="assets/main.js?v=${JS_V}"></script>
</body>
</html>
`;
}

function page(file, title, desc, bodyHtml, ogImage) {
  const html = head(title, desc, ogImage) + header(file) + `\n  <main id="accueil">\n${bodyHtml}\n  </main>\n\n` + footer();
  writeFileSync(file, html);
  console.log("✅", file);
}

/* ========================================================================
   PRODUITS — data (contenu adapté du catalogue officiel Di Dolce)
   ======================================================================== */
export const PRODUCTS = [
  {
    slug: "tiramisu-caramel-speculoos", name: "Tiramisù Caramel-Spéculoos", category: "Tiramisù",
    img: "tiramisu-caramel.png", color: "#C9A277",
    tagline: "Une pure tentation à chaque bouchée.",
    desc: "Un tiramisù revisité avec une crème légère, des éclats de spéculoos croustillants et un coulis de caramel ultra gourmand. Un pur moment de plaisir.",
    detail: "Biscuit délicatement imbibé, mascarpone onctueux et notes de spéculoos et caramel qui s'équilibrent à la perfection. Une création signature, pensée pour surprendre dès la première cuillère.",
  },
  {
    slug: "tiramisu-chocolat-speculoos", name: "Tiramisù Chocolat-Spéculoos", category: "Tiramisù",
    img: "tiramisu-chocolat.png", color: "#5B4636",
    tagline: "Une pure tentation à chaque bouchée.",
    desc: "Une crème onctueuse, des éclats de spéculoos croustillants et un coulis de chocolat fondant… un plaisir intense à chaque bouchée.",
    detail: "Le mariage du chocolat noir et du spéculoos croquant sur une base mascarpone soyeuse. Une version plus intense du tiramisù, pour les amateurs de sensations gourmandes.",
  },
  {
    slug: "tiramisu-cookies-cream", name: "Tiramisù Cookies & Cream", category: "Tiramisù",
    img: "tiramisu-cookies.png", color: "#E7DFC9",
    tagline: "Explosion de cookies dans une crème onctueuse.",
    desc: "Une crème onctueuse, des éclats de cookies vanillés, une sauce chocolat fondante… pour un plaisir régressif à chaque cuillère.",
    detail: "Biscuits imbibés, mascarpone à la vanille et brisures de cookies au cacao : une version gourmande et régressive du tiramisù, très appréciée en dessert de fin de repas.",
  },
  {
    slug: "tiramisu-mangue-passion", name: "Tiramisù Mangue Passion", category: "Tiramisù",
    img: "tiramisu-mangue.png", color: "#E8C24A",
    tagline: "Une fraîcheur exotique dans chaque cuillère.",
    desc: "Quand le cheesecake rencontre la mangue et la noix de coco pour un goût extra et rafraîchissant.",
    detail: "Une note exotique et fruitée qui tranche avec la gourmandise classique du tiramisù. Mangue, passion et une pointe de coco pour un dessert lumineux, parfait en saison estivale.",
  },
  {
    slug: "tiramisu-fraise", name: "Tiramisù Fraise", category: "Tiramisù",
    img: "tiramisu-fraise.png", color: "#D9AFAE",
    tagline: "Une tentation fruitée.",
    desc: "Quand la crème onctueuse rencontre le coulis de fraise et le crumble croustillant… c'est le coup de cœur assuré.",
    detail: "Mascarpone léger, coulis de fraise généreux et une touche croustillante en base. Un dessert frais et gourmand, parmi les préférés de notre clientèle restauration.",
  },
  {
    slug: "tiramisu-dubai-chocolat", name: "Tiramisù Dubaï Chocolat", category: "Tiramisù",
    img: "dubai.jpg", color: "#232321", cover: true,
    tagline: "Le style Dubaï dans un pot.",
    desc: "Crème de pistache onctueuse, kadaïf croustillant et nappage chocolat-noisette : une création précieuse aux accents orientaux.",
    detail: "Inspiré de la tendance du chocolat Dubaï, ce tiramisù marie la pistache, le croustillant du kadaïf et un nappage chocolat-noisette gourmand. Une signature originale sur nos cartes.",
  },
  {
    slug: "cheesecake-mangue-coco", name: "Cheesecake Mangue-Coco", category: "Cheesecake",
    img: "cheesecake-mangue.png", color: "#E0954A",
    tagline: "Délicieux mélange.",
    desc: "Une harmonie parfaite entre la fraîcheur de la mangue, la douceur de la noix de coco et l'onctuosité du cheesecake.",
    detail: "Base biscuitée croustillante, crème cheesecake onctueuse et un mélange mangue-coco plein de fraîcheur. Un dessert lumineux, parfait pour les cartes d'été.",
  },
  {
    slug: "cheesecake-fraise", name: "Cheesecake Fraise", category: "Cheesecake",
    img: "cheesecake-fraise.png", color: "#D97B62",
    tagline: "Une tentation fruitée.",
    desc: "Le fondant du cheesecake, la fraîcheur des fraises, le croustillant du crumble… chaque bouchée est un concentré de douceur.",
    detail: "Un classique indémodable : cheesecake crémeux, coulis de fraise généreux et base croustillante. Simple, efficace, apprécié de tous.",
  },
  {
    slug: "cheesecake-framboise", name: "Cheesecake Framboise", category: "Cheesecake",
    img: "cheesecake-framboise.png", color: "#A8495C",
    tagline: "Onctueux et acidulé.",
    desc: "Onctueux, relevé d'un coulis de framboise acidulé sur une base biscuitée croustillante.",
    detail: "La fraîcheur acidulée de la framboise vient équilibrer la richesse du cheesecake. Un dessert élégant, à la couleur soutenue, parfait pour twister une carte.",
  },
  {
    slug: "mousse-au-chocolat", name: "Mousse au Chocolat", category: "Mousse",
    img: "mousse.png", color: "#f8eff2", cover: true,
    tagline: "Pour tous les accros au chocolat.",
    desc: "Gourmande et onctueuse, une mousse légère au goût intense qui fond en bouche !",
    detail: "Une mousse aérienne au chocolat noir intense, simple et efficace en fin de repas. Un classique de la pâtisserie française, réinventé en portion individuelle prête à servir.",
  },
  {
    slug: "profiterol", name: "Profiterol", category: "Profiterol",
    img: "profiterol.png", color: "#f8eff2", cover: true,
    tagline: "Une gourmandise intense.",
    desc: "Une crème onctueuse à la vanille, un cœur chocolat fondant, des morceaux de choux croustillants et une touche de chocolat… un dessert qui fait craquer à chaque cuillère !",
    detail: "Le grand classique français réinventé en verrine individuelle : choux croustillants, crème vanille et chocolat fondant. Une valeur sûre sur toutes les cartes.",
  },
  {
    slug: "black-forest", name: "Black Forest", category: "Black Forest",
    img: "blackforest.png", color: "#f8eff2", cover: true,
    tagline: "La forêt noire, réinventée.",
    desc: "Biscuit chocolat intense, chantilly légère et griottes acidulées : la forêt noire dans sa version la plus gourmande.",
    detail: "Un biscuit chocolat moelleux, une chantilly aérienne et des griottes généreuses en finition. Le dessert allemand culte, réinterprété en portion individuelle.",
  },
  {
    slug: "panna-cotta-caramel", name: "Panna Cotta Caramel", category: "Desserts à la crème",
    img: "pannacotta.png", color: "#f8eff2", cover: true,
    tagline: "Une douceur fondante, intensément gourmande.",
    desc: "Une panna cotta douce et onctueuse, sublimée par un généreux coulis de caramel fondant. Une alliance délicate et irrésistible pour un pur moment de plaisir.",
    detail: "Texture soyeuse et coulis de caramel généreux : la panna cotta dans sa version la plus réconfortante. Une option élégante et simple à mettre en carte.",
  },
  {
    slug: "riz-au-lait", name: "Riz au Lait", category: "Desserts à la crème",
    img: "rizaulait.png", color: "#f8eff2", cover: true,
    tagline: "Une douceur crémeuse au délicieux goût d'enfance.",
    desc: "Un riz au lait fondant et généreux, délicatement parfumé à la vanille et sublimé par une touche de cannelle. Une recette réconfortante et gourmande à savourer à chaque cuillère.",
    detail: "Le dessert réconfortant par excellence, revisité en portion individuelle prête à servir. Vanille et cannelle pour une touche chaleureuse en fin de repas.",
  },
];

console.log(`${PRODUCTS.length} produits définis.`);

/* ========================================================================
   PAGE PRODUIT (une par parfum)
   ======================================================================== */
function productBody(p) {
  const others = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3);
  const relatedHtml = others
    .map(
      (o) => `          <a class="pd-rel-card" href="produit-${o.slug}.html">
            <div class="pd-rel-media" style="background:${o.color}"><img src="assets/img/products/${o.img}" alt="${o.name}" class="${o.cover ? "cover" : ""}" /></div>
            <span>${o.name}</span>
          </a>`
    )
    .join("\n");
  return `
    <section class="section pd-hero">
      <div class="wrap pd-wrap">
        <a class="pd-back" href="desserts.html" data-magnetic>&#8592; Retour à nos desserts</a>
        <div class="pd-grid">
          <div class="pd-media reveal-fade">
            <div class="pd-box" style="background:${p.color}">
              <img src="assets/img/products/${p.img}" alt="${p.name}" class="${p.cover ? "cover" : ""}" />
            </div>
          </div>
          <div class="pd-info">
            <p class="sec-index reveal-fade">Collection ${p.category}</p>
            <h1 class="display reveal-lines">${p.name}</h1>
            <p class="pd-tagline reveal-fade">${p.tagline}</p>
            <p class="lead reveal-fade">${p.desc}</p>
            <p class="pd-badges reveal-fade">Surgelé <i>&bull;</i> Format individuel <i>&bull;</i> Prêt à servir</p>
            <div class="pd-actions reveal-fade">
              <a class="btn btn-dark" href="contact.html" data-magnetic>Demander un devis <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
              <a class="btn btn-line" href="catalogue.html" data-magnetic>Télécharger la fiche technique <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"/></svg></a>
            </div>
            <div class="pd-spec-grid reveal-fade">
              <div><span class="pd-spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 7h10M4 7l-2 5a3 3 0 0 0 6 0L6 7Zm14 0l-2 5a3 3 0 0 0 6 0l-2-5Z"/></svg></span><strong>Poids net</strong><b>100 g</b></div>
              <div><span class="pd-spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11"/><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2M7 9l-2.7-.7M7 9l.7-2.7M17 9l2.7-.7M17 9l-.7-2.7M7 15l-2.7.7M7 15l.7 2.7M17 15l2.7.7M17 15l-.7 2.7"/></svg></span><strong>Décongélation</strong><b>4 h</b></div>
              <div><span class="pd-spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z"/></svg></span><strong>Conservation</strong><b>+4&deg;C</b></div>
              <div><span class="pd-spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l-1-9Z"/><path d="M5 7h14M9 7V5a3 3 0 0 1 6 0v2"/></svg></span><strong>Conditionnement</strong><b>1 portion</b></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section pd-features">
      <div class="wrap">
        <div class="ap-pillars ap-pillars--icons">
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3.5 20h17L12 4Z"/><path d="M7.4 14h9.2M5.5 17.5h13"/><circle cx="12" cy="7.2" r="1.1"/></svg></span>
            <h3>Texture généreuse</h3>
            <p>Une texture soignée et généreuse, pensée pour restituer toute la richesse de la recette à chaque cuillère.</p>
          </div>
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg></span>
            <h3>Simple à préparer</h3>
            <p>Décongélation rapide, dressage facile et service fluide.</p>
          </div>
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/></svg></span>
            <h3>Pensé pour les pros</h3>
            <p>Une solution adaptée aux restaurants, hôtels, cafés et distributeurs.</p>
          </div>
        </div>
      </div>
    </section>
${
  others.length
    ? `    <section class="section pd-related">
      <div class="wrap">
        <p class="sec-index reveal-fade">Dans la même famille</p>
        <div class="pd-rel-row">
${relatedHtml}
        </div>
      </div>
    </section>
`
    : ""
}`;
}

for (const p of PRODUCTS) {
  page(
    `produit-${p.slug}.html`,
    `${p.name} — Di Dolce Desserts`,
    `${p.desc} Desserts italiens premium 100% Halal, livrés en 24/48h partout en France.`,
    productBody(p),
    `assets/img/products/${p.img}`
  );
}

/* ========================================================================
   NOS DESSERTS — listing
   ======================================================================== */
{
  const cats = [...new Set(PRODUCTS.map((p) => p.category))];
  const gridHtml = PRODUCTS.map(
    (p) => `          <a class="ds-card" href="produit-${p.slug}.html">
            <div class="ds-media" style="background:${p.color}"><img src="assets/img/products/${p.img}" alt="${p.name}" class="${p.cover ? "cover" : ""}" /></div>
            <span class="ds-cat">${p.category}</span>
            <h3>${p.name}</h3>
          </a>`
  ).join("\n");
  const body = `
    <section class="section ds-hero">
      <div class="wrap">
        <p class="sec-index reveal-fade">Nos desserts</p>
        <h1 class="display reveal-lines">Toute la gamme, un même niveau d'exigence.</h1>
        <p class="lead reveal-fade">${cats.length} familles, ${PRODUCTS.length} créations 100% Halal, prêtes à dresser. Cliquez sur un dessert pour découvrir sa fiche complète.</p>
      </div>
    </section>
    <section class="section ds-grid-section">
      <div class="wrap">
        <div class="ds-grid">
${gridHtml}
        </div>
      </div>
    </section>`;
  page("desserts.html", "Nos desserts — Di Dolce Desserts", "La gamme complète des desserts italiens Di Dolce : tiramisù, cheesecake, mousse, profiterol, black forest, desserts à la crème. 100% Halal, prêts à servir.", body, "assets/img/products/tiramisu-caramel.png");
}

/* ========================================================================
   À PROPOS DE NOUS
   ======================================================================== */
{
  const body = `
    <section class="section ti-intro">
      <div class="wrap ap-wrap">
        <div class="ap-media reveal-fade">
          <div class="ti-media-glow" aria-hidden="true"></div>
          <img src="assets/img/about.jpg" alt="Di Dolce Desserts" />
        </div>
        <div class="ap-text">
          <p class="sec-index reveal-fade">À propos de nous</p>
          <h1 class="display reveal-lines">Une histoire qui incarne l'innovation.</h1>
          <p class="lead reveal-fade">La marque Di Dolce est née en 2016 de l'idée que le tiramisù doit aussi être un plaisir pour ceux qui le servent : irréprochable, économiquement durable et rapide à envoyer en salle.</p>
          <p class="ti-lead reveal-fade">Notre force réside dans l'alliance inédite du savoir-faire pâtissier, de l'ingénierie de pointe et d'une vision moderne de la restauration. Ensemble, nous avons conçu une chaîne de production innovante, dédiée initialement au tiramisù, tout en développant activement une gamme d'autres desserts d'exception.</p>
          <p class="ti-lead reveal-fade">Aux côtés du fondateur, une équipe de professionnels maîtrise chaque phase de fabrication pour garantir que nos créations arrivent dans les restaurants — en France comme à l'international — aussi savoureuses qu'un dessert artisanal, avec la régularité et la sécurité que seul un processus technologique de pointe peut offrir.</p>
        </div>
      </div>
    </section>
    <section class="section engagement">
      <div class="wrap">
        <div class="engage-top">
          <p class="sec-index reveal-fade">Notre raison d'être</p>
          <h2 class="display reveal-lines">Offrir aux chefs l'excellence du dessert, avec la simplicité en plus.</h2>
        </div>
        <div class="ap-pillars">
          <div class="ap-pillar reveal-fade"><h3>Notre savoir-faire</h3><p>Reproduire à grande échelle les recettes traditionnelles afin d'offrir le meilleur produit au meilleur prix possible.</p></div>
          <div class="ap-pillar reveal-fade"><h3>Notre innovation</h3><p>Une production moderne pensée pour offrir aux restaurateurs un dessert d'exception, simple à utiliser et constant toute l'année.</p></div>
          <div class="ap-pillar reveal-fade"><h3>Notre engagement</h3><p>Exporter le goût de la pâtisserie dans le monde entier, avec 100% Halal et livraison 24/48h en France.</p></div>
        </div>
      </div>
    </section>
    <section class="section maison">
      <div class="wrap contact-cta">
        <p class="sec-index reveal-fade">Envie d'en savoir plus ?</p>
        <h2 class="display reveal-lines">Découvrez notre gamme ou parlons de votre projet.</h2>
        <div class="contact-actions reveal-fade">
          <a class="btn btn-gold" href="desserts.html" data-magnetic>Voir nos desserts</a>
          <a class="btn btn-line" href="contact.html" data-magnetic>Nous contacter</a>
        </div>
      </div>
    </section>`;
  page("about.html", "À propos de nous — Di Dolce Desserts", "Née en 2016, Di Dolce conçoit des desserts italiens premium 100% Halal, alliant savoir-faire pâtissier et technologie de pointe pour les professionnels de la restauration.", body, "assets/img/about.jpg");
}

/* ========================================================================
   SOLUTIONS PROFESSIONNELLES
   ======================================================================== */
{
  const sectors = [
    ["Restaurants gastronomiques", "Solutions prêtes à servir pour optimiser le service tout en garantissant une qualité constante."],
    ["Cafés & Coffee shops", "Desserts premium permettant d'enrichir la carte avec une finition élégante et gourmande."],
    ["Chaînes de restauration", "Formats individuels adaptés à la vente sur place ou à emporter."],
    ["Hôtellerie", "Une offre dessert pratique, régulière et adaptée aux exigences du secteur hôtelier."],
    ["Catering & restauration collective", "Volumes adaptés et qualité homogène sur l'ensemble du réseau."],
    ["Grande distribution (GMS)", "Produits conditionnés pour les rayons frais ou surgelés sous marque Di Dolce ou marque privée."],
  ];
  const sectorsHtml = sectors
    .map(([t, d]) => `          <div class="sol-card reveal-fade"><h3>${t}</h3><p>${d}</p></div>`)
    .join("\n");
  const body = `
    <section class="section sol-hero">
      <div class="wrap">
        <p class="sec-index reveal-fade">Solutions professionnelles</p>
        <h1 class="display reveal-lines">Nos desserts sont conçus pour répondre aux besoins de la restauration et de la distribution.</h1>
        <p class="lead reveal-fade">Restaurants, hôtels, cafés, catering, distribution : nous adaptons formats, volumes et conditionnement à chaque secteur, avec la même exigence 100% Halal.</p>
      </div>
    </section>
    <section class="section sol-grid-section">
      <div class="wrap">
        <div class="sol-grid">
${sectorsHtml}
        </div>
      </div>
    </section>
    <section class="section engagement">
      <div class="wrap">
        <div class="engage-top">
          <p class="sec-index reveal-fade">Pourquoi nous choisir</p>
          <h2 class="display reveal-lines">L'excellence du dessert, la simplicité du service.</h2>
        </div>
        <div class="ap-pillars">
          <div class="ap-pillar reveal-fade"><h3>Qualité d'exception</h3><p>Une recette parfaitement équilibrée, élaborée à partir d'ingrédients rigoureusement sélectionnés.</p></div>
          <div class="ap-pillar reveal-fade"><h3>Service maîtrisé</h3><p>Prêt à servir en quelques instants, pour gagner du temps sans jamais compromettre la qualité.</p></div>
          <div class="ap-pillar reveal-fade"><h3>Régularité garantie</h3><p>Chaque lot est contrôlé avec précision pour offrir une qualité constante, service après service.</p></div>
        </div>
      </div>
    </section>
    <section class="section maison">
      <div class="wrap contact-cta">
        <p class="sec-index reveal-fade">Parlons de votre activité</p>
        <h2 class="display reveal-lines">Une solution dessert adaptée à votre secteur.</h2>
        <div class="contact-actions reveal-fade">
          <a class="btn btn-gold" href="catalogue.html" data-magnetic>Recevoir le catalogue</a>
          <a class="btn btn-line" href="contact.html" data-magnetic>Nous contacter</a>
        </div>
      </div>
    </section>`;
  page("solutions.html", "Solutions professionnelles — Di Dolce Desserts", "Des solutions dessert adaptées à chaque secteur : restaurants, hôtels, cafés, catering, distribution. Desserts italiens 100% Halal, prêts à servir.", body);
}

/* ========================================================================
   MARQUE PRIVÉE
   ======================================================================== */
{
  const body = `
    <section class="section ti-intro mp-hero">
      <div class="wrap mp-hero-text">
        <p class="sec-index reveal-fade">Marque de distributeur</p>
        <h1 class="display reveal-lines">Votre marque, notre expertise.</h1>
        <p class="lead reveal-fade">Votre partenaire pour des desserts premium sous votre propre marque. Nous accompagnons les marques, les distributeurs et les professionnels de la restauration dans la création de desserts d'exception en marque de distributeur. De la recette au produit fini, nous mettons notre savoir-faire au service de votre projet.</p>
      </div>
      <div class="wrap">
        <div class="mp-photo reveal-fade">
          <img src="assets/img/private-label.jpg" alt="Pots Di Dolce en marque privée, étiquette personnalisable" />
        </div>
      </div>
    </section>
    <section class="section engagement">
      <div class="wrap">
        <div class="engage-top center">
          <p class="sec-index reveal-fade">Marque privée</p>
          <h2 class="display reveal-lines">Une étiquette à votre image, une recette inchangée.</h2>
          <p class="lead reveal-fade">Nous proposons nos desserts en marque blanche, dans différents formats de pots et de couvercles. La recette reste inchangée ; l'étiquette est personnalisée avec votre logo, votre identité visuelle et les informations réglementaires. Nous accompagnons le client depuis la définition du produit jusqu'à son emballage, en passant par la gestion des éventuelles évolutions du projet.</p>
          <p class="mp-note reveal-fade">Quantité minimale sur demande.</p>
        </div>
        <div class="ap-pillars ap-pillars--icons">
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="7.5" cy="7.5" r="1"/></svg></span>
            <h3>Étiquette personnalisée</h3>
            <p>Votre logo, le nom du produit et les informations essentielles sur l'étiquette.</p>
          </div>
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 5.5V11c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V5.5L12 3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
            <h3>Identité de votre marque</h3>
            <p>Votre logo est mis en avant, avec les mentions réglementaires nécessaires.</p>
          </div>
          <div class="ap-pillar reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg></span>
            <h3>Solution sans étiquette</h3>
            <p>Un emballage neutre, prêt à intégrer votre propre système d'étiquetage.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section mp-band">
      <div class="wrap">
        <h2 class="display reveal-lines mp-band-title">Notre offre de marque de distributeur.</h2>
        <div class="mp-feature-grid cols-5">
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/></svg></span>
            <h3>Recette sur mesure</h3>
            <p>Élaboration de recettes sur mesure, adaptées à vos besoins et à votre positionnement.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="7.5" y="2.5" width="9" height="3.4" rx="1.1"/><path d="M7 6h10v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6Z"/><path d="M7 12.5h10"/></svg></span>
            <h3>Personnalisation complète</h3>
            <p>Personnalisation complète des emballages et des étiquettes avec votre logo et votre design.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l5 3v-3l5 3V8l5 4v9H3Z"/><path d="M3 21h18"/></svg></span>
            <h3>Production industrielle</h3>
            <p>Production française, réalisée à l'aide d'équipements modernes et selon des normes de qualité élevées.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="9" width="5.5" height="11" rx="1.2"/><rect x="9.5" y="5" width="5" height="15" rx="1.2"/><rect x="16" y="11" width="5.5" height="9" rx="1.2"/></svg></span>
            <h3>Adapté à votre format</h3>
            <p>Large gamme de formats et de conditionnements pour le commerce de détail, l'hôtellerie et la restauration.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 16.5 13 18a1.4 1.4 0 0 0 2-2"/><path d="m13.6 13.4 2.9 2.9a1.4 1.4 0 0 0 2-2l-4-4a2.6 2.6 0 0 0-3.6 0l-.6.6a1.4 1.4 0 0 1-2-2l2.4-2.4a4.6 4.6 0 0 1 5.7-.6l.6.35 1.6-.35"/><path d="m3 6.5 1.6.35.6-.35a4.6 4.6 0 0 1 3-.5"/><path d="M2.5 6 3.4 13l4.6 4.6a1.4 1.4 0 0 0 2-2"/></svg></span>
            <h3>Accompagnement</h3>
            <p>Un accompagnement complet à chaque étape : de l'idée au produit final.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section mp-band alt">
      <div class="wrap">
        <div class="mp-feature-grid cols-6">
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6 20 7v10l-8 4.4L4 17V7l8-4.4Z"/></svg></span>
            <h3>Fabriqué en France</h3>
            <p>Savoir-faire artisanal et ingrédients soigneusement sélectionnés.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20l1.4-6.3-4.8-4.3 6.4-.6L12 3Z"/></svg></span>
            <h3>Recettes premium</h3>
            <p>Des recettes délicieuses et authentiques pour des desserts exceptionnels.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></span>
            <h3>Flexibilité de la production</h3>
            <p>Des volumes évolutifs adaptés à vos besoins, du lancement à la distribution à grande échelle.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.6 2.2"/><path d="M9.5 2h5M12 2v3"/><path d="m19.4 6.9 1.3-1.3"/></svg></span>
            <h3>Développement rapide</h3>
            <p>De nouveaux produits développés en un temps record grâce à notre expertise en R&amp;D.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/></svg></span>
            <h3>Qualité et traçabilité</h3>
            <p>Des contrôles rigoureux à chaque étape pour garantir une qualité constante et une traçabilité totale.</p>
          </div>
          <div class="mp-feature reveal-fade">
            <span class="ap-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M20 19v1a3 3 0 0 1-3 3h-3"/></svg></span>
            <h3>Service spécial pour les professionnels</h3>
            <p>Une équipe dédiée pour un suivi personnalisé et proactif.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section maison">
      <div class="wrap contact-cta">
        <p class="sec-index reveal-fade">Demandez votre offre personnalisée</p>
        <h2 class="display reveal-lines">Des desserts gourmands, conçus pour valoriser votre identité.</h2>
        <div class="contact-actions reveal-fade">
          <a class="btn btn-gold" href="contact.html" data-magnetic>Discuter de votre projet</a>
          <a class="btn btn-line" href="catalogue.html" data-magnetic>Recevoir le catalogue</a>
        </div>
      </div>
    </section>`;
  page("marque-privee.html", "Marque privée — Di Dolce Desserts", "Di Dolce accompagne marques, distributeurs et professionnels de la restauration dans la création de desserts premium en marque de distributeur (private label).", body, "assets/img/private-label.jpg");
}

/* ========================================================================
   CATALOGUE (formulaire → email)
   ======================================================================== */
{
  const body = `
    <section class="section cat-hero">
      <div class="wrap contact-cta">
        <p class="sec-index reveal-fade">Catalogue</p>
        <h1 class="display reveal-lines">Recevez notre catalogue complet.</h1>
        <p class="lead reveal-fade">Renseignez vos coordonnées ci-dessous : un email pré-rempli s'ouvrira vers notre équipe, qui vous enverra le catalogue par retour avec nos tarifs professionnels.</p>
      </div>
    </section>
    <section class="section cat-form-section">
      <div class="wrap cat-wrap">
        <form class="contact-form reveal-fade" id="catalogueForm" novalidate>
          <div class="field"><label for="c-name">Nom &amp; prénom</label><input id="c-name" name="name" type="text" required autocomplete="name" placeholder="Votre nom" /></div>
          <div class="field"><label for="c-company">Société</label><input id="c-company" name="company" type="text" autocomplete="organization" placeholder="Restaurant, enseigne, grossiste…" /></div>
          <div class="field-row">
            <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email" placeholder="vous@societe.fr" /></div>
            <div class="field"><label for="c-phone">Téléphone</label><input id="c-phone" name="phone" type="tel" autocomplete="tel" placeholder="06 00 00 00 00" /></div>
          </div>
          <div class="field"><label for="c-msg">Votre besoin (optionnel)</label><textarea id="c-msg" name="message" rows="3" placeholder="Volumes, marque privée, secteur d'activité…"></textarea></div>
          <label class="rgpd"><input type="checkbox" name="rgpd" required /><span>J'accepte d'être recontacté(e) au sujet de ma demande de catalogue.</span></label>
          <button type="submit" class="btn btn-gold btn-block" data-magnetic>Recevoir le catalogue par email</button>
          <p class="form-note">Votre message ouvrira votre messagerie avec un email pré-rempli vers contact@didolcedesserts.com.</p>
          <div class="form-success" id="catalogueSuccess" hidden><strong>Merci.</strong> Nous ouvrons votre messagerie pour finaliser la demande.</div>
        </form>
      </div>
    </section>`;
  page("catalogue.html", "Catalogue — Di Dolce Desserts", "Recevez le catalogue complet Di Dolce Desserts : tiramisù, cheesecake, mousse et plus, tarifs professionnels et informations produits.", body);
}

/* ========================================================================
   CONTACT
   ======================================================================== */
{
  const body = `
    <section class="section contact">
      <div class="wrap contact-grid">
        <div class="contact-info">
          <p class="sec-index reveal-fade">Contact</p>
          <h1 class="display reveal-lines">Parlons de votre offre dessert</h1>
          <p class="lead reveal-fade">Professionnel de l'alimentaire ou de la restauration ? Di Dolce Desserts vous accompagne avec des solutions adaptées à votre activité.</p>
          <p class="lead reveal-fade">Tarifs professionnels, marque privée ou renseignements : contactez notre équipe par téléphone ou par e-mail. Nous vous répondrons rapidement.</p>
          <div class="contact-actions reveal-fade">
            <a class="btn btn-gold" href="tel:+33956597257" data-magnetic>Appeler le +33 9 56 59 72 57</a>
            <a class="btn btn-line" href="https://wa.me/33768408525" target="_blank" rel="noopener" data-magnetic>Écrire sur WhatsApp</a>
          </div>
          <ul class="contact-list reveal-fade">
            <li><span class="ci-k">Bureau &amp; usine</span><span>22 route Saint Pierre, 27430 Porte de Seine, France</span></li>
            <li><span class="ci-k">Téléphone</span><a href="tel:+33956597257" data-magnetic>+33 9 56 59 72 57</a></li>
            <li><span class="ci-k">WhatsApp</span><a href="https://wa.me/33768408525" target="_blank" rel="noopener" data-magnetic>+33 7 68 40 85 25</a></li>
            <li><span class="ci-k">Email</span><a href="mailto:contact@didolcedesserts.com" data-magnetic>contact@didolcedesserts.com</a></li>
          </ul>
        </div>
        <form class="contact-form reveal-fade" id="leadForm" novalidate>
          <div class="field"><label for="l-name">Nom &amp; prénom</label><input id="l-name" name="name" type="text" required autocomplete="name" placeholder="Votre nom" /></div>
          <div class="field"><label for="l-company">Société</label><input id="l-company" name="company" type="text" autocomplete="organization" placeholder="Restaurant, enseigne, grossiste…" /></div>
          <div class="field-row">
            <div class="field"><label for="l-email">Email</label><input id="l-email" name="email" type="email" required autocomplete="email" placeholder="vous@societe.fr" /></div>
            <div class="field"><label for="l-phone">Téléphone</label><input id="l-phone" name="phone" type="tel" autocomplete="tel" placeholder="06 00 00 00 00" /></div>
          </div>
          <div class="field"><label for="l-msg">Message</label><textarea id="l-msg" name="message" rows="3" placeholder="Votre demande…"></textarea></div>
          <label class="rgpd"><input type="checkbox" name="rgpd" required /><span>J'accepte d'être recontacté(e) au sujet de ma demande.</span></label>
          <button type="submit" class="btn btn-gold btn-block" data-magnetic>Envoyer sur WhatsApp</button>
          <p class="form-note">Votre message ouvrira WhatsApp avec un texte pré-rempli vers notre équipe.</p>
          <div class="form-success" id="formSuccess" hidden><strong>Merci.</strong> Nous ouvrons WhatsApp pour finaliser votre message.</div>
        </form>
      </div>
    </section>
    <section class="section cat-form-section">
      <div class="wrap cat-page-grid">
        <div class="cat-form-col">
          <p class="sec-index reveal-fade">Catalogue</p>
          <h2 class="display reveal-lines">Recevez notre catalogue complet.</h2>
          <p class="lead reveal-fade">Renseignez vos coordonnées : un email pré-rempli s'ouvrira vers notre équipe, qui vous enverra le catalogue par retour avec nos tarifs professionnels.</p>
          <form class="contact-form reveal-fade" id="catalogueForm" novalidate>
            <div class="field"><label for="c-name">Nom &amp; prénom</label><input id="c-name" name="name" type="text" required autocomplete="name" placeholder="Votre nom" /></div>
            <div class="field"><label for="c-company">Société</label><input id="c-company" name="company" type="text" autocomplete="organization" placeholder="Restaurant, enseigne, grossiste…" /></div>
            <div class="field-row">
              <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email" placeholder="vous@societe.fr" /></div>
              <div class="field"><label for="c-phone">Téléphone</label><input id="c-phone" name="phone" type="tel" autocomplete="tel" placeholder="06 00 00 00 00" /></div>
            </div>
            <label class="rgpd"><input type="checkbox" name="rgpd" required /><span>J'accepte d'être recontacté(e) au sujet de ma demande de catalogue.</span></label>
            <button type="submit" class="btn btn-gold btn-block" data-magnetic>Recevoir le catalogue par email</button>
            <div class="form-success" id="catalogueSuccess" hidden><strong>Merci.</strong> Nous ouvrons votre messagerie pour finaliser la demande.</div>
          </form>
        </div>
        <div class="cat-cover-wrap reveal-fade">
          <img class="cat-cover-img" src="assets/img/catalogue-cover.jpg" alt="Première page du catalogue Di Dolce Desserts" />
        </div>
      </div>
    </section>
    <section class="section contact-map">
      <div class="wrap">
        <p class="sec-index reveal-fade">Nous trouver</p>
        <div class="map-frame reveal-fade">
          <iframe src="https://www.google.com/maps?q=22+route+Saint+Pierre,+27430+Porte+de+Seine,+France&output=embed" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Localisation Di Dolce Desserts — 22 route Saint Pierre, 27430 Porte de Seine"></iframe>
        </div>
      </div>
    </section>`;
  page("contact.html", "Contact — Di Dolce Desserts", "Contactez Di Dolce Desserts : téléphone, WhatsApp, email et adresse de notre bureau et usine en France.", body);
}

