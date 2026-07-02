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
