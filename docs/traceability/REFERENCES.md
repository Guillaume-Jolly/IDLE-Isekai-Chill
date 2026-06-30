# Références croisées — traçabilité

**À mettre à jour quand un chemin change** : modifier ce fichier + grep le repo pour l’ancien path.

Dernière sync : 2026-06-30 (release 2.1.0.0, index agent)

**Index anti-obsolète :** [`../../docs/DOC_AGENT_INDEX.md`](../../docs/DOC_AGENT_INDEX.md)

---

## Anciens chemins (redirects)

| Ancien | Nouveau |
|--------|---------|
| `staging/changelog-detailed/` | `docs/traceability/changelog/` |
| `staging/agent-guide/` | `docs/agent-guide/` |
| `staging/planning/global-2.0-readiness-audit.md` | `old_v2.1/traceability_archive/audits/global-2.0-readiness-audit.md` |
| `staging/planning/orphan-dead-files-audit.md` | `old_v2.1/traceability_archive/audits/orphan-dead-files-audit.md` |
| `staging/planning/backlog-systematic-pipelines.md` | `docs/traceability/audits/backlog-systematic-pipelines.md` |
| `staging/planning/phase4-webp-assessment.md` | `old_v2.1/traceability_archive/audits/phase4-webp-assessment.md` |
| `staging/planning/tnr-*.md` | `old_v2.1/traceability_archive/tnr/tnr-*.md` |
| `staging/planning/PHASE0-assets-2.0.md` | `old_v2.1/traceability_archive/assets/PHASE0-assets-2.0.md` |
| `staging/planning/asset-manifest.json` | `docs/traceability/assets/asset-manifest.json` |
| `staging/planning/asset-move-mapping.json` | `old_v2.1/traceability_archive/assets/asset-move-mapping.json` |
| `staging/planning/asset-taxonomy-proposal.md` | `old_v2.1/traceability_archive/assets/asset-taxonomy-proposal.md` |
| `assets/link-corpus-import/` | `scripts/references/link-corpus/` |
| `assets/myrions-import/` | `old_assets/prompts-archive/imports/myrions-import/` |
| `assets/talia-import/` | `old_assets/prompts-archive/imports/talia-import/` |
| `assets/minigames/*/sources/` | `old_assets/prompts-archive/minigames/` |
| `assets/integrated-portraits/` | `scripts/references/integrated-portraits/` |
| `assets/village-layout/` | `scripts/references/village-layout/` |
| `assets/Prompts/` | `scripts/references/` + `old_assets/prompts-archive/` |
| `assets/UI/`, `assets/References/` | supprimés |
| `assets/event-disagrea/integrated/companions/` | `assets/Compagnons/{id}/Autres/disagrea-integrated/` |
| `assets/event-disagrea/integrated/VALIDATED_MANIFEST.json` | `docs/traceability/assets/disagrea-integrated/VALIDATED_MANIFEST.json` |
| `assets/Compagnons/Autres/disagrea-integrated/` (meta seul) | `docs/traceability/assets/disagrea-integrated/` |
| `assets/event-disagrea/backgrounds/` | `assets/Background/disagrea-event/` |
| `assets/event-disagrea/generated/` | `old_assets/prompts-archive/disagrea/generated/` |
| `assets/gacha-frames/` | `assets/Gacha/sources/frames/` |
| `assets/gacha/` (lowercase) | `assets/Gacha/` (Windows : même inode, vite.repo-assets.ts) |
| `public/assets/**` (mirrors PNG) | `assets/` (runtime) ; archives → `old_assets/` |
| `public/gacha/**` | `assets/Gacha/` (runtime) ; archives → `old_assets/Gacha/` |
| `public/village/` (orphelins) | `old_assets/public-mirror/village/` |
| `public/references/` | `old_assets/public-references/` |
| `staging/planning/_phase4-size-scan.mjs` | `old_v2.1/scripts_legacy/phase4-size-scan.mjs` |
| `scripts/migrate-public-to-old-assets.mjs` | `old_v2.1/scripts_legacy/migrate-public-to-old-assets.mjs` |
| `staging/skinline-premium/` | `old_v2.1/staging_wip/skinline-premium/` |
| `staging/companion-visual-pack/` | `old_v2.1/staging_wip/companion-visual-pack/` |

Stubs redirect (archivés MVP 22.1) : voir `old_v2.1/staging_residual/` — sources actives : `docs/agent-guide/`, `docs/traceability/changelog/`.

