# Legacy companions mirror removed (Assets 2.0 Phase 2 — lot legacy)

Runtime source-of-truth: `assets/Compagnons/{id}/`

Served at `/assets/companions/{id}/...` via unified Vite plugin (`vite.repo-assets.ts` → `repoAssetsPlugin`).

Legacy mirror `public/companions/` was identical to `public/assets/companions/` (same inode on Windows). Content now lives under `assets/Compagnons/`; git deletions here are expected.

Do not re-add files here — update `assets/Compagnons/` instead.
