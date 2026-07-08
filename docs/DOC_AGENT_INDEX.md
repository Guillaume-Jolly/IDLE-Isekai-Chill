# Index documentation — guide agent

**Updated:** 2026-07-08 (clôture 2.2 — inventaire changelog)  
**But :** éviter qu’un agent suive une doc obsolète. Lire cet index **avant** d’explorer `docs/` au hasard.

---

## Source de vérité (toujours à jour en priorité)

| Priorité | Fichier | Contenu |
|----------|---------|---------|
| 1 | [`AGENTS.md`](../AGENTS.md) | Règles inviolables |
| — | [`C:\Dev\Project\REFERENCE`](C:/Dev/Project/REFERENCE) | **Hub multi-projets** — bootstrap, templates, User Rules |
| — | [`C:\Dev\Project\REFERENCE\docs\INDEX.md`](C:/Dev/Project/REFERENCE/docs/INDEX.md) | Processus partagés (versionnement, archive, MEP…) |
| 2 | [`docs/traceability/project-state.md`](./traceability/project-state.md) | **État projet versionné** (source de vérité) |
| — | [`docs/traceability/changelog/CHANGELOG_2_2.md`](./traceability/changelog/CHANGELOG_2_2.md) | **Clôture 2.2.0** — Terminé / Entamé / Delayé / Annulé |
| — | [`docs/traceability/changelog/CHANGELOG_2_2_1.md`](./traceability/changelog/CHANGELOG_2_2_1.md) | **Kickoff 2.2.1** — priorités patch |
| — | [`docs/CLEANUP_2_2_1_MANIFEST.md`](./CLEANUP_2_2_1_MANIFEST.md) | Moves archive `old_2_2/old_2_2_1/` (gitignoré) |
| 3 | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Phase 2.2 + prompt agent |
| — | [`docs/HANDOFF_PARLER_CURATED_PISTE_B.md`](./HANDOFF_PARLER_CURATED_PISTE_B.md) | **Piste B** — Parler curé aff. 4–5 (Lyra aff. 5 · auto OK · in-game pending) |
| — | [`docs/traceability/link-corpus-review/README.md`](./traceability/link-corpus-review/README.md) | Index lots corpus — piste A (bulk) vs piste B (curé) |
| — | [`docs/traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md`](./traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md) | Modop walk 10/10 + Phase C in-game aff. 5 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/PARLER_SCENARIO_FIRST_PIPELINE.md` | Pipeline Phase A→B · S67/S68 · banque 45 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/staging/parler-scenarios/ACTS_POSITIONS_CATALOG.md` | Catalogue ~110 actes/poses · `ACT_TP_*` tiers |
| — | _archivé_ `old_2_2/old_2_2_1/annule/staging/parler-scenarios/PREFERENCE_WEIGHTS_MC_MALE.md` | **MC H producteur** — arcs, pari Maeve, interdits tiers H (tour 5) |
| — | _archivé_ `old_2_2/old_2_2_1/annule/staging/parler-scenarios/PREFERENCE_WEIGHTS.md` | Hub poids · MC H vs MC F |
| — | _archivé_ `old_2_2/old_2_2_1/annule/staging/parler-scenarios/SCENARIO_BANK_INDEX.md` | Index banque 9 scénarios · go/no-go tour 4–5 Phase B |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEA_TOUR4.md` | Relecture 9 scénarios Phase A · 6 GO Phase B |
| — | _archivé_ `old_2_2/old_2_2_1/annule/staging/parler-scenarios/WRITER_PHASE_B_PROMPT.md` | Prompt Phase B — Pari vitrine v2 + queue 5 scénarios |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEB_PARI_VITRINE.md` | Phase B Pari vitrine v1 NO-GO · queue 5/8 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/WRITER_PARLER_PHASEB_LOT2_HANDOFF.md` | **Writer Lot 2 CLOS** — 6 JSON staging · menu dev |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEB_LOT3.md` | **Relecteur Lot 3 CLOS** — 5🔴 1🟡 · findings T01–T20 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/WRITER_PARLER_PHASEB_LOT3_PROMPT.md` | **Writer Lot 3 CLOS** — 6/6 lint GREEN · P3 L-tier S69 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RETEX_PARLER_LOT3.md` | **RETEX Lot 3** — compilation 3 agents · reste à faire |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEB_LOT4.md` | ~~Lot 4~~ abandonné (corrompu) |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEB_LOT5.md` | **Lot 5 CLOS technique** — sweep · 6/6 lint · writer sweep |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RETEX_PARLER_LOT5.md` | **RETEX Lot 5** — relecteur→règles→writer · suite Lot 6 |
| — | _archivé_ `old_2_2/old_2_2_1/annule/docs/traceability/link-corpus-review/RELECTURE_PARLER_PHASEB_LOT6.md` | **Lot 6 OPEN** — validation 5b + retours producteur Guillaume |
| — | [`docs/traceability/companions/README.md`](./traceability/companions/README.md) | Panel Parler v1 + fiches (Havre + Disagrea : Etna, Laharl, Roric, Finn, …) |
| — | [`docs/HANDOFF_NEW_MINIGAME_CO.md`](./HANDOFF_NEW_MINIGAME_CO.md) | CO — créer un nouveau mini-jeu |
| 4 | [`docs/agent-guide/08-versionnement-global.md`](./agent-guide/08-versionnement-global.md) | **A.B.C.X.Y** — release + dev, git hooks |
| 5 | [`docs/agent-guide/05-politique-versionnement.md`](./agent-guide/05-politique-versionnement.md) | X/Y, hook, DEV_LOG, commits atomiques |
| 6 | [`docs/agent-guide/07-kickoff-nouvelle-version.md`](./agent-guide/07-kickoff-nouvelle-version.md) | Kickoff nouvelle phase |
| 7 | [`docs/agent-guide/`](./agent-guide/) | Onboarding, validation |
| — | `.ai/` (gitignoré) | Stub agent **local** — optionnel si présent sur disque |

**Branche prod :** `main` @ `b91b6fb` · tag release **`v2.1.0.0`**  
**Branche dev :** `feature/2.2` · semver **`2.2.0`** · UI **`v2.2.0.{X}`** · hook [`.cursor/hooks.json`](../.cursor/hooks.json)  
**Stack PROD locale :** `deploy/` — **hors Git public** (PC hôte uniquement).

---

## `docs/` actif (racine — 8 fichiers)

| Fichier | Rôle |
|---------|------|
| [`DOC_AGENT_INDEX.md`](./DOC_AGENT_INDEX.md) | Ce fichier |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Brief agent 2.2 |
| [`HANDOFF_PARLER_CURATED_PISTE_B.md`](./HANDOFF_PARLER_CURATED_PISTE_B.md) | Passage agent — Parler curé piste B |
| [`HANDOFF_NEW_MINIGAME_CO.md`](./HANDOFF_NEW_MINIGAME_CO.md) | CO — nouveau mini-jeu |
| [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md) | Archive MVP 21.1 |
| [`CLEANUP_2_2_RESIDUAL_MANIFEST.md`](./CLEANUP_2_2_RESIDUAL_MANIFEST.md) | Archive résidus 2.2 (passes 1–2) |
| [`CLEANUP_2_2_1_MANIFEST.md`](./CLEANUP_2_2_1_MANIFEST.md) | Archive clôture 2.2.1 — annulés / reliquats |
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
# X : automatique via hook beforeSubmitPrompt (opt-out message : « même X »)
npm run version:prompt   # backup manuel si hook off
npm run version:task     # Y — tâche distincte (agent uniquement, pas HMR)
npm run validate:companion-bonds
npm run validate:link-corpus
npm run validate:curated-parler:aff5:both   # piste B aff. 5 H+F
npm run walk:pack:aff5:all                  # déroulé cohérence 10 packs
npm run tnr:baseline
npm run build
```

- Politique : [`agent-guide/05-politique-versionnement.md`](./agent-guide/05-politique-versionnement.md)
- Hook : [`.cursor/hooks/README.md`](../.cursor/hooks/README.md)
- DEV_LOG : [`traceability/changelog/DEV_LOG_2_2.md`](./traceability/changelog/DEV_LOG_2_2.md)
- Clôture 2.2 : [`traceability/changelog/CHANGELOG_2_2.md`](./traceability/changelog/CHANGELOG_2_2.md)
- Pipeline : [`agent-guide/06-pipeline-validation.md`](./agent-guide/06-pipeline-validation.md)
- Kickoff : [`agent-guide/07-kickoff-nouvelle-version.md`](./agent-guide/07-kickoff-nouvelle-version.md)
