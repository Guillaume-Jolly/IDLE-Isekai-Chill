# Cleanup 2.2 — Résidus projets terminés (MVP 22.1)

**Date :** 2026-06-30  
**Opérations :** 49 déplacements (`git mv`)  
**Suppressions définitives :** **aucune**

Archive cible : `old_v2.1/` (catégories existantes + extensions ci-dessous).

---

## docs → `old_v2.1/docs_wip/docs-finished-2.1/` (32 fichiers)

Docs MVP / TNR / audits **terminés** (release 2.1 livrée) :

- États obsolètes : `PROJECT_STATE`, `TECHNICAL_STATE`, `BUILD_ERRORS`, `WORKTREE_TRIAGE`, `TODO_PRIORITIZED`
- Cleanup 2.1 process : `CLEANUP_REPORT`, `CLEANUP_2_1_FINAL_21_3`, `VALIDATION_21_2`, `STATUS_BEFORE`, `STATUS_AFTER`
- Chantier worksite MVP : `MYRION_WORKSITE_MVP1/2/14/15/16`, manuels test MVP1/2
- Chantiers compagnons / gameplay : `COMPANION_*_MVP11/17`, `CONTENT_REVIEW_MVP19`, `GLOBAL_GAMEPLAY_MVP18`, `ONBOARDING_MVP12`
- Corpus / liens (terminé) : `LINK_CORPUS_V2_AUDIT`, `MANUAL_TEST_LINK_CORPUS`
- TNR historiques : `TNR_GAMEPLAY`, `TNR_EVENT_DISAGREA`, `TNR_NATURAL_PROGRESSION_0_10`, `TUTORIAL_OBJECTIVES_0_10`
- Autres : `MOBILE_UI_VALIDATION`, `MANUAL_TEST_REFUGE_HUNT_INVENTORY`, `MYRION_COMBAT_PROTOTYPE`, `RACING_MINIGAME_PROTOTYPE`

**Conservés dans `docs/` (actifs 2.2) :**

`DOC_AGENT_INDEX`, `HANDOFF_2_2_AGENT_BRIEF`, `CHANGELOG_2_1`, `RELEASE_*`, `TNR_RELEASE_2_1_MVP20`, `CLEANUP_2_1_MOVE_MANIFEST`, `BACKLOG`, `GAME_DESIGN_CURRENT`, `MYRION_WORKSITE_BALANCE`, `MYRION_WORKSITE_ASSET_PIPELINE`, `MYRION_WORKSITE_BIOME_CATALOG_MVP13`, backlogs exploration/passive.

---

## staging → `old_v2.1/staging_residual/` (9 fichiers)

Stubs redirigeants + reviews/story terminés :

- `agent-guide/README.md`, `changelog-detailed/README.md`, `planning/README.md`
- `planning/conversation-v2-fix-backlog.md`, `planning/phase5-main-v2-baseline.md`
- `reviews/*` (2), `story/*` (2)

**Conservés dans `staging/` :** `playbooks/`, `companion-visual-pack/`, `manifests/`, `skinline-premium/` (backlog NSFW — assets non déplacés).

---

## scripts → `old_v2.1/scripts_legacy/` (6 fichiers)

Scripts `@deprecated` one-shot (Assets 2.0 / Disagrea) — hors `package.json` :

`link-legacy-public-assets.mjs`, `archive-public-mirrors-to-old-assets.mjs`, `chroma-cutout.mjs`, `organize-disagrea-catalog.mjs`, `copy-disagrea-hunt-guide.mjs`, `composite-disagrea-portraits.mjs`

---

## triage / legacy

| Source | Destination |
|--------|-------------|
| `To check manually/old-assets-dedup-conflicts/` | `old_v2.1/triage/to-check-manually/old-assets-dedup-conflicts/` |
| `release/pack-files/LISEZMOI.txt` | `old_v2.1/legacy/release/LISEZMOI.txt` |
| `REPO_SEPARATION.md` | `old_v2.1/legacy/REPO_SEPARATION.md` |

Coquilles vides `release/`, `To check manually/` retirées après vidage (aucun fichier supprimé).

---

## Non déplacé (volontaire)

| Zone | Raison |
|------|--------|
| `staging/skinline-premium/**` | Assets PNG trackés — demande explicite requise |
| `deploy/` | PROD locale — déjà gitignoré |
| `old_assets/`, `assets/` runtime | Source of truth jeu |
| Code `src/` gameplay | Hors scope résidus docs |
