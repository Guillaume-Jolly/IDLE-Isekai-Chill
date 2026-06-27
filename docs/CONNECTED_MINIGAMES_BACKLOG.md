# Backlog design — 4 mini-jeux connectes

Document de synthese pour ne pas perdre la vision discutee autour de quatre
mini-jeux qui se repondent. Ce n'est pas une specification d'implementation
immediate : chaque systeme doit rester en backlog jusqu'a un cadrage MVP separe.

---

## Vision globale

Les quatre mini-jeux forment un socle coherent ou chaque activite a son plaisir
propre, mais produit aussi des ressources, indices ou deblocages pour les autres.

```text
Auberge des Brumes      = composer des lieux
Chroniques Vivantes     = composer des histoires
Atelier Distordu        = composer des potions
Plateau des Elements    = composer des runes / sorts
```

Principe central :

- le joueur casual doit pouvoir jouer vite, suivre les couleurs / familles, et
  obtenir une recompense a chaque run ;
- le joueur puzzle doit pouvoir chercher des connexions cachees, ordres parfaits,
  recettes secretes, runes interdites et interactions inattendues ;
- aucun secret ne doit bloquer la progression principale ;
- les systemes doivent etre extensibles via events type Disagrea, Slime, saison,
  Halloween, hiver, etc.

Philosophie d'equilibrage :

```text
Run faible      = recompense faible, jamais zero.
Run normale     = objectif simple ou chaine visible.
Run bonne       = chaine 3+ / recette / chronique correcte.
Run excellente  = chaine longue + secret / fin parfaite / rune rare.
```

Le but est de s'amuser et de decouvrir. Ne pas terminer une grille ou rater dix
essais d'affilee serait trop frustrant pour Wonderland.

---

## Carte des echanges entre mini-jeux

### Auberge -> Bibliotheque

- Rumeurs de clients.
- Fragments de lore.
- Plans de pieces anciennes.
- Indices de combos spatiaux.
- Contes lies aux salles construites.

### Bibliotheque -> Auberge

- Indices de chaines cachees.
- Clients speciaux.
- Nouvelles pieces dans le pool.
- Objectifs secrets ou commandes speciales.
- Explication lore de certaines pieces event.

### Auberge -> Atelier de Noa

- Ingredients physiques : herbes, eaux thermales, epices, cristaux, spores.
- Pieces productrices : serre, bain, cuisine, cave magique, jardin nocturne.
- Besoins concrets qui inspirent des potions utilitaires.

### Atelier de Noa -> Auberge

- Potions de confort, chaleur, parfum, tirage favorable.
- Catalyseurs de clients rares ou fantomes.
- Revelateurs de contraintes cachees.
- Buffs de run ou bonus de production.

### Bibliotheque -> Atelier de Noa

- Recettes oubliees.
- Mises en garde sur potions interdites.
- Cartes alchimiques partielles.
- Noms de potions mythiques.
- Conditions exactes pour stabiliser une formule.

### Atelier de Noa -> Bibliotheque

- Encre magique.
- Revelateurs de pages cachees.
- Potions de memoire.
- Fragments de chroniques scellees.

### Auberge / Bibliotheque / Noa -> Sora

- Auberge : usages concrets a transformer en runes pratiques.
- Bibliotheque : theories, legendes, alphabets runiques.
- Noa : encres, catalyseurs, solvants, materiaux de gravure.

### Sora -> les autres mini-jeux

- Runes utilitaires pour l'auberge.
- Runes de lecture / memoire pour la bibliotheque.
- Runes de stabilisation / catalyse pour les potions.
- Runes quotidiennes pour le Havre : eau chaude, lumiere douce, anti-brume,
  conservation, chauffage, croissance, silence, confort Myrions.

---

## 1. Nami — Auberge des Brumes

### Pitch

Nami restaure une auberge magique instable pres du Havre. L'auberge change,
revele des ailes oubliees, et propose a chaque run une nouvelle case a explorer.
Chaque case decouverte donne des ressources et des contraintes, puis le joueur
choisit une piece a amenager parmi trois propositions compatibles.

Inspiration :

- Blue Prince pour le choix de pieces et la maison changeante ;
- Tiles Survive! pour l'exploration de cases et la progression par zones ;
- gestion cozy / auberge pour l'identite Wonderland.

### Boucle de run

