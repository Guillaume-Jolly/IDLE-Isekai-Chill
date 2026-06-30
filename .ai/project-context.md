# IDLE Isekai Chill — Project Context (Havre des Brumes)

> **Stub actif** — release **2.1.0** · branche `feature/myrion-worksite-mvp2`  
> Contexte historique complet archivé : [`old_v2.1/ai_work/.ai/project-context.md`](../old_v2.1/ai_work/.ai/project-context.md)

## Product

**Havre des Brumes** — idle / incremental / collection : compagnons, Myrions, biomes, conversations de lien, mini-jeux, Ferme lunaire (15 biomes, 45 filons), progression locale.

**Ne pas utiliser** le nom « Wonderland » pour ce dépôt.

## Stack

React, TypeScript, Vite, sauvegarde locale, assets PNG/SVG.

## Validation (release 2.1)

```bash
npm run build
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
```

## Docs release

- [`docs/CHANGELOG_2_1.md`](../docs/CHANGELOG_2_1.md)
- [`docs/RELEASE_NOTES_2_1.md`](../docs/RELEASE_NOTES_2_1.md)
- [`docs/TNR_RELEASE_2_1_MVP20.md`](../docs/TNR_RELEASE_2_1_MVP20.md)
- Quarantaine post-release : [`docs/CLEANUP_2_1_MOVE_MANIFEST.md`](../docs/CLEANUP_2_1_MOVE_MANIFEST.md)

## Hard constraints (rappel)

- Pas de modification assets sans demande explicite.
- Pas de changement format save sans migration.
- Diffs petits et reviewables.
- Archivage uniquement (`old_v2.1/`) — **aucune suppression définitive**.

## Agent onboarding

1. `AGENTS.md`
2. `docs/agent-guide/README.md`
3. Ce fichier
4. `.ai/current-state.md` si présent
5. `.ai/next-task.md` si présent
