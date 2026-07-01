# Idle Isekai Chill

> **Agents & contributeurs** — lire en premier : [`docs/agent-guide/README.md`](docs/agent-guide/README.md)  
> (hiérarchie projet, playbooks, versionnement, checklists fichiers).

Prototype de jeu idle / collection cozy fantasy (mobile + PC). Univers et progression à découvrir **en jeu** — ce README cou surtout l’outillage dev et le serveur.

---

## Développement (hot-reload)

```bash
npm install
npm run dev
```

| | |
|---|---|
| **URL locale** | http://localhost:5173/ |
| **Réseau LAN** | `http://<IP-PC>:5173/` (même Wi‑Fi, pour test téléphone) |
| **Version UI** | Affichée en haut à gauche — politique : [`docs/agent-guide/05-politique-versionnement.md`](docs/agent-guide/05-politique-versionnement.md) |

Nouvelle session agent / gros chantier :

```bash
# X : hook Cursor (beforeSubmitPrompt) — backup manuel :
npm run version:prompt    # incrément X (nouveau prompt) ; opt-out user : « même X »
npm run version:task      # incrément Y (tâche distincte — pas le HMR)
npm run tnr:baseline      # bonds + corpus + build + manifest assets
```

Journal prompt → commits atomiques : [`docs/traceability/changelog/DEV_LOG_2_2.md`](docs/traceability/changelog/DEV_LOG_2_2.md)

---

## Build web

```bash
npm run build      # dist/ pour hébergement statique
npm run preview    # preview du build
```

---

## Documentation projet

| Public | Lien |
|--------|------|
| **Agents (prioritaire)** | [`docs/agent-guide/README.md`](docs/agent-guide/README.md) |
| **Index docs (éviter obsolète)** | [`docs/DOC_AGENT_INDEX.md`](docs/DOC_AGENT_INDEX.md) |
| **Traçabilité** (changelog, TNR, audits) | [`docs/traceability/README.md`](docs/traceability/README.md) · [`REFERENCES.md`](docs/traceability/REFERENCES.md) |
| **Playbooks** (compagnon, gacha, Myrions, TNR…) | [`staging/playbooks/README.md`](staging/playbooks/README.md) |
| **Règles agent** | [`AGENTS.md`](AGENTS.md) |
| **État courant** | [`docs/traceability/project-state.md`](docs/traceability/project-state.md) · `.ai/` (local, gitignoré) |
| **Phase 2.2** | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](docs/HANDOFF_2_2_AGENT_BRIEF.md) |
| **Serveur stable (prod locale)** | Hors dépôt public — dossier `deploy/` sur le PC hôte uniquement |
| **Design / TNR gameplay** | [`docs/`](docs/) (usage interne) |

Changelog micro-modifs (version UI) : [`docs/traceability/changelog/`](docs/traceability/changelog/).

---

## Assets 2.0 — livraison main (2026-06-25)

Baseline **Assets 2.0** : source-of-truth unique `assets/`, cold storage `old_assets/`, plus de miroirs PNG runtime sous `public/assets/`.

### Architecture runtime (`assets/`)

| Dossier | Rôle | ~Fichiers |
|---------|------|----------:|
| `Compagnons/{id}/` | affinite, cutouts, chibis, NSFW, guides | 280 |
| `Background/{biomeId}/` | capture + dressage + event Disagrea | 54 |
| `Myrions/{biomeId}/` | cutout / chibi / silhouette | 289 |
| `gacha/` | icônes, cinéma, events (`/gacha/`) | 48 |
| `Live2D/` | demo Cubism Haru + runtime JS (`/live2d/`) | 44 |

Servi via `vite.repo-assets.ts` — URLs `/assets/…`, `/gacha/…`, `/live2d/…` inchangées.  
Détail : [`assets/README.md`](assets/README.md)

### Cold storage (`old_assets/`)

Non servi en jeu. Même taxonomie top-level (5 dossiers), profondeur cible ≤ 4 pour l’actif.

