# Next task — kickoff 2.2

**Phase :** préparation branche `feature/2.2` depuis `main` tagué `v2.1.0.0`.

## Actions immédiates (agent 2.2)

1. Lire `docs/HANDOFF_2_2_AGENT_BRIEF.md` (brief complet + prompt ChatGPT)
2. Créer `feature/2.2` depuis `main` si absente
3. Bump `package.json` → `2.2.0` (jalon semver — **avec go Guillaume**)
4. Harmoniser `build-revision.json` : `revision: 1`, `subRevision: 0` (reset compteur UI)
5. `npm run version:prompt` au premier prompt de travail → X=2 si reset fait à 1
6. Tenir `docs/traceability/changelog/DEV_LOG_2_2.md` à jour (résumé par X et Y)

## Périmètre 2.2

- Nettoyage global docs/code (sans suppression définitive)
- Petites corrections mineures transverses
- Guillaume peut toucher à tout — diffs reviewables, 1 commit par X (prompt) avec message « pourquoi »
- **Interdit** sans demande : assets, format save, suppressions, lint global massif

## Validation avant merge 2.2 (future)

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
```

Contexte archivé pré-2.1 : `old_v2.1/ai_work/.ai/next-task.md`
