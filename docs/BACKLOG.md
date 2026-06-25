# Backlog — idées d'amélioration

Liste informelle d'idées à explorer **plus tard**. Rien ici n'est planifié ni priorisé :
on note pour ne pas oublier, on trie quand on voudra en faire une vraie feature.

Pour le travail en cours et les tâches priorisées, voir aussi
[`TODO_PRIORITIZED.md`](./TODO_PRIORITIZED.md).

---

## Comment ajouter une entrée

Copier le bloc modèle en bas de fichier, remplir, laisser le statut à `idée`.

---

## Idées mini-jeux / modes de jeu

### Top War–like — plateformes aléatoires

**Statut :** idée  
**Inspiration :** Top War (exploration / choix de rencontres)

**Pitch :** le joueur avance sur une plateforme. En avançant, il tombe au hasard
sur d'autres plateformes qui proposent soit une amélioration, soit un combat.
À chaque rencontre : **explorer oui / non** (passer son chemin).

**Pistes de design :**

- Carte ou lane horizontale / verticale simple.
- Types de plateformes : buff, ressource, combat obligatoire si accepté, shop, événement rare.
- Boucle : avancer → choix → conséquence → avancer.
- Lien possible avec le village (renom, ressources, tickets) ou mode autonome type « run ».

**Questions ouvertes :**

- Persistance entre sessions ou run roguelite ?
- Lien avec un compagnon guide (Talia exploratrice ?) ?
- Énergie / limite de runs par jour ?

---

### Capybara Go–like — aventure RP

**Statut :** idée  
**Inspiration :** Capybara Go (aventure narrative légère)

**Pitch :** mode aventure **RP** : le joueur progresse dans une histoire avec
choix, rencontres, récompenses et montée de stats / compagnons / Myrions.
Ton cozy, sessions courtes, peu de punition.

**Pistes de design :**

- Chapitres ou « jours » d'aventure avec événements aléatoires pondérés.
- Choix de dialogue + conséquences légères (ressources, affinité, objet).
- Carte du monde simplifiée (biomes du refuge ? villages ?).
- Réutiliser le système de tons des conversations Liens (`sincere`, `playful`, etc.).

**Questions ouvertes :**

- Héros = joueur seul ou compagnon + Myrion lié ?
- Idle entre deux étapes ou 100 % actif ?
- Lien avec la chasse / le refuge existants ?

---

### War Thunder–like — tir latéral + vagues + évolution

**Statut :** idée  
**Inspiration :** War Thunder (action) + variante **évolution** (type idle evolution)

**Pitch :** déplacement **gauche / droite**, tir **tout droit** (shoot'em up horizontal
simplifié). Entre les vagues, choix exclusif (ou prioritaire) :

1. **Reculer la vague** — repousser / retarder l'assaut ennemi.
2. **Améliorer les armes** — dégâts, cadence, portée.
3. **Améliorer les unités** — vie, vitesse, nombre.

**Variante évolution (aimée) :** ligne d'évolution visuelle et ludique, par exemple :

`poisson → crocodile → dragon → capybara` (ou autres lignées par biome / compagnon)

Chaque palier change le sprite et les stats ; le capybara (ou forme finale) =
payoff humoristique / cozy aligné avec le ton du jeu.

**Pistes de design :**

- Vagues courtes, mobile-friendly (touch gauche/droite + bouton tir auto optionnel).
- Boss tous les N cycles ; récompenses village (bois, pierre, cristaux).
- Compagnon associé possible : Runa (forge / armes), Kael (théâtre / spectacle de bataille).

**Questions ouvertes :**

- Vue pure arcade ou intégrée à un bâtiment (théâtre, forge, ferme) ?
- Coop idle (unités continuent hors écran) ou session fermée ?
- Plusieurs lignées d'évolution (une par biome Myrion) ?

---

## Refuge — mini-jeux avec compagnons (Myrions)

**Contexte actuel :** le refuge (`farm-dressage`, Sora) propose déjà nourrir, câliner,
jouer, observer — sans mini-jeu dédié ni présence visuelle du compagnon dans l'action.
Idée : **jouer avec tes Myrions aux côtés d'un compagnon** (Sora en priorité, Talia
pour course/chasse, autres selon biome).

