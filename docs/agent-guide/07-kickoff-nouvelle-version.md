# 07 — Kickoff d'une nouvelle version (phase MINOR)

Updated: 2026-06-30

Procédure **obligatoire** au démarrage d'une nouvelle phase produit (ex. `2.1.0` → `2.2.0`), avant toute retouche fonctionnelle.

---

## Quand proposer le kickoff (comportement agent)

Dès la **première réponse** à un brief handoff ou à une demande d'ouvrir une nouvelle phase, l'agent doit :

1. Lire `AGENTS.md`, `docs/DOC_AGENT_INDEX.md`, `.ai/current-state.md`
2. Vérifier les signaux ci-dessous
3. **Proposer explicitement le kickoff** si au moins un signal est vrai — *avant* d'attendre une tâche concrète ou de coder

### Signaux « kickoff non fait »

| Signal | Exemple |
|--------|---------|
| Branche feature absente | `feature/2.2` non créée |
| Semver npm pas bumpé | `package.json` encore `2.1.0` sur branche `feature/2.2` |
| Révision UI sur ancien semver | Label `v2.1.0.128` alors que cible `2.2.0` |
| `build-revision.json` non reset | `revision` très élevé (ex. 128) après une release |
| Brief dit « kickoff prévu » | `.ai/next-task.md`, `HANDOFF_*_AGENT_BRIEF.md` |
| Pas de `DEV_LOG_{phase}.md` actif | Journal phase précédente seulement |

### Formulation type (premier message agent)

> Branche : `…` · UI : `v…` · kickoff **non fait** / **fait**.
>
> Je propose d'initialiser la phase **2.2** maintenant :
> 1. `feature/2.2` depuis `main`
> 2. Bump `package.json` → `2.2.0`
> 3. Reset `build-revision.json` → `{ revision: 1, subRevision: 0 }`
> 4. `npm run version:prompt` au premier prompt de travail
> 5. Créer / mettre à jour `DEV_LOG_2_2.md`
>
> Confirmez ou donnez la première tâche en même temps.

Si l'utilisateur confirme (ex. « fait le kickoff », « parfait fait ça »), **exécuter immédiatement** sans redemander.

---

## Checklist kickoff (générique)

Remplacer `{N}` par la phase cible (`2.2`, `2.3`, …).

| # | Action | Détail |
|---|--------|--------|
| 1 | Sync `main` | `git checkout main && git pull` |
| 2 | Branche travail | `git checkout -b feature/{N}` (ou checkout si existe) |
| 3 | Bump semver | `package.json` → `{N}.0.0` (convention MINOR phase) |
| 4 | Reset UI | `build-revision.json` → `{ "revision": 1, "subRevision": 0 }` |
| 5 | Journal phase | Créer `docs/traceability/changelog/DEV_LOG_{N_with_underscore}.md` (ex. `DEV_LOG_2_2.md`) |
| 6 | Stubs agent | Mettre à jour `.ai/current-state.md`, `.ai/next-task.md`, `.ai/project-context.md` |
| 7 | Brief handoff | Mettre à jour ou archiver `docs/HANDOFF_*_AGENT_BRIEF.md` |
| 8 | Premier prompt travail | `npm run version:prompt` → label `v{N}.0.02` (reset à 1 puis prompt) |
| 9 | Validation | `npm run build` minimum |
| 10 | Commit kickoff | 1 commit `chore({N}): kickoff feature/{N}` — **si l'utilisateur le demande** |

**Tag release future :** `v{N}.0.0` (convention git, distinct du label UI `v{N}.0.{X}`).

---

## Après le kickoff

- Chaque **nouveau prompt user** → `npm run version:prompt` (X+1, Y→0)
- Chaque **tâche distincte** dans le prompt → `npm run version:task` (Y+1)
- Log obligatoire : `DEV_LOG_{phase}.md` — une section par X, tableau des Y
- Merge `feature/{N}` → `main` **uniquement** avec go explicite Guillaume

---

## Ce qu'un kickoff n'est pas

- Pas une feature gameplay
- Pas une migration save (sauf demande explicite + chemin migration)
- Pas un nettoyage massif du repo (déjà fait sur `main` en amont)
- Pas un fix lint global

---

## Références

- [`05-politique-versionnement.md`](./05-politique-versionnement.md) — format `v{semver}.{X}.{Y}`
- [`02-guide-agent-general.md`](./02-guide-agent-general.md) — workflow session
- [`../HANDOFF_2_2_AGENT_BRIEF.md`](../HANDOFF_2_2_AGENT_BRIEF.md) — exemple phase 2.2
