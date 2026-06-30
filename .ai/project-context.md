# IDLE Isekai Chill — Project Context (Havre des Brumes)

> **Stub actif** — release **2.1.0.0** livrée sur `main` · tag `v2.1.0.0` @ `8e50e13`  
> Contexte historique complet archivé : [`old_v2.1/ai_work/.ai/project-context.md`](../old_v2.1/ai_work/.ai/project-context.md)

## Product

**Havre des Brumes** — idle / incremental / collection : compagnons, Myrions, biomes, conversations de lien, mini-jeux, Ferme lunaire (15 biomes, 45 filons), progression locale.

**Ne pas utiliser** le nom « Wonderland » pour ce dépôt.

## Release 2.1 (livrée 2026-06-30)

| Élément | Valeur |
|---------|--------|
| Semver npm | `2.1.0` (`package.json`) |
| Tag Git | `v2.1.0.0` |
| HEAD release | `8e50e13` — docs: add final post-2.1 cleanup report |
| PR | [#3](https://github.com/Guillaume-Jolly/IDLE-Isekai-Chill/pull/3) — mergée |
| Label UI (fin 2.1) | `v2.1.0.128` — **désynchronisé du compteur git** ; harmonisation prévue au passage **2.2** |

### Contenu majeur 2.1

- Ferme lunaire : 15 biomes, 45 filons, supervision, prestige
- 19 compagnons, 190 conversations de lien (5 paliers affinité)
- Guidance « Que faire maintenant », hub clarifié, terminologie harmonisée
- Quarantaine non destructive : `old_v2.1/` (454 fichiers archivés, zéro suppression)

### Docs release

- [`docs/CHANGELOG_2_1.md`](../docs/CHANGELOG_2_1.md)
- [`docs/RELEASE_NOTES_2_1.md`](../docs/RELEASE_NOTES_2_1.md)
- [`docs/RELEASE_2_1_DELIVERY_REPORT.md`](../docs/RELEASE_2_1_DELIVERY_REPORT.md)
- [`docs/TNR_RELEASE_2_1_MVP20.md`](../docs/TNR_RELEASE_2_1_MVP20.md)
- Quarantaine : [`docs/CLEANUP_2_1_MOVE_MANIFEST.md`](../docs/CLEANUP_2_1_MOVE_MANIFEST.md)

## Phase suivante — 2.2

- Branche de travail : `feature/2.2` (à créer depuis `main`)
- Objectif : nettoyage global, corrections mineures transverses, retouches libres groupées
- **Pas** de nettoyage destructif intermédiaire obligatoire ; `old_v2.1/` intouchable
- Brief agent : [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](../docs/HANDOFF_2_2_AGENT_BRIEF.md)
- Log dev X/Y : [`docs/traceability/changelog/DEV_LOG_2_2.md`](../docs/traceability/changelog/DEV_LOG_2_2.md)

## Stack

React, TypeScript, Vite, sauvegarde locale, assets PNG/SVG.

## Validation (release / CI)

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline    # bonds + corpus + build + manifest assets
npm run build
```

`npm run lint` — ~33 problèmes préexistants, documentés, **non bloquant** release.

## Hard constraints (rappel)

- Pas de modification assets sans demande explicite.
- Pas de changement format save sans migration.
- Diffs petits et reviewables.
- Archivage uniquement (`old_v2.1/`, `old_assets/`) — **aucune suppression définitive**.

## Agent onboarding

1. `AGENTS.md`
2. `docs/agent-guide/README.md`
3. Ce fichier
4. `.ai/current-state.md`
5. `.ai/next-task.md` si présent
6. [`docs/traceability/project-state.md`](../docs/traceability/project-state.md)