| Lot | Action |
|-----|--------|
| Cutouts émotion legacy | 152 PNG → `Compagnons/{id}/cutouts-legacy/` |
| Snapshots event Disagrea | → `Compagnons/{id}/layered-legacy/` |
| Dedup vs `assets/` | 0 doublon actif restant |
| Dedup interne | 106 PNG chibi-sources archivés |
| Coquilles `Autres/` | supprimées, 193 dossiers vides nettoyés |

Détail : [`old_assets/README.md`](old_assets/README.md) · log : [`docs/traceability/assets/old-assets-cleanup-log.md`](docs/traceability/assets/old-assets-cleanup-log.md)

### Pipeline & données (hors runtime PNG)

| Ancien | Nouveau |
|--------|---------|
| `assets/Prompts/` | `scripts/references/` (texte/JSON) + PNG sources dans `old_assets/` |
| `assets/event-disagrea/` | `Compagnons/…/disagrea-integrated/`, `Background/disagrea-event/` |
| Miroirs `public/assets/`, `public/gacha/` | retirés — redirects README |
| Orphelins `public/village/` | `old_assets/Background/village-mirror/` |

Chemins scripts : `scripts/minigame-asset-paths.mjs` (`sourceMinigamePaths`, `pipelineReferencesRoot`).

### Code & traçabilité

- `eventDisagreaPack.ts` : `identityRef` → prod `assets/Compagnons/{id}/affinite/affinity-1.png`
- Manifest : `docs/traceability/assets/asset-manifest.json` (regénéré TNR)
- Baseline disque repo (~10,7 Go) : [`docs/traceability/assets/repo-disk-baseline.md`](docs/traceability/assets/repo-disk-baseline.md)
- Roadmap : [`docs/traceability/assets/PHASE0-assets-2.0.md`](docs/traceability/assets/PHASE0-assets-2.0.md)
- TNR : `npm run tnr:baseline` (build + validate:link-corpus + manifest)

### Scripts migration (réutilisables)

`sort-old-assets-five-folders.mjs` · `flatten-old-assets-architecture.mjs` · `promote-cutouts-legacy-flat.mjs` · `finalize-old-assets.mjs` · `scan-old-assets-duplicates.mjs` · `migrate-public-to-old-assets.mjs`

Playbooks : [`staging/playbooks/05-assets-2.0-migration.md`](staging/playbooks/05-assets-2.0-migration.md) · [`04-asset-promote-pipeline.md`](staging/playbooks/04-asset-promote-pipeline.md)

---

## Assets (contributeurs)

Source-of-truth : `assets/` (Compagnons, Background, Myrions, Gacha, Live2D).  
Runtime servi via `vite.repo-assets.ts` — ne pas réintroduire de doublons sous `public/assets/`.

Promote / archive : [`staging/playbooks/04-asset-promote-pipeline.md`](staging/playbooks/04-asset-promote-pipeline.md), [`08-directory-cleanup.md`](staging/playbooks/08-directory-cleanup.md).

---

## Phase 2.2 — en cours (2026-06-30)

| Élément | Valeur |
|---------|--------|
| Branche dev | `feature/2.2` |
| Semver | `2.2.0` |
| Label UI | `v2.2.0.02` (post-kickoff) |
| Brief | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](docs/HANDOFF_2_2_AGENT_BRIEF.md) |

## Release 2.1 — Havre des Brumes (livrée)

| Élément | Valeur |
|---------|--------|
| Semver | `2.1.0` |
| Tag Git | `v2.1.0.0` @ `8e50e13` |
| Branche prod | `main` @ `b91b6fb` |
| Label UI (fin dev 2.1) | `v2.1.0.128` — reset au kickoff 2.2 |

- Quarantaine : `old_v2.1/` (archive non destructive)

---

## Contenu original

Pas de copie depuis un jeu commercial. Personnages, Myrions et univers sont originaux.  
Contenu mature : paliers narratifs avec garde-fous (adultes, consentement, age gate) — détails en jeu.

---

## Stack

React 19 · TypeScript · Vite · sauvegarde locale · assets PNG/WebP.
