# Playbooks — IDLE Isekai Chill

Point d'entrée pour **tout agent** (Cursor ou humain).

**Règle d'or :** `docs/agent-guide/README.md` + ce README + `00-project-onboarding.md`.

---

## Index

| # | Fichier | Quand l'utiliser |
|---|---------|------------------|
| 00 | [00-project-onboarding.md](./00-project-onboarding.md) | Contexte, architecture, TNR |
| 01 | [01-new-companion.md](./01-new-companion.md) | Nouveau compagnon (+ chibis, cutouts) |
| 02 | [02-gacha-event.md](./02-gacha-event.md) | Event gacha (bannière, **rates**, cinéma) |
| 03 | [03-emotion-cutouts-and-nsfw.md](./03-emotion-cutouts-and-nsfw.md) | Cutouts émotion, NSFW affinité |
| 04 | [04-asset-promote-pipeline.md](./04-asset-promote-pipeline.md) | Staging → runtime, chroma, archive |
| 05 | [05-assets-2.0-migration.md](./05-assets-2.0-migration.md) | Migration dossiers (phases 2–3 ✅) |
| 06 | [06-tnr-checklist.md](./06-tnr-checklist.md) | TNR auto + rapport |
| 07 | [07-release-prod-stable.md](./07-release-prod-stable.md) | Build prod, launcher, TLS |
| 08 | [08-directory-cleanup.md](./08-directory-cleanup.md) | Archive old_assets, nettoyage dirs |
| 09 | [09-biome-visual-only.md](./09-biome-visual-only.md) | Fonds biome/enclos seuls + **formulaire intake** |
| 10 | [10-visual-qa-tnr.md](./10-visual-qa-tnr.md) | **Checks visuels normalisés** (C/A/B/P/G/S) |
| 11 | [11-new-myrion-biome.md](./11-new-myrion-biome.md) | Biome + espèces + **catalogue regen** |

---

## Commandes utiles

```bash
npm run tnr:baseline      # build + validate + manifest
# X : hook Cursor auto ; backup :
npm run version:prompt    # nouveau prompt (opt-out : « même X »)
npm run version:task      # tâche distincte (Y — pas HMR)
```

DEV_LOG + commits atomiques : [`docs/traceability/changelog/DEV_LOG_2_2.md`](../../docs/traceability/changelog/DEV_LOG_2_2.md)

---

## Arborescence assets

```
assets/Compagnons/ Background/ Myrions/ Gacha/
old_assets/    # miroir — playbook 08
staging/       # WIP
Input chatgpt/ # gitignore
```

Runtime : `vite.repo-assets.ts`.

---

## Backlog pipelines (futur)

`docs/traceability/audits/backlog-systematic-pipelines.md` — bâtiment idle, loot balance, tuto 0–10h **reportés**.

---

## Interlocuteur

**Guillaume** — seul décideur. Pas de push `main` sans go.
