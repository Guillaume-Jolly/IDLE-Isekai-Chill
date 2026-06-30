# 04 — Fichiers à tenir à jour (par commit / session)

Updated: 2026-06-30

Chaque **commit** ou **fin de session significative** doit laisser le repo lisible pour le prochain agent.

**Changement de chemin doc ?** → mettre à jour [`docs/traceability/REFERENCES.md`](../traceability/REFERENCES.md) puis grep l’ancien path.

---

## Obligatoire — chaque commit

| Fichier | Quoi mettre à jour | Pourquoi |
|---------|-------------------|----------|
| **Message commit** | 1–2 phrases : **intérêt** de la modif, pas liste de fichiers | Historique git exploitable |
| [`docs/traceability/changelog/`](../traceability/changelog/) | Entrée ou lignes pour **chaque micro-modif** significative | Traçabilité version UI |
| [`build-revision.json`](../../build-revision.json) | `version:prompt` (X) / `version:task` (Y) / HMR | Numéro haut-gauche |
| [`docs/traceability/changelog/DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md) | Section par prompt X, lignes Y | Résumé phase 2.2 |

---

## Obligatoire — si changement d'initiative ou de phase

| Fichier | Contenu |
|---------|---------|
| [`.ai/current-state.md`](../../.ai/current-state.md) | Phase active, décisions, prochaine étape |
| [`.ai/next-task.md`](../../.ai/next-task.md) | Tâche concrète suivante |

---

## Obligatoire — si assets déplacés / archivés

| Fichier | Action |
|---------|--------|
| [`docs/traceability/assets/asset-manifest.json`](../traceability/assets/asset-manifest.json) | `node scripts/inventory-assets-manifest.mjs` |
| [`docs/traceability/assets/asset-move-mapping.json`](../traceability/assets/asset-move-mapping.json) | Si lot migration |

---

## Obligatoire — si push `main` ou baseline majeure (avec go user)

| Fichier | Action |
|---------|--------|
| [`package.json`](../../package.json) `version` | Bump selon [`05-politique-versionnement.md`](./05-politique-versionnement.md) |
| [`docs/traceability/changelog/VERSION-INDEX.md`](../traceability/changelog/VERSION-INDEX.md) | Ligne récap par version |
| Playbook / PHASE0 | Cocher phases terminées |

---

## Recommandé — TNR documenté

| Fichier | Quand |
|---------|-------|
| `docs/traceability/tnr/tnr-YYYY-MM-DD-*.md` | Après lot migration ou pre-commit baseline |

---

## À mettre à jour si obsolète (P1)

| Fichier | Problème connu |
|---------|----------------|
| `staging/playbooks/05-assets-2.0-migration.md` | Phases 2–3 done |
| `docs/traceability/assets/PHASE0-assets-2.0.md` | Idem |
| `staging/companion-visual-pack/CUTOUT_STYLE.md` | Encore ancre Etna v2 — conflit v3 |
| `docs/PROJECT_STATE.md` (archivé → `old_v2.1/docs_wip/docs-finished-2.1/`) | Stale — ne pas maintenir |

---

## Ne pas committer

- `public/build-info.json` (gitignore — généré)
- Secrets et stack PROD : `deploy/` (gitignore — local PC hôte)
- `Input chatgpt/` (gitignore)
- PNG staging non validés (`staging/companion-visual-pack/**/*.png`)

---

## Template message commit

```
<type>(<scope>): <intérêt utilisateur en une phrase>

Ex. chore(assets): archive miroirs public/assets vers old_assets pour baseline V2 propre

Pourquoi : éviter 189 Mo doublons et clarifier source-of-truth assets/.
TNR : build OK, validate:link-corpus OK.
Version UI : v1.0.1.43.544
```

Types : `feat`, `fix`, `chore`, `refactor`, `docs` — alignés usage habituel repo.
