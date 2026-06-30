# Current state — post-release 2.1 quarantine

**Updated:** 2026-06-30 (MVP 21.2)

## Release

- Version : **2.1.0** (label build `v2.1.0.128`)
- HEAD cleanup : `d4bb3d0` + validation 21.2 en cours
- Branche : `feature/myrion-worksite-mvp2` (poussée, PR à créer manuellement)

## Quarantaine

WIP archivé dans `old_v2.1/` (454 fichiers) — voir `docs/CLEANUP_2_1_MOVE_MANIFEST.md`.

## Working tree

Après MVP 21.2 : stub `.ai/` restauré à la racine ; bruit CRLF sur src/scripts nettoyé si diff vide.

## Validations attendues

`validate:companion-bonds`, `validate:link-corpus`, `tnr:baseline`, `build` — doivent rester OK post-quarantaine.
