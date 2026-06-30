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
npm run version:prompt    # incrément X (nouveau prompt)
npm run version:task      # incrément Y (tâche distincte)
npm run tnr:baseline      # bonds + corpus + build + manifest assets
```

---

## Serveur stable & launcher (prod locale)

Build **figé**, séparé du dev Vite — pour jouer comme en prod (HTTPS, auth, accès mobile / 4G).

| | |
|---|---|
| **Lancement rapide** | Double-clic `Launch Stable Server.cmd` ou `npm run launcher:stable` |
| **Tableau de bord** | http://127.0.0.1:8789/ (surveillance, dev + stable) |
| **Jeu stable (défaut)** | https://127.0.0.1:8787/ (port `STABLE_PORT` dans `.env.stable.local`) |
| **Build prod** | `npm run build:stable:prod` — **volontaire**, après validation |
| **Doc complète** | [`deploy/stable/README.md`](deploy/stable/README.md) |

Premier lancement : copie auto de `deploy/stable/env.example` → `.env.stable.local` — **changer `STABLE_AUTH_PASS`**.  
Certificat TLS auto-signé : `npm run trust:stable` (PC) ; mobile → voir doc stable § certificat.

Playbook release : [`staging/playbooks/07-release-prod-stable.md`](staging/playbooks/07-release-prod-stable.md).

---

## Build web classique

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
| **État courant** | [`.ai/current-state.md`](.ai/current-state.md) · [`docs/traceability/project-state.md`](docs/traceability/project-state.md) |
| **Phase 2.2** | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](docs/HANDOFF_2_2_AGENT_BRIEF.md) |
| **Serveur stable** | [`deploy/stable/README.md`](deploy/stable/README.md) |
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

## Release 2.1 — Havre des Brumes (2026-06-30)

| Élément | Valeur |
|---------|--------|
| Semver | `2.1.0` |
| Tag Git | `v2.1.0.0` @ `8e50e13` |
| Branche | `main` |
| Label UI (fin dev 2.1) | `v2.1.0.128` — harmonisation prévue en 2.2 |

- Changelog : [`docs/CHANGELOG_2_1.md`](docs/CHANGELOG_2_1.md)
- Notes : [`docs/RELEASE_NOTES_2_1.md`](docs/RELEASE_NOTES_2_1.md)
- Quarantaine : `old_v2.1/` (archive non destructive)
- Prochaine phase : **2.2** — [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](docs/HANDOFF_2_2_AGENT_BRIEF.md)

---

## Contenu original

Pas de copie depuis un jeu commercial. Personnages, Myrions et univers sont originaux.  
Contenu mature : paliers narratifs avec garde-fous (adultes, consentement, age gate) — détails en jeu.

---

## Stack

React 19 · TypeScript · Vite · sauvegarde locale · assets PNG/WebP.
