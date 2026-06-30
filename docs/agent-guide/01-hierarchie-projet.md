# 01 — Hiérarchie projet

Updated: 2026-06-30

---

## Vue d'ensemble

```
IDLE Isekai Chill/
├── src/                    # Code React/TS — runtime gameplay
├── assets/                 # Source-of-truth visuels (Assets 2.0)
├── public/                 # Shell statique + redirects (minimal)
├── old_assets/             # Archive — JAMAIS supprimer, tri miroir assets/
├── old_v2.1/               # Quarantaine post-release 2.1 — JAMAIS supprimer
├── staging/                # WIP playbooks + reviews
├── docs/agent-guide/       # Onboarding agents (commit)
├── docs/traceability/      # Changelog, TNR, audits, manifests (commit)
├── Input chatgpt/          # Drops user — gitignore
├── scripts/                # Import, promote, validate
├── .ai/                    # État agent (current-state, next-task)
├── deploy/stable/          # Build prod locale + launcher
└── vite.repo-assets.ts     # Pont assets/ → URLs runtime
```

---

## Hiérarchie décisionnelle (docs)

| Priorité | Fichier | Rôle |
|----------|---------|------|
| 1 | `AGENTS.md` | Règles inviolables |
| 2 | `.ai/current-state.md` | Initiative active + phases |
| 3 | `.ai/next-task.md` | Prochaine tâche concrète |
| 4 | `docs/agent-guide/` | Onboarding + versionnement |
| 5 | `staging/playbooks/` | Recettes 00–11 |
| 6 | `docs/traceability/` | Changelog, TNR, audits, manifests assets |
| 7 | `docs/` | Design, TNR gameplay, backlog produit |

**En cas de conflit** entre docs : `AGENTS.md` > `.ai/current-state.md` > playbooks > docs/ stale.

---

## Assets — arborescence cible

```
assets/
  Compagnons/{id}/affinite|cutouts|chibis|NSFW|Autres/{batch}/
  Background/{biomeId}/          # capture-wide, dressage-wide, etc.
  Myrions/{biomeId}/cutout|chibi|silhouette/
  Gacha/
  UI/
  References/
  Prompts/
```

**Runtime URLs** inchangées — servies par `vite.repo-assets.ts` depuis `assets/`.

**Archive** : même arborescence sous `old_assets/` pour retrouver les miroirs.

---

## Code — zones sensibles

| Zone | Risque si mal modifié |
|------|------------------------|
| `src/data/linkCorpusV2.json` | ~40 Mo, 7500 conv. — perf boot |
| `src/App.tsx` | Shell UI — régression globale |
| `src/data/companionAssets.ts` | 404 portraits |
| `src/components/minigames/` + `Minigames.css` | Chasse, dressage, liens |
| `vite.config.ts` + `vite.repo-assets.ts` | 404 silencieux images |
| `build-revision.json` | Numéro version UI |

---

## Environnements sacrés (ne pas modifier sans instruction)

| Dossier | Statut |
|---------|--------|
| `staging/` | WIP — ajouter OK, ne pas vider |
| `Input chatgpt/` | Drops user — gitignore, ne pas toucher |
| `old_assets/` | Archive — move-in only |
| `deploy/stable/secrets` | Local prod — jamais commit |

---

## Branches git

| Branche | Usage |
|---------|--------|
| `main` | Prod — push **uniquement** avec go user |
| `origin/Backup` | Snapshot sécurité — force push autorisé user |
| `feature/*` | Travail courant |

---

## Flux typique agent

```
Lire AGENTS.md + .ai/current-state.md
  → playbook si recette connue
  → modifier src/ ou assets/ ou scripts/
  → TNR (build, lint, validate:link-corpus)
  → entrée docs/traceability/changelog (micro-modif)
  → mettre à jour .ai/ si changement d'initiative
  → commit message = POURQUOI (pas seulement quoi)
```
