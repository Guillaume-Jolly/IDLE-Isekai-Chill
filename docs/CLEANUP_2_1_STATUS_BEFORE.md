# Cleanup 2.1 — État avant MVP 21.1

**Date :** 2026-06-30  
**MVP :** 21.1 — Inventaire et quarantaine non destructive

---

## Branche

`feature/myrion-worksite-mvp2`

## HEAD

`16dc8be` — docs: finalize release 2.1 delivery report

---

## Fichiers tracked modifiés (M)

| Chemin | Hypothèse classement |
|--------|----------------------|
| `.ai/cleanup-inventory.md` | ai_work — coordination agent locale |
| `.ai/cursor-inbox.md` | ai_work |
| `.ai/project-context.md` | ai_work |
| `docs/GAMEPLAY_LOOP.md` | docs_wip — drift MVP worksite |
| `docs/MYRION_WORKSITE_*.md` (10 fichiers) | docs_wip |
| `docs/MYRION_WORKSITE_SOUND_DESIGN.md` | docs_wip |
| `docs/SMOKE_TEST.md` | docs_wip |
| `docs/TNR_WORKSITE_BRANCH_MVP8.md` | docs_wip |
| `docs/traceability/changelog/entries/2026-06-26.md` | docs_wip |
| `scripts/mvp9-install-worksite-assets.py` | **Garder** — script install assets release |
| `scripts/worksite-remove-white-bg.py` | **Garder** — script pipeline worksite |
| `src/audio/worksiteAudio.ts` | **Garder** — code actif (diff vide / CRLF) |
| `src/components/minigames/Worksite*.tsx` (3) | **Garder** — code actif minigames |
| `src/data/myrion*.ts` (5 fichiers) | **Garder** — data worksite active |
| `src/hooks/useEnclosureWanderers.ts` | **Garder** — hook actif refuge |

---

## Fichiers untracked (??)

| Chemin | Hypothèse classement |
|--------|----------------------|
| `.ai/README.md` | ai_work |
| `assets/Background/hub/` | assets_wip |
| `assets/Compagnons/{brann,korren,marin,nyx,thorne}/` | assets_wip |
| `build-output.txt` | temp |
| `docs/HANDOFF_2026-06-26.md` | docs_wip |
| `docs/agent-guide/07-staging-input-guardrails.md` | docs_wip |
| `docs/design/` | docs_wip |
| `docs/traceability/assets/hub-minigames-art-brief.md` | docs_wip |
| `docs/traceability/project-state.md` | docs_wip |
| `docs/traceability/tnr/tnr-checklist-status-2026-06-25.md` | docs_wip |
| `old_assets/Background/village-mirror/*` (untracked) | legacy |
| `old_assets/Compagnons/*/affinite-replaced/` | legacy |
| `old_assets/Compagnons/imports/chibis-individuels/` | legacy |
| `old_assets/Myrions/imports/biomes-v2/` | legacy |
| `scripts/flatten-old-assets-imports.mjs` | legacy |
| `scripts/promote-intime-bed-affinity.mjs` | legacy |
| `src/components/story/` | story_wip |
| `src/data/companionConversationVisuals.ts` | story_wip |
| `src/data/conversations/starterCorpus.ts` | story_wip |
| `src/data/hubAssets.ts` | story_wip |
| `src/data/sceneGenerator/` | story_wip |
| `src/data/story/` | story_wip |
| `src/hooks/useCompanionEmotionCutout.ts` | story_wip |
| `staging/manifests/{gacha-opening,new-companions,plan-asset-moves,talia-companion-pack}.json` | staging |
| `staging/myrion-worksite-mvp15/` | staging |
| `staging/story/samples/` | staging |

---

## Fichiers ignorés pertinents

- `public/build-info.json` — généré build, gitignored (ne pas archiver)
- `dist/` — build output, gitignored

---

## Ne pas déplacer (release 2.1 active)

- `package.json`, `build-revision.json`, `AGENTS.md`
- `.cursor/rules/00-idle-isekai-core.mdc`
- `docs/CHANGELOG_2_1.md`, `docs/RELEASE_NOTES_2_1.md`, `docs/RELEASE_2_1_DELIVERY_REPORT.md`, `docs/TNR_RELEASE_2_1_MVP20.md`
- `public/assets/minigames/myrion-worksite/**`
- `src/data/myrionWorksite*`, `src/data/companionBond*`, scripts validate/generate bonds
- `staging/playbooks/**`, `staging/manifests/myrion-worksite-mvp15.json` (tracked)
- Corps `old_assets/**` déjà versionné (712 fichiers tracked) — seuls ajouts untracked déplacés

---

## Objectif MVP 21.1

Créer `old_v2.1/` et y déplacer (sans suppression) les éléments WIP/temporaires listés ci-dessus.
