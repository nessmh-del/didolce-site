# Di Dolce Desserts — site web

Contexte complet du projet pour reprendre le travail dans une nouvelle conversation.

## Le client

**Di Dolce Desserts** — fournisseur B2B de desserts italiens premium **100% Halal**
(tiramisù, cheesecake, mousse, profiterol, black forest, desserts à la crème),
livrés en 24/48h partout en France. Fondée en 2016.

- Site officiel existant (démo/placeholder) : didolcedesserts.com
- Site modèle dont le design s'inspire : lospecialistadessert.it (Lo Specialista, marque italienne de tiramisù premium — structure et direction visuelle reproduites, **jamais leur texte ni leurs photos**, toujours réécrit avec le contenu réel Di Dolce)

## Stack technique

Site **statique** HTML/CSS/JS vanilla (pas de framework, pas de build tool sauf le générateur de pages ci-dessous).

- **Polices** : Fraunces (serif display, titres) + Jost (sans-serif, corps/UI)
- **Palette** : crème `#f4ecdd`, encre `#17110c`, or `#c0975a` (+ variantes `--gold-d`/`--gold-l`)
- **Animation** : GSAP + ScrollTrigger (reveals au scroll) + Lenis (smooth scroll)
- **Fichiers partagés** : `assets/style.css`, `assets/main.js` — chargés par TOUTES les pages
- Déploiement : **GitHub Pages**, repo `nessmh-del/didolce-site` (compte `gh` déjà authentifié)

### Convention de cache-busting
Chaque `<link rel="stylesheet" href="assets/style.css?v=N">` et `<script src="assets/main.js?v=N">`
doit être **incrémenté (`v=N+1`) à chaque modification** de style.css ou main.js, sur TOUTES les
pages qui les chargent (sinon le navigateur sert une version périmée en cache).
Version actuelle : **v=17**.

⚠️ **Piège vécu** : le navigateur (même en local, `python -m http.server`) met en cache agressivement
`index.html` lui-même. Après une modif, recharger avec `?nocache=1` en query string ou forcer un
hard-reload (Cmd+Shift+R), sinon on croit que le changement n'a pas marché alors qu'il a juste pas
été vu.

## État du déploiement — IMPORTANT

- **`main`** (branche par défaut, déployée) = **V2**, actuellement **EN LIGNE** sur
  https://nessmh-del.github.io/didolce-site/
- **Tag git `v1`** = premier jet du site (one-page simple), gardé pour rollback rapide si besoin
  (`git checkout v1 -- .`)
- **Branche `v3`** = travail en cours (site multi-pages + fiches produit), **committé mais PAS
  poussé sur `origin`, donc PAS en ligne**. Le client a explicitement demandé de ne rien déployer
  tant que tout n'est pas validé.
- Pour prévisualiser la V3 en local : `git checkout v3`, puis lancer le serveur
  (`.claude/launch.json`, config `"didolce"`, port 5188) → http://localhost:5188 (avec `?nocache=1`
  après toute modif).
- **Pour déployer V3 en prod quand le client valide** : `git checkout main && git merge v3 &&
  git push origin main` (GitHub Pages se reconstruit automatiquement en ~30-60s).

## Historique des versions

### V1 — one-page simple (tag `v1`)
Premier site : hero, promesse, carrousel produits (coverflow), engagement, marque blanche,
pourquoi nous, notre maison, contact avec formulaire.

### V2 — refonte éditoriale "La Carte" (actuellement EN LIGNE)
- Design repensé après retour du client ("trop générique, on dirait un template Claude") :
  structure inspirée de lospecialistadessert.it, direction éditoriale premium
  (typographie Fraunces/Jost, palette or/crème/encre, cadre fixe, curseur custom, menu plein écran)
- Section "Marque blanche" → remplacée par "Notre Tiramisù" (photo pleine largeur + texte 2 colonnes)
- Section "Nos desserts" (carrousel single-card) → remplacée par "Nos parfums" (grille swipable,
  drag souris + tactile, pagination à points, **14 produits réels**)
- Formulaire de contact générique supprimé → tout renvoie vers appel/WhatsApp (site statique,
  pas de backend pour traiter un vrai formulaire)
- Vidéo hero avec **fallback GIF automatique** si l'autoplay est bloqué (mode économie d'énergie
  iOS bloque `<video autoplay>` mais pas les images animées) : `assets/video/hero.mp4` +
  `assets/video/hero.gif` (regénéré à chaque changement de vidéo via ffmpeg, voir plus bas) +
  `assets/img/hero.jpg` (poster = frame 0 de la vidéo)
- Ombres des produits : ombre de contact douce (radial-gradient flou) plutôt que `drop-shadow` dur
  qui trahissait le détourage PNG

### V3 — site multi-pages + fiches produit (branche `v3`, PAS déployée)
Demandée en 4 étapes par le client :
1. **Catalogue** : page dédiée avec formulaire → email pré-rempli (`mailto:`) vers
   contact@didolcedesserts.com. ⚠️ Contrainte technique : site statique = **pas d'envoi
   automatique du PDF**, le formulaire ouvre juste un email pré-rempli, un humain répond
   avec le catalogue en pièce jointe.
2. **Vidéo hero** remplacée par celle fournie par le client ("Vidéo 2 hero.mp4")
3. **Page "À propos de nous"** avec la vraie histoire de marque (voir "Découverte majeure" ci-dessous)
4. **Fiches produit individuelles** : une page HTML par parfum (`produit-<slug>.html`), pas sur
   la page d'accueil. Accessible en cliquant une carte dans "Nos parfums"/"Nos desserts".

