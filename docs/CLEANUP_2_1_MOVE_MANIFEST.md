# Cleanup 2.1 — Manifeste des déplacements (MVP 21.1)

**Date :** 2026-06-30  
**Opérations :** 70 déplacements  
**Échecs vérification :** 0  
**Suppressions définitives :** **aucune**

Machine-readable : [`old_v2.1/manifests/move-batch-21_1.csv`](../old_v2.1/manifests/move-batch-21_1.csv)

---

## Légende

| Colonne | Signification |
|---------|---------------|
| Source | Chemin d’origine à la racine du dépôt |
| Destination | Chemin sous `old_v2.1/` |
| Tracked | `tracked` (git mv) ou `untracked` (mv) |
| Vérif. | source absente / destination présente |

---

## assets_wip (6 opérations)

| Source | Destination | Tracked | Raison | Vérif. |
|--------|-------------|---------|--------|--------|
| `assets/Compagnons/brann` | `old_v2.1/assets_wip/assets/Compagnons/brann` | untracked | compagnon WIP | oui / oui |
| `assets/Compagnons/korren` | `old_v2.1/assets_wip/assets/Compagnons/korren` | untracked | compagnon WIP | oui / oui |
| `assets/Compagnons/marin` | `old_v2.1/assets_wip/assets/Compagnons/marin` | untracked | compagnon WIP | oui / oui |
| `assets/Compagnons/nyx` | `old_v2.1/assets_wip/assets/Compagnons/nyx` | untracked | compagnon WIP | oui / oui |
| `assets/Compagnons/thorne` | `old_v2.1/assets_wip/assets/Compagnons/thorne` | untracked | compagnon WIP | oui / oui |
| `assets/Background/hub` | `old_v2.1/assets_wip/assets/Background/hub` | untracked | hub background WIP | oui / oui |

---

## story_wip (8 opérations)

| Source | Destination | Tracked | Raison | Vérif. |
|--------|-------------|---------|--------|--------|
| `src/components/story` | `old_v2.1/story_wip/src/components/story` | untracked | story UI WIP | oui / oui |
| `src/data/story` | `old_v2.1/story_wip/src/data/story` | untracked | story data WIP | oui / oui |
| `src/data/sceneGenerator` | `old_v2.1/story_wip/src/data/sceneGenerator` | untracked | scene generator WIP | oui / oui |
| `src/data/companionConversationVisuals.ts` | `old_v2.1/story_wip/src/data/...` | untracked | helper visuel WIP | oui / oui |
| `src/data/conversations/starterCorpus.ts` | `old_v2.1/story_wip/src/data/conversations/...` | untracked | starter corpus WIP | oui / oui |
| `src/data/hubAssets.ts` | `old_v2.1/story_wip/src/data/hubAssets.ts` | untracked | hub assets WIP | oui / oui |
| `src/hooks/useCompanionEmotionCutout.ts` | `old_v2.1/story_wip/src/hooks/...` | untracked | hook story WIP | oui / oui |

---

## staging (6 opérations)

| Source | Destination | Tracked | Raison | Vérif. |
|--------|-------------|---------|--------|--------|
| `staging/myrion-worksite-mvp15` | `old_v2.1/staging/myrion-worksite-mvp15` | untracked | générés mvp15 | oui / oui |
| `staging/story/samples` | `old_v2.1/staging/story/samples` | untracked | samples story | oui / oui |
| `staging/manifests/gacha-opening.json` | `old_v2.1/staging/manifests/...` | untracked | manifest temp | oui / oui |
| `staging/manifests/new-companions-2026-06-25.json` | `old_v2.1/staging/manifests/...` | untracked | manifest temp | oui / oui |
| `staging/manifests/plan-asset-moves.json` | `old_v2.1/staging/manifests/...` | untracked | manifest temp | oui / oui |
| `staging/manifests/talia-companion-pack.json` | `old_v2.1/staging/manifests/...` | untracked | manifest temp | oui / oui |

**Non déplacé :** `staging/playbooks/**`, `staging/manifests/myrion-worksite-mvp15.json` (tracked, pipeline release).

---

## temp (1 opération)

| Source | Destination | Tracked | Raison | Vérif. |
|--------|-------------|---------|--------|--------|
| `build-output.txt` | `old_v2.1/temp/build-output.txt` | untracked | log build | oui / oui |

---

## docs_wip (22 opérations)

16 docs tracked (`git mv`) + 6 untracked — voir CSV lignes 22–43.

Docs release **non déplacés** : `CHANGELOG_2_1.md`, `RELEASE_NOTES_2_1.md`, `RELEASE_2_1_DELIVERY_REPORT.md`, `TNR_RELEASE_2_1_MVP20.md`.

---

## ai_work (1 opération — 18 fichiers tracked)

| Source | Destination | Tracked | Raison | Vérif. |
|--------|-------------|---------|--------|--------|
| `.ai/` (entier) | `old_v2.1/ai_work/.ai/` | tracked | coordination agent locale | oui / oui |

Inclut `README.md` (untracked) déplacé avec le dossier.

---

## legacy (26 opérations)

- 2 scripts : `flatten-old-assets-imports.mjs`, `promote-intime-bed-affinity.mjs`
- 7 panoramas `village-mirror`
- 1 `buildings-map`
- 15 dossiers `affinite-replaced`
- 1 `chibis-individuels`
- 1 `biomes-v2`

**Non déplacé :** 712 fichiers `old_assets/**` déjà versionnés à la racine.

---

## Statistiques

| Métrique | Valeur |
|----------|--------|
| Opérations de déplacement | 70 |
| Fichiers dans `old_v2.1/` (récursif) | 454 |
| Vérifications source absente | 70/70 oui |
| Vérifications destination présente | 70/70 oui |
| Suppression définitive | **0** |
