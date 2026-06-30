# Asset Cleanup Inventory

Last updated: 2026-06-24 night session by Codex.

## Current Coordination State

Cursor replied in `.ai/cursor-outbox.md`.

Cursor principal mode: standby / coordination.

Still active writer: another Cursor agent is regenerating and promoting companion emotion cutouts v3.

Active zones that Codex must not move, delete, rename, or rewrite yet:

- `staging/companion-visual-pack/village/*/cutouts/`
- `staging/companion-visual-pack/disagrea/*/cutouts/`
- `public/assets/companions/*/emotion-*.png`
- `old_assets/companions/*/cutouts/`

Cursor says Codex may do read-only inventory immediately and may edit `.ai/*`.

Cursor will signal completion with `STANDBY COMPLETE`, expected via `.ai/cursor-outbox.md` or `.ai/cursor-heartbeat.md`.

Note: `.ai/cursor-heartbeat.md` was announced by Cursor but did not exist at the first Codex read.

## User Requested Target Layout

Long-term asset folders:

- `assets/`
  - `Compagnons/<id>/affinite/`
  - `Compagnons/<id>/cutouts/`
  - `Compagnons/<id>/chibis/`
  - `Compagnons/<id>/NSFW/`
  - `Compagnons/<id>/Autres/<source-or-batch-name>/`
  - `Background/<id_biome>/`
  - `Myrions/<id_biome>/`
- `old_assets/` for generated/loose/unused assets that are no longer runtime-used.
- `staging/` untouched.
- `Input chatgpt/` untouched.

Suggested additional categories to consider:

- `assets/Gacha/<event-or-pack>/` for event banners, icons, cinema frames, and reward art.
- `assets/UI/<feature>/` for launcher/UI shell assets that are not gameplay content.
- `assets/References/<pack>/` for identity/style references that are source material but not runtime.

## First Read-Only Findings

Branch:

- `feature/link-corpus-v2`

Recent HEAD:

- `07d7173 fix(disagrea): etna hunt guide and capture white screen`
- `756844d feat(disagrea): wire event runtime`
- `a30e108 docs: report disagrea runtime assets`
- `01cb8e6 chore(assets): stage disagrea runtime assets`

Backup branch check:

- `origin/Backup` fetched successfully.
- `origin/Backup` currently points to `56de3718c5435805cf0fb240ea2eceafa05905e0`.
- Local `HEAD` currently points to `07d71732a3478e4a940a77013d4eafbc9a88862d`.
- `origin/Backup` is therefore behind the current local work.
- Do not overwrite it until deciding whether the backup should capture only committed HEAD or also the current uncommitted WIP.
- Local safety branch created: `backup/codex-night-20260624-pre-asset-cleanup` at `07d71732a3478e4a940a77013d4eafbc9a88862d`.
- This local branch protects committed HEAD only; it does not include uncommitted WIP.

Large asset/document clusters observed:

- `public/assets/companions/`: runtime companion art for 19 companion ids.
- `public/assets/minigames/`: runtime minigame assets, grouped as `capture`, `dressage`, `hub`.
- `public/gacha/`: runtime gacha/cinema/event assets.
- `public/companions/`: legacy companion path still present via Vite rewrite `/companions/* -> /assets/companions/*`; many files are untracked or transitional.
- `assets/event-disagrea/`: event source/generated/integrated Disagrea work.
- `assets/minigames/`, `assets/myrions-import/`, `assets/talia-import/`: source/import folders from previous asset work.
- `old_assets/`: existing archive area with replaced companion cutouts/chibis and event-disagrea sources.
- `staging/`: active work area, must not be touched.
- `Input chatgpt/`: user temporary input area, must not be touched.
- `deploy/`, `dist/`, `.tmp/`, `.tools/`, `node_modules/`: generated/tooling folders, should be excluded from asset cleanup decisions unless release cleanup is explicitly requested.

Runtime path references found in code/config:

