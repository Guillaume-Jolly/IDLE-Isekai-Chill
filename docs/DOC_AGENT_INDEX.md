# Index documentation — guide agent

**Updated:** 2026-06-30 (passe 2 archivage résidus)  
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

## `docs/` actif (racine — 8 fichiers)

| Fichier | Rôle |
|---------|------|
| [`DOC_AGENT_INDEX.md`](./DOC_AGENT_INDEX.md) | Ce fichier |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Brief agent 2.2 |
| [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md) | Archive MVP 21.1 |
| [`CLEANUP_2_2_RESIDUAL_MANIFEST.md`](./CLEANUP_2_2_RESIDUAL_MANIFEST.md) | Archive résidus 2.2 (passes 1–2) |
| [`BACKLOG.md`](./BACKLOG.md) | Backlog produit |
| [`GAME_DESIGN_CURRENT.md`](./GAME_DESIGN_CURRENT.md) | Design courant |
| [`DUNGEON_EXPLORATION_BACKLOG.md`](./DUNGEON_EXPLORATION_BACKLOG.md) | Backlog futur |
| [`EXPLOITATION_PASSIVE_BACKLOG.md`](./EXPLOITATION_PASSIVE_BACKLOG.md) | Backlog futur |

Sous-dossiers actifs : [`agent-guide/`](./agent-guide/), [`traceability/`](./traceability/) (changelog, project-state, audits actifs).

**Release 2.1 / worksite / TNR historiques :** `old_v2.1/docs_release_2.1/`, `old_v2.1/docs_wip/docs-refs-worksite/`, `old_v2.1/traceability_archive/`.

---

**Archive locale `old_v2.1/`** — gitignorée, **hors dépôt public** (PC hôte). Ne pas pousser sur `origin`.

| Dossier | Contenu |
|---------|---------|
| `docs_wip/docs-finished-2.1/` | 32 docs MVP/TNR obsolètes (passe 1) |
| `docs_release_2.1/` | Changelog, release notes, delivery report, TNR release |
| `docs_wip/docs-refs-worksite/` | Balance, pipeline, catalogue biomes worksite |
| `traceability_archive/` | TNR phase2/3, audits 2.0, logs assets |
| `staging_wip/` | skinline-premium, companion-visual-pack, myrion-worksite-mvp15 |
| `staging_residual/` | Stubs staging + reviews/story + playbook 05 |
| `scripts_legacy/` | Scripts one-shot + vendor webview2 + staging-scripts |
| `triage/to-check-manually/` | Manifestes dedup manuels |
| `legacy/` | `REPO_SEPARATION.md`, ancien pack `release/` |
| `ai_work/`, `assets_wip/`, `story_wip/` | Quarantaine 21.1 |

**Règle :** ne pas suivre les « prochaines étapes » dans ces fichiers — vérifier `project-state.md`.

---

## `staging/` actif

Uniquement **`staging/playbooks/`** (procédures opérationnelles 01–04, 06, 08–11).

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

Voir [`agent-guide/05-politique-versionnement.md`](./agent-guide/05-politique-versionnement.md) et [`agent-guide/06-pipeline-validation.md`](./agent-guide/06-pipeline-validation.md).
