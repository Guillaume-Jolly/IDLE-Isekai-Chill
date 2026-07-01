# Changelog détaillé — micro-modifications

Trace **ultra-détaillée** : une entrée par micro-modification significative, liée au numéro UI exact.

**Format version :** `v{semver}.{X}` ou `v{semver}.{X}.{Y}` — voir [`../../docs/agent-guide/05-politique-versionnement.md`](../../docs/agent-guide/05-politique-versionnement.md)

**Log phase 2.2 (résumé + commits atomiques) :** [`DEV_LOG_2_2.md`](./DEV_LOG_2_2.md)

- Sections `⚠️` injectées par hook / `version:prompt`
- **1 ligne Y** dans DEV_LOG ≈ **1 commit atomique** possible en relisant le journal

---

## Comment ajouter une entrée

1. Noter la version affichée en haut à gauche du jeu (ou `public/build-info.json` en dev)
2. Créer ou append dans `entries/YYYY-MM-DD.md` (un fichier par jour)
3. Mettre à jour [`VERSION-INDEX.md`](./VERSION-INDEX.md) — une ligne récap par version **jalon** ou fin de session
4. Ajouter une **ligne Y** dans [`DEV_LOG_2_2.md`](./DEV_LOG_2_2.md) si lot reviewable / commit atomique

### Template entrée

```markdown
### v2.2.0.05.1 — HH:MM
- **Intérêt :** (pourquoi — bénéfice user / prod / maintenance)
- **Scope :** code | assets | docs | scripts
- **Fichiers :** liste courte
- **TNR :** build OK / N/A
- **Risque :** aucun | smoke visuel X
```

---

## Règles

- **Intérêt obligatoire** — pas seulement « modifié App.tsx »
- Regrouper les typos triviales en une entrée si même MICRO
- Les migrations massives : 1 entrée **sommaire** + renvoi TNR doc (`docs/traceability/tnr/`)
- Ne pas dupliquer le message git commit — commit = lot ; changelog = micro
- **DEV_LOG** = vue prompt/tâche ; **entries/** = vue micro-fichier

---

## Structure

```
docs/traceability/changelog/
  README.md           ← ce fichier
  DEV_LOG_2_2.md      ← résumé X/Y + guide commits atomiques
  VERSION-INDEX.md    ← table des matières par version
  entries/
    YYYY-MM-DD.md     ← entrées du jour
```

---

## Historique antérieur

Les sessions avant 2026-06-25 ne sont pas rétro-documentées micro-par-micro.  
Jalons connus : voir `docs/traceability/tnr/` et commits git.

Index croisé (qui référence ce dossier) : [`../REFERENCES.md`](../REFERENCES.md)
