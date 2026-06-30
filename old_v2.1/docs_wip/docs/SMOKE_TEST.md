# Smoke test — Havre des Brumes (IDLE Isekai Chill)

> Checklist minimale pour valider que l'app démarre et que les écrans critiques existent.

## Prérequis

- Node.js + npm
- Dépendances installées (`npm install`)
- Branche `main` à jour (`bc4c118` ou plus récent)
- Un seul serveur dev actif (port **5173**)

## Commandes

```bash
npm run build    # attendu : exit 0
npm run lint     # attendu : exit 0, warnings only
npm run dev      # http://localhost:5173/
```

## Parcours de test

| # | Zone | Action | Résultat attendu |
|---|------|--------|------------------|
| 1 | Shell | Ouvrir `/` | Navigation 8 onglets, pas de crash console |
| 2 | Village | Onglet Village | Panorama scrollable, pancartes bâtiments |
| 3 | Hub | Onglet Mini-jeux | Cartes mini-jeux + Refuge Myrions visible |
| 4 | Inventaire | Onglet Inventaire | Sections ressources / outils / familiers |
| 5 | Compagnons | Onglet Liens | 15 compagnons, stats, actions |
| 6 | Save | Reload F5 | Ressources et progression conservées |
| 7 | Dev | Refuge / Chasse (dev) | Accessible via `DEV_UNLOCK_ALL_MINIGAMES` en dev uniquement |

## Dernière exécution

| | |
|---|---|
| **Date** | 2026-06-22 (session post-merge) |
| **Niveau** | Visuel (navigateur) + build + lint |
| **Build** | OK |
| **Lint** | OK (9 warnings) |
| **Village** | OK — Campement, panorama |
| **Hub** | OK — 13 cartes, Refuge Myrions présent |
| **Inventaire / Liens** | OK (sessions précédentes + spot check) |
| **Refuge / Chasse prod** | Verrouillés par stade village sans flag dev — comportement attendu |

## Problèmes connus

- Refuge / Chasse nécessitent stade Village (2) en progression normale.
- Reproduction (Nid d'Écho) : TNR longue durée non bouclé.
- Chunk JS > 5 MB (warning build Vite).

## Non couvert par ce smoke test

- Parcours complet capture → relâchement → objectifs
- Production build preview (`npm run preview`)
- Tests automatisés (aucun script `test` dans package.json)