Plus, nouveau **menu 7 items** demandé par le client (remplace l'ancien menu one-page) :
`Accueil | À propos de nous | Nos desserts | Solutions professionnelles | Marque privée | Catalogue | Contact`
→ transforme le site de one-page à **multi-pages**.

Pages créées : `about.html`, `desserts.html`, `solutions.html`, `marque-privee.html`,
`catalogue.html`, `contact.html`, + 14× `produit-*.html`.

Puis 2e passe de correctifs demandée par le client après avoir vu la V3 :
- Header mobile décongestionné (téléphone/WhatsApp masqués sur mobile, restent dans le
  menu plein écran + page Contact)
- Bouton doré **"Recevoir le catalogue"** ajouté dans le header sur **toutes les pages**
  (→ `catalogue.html`)

## Découverte majeure : le vrai catalogue produit

En cours de route, un **vrai catalogue PDF officiel Di Dolce** a été trouvé dans
`assets/Image produit/Catalogue produit principale.pdf` (dossier **exclu du repo git**, voir
`.gitignore` — contient des documents internes/sensibles, ne pas commit). Ce catalogue a révélé :

- Le site didolcedesserts.com original scrapé au départ était en fait un **template/démo
  WordPress** avec des données à moitié fictives.
- **Vraies coordonnées** (utilisées partout dans le site depuis) :
  - Tél (bureau/usine, pour les appels) : **+33 9 56 59 72 57**
  - Adresse : **22 route Saint Pierre, 27430 Porte de Seine, France**
  - Email : contact@didolcedesserts.com (inchangé)
  - WhatsApp : **+33 7 68 40 85 25** (conservé — numéro différent du tél bureau, pas de
    certitude que la ligne fixe ait WhatsApp donc on n'a pas remplacé ce numéro-là)
- **Vrai catalogue de 14 produits** (remplace une gamme partiellement inventée dans les
  versions précédentes, notamment "Red Velvet" qui n'existe PAS dans le vrai catalogue et a
  été retiré) : Tiramisù Caramel-Spéculoos, Chocolat-Spéculoos, Cookies & Cream, Mangue Passion,
  Fraise, Dubaï Chocolat ; Cheesecake Mangue-Coco, Fraise, Framboise ; Mousse au Chocolat ;
  Profiterol ; Black Forest ; Panna Cotta Caramel ; Riz au Lait.
  (Le catalogue mentionne encore plus de variantes — Bueno, Choco-Caramel, Choco-Pistache,
  Cheesecake Spéculoos, Mousse Liégeoise, Profiterol Pistache, Panna Cotta Framboise — non
  retenues faute de photo ET texte réels exploitables ensemble. Possibilité de les ajouter
  plus tard si le client fournit des photos.)
- Photos produit réelles extraites du PDF (via `pypdf`/`pdfplumber`, conversion CMYK→RGB avec
  Pillow) pour Mousse au Chocolat, Profiterol, Black Forest, Panna Cotta, Riz au Lait — les
  autres viennent du site scrapé au tout début (`assets/img/products/*.png`, PNG détourés
  transparents).
- Texte réel utilisé (histoire de marque, page "Solutions professionnelles", page "Marque
  privée", descriptions produit) : traduit/adapté à partir du PDF, jamais copié mot-à-mot
  brut (le PDF a des soucis d'encodage de police — glyphes doublés/accents cassés sur les
  titres stylisés — donc tout a été réécrit proprement en français correct).

## Architecture du code

### `build-pages.mjs` — générateur de pages (source unique de vérité)
Script Node **à relancer (`node build-pages.mjs`) après toute modification** des données
produit ou de la structure header/footer commune. Il régénère TOUTES les pages secondaires
(`about.html`, `desserts.html`, `solutions.html`, `marque-privee.html`, `catalogue.html`,
`contact.html`, tous les `produit-*.html`) à partir de :
- `PRODUCTS` (tableau JS en haut du fichier) : slug, nom, catégorie, image, couleur de fond,
  tagline, description courte, description détaillée — **modifier ici pour changer un produit
  ou en ajouter un**, puis relancer le script.
- Fonctions `head()`, `header()`, `footer()` : structure commune (logo SVG, nav, menu plein
  écran, footer, scripts) partagée par toutes les pages générées.

⚠️ **`index.html` n'est PAS généré par ce script** — c'est un fichier à la main (trop de
sections spécifiques/animations différentes). Si on change le header/footer commun dans
`build-pages.mjs`, il faut **répercuter manuellement le même changement dans `index.html`**
(déjà fait pour le bouton "Recevoir le catalogue" par exemple).

### Autres scripts utilitaires (racine du dossier parent, pas dans `didolce-site/`)
- `../nano-banana.mjs` : génération d'images via Gemini (`GEMINI_API_KEY` dans `.env.local`,
  facturation Google **désactivée** actuellement → 429 en pratique)
- `../pollinations.mjs` : génération d'images gratuite alternative (Flux via Pollinations.ai,
  aucune clé requise) — utilisé pour les photos hero/produits quand Gemini indisponible

### Images produit — deux dossiers différents, ne pas confondre
- `assets/img/products/` : les photos produit **utilisées sur le site** (PNG détourés
  transparents + quelques JPG genre `dubai.jpg`)
- `assets/Image produit/` (avec accent, majuscule) : dossier de **référence fourni par le
  client** (le vrai catalogue PDF + captures d'écran de sites concurrents) — **exclu du git**,
  jamais à publier tel quel, juste une source pour extraire du contenu

## Prochaines étapes possibles
- Client doit valider la V3 en local (`localhost:5188` sur branche `v3`) avant tout déploiement
- Une fois validé : merge `v3` → `main` + push (voir commande plus haut)
- Envisager d'ajouter les variantes de parfums manquantes si le client fournit leurs photos
- Mentions légales / SIRET encore en placeholder ("à compléter") à finaliser avec le client