```text
Choisir une case brumeuse
-> explorer la zone
-> decouvrir ressources + contraintes
-> recevoir 3 propositions de pieces compatibles
-> choisir 1 piece a amenager
-> connecter familles / couleurs
-> obtenir recompenses visibles et peut-etre un secret
```

Une run peut etre tres courte : une case, une decision, une recompense.

### Contraintes de case

Chaque case decouverte porte 2 a 4 contraintes qui influencent les pieces
proposees :

| Contrainte | Pieces possibles |
|------------|------------------|
| Source chaude | Bain thermal, onsen, hammam, cuisine vapeur |
| Sol fertile | Jardin, serre, terrasse fleurie |
| Mur solide | Atelier, reserve, cave, salle de service |
| Mur fragile | Salon leger, chambre simple, jardin interieur |
| Brume dense | Relais de brume, observatoire, salle mystique |
| Grande acoustique | Scene, salon musical, salle de degustation |
| Souterrain | Cave magique, cellier, laboratoire annexe |
| Vue etoilee | Terrasse lunaire, observatoire, suite premium |

La case ne dit pas seulement "quelle piece est la", mais "quel potentiel a ce
lieu".

### Categories visibles

Les categories sont faciles a lire par couleur / icone.

- Chaleur
- Gastronomie
- Repos
- Nature
- Mystique
- Spectacle
- Service / stockage
- Luxe

Exemples de chaines simples :

```text
Bain thermal + Onsen + Hammam
= chaine Chaleur x3
= objets d'affinite
```

```text
Cuisine + Restaurant + Salon de degustation
= chaine Gastronomie x3
= nourriture / recettes
```

### Bonus cumulatifs

Une famille doit rapporter davantage si le joueur connecte plus que le minimum.

Exemple Chaleur :

| Connexion | Recompense |
|-----------|------------|
| 2 pieces | herbes de bain |
| 3 pieces | objet d'affinite commun |
| 4 pieces | objet d'affinite rare |
| 5+ pieces | bonus Sora / rune / decor thermal |

Exemple Gastronomie :

| Connexion | Recompense |
|-----------|------------|
| 2 pieces | nourriture simple |
| 3 pieces | plats rares |
| 4 pieces | panier compagnon |
| 5+ pieces | recette speciale / buff |

### Couche puzzle cachee

Les relations cachees donnent l'envie de decouvrir, sans bloquer le casual.

Types de secrets :

1. Connexion inattendue :

   ```text
   Bibliotheque + Cuisine + Chambre douce
   = Gouter d'histoires
   ```

2. Ordre exact :

   ```text
   Serre -> Bain thermal -> Salle de repos
   = Bain des fleurs
   ```

3. Placement spatial :

   ```text
   Bain thermal + Hammam + Salle des serviettes autour du Vestiaire
   = Rituel thermal complet
   ```

4. Symetrie :

   ```text
   Chambre calme | Couloir | Chambre calme
   = Aile miroir
   ```

5. Contradiction fertile :

   ```text
   Cave froide + Bain chaud
   = Source contrastee
   ```

6. Piece leurre :

   ```text
   Debarras
   = utile pour Passage secret / Chambre du concierge / Client fantome
   ```

### Regles anti-frustration

- Toujours proposer au moins une piece utile dans les trois choix.
- Garantir une piece de la famille de l'objectif du jour.
- Les cul-de-sac doivent donner un bonus fort, jamais etre de simples pieges.
- Un reroll doux peut exister : "Demander conseil a Nami".
- Un run doit toujours donner ressources + progression + confort, meme sans combo.
- Les secrets donnent du bonus, jamais un verrou principal.

### Pieces et assets

Une seule image par piece suffit si l'application peut tourner les pieces. Pour
eviter les assets infinis :

- pas de texte dans l'image ;
- portes / ouvertures alignees sur la grille ;
- lumiere pas trop directionnelle ;
- overlay UI pour connexions si besoin.

Formes utiles :

1. cul-de-sac une porte ;
2. couloir droit deux portes ;
3. angle deux portes ;
4. salle traversante ;
5. salle en T ;
6. croisement quatre portes ;
7. grande salle speciale.

Ordres de grandeur :

- MVP : 24 a 30 pieces.
- V1 confortable : 45 a 60 pieces.
- Long terme avec events : 80 a 120 pieces.

### Events

Les events ajoutent des packs de pieces qui appartiennent aux categories
existantes et portent un tag special.

Exemple Disagrea :