---

## Par dossier — qui référence quoi

### `docs/traceability/changelog/`

| Référencé par |
|---------------|
| `AGENTS.md` |
| `README.md` (racine) |
| `docs/agent-guide/README.md`, `02`, `04`, `05` |
| `staging/playbooks/06`, `07`, `08`, `10` |
| `docs/traceability/README.md` |

Fichiers : `README.md`, `VERSION-INDEX.md`, `entries/YYYY-MM-DD.md`

### `docs/traceability/tnr/`

| Référencé par |
|---------------|
| `.ai/current-state.md` |
| `docs/agent-guide/04-fichiers-par-commit.md` |
| `staging/playbooks/06`, `10` |
| `docs/traceability/changelog/README.md` |
| `docs/traceability/assets/PHASE0-assets-2.0.md` |

### `docs/traceability/audits/`

| Fichier | Référencé par |
|---------|---------------|
| `global-2.0-readiness-audit.md` | `.ai/current-state.md`, `.ai/next-task.md` |
| `orphan-dead-files-audit.md` | `docs/agent-guide/03`, `staging/playbooks/08`, `audits/backlog-systematic-pipelines.md` |
| `backlog-systematic-pipelines.md` | `docs/agent-guide/02`, `staging/playbooks/README.md`, `.ai/next-task.md` |
| `phase4-webp-assessment.md` | `.ai/current-state.md`, `.ai/next-task.md` |

### `docs/traceability/assets/`

| Fichier | Référencé par |
|---------|---------------|
| `asset-manifest.json` | `scripts/inventory-assets-manifest.mjs`, playbooks `04`, `05`, `08`, `npm run tnr:baseline` |
| `asset-move-mapping.json` | `docs/agent-guide/04`, playbook `05` |
| `PHASE0-assets-2.0.md` | playbook `05` |
| `asset-taxonomy-proposal.md` | playbook `05`, `.ai/cursor-outbox.md` (optionnel) |
| `assets-cleanup-log.md` | changelog 2026-06-25, playbook `05`, `08` |
| `old-assets-cleanup-log.md` | `scripts/migrate-public-to-old-assets.mjs`, `old_assets/README.md` |
| `phase4-size-scan*.json` | `audits/phase4-webp-assessment.md` |

### `old_assets/`

Cold storage — **non servi au runtime**. Voir `old_assets/README.md`.

| Sous-dossier | Source | Script |
|--------------|--------|--------|
| `Compagnons/{id}/affinite\|cutouts\|chibis\|NSFW\|Autres/` | `public/assets/companions/` | `npm run migrate:public-to-old-assets` |
| `Background/{biomeId}/` | `public/assets/minigames/*/biomes\|enclosures/` | idem |
| `Myrions/{biomeId}/cutout\|chibi\|silhouette/` | `public/assets/minigames/*/myrions/` | idem |
| `Gacha/` | `public/gacha/` | idem |
| `public-mirror/` | chemins `public/` non mappés (village orphelins, etc.) | `archive-public-orphans-to-old-assets.mjs` |
| `public-references/` | `public/references/` (legacy txts) | `archive-public-mirrors-to-old-assets.mjs` |
| `{dated-snapshots}/` | imports ponctuels (ex. `gacha-event-disagrea-source-2026-06-25`) | manuel |

Dedup : si bytes identiques dans `assets/` → ne pas copier ; `public/` mirror peut être `git rm`. Log : `docs/traceability/assets/old-assets-cleanup-log.md`.

Legacy pré-migration : `old_assets/companions/`, `companion-chibis-replaced/`, etc. — à trier plus tard.

### `docs/agent-guide/`

| Référencé par |
|---------------|
| `README.md` (racine), `AGENTS.md` |
| `staging/playbooks/README.md`, `00`, `07` |
| `docs/traceability/README.md`, `changelog/README.md` |
| `docs/traceability/audits/backlog-systematic-pipelines.md` |

---

## WIP resté dans `staging/planning/`

| Fichier | Référencé par |
|---------|---------------|
| `conversation-v2-fix-backlog.md` | `.ai/cursor-inbox.md` (historique Codex), `staging/reviews/` |

---

## Commande grep utile

```bash
rg "staging/changelog-detailed|staging/agent-guide|staging/planning/(global|orphan|backlog|phase4|tnr-|PHASE0|asset-)" --glob "*.{md,mjs,json,ts,tsx}"
```
