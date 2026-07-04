# Dev log — phase 2.2 (résumé X / Y)

Journal **haut niveau** : une section par prompt (**X**), une ligne par tâche distincte (**Y**).

- **Politique :** [`docs/agent-guide/05-politique-versionnement.md`](../../agent-guide/05-politique-versionnement.md)
- **Kickoff :** [`docs/agent-guide/07-kickoff-nouvelle-version.md`](../../agent-guide/07-kickoff-nouvelle-version.md)
- **Détail micro :** [`entries/`](./entries/) (optionnel pour gros lots)
- **Index jalon :** [`VERSION-INDEX.md`](./VERSION-INDEX.md)

## Convention

| Champ | Signification | Commande |
|-------|---------------|----------|
| **X** | Numéro prompt (`build-revision.json` → `revision`) | Hook Cursor ou `npm run version:prompt` (opt-out : `même X`) |
| **Y** | Sous-incrément tâche (`subRevision`) | `npm run version:task` après chaque tâche (**pas HMR**) |
| **Label UI** | `v2.2.0.{X}` ou `v2.2.0.{X}.{Y}` | Affiché en haut à gauche |

**Commit :** 1 commit par **Y** (atomique, en relisant ce fichier) ou 1 récap par **X** ; message = résumé Y ou but du prompt.

## ⚠️ Sections ouvertes (X non finalisés)

> Injecté par `npm run version:prompt` / hook Cursor (`.cursor/hooks.json`). **Compléter en fin de prompt** : titre, but, lignes Y, validations — puis déplacer vers Historique si terminé.
>
> **Artefacts hook :** une série de X sans prompt métier (ex. X=6…52 ci-dessous) = increments automatiques pendant une session infra — **ne pas compléter rétroactivement**.

### X=5 — 2026-07-01 — Sync docs versionnement (hook, DEV_LOG, commits atomiques)

**But du prompt :** Relire et mettre à jour toute la doc qui référence X/Y, hook, DEV_LOG et commits atomiques.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.05` |
| 1 | Màj agent-guide, HANDOFF, DOC_AGENT_INDEX, project-state, README, DEV_LOG | *(non commité)* | `v2.2.0.05.1` |

**Validations :** relecture grep docs  
**Risques :** hook Cursor à valider côté IDE

### X=6 … X=52 — Artefacts hook automatiques (2026-07-01)

**Nature :** increments **X** seuls (hook `beforeSubmitPrompt` / `npm run version:prompt`) pendant la session infra REFERENCE + stack A.B.C.X.Y — **sans prompt métier distinct par X**.

**Action agent :** ne pas compléter rétroactivement titre, but, validations. Seul **X=5** (sync docs versionnement) a un contenu réel dans cette plage.

**Labels UI :** `v2.2.0.06` … `v2.2.0.52` — compteur uniquement.

---

### X=53 — 2026-07-01 — Wording onboarding + relecture corpus Lien

**But du prompt :** Harmoniser tutorial/quêtes avec le hub ; lancer relecture corpus (Lyra lot 1) ; clarifier backlog / DEV_LOG.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 1 | Wording `tutorialObjectives`, `infiniteQuests`, project-state | *(non commité)* | |
| 2 | Script audit tone + README relecture corpus Lyra | *(non commité)* | |
| 3 | DEV_LOG — note artefacts hook X=6…52 | *(non commité)* | |

**Validations :** `npm run build`  
**Risques :** corpus Lien — corrections par petits lots uniquement

### X=54 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.54` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=55 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.55` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=56 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.56` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=57 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.57` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=58 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.58` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=59 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.59` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=60 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.60` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=61 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.61` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=62 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.62` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=63 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.63` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=64 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.64` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=65 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.65` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=66 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.66` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=67 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.67` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=68 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.68` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=69 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.69` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=70 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.70` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=71 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.71` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=72 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.72` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=73 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.73` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=74 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.74` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=75 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.75` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=76 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.76` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=77 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.77` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=78 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.78` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=79 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.79` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=80 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.80` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=81 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.81` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=82 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.82` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=83 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.83` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=84 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.84` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=85 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.85` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=86 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.86` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=87 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.87` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=88 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.88` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=89 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.89` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=90 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.90` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=91 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.91` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=92 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.92` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=93 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.93` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=94 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.94` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=95 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.95` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=96 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.96` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=97 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.97` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=98 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.98` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=99 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.99` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=100 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.100` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=101 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.101` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=102 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.102` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=103 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.103` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=104 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.104` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=105 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.105` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=106 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.106` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=107 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.107` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=108 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.108` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=109 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.109` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=110 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.110` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=111 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.111` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=112 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.112` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=113 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.113` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=114 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.114` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=115 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.115` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=116 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.116` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=117 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.117` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=118 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.118` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=119 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.119` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=120 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.120` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=121 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.121` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=122 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.122` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=123 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.123` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=124 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.124` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=125 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.125` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=126 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.126` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=127 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.127` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=128 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.128` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=129 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.129` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=130 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.130` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=131 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.131` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=132 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.132` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=133 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.133` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=134 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.134` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=135 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.135` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=136 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.136` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=137 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.137` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=138 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.138` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=139 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.139` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=140 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.140` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=141 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.141` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=142 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.142` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=143 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.143` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=144 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.144` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=145 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.145` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=146 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.146` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=147 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.147` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=148 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.148` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=149 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.149` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=150 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.150` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=151 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.151` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=152 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.152` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=153 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.153` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=154 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.154` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=155 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.155` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=156 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.156` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=157 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.157` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=158 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.158` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=159 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.159` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=160 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.160` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=161 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.161` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=162 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.162` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=163 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.163` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=164 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.164` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=165 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.165` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=166 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.166` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=167 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.167` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=168 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.168` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=169 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.169` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=170 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.170` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=171 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.171` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=172 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.172` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=173 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.173` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=174 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.174` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=175 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.175` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=176 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.176` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=177 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.177` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=178 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.178` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=179 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.179` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=180 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.180` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=181 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.181` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=182 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.182` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=183 — 2026-07-03 — Handoff piste B Parler curé aff. 5

