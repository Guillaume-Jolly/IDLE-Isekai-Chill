# Event Disagrea — portraits intégrés validés

Scènes **100 % originales** (personnage + décor peints ensemble).  
Liste complète : `VALIDATED_MANIFEST.json` (**20 fichiers**, 4 compagnons × affinité 1–5).

## Chemins

```text
assets/Compagnons/<id>/Autres/disagrea-integrated/
  companion-<id>-affinity-01-scene-originale-v1.png
  companion-<id>-affinity-02-flirt-proche-scene-originale-v1.png
  …
  companion-<id>-affinity-05-peak-bond-scene-originale-v1.png
```

## Non versionné (old_assets)

Cutouts, composites, catalogue, refs Disgaea, anciennes intégrées collage →  
`old_assets/event-disagrea/` (voir `old_assets/README.md`).

## Notes

- **Pleinair** : voir backlog [`docs/BACKLOG.md`](../../docs/BACKLOG.md) — § Event Disagrea / Pleinair (L2–5 à repenser).
- **Etna NSFW** (`affinity-04-nsfw`) : scène **lit batch5-v5** validée (`…-batch5-v5-v4-final-tweak.png`), pas le peak-plus L6 générique.
- **Tests Etna L5 lit** : `staging/companion-visual-pack/disagrea/etna/tests/` (source canonique batch5-v5).

Regénérer l’archive : `node scripts/organize-disagrea-validated.mjs`


Manifest canonique : `docs/traceability/assets/disagrea-integrated/VALIDATED_MANIFEST.json`
