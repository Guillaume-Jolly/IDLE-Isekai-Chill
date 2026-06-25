# Idle Isekai Chill Game

Prototype original de jeu idle cozy fantasy jouable sur telephone et PC.

Le projet est separe du repo `mtg_project` et ne contient aucun code, asset,
texte, personnage ou batiment copie depuis un jeu existant.

## Lancer le projet

```bash
npm install
npm run dev
```

Build de production:

```bash
npm run build
```

## Fonctionnalites deja incluses

- Interface responsive mobile/desktop.
- Sauvegarde locale via `localStorage`.
- Progression hors-ligne recoltee au lancement, plafonnee a 168 h.
- Ressources nombreuses: pieces, bois, pierre, vivres, soie, mana, renom,
  ingredients, cristaux, cadeaux, tickets, poussiere stellaire.
- Accueil "Village" avec carte panoramique interactive en CSS.
- Batiments originaux avec couts et productions progressives.
- Mini-jeux fixes sans energie bloquante.
- Evenement gacha sans microtransaction, avec tickets gagnes en jeu et pity
  toutes les 10 invocations.
- 15 compagnons originaux avec niveau, affinite et 5 paliers narratifs.
- Onglet developpement pour afficher tous les emplacements de visuels, meme
  sans deblocage en jeu.

## Ajouter des visuels externes

Portraits compagnons en **deux couches** (recommandé) :

```text
public/assets/companions/<companion-id>/cutout-<level>.png      # personnage détouré
public/assets/companions/<companion-id>/background-<level>.png  # décor seul
```

Fonds partagés (mini-jeux, variantes) : `public/assets/companions/backgrounds/<scene-id>.png`

Legacy (portrait composé en un seul fichier, toujours supporté) :

```text
public/assets/companions/<companion-id>/affinity-<level>.png
```

Briefs IA : `src/data/companionPortraitHints.ts` — doc détaillée : [`public/assets/companions/README.md`](public/assets/companions/README.md)

Export PNG plat optionnel : `node scripts/composite-companion-portrait.mjs lyra 3`

Mini-jeux Myrions (refuge, chasse) : voir [`assets/minigames/README.md`](assets/minigames/README.md).

```text
public/assets/minigames/dressage/...
public/assets/minigames/capture/...
```

Si un fichier n'existe pas encore, l'app affiche un placeholder colore avec le
nom du compagnon et le niveau.

## Contenu relationnel et mature

Les paliers 1 a 3 sont decrits comme scenes romantiques/suggestives non
explicites:

1. Premiere rencontre.
2. Flirt leger / premier rendez-vous.
3. Moment intime suggestif mais non explicite.

Les paliers 4 et 5 sont volontairement des placeholders "fade-to-black" dans
ce prototype. Si tu ajoutes tes propres assets plus tard, garde au minimum ces
contraintes:

- Tous les personnages concernes sont adultes.
- Consentement clair dans la fiction.
- Age gate avant affichage.
- Assets originaux, commandes legalement, ou sous licence compatible.
- Aucun asset copie depuis un jeu commercial ou un artiste sans autorisation.

## Backlog et idees

Idees d'amelioration ou de nouveaux modes de jeu notes pour plus tard (sans
priorite fixe) :

- **[Backlog](docs/BACKLOG.md)** — idées mini-jeux (Top War, refuge + compagnons, etc.)

Pour les taches deja priorisees cote projet, voir [`docs/TODO_PRIORITIZED.md`](docs/TODO_PRIORITIZED.md).

## Prochaines evolutions possibles

- Ajouter une vraie PWA installable (`manifest.webmanifest` + service worker).
- Extraire les donnees de jeu dans des fichiers JSON/TS separes.
- Ajouter de vrais mini-jeux interactifs.
- Ajouter un systeme de quetes quotidiennes sans FOMO.
- Ajouter des emplacements d'illustrations par compagnon et par palier.