- `/assets/companions/...`
- `/assets/minigames/...`
- `/gacha/...`
- legacy rewrites from `/companions/...` and `/minigames/...` in `vite.config.ts`
- dev-only roots:
  - `/dev-assets/event-disagrea`
  - `/dev-assets/staging-companion-visual-pack`

This means moving runtime files out of `public/assets` or `public/gacha` requires code/config rewrites plus build/lint and visual smoke.

## Companion Runtime Shape

Observed under `public/assets/companions/`:

- 19 companion ids exist.
- Base shape is mostly normalized as direct files:
  - `affinity-1.png` through `affinity-5.png`
  - optional `affinity-4-nsfw.png`
  - `chibi.png`
  - optional `emotion-<emotion>.png`
- No current direct `cutout-*` or `background-*` files remain in the visible runtime companion folders after the latest WIP state; several old Disagrea `cutout-*`/`background-*` paths show as deleted in git status.

Companions with 8 promoted emotion files visible at inventory time:

- `iris`
- `kael`
- `lyra`
- `maeve`
- `nami`
- `runa`
- `seren`

Companions without visible promoted `emotion-*` files at inventory time:

- `asha`
- `elwen`
- `etna`
- `flonne`
- `laharl`
- `mira`
- `noa`
- `pleinair`
- `solene`
- `sora`
- `talia`
- `zelie`

This may change while Cursor's cutout v3 agent continues.

## Minigame / Gacha / Event Findings

Runtime minigames under `public/assets/minigames/`:

- `capture/myrions`: 187 files
- `dressage/myrions`: 102 files
- `dressage/enclosures`: 18 files
- `capture/biomes`: 18 files
- `capture/companions`: 12 files
- `hub/stages`: 1 file
- `hub/presentations`: 1 file

Runtime gacha under `public/gacha/`:

- `cinema`: 28 files
- `icons`: 16 files
- `events`: 2 files

Source/import minigames under `assets/minigames/`:

- `dressage`: 87 files
- `capture`: 19 files
- `README.md`

Disagrea source/integrated under `assets/event-disagrea/`:

- `integrated`: 26 files
- `backgrounds`: 22 files
- `GENERATION_STYLE.md`

Preliminary interpretation:

- `public/assets/minigames` and `public/gacha` are runtime public folders; moving them requires code/config path rewrites.
- `assets/minigames` and `assets/event-disagrea` are better candidates for normalization into the requested source/archive taxonomy.
- Disagrea could map to:
  - `assets/Compagnons/{etna,flonne,laharl,pleinair}/affinite`
  - `assets/Compagnons/{id}/NSFW`
  - `assets/Background/disagrea-event`
  - `assets/Myrions/disagrea-event`
  - optional `assets/Gacha/disagrea`

## Preliminary Cleanup Boundaries

Do not start physical moves until Cursor finishes cutouts v3.

Candidate commit boundaries after standby:

1. Coordination/inventory docs only.
2. Safety backup branch update, if user confirms remote overwrite semantics.
3. Archive obvious generated-unused/source assets into normalized `old_assets/` or `assets/` structure without touching runtime public paths.
4. Normalize runtime-adjacent source assets under `assets/Compagnons`, `assets/Background`, `assets/Myrions`, and optional `assets/Gacha`.
5. Runtime path cleanup only if needed, with code rewrites and validation.
6. Docs-only folder consolidation after assets are stable.

## Safety Rules For The Massive Cleanup Commit

- No permanent deletion of uncertain assets.
- Prefer move/archive to `old_assets/` for unused material.
- Keep `staging/` untouched.
- Keep `Input chatgpt/` untouched.
- Keep active Cursor cutout zones untouched until Cursor declares completion.
- Do not stage release/build noise with gameplay assets.
- Do not push to `main`.
- Do not overwrite remote `Backup` without explicit confirmation.

## Validation Required After Any Physical Move

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

If runtime paths move or public assets change, request or run visual smoke for:

- companion portraits, cutouts, chibis, emotion cutouts;
- Disagrea guest assets;
- Myrion capture cutouts and dressage chibis;
- biome backgrounds;
- gacha banners/cinema/icons;
- minigame hub/capture/dressage screens.
