# Current state — post-release 2.1.0.0

**Updated:** 2026-06-30

## Release livrée

| Élément | État |
|---------|------|
| Branche prod | `main` @ `8e50e13` |
| Tag | `v2.1.0.0` poussé sur `origin` |
| Semver | `2.1.0` |
| PR #3 | Mergée — [lien](https://github.com/Guillaume-Jolly/IDLE-Isekai-Chill/pull/3) |
| Validations release | bonds, corpus, tnr:baseline, build — OK |
| Lint global | KO (~33) — documenté, non bloquant |

## Label UI vs Git

- Affichage fin 2.1 : `v2.1.0.128` (`build-revision.json` → `revision: 128`)
- Ce compteur **ne reflète pas** le nombre de commits git (dérive HMR / sessions dev)
- **Harmonisation** prévue au kickoff **2.2** : bump `package.json` → `2.2.0`, reset `revision` / `subRevision`, aligner politique X/Y

## Quarantaine 2.1

- `old_v2.1/` — 454 fichiers archivés, manifeste dans `docs/CLEANUP_2_1_MOVE_MANIFEST.md`
- Stub `.ai/` à la racine ; contexte complet dans `old_v2.1/ai_work/.ai/`

## Initiative active

**Préparation 2.2** — branche `feature/2.2`, retouches libres groupées, pas de feature majeure imposée.

Voir `.ai/next-task.md` et `docs/HANDOFF_2_2_AGENT_BRIEF.md`.

## Réserves connues (non bloquantes)

- ESLint global
- `worksiteDevUnlock` dev-only
- Silhouette `ruines-lierre-ancien.png`
- Chunk size > 500 kB
- Wording quête onboarding « Chantier du havre »

## Working tree

Doit rester propre avant merge/tag. `build-revision.json` peut bouger en dev (HMR) — ne pas committer sauf fin de tâche X/Y documentée.
