# Playbooks — IDLE Isekai Chill

Point d'entrée pour **tout agent** (Cursor ou humain) qui travaille sur le projet.

**Règle d'or :** lire ce README + `00-project-onboarding.md` avant toute action.

---

## Index

| # | Fichier | Quand l'utiliser |
|---|---------|------------------|
| 00 | [00-project-onboarding.md](./00-project-onboarding.md) | Contexte, architecture, règles, TNR |
| 01 | [01-new-companion.md](./01-new-companion.md) | Ajouter un compagnon village ou event |
| 02 | [02-gacha-event.md](./02-gacha-event.md) | Nouvel event gacha (bannière, cinéma, rates) |
| 03 | [03-emotion-cutouts-and-nsfw.md](./03-emotion-cutouts-and-nsfw.md) | Cutouts émotion v3/v4, NSFW affinité |
| 04 | [04-asset-promote-pipeline.md](./04-asset-promote-pipeline.md) | Staging → runtime, chroma, archive |
| 05 | [05-assets-2.0-migration.md](./05-assets-2.0-migration.md) | Réorganisation dossiers (phase 2+) |
| 06 | [06-tnr-checklist.md](./06-tnr-checklist.md) | Tests non-régression entre étapes |

---

## Arborescence cible (Assets 2.0)

```
assets/                    # source-of-truth (cible single-root)
  Compagnons/{id}/
    affinite/
    cutouts/
    chibis/
    NSFW/
    Autres/{batch-name}/
  Background/{biomeId}/
  Myrions/{biomeId}/
  Gacha/
  UI/
  References/
  Prompts/
old_assets/                # archivé, jamais supprimer
staging/                   # WIP — ne pas supprimer
Input chatgpt/             # drops temporaires user — ne pas toucher
```

**État actuel (transition) :** runtime encore sous `public/assets/`, sources sous `assets/` et `staging/`. Voir phase 2 migration.

---

## Fichiers de référence projet

| Fichier | Rôle |
|---------|------|
| `AGENTS.md` | Règles agent + validation |
| `.ai/project-context.md` | Contexte produit |
| `.ai/current-state.md` | État courant initiative |
| `staging/planning/asset-manifest.json` | Inventaire images phase 0 |
| `staging/planning/PHASE0-assets-2.0.md` | Roadmap cleanup |
| `staging/companion-visual-pack/CUTOUT_STYLE.md` | DA cutouts verrouillée |

---

## Interlocuteur

**Guillaume (user)** — seul décideur. Pas de coordination Codex.

Backup avant gros changements : branche **`origin/Backup`** (écrasable).
