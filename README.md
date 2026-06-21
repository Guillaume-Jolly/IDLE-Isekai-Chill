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

La galerie developpement cherche automatiquement les fichiers dans:

```text
public/companions/<companion-id>/affinity-<level>.png
```

Exemple:

```text
public/companions/lyra/affinity-1.png
public/companions/lyra/affinity-2.png
public/companions/lyra/affinity-3.png
public/companions/lyra/affinity-4.png
public/companions/lyra/affinity-5.png
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

## Prochaines evolutions possibles

- Ajouter une vraie PWA installable (`manifest.webmanifest` + service worker).
- Extraire les donnees de jeu dans des fichiers JSON/TS separes.
- Ajouter de vrais mini-jeux interactifs.
- Ajouter un systeme de quetes quotidiennes sans FOMO.
- Ajouter des emplacements d'illustrations par compagnon et par palier.
