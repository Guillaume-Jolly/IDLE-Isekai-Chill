# Cleanup 2.2 — Résidus projets terminés

**Dernière passe :** 2026-06-30 (passe 2)  
**Archive `old_v2.1/`** : locale, **gitignorée** — moves agent uniquement ; purge manuelle user (local ou autre DD). Non versionnée sur `main` / `origin`.

---

## Passe 1 — 49 `git mv` (MVP 22.1)

Voir sections historiques ci-dessous ; détail inchangé pour `docs_wip/docs-finished-2.1/`, `staging_residual/` (stubs), `scripts_legacy/` (6 Disagrea), `triage/`, `legacy/`.

---

## Passe 2 — ~207 `git mv` (2026-06-30)

### `docs/` → archive release & worksite

| Destination | Fichiers |
|-------------|----------|
| `old_v2.1/docs_release_2.1/` | `CHANGELOG_2_1`, `RELEASE_NOTES_2_1`, `RELEASE_2_1_DELIVERY_REPORT`, `TNR_RELEASE_2_1_MVP20` |
| `old_v2.1/docs_wip/docs-refs-worksite/` | `MYRION_WORKSITE_BALANCE`, `MYRION_WORKSITE_ASSET_PIPELINE`, `MYRION_WORKSITE_BIOME_CATALOG_MVP13` |

### `docs/traceability/` → `old_v2.1/traceability_archive/`

| Sous-dossier | Contenu |
|--------------|---------|
| `tnr/` | Rapports TNR phase2/phase3 (2026-06-25) |
| `audits/` | `global-2.0-readiness`, `orphan-dead-files`, `phase4-webp-assessment` |
| `assets/` | `PHASE0-assets-2.0`, logs cleanup, `repo-disk-baseline`, `asset-taxonomy-proposal`, `asset-move-mapping.json` |

**Conservé actif :** `project-state.md`, `changelog/`, `audits/backlog-systematic-pipelines.md`, `assets/disagrea-integrated/`, `asset-manifest.json` (régénéré par TNR).

### `staging/` → archive WIP terminé

| Destination | Contenu |
|-------------|----------|
| `old_v2.1/staging_residual/playbooks-05-assets-2.0-migration.md` | Playbook migration Assets 2.0 (terminée) |
| `old_v2.1/staging/manifests/myrion-worksite-mvp15.json` | Manifeste MVP15 worksite |
| `old_v2.1/staging_wip/skinline-premium/` | Backlog NSFW skinline (PNG trackés) |
| `old_v2.1/staging_wip/companion-visual-pack/` | Pipeline visuel compagnons (terminé) |
| `old_v2.1/staging_wip/myrion-worksite-mvp15/` | BG/spots générés MVP15 |

**Conservé actif :** `staging/playbooks/` (01–04, 06, 08–11) — playbooks opérationnels futurs.

### `scripts/` → `old_v2.1/scripts_legacy/`

Scripts one-shot **retirés de `package.json`** :

- Assets 2.0 : `migrate-public-to-old-assets.mjs`, `finalize-old-assets.mjs`, `phase4-size-scan.mjs`, etc. (12+)
- Worksite : `mvp9-install-worksite-assets.py`, `mvp15-install-worksite-assets.py`, `worksite-remove-white-bg.py`
- Visual pack : `promote-companion-visual-pack.mjs`
- Codex : `ack-codex-inbox.ps1`, `codex-heartbeat.ps1`, `watch-codex-coordination.ps1`, …
- Friend pack : `Jouer-IDLE-Isekai-Chill.bat`, `play-idle-isekai-chill.ps1`, `build-friend-pack.ps1`
- Staging helpers : `scripts/staging/*` → `scripts_legacy/staging-scripts/`
- Launcher vendor : `scripts/vendor/webview2/` → `scripts_legacy/vendor/webview2/`

**Non versionnés (déjà gitignorés, restent sur disque si présents) :** `dev-server-manager.mjs`, `build-launcher-gui-host.mjs`, scripts stable/launcher PROD.

---

## `docs/` actif après passe 2 (racine)

`DOC_AGENT_INDEX`, `HANDOFF_2_2_AGENT_BRIEF`, `CLEANUP_2_1_MOVE_MANIFEST`, `CLEANUP_2_2_RESIDUAL_MANIFEST`, `BACKLOG`, `GAME_DESIGN_CURRENT`, `DUNGEON_EXPLORATION_BACKLOG`, `EXPLOITATION_PASSIVE_BACKLOG`.

---

## Non déplacé (volontaire)

| Zone | Raison |
|------|--------|
| `deploy/` | PROD locale — gitignoré |
| `old_assets/`, `assets/` | Source of truth jeu |
| `src/` | Code gameplay actif |
| `staging/playbooks/07-release-prod-stable.md` | Référence locale PROD (gitignoré si non tracké) |

---

## Passe 3 — hooks Cursor legacy (2026-07-01)

**Destination :** `old_2_2/cursor-hooks-legacy/` (gitignoré — convention `old_{A}_{B}/`)

| Fichier | Raison |
|---------|--------|
| `bump-version-on-prompt.mjs` | Remplacé par `A.B.C.X.Y - X update - prompt indent.mjs` |
| `bump-version-on-task-if-changed.mjs` | Remplacé par hook Y nommé |
| `version-x-nouveau-prompt.mjs` | Doublon intermédiaire |
| `version-y-fin-tache-si-modif.mjs` | Doublon intermédiaire |

**Actifs :** `.cursor/hooks.json` → hooks `A.B.C.X.Y - X/Y update - …`