**But du prompt :** Documenter et synchroniser la piste B (handoff agent, stubs `.ai/`, index docs, README lots corpus) — suite relecture packs + WALK-FINALE.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.183` |
| 1 | HANDOFF_PARLER_CURATED_PISTE_B, README lots, DOC_AGENT_INDEX, `.ai/*` | *(non commité)* | `v2.2.0.183.1` |

**Validations :** `npm run walk:pack:aff5:all` — 10/10 OK  
**Risques :** in-game non testé — Phase C modop obligatoire avant « validé »

### X=184 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.184` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=185 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.185` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=186 — 2026-07-03 — Validateurs avancés Parler aff. 5 (S50–S55, FM*, LQ6)

**But du prompt :** Implémenter 5 règles déterministes ROI (miroir FMC, spectateur CI, métier pack-5, similarité réactions, unification WALK-SPACE) + corrections corpus détectées.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.186` |
| 1 | curated-parler-advanced-rules, validate-fmc-mirror, S50–S55/LQ6/FM*, builder fixes pack-3/5/FMC | *(non commité)* | `v2.2.0.186.1` |
| 2 | Corpus FM1 ex. 01/04/05/08/10 FMC, S53 ex. 14 atlas — goldens H+F | *(non commité)* | `v2.2.0.186.2` |
| 3 | FM3 warn 0,85 · S53 ex. 20–21 · S56 tous curés · walk CI 5×4 tons aff.5 | *(non commité)* | `v2.2.0.186.3` |
| 4 | Politique produit : FM1/FM3 retirés · S56/S57/S58 · WALK-LOW · corpus prolepse | *(non commité)* | `v2.2.0.186.4` |

**Validations :** `validate:curated-parler:aff5:both` OK · walk 20/20 H+F · unit 9/9  
**Risques :** WALK-LOW actif seulement si `intimateFinaleLow` existe ; aff. 4 héritera auto via `corpusHasIntimateFinales`

### X=187 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.187` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=189 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.189` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=190 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.190` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=191 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.191` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=192 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.192` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=193 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.193` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=194 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.194` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=195 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.195` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=196 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.196` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=197 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.197` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=198 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.198` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=199 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.199` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=200 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.200` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=201 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.201` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=202 — 2026-07-03 — CO nouveau mini-jeu — spec Roue du Destin

**But du prompt :** Lecture `HANDOFF_NEW_MINIGAME_CO.md` + confirmation spec avant implémentation.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.202` |

**Validations :** spec validée par message user suivant (seed JSON Disagrea)  
**Risques :** aucun (pas de code)

### X=203 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.203` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=204 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.204` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=205 — 2026-07-03 — Mini-jeu Roue du Destin (Disagrea seed JSON)

**But du prompt :** Intégrer un générateur de fiche tactical absurde data-driven à partir de `disgaea_destiny_wheel_enriched_v0_2.json` — moteur de poids/branches, UI hub, save historique.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.205` |
| 1 | Moteur `src/data/destinyWheel/*` + `DestinyWheelGame` + activité hub `disagrea-destiny-wheel` + `validate:destiny-wheel` | *(non commité)* | `v2.2.0.205.1` |
| 2 | Roue SVG proportionnelle (poids moteur) + animation spin + cutouts Laharl/Etna/Flonne + bulles commentateurs | *(non commité)* | `v2.2.0.207.1` |

**Validations :** `npm run build` OK · `npm run validate:destiny-wheel` OK (100 runs, 25–30 roues/run)  
**Risques :** chunk JS +320 kB (JSON seed embarqué) · smoke in-game hub à faire · PNG hub/stage non ajoutés (fallback CSS)

### X=207 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.207` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=208 — 2026-07-02 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.208` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=209 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.209` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=210 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.210` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=211 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.211` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=212 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.212` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=213 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.213` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=214 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.214` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=215 — 2026-07-03 — Roue du Destin : panneaux Repère / Probabilités / Debug

**But du prompt :** Historique de tirage dans Repère (récent en haut), supprimer ascenseurs inutiles Probabilités et Debug, Debug réservé au dev.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.215` |
| 1 | `spinHistory` + liste Repère ; table probas sans scroll ; debug dev sans max-height | *(non commité)* | `v2.2.0.215.1` |

**Validations :** `npm run build` OK  
**Risques :** ascenseur historique Repère seulement si beaucoup de roues dans une run

### X=216 — 2026-07-03 — Roue : libellés lisibles + animation rareté à l'arrêt

**But du prompt :** Corriger chevauchement des noms sur la roue ; animation d'atterrissage selon rareté (légendaire, mythique, etc.).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.216` |
| 1 | Placement libellés anti-collision + tiers anim `landed-*` sur slice/anneau/repère | *(non commité)* | `v2.2.0.216.1` |

**Validations :** `npm run build` OK  
**Risques :** petites parts masquent parfois le libellé (Repère / Probabilités restent la référence)

### X=217 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.217` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=218 — 2026-07-03 — SFX roue : knife flick synchronisé aux cases

**But du prompt :** Remplacer le spin audio par le MP3 knife flick ; un clic par case franchie, y compris au ralentissement, calé sur le mouvement réel.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.218` |
| 1 | `wheel-segment-tick.mp3` + `countSegmentBoundaryCrossings` + ticks rAF (plus timer/boucle) | *(non commité)* | `v2.2.0.218.1` |

**Validations :** `npm run build` OK  
**Risques :** volume vitesse à ajuster après test in-game

### X=219 — 2026-07-03 — Roue : libellés bord + flick + vitesse spin

**But du prompt :** Texte plus gros ancré au bord (pad droite/radial), lancer la roue au flick, modes Lent/Normal/Rapide avec décélération roulette.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.219` |
| 1 | `textAnchor=end` bord extérieur ; `onFlickSpin` ; `SPIN_PACE_CONFIG` + easing long | *(non commité)* | `v2.2.0.219.1` |

**Validations :** `npm run build` OK  
**Risques :** noms très longs sur micro-parts encore masqués ; seuil flick à affiner

### X=220 — 2026-07-03 — Fusion onglets Repère + Roue

**But du prompt :** Un seul onglet Roue : bouton tourner, case en cours, historique scrollable en dessous.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.220` |
| 1 | `WheelMenuPanel` — supprime drawer Repère ; badge/pin sur Roue | *(non commité)* | `v2.2.0.220.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun

### X=221 — 2026-07-03 — SFX roue : clic court synchro case

**But du prompt :** Corriger décalage et trainée audio — micro-clic exact à chaque case, silence dès l'arrêt.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.221` |
| 1 | `wheel-segment-tick.ogg` 55 ms + Web Audio + stop immédiat ; retire spin-stop | *(non commité)* | `v2.2.0.221.1` |

**Validations :** `npm run build` OK  
**Risques :** bursts rapides = plusieurs micro-clics simultanés (acceptable vs 500 ms MP3)

### X=222 — 2026-07-03 — Libellés roue : plus au centre + retours ligne

**But du prompt :** Déplacer le texte vers le centre de la roue ; multi-lignes sur les petites parts.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.222` |
| 1 | Ancre ~58–72 % rayon ; jusqu'à 3 lignes si part étroite ; moins d'ellipses | *(non commité)* | `v2.2.0.222.1` |

**Validations :** `npm run build` OK  
**Risques :** micro-parts très denses peuvent encore masquer un libellé

### X=223 — 2026-07-03 — Flick faible + option free spin (debug)

**But du prompt :** Feedback si lancement détecté mais flic trop faible ; toggle debug free spin pour glisser sans tirer.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.223` |
| 1 | Message « flic plus fort » ; `debugFreeSpin` coché par défaut en dev | *(non commité)* | `v2.2.0.223.1` |

**Validations :** `npm run build` OK  
**Risques :** seuils vitesse/angle à affiner après test

### X=224 — 2026-07-03 — Roue : sens de rotation inversé

**But du prompt :** Faire tourner la roue dans l'autre sens (spin auto + glisser).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.224` |
| 1 | `rotationForSegmentMidAngle` anti-horaire ; drag `-delta` | *(non commité)* | `v2.2.0.224.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun

### X=225 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.225` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=226 — 2026-07-03 — Roue du Destin : compagnons dans le cadre

**But du prompt :** Laharl / Etna / Flonne visibles dans la scène ; Laharl ne doit plus passer sous les onglets du rail.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.226` |
| 1 | Grille scène 3 colonnes ; rail overlay ; roue dimensionnée au conteneur ; inset rail/panneau | *(non commité)* | `v2.2.0.226.1` |

**Validations :** `npm run build` OK  
**Risques :** panneau latéral ouvert réduit encore la colonne gauche sur petits écrans desktop

### X=227 — 2026-07-03 — Roue : anti-chevauchement libellés définitif

**But du prompt :** Éliminer définitivement le chevauchement des noms sur la roue.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.227` |
| 1 | `wheelLabelPlanner.ts` boîtes polaires + `validate:wheel-labels` | *(non commité)* | `v2.2.0.227.1` |

**Validations :** `npm run build` OK · `npm run validate:wheel-labels` OK (12 roues, 0 overlap)  
**Risques :** petites parts sans libellé — détail dans Repère / Probabilités

### X=228 — 2026-07-03 — Roue : sens du drag aligné au geste

**But du prompt :** Le spin auto est anti-horaire mais le glisser-déposer tournait à l'envers — aligner l'interaction sur le doigt.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.228` |
| 1 | Drag `rotation + delta` (au lieu de `- delta`) | *(non commité)* | `v2.2.0.228.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun — spin auto inchangé (`rotationForSegmentMidAngle`)

### X=229 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.229` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=230 — 2026-07-03 — Roue : refonte libellés + compagnons / punchline

**But du prompt :** Compagnons plus grands et punchline lisible ; reprendre entièrement l'affichage texte roue (fini les patches anti-collision).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.230` |
| 1 | `wheelLabelPlanner` tangent 1 ligne / part ; `DestinyWheelPunchline` ; cutouts agrandis | *(non commité)* | `v2.2.0.230.1` |

**Validations :** `npm run build` OK · `npm run validate:wheel-labels` OK  
**Risques :** petites parts sans libellé sur la roue (Repère / survol / Probabilités)

### X=231 — 2026-07-03 — Roue du Destin : packs SFX tick + révélation rareté

**But du prompt :** Intégrer `spinning_wheel_tick_pack.zip` et `rarity_reveal_sfx_pack_v2_layered.zip` dans `assets/minigames/destiny-wheel/`.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.231` |
| 1 | WAV canoniques + `destinyWheelAudio` tick clean + reveal par rareté | *(non commité)* | `v2.2.0.231.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke audio navigateur (WAV ~30–130 Ko par reveal)

### X=232 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.232` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=233 — 2026-07-03 — Roue : case en cours hors menu + animations rareté v1

**But du prompt :** Afficher « Case en cours » en haut-gauche de la scène ; historique reste dans le menu ; intégrer pack animations révélation rareté.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.233` |
| 1 | `WheelCurrentCase` overlay ; `DestinyWheelRarityReveal` pack v1 ; menu = historique seul | *(non commité)* | `v2.2.0.233.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke overlay révélation + position case selon taille panneau ouvert

### X=234 — 2026-07-03 — Tics segment : signalement désync + volume faible

**But du prompt :** Les clics par case ne correspondent pas visuellement au repère ; volume trop bas.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.234` |

**Validations :** diagnostic (atan2 ±180°, stepping 0.3°, gain 0.16–0.5)  
**Risques :** correctif reporté X=235

### X=235 — 2026-07-03 — Tics segment : sync repère + audio renforcé

**But du prompt :** Corriger la synchro visuelle des ticks (1 clic = 1 case) et rendre les clics audibles.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.235` |
| 1 | `unwrapRotationContinuity` rAF spin ; crossings analytiques frontières ; tick-sharp + gain + stagger | *(non commité)* | `v2.2.0.235.1` |

**Validations :** `npm run build` OK ; sanity node 8 segments (90°→2, 360°→8)  
**Risques :** smoke audio in-game (volume interface utilisateur)

### X=236 — 2026-07-03 — Tick segment : pack propre (clean), pas sharp ni vidéo

**But du prompt :** Utiliser les clics du `spinning_wheel_tick_pack.zip`, pas l’ancien son sale (extrait vidéo / variante sharp).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.236` |
| 1 | `wheel-segment-tick.wav` (clean pack) ; lecture complète du sample ; retire sharp | *(non commité)* | `v2.2.0.236.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke audio — vérifier que le clean est bien audible en spin

### X=237 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.237` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=238 — 2026-07-03 — Scène roue : cutouts, bulles, case + anim rareté

**But du prompt :** Compagnons plus grands ; bulle de réplique à côté du speaker ; case en cours haut-gauche ; animation rareté sur cette bulle.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.238` |
| 1 | Cutouts centrés/agrandis ; `dw-commentator-bubble` ; case `absolute` top-left ; `rarity-reveal--inline` | *(non commité)* | `v2.2.0.238.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke mobile étroit (bulle + cutout côte à côte)

### X=239 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.239` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=240 — 2026-07-03 — Debug : départ roue + résultat forcé

**But du prompt :** Onglet debug DEV — forcer la roue de départ et forcer un segment au prochain tirage.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.240` |
| 1 | `debugFastForwardToWheel` + `planWheelSpin({ forcedItemId })` + UI selects debug | *(non commité)* | `v2.2.0.240.1` |

**Validations :** `npm run build` OK  
**Risques :** chemins conditionnels — déblocage auto `unlockedWheels` si roue cible inaccessible

### X=241 — 2026-07-03 — Cutouts fixes : Laharl / Etna / Flonne + roue agrandie

**But du prompt :** Taille proportionnelle constante (pas de saut à la parole) ; Laharl bas-gauche, Etna haut-droite, Flonne bas-droite ; roue ne doit pas rétrécir.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.241` |
| 1 | Overlay absolu 3 slots ; breathe/talk sans scale ; roue `92vmin` max 720px | *(non commité)* | `v2.2.0.241.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke overlap Etna/Flonne écrans très bas ; bulles mobile au-dessus du cutout

### X=242 — 2026-07-03 — Ticks spin : mix plus grave à haute vitesse

**But du prompt :** Ticks trop aigus en spin rapide — rendre le son plus grave et agréable.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.242` |
| 1 | `tick-soft` + playbackRate inversé (vite→grave) + lowpass dynamique | *(non commité)* | `v2.2.0.242.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke spin lent vs rapide — ajuster courbes si encore trop clair

### X=243 — 2026-07-03 — Zone safe scène : menu ouvert + cutouts non clippés

**But du prompt :** Case en cours et compagnons coupés sur les bords ; adapter layout menu déplié / replié et taille écran.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.243` |
| 1 | `dw-scene-safe` + `--menu-open` ; inset rail exact ; cqw/cqh roue & cutouts | *(non commité)* | `v2.2.0.243.1` |

**Validations :** `npm run build` OK  
**Risques :** smoke menu ouvert/fermé + mobile étroit

### X=244 — 2026-07-03 — Ticks début de spin : warmup + soft/clean tiered

**But du prompt :** Début de rotation trop strident — adoucir comme les roues casino (fade-in, sample lent).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.244` |
| 1 | `spinWarmup` 900ms ; soft<0.38 / clean mid ; lowpass+highshelf ; attack gain | *(non commité)* | `v2.2.0.244.1` |

**Validations :** `npm run build` OK  
**Risques :** ticks trop discrets en tout début — ajuster `SPIN_WARMUP_MS` / floor volume

### X=245 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.245` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=246 — 2026-07-03 — Layout roue : safe gauche + bulles couloir

**But du prompt :** Laharl/case sous menu ; bulles sur la roue → couloir Etna/Flonne, Laharl au-dessus.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.246` |
| 1 | `--dw-rail-panel-w` 36vw + `data-menu-open` ; bulles lane ; case décalée | *(non commité)* | `v2.2.0.246.1` |

**Validations :** `npm run build` OK  
**Risques :** drawer mobile 96vw — scène très étroite ; ajuster `--dw-rail-panel-w` si décalage résiduel

### X=247 — 2026-07-03 — Ticks spin : volume rétabli + resume AudioContext

**But du prompt :** Plus aucun son pendant la rotation — le mix anti-strident était devenu inaudible.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.247` |
| 1 | Volume min 0.28 / warmup 52% ; EQ adoucie ; `await resumeAudio` par tick | *(non commité)* | `v2.2.0.247.1` |

**Validations :** `npm run build` OK  
**Risques :** début de spin peut regagner un peu d’aigu si trop fort — resserrer EQ sans baisser le gain

### X=248 — 2026-07-03 — Debug : jump roue direct + appliquer résultat

**But du prompt :** Départ forcé sans simuler la run ; bouton « Appliquer le résultat » instantané.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.248` |
| 1 | `debugJumpToWheelDirect` + `handleDebugApplyForcedResult` + snap roue | *(non commité)* | `v2.2.0.248.1` |

**Validations :** `npm run build` OK · `validate:destiny-wheel` OK  
**Risques :** stats incohérentes en fin de run debug (voulu) ; segment hors pool éligible → winIndex approximatif

### X=249 — 2026-07-03 — Retrait animations atterrissage pré-pack zip

**But du prompt :** Supprimer les anciennes anim CSS roue (pulse/flash/shake) — le pack `DestinyWheelRarityReveal` suffit.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.249` |
| 1 | Retire `landed-*` keyframes + tiers spinner ; garde highlight slice statique | *(non commité)* | `v2.2.0.249.1` |

**Validations :** `npm run build` OK  
**Risques :** révélation rareté uniquement sur bulle case (plus de flash sur la roue elle-même)

### X=250 — 2026-07-03 — Bulles dialogue : moins de lignes

**But du prompt :** Répliques sur le moins de lignes possible (Laharl a la place).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.250` |
| 1 | Retire sauts forcés ; `width:max-content` ; bulles Laharl/lane élargies | *(non commité)* | `v2.2.0.250.1` |

**Validations :** `npm run build` OK  
**Risques :** très longues répliques peuvent dépasser sur petit écran — plafond `max-width` conservé

### X=251 — 2026-07-03 — Debug menu : clics boutons rétablis

**But du prompt :** Boutons debug non cliquables (overlay scène + disabled pendant Continuer).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.251` |
| 1 | `pointer-events` scène pass-through ; rail z50 ; debug actif si Continuer | *(non commité)* | `v2.2.0.251.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun — wheel garde les clics via `.dw-wheel-stack > *`
**Risques :** ⚠️ _…_

### X=252 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.252` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=253 — 2026-07-03 — Roue Havre : pack par défaut + sélecteur univers

**But du prompt :** Intégrer `havre_isekai_wheel_seed_v1_complete.json` dans le mini-jeu Roue du Destin existant ; Havre par défaut ; choix Havre/Disgaea dans le menu Roue.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.253` |
| 1 | Seed Havre + adaptateur + registre packs ; sélecteur UI ; verdict tiré ; fiche Havre ; validate 2 packs | *(non commité)* | `v2.2.0.253.1` |

**Validations :** `npm run build` OK · `npm run validate:destiny-wheel` OK (havre 29–32 roues/run · disgaea 25–30)  
**Risques :** modes Hardcore/Auto-Roll/Artiste, jokers, archives 100 cartes et layout fiche zip — hors scope ; commentateurs Havre réutilisent portraits Disgaea (slots Laharl/Etna/Flonne)

### X=254 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.254` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=255 — 2026-07-03 — Havre : modes, jokers, archives, fiche layout

**But du prompt :** Compléter la roulette Havre — modes Hardcore / Auto-Roll / Artiste, jokers (Artiste), archives 100 cartes/mode, fiche finale via layout pack.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.255` |
| 1 | Module `havreIsekaiWheel` (modes, jokers, cardBuilder, archiveStore, FicheDestinView) ; assets fiche ; intégration UI + save | *(non commité)* | `v2.2.0.255.1` |

**Validations :** `npm run build` OK · `npm run validate:destiny-wheel` OK  
**Risques :** jokers avancés (chaos_amp, double_or_mist, etc.) = relance/verrou MVP seulement ; rename carte via UI pas encore exposé (favori/verrou oui) ; tests 1000 runs/mode non scriptés (100 runs moteur OK)

### X=256 — 2026-07-03 — Sélecteur roues + physique taquets / suspense

**But du prompt :** Rendre le choix Havre/Disgaea visible ; simuler une vraie roue (taquets, flèche qui tape, suspense en fin de rotation).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.256` |
| 1 | Switch Havre/Disgaea en haut de la scène + tiroir Options ⚙ | *(non commité)* | `v2.2.0.256.1` |
| 2 | Physique roue : taquets sur le bord, repère à cliquet, phase suspense (tease case suivante puis retour) | *(non commité)* | `v2.2.0.256.2` |

**Validations :** `npm run build` OK  
**Risques :** suspense très court sur segments étroits ; kick visuel sans son si vitesse très faible en fin de creep

### X=257 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.257` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=258 — 2026-07-03 — Fix plantage physique roue (suspense)

**But du prompt :** La roue plantait après le spin — corriger le calcul des cibles suspense et sécuriser les ticks taquets.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.258` |
| 1 | `buildSuspenseLandingPlan` ancré sur la même révolution ; garde-fou boucle crossings ; throttle kick repère ; fallback `transitionend` | *(non commité)* | `v2.2.0.258.1` |

**Validations :** `npm run build` OK · sanity plan suspense (deltas < 30°)  
**Risques :** un seul tick audio/frame si plusieurs taquets franchis d’un coup (fast spin)

### X=259 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.259` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=260 — 2026-07-03 — Atterrissage taquet + flèche + thème Disgaea

**But du prompt :** Supprimer le saut artificiel en fin de spin ; rebond uniquement sur taquet ; éloigner la flèche ; skin gothique Disgaea (pack disgaea seulement).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.260` |
| 1 | Peg bounce conditionnel (~40 %) ; retrait snap `landed` ; repère plus haut ; `visualTheme=disgaea` (crimson/or, ornements SVG) | *(non commité)* | `v2.2.0.260.1` |

**Validations :** `npm run build` OK  
**Risques :** peg bounce aléatoire — fréquence ajustable si trop rare/fréquent

### X=261 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.261` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=262 — 2026-07-03 — Repère frôle taquets + déflexion continue

**But du prompt :** Rapprocher la flèche pour qu’elle frôle à peine les taquets ; languette qui se déporte au contact (physique continue).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.262` |
| 1 | Alignement tip ↔ bord taquets (CSS calc viewBox) ; `pegProximityAtRotation` + `flapDeflectionDeg` ; retrait animation kick par key | *(non commité)* | `v2.2.0.262.1` |

**Validations :** `npm run build` OK  
**Risques :** déflexion peut sembler faible à très haute vitesse — ajuster `grazeHalfWidth` / gain si besoin

### X=263 — 2026-07-03 — Fix plantage « Continuer » (roue suivante)

**But du prompt :** Le mini-jeu plantait au clic Continuer entre deux roues.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.263` |
| 1 | Ignore ticks si Δrotation > 100° (reset) ; session spin invalidée au reset ; abort suspense async ; ordre handleContinue sécurisé | *(non commité)* | `v2.2.0.263.1` |

**Validations :** `npm run build` OK · simu reset −2160→0 = 181 crossings bloqués  
**Risques :** aucun identifié — comportement spin inchangé (Δ frame < 100°)

### X=264 — 2026-07-03 — Déport flèche taquets (amplitude)

**But du prompt :** Flèche plus visible sur le côté au contact des taquets ; à fond, pointe quasi entièrement à gauche.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.264` |
| 1 | `flapDeflectionDeg` jusqu’à ~54° ; impulsion par crossing ; lissage asymétrique (attaque rapide) | *(non commité)* | `v2.2.0.264.1` |

**Validations :** `npm run build` OK  
**Risques :** déport très marqué sur segments étroits — ajuster gains si trop extrême

### X=265 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.265` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=266 — 2026-07-03 — Fix TP roue au Continuer

**But du prompt :** Continuer faisait « tourner » la roue des milliers de degrés au lieu d’afficher la suivante au repos.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.266` |
| 1 | `transition: none` hors spin ; remount spinner (`key` roue+token) ; reset DOM instantané ; plus de `onSpinEnd` fantôme si plan annulé | *(non commité)* | `v2.2.0.266.1` |

**Validations :** `npm run build` OK  
**Risques :** remount recrée le spinner (L2D N/A) — acceptable

### X=267 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.267` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=268 — 2026-07-03 — Déblocage Continuer + sens flèche

**But du prompt :** Continuer bloqué sur « Rotation… » ; message d’erreur si besoin ; flèche dans le mauvais sens vs rotation.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.268` |
| 1 | `handleSpinEnd` via ref + watchdog ; bouton Continuer actif si fault ; `spinFault` UI ; inversion signe flap ; fin spin même sans plan | *(non commité)* | `v2.2.0.268.1` |

**Validations :** `npm run build` OK  
**Risques :** watchdog ~ms+1.8s peut révéler avant fin visuelle peg bounce — acceptable

### X=269 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.269` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=270 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.270` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=271 — 2026-07-03 — Palette couleurs Disgaea (roue Netherworld)

**But du prompt :** Direction colorimétrique Disgaea pour la roue — palette démoniaque saturée, segments dédiés, tokens UI + règle Cursor.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.271` |
| 1 | `disgaeaWheelTheme.ts` (palette + segments + raretés) ; segments pack disgaea via `buildSegmentsFromItems` ; CSS/SVG `.dw-spinner--disgaea` ; règle `.cursor/rules/04-destiny-wheel-disgaea-colors.mdc` | *(non commité)* | `v2.2.0.271.1` |

**Validations :** `npm run build` OK  
**Risques :** pack Havre inchangé ; raretés reveal pas encore branchées sur la roue (tokens prêts)

### X=272 — 2026-07-03 — Assets UI roue Disgaea (pack validé)

**But du prompt :** Intégrer le zip `wheel_assets_validated_pack_with_cursor_colors` — frame, taquets, repère PNG/WebP — proportions identiques à la roue actuelle, comportement inchangé.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.272` |
| 1 | Assets → `public/assets/destiny-wheel/disgaea/` ; `wheelVisualAssets.ts` ; calques frame/ticks/pointer dans `DestinyWheelSpinner` ; CSS `.dw-spinner--disgaea-assets` | *(non commité)* | `v2.2.0.272.1` |

**Validations :** `npm run build` OK ; assets présents dans `dist/`  
**Risques :** micro-ajustement pointer/tick si rendu in-game décalé — constantes dans `DISGAEA_WHEEL_LAYOUT`

### X=273 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.273` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=274 — 2026-07-03 — Calibration assets roue Disgaea (in-game)

**But du prompt :** Corriger décalages visuels — cadre trop petit, taquets trop longs, repère décalé à gauche et trop petit.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.274` |
| 1 | `DISGAEA_WHEEL_LAYOUT` : frame scale 114 % ; taquets h≈12–13,5 u. (≈ peg) ; repère +14–18 % largeur, offsetX +3,6 % | *(non commité)* | `v2.2.0.274.1` |

**Validations :** `npm run build` OK  
**Risques :** micro-ajustement `offsetXPct` / `scalePct` si résolution différente

### X=275 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.275` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=276 — 2026-07-03 — Calibration roue Disgaea v2 (repère, +45°, taquets)

**But du prompt :** Repère encore trop à gauche + trop petit ; rotate visuel 45° ; taquets invisibles (trop rentrés).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.276` |
| 1 | Repère : position pack (leftPct) + nudge stage +13,5 % + scale ↑ ; segments +45° disgaea + wrap angles ; taquets anchorR 186 h≈21–23 ; frame 116 % | *(non commité)* | `v2.2.0.276.1` |

**Validations :** `npm run build` OK  
**Risques :** nudge repère à affiner si PNG revu ; `nudgeXPct` dans `wheelVisualAssets.ts`

### X=277 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.277` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=278 — 2026-07-03 — Fix repère Disgaea (bug 46px) + rotate 45° + taquets foreground

**But du prompt :** Pointe toujours décalée (entourée rouge), pas de rotate 45°, taquets invisibles.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.278` |
| 1 | Bug : conteneur repère héritait `.dw-spinner-pointer` (46×44 px) — classe `dw-spinner-pointer-assets` plein stage + centrage ; rotate +45° sur transform + physics ; taquets SVG overlay z-index 5 | *(non commité)* | `v2.2.0.278.1` |

**Validations :** `npm run build` OK  
**Risques :** calibrage fin repère/taquets après validation visuelle

### X=279 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.279` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=280 — 2026-07-03 — Repère Disgaea : taille pack native

**But du prompt :** Pointe beaucoup trop grosse après fix conteneur 46×44 — retirer les boosts +32 % / +42 %.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.280` |
| 1 | `pointerFixed` ~82 % / `pointerMobile` ~39 % (ratios pack 997/472 vs 1217) | *(non commité)* | `v2.2.0.280.1` |

**Validations :** `npm run build` OK

### X=281 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.281` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=282 — 2026-07-03 — Repère Disgaea : stack + scale 0,64 + charnière

**But du prompt :** Pointe encore trop grosse ; fixation et mobile détachés — calibrer depuis capture.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.282` |
| 1 | Stack unique `scale(0.64)` ; mobile ancré sur fixed (72 % / top 63,8 %) ; ratio largeur 472/997 | *(non commité)* | `v2.2.0.282.1` |

**Validations :** `npm run build` OK

### X=283 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.283` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=284 — 2026-07-03 — Calibrateur UI roue Disgaea (première version)

**But du prompt :** Panneau flottant pour calibrer assets roue Disgaea (translate / rotate / scale).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.284` |
| 1 | `DisgaeaWheelCalibrator` + `disgaeaWheelLayoutCalibration` | *(non commité)* | `v2.2.0.284.1` |

**Validations :** `npm run build` OK

### X=285 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.285` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=286 — 2026-07-03 — Calibrateur layout dans onglet Debug (dev only)

**But du prompt :** Déplacer le calibrateur UI dans l’onglet Debug (dev only) ; calibrer compagnons (visibilité + transform), zones texte et assets roue Disgaea.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.286` |
| 1 | `DestinyWheelSceneCalibrator` + calibration scène (compagnons, bulles, case, pack) intégrée à l’onglet Debug | *(non commité)* | `v2.2.0.286.1` |

**Validations :** `npm run build` OK  
**Risques :** calibration active uniquement en `import.meta.env.DEV` ; JSON user à intégrer en dur pour prod

### X=287 — 2026-07-03 — Calibrateur : message free spin déplaçable

**But du prompt :** Rendre le message « Free spin actif » déplaçable via l’onglet Debug layout scène.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.287` |
| 1 | Couche `spinnerHint` dans calibration scène + transform sur hint spinner | *(non commité)* | `v2.2.0.287.1` |
| 2 | Bulles dialogue dynamiques : largeur cqw, déplacement, retour à la ligne texte | *(non commité)* | `v2.2.0.287.2` |

**Validations :** `npm run build` OK

### X=288 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.288` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=289 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.289` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=290 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.290` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=291 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.291` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=292 — 2026-07-03 — Intégration layout user JSON (prod)

**But du prompt :** Intégrer la calibration manuelle exportée par Guillaume comme layout prod.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.292` |
| 1 | `destinyWheelSceneLayoutUser.json` + layout appliqué en prod (roue, compagnons, bulles, UI) | *(non commité)* | `v2.2.0.292.1` |
| 4 | Physique taquets : fix double offset rAF Disgaea ; impulsion au crossing + decay ; fin creep/settle avec frein par taquet | *(non commité)* | `v2.2.0.292.4` |
| 5 | Bulles rareté : corps texte blanc classique ; nom speaker reste coloré par rareté | *(non commité)* | `v2.2.0.292.5` |

**Validations :** `npm run build` OK

### X=293 — 2026-07-03 — Animations rareté inline « case en cours »

**But du prompt :** Les reveals spéciaux ne doivent plus déplacer/réduire la case calibrée.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.293` |
| 1 | Inline reveal : glow/bordure/flash sans scale-shake ; respect width calibrée | *(non commité)* | `v2.2.0.293.1` |

**Validations :** `npm run build` OK

### X=294 — 2026-07-03 — Libellés roue (orientation + affichage)

**But du prompt :** Textes segments — même sens de rotation ; plus de labels visibles sur grandes parts ; pas de troncature abusive.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.294` |
| 1 | `wheelLabelPlanner` : tangente unique (mid−90°) ; priorité texte long ; seuil sweep sans déborder | *(non commité)* | `v2.2.0.294.1` |
| 2 | Debug : bouton « Tirer toutes les roues → écran final » (`debugSimulateFullRun`) | *(non commité)* | `v2.2.0.294.2` |
| 3 | Case en cours : hauteur fixe + slot ambiance réservé ; `heightCqh` calibrable | *(non commité)* | `v2.2.0.294.3` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK

### X=295 — 2026-07-03 — Écran final Roue du Destin (fiche compacte)

**But du prompt :** Nom éditable, note visible, grille sans scroll (Evilities+Forme empilées, Final élargi), actions finales, onglet Compagnons.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.295` |
| 1 | `DestinyWheelFinalScreen` : nom, note ★, grille 5 col., barre Valider/Favori/Rejouer/Quitter ; onglet Compagnons (Havre archive + historique Disgaea) | *(non commité)* | `v2.2.0.295.1` |
| 2 | Case en cours : layout user (3/23.5, 26.5cqw) ; position cqw/cqh ; effets inline compacts | *(non commité)* | `v2.2.0.295.2` |
| 3 | Libellés roue Disgaea : fit conservateur, abréviations, clip SVG par segment | *(non commité)* | `v2.2.0.295.3` |
| 4 | Panneau case : titre = catégorie de roue (Monde d’origine, etc.) au lieu de « Case en cours » / « Sous le repère » | *(non commité)* | `v2.2.0.295.4` |
| 5 | Libellés roue v2 : police uniforme par roue, mode radial (roues denses) + tangents plus gros | *(non commité)* | `v2.2.0.295.5` |
| 6 | Écran final : note sévère (`computeSheetDisplayRating`), grille 2 col. (Identité+stats / boss rouge), cartes basses compactes, boutons cliquables (`pointer-events`) | *(non commité)* | `v2.2.0.295.6` |
| 7 | Case en cours : ancrage calibré sur le panneau (kicker au-dessus), pas de double offset position | *(non commité)* | `v2.2.0.295.7` |
| 8 | Libellés roue : zones texte en anneau (58–90 % R), pad 20 % début de case, ancrage haut-gauche | *(non commité)* | `v2.2.0.295.8` |
| 9 | Écran final 3 col. sans scroll ; archives fiches complètes (100/pack) + « Voir la fiche » | *(non commité)* | `v2.2.0.295.9` |
| 10 | Libellés roue : bande 20–90 % R (spec), ancrage haut-gauche + baseline radial ; case calibrée `position:absolute` cqw/cqh sans offset 4px | *(non commité)* | `v2.2.0.295.10` |

**Validations :** `npm run build` OK ; `npm run validate:wheel-labels` OK (disgaea/origin_world 34/40)
**Risques :** compacité viewport très petit (<820px) non garantie sans scroll

### X=296 — 2026-07-03 — Roue Disgaea : libellés textPath + case en cours

**But du prompt :** Corriger définitivement position « case en cours » (JSON 3/23.5) et libellés roue (bande 20–90 % R, sans overlap centre).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.296` |
| 1 | Libellés via `textPath` radial/arc (20→90 % R) ; case : style direct sur aside ; `currentCase` figé depuis JSON (anti-drift localStorage) | *(non commité)* | `v2.2.0.296.1` |

**Validations :** `npm run build` OK ; `npm run validate:wheel-labels` OK
**Risques :** hard refresh requis ; segments très fins (<2°) restent sans libellé

### X=297 — 2026-07-03 — Libellés roue : bande 30 % + texte complet

**But du prompt :** Ajuster bande radiale 30→93 % R, réduire pad angulaire, afficher libellés complets (ex. Cimetière des tutoriels).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.297` |
| 1 | INNER 30 %, pad 12/8 %, pas de troncature précoce, shrink textPath, score libellé complet | *(non commité)* | `v2.2.0.297.1` |
| 2 | Rotation manuelle roue via molette / scroll (trackpad) sur la scène | *(non commité)* | `v2.2.0.297.2` |
| 3 | Calibrateur dev zone texte roue (sliders + valeurs fixes, overlay, export JSON) | *(non commité)* | `v2.2.0.297.3` |
| 4 | Scroll roue : sensibilité réduite (`0.42` → `0.2` deg/px) | *(non commité)* | `v2.2.0.297.4` |

**Validations :** `npm run build` OK ; `npm run validate:wheel-labels` OK
**Risques :** compression légère (`lengthAdjust`) sur noms très longs

### X=298 — 2026-07-03 — Calibration zone texte roue (JSON user)

**But du prompt :** Intégrer JSON calibré Guillaume + pad extérieur (haut) manquant.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.298` |
| 1 | DEFAULT `wheelLabelZoneCalibration` (JSON user) ; `radialPadOuterRatio` + `textPathEndInsetPct` | *(non commité)* | `v2.2.0.298.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK

### X=299 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.299` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=300 — 2026-07-03 — Visibilité calibrateur pad haut zone texte

**But du prompt :** Guillaume ne voyait pas `radialPadOuterRatio` / `textPathEndInsetPct` — les rendre trouvables.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.300` |
| 1 | Onglet dev **Labels** ; groupe **Pad haut / troncature** en tête (surbrillance) ; calibrateur zone texte remonté avant layout scène dans Debug | *(non commité)* | `v2.2.0.300.1` |

**Validations :** `npm run build` OK
**Risques :** aucun (UI dev uniquement)

### X=301 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.301` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=302 — 2026-07-03 — Fix troncature libellés roue (fit + shrink + clip)

**But du prompt :** Pad angulaire ne faisait que déplacer le texte tronqué — corriger la cause (fit sous-estimé, candidats raccourcis, clip glyphes).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.302` |
| 1 | Fit avec `startOffset` ; libellé complet + `lengthAdjust` ; plus de candidats « 2 mots » ; clip élargi vers l’extérieur ; `shrinkToFitMax` 2.2 | *(non commité)* | `v2.2.0.302.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK
**Risques :** compression légère sur noms très longs ; Reset calibrateur si localStorage ancien

### X=304 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.304` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=305 — 2026-07-03 — Bons paramètres troncature (piste ≠ pad clip)

**But du prompt :** Paramètres « pad haut » inopérants — séparer position piste / extension extérieure / clip glyphes vs `angPadStart` (clip seulement).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.305` |
| 1 | `textPathAngleRatio`, `textPathOuterExtendRatio`, `clipOuterGlyphPadRatio` ; calibrateur « Troncature & position texte » | *(non commité)* | `v2.2.0.305.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK
**Risques :** Reset calibrateur Labels pour prendre les nouveaux champs

### X=306 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.306` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=307 — 2026-07-03 — DEFAULT zone texte roue (calibration Guillaume)

**But du prompt :** Intégrer JSON calibré — clé `textPathAngleRatio: 0.48` + `rOuterRatio: 0.86`.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.307` |
| 1 | DEFAULT `wheelLabelZoneCalibration` (JSON user complet) | *(non commité)* | `v2.2.0.307.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK
**Risques :** aucun

### X=308 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.308` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=309 — 2026-07-03 — DEFAULT layout scène (case en cours)

**But du prompt :** Intégrer calibration layout scène Guillaume — repositionnement zone « case en cours ».

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.309` |
| 1 | `destinyWheelSceneLayoutUser.json` — `currentCase` x:1 y:9, `heightCqh`:22.5 | *(non commité)* | `v2.2.0.309.1` |

**Validations :** `npm run build` OK
**Risques :** aucun

### X=310 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.310` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=311 — 2026-07-03 — Sens libellés roue rank + calibration globale

**But du prompt :** Calibration texte pas identique sur toutes les roues ; rank lisible à l’envers.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.311` |
| 1 | Seuil radial 12 (rank = radial + `textPathAngleRatio`) ; flip piste `pathReversed` par quadrant | *(non commité)* | `v2.2.0.311.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK
**Risques :** roues Havre ≤12 segments restent en tangent

### X=312 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.312` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=313 — 2026-07-03 — Retrait flip piste + seuil radial

**But du prompt :** Guillaume — supprimer `pathReversed` et `denseRadialThreshold` ; layout scène déjà intégré.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.313` |
| 1 | Suppression flip auto + option seuil radial ; libellés toujours radiaux | *(non commité)* | `v2.2.0.313.1` |

**Validations :** `npm run build` OK ; `validate:wheel-labels` OK
**Risques :** aucun

### X=314 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.314` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=315 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.315` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=316 — 2026-07-03 — Visuels roue Havre (assets PNG + calibration)

**But du prompt :** Intégrer le cadre roue Havre depuis le dossier Wheel/Havre sur le même modèle que Disgaea (frame PNG, calques, calibration scène, palette segments).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.316` |
| 1 | `frame.png` Havre, thème `havre`, cal `havreWheel`, spinner + calibrateur scène, palette segments | *(non commité)* | `v2.2.0.316.1` |

**Validations :** `npm run build`, `npm run validate:wheel-labels`  
**Risques :** calibration disc/frame Havre à affiner en jeu (rotate 0 par défaut) ; pas de sprites pointer/tick séparés — pointer CSS + ticks intégrés au PNG

### X=317 — 2026-07-03 — Détourage roue Havre (cadre + hub)

**But du prompt :** Détourer la roue Havre et séparer les éléments (trou segments transparent, hub central au-dessus du disque).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.317` |
| 1 | Script `prepare-havre-wheel-assets`, `frame.png` + `hub.png`, calque hub spinner, archive `frame_composite.png` | *(non commité)* | `v2.2.0.317.1` |

**Validations :** `npm run build`, `npm run prepare:havre-wheel-assets`  
**Risques :** détourage heuristique (neutres clairs) — ajuster script si bord bois/lanternes grignotés ; re-générer depuis `frame_composite.png` ou nouvelle source

### X=321 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.321` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=322 — 2026-07-03 — Pack assets Havre complet (modèle Disgaea)

**But du prompt :** Intégrer les nouveaux assets Havre (frame, pointer fixed/mobile, ticks) exactement comme le pack Disgaea.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.322` |
| 1 | Script `prepare:havre-wheel-assets` (5 PNG → détourage + webp ticks), layout pointer/ticks Havre, spinner généralisé pack | *(non commité)* | `v2.2.0.322.1` |

**Validations :** `npm run prepare:havre-wheel-assets`, `npm run build`  
**Risques :** calibration calques Havre à affiner en jeu (Layout scène) ; dimensions pointer recalculées post-trim

### X=323 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.323` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=324 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.324` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=325 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.325` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=326 — 2026-07-03 — Havre roue : trou noir centre + taquets plus grands

**But du prompt :** Supprimer l’anneau noir au centre (composite frame) et agrandir les taquets Havre.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.326` |
| 1 | Détourage frame élargi (noir hub→segments), ticks Havre ×1,4 viewBox, regen `frame.png` | *(non commité)* | `v2.2.0.326.1` |

**Validations :** `npm run prepare:havre-wheel-assets`, `npm run build`  
**Risques :** liseré hub or si seuil détourage trop agressif — ajuster `keyInteriorSegmentHole` si besoin

### X=327 — 2026-07-03 — Calibration prod Havre roue (disque pivoté)

**But du prompt :** Figurer la calibration calibrateur (disc 18,5°, frame 45,5°) comme baseline prod de tous les calques roue Havre.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.327` |
| 1 | `destinyWheelSceneLayoutUser.json` havreWheel, `visualRotationOffsetDeg` 18,5, defaults + anti-drift localStorage | *(non commité)* | `v2.2.0.327.1` |

**Validations :** `npm run build`  
**Risques :** localStorage dev écrasé pour havreWheel à chaque load (volontaire, comme currentCase)

### X=328 — 2026-07-03 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.328` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=329 — 2026-07-03 — Calibration Havre roue v2 (y, scale, ticks)

**But du prompt :** Intégrer le JSON calibrateur mis à jour (havreWheel prod).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.329` |
| 1 | `destinyWheelSceneLayoutUser.json` — disc/frame y:7,5, frame scale 1,04, pointer mobile 0,8, ticks 0,91 rotate 45,5° | *(non commité)* | `v2.2.0.329.1` |

**Validations :** `npm run build`  
**Risques :** aucun — havreWheel toujours figé depuis JSON au load

### X=330 — 2026-07-04 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.330` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=331 — 2026-07-04 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.331` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=332 — 2026-07-04 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.332` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

## Historique complété

### X=2 — 2026-06-30 — Kickoff phase 2.2 + procédure agents

**But du prompt :** Initialiser officiellement la 2.2 (semver, révision UI, docs) et documenter le kickoff pour les agents futurs.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | Reset revision 1 + `version:prompt` | *(non commité)* | `v2.2.0.02` |
| 1 | Bump `2.2.0`, reset UI, guide `07-kickoff`, stubs `.ai/`, brief handoff | *(non commité)* | `v2.2.0.02.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun (docs + versionnement uniquement)

---

---

### X=4 — 2026-07-01 — Versionnement auto (hook + règle + DEV_LOG)

**But du prompt :** Automatiser `version:prompt`, clarifier politique X/Y, séparer HMR du bump Y agent.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.04` |
| 1 | Hook `beforeSubmitPrompt`, règle `.cursor/rules/02-*`, DEV_LOG ⚠️, HMR sans bump Y | *(non commité)* | `v2.2.0.04.1` |

**Validations :** `npm run build` OK  
**Risques :** hook Cursor à valider côté IDE

---

### X=3 — 2026-06-30 — Écran connexion + splash chargement + visuels IA

**But du prompt :** Connexion id/mot de passe, carrousel de présentation, barre de chargement assets, visuels IA splash.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 1 | Warmup cache compagnons + probes parallèles | *(non commité)* | `v2.2.0.03.7` |
| 2 | `GameSessionGate`, login, carousel, 5 PNG IA `public/splash/` | *(non commité)* | `v2.2.0.03.8` |
| 54 | Lot session : warmup, logout, refuge, Chantier du havre, kickoff docs | `7d30383` | `v2.2.0.03.54` |

**Validations :** `npm run build` OK  
**Risques :** auth locale démo uniquement ; PNG IA à valider visuellement

---

## Template section X (futures entrées)

Les nouvelles sections sont **injectées automatiquement** sous « Sections ouvertes ». Template de référence :

```markdown
### X={N} — YYYY-MM-DD — {titre court du prompt}

**But du prompt :** …

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` (hook ou manuel) | | v2.2.0.{N} |
| 1 | … | abc1234 | v2.2.0.{N}.1 |

**Validations :** build OK / …
**Risques :** aucun / …
```

**Commits atomiques :** chaque ligne Y sans hash → candidat à un commit isolé (`git add` ciblé, message = résumé Y).