- Bain demoniaque : Chaleur + Mystique + `event:disagrea`
- Cuisine infernale : Gastronomie + Spectacle + `event:disagrea`
- Dortoir Prinny : Repos + Service + `event:disagrea`
- Scene du Netherworld : Spectacle + Mystique + `event:disagrea`

Exemple Slime :

- Bassin gelatineux : Chaleur + Repos + `event:slime`
- Cuisine de gelee : Gastronomie + Mystique + `event:slime`
- Nursery Slime : Repos + Nature + `event:slime`
- Salon rebondissant : Spectacle + Repos + `event:slime`

---

## 2. Bibliotheque — Chroniques Vivantes

### Compagnon / batiment a trancher

Le concept appartient a la bibliotheque et peut etre porte par un ou plusieurs
compagnons selon le canon final :

- Kael : angle recit, mise en scene, contes, theatre.
- Lyra : angle magie, grimoires, runes, bibliotheque arcanique.
- Elwen : angle archives, classement, memoire feerique.

La decision peut rester ouverte tant que le MVP n'est pas implemente.

### Pitch

Les fragments obtenus ailleurs ne sont pas seulement ranges : ce sont des
morceaux d'histoires vivantes. Le joueur assemble des lieux, personnages,
objets, problemes et fins, puis lance une mini-aventure narrative courte.

Inspiration :

- Capybara Go pour l'aventure courte a choix ;
- livres vivants / contes magiques ;
- puzzle de sequence pour les fins parfaites.

### Boucle

```text
Recevoir fragments de lore
-> choisir un livre / chronique
-> assembler une sequence coherente
-> lancer une aventure narrative
-> choisir des pages / evenements
-> obtenir une fin confuse, correcte ou parfaite
-> debloquer lore, indices, recettes, runes ou pieces
```

### Types de fragments

- Lieu : Source chaude oubliee, Jardin nocturne, Chambre miroir.
- Personnage : client etrange, Myrion nerveux, voyageuse sans nom.
- Objet : fleur de vapeur, cle de cuivre, fiole irisee.
- Probleme : brume bloquee, memoire perdue, porte sans mur.
- Epreuve : choix moral, enigme douce, rite magique.
- Fin : bain des fleurs, banquet secret, chambre revelee.

### Stats de chronique

Au lieu de PV / attaque :

| Stat | Usage |
|------|-------|
| Inspiration | choix creatifs |
| Clarte | eviter fins confuses |
| Tendresse | recompenses d'affinite |
| Mystere | routes cachees |
| Courage | epreuves |
| Memoire | conserver indices |

### Lecture casual

Le joueur suit les tags / couleurs.

```text
Fragments Chaleur + Nature
-> histoire coherente
-> fin correcte
-> recompense sympa
```

### Lecture puzzle

Certaines histoires ont une sequence parfaite cachee.

```text
Serre nocturne
-> Fleur de vapeur
-> Bain thermal
-> Myrion nerveux
-> Salle de repos
= Chronique parfaite : Le Bain des Fleurs
```

La version parfaite donne :

- objet d'affinite rare ;
- indice de combo Auberge ;
- decor ;
- dialogue compagnon ;
- parfois une theorie runique pour Sora.

### Exemple de chronique

Titre : `La Source qui Murmurait`

Chapitre 1 :

> Une source chaude apparait entre deux pages humides. Une vapeur dessine la
> silhouette d'un Myrion.

Choix :

1. suivre la vapeur : +Mystere ;
2. appeler le compagnon lie au soin / calme : +Tendresse ;
3. noter les symboles : +Clarte.

Chapitre 2 :

> Le Myrion tremble devant une fleur de vapeur.

Choix :

1. cueillir la fleur ;
2. la laisser flotter ;
3. la poser dans l'eau.

Fins possibles :

- confuse : ressources faibles + note incomplete ;
- correcte : recompense Chaleur / Nature ;
- parfaite : secret Auberge + theorie de rune.

### Sorties vers les autres mini-jeux

Vers Auberge :

- indice de combo ;
- piece rare dans le pool ;
- client special ;
- objectif secret.

Vers Noa :

- recette oubliee ;
- avertissement sur potion interdite ;
- carte alchimique partielle.

Vers Sora :

- nom de rune legendaire ;
- alphabet runique ;
- condition theorique pour stabiliser une rune.

---

## 3. Noa — Atelier Distordu

### Canon compagnon

