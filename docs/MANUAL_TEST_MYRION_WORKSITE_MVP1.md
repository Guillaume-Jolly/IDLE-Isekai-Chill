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

---

## Validation pré-push (2026-06-26)

### Git / isolation

| Vérification | Résultat |
|--------------|----------|
| Branche | `feature/myrion-worksite-mvp1` |
| Commits vs `main` | **5 commits**, **10 fichiers** — périmètre Worksite uniquement |
| `buildingActivities.ts` | ✅ Type `myrion-worksite` + entrée `farm-worksite` seulement |
| Working tree local | ⚠️ Nombreux changements **non commités** (story, assets, toasts…) — **hors push** |

### Build / lint

| Commande | Résultat |
|----------|----------|
| `npm run build` | ✅ OK |
| ESLint ciblé (fichiers Worksite) | ✅ OK |
| `npm run lint` global | ❌ Erreurs préexistantes hors périmètre |

### Runtime (agent)

| Test | Résultat |
|------|----------|
| Dev server | ✅ `http://localhost:5173/` · réseau `http://192.168.1.18:5173/` |
| Jeu charge (village) | ✅ |
| Hub mini-jeux + titre « Chantier Myrion » | ✅ (session précédente) |
| Parcours complet in-game (clic, assign, reload) | ☐ Non terminé par l’agent — **à valider manuellement** |
| Mobile réel | ☐ Non testé par l’agent |

### Correctif post-audit

- **Save auto batchée** : production calculée chaque seconde, persistance max toutes les 5 s (+ flush au unmount et actions utilisateur immédiates). Commit : `fix(minigames): stabilize myrion worksite mvp1`.

### Tests faits (automatisés)

1. Diff `main...HEAD` — 10 fichiers Worksite seulement  
2. Audit `buildingActivities.ts` — pas de compagnons/story  
3. Build production  
4. Lint ciblé Worksite  
5. Dev server accessible (local + réseau)

### Tests non faits (utilisateur)

1. Clic/tap sur les 3 spots avec vérif ressources village  
2. Assignation / retrait Myrion + production auto observée  
3. Reload F5 (assignations + totaux)  
4. Mobile ≤767px  
5. Régression chasse / refuge / inventaire  
6. Console sans erreur / sans « Maximum update depth exceeded »  
7. `npm run validate:link-corpus`

### Problèmes restants

- Gains fractionnels peu visibles dans la barre ressources.  
- Toasts récompense en mode `silent` pendant l’auto (volontaire MVP 1).  
- Working tree sale localement — ne pas confondre avec le contenu de la branche pushée.

### Décision push

**Recommandé** pour les commits Worksite (après ton smoke test manuel rapide).  
Commande proposée (non exécutée) :

```bash
git push -u origin feature/myrion-worksite-mvp1
```

**Ne pas push** les modifications locales non commitées (toasts, story, assets, etc.) — elles restent sur ta machine uniquement tant qu’elles ne sont pas commitées.
