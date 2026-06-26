# Tests manuels — Chantier Myrion MVP 1

Checklist de validation pour le mini-jeu **Chantier Myrion** (MVP 1).

## Prérequis

- `npm run dev` lancé
- Navigateur desktop + émulateur mobile (ou appareil réel)
- Optionnel : au moins un Myrion capturé (chasse) pour tester l’assignation

## Checklist

| # | Action | Attendu | OK |
|---|--------|---------|-----|
| 1 | Ouvrir le jeu | Village charge sans erreur | ☐ |
| 2 | Ouvrir mini-jeux | Hub mini-jeux visible | ☐ |
| 3 | Ouvrir **Chantier Myrion** | Écran charge (Ferme Lunaire / Sora) | ☐ |
| 4 | Vérifier chargement | Pas d’écran blanc, pas d’erreur console | ☐ |
| 5 | Menu gauche repliable | Drawer / rail latéral s’ouvre et se ferme | ☐ |
| 6 | Sélectionner **Bosquet** | Spot actif, ressource bois | ☐ |
| 7 | Cliquer / tap collecter | Gain bois faible, compteur mis à jour | ☐ |
| 8 | Sélectionner **Pierrier** | Spot pierre actif | ☐ |
| 9 | Cliquer / tap | Gain pierre faible | ☐ |
| 10 | Sélectionner **Champs** | Spot vivres actif | ☐ |
| 11 | Cliquer / tap | Gain vivres faible | ☐ |
| 12 | Assigner un Myrion au Bosquet | Myrion listé sur le spot, auto > 0 | ☐ |
| 13 | Attendre ~5 s | Production auto augmente (silencieuse) | ☐ |
| 14 | Retirer le Myrion | Auto retombe à 0 sur ce spot | ☐ |
| 15 | Reload page (F5) | Spot sélectionné et assignations conservés | ☐ |
| 16 | Totaux produits | `totalProducedBySpot` cohérent après reload | ☐ |
| 17 | Mobile (≤767px) | Drawer menu, pas de scroll horizontal | ☐ |
| 18 | Desktop (≥768px) | Rail latéral, scène visible | ☐ |
| 19 | Panneau détail production | Toggle « Détail production biome » fonctionne | ☐ |
| 20 | Drawer Production | Stats clic / auto / rareté affichées | ☐ |
| 21 | Drawer Aide | 3 conseils visibles | ☐ |
| 22 | Chasse aux Familiers | Toujours jouable, pas de régression | ☐ |
| 23 | Refuge des Myrions | Toujours jouable | ☐ |
| 24 | Inventaire | Lecture OK, pas modifié par le chantier | ☐ |
| 25 | Console | Pas d’erreur, pas de « Maximum update depth exceeded » | ☐ |
| 26 | Myrion assigné ailleurs | Un même Myrion ne peut pas être sur 2 spots chantier | ☐ |
| 27 | Ancienne save | Partie existante sans `myrionWorksite` : defaults OK | ☐ |

## Notes de test

- Les gains sont **volontairement très faibles** (équilibrage provisoire).
- Les messages toast ne s’affichent **pas** à chaque tick auto (`silent: true`) — vérifier les ressources dans la barre du village.
- Un Myrion assigné au chantier reste utilisable dans chasse/refuge pour ce MVP.

## Commandes

```bash
npm run build
npm run lint
npm run dev -- --host 0.0.0.0
```

## Bugs connus / limites MVP 1

- Scène placeholder (pas d’assets finaux).
- Un seul biome : Prairie du chantier.
- Pas de production offline longue.
- Pas d’actions manger / dormir / repos.