Noa est la candidate naturelle : les donnees actuelles la decrivent comme
`Alchimiste malicieuse` / `Alchimiste curieuse`, liee au laboratoire, aux fioles
et aux cristaux.

### Pitch

Noa travaille dans un ancien laboratoire tordu par des experiences magiques. Les
formules ont deforme l'espace : certaines potions sont cachees, interdites,
scellees ou impossibles a stabiliser sans ingredients speciaux.

Inspiration :

- Potion Craft pour la carte alchimique et la trajectoire d'ingredients ;
- experimentation cozy ;
- potions interdites en couche puzzle optionnelle.

### Boucle

```text
Choisir une recette ou experimenter
-> selectionner ingredients
-> tracer une trajectoire sur la carte alchimique
-> atteindre une zone d'effet
-> stabiliser la potion
-> obtenir potion, prototype ou formule secrete
```

### Carte alchimique

Pôles possibles :

- Chaleur
- Nature
- Mystique
- Repos
- Gastronomie
- Affinite
- Memoire
- Instabilite
- Lune
- Brume

Ingredients exemples :

| Ingredient | Direction |
|------------|-----------|
| Fleur de vapeur | Chaleur + Nature |
| Cristal de brume | Mystique |
| Miel dore | Affinite + Gastronomie |
| Poudre lunaire | Memoire + Mystique |
| Eau thermale | Repos + Chaleur |
| Spore etrange | Instabilite + Nature |

### Potions visibles

- Potion de joie : humeur Myrions.
- Elixir d'affinite : objet d'affinite.
- Tonique d'energie : reduit temps de run.
- Brume clarifiee : meilleur tirage de pieces Auberge.
- Infusion gourmande : nourriture.
- Onguent de repos : fatigue reduite.

### Potions secretes / interdites

- Philtre du Souvenir : debloque chronique oubliee.
- Potion de Chambre Miroir : augmente chance de pieces compatibles.
- Elixir du Client Fantome : attire un client special.
- Distillat de Brume Noire : revele une zone cachee du laboratoire.
- Catalyseur interdit : utile pour runes instables de Sora.

### Couche casual

Le joueur suit une recette indiquee :

```text
Potion de Joie
= fleur + miel + eau claire
```

Reussite genereuse, peu punitive.

### Couche puzzle

Le joueur teste des trajectoires :

- ordre exact des ingredients ;
- zones cachees ;
- effets doubles ;
- potions interdites ;
- lien avec chroniques parfaites ;
- stabilisation par rune de Sora.

### Entrees depuis les autres mini-jeux

Depuis Auberge :

- herbes, eaux, epices, cristaux, spores ;
- pieces speciales productrices d'ingredients.

Depuis Bibliotheque :

- recettes oubliees ;
- cartes partielles ;
- avertissements sur instabilite.

Depuis Sora :

- rune de stabilisation ;
- rune de distillation ;
- rune de catalyse ;
- rune de scellement ;
- rune de transmutation.

### Sorties vers les autres mini-jeux

Vers Auberge :

- potion de confort ;
- potion de tirage favorable ;
- client special ;
- revelateur de contraintes.

Vers Bibliotheque :

- encre magique ;
- revelateur de pages ;
- potion de memoire.

Vers Sora :

- encre alchimique ;
- poudre de cristal ;
- solvant doux ;
- catalyseur interdit ;
- metal lunaire.

---

## 4. Sora — Plateau des Elements / Recherche runique

### Direction

Sora n'est pas seulement une mage de combat : la vision retenue est celle d'une
chercheuse / graveuse de runes. Elle decouvre des theories, grave des motifs,
teste les flux sur un plateau, stabilise les runes, puis les rend utilisables
dans la vie quotidienne et les autres mini-jeux.

Le canon exact de Sora devra etre aligne avec les fiches compagnons si elles
evoluent, mais la direction de gameplay est :

```text
Sora = recherche runique, gravure, stabilisation, applications magiques.
```

### Pitch

Sora observe les besoins du Havre, lit les theories de la Bibliotheque et utilise
les catalyseurs de Noa pour creer des runes. Le Plateau des Elements sert de banc
d'essai : le joueur y assemble, fusionne et stabilise des glyphes.

### Boucle

```text
Obtenir un indice runique
-> choisir une rune a rechercher
-> graver un prototype
-> tester sur le Plateau des Elements
-> fusionner / orienter les flux
-> stabiliser la rune
-> debloquer une version utilisable
-> appliquer la rune ailleurs
```

