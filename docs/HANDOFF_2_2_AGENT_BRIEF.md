# Passage de connaissance — agent développement 2.2

**Produit :** Havre des Brumes (repo IDLE Isekai Chill)  
**Date :** 2026-06-30  
**Release précédente :** 2.1.0.0 — tag `v2.1.0.0`  
**`main` actuel :** `b91b6fb` — nettoyage 2.2 + `old_v2.1/` hors Git public

---

## Contexte livré en 2.1

- Ferme lunaire : 15 biomes, 45 filons, supervision, prestige
- 19 compagnons, 190 conversations de lien (corpus 7500 entrées validées)
- Guidance gameplay, hub clarifié, terminologie (Promenade Myrions, Ferme lunaire)
- Validations release OK : `validate:companion-bonds`, `validate:link-corpus`, `tnr:baseline`, `build`
- Lint global KO (~33 issues) — **non bloquant**, pas de fix lint massif sans demande

## État repo phase 2.2 (kickoff fait 2026-06-30)

| Élément | État |
|---------|------|
| `main` / `origin/main` | `b91b6fb` — release 2.1 livrée |
| Branche travail | `feature/2.2` — **ouverte** |
| Semver npm | **`2.2.0`** |
| Label UI | **`v2.2.0.02`** (X=2, Y=0) |
| Kickoff | **Fait** — voir [`agent-guide/07-kickoff-nouvelle-version.md`](./agent-guide/07-kickoff-nouvelle-version.md) |
| `old_v2.1/` | Archive **locale gitignorée** — hors `origin`, ne pas committer |
| `deploy/` | Stack PROD **locale** — gitignorée, PC hôte uniquement |
| `docs/` racine | 8 fichiers actifs — voir `DOC_AGENT_INDEX.md` |
| `staging/` | Uniquement `playbooks/` (01–04, 06, 08–11) |

Docs release 2.1 / worksite / scripts legacy : sur disque dans `old_v2.1/` (local), **pas sur GitHub**.

## Objectif phase 2.2

1. ~~Ouvrir branche **`feature/2.2`**~~ — fait
2. ~~Bump semver **`2.2.0`** + reset compteur UI~~ — fait
3. **Retouches libres** : nettoyage, petites corrections, wording — diffs reviewables
4. Guillaume peut toucher à **n'importe quelle zone** — pas de feature majeure imposée
5. Merge `feature/2.2` → `main` **uniquement** avec go explicite Guillaume

## Politique versionnement (critique)

Format UI : **`v{semver}.{X}`** ou **`v{semver}.{X}.{Y}`**

| Segment | Règle |
|---------|-------|
| `semver` | `package.json` — **`2.2.0`** au kickoff |
| **X** | +1 à chaque **nouveau prompt** user → `npm run version:prompt` (reset Y=0) |
| **Y** | +1 à chaque **tâche distincte** dans le prompt → `npm run version:task` |

**Commits :** viser **1 commit par X** (fin de prompt) décrivant le **but** ; commits par Y acceptés si lots isolés.

**Log obligatoire :** [`docs/traceability/changelog/DEV_LOG_2_2.md`](./traceability/changelog/DEV_LOG_2_2.md)

**Reset UI au kickoff :**

```json
// build-revision.json
{ "revision": 1, "subRevision": 0 }
```

Puis `npm run version:prompt` au premier vrai prompt de travail → affichage `v2.2.0.2` (semver 2.2.0 + X=2 si reset à 1 puis prompt).

Tag release future 2.2 : **`v2.2.0.0`** (convention tag git).

## Règles dures (ne pas violer)

- **Aucune suppression définitive** — archiver dans `old_assets/` ou `old_v2.1/` (local)
- **`old_v2.1/`** : gitignorée — ne pas committer, ne pas pousser, ne pas modifier sans demande
- **Ne pas modifier les assets** (PNG, etc.) sans demande explicite
- **Ne pas changer** le format de sauvegarde sans migration
- **Ne pas push `main`** ni merger sans go Guillaume
- **Ne pas** corriger le lint global en masse
- **Ne pas** mélanger feature, refactor large et bugfix dans le même commit sans accord
- Lire avant d'écrire : `AGENTS.md`, `docs/DOC_AGENT_INDEX.md`, `.ai/project-context.md`

## Pipeline validation (avant « terminé »)

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
```

Smoke minimal si UI touchée : Village, hub mini-jeux, Ferme lunaire, Promenade Myrions, Liens, Inventaire — pas d'erreur console bloquante.

## Fichiers à lire en premier

| Priorité | Fichier |
|----------|---------|
| 1 | `AGENTS.md` |
| 2 | `docs/DOC_AGENT_INDEX.md` |
| 3 | `.ai/project-context.md` |
| 4 | `.ai/current-state.md` |
| 5 | `docs/traceability/project-state.md` |
| 6 | `docs/agent-guide/07-kickoff-nouvelle-version.md` |
| 7 | `docs/traceability/changelog/DEV_LOG_2_2.md` |

## Réserves connues (backlog libre 2.2)

- ESLint ~33 issues
- `worksiteDevUnlock` (dev only)
- Silhouette `public/assets/minigames/myrion-worksite/spots/ruines-lierre-ancien.png`
- Chunk size warning Vite (> 500 kB)
- **Wording onboarding tutorial** — incohérence « Chantier du havre » / « Chantier du village » / « Refuge des brumes » vs libellés hub (non fait en 2.1 ; voir `project-state.md`)
- Flags `DEV_*` gacha / mini-jeux

## Workflow session type

1. `git checkout feature/2.2` (ou créer depuis `main` si nouvelle phase)
2. **Si kickoff non fait** → proposer checklist [`07-kickoff-nouvelle-version.md`](./agent-guide/07-kickoff-nouvelle-version.md) **dès le premier message**
3. **Début prompt :** `npm run version:prompt`
4. Travailler tâche par tâche → `npm run version:task` + ligne DEV_LOG
5. **Fin tâche :** commit ciblé sur `feature/2.2` (si demandé)
6. **Fin prompt :** commit récap X si besoin, mettre à jour DEV_LOG + `.ai/current-state.md`
7. Validations avant de dire « terminé »

---

# Prompt à copier-coller (nouvel agent / nouvelle session)

```
Tu es l'agent de développement pour IDLE Isekai Chill — produit affiché « Havre des Brumes ».

