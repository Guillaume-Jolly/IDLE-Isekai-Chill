# Phase 4 — WebP Assessment

**Date:** 2026-06-25  
**Scope:** `assets/` + `public/` (read-only scan)  
**Policy:** WebP **only if necessary** or images demonstrably too slow to load — **no conversion performed**.

---

## Verdict: **DEFER**

Phase 4 WebP is **not required** before Assets 2.0 commit prep (Phase 5). Defer per user policy: large PNGs exist, but loading is on-demand, partial WebP is already in place for the heaviest always-on assets, and there is no measured or reported slow-load problem.

If performance issues appear post-release, revisit as **SELECTIVE** on opaque biome backgrounds only (see below).

---

## Scan summary

| Metric | `assets/` + `public/` (all) | Runtime subset* |
|--------|------------------------------|-----------------|
| Image files | 1 149 | 786 |
| Total size | **1 364 MB** (1 175 MB assets + 189 MB public) | **829 MB** |
| > 500 KB | 773 (67 %) | 500 (64 %) |
| > 1 MB | 667 (58 %) | 394 (50 %) |
| > 2 MB | 268 (23 %) | — |

\*Runtime subset excludes: `assets/myrions-import/`, `assets/talia-import/`, `assets/source-*`, `public/generated-backup/`, legacy panorama PNG sources, `Autres/disagrea-integrated/` duplicates.

**Raw data:** `staging/planning/phase4-size-scan.json`, `staging/planning/phase4-size-scan-runtime.json`  
**Script:** `staging/planning/_phase4-size-scan.mjs` (regeneratable)

### `asset-manifest.json` (Phase 0)

The manifest inventories **1 720** images across all scan roots (`assets`, `public`, `old_assets`, `staging`, etc.) with class/bucket counts but **no per-file byte sizes**. Size analysis for this assessment comes from the dedicated scan above, not from the manifest.

---

## Top 20 largest images (all scan roots)

| Rank | Size | Category | Path |
|------|------|----------|------|
| 1 | 4.2 MB | background | `assets/Background/ruines-astrales/capture-wide.png` |
| 2 | 4.1 MB | background | `assets/Background/rivage-corallien/capture-wide.png` |
| 3 | 4.0 MB | background | `assets/Background/montagnes-cristallines/capture-wide.png` |
| 4 | 4.0 MB | background | `assets/Background/foret-ancienne/capture-wide.png` |
| 5 | 4.0 MB | background | `assets/Background/prairie-solaire/capture-wide.png` |
| 6 | 3.6 MB | background | `assets/Background/marais-brumeux/capture-wide.png` |
| 7 | 3.6 MB | background | `assets/Background/desert-rouge/capture-wide.png` |
| 8 | 3.4 MB | other (archived source) | `public/village/panorama-ai.png` |
| 9 | 3.2 MB | background | `assets/Background/volcan-noir/capture-wide.png` |
| 10 | 3.1 MB | other (archived source) | `public/village/panorama.png` |
| 11 | 3.1 MB | cutout (alpha) | `assets/Myrions/disagrea-event/cutout/chimerelle.png` |
| 12 | 3.1 MB | gacha | `assets/gacha/events/disagrea-opening-banner.png` |
| 13 | 3.0 MB | cutout (alpha) | `assets/Myrions/disagrea-event/cutout/explosia.png` |
| 14 | 2.9 MB | companion | `assets/Compagnons/sora/affinite/affinity-1.png` |
| 15 | 2.9 MB | other (backup mirror) | `public/generated-backup/sora-affinity-1.png` |
| 16 | 2.9 MB | background | `assets/Background/disagrea-event/capture-wide.png` |
| 17 | 2.9 MB | background (duplicate hash) | `assets/Background/disagrea-event/minigame/myrion_hunt_pc.png` |
| 18 | 2.8 MB | other (import source) | `assets/myrions-import/.../plage_tropicale...png` |
| 19 | 2.8 MB | other (import source) | `assets/myrions-import/.../ruines_d_un_temple...png` |
| 20 | 2.8 MB | companion | `assets/Compagnons/mira/affinite/affinity-1.png` |

**Pattern:** Top offenders are **opaque biome capture-wide backgrounds** (3.2–4.2 MB), followed by **alpha Myrion cutouts** and **companion affinity scenes** (~2.3–2.9 MB avg).

---

## Category breakdown (runtime subset)

| Category | Files | Total | Avg | Max | Alpha? |
|----------|------:|------:|----:|----:|--------|
| Biome capture-wide | 9 | 33 MB | 3.7 MB | 4.2 MB | No (opaque) |
| Biome capture-portrait | 9 | 11 MB | 1.3 MB | 2.6 MB | No |
| Biome dressage-wide | 9 | 19 MB | 2.2 MB | 2.7 MB | No |
| Biome dressage-portrait | 9 | 19 MB | 2.1 MB | 2.6 MB | No |
| Myrion cutout | 102 | 141 MB | 1.4 MB | 3.1 MB | Yes |
| Companion affinite | 95 | 216 MB | 2.3 MB | 2.9 MB | Partial / scenes |
| Companion chibi | 19 | 23 MB | 1.3 MB | 1.8 MB | Yes |
| Gacha | 29 | 45 MB | 1.6 MB | 3.1 MB | Mixed |
| Guide cutout (Talia) | 9 | 14 MB | 1.6 MB | 1.9 MB | Yes |
| Public runtime | 28 | 9 MB | 323 KB | 1.6 MB | Mixed |