**Règle transversale — difficulté selon rareté :**

- Plus le Myrion est rare, plus le mini-jeu est exigeant (fenêtres plus courtes,
  patterns plus rapides, IA adversaire plus réactive).
- Piste de mapping :
  - **N / SR** — facile, tutoriel possible.
  - **SSR / UR** — normal / difficile.
  - **LR (légendaires)** — dur par défaut ; récompenses et affection proportionnelles.
- Réutiliser les constantes rareté existantes (`wildFamiliars.ts`, capture timing LR
  déjà plus strict) pour calibrer vitesse, tolérance et score requis.
- Option : débloquer la version « difficile » seulement si affection Myrion ≥ 3.

---

### Dressage — mini-jeux dédiés par Myrion

**Statut :** idée  
**Contexte :** extension du refuge (`farm-dressage`) : certains Myrions (selon espèce,
trait, rareté ou affection) débloquent un **mini-jeu spécifique** au lieu du simple
bouton « Jouer ». Sora (ou le compagnon du bâtiment) introduit l'activité.

**Pitch :** trois familles de mini-jeux jouables **avec un Myrion choisi** :

#### 1. Course — style Mario Kart

- **3 pistes** par biome (ou 3 pistes globales débloquées progressivement).
- **Boost** : pads au sol, drift court, item box cozy (étoile, champignon, bouclier…).
- **Obstacles ponctuels** : sauter (tronc, rocher) ou **esquiver** (boue, spike) —
  pas à chaque tour, pour garder le rythme accessible mobile.
- 1–3 adversaires CPU (autres Myrions chibi) ; classement = joie + affection + ressource.
- **LR :** IA plus agressive, obstacles plus serrés, boost plus rare.

#### 2. Papouillage — style Nintendogs

- **Main / brosse fixe** à l'écran ; le joueur **frotte, tapote, gratte** la zone
  indiquée (tête, ventre, dos) selon les préférences du Myrion (traits).
- **Feedback immédiat** : fermeture des yeux, ronron, queue, cœurs, son doux.
- Jauge de satisfaction ; zones préférées / interdites par espèce (chat vs reptile…).
- Pas de score compétitif — cozy pur ; bonus joie / affection / lien.
- **LR :** zones plus petites ou Myrion plus mobile ; réussite = gros bonus affection.

#### 3. Combat — style Pokémon