### Sources de deblocage

Une nouvelle rune peut demander :

1. theorie connue via Bibliotheque ;
2. materiau disponible via Noa ;
3. usage observe via Auberge ;
4. test reussi sur le plateau de Sora.

Cela justifie pourquoi Sora ne pouvait pas la creer avant :

```text
La rune existait en theorie, mais Sora n'avait pas encore la connaissance,
le catalyseur ou l'usage concret pour la stabiliser.
```

### Etats d'une rune

| Etat | Sens |
|------|------|
| Inconnue | pas visible |
| Mentionnee | nom vu dans un livre |
| Theorisee | recette partielle connue |
| Prototype | testable, instable |
| Stable | utilisable |
| Maitrisee | bonus renforce |
| Gravee | appliquee a une piece / potion / livre |
| Mythique retrouvee | version rare complete |

### Tiers et statuts

Ne pas faire de T4 un plafond. Separer tier technique et statut mythique.

Tiers :

- T1 : rune simple.
- T2 : rune composee.
- T3 : rune avancee.
- T4 : rune majeure.
- T5 : rune ancienne.
- T6 : rune primordiale.
- T7+ : extension future possible.

Statuts independants :

- commune ;
- rare ;
- epique ;
- legendaire ;
- interdite ;
- event ;
- corrompue ;
- benie ;
- instable ;
- prototype.

Exemples :

```text
Rune d'eau chaude T2 — commune
Rune du Bain des Fleurs T4 — legendaire
Rune de Porte sans Mur T3 — interdite
Rune Prinny explosive T2 — event Disagrea
Rune Originelle de Brume T6 — primordiale
```

### Toute fusion doit donner quelque chose

Regle obligatoire pour eviter la frustration :

```text
Aucune fusion n'est vide.
```

Resolution par priorite :

1. recette exacte connue ;
2. recette secrete cachee ;
3. tags compatibles -> prototype ;
4. tags opposes -> rune fissuree / instabilite ;
5. sinon -> eclat runique / XP de recherche.

Types de resultats :

- Fusion exacte : nouvelle rune stable.
- Fusion compatible : prototype utile.
- Fusion faible : poussiere / eclat runique / XP.
- Fusion instable : ressource pour Noa ou potions interdites.
- Fusion parfaite : rune rare / secret / lore.

### Sets garantis

Chaque run du plateau doit proposer un set ou au moins une fusion existe.

Exemple :

```text
Set du jour : Eau, Chaleur, Fleur, Repos, Memoire
```

Garanties :

- au moins 1 fusion simple ;
- au moins 1 chemin vers T3 ;
- parfois 1 secret cache ;
- recompense meme si le joueur rate le chemin optimal.

### Exemples de fusions

Famille Eau chaude :

```text
T1 — Rune d'eau tiede
T2 — Rune d'eau chaude
T3 — Rune de vapeur stable
T4 — Rune de source thermale
T5 — Rune de source eternelle
T6 — Rune de source primordiale
```

Fusion secrete :

```text
Eau + Fleur + Chaleur + Memoire
= Rune du Bain des Fleurs
```

Fusion event Slime :

```text
Eau + Chaleur + Gelee
= Rune de gelee thermale
```

Fusion event Disagrea :

```text
Demoniaque + Cuisine + Fete
= Rune de banquet infernal
```

### Elements

Elements initiaux possibles :

- Eau
- Feu
- Terre
- Vent
- Nature
- Lumiere
- Ombre
- Cristal

Elements avances :

- Brume
- Lune
- Memoire
- Fleur
- Metal
- Son
- Reve
- Temps

Elements event :

- Demoniaque
- Slime / Gelee
- Neige
- Soleil d'ete
- Bonbon
- Fantome
- Etoile
- Dragon

### Runes utiles aux autres mini-jeux

Vers Auberge :

- Rune d'eau chaude : bonus pieces Chaleur.
- Rune de flamme douce : cuisine produit plus.
- Rune de confort : chambres et repos.
- Rune de silence : pieces Repos.
- Rune de parfum : bains / jardins.
- Rune de passage : aide aux connexions de pieces.

Vers Bibliotheque :

- Rune de memoire : revele fragment manquant.
- Rune d'encre claire : montre indice cache.
- Rune de traduction : debloque chronique ancienne.
- Rune de miroir : revele fin alternative.
- Rune de silence : stabilise histoire confuse.

