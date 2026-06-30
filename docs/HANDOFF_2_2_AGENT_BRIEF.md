# Passage de connaissance — agent développement 2.2

**Produit :** Havre des Brumes (repo IDLE Isekai Chill)  
**Date :** 2026-06-30  
**Release précédente :** 2.1.0.0 — tag `v2.1.0.0`, `main` @ `8e50e13`  
**PR mergée :** [#3](https://github.com/Guillaume-Jolly/IDLE-Isekai-Chill/pull/3)

---

## Contexte livré en 2.1

- Ferme lunaire : 15 biomes, 45 filons, supervision, prestige
- 19 compagnons, 190 conversations de lien (corpus 7500 entrées validées)
- Guidance gameplay, hub clarifié, terminologie (ex. Promenade Myrions, Ferme lunaire)
- Quarantaine **non destructive** : `old_v2.1/` (454 fichiers) — **ne jamais supprimer ni vider**
- Validations release OK : `validate:companion-bonds`, `validate:link-corpus`, `tnr:baseline`, `build`
- Lint global KO (~33 issues) — **non bloquant**, ne pas lancer de fix lint massif sans demande

## Objectif phase 2.2

1. Ouvrir branche `feature/2.2` depuis `main` (tag `v2.1.0.0`)
2. **Nettoyage global** + **petites corrections mineures** sur tout le repo (code, docs, wording)
3. Guillaume peut toucher à **n'importe quelle zone** — rester reviewable (petits commits)
4. **Pas** de feature majeure imposée, **pas** de nettoyage destructif intermédiaire obligatoire
5. Merge `feature/2.2` → `main` plus tard (go explicite Guillaume)

## Politique versionnement (critique)

Format UI : **`v{semver}.{X}`** ou **`v{semver}.{X}.{Y}`**

| Segment | Règle |
|---------|-------|
| `semver` | `package.json` — passer à **`2.2.0`** au kickoff 2.2 |
| **X** | +1 à chaque **nouveau prompt** user → `npm run version:prompt` (reset Y=0) |
| **Y** | +1 à chaque **tâche distincte** dans le prompt → `npm run version:task` |

**Commits :** viser **1 commit par X** (fin de prompt) décrivant le **but** ; commits par Y acceptés si lots isolés.

**Log obligatoire :** [`docs/traceability/changelog/DEV_LOG_2_2.md`](./traceability/changelog/DEV_LOG_2_2.md) — tableau résumé X/Y + hash commit.

**Harmonisation UI ↔ Git :** en fin 2.1 le label affiché était `v2.1.0.128` alors que git est à un autre compteur. Au kickoff 2.2 :

```json
// build-revision.json après reset
{ "revision": 1, "subRevision": 0 }
```

Puis `npm run version:prompt` au premier vrai prompt de travail.

Tag release future 2.2 : convention **`v2.2.0.0`** (tag git ≠ semver patch quadruple).

## Règles dures (ne pas violer)

- **Aucune suppression définitive** — archiver dans `old_assets/` ou `old_v2.1/`
- **Ne pas toucher** `old_v2.1/` sauf demande explicite
- **Ne pas modifier les assets** (PNG, etc.) sans demande explicite
- **Ne pas changer** le format de sauvegarde sans migration
- **Ne pas push** `main` ni merger sans go Guillaume
- **Ne pas** corriger le lint global en masse
- **Ne pas** mélanger feature, refactor large et bugfix dans le même commit sans accord
- Lire avant d'écrire : `AGENTS.md`, `.ai/project-context.md`, `docs/traceability/project-state.md`

## Pipeline validation (avant « terminé »)

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
```

Smoke minimal si UI touchée : Village, hub mini-jeux, Ferme lunaire, Promenade Myrions, Liens, Inventaire, pas d'erreur console bloquante.

## Fichiers à lire en premier

| Priorité | Fichier |
|----------|---------|
| 1 | `AGENTS.md` |
| 2 | `.ai/project-context.md` |
| 3 | `.ai/current-state.md` |
| 4 | `docs/traceability/project-state.md` |
| 5 | `docs/agent-guide/05-politique-versionnement.md` |
| 6 | `docs/traceability/changelog/DEV_LOG_2_2.md` |

## Réserves connues (backlog libre 2.2)

- ESLint ~33 issues
- `worksiteDevUnlock` (dev only)
- Silhouette `public/assets/minigames/myrion-worksite/spots/ruines-lierre-ancien.png`
- Chunk size warning Vite
- Wording quête « Chantier du havre »
- Flags `DEV_*` gacha / mini-jeux

## Workflow session type

1. `git checkout main && git pull`
2. `git checkout -b feature/2.2` (si première fois)
3. Bump `package.json` → `2.2.0` + reset `build-revision.json` (go user)
4. **Début prompt :** `npm run version:prompt`
5. Travailler tâche par tâche → `npm run version:task` + ligne DEV_LOG
6. **Fin tâche :** commit ciblé
7. **Fin prompt :** commit récap X si besoin, mettre à jour DEV_LOG + `.ai/current-state.md`
8. Validations avant de dire « terminé »

---

# Prompt à copier-coller (ChatGPT / autre agent)

```
Tu es l'agent de développement pour IDLE Isekai Chill — produit affiché « Havre des Brumes ».

## Mission
Préparer et développer la phase 2.2 sur la branche `feature/2.2` (à créer depuis `main` tagué v2.1.0.0). Objectif : nettoyage global, petites corrections mineures partout. Je (Guillaume) peux demander des touches sur n'importe quelle zone. Pas de feature majeure imposée. La branche mergera plus tard sur main avec mon accord explicite.

## État de départ (2026-06-30)
- main @ 8e50e13, tag v2.1.0.0, package.json 2.1.0
- Release 2.1 livrée : Ferme lunaire 15 biomes / 45 filons, 19 compagnons, 190 liens, corpus 7500
- old_v2.1/ = archive quarantaine (454 fichiers) — INTERDIT de supprimer ou modifier sans demande
- build OK, lint global KO (~33) non bloquant

## Versionnement UI — OBLIGATOIRE
Format affiché : v{semver}.{X} ou v{semver}.{X}.{Y}
- semver : package.json (passer à 2.2.0 au kickoff)
- X : +1 par NOUVEAU PROMPT → npm run version:prompt (début de session)
- Y : +1 par TÂCHE DISTINCTE dans le prompt → npm run version:task

Au kickoff 2.2 : harmoniser le compteur UI (fin 2.1 = v2.1.0.128 désynchronisé de git). Reset build-revision.json à revision:1, subRevision:0 puis version:prompt au premier prompt de travail.

Commits : 1 commit par X (fin de prompt) avec message décrivant le BUT ; commits intermédiaires par Y si lots reviewables.

Tenir à jour docs/traceability/changelog/DEV_LOG_2_2.md : une section par X, tableau des Y avec résumé + hash commit.

## Règles dures
- Aucune suppression définitive (archiver seulement)
- Ne pas toucher old_v2.1/
- Ne pas modifier assets sans demande explicite
- Pas de migration save sans chemin de migration
- Pas de push main / merge sans mon go
- Pas de fix lint global massif
- Diffs petits et reviewables
- Lire AGENTS.md et docs/HANDOFF_2_2_AGENT_BRIEF.md avant toute modif

## Validation avant « terminé »
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
(+ smoke UI si écrans touchés)

## Premier prompt attendu de ma part
« Ouvre feature/2.2, bump 2.2.0, reset revision UI, et [tâche concrète] »

Réponds en français. Commence chaque session par confirmer branche, X/Y courants, et git status.
```

---

## Après ce brief

L'agent suivant ne doit **pas** recréer la release 2.1 ni relancer la quarantaine `old_v2.1/`.  
Prochaine phase documentée : retouches libres groupées, sans nettoyage intermédiaire obligatoire.