- Duel **1v1** tour par tour (ou semi-temps réel court) entre le Myrion du joueur
  et un adversaire (sauvage invité, rival chibi, dummy d'entraînement).
- **4 moves** max par espèce (type biome : feuille, eau, cristal…) ; PP / cooldown simple.
- Barres PV, statuts légers (sommeil, boost) ; **pas de KO permanent** — défaite =
  humeur basse, victoire = affection + petit loot refuge.
- Compagnon coach (Sora, Runa…) : conseil type « super efficace » une fois par combat.
- **LR :** plus de coups enchaînés, moins de temps pour choisir ; récompense rare.

**Pistes transverses :**

- Hub « Jouer » dans `DressageGame` : liste des mini-jeux dispo pour le Myrion sélectionné.
- Déblocage : affection ≥ 2, ou espèce avec tag `course` / `combat` / `câlin`.
- Réutiliser enclos + chibis existants ; pistes course = fond dérivé du biome.
- Voir aussi les entrées détaillées ci-dessous (Chocobo, criquet WWM, caresser).

**Questions ouvertes :**

- Un Myrion = un seul type de mini-jeu, ou plusieurs selon le niveau d'affection ?
- Course et combat en 2D side / top-down, ou pseudo-3D léger (Kart simplifié) ?
- Matchmaking local (3 Myrions du joueur en équipe) plus tard ?

---

### Mini-course — course de Chocobo

**Statut :** idée  
**Inspiration :** Final Fantasy (course de Chocobo), **Mario Kart** (boost, items, obstacles)  
**Voir aussi :** [Dressage — mini-jeux dédiés par Myrion](#dressage--mini-jeux-dédiés-par-myrion)

**Pitch :** mini-jeu de **course** dans l'enclos ou sur piste du biome. Le joueur
pilote (ou encourage) un Myrion monté / qui galope ; le **compagnon** commente,
encourage ou lâche un bonus (Talia, Sora).

**Pistes de design :**

- Contrôles simples mobile : tap alterné, swipe ou bouton « sprint » avec jauge stamina.
- Obstacles de biome (pollen prairie, racines forêt, flaques marais…).
- 1 à 3 adversaires NPC (Myrions sauvages chibi) ; course courte (30–60 s).
- Récompenses : joie, affection, ressource biome, petite chance de faveur chasse.
- **LR :** piste plus longue, adversaires plus rapides, fenêtre de sprint plus courte.

**Questions ouvertes :**

- Course solo contre chrono ou toujours contre CPU ?
- Multi-myrions (parier sur le sien) plus tard ?
- Lien visuel avec les enclos existants (`DressageGame`) ?

---

### Combat — style criquet (WWM)

**Statut :** idée  
**Inspiration :** *Where Winds Meet* (criquets), **Pokémon** (duel tour par tour, types)  
**Voir aussi :** [Dressage — mini-jeux dédiés par Myrion](#dressage--mini-jeux-dédiés-par-myrion)

**Pitch :** duel **1v1** entre Myrions (chibi), tour ou temps réel très court.
Le joueur choisit des **actions** (charge, feinte, défense, cri de stat) ; le compagnon
coache depuis le bord (Sora, Runa, Kael selon ton).

**Pistes de design :**

- Boucle : annonce → choix joueur (rochon-feuille-ciseaux élargi ou 3 skills) → résolution animée.
- Stats Myrion (vigueur, traits `fier`, `joueur`) modifient options ou dégâts.
- Pas de mort : perdant perd humeur, gagnant gagne affection / petit buff refuge.
- **LR :** adversaire plus intelligent (contre plus souvent), moins de temps pour choisir,
  patterns en 2 coups ; victoire = récompense supérieure (ressource rare, faveur niv. 2).

**Questions ouvertes :**

- Combat contre Myrion du joueur (entraînement) ou sauvage invité ?
- Intégration traits / buffs support déjà présents sur les pets ?
- Spectateur compagnon avec ligne de dialogue selon résultat ?

---

### Caresser — main fixe + animation

**Statut :** idée  
**Inspiration :** **Nintendogs**, tamagotchi / Neko Atsume — interaction tactile douce  
**Voir aussi :** [Dressage — mini-jeux dédiés par Myrion](#dressage--mini-jeux-dédiés-par-myrion)

**Pitch :** remplacer ou enrichir le bouton **Câliner** actuel par une vraie micro-interaction :
une **main / patte fixe** à l'écran (overlay UI) et une **petite animation** sur le
Myrion chibi (ferme les yeux, penche la tête, queue, particules cœur).

**Pistes de design :**

- Zone de caresse : tap maintenu ou petit geste circulaire sur la tête / dos.
- Jauge de « confort » qui se remplit ; relâcher au bon moment = bonus joie / affection
  (extension du roll 40 % actuel dans `DressageGame`).
- Compagnon présent en coin : Sora montre comment faire (première fois), voix optionnelle.
- Animation légère CSS / sprite sheet ; pas de mini-jeu compétitif — cozy avant tout.
- **LR :** zone de caresse plus petite ou Myrion plus capricieux (bouge, faut recentrer) ;
  réussite = +affection plus marqué ou faveur shiny rare.

**Questions ouvertes :**

- Remplacer le bouton actuel ou mode « approfondi » optionnel ?
- Variantes par trait (`calme` vs `joueur`) ?
- Haptic / vibration mobile ?

---

## Modes de jeu / combat & auto

### TFT — auto-battler Myrions / compagnons

**Statut :** idée  
**Inspiration :** Teamfight Tactics, auto-chess

**Pitch :** mode **auto-battler** sur grille : placement avant le combat, puis
résolution automatique. Unités possibles : **Myrions seuls**, **compagnons seuls**,
ou **les deux** — à trancher selon ce qui s'intègre le mieux au lore et aux assets.

**Pistes de design :**

- Plateau simple (hex ou carré), 6–8 slots, synergies biome / espèce / trait Myrion.
- Compagnons en « capitaines » avec aura ; Myrions en troupe chibi.
- Économie de run : pièces par manche, reroll shop, fusion 3× même unité.
- Récompenses village ou ressources refuge ; sessions courtes (10–15 min).

**Questions ouvertes :**

- Myrions uniquement, compagnons uniquement, ou roster mixte ?
- PvE par manches + boss final, ou ladder sans fin ?
- Lien avec la chasse (recruter des Myrions) et les Liens (compagnons débloqués) ?

---

### Raid boss — compagnons regroupés (style RPG)

**Statut :** idée  
**Inspiration :** RPG classique (party vs boss), raids mobile

**Pitch :** le joueur **constitue un groupe de compagnons** (3–5) pour affronter
un **boss** (Myrion légendaire géant, menace de biome, boss de donjon). Combat
semi-auto ou tour par tour simplifié, focus sur la composition d'équipe et les rôles.

**Pistes de design :**

- Rôles : tank / heal / DPS / support — mappés sur les compagnons existants.
- Phases de boss, mécaniques simples (esquiver AoE, break bar, faiblesse élément).
- Récompenses : ressources rares, skins, tickets, progression affinité groupe.
- Cinématique cozy avant/après ; pas de permadeath.

**Questions ouvertes :**

- Combat actif ou auto avec ordres prioritaires ?
- Boss lié au refuge, au donjon (onglet), ou événement limité ?
- Myrions en familiers de compagnon (buff passif) ou absents de ce mode ?

---

### Vampire Survivors–like

**Statut :** idée  
**Inspiration :** Vampire Survivors, Brotato

**Pitch :** vue top-down ou isométrique, **déplacement auto ou joystick simple**,
horde d'ennemis, **montée de niveau en run** avec choix de upgrades aléatoires.
Session 15–20 min, courbe de puissance satisfaisante, ton cozy malgré le chaos.

**Pistes de design :**

- Héros = compagnon ou Myrion monté ; armes / sorts qui évoluent (fusion VS-like).
- Vagues + mini-boss ; boss final à 20 min.
- Upgrades : zone, cadence, projectiles, magnet pickup, regen.
- Récompenses meta : débloquer nouvelles armes / personnages pour les runs suivantes.

**Questions ouvertes :**

- Intégré à un bâtiment (théâtre, ferme) ou mode hub séparé ?
- Multi-biomes comme « stages » avec modificateurs ?
- Coop idle (continuer une run en arrière-plan) ou session fermée uniquement ?

---

## Gestion & refuge étendu

### Mini-jeux de gestion — zoo, auberge

**Statut :** idée  
**Inspiration :** gestion zoo / auberge (Theme Hospital, Two Point, inn management)

**Pitch :** couche **gestion légère** en plus du refuge actuel : organiser
l'**auberge** (chambres, clients, services) et/ou un **zoo / parc Myrions**
(enclos, visiteurs, soins, satisfaction). Boucle assigner → attendre / jouer →
collecter → améliorer.

**Pistes de design :**

- **Auberge :** Nami / accueil, quêtes clients, ressources nourriture, réputation village.
- **Zoo / parc :** enclos par biome, file de visiteurs, propreté, nourriture, événements.
- UI par bâtiment ; pas besoin de sim lourde — timers + choix + petits événements.
- Lien avec Myrions du refuge (exposer les espèces capturées augmente revenus / joie).

**Questions ouvertes :**

- Deux mini-jeux séparés ou un seul hub « gestion » ?
- Idle pur ou micro-actions fréquentes ?
- Monétisation soft (cosmétiques enclos) ou 100 % progression ingame ?

---

### Refuge — onglets Ferme, Mine, Donjon…

**Statut :** idée  
**Contexte :** aujourd'hui les Myrions errent dans l'enclos ; risque d'**ennui**
si peu d'interactions. Idée : **plusieurs zones / onglets** dans le refuge où
les Myrions peuvent **s'occuper** selon leur espèce, rareté ou trait.

**Pitch :** ajouter des **onglets** (ou bâtiments internes au refuge) :

- **Ferme** — production ressources, récolte idle.
- **Mine** — extraction pierre / cristaux, risque / fatigue.
- **Donjon** — exploration courte, combat auto, loot.
- (Autres : **forêt**, **étang**, **volière**… selon biomes.)

Le joueur **assigne** des Myrions à une zone ; ils y restent visuellement (chibi
animé), génèrent des bonus et ne « s'ennuient » plus si occupés.

**Pistes de design :**

- Capacité par zone (3–5 Myrions) ; bonus si synergie biome / trait.
- Jauge **ennui** ou **joie** : baisse si inactif trop longtemps, remonte si assigné.
- Débloquage progressif des onglets (stage village, quêtes Sora).
- Chaque onglet peut accueillir un **mini-jeu léger** optionnel (pas que idle).

**Questions ouvertes :**

- Onglets UI horizontaux vs carte cliquable du refuge ?
- Un Myrion à la fois dans une seule zone ou multi-tâches ?
- Lien avec la mine / ferme du village global ou économie séparée refuge ?

---

## Event Disagrea — compagnons invités

### Pleinair — paliers affinité 2–5 (proximité enfant)

**Statut :** idée — à traiter avant intégration jeu / regénération visuelle  
**Contexte :** portraits L1–L5 validés en `assets/event-disagrea/integrated/` (pipeline scene-originale-v1). Etna, Flonne, Laharl OK en arc intimité adulte soft.

**Problème :** Pleinair est une **enfant**. Les paliers 2–5 actuels (chambre intime, poses « peak bond ») ne conviennent pas — trop proches d’une intimité adulte.

**Piste :** repenser L2–L5 comme **rapprochement affectif type parent / tuteur** :
- confiance, protection, complicité douce ;
- décors : chambre cozy, salon, jardin — **pas** chambre romantique ;
- poses : main tendue, lecture ensemble, peluche partagée, sourire rare — **pas** allongée sur lit intime.

**Assets concernés :** regénérer `pleinair` affinity 02–05 ; garder L1 actuel ou ajuster si besoin.

**Réfs :** `assets/event-disagrea/integrated/VALIDATED_MANIFEST.json`, `src/data/eventDisagreaPack.ts` (note sur `pleinair`).

---

### Skinline Premium — skins intimes cachés (v4)

**Statut :** assets prêts — intégration jeu à planifier  
**Répertoire :** [`staging/skinline-premium/`](../staging/skinline-premium/)  
**Catalogue :** [`staging/skinline-premium/MANIFEST.json`](../staging/skinline-premium/MANIFEST.json)  
**Candidats affinité (v1–v3) :** [`intime-bed-batch/AFFINITY_REPLACEMENT.md`](../staging/companion-visual-pack/intime-bed-batch/AFFINITY_REPLACEMENT.md)

**Pitch :** variante visuelle premium par compagnon (batch intime v4 — cadrages créatifs type Mira/Talia). Chaque skin a une **condition de déblocage cachée unique**, jamais affichée avant unlock (pas de hint in-game).

**Assets :** 21 PNG (19 compagnons ; Mira + Talia ont 2 variantes). Sora et Etna v4 ajoutées (2026-06-24).

**Pistes d'intégration :**

- Flag `skinlinePremiumUnlocked[companionId]` (ou par `variantId`) dans la save.
- Déclencheurs : voir `hiddenUnlock` par entrée dans le MANIFEST (trackers mini-jeux, affinité, events).
- UI : skin alternatif dans galerie Liens / affinité une fois débloqué ; slot vide + « ??? » avant (optionnel, sans révéler la condition).
- Pleinair : ton parental uniquement (cohérent backlog Pleinair L2–5).

**Questions ouvertes :**

- Un seul skin premium actif par compagnon ou choix entre variantes (Mira/Talia) ?
- Notification discrète au unlock ou découverte pure sans popup ?
- Lien avec palier affinité 5+ ou 100 % gameplay secret ?

---

## Autres idées (template)

<!--
### [Titre court]

**Statut :** idée | à affiner | maybe | abandonné
**Inspiration :** …

**Pitch :** …

**Pistes :** …

**Questions :** …
-->

---

## Modèle pour nouvelle entrée

```markdown
### [Titre]

**Statut :** idée
**Inspiration :** …

**Pitch :** …

**Pistes de design :** …

**Questions ouvertes :** …
```
