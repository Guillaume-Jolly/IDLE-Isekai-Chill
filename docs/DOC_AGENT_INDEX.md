# Index documentation — guide agent

**Updated:** 2026-06-30 (post-archivage résidus 2.2)  
**But :** éviter qu’un agent suive une doc obsolète. Lire cet index **avant** d’explorer `docs/` au hasard.

---

## Source de vérité (toujours à jour en priorité)

| Priorité | Fichier | Contenu |
|----------|---------|---------|
| 1 | [`AGENTS.md`](../AGENTS.md) | Règles inviolables |
| 2 | [`.ai/current-state.md`](../.ai/current-state.md) | Initiative courante |
| 3 | [`.ai/project-context.md`](../.ai/project-context.md) | Produit, release, contraintes |
| 4 | [`docs/traceability/project-state.md`](./traceability/project-state.md) | État projet synthétique |
| 5 | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Phase 2.2 + prompt agent |
| 6 | [`docs/agent-guide/`](./agent-guide/) | Onboarding, versionnement, validation |
| 7 | [`.ai/next-task.md`](../.ai/next-task.md) | Prochaine tâche concrète |

**Branche prod :** `main` · tag **`v2.1.0.0`** @ `8e50e13`  
**Stack PROD locale :** `deploy/` — **hors Git public** (PC hôte uniquement).

---

## `docs/` actif (racine — 15 fichiers)

| Fichier | Rôle |
|---------|------|
| [`DOC_AGENT_INDEX.md`](./DOC_AGENT_INDEX.md) | Ce fichier |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Brief agent 2.2 |
| [`CHANGELOG_2_1.md`](./CHANGELOG_2_1.md) | Contenu release 2.1 |
| [`RELEASE_NOTES_2_1.md`](./RELEASE_NOTES_2_1.md) | Notes produit |
| [`RELEASE_2_1_DELIVERY_REPORT.md`](./RELEASE_2_1_DELIVERY_REPORT.md) | Rapport livraison |
| [`TNR_RELEASE_2_1_MVP20.md`](./TNR_RELEASE_2_1_MVP20.md) | TNR release |
| [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md) | Archive MVP 21.1 |
| [`CLEANUP_2_2_RESIDUAL_MANIFEST.md`](./CLEANUP_2_2_RESIDUAL_MANIFEST.md) | Archive résidus 2.2 |
| [`BACKLOG.md`](./BACKLOG.md) | Backlog produit |
| [`GAME_DESIGN_CURRENT.md`](./GAME_DESIGN_CURRENT.md) | Design courant |
| [`MYRION_WORKSITE_BALANCE.md`](./MYRION_WORKSITE_BALANCE.md) | Équilibrage Ferme lunaire |
| [`MYRION_WORKSITE_ASSET_PIPELINE.md`](./MYRION_WORKSITE_ASSET_PIPELINE.md) | Pipeline assets worksite |
| [`MYRION_WORKSITE_BIOME_CATALOG_MVP13.md`](./MYRION_WORKSITE_BIOME_CATALOG_MVP13.md) | Catalogue biomes |
| [`DUNGEON_EXPLORATION_BACKLOG.md`](./DUNGEON_EXPLORATION_BACKLOG.md) | Backlog futur |
| [`EXPLOITATION_PASSIVE_BACKLOG.md`](./EXPLOITATION_PASSIVE_BACKLOG.md) | Backlog futur |

Sous-dossiers actifs : [`agent-guide/`](./agent-guide/), [`traceability/`](./traceability/).

---

## Archive `old_v2.1/` — ne pas traiter comme source active

| Dossier | Contenu |
|---------|---------|
| `docs_wip/docs-finished-2.1/` | **32 docs MVP/TNR obsolètes** (ex-`docs/`) |
| `docs_wip/docs/` | Docs MVP pré-merge 21.1 |
| `staging_residual/` | Stubs staging + reviews/story terminés |
| `scripts_legacy/` | Scripts `@deprecated` one-shot |
| `triage/to-check-manually/` | Manifestes dedup manuels |
| `legacy/` | `REPO_SEPARATION.md`, ancien pack `release/` |
| `ai_work/`, `assets_wip/`, `story_wip/` | Quarantaine 21.1 |

**Règle :** ne pas suivre les « prochaines étapes » dans ces fichiers — vérifier `project-state.md`.

---

## Validation & versionnement

```bash
npm run version:prompt
npm run version:task
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
```

Voir [`agent-guide/05-politique-versionnement.md`](./agent-guide/05-politique-versionnement.md) et [`06-pipeline-validation.md`](./agent-guide/06-pipeline-validation.md).
