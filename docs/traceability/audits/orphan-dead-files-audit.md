# Audit orphan / dead / misplaced (2026-06-25)

Audit read-only — voir aussi `global-2.0-readiness-audit.md`.

**Archive exécutée 2026-06-25** — voir rapport ci-dessous.

---

## DELETE-candidate (→ `old_assets/` uniquement)

- ~~**~606 PNG** sous `public/assets/**/*.png`~~ ✅ **Done** — miroirs absents de `public/assets/` (READMEs redirect conservés). Source-of-truth : `assets/` via `vite.repo-assets.ts`.
- **`public/companions/`** — legacy mort ; ne reste que README ✅
- ~~**29 fichiers** dans `public/gacha/`~~ ✅ **Done** — seul `public/gacha/README.md` reste ; contenu servi depuis `assets/gacha/`
- ~~**Guides Talia/Étna** dans `public/assets/minigames/capture/companions/`~~ ✅ **Done** — Étna → `old_assets/Compagnons/etna/Autres/guide/` ; Talia déjà dans `assets/Compagnons/talia/Autres/guide/`
- **`old_assets/companions/*/cutouts/`** — archive v2 OK (legacy naming, conservé)

### Move counts (2026-06-25 execution)

| Catégorie | Count | Destination |
|-----------|-------|-------------|
| Compagnons guides (Étna) | 2 | `old_assets/Compagnons/etna/Autres/guide/` |
| public-references | 10 | `old_assets/public-references/` (5× `.txt` + 5× `.png`) |
| public/assets PNG mirrors | 0 on disk | Déjà retirés avant run ; READMEs conservés |
| public/gacha non-README | 0 on disk | Déjà retirés ; `assets/gacha/` = source |

Script audit : `scripts/archive-public-mirrors-to-old-assets.mjs` (`@deprecated`).

---

## ARCHIVE-md

- `docs/PROJECT_STATE.md`, `BUILD_ERRORS.md`, `CLEANUP_REPORT.md`, `WORKTREE_TRIAGE.md`, `TECHNICAL_STATE.md`
- `.ai/codex-report.md`, `cursor-outbox.md`, `cursor-heartbeat.md`, `cursor-inbox.md`, `*.json` état agents
- `REPO_SEPARATION.md` — structure repo obsolète

⏸ Non exécuté (user n'a pas dit « tout ça » pour docs).

---

## RELOCATE

- ~~`public/references/*.txt`~~ ✅ → `old_assets/public-references/`
- Casse mixte `assets/Gacha/` vs `assets/gacha/event/` — backlog
- `assets/event-disagrea/` — staging partiel non entièrement promu
- ~~Scripts one-shot obsolètes~~ ✅ marqués `@deprecated` : `copy-disagrea-hunt-guide.mjs`, `link-legacy-public-assets.mjs`, `organize-disagrea-catalog.mjs`, `composite-disagrea-portraits.mjs`, `chroma-cutout.mjs`

---

## NEEDS-MANIFEST

| Pipeline | Manifest |
|----------|----------|
| Cutout regen v3 | ✅ |
| Disagrea import + gacha cinéma | ✅ |
| Gacha opening générique | ❌ |
| Talia pack + guides | ❌ |
| Link corpus v2 | ⚠️ README seulement |
| Myrions import | ⚠️ partiel |
| plan-asset-moves / apply-asset-moves | ❌ référencés playbook 05, absents |

---

## Dead code

- `minigameAssets.ts` : exports `@deprecated` palmon* — non importés
- `HuntCapturePolicyPanel.tsx` alias non utilisé
- `validate-conversations.mjs`, `build-gacha-video.mjs` — hors package.json

---

## Top actions post-gameplay

1. ~~Archive miroirs `public/assets/`~~ ✅
2. Archiver docs stale → `staging/planning/archive/` (backlog)
3. Créer `staging/manifests/` ou playbook 07 pour pipelines sans manifest — voir `backlog-systematic-pipelines.md`
4. ~~Wire scripts orphelins~~ ✅ `@deprecated` (pas dans package.json)