## Mission
Développer la phase 2.2 sur la branche `feature/2.2`. Objectif : retouches libres, nettoyage, petites corrections transverses. Je (Guillaume) peux demander des touches sur n'importe quelle zone. Pas de feature majeure imposée. Merge vers `main` uniquement avec mon accord explicite.

## Kickoff — comportement agent (OBLIGATOIRE)
Si le kickoff n'est pas fait (semver encore 2.1.0, UI sur v2.1.x, branche absente), **propose immédiatement** d'initialiser la phase en suivant `docs/agent-guide/07-kickoff-nouvelle-version.md` — avant toute autre tâche. Exécute dès que je confirme.

## État de départ (post-kickoff 2026-06-30)
- `main` @ `b91b6fb` — release 2.1 livrée, tag `v2.1.0.0`
- `feature/2.2` — semver `2.2.0`, label UI `v2.2.0.{X}`
- Release 2.1 : Ferme lunaire 15 biomes / 45 filons, 19 compagnons, 190 liens, corpus 7500
- `build` OK · lint global ~33 issues (non bloquant)

## Repo allégé (ne pas chercher ailleurs)
- `docs/` racine : 8 fichiers — lire `docs/DOC_AGENT_INDEX.md` avant d'explorer
- `staging/` : uniquement `playbooks/` (procédures opérationnelles)
- `docs/traceability/` : changelog, project-state, audits actifs
- Scripts actifs : import, validate, bump version — voir `package.json`

## Archives locales (hors Git public — NE PAS committer)
- `old_v2.1/` : quarantaine post-2.1 (docs release, scripts legacy, staging WIP) — **gitignorée**
- `deploy/` : stack PROD locale — **gitignorée**
- Règle : ne pas modifier `old_v2.1/` sans ma demande explicite

## Versionnement UI — OBLIGATOIRE
Format affiché : `v{semver}.{X}` ou `v{semver}.{X}.{Y}`
- semver : `package.json` (2.2.0 au kickoff)
- X : +1 par NOUVEAU PROMPT → `npm run version:prompt` (début de session)
- Y : +1 par TÂCHE DISTINCTE dans le prompt → `npm run version:task`

Kickoff (si pas encore fait — voir `docs/agent-guide/07-kickoff-nouvelle-version.md`) :
1. Créer `feature/2.2` depuis `main`
2. Bump `package.json` → `2.2.0`
3. Reset `build-revision.json` → `{ "revision": 1, "subRevision": 0 }`
4. `npm run version:prompt` au premier prompt de travail

Commits : 1 commit par X (fin de prompt) avec message décrivant le BUT ; commits intermédiaires par Y si lots reviewables.

Tenir à jour `docs/traceability/changelog/DEV_LOG_2_2.md` : une section par X, tableau des Y (résumé + hash commit).

## Règles dures
- Aucune suppression définitive (archiver dans `old_assets/` ou `old_v2.1/` local)
- Ne pas committer ni pousser `old_v2.1/` ou `deploy/`
- Ne pas modifier assets (PNG, etc.) sans demande explicite
- Pas de migration save sans chemin de migration
- Pas de push `main` / merge sans mon go
- Pas de fix lint global massif
- Diffs petits et reviewables
- Lire `AGENTS.md` et `docs/DOC_AGENT_INDEX.md` avant toute modif

## Validation avant « terminé »
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
(+ smoke UI si écrans touchés : Village, hub, Ferme lunaire, Promenade, Liens, Inventaire)

## Comportement attendu
- Réponds en français
- Commence chaque session par : branche courante, X/Y UI, `git status --short`
- **Kickoff non fait ?** Propose l'initialisation immédiatement (guide 07)
- Nouvelle session user → `npm run version:prompt` en premier (après kickoff)
- Ne pas recréer la release 2.1 ni relancer le nettoyage déjà fait sur `main`
- Ne pas suivre les docs dans `old_v2.1/` comme source active

## Premier message attendu de ma part (exemple)
« [tâche concrète] » — ou « fait le kickoff » si phase pas encore ouverte
```

---

## Ce que l'agent 2.2 ne doit PAS refaire

- Nettoyage résidus post-2.1 (déjà sur `main` @ `b91b6fb`)
- Retirer `old_v2.1/` du git public (déjà fait)
- Retirer la stack PROD du git public (déjà fait)
- Recréer la release 2.1 ou le tag `v2.1.0.0`

Prochaine étape : **travail libre 2.2** sur `feature/2.2` — retouches sur demande Guillaume.
