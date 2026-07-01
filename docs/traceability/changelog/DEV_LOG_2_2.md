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

### X=5 — 2026-07-01 — Sync docs versionnement (hook, DEV_LOG, commits atomiques)

**But du prompt :** Relire et mettre à jour toute la doc qui référence X/Y, hook, DEV_LOG et commits atomiques.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.05` |
| 1 | Màj agent-guide, HANDOFF, DOC_AGENT_INDEX, project-state, README, DEV_LOG | *(non commité)* | `v2.2.0.05.1` |

**Validations :** relecture grep docs  
**Risques :** hook Cursor à valider côté IDE

### X=6 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.06` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

### X=7 — 2026-07-01 — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | `version:prompt` | *(non commité)* | `v2.2.0.07` |

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