Vers Noa :

- Rune de stabilisation : reduit risque potion interdite.
- Rune de distillation : augmente rendement.
- Rune de catalyse : revele trajectoire cachee.
- Rune de scellement : permet potion dangereuse.
- Rune de transmutation : change famille d'ingredient.

Vie quotidienne :

- eau chaude ;
- lumiere douce ;
- conservation aliments ;
- croissance plantes ;
- sechage linge ;
- chauffage de chambre ;
- anti-brume ;
- anti-grincement ;
- berceuse pour Myrions.

---

## Framework events commun

Chaque event peut ajouter des contenus dans les quatre mini-jeux sans casser la
base.

Pack event recommande :

- 6 a 10 pieces Auberge ;
- 1 a 3 chroniques Bibliotheque ;
- 3 a 6 ingredients / potions Noa ;
- 3 a 8 runes Sora ;
- 1 ressource event ;
- 2 a 5 secrets caches ;
- 1 client / personnage / visiteur special ;
- quelques decors et objets d'affinite.

### Exemple Disagrea

Auberge :

- Bain demoniaque.
- Cuisine infernale.
- Dortoir Prinny.
- Salle du trone miniature.

Bibliotheque :

- Chronique du Netherworld.
- Conte du vassal explosif.
- Fragment sur une rune de chaos controle.

Noa :

- Potion de malice douce.
- Catalyseur infernal stabilise.
- Gelee de Prinny instable.

Sora :

- Rune Prinny explosive.
- Rune de banquet infernal.
- Rune de trone miniature.
- Rune de chaos controle.

### Exemple Slime

Auberge :

- Bassin gelatineux.
- Cuisine de gelee.
- Nursery Slime.
- Salon rebondissant.

Bibliotheque :

- Conte du slime perdu.
- Chronique de la gelee thermale.

Noa :

- Gel stabilise.
- Potion d'absorption douce.
- Catalyseur rebondissant.

Sora :

- Rune de gelee thermale.
- Rune rebondissante.
- Rune d'absorption molle.
- Rune de multiplication douce.

---

## MVPs separes proposes

Ne pas implementer les quatre systemes d'un coup. Si le sujet est repris, choisir
un MVP isole.

### MVP Auberge

- Grille 4x4 ou 5x5.
- 24 a 30 pieces.
- 6 categories visibles.
- 8 secrets caches maximum.
- 1 run = 1 nouvelle case / piece.
- 3 choix garantis avec au moins 1 choix utile.
- Bonus visible a partir de 3 pieces connectees.

### MVP Bibliotheque

- 6 chroniques courtes.
- 5 fragments par chronique.
- 3 chapitres par run.
- 3 choix par chapitre.
- 3 fins : confuse, correcte, parfaite.
- 1 lien bonus vers Auberge / Noa / Sora par chronique.

### MVP Noa

- Carte alchimique simple.
- 12 ingredients.
- 8 potions visibles.
- 4 potions secretes.
- Resultats non punitifs : potion faible / prototype / instabilite utile.
- 1 interaction avec Sora : rune de stabilisation.

### MVP Sora

- 8 elements de base.
- 20 a 30 runes T1/T2/T3.
- Sets de runes garantis.
- Toute fusion donne quelque chose.
- 5 runes utiles aux autres mini-jeux.
- 3 secrets / runes rares.

---

## Notes implementation future

- Tout doit etre data-driven : pieces, fragments, recettes, runes, secrets.
- Ne pas coder les secrets en dur dans les composants React.
- Prevoir des IDs stables et migrations si des donnees sont sauvegardees.
- Garder les objectifs casual visibles.
- Les couches puzzle doivent etre optionnelles.
- Les assets de pieces peuvent etre generes une fois et tournes en runtime si les
  ouvertures / portes sont bien standardisees.
- Commencer facile et genereux ; augmenter la profondeur par contenu, pas par
  punition.

---

## Resume court

Les quatre mini-jeux forment un ecosysteme :

- Nami restaure l'auberge en draftant des pieces et chaines d'ambiance.
- La Bibliotheque transforme les fragments en chroniques vivantes jouables.
- Noa transforme ingredients et savoir en potions, y compris interdites.
- Sora transforme usages, theories et catalyseurs en runes stables.

Chaque systeme doit etre satisfaisant seul, mais encore meilleur quand il renvoie
des indices et ressources aux autres.
