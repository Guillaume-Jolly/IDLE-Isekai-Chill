# 02 — Guide agent général

Updated: 2026-07-01

---

## Avant d'écrire une ligne

1. Lire [`AGENTS.md`](../../AGENTS.md)
2. Lire [`.ai/current-state.md`](../../.ai/current-state.md) et [`.ai/next-task.md`](../../.ai/next-task.md)
3. `git status --short` — comprendre l'état du working tree
4. **Nouvelle phase produit ?** → lire [`07-kickoff-nouvelle-version.md`](./07-kickoff-nouvelle-version.md) et **proposer le kickoff** si non fait (avant toute autre tâche)
5. Identifier si une **recette playbook** existe (`staging/playbooks/`)
6. **Nouveau prompt user** → X bump **automatique** (hook `.cursor/hooks.json`) ; backup : `npm run version:prompt` — opt-out user : `même X`
7. **Tâche distincte** dans le même prompt → `npm run version:task` (incrémente **Y**) — ligne Y dans [`DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)
8. **Fin de prompt** → compléter la section `⚠️ À COMPLÉTER` (titre, but, validations) ; voir commits atomiques dans [`05-politique-versionnement.md`](./05-politique-versionnement.md)

---

## Principes

| Principe | Application |
|----------|-------------|
| **Diff minimal** | Une intention par changement |
| **Pourquoi > quoi** | Commit et changelog expliquent l'intérêt |
| **Pas de delete asset** | `old_assets/` avec arborescence miroir |
| **Pas de push main** | Sans go explicite Guillaume |
| **Pas de supposition** | Si bloqué, demander — sauf user dit « n'attends pas » |
| **TNR** | `npm run build` minimum avant « terminé » |

---

## Validation standard

```bash
npm run build
npm run validate:companion-bonds   # si compagnons / bonds touchés
npm run validate:link-corpus       # si corpus / conversations touchés
npm run tnr:baseline               # release gate : bonds + corpus + build + manifest
npm run lint                       # ~33 erreurs préexistantes — ne pas introduire de nouvelles
```

Smoke visuel si assets ou minigames : voir `staging/playbooks/06-tnr-checklist.md`.

---

## Communication user (Guillaume)

- Réponses en **français** sauf demande contraire
- Proportionné — pas de mur de texte pour un fix trivial
- **Ne pas** proposer push main / force-push sans autorisation
- Signaler 404 images, régressions save, conflits docs

---

## Pipelines systématiques vs ponctuels

| Type | Où | Exemple |
|------|-----|---------|
| **Systématique (futur)** | `docs/traceability/audits/backlog-systematic-pipelines.md` | Nouveau compagnon end-to-end |
| **Recette existante** | `staging/playbooks/01–06` | Promote cutouts, gacha event |
| **Ponctuel** | [`03-projets-ponctuels.md`](./03-projets-ponctuels.md) | Import Disagrea one-shot |

**Ne pas** prétendre regénérer des heures de travail IA sans manifest + sources versionnées.

---

## Après chaque micro-modification

1. **Y** : `npm run version:task` si lot cohérent terminé — **pas** le HMR Vite (voir [`05-politique-versionnement.md`](./05-politique-versionnement.md))
2. Ajouter une ligne **Y** dans la section X ouverte de [`DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)
3. Ajouter une entrée dans [`docs/traceability/changelog/`](../traceability/changelog/) si modif significative (micro)
4. Si fin de session ou changement d'initiative : mettre à jour `.ai/current-state.md`

---

## Erreurs fréquentes agents

| Erreur | Conséquence |
|--------|-------------|
| Pointer `public/assets/` dans du code neuf | Doublons, dette |
| Copier ancre Etna pour tous cutouts | Identity drift (voir v3 per-companion) |
| Commit sans message « pourquoi » | Baseline illisible |
| Oublier docs/traceability/changelog | Perte traçabilité micro-modifs |
| Toucher `Input chatgpt/` | Violation règle user |

---

## Escalade

- **Build fail** → stop, fix, ne pas enchaîner lots migration
- **404 images** → vérifier `vite.repo-assets.ts` mapping avant patch URL
- **Conflit docs** → mettre à jour `.ai/current-state.md` comme source de vérité
