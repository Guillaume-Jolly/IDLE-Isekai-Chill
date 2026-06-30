# Index documentation — guide agent

**Updated:** 2026-06-30  
**But :** éviter qu’un agent suive une doc obsolète. Lire cet index **avant** d’explorer `docs/` au hasard.

---

## Source de vérité (toujours à jour en priorité)

| Priorité | Fichier | Contenu |
|----------|---------|---------|
| 1 | [`AGENTS.md`](../AGENTS.md) | Règles inviolables |
| 2 | [`.ai/current-state.md`](../.ai/current-state.md) | Initiative courante |
| 3 | [`.ai/project-context.md`](../.ai/project-context.md) | Produit, release, contraintes |
| 4 | [`docs/traceability/project-state.md`](./traceability/project-state.md) | État projet synthétique |
| 5 | [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md) | Phase 2.2 + prompt agent |
| 6 | [`docs/agent-guide/`](./agent-guide/) | Onboarding, versionnement, validation |
| 7 | [`.ai/next-task.md`](../.ai/next-task.md) | Prochaine tâche concrète |

**Branche prod actuelle :** `main` · tag **`v2.1.0.0`** @ `8e50e13`  
**Ne plus utiliser** `feature/myrion-worksite-mvp2` comme branche de travail (mergée).

---

## Release 2.1 — docs de référence (contenu valide, contexte figé)

| Fichier | Usage | Attention |
|---------|-------|-----------|
| [`CHANGELOG_2_1.md`](./CHANGELOG_2_1.md) | Contenu livré 2.1 | En-tête branche = historique |
| [`RELEASE_NOTES_2_1.md`](./RELEASE_NOTES_2_1.md) | Notes joueur / produit | OK |
| [`TNR_RELEASE_2_1_MVP20.md`](./TNR_RELEASE_2_1_MVP20.md) | Rapport TNR pré-release | § « prochaine étape » obsolète |
| [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md) | Archive `old_v2.1/` | OK — ne pas re-archiver |
| [`RELEASE_2_1_DELIVERY_REPORT.md`](./RELEASE_2_1_DELIVERY_REPORT.md) | Rapport livraison | §10–13 remplacés par §14 final |

---

## Documents historiques — ne pas suivre les « prochaines étapes »

Ces fichiers restent utiles pour **contexte** mais contiennent des instructions, métriques ou branches **périmées** :

| Fichier | Risque principal |
|---------|------------------|
| [`PROJECT_STATE.md`](./PROJECT_STATE.md) | Build « échoue », 8 erreurs TS |
| [`TECHNICAL_STATE.md`](./TECHNICAL_STATE.md) | `validate-conversations`, état juin 2026 |
| [`BUILD_ERRORS.md`](./BUILD_ERRORS.md) | Lint « 28 erreurs » (≈33 aujourd’hui) |
| [`WORKTREE_TRIAGE.md`](./WORKTREE_TRIAGE.md) | État worktree juin 2026 |
| [`TODO_PRIORITIZED.md`](./TODO_PRIORITIZED.md) | P0 build — **résolu** |
| `docs/CLEANUP_2_1_*.md` | Push / PR / commits non poussés — **fait** |
| `docs/MYRION_WORKSITE_MVP*.md` | Branche feature, versions 2.0.0.x |
| `docs/*_MVP*.md` (11–19) | Idem — chantier pré-merge |
| [`traceability/audits/global-2.0-readiness-audit.md`](./traceability/audits/global-2.0-readiness-audit.md) | Lint 8 erreurs, pré-2.1 |

**Règle :** si un doc cite `feature/myrion-worksite-mvp2`, « PR à créer », « commits non poussés » ou « build échoue » → **ignorer l’instruction**, vérifier `project-state.md`.

---

## Archive quarantaine

| Chemin | Contenu |
|--------|---------|
| `old_v2.1/` | WIP docs + `.ai` complet pré-2.1 — **lecture seule** sauf demande |
| `old_v2.1/docs_wip/` | Doublons docs MVP — **ne pas** traiter comme source active |
| `old_assets/` | Cold storage assets |

---

## Validation & versionnement (canonique)

```bash
npm run version:prompt      # X +1 (nouveau prompt)
npm run version:task          # Y +1 (tâche distincte)
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline
npm run build
```

- Politique : [`agent-guide/05-politique-versionnement.md`](./agent-guide/05-politique-versionnement.md)
- Pipeline : [`agent-guide/06-pipeline-validation.md`](./agent-guide/06-pipeline-validation.md)
- Log 2.2 : [`traceability/changelog/DEV_LOG_2_2.md`](./traceability/changelog/DEV_LOG_2_2.md)

**Lint :** ~33 issues préexistantes — non bloquant. **Ne pas** utiliser `validate-conversations.mjs` (legacy → `validate:link-corpus`).

---

## Nom produit

Utiliser **Havre des Brumes** / **IDLE Isekai Chill**.  
**Ne pas** utiliser « Wonderland » (nom obsolète). Les zip corpus `wonderland_*` sont des noms de fichiers historiques uniquement.