---

## Critical-path load impact

How assets load in practice (from `BiomeBackground.tsx`, `minigameAssets.ts`, `companionAssets.ts`, `GachaOpening.tsx`, `vite.repo-assets.ts`):

| Screen | What loads | Typical payload | Notes |
|--------|------------|----------------:|-------|
| **Chasse (capture)** | 1 biome bg + 1 Myrion cutout/silhouette; optional guide cutout | **Desktop ~5.1 MB** (3.7 + 1.4 MB) · **Mobile ~2.7 MB** (1.3 + 1.4 MB) | One biome at a time; lazy `<img>` |
| **Dressage** | 1 enclosure bg + chibi Myrions on demand | **~2–4 MB** first paint | Same Background routing as capture |
| **Companion portrait** | 1 affinity / emotion / chibi at a time | **~1.3–2.9 MB** | No bulk preload of 95 portraits |
| **Gacha cinema** | Video (`opening.webm` 410 KB) or Disagrea slideshow (3 PNG frames) | **~883 KB video** · **~5 MB** Disagrea 3-frame pull | Frames 00–05 already have WebP siblings (~90 % smaller) |
| **Village map** | `panorama-base.webp` | **1.6 MB** | WebP already deployed |

**Threshold check:** Many individual assets exceed 500 KB–1 MB mobile guidance, but **no screen loads the full 829 MB runtime corpus** — only 2–4 assets per scene.

---

## Existing WebP (no Phase 4 work needed)

| Asset | PNG | WebP / video | Savings |
|-------|----:|-------------:|--------:|
| Village panorama (runtime) | 3.2 MB (`panorama.png`, not served) | `public/village/panorama-base.webp` 1.6 MB | ~50 % |
| Gacha opening | `hostess-opening.png` 2.8 MB | `opening.webm` 410 KB + `opening.webp` 771 KB | ~70–85 % |
| Gacha cinema frames 00–05 | 1.3–1.8 MB each | 73–198 KB each | ~85–90 % |

Plugin already serves `.webp` (`vite.repo-assets.ts` content-type + build copy).

---

## Rationale for DEFER (not SELECTIVE now)

1. **User policy:** No demonstrated slow loading; optional phase in playbook (`05-assets-2.0-migration.md` § Phase 4).
2. **Loading model mitigates size:** On-demand per scene, not bulk; idle game tolerates 2–5 MB scene entry on desktop/Wi‑Fi.
3. **Best WebP candidates are a small slice:** ~86 MB opaque biome backgrounds vs ~829 MB runtime total; savings ~40–50 MB estimated at q80 — meaningful but not blocking Phase 5.
4. **Alpha-heavy bulk (Myrions, companions, guides) is a poor WebP target** without visual QA; lossless WebP saves little vs PNG.
5. **Implementation cost:** `<picture>` or dual-path logic across biome/companion loaders + build pipeline — risk before 2.0 commit.
6. **Highest-impact WebP already done** where a pipeline existed (village, gacha opening/frames).

---

## If revisited later: SELECTIVE shortlist (approval required)

Only if perf testing (mobile 4G, DevTools Network) shows slow biome transitions or LCP issues.

| Priority | Files (exact) | Handling | Est. savings |
|----------|---------------|----------|-------------:|
| P1 | 9× `assets/Background/{biomeId}/capture-wide.png` | Opaque WebP q80–85, keep PNG fallback | ~17–22 MB |
| P2 | 9× `assets/Background/{biomeId}/capture-portrait.png` | Opaque WebP | ~5–7 MB |
| P3 | 9× `dressage-wide.png` + 9× `dressage-portrait.png` | Opaque WebP | ~15–20 MB |
| P4 | 8× `assets/Gacha/cinema/disagrea/{start,intermediate,reveal-*.}.png` | Opaque WebP (event-only) | ~8–10 MB |
| **Skip** | Myrion cutouts, companion affinite/cutouts, guide PNGs | Alpha — PNG or lossless only | Low ROI / QA risk |

**Do not convert without user approval** (asset modification rule).

---

## Phase status

| Phase | Status |
|-------|--------|
| 4 WebP | **Deferred** — no conversion; proceed to Phase 5 |
| 5 Commit prep | **Next** — archive residual `public/` mirrors, TNR, user sign-off |

---

## Validation

No code or asset changes. Scan regenerated 2026-06-25 via `_phase4-size-scan.mjs`.
