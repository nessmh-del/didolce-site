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
Version actuelle : **style.css v=43**, **main.js v=40** (ils divergent, c'est normal — chacun
n'est incrémenté que quand le fichier correspondant change réellement). Ne pas se fier à ces
chiffres dans une future session sans les revérifier (`grep -o 'style.css?v=[0-9]*' *.html | sort -u`
et `grep -o 'main.js?v=[0-9]*' *.html | sort -u`) — ils changent à chaque round.

⚠️ **Piège vécu** : le navigateur (même en local, `python -m http.server`) met en cache agressivement
`index.html` lui-même. Après une modif, recharger avec `?nocache=1` en query string ou forcer un
hard-reload (Cmd+Shift+R), sinon on croit que le changement n'a pas marché alors qu'il a juste pas
été vu.

## État du déploiement — IMPORTANT

**Mise à jour 2026-08-04** : la branche `v3` a été mergée puis le travail a continué directement
sur `main` (carrousel, Tiramisù Classico en 15e produit, section "Format d'emballage pour B2C",
retouches contact/catalogue). `main` est **EN LIGNE** sur https://nessmh-del.github.io/didolce-site/
et **à jour avec `origin/main`** (vérifié : `a616c25`). Le site multi-pages (V3 : menu 7 items,
fiches produit, catalogue, vraies coordonnées) **est donc déjà déployé**, pas juste un brouillon.
La branche `v3` elle-même est désormais **obsolète/en retard sur `main`** — ne plus l'utiliser pour
prévisualiser du nouveau travail, tout se passe directement sur `main`.

**Re-vérifié le 2026-08-04 (même jour)** : `origin/main` toujours à `a616c25`, inchangé. Les
modifications V5 (voir plus bas) restent **non commitées, non poussées** dans l'arbre de travail
local — le client veut valider en local avant tout nouveau déploiement.

- **Tag git `v1`** = premier jet du site (one-page simple), gardé pour rollback rapide si besoin
  (`git checkout v1 -- .`)
- Pour prévisualiser en local : lancer le serveur (`.claude/launch.json`, config `"didolce"`,
  port 5188) → http://localhost:5188 (avec `?nocache=1` après toute modif).
- **Pour déployer une modification** : commit sur `main` puis `git push origin main` (GitHub Pages
  se reconstruit automatiquement en ~30-60s). Le client a explicitement demandé de valider en
  local avant tout déploiement — ne pas push sans confirmation explicite.

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

Entre la V3 et la V5 (pas de jalon "V4" formalisé), plusieurs correctifs/ajouts sont arrivés
directement sur `main` : fix du carrousel "Nos parfums", ajout de Tiramisù Classico (15e
produit), section "Format d'emballage pour B2C" (`desserts.html` + `index.html`), retouches
contact/catalogue.

### V5 — d'après le fichier `Modification.pages` du client (2026-08-04), sur `main` mais **PAS
committé** (modifications non commitées dans l'arbre de travail, par-dessus le commit `a616c25`)
et **PAS poussé sur `origin`** (le client veut valider avant tout nouveau déploiement,
d'autres modifications sont encore à venir) :
1. **about.html** : image de la section "Une histoire qui incarne l'innovation" remplacée par
   la vidéo `assets/video/about-tirimissu.mp4` (même traitement sur la section jumelle
   d'`index.html`).
2. **about.html** : nouvelle section "Où sommes-nous" (`.ap-where`) — photos Normandie/façade
   découpées depuis le mockup client, texte FR+EN, carte, 4 piliers avec icônes (réutilise le
   pattern `.ap-pillars--icons`).
3. **Format d'emballage B2C** (`index.html` + `desserts.html` via `b2cSection()`) : vraies
   photos des boîtes Tiramisù Classico intégrées ; carte "120 g" corrigée en **"250 g"** (poids
   réel visible sur la boîte fournie).
4. **Fiches produit** (`productBody()` dans `build-pages.mjs`) : espace vide entre le tableau
   d'infos et les 3 icônes supprimé (padding des sections `.pd-hero`/`.pd-features` réduit) ;
   nouveau bloc `.pd-extra` avec conservation surgelé (12 mois à -18°C), mention décongélation/
   non-recongélation, et code article (`p.code`, voir liste DC0X ci-dessous).
5. Section "04 — Notre engagement / Deux promesses, zéro compromis" **supprimée** d'`index.html`
   (sections suivantes renumérotées 04→06). Le message "100% Halal / livraison 24/48h" reste
   présent ailleurs sur le site (marquee, section "La promesse", stats "Notre maison", pilier
   "Notre engagement" d'about.html) — ce n'était qu'une répétition retirée, pas la seule mention.
6. Nouvelle variable CSS `--white:#fdfdfd` (au lieu de `#fff` en dur) sur les fonds de cartes
   (`.ap-pillar` en fond clair, `.ds-card`, `.b2c-card`, `.sol-card`, `.tiramisu-intro`,
   `.mp-band`) — teinte échantillonnée sur une photo produit fournie par le client.
7. **Page "Solutions professionnelles" supprimée**, son contenu (hero + 6 secteurs + "Pourquoi
   nous choisir") fusionné comme sous-section d'`about.html`. Menu 7→6 items partout
   (`NAV_ITEMS` dans `build-pages.mjs` + miroir manuel `index.html`).
8. **Codes article DC0X** ajoutés à 11 produits existants (`code:` dans `PRODUCTS`) d'après la
   liste officielle transmise par le client. **4 produits actuels ne sont PAS dans cette
   liste** (gardés sur le site, à confirmer avec le client) : Cheesecake Framboise, Panna Cotta
   Caramel, Riz au Lait, Tiramisù Classico (ce dernier a ses propres codes `DF0X` pour les
   formats B2C, vus page 28 du catalogue PDF — normal qu'il n'ait pas de code `DC0X`).
   **7 produits de la liste ne sont PAS encore sur le site** (Choco-Caramel, Bueno,
   Choco-Pistache, Coco Rocher, Mousse Liégeoise, Cheesecake Spéculoos, Trois Chocolat) — non
   ajoutés faute de photo+texte réels exploitables dans `assets/Image produit/Catalogue produit
   principale.pdf` (déjà documenté comme bloquant lors d'un round précédent, revérifié le
   2026-08-04). "Tiramisu mangue" (DC07) a été mappé sur l'actuel "Tiramisù Mangue Passion"
   (probable simple différence de nom, pas un produit distinct) — à confirmer avec le client.
9. Assets sources de ce round dans `assets/Image pour modification/v5-source/` (dossier
   git-ignoré, même convention que `Image produit/`) : composite "Où sommes-nous", photos boîtes
   Classico, PDF complet des demandes.

### V5 — corrections après relecture client (2026-08-04, même jour, sur `main`, **toujours PAS
commité ni poussé sur `origin`**) : 5 retours vocaux sur le rendu V5 ci-dessus.
1. **`.ap-where` ("Où sommes-nous") reconstruite en vrai 3 colonnes** pour coller au mockup
   `mod2-ou-sommes-nous-composite.jpg` (au lieu du bloc 2x2 + texte à côté qui ne le reproduisait
   pas fidèlement) : colonne A = photo paysage + carte "Di Dolce Desserts" **en overlay flottant**
   par-dessus (desktop ≥900px seulement — en dessous, stack simple non chevauchée, plus lisible en
   mobile) ; colonne B = photo village + photo façade empilées ; colonne C = texte (déjà bien
   placée, structure inchangée). Rangée d'icônes en bas passée d'un style "icône au-dessus,
   centré" à "icône à gauche, texte à droite" (scoped à `.ap-where-pillars`, ne touche pas le
   pattern `.ap-pillars--icons` partagé ailleurs) + fix d'un bug latent (4 icônes forcées sur une
   grille à 3 colonnes → passage à `repeat(4,1fr)` scoped). Textes FR/EN revérifiés mot pour mot
   contre le mockup et corrigés à 2 endroits : le paragraphe anglais "know-how" → **"savoir-faire"**
   + scindé en 2 `<p>` (titre + 1 phrase, puis le paragraphe complet) comme sur le mockup ; le
   texte de la carte "Di Dolce Desserts" (colonne A) qui fusionnait 2 paragraphes du mockup
   ("Notre mission…" et "Pensés, fabriqués…") en un seul — reséparés en 3 `<p>` distincts.
   **Photo façade remplacée par une version 3x plus grande (1536×864 vs ~485×330) et authentique**,
   extraite de `assets/Image produit/Catalogue produit principale.pdf` page 32 (photo réelle du
   bâtiment utilisée par le client dans son propre catalogue) — mais c'est une version **de nuit/
   crépuscule**, alors que le mockup et les 2 autres photos (campagne, village) sont de jour. Pas
   de version jour en meilleure résolution trouvée nulle part (le PDF `Modification-complete.pdf`
   qui contient le mockup ne l'a lui-même qu'en 1600×800 max, c'est la seule source). Photos
   campagne/village re-découpées proprement depuis ce même composite 1600×800 (aucune meilleure
   source trouvée dans les dossiers client) à des ratios adaptés au nouveau layout — meilleure
   utilisation de la résolution native disponible que les anciens crops. **Point resté en
   suspens : le choix jour/nuit de la photo façade est un jugement esthétique, pas tranché avec
   certitude — à valider avec le client.**
2. **Fix du bug empêchant l'empilement de "Format d'emballage B2C"** : la vraie cause n'était pas
   la règle citée dans la demande initiale mais une **media query oubliée**
   (`@media(min-width:760px){.b2c-groups{grid-template-columns:repeat(2,1fr)...}}`, ligne ~598)
   qui remettait les 2 groupes côte à côte dès 760px. Supprimée (garde juste un `gap` plus grand en
   desktop) ; `.b2c-groups` a aussi reçu un `max-width:720px;margin-inline:auto` sinon les cartes
   auraient été démesurément larges une fois les groupes empilés en pleine largeur.
3. **Fiches produit (`productBody()`) revérifiées** : pas d'espace vide résiduel, bloc `.pd-extra`
   (conservation + réf.) et `.pd-features` s'affichent correctement sans chevauchement, testé sur
   plusieurs fiches (produit `cover:true` et produit à couleur unie). Rien à corriger, le travail
   de la session précédente tenait déjà la route.
4. **`--white` étendu à 2 nouveaux endroits** après audit complet de `assets/style.css` (plus un
   seul blanc/quasi-blanc codé en dur qui ne passe pas déjà par `var(--white)`, hors deux effets
   décoratifs volontairement laissés en l'état — halo `rgba(255,255,255,.04)` sur `.ap-pillar` fond
   foncé, et le reflet sur la tranche du livre catalogue `.cat-book::before`, tous deux cassés si
   migrés) : `.b2c-card-media` (fond derrière chaque photo produit dans les cartes B2C, avant
   `--paper`) et `.contact-form` (le formulaire de contact/catalogue, avant `--cream` — flottait
   sur un fond identique côté `.contact`/`.cat-inline` qui sont tous deux `--ink`, donc gain de
   contraste réel). **Volontairement PAS étendu** aux fonds de section `.engagement`, `.ap-where`,
   `.b2c-section` (`--paper`) ni `.mp-band.alt` (`--paper`) : ces 4 contiennent des cartes déjà
   `--white` ou alternent avec une bande `--white`, donc les passer aussi en blanc ferait
   disparaître le contraste carte/fond. **Remplacer la crème `--cream` dominante elle-même
   (13 sections) n'a pas été fait** — décision de marque, pas tranchée, à valider avec le client.
5. **Catalogue produits (`PRODUCTS`) revu** :
   - Ajout de **Tiramisù Choco-Pistache** (`DC08`) — re-vérification du PDF catalogue page par
     page : contrairement à la conclusion d'une session précédente, cette page (10) contient bien
     une vraie photo pot + un vrai texte marketing FR/EN ("Le mélange parfait entre sucré et
     salé..."), extraite en 868×905 depuis un rendu 300dpi de la page. Les 4 autres candidats de
     la liste DC0X (Choco-Caramel/DC04, Coco Rocher/DC09, Cheesecake Spéculoos/DC15, Trois
     Chocolat/DC19) confirmés **non exploitables** après relecture complète des 35 pages : aucune
     page dédiée, seule "Choco Caramel" apparaît (page 26, grille "Onze Delicatessen") sous forme
     d'icône ingrédient générique (barre chocolat-caramel) sans photo produit réelle ni texte —
     pas retenue. Bueno/Mousse Liégeoise non re-cherchés (client confirmé les avoir déjà cherchés
     sans succès).
   - **Retirés du site** (fiche produit + carte grille `index.html` et `desserts.html`) :
     Cheesecake Framboise, Panna Cotta Caramel, Riz au Lait (absents de la liste officielle DC0X).
     Conséquence en cascade repérée et corrigée : Panna Cotta Caramel + Riz au Lait étaient les
     2 SEULS produits de la catégorie "Desserts à la crème" → cette catégorie a disparu
     entièrement, stat `data-count="6"` ("familles de desserts", `index.html`) corrigée en **5**.
     `desserts.html` ("N familles, N créations") se recalcule tout seul (dérivé de `PRODUCTS`).
   - **Tiramisù Classico gardé partout tel quel** (grille "Nos parfums" + section B2C dédiée) —
     conflit signalé mais **pas résolu unilatéralement** : Classico n'est pas dans la liste DC0X
     (normal, lui a ses propres codes `DF0X` pour le B2C retail) mais la consigne demandait de
     retirer les produits hors-liste. Le retirer de la grille aurait laissé la section B2C
     "Format d'emballage pour B2C" vendre un produit sans fiche associée. **Décision à valider
     avec le client** : garder tel quel (fait par défaut), ou retirer uniquement de la grille
     B2B "Nos parfums" en gardant la fiche + section B2C (Classico n'est de toute façon pas vendu
     via le même circuit que les DC0X).
   - Total produits : **13** (15 − 3 retirés + 1 ajouté). Photo `assets/img/products/
     tiramisu-choco-pistache.jpg` ajoutée ; les 3 images des produits retirés (`pannacotta.png`,
     `rizaulait.png`, `cheesecake-framboise.png`) laissées sur disque (non référencées nulle part,
     mais pas supprimées — au cas où le client change d'avis).
   - Vérifié après coup : 0 lien mort, 0 erreur console, 0 requête 404 sur les 19 pages du site
     (crawl automatisé via Playwright).

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

### `build-pages.mjs` — générateur de pages (source unique de vérité pour TOUT, y compris `index.html`)
Script Node **à relancer (`node build-pages.mjs`) après toute modification** des données
produit ou de la structure header/footer commune. Il régénère **toutes** les pages à la racine —
`index.html` compris — : `about.html`, `desserts.html`, `marque-privee.html`, `catalogue.html`,
`contact.html`, tous les `produit-*.html` (19 au 2026-08-04 — le compte évolue, revérifier
`PRODUCTS.length`).
- `PRODUCTS` (tableau JS en haut du fichier) : slug, `category` (clé interne, voir `CATEGORIES`),
  image, couleur de fond, `cover`, `code`, et les champs texte `name`/`tagline`/`desc`/`detail`
  (chaînes françaises simples). **Modifier ici pour changer un produit ou en ajouter un**, puis
  relancer le script. ⚠️ `detail` n'est actuellement **affiché nulle part** dans `productBody()` :
  ne pas supposer qu'un changement dedans est visible sur le site sans vérifier.
- Fonctions `head()`, `header()`, `footer()`, `page()` : structure commune (logo SVG, nav, menu
  plein écran, footer, scripts) partagée par toutes les pages générées, paramétrée par `file`
  (pour le lien actif dans la nav).
- `index.html` est généré par `homeBody()`/`homeMeta()` (bloc "ACCUEIL" en bas du fichier), au
  même titre que les autres pages — **ne plus l'éditer à la main**. Les deux sections communes
  avec `about.html` (histoire de marque "02 — À propos de nous" + piliers "Notre raison d'être")
  sont factorisées dans `aboutStoryBlock(home)` / `raisonDetreBlock(home)` (le paramètre `home`
  bascule id/numérotation/icônes — **ne pas dupliquer ce texte**, il vit une seule fois dans ces
  deux fonctions).

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
- Envisager d'ajouter les variantes de parfums manquantes si le client fournit leurs photos
- Mentions légales / SIRET encore en placeholder ("à compléter") à finaliser avec le client

## Fichier de modification "V5" (traité le 2026-08-04)

`Modification.pages` (non versionné, exclu de git, toujours à la racine de `didolce-site/`)
listait 8 demandes avec captures annotées + une table de codes produits DC0X. Exporté en PDF
complet via Pages (`osascript ... export ... as PDF`) pour lecture intégrale — la simple
`preview.jpg` de l'archive `.pages` ne montre qu'un aperçu partiel, insuffisant pour un document
de plusieurs pages. Les 8 demandes ont été implémentées, voir section **V5** ci-dessus pour le
détail et les points restés en suspens (produits hors-liste à confirmer, produits manquants
faute de photo, interprétation "Mangue"/"Mangue Passion", ambiguïté sur la couleur ciblée par
Modification 6). Rien n'a été déployé (`origin/main` inchangé).
