# Design de jeu actuel — Havre des Brumes

> Document décrivant **ce qui est implémenté aujourd'hui**, pas la vision cible finale.  
> Dernière mise à jour : 2026-06-22

## Pitch

Jeu idle cozy fantasy sans microtransactions. Le joueur développe un village dans les brumes, entretient des **compagnons** (relations / stats), invoque au **gacha** (tickets gagnés en jeu), joue des **mini-jeux** liés aux bâtiments, et collectionne des **Myrions** (créatures par biome) via chasse, refuge et reproduction.

## Boucle principale

1. **Production passive** — bâtiments génèrent ressources toutes les 5 s
2. **Amélioration bâtiments** — débloque mini-jeux, outils, production
3. **Mini-jeux** — récompenses bonus, capture Myrions, progression quêtes
4. **Gacha événement** — fragments compagnons, jetons de stat, ressources
5. **Progression compagnons** — entraînement, affinité, stats (fragments / jetons)
6. **Village** — population, besoins, stades (Campement → Cité des Brumes)
7. **Hors-ligne** — jusqu'à 168 h de production au retour

## Ressources (12)

| ID | Label | Rôle principal |
|----|-------|----------------|
| coins | Pièces | Monnaie générale |
| wood | Bois | Construction |
| stone | Pierre | Construction |
| food | Vivres | Besoins population |
| silk | Soie | Compagnons / atelier |
| mana | Mana | Bibliothèque arcane |
| renown | Renom | Progression |
| ingredients | Ingrédients | Cuisine / craft |
| crystals | Cristaux | Affinité haute |
| gifts | Cadeaux | Compagnons |
| tickets | Tickets | Gacha |
| stardust | Poussière stellaire | Affinité / craft |

## Village

### Bâtiments (8)

| ID | Nom | Déblocage stade |
|----|-----|-----------------|
| inn | Auberge | 0 |
| mist-garden | Jardin des Brumes | 0 |
| ribbon-workshop | Atelier des Rubans | 1 |
| clear-spring | Source Claire | 1 |
| moon-farm | Ferme Lunaire | 2 |
| arcane-library | Bibliothèque Arcane | 2 |
| traveler-theater | Théâtre du Voyageur | 3 |
| star-market | Bazar des Étoiles | 4 |

### Population

- **5 besoins** : Vivres, Santé, Sécurité, Loisirs, Prospérité (0–100 %)
- **5 stades** : Campement → Hameau → Village → Bourg → Cité des Brumes
- Bonheur moyen → croissance population → bonus production léger (+15 % max)
- Archétypes cité (militaire, tourisme, économique, arcane, harmonie) — influence future

### Carte

- Panorama horizontal scrollable (12800×4263 px)
- Pancartes cliquables → panneau bâtiment / mini-jeux
- Bâtiments visuellement intégrés dans l'art (pas d'overlays sprites séparés en jeu actuel)

## Compagnons (15)

Lyra, Maeve, Seren, Nami, Iris, Kael, Runa, Solene, Talia, Mira, Asha, Elwen, Noa, Sora, Zelie.

### Progression

| Axes | Mécanique |
|------|-----------|
| Niveau | Entraînement (coût ressources) |
| Affinité | 5 paliers narratifs (coût croissant) |
| Stats | Charme, Esprit, Force, Agilité, Chance |
| Points libres | Gagnés au level-up |
| Fragments | 10 fragments = +1 stat (onglet Liens) |
| Jetons gacha | +1 stat ciblée (SR+) |

### Paliers affinité (visuels)

| Niv. | Thème narratif |
|------|----------------|
| 1 | Rencontre au travail |
| 2 | Premier rendez-vous |
| 3 | Moment intime suggestif (non explicite) |
| 4–5 | Placeholders fade-to-black (toggle mature optionnel) |

### Conversations

- Mini-jeu dialogue : 3 échanges × 4 choix, personnalité compagnon
- Scénarios générés (`companionScenarios.generated.ts`)

## Gacha

- **Monnaie :** tickets (gagnés en jeu ; **gratuits en mode dev**)
- **Tirages :** x1, x10, x50, x100
- **Pity :** SSR+ /10, UR /50, LR /100
- **Loot :** ressources, fragments compagnon, jetons de stat
- **Animation :** porte / burst / révélation (`GachaOpening.tsx`)

## Mini-jeux

### Types implémentés (14)

tap-sequence, harvest-rush, timing-bar, bubble-pop, tile-merge, memory-pairs, beat-tap, swap-match, tower-defense, idle-farm, pet-sanctuary, familiar-capture, dressage, conversation

### Accès

- Lié au niveau du bâtiment + stade village
- **Mode dev :** tous débloqués (`DEV_UNLOCK_ALL_MINIGAMES`)

## Myrions

### Collection

- **85 espèces** réparties sur **8 biomes**
- Raretés : N, R, SR, SSR, UR, LR
- **Limite : 10 exemplaires par espèce** (`MAX_SPECIES_COPIES`)

### Chasse & capture

- Sélection biome + objectif chasse
- Mini-jeu capture (`FamiliarCaptureGame`, `CaptureRingGame`)
- Faveurs actives (buffs temporaires chasse)
- Comparaison avec doublons / remplacement / relâchement

### Refuge

- Enclos par biome (PNG + chibis qui errent)
- Soins : nourrir, câliner, jouer, observer
- Humeur refuge agrégée
- **Debug panel** spawn (mode dev)

### Reproduction (MVP3)

- Compatibilité parents (strong / normal / unstable / blocked)
- Œufs echo (`EchoNursery`) → éclosion
- Génération, lignée, variants visuels, shiny

### Liaison compagnon

- Un Myrion peut être lié à un compagnon
- Buffs de support appliqués au compagnon lié
- LR : bonus unique, pas de liaison standard

### Craft refuge

- Recettes consommant ressources biome (`myrionCraft.ts`)

## Quêtes

- Plateau infini procédural (`infiniteQuests.ts`)
- Récompenses ressources / progression
- Compteur total réclamées

## Inventaire

Sections : ressources village, craft, arcane, festival, **fragments compagnons** (portrait + nom + badge qty), jetons stat, outils atelier, ferme, familiers, capture, points stat compagnons.

## Contraintes contenu mature

- Personnages adultes, consentement fictionnel
- Paliers 4–5 modérés par défaut
- Toggle `maturePlaceholders` pour activer visuels suggestifs
- Assets originaux ou sous licence — voir `README.md`

## Ce qui n'est PAS encore le design cible

- Économie équilibrée (mode dev fausse les coûts gacha)
- Progression village ↔ biomes verrouillée finement
- Tous compagnons avec chibi
- Vidéo gacha cinématique fluide
- PWA / mobile natif
- Multijoueur / social
