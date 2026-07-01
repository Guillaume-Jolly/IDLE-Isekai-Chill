# 05 — Politique de versionnement

Updated: 2026-07-01 (renvoi schéma global A.B.C.X.Y)

> **Schéma complet release + dev :** [`08-versionnement-global.md`](./08-versionnement-global.md)  
> Ce fichier détaille surtout **X/Y**, DEV_LOG et hooks Cursor.

Numéro affiché **en haut à gauche** dans l'UI : `UI_VERSION` depuis `build-revision.json` + `package.json`.

---

## Format affiché (depuis release 2.1)

```
v{SEMVER}.{X}
v{SEMVER}.{X}.{Y}    (si Y > 0)
```

**Exemples live :**

| Contexte | Label |
|----------|-------|
| Fin release 2.1 | `v2.1.0.128` |
| Même prompt, 3e tâche | `v2.1.0.128.3` |
| Début 2.2 après reset | `v2.2.0.01` puis `v2.2.0.02.1` |
| Phase 2.2 + hook actif | `v2.2.0.04.1` |

| Segment | Nom | Signification | Qui incrémente |
|---------|-----|---------------|----------------|
| **A** | MEP | Mise en prod déclarée | `npm run version:mep` (manuel) |
| **B** | Push main | Intégration `main` | Git `pre-push` → `version:main-push` |
| **C** | Push branche | Itération branche feature | Git `pre-push` → `version:branch-push` |
| **X** | Prompt | Chaque nouveau prompt user | Hook Cursor → `version:prompt` (opt-out : `même X`) |
| **Y** | Tâche | Chaque tâche distincte dans le prompt | Hook `stop` → `version:task` (opt-out : `même Y`) |

> Ancienne sémantique semver « MAJOR/MINOR/PATCH manuel » → remplacée par A/B/C événements git. Voir [`08-versionnement-global.md`](./08-versionnement-global.md).

> **Note historique :** avant 2.1 le format documenté était `v1.0.1.43.543` (5 segments découpés). Depuis 2.1 le semver complet (`2.1.0`) précède X et Y.

---

## Implémentation technique

| Fichier | Rôle |
|---------|------|
| [`package.json`](../../package.json) `version` | `MAJOR.MINOR.PATCH` (semver npm) |
| [`build-revision.json`](../../build-revision.json) | `revision` (= X), `subRevision` (= Y), `fingerprint` worktree |
| [`.cursor/hooks.json`](../../.cursor/hooks.json) | **Auto X** (`beforeSubmitPrompt`) + **Auto Y** (`stop`) |
| [`.cursor/hooks/README.md`](../../.cursor/hooks/README.md) | Debug hooks + redémarrage Cursor |
| [`.cursor/rules/02-version-prompt-first.mdc`](../../.cursor/rules/02-version-prompt-first.mdc) | Règle agent backup si hook off |
| [`scripts/bump-prompt.mjs`](../../scripts/bump-prompt.mjs) | Bump X, reset Y à 0, injecte DEV_LOG |
| [`scripts/bump-task.mjs`](../../scripts/bump-task.mjs) | Bump Y (+1), garde X |
| [`scripts/lib/version-hook-output.mjs`](../../scripts/lib/version-hook-output.mjs) | `executionLogLabel` |
| [`scripts/bump-branch-push.mjs`](../../scripts/bump-branch-push.mjs) | Bump **C** |
| [`scripts/bump-main-push.mjs`](../../scripts/bump-main-push.mjs) | Bump **B** |
| [`scripts/bump-mep.mjs`](../../scripts/bump-mep.mjs) | Bump **A** |
| [`.githooks/pre-push`](../../.githooks/pre-push) | Auto B/C sur push |
| [`scripts/lib/dev-log-open-section.mjs`](../../scripts/lib/dev-log-open-section.mjs) | Section `⚠️ À COMPLÉTER` dans DEV_LOG |
| [`vite.git-build-info.ts`](../../vite.git-build-info.ts) | Format label ; HMR **sync** sans bump Y |
| [`public/build-info.json`](../../public/build-info.json) | Miroir runtime (gitignoré) |
| [`src/uiVersion.ts`](../../src/uiVersion.ts) | Constante injectée Vite |

Doc hook : [`.cursor/hooks/README.md`](../../.cursor/hooks/README.md)

---

## Règles d'incrément

### X (+1, Y → 0) — nouveau prompt

**Automatique (recommandé) — hook Cursor :**

- Chaque message user → `beforeSubmitPrompt` exécute `npm run version:prompt`
- Injecte une section `⚠️ À COMPLÉTER` dans [`DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)
- **Opt-out :** écrire `même X` ou `same X` dans le message
- Mieux vaut un X de trop qu'un X oublié

**Manuel (backup) :**

```bash
npm run version:prompt
```

- Si le hook est désactivé ou Cursor non redémarré après changement de `hooks.json`
- Règle agent : premier appel shell du tour si le hook n'a pas tourné

### Y (+1) — tâche distincte dans un prompt

**Automatique (recommandé) — hook Cursor `stop` :**

- Fin de tour agent → `version:task` si le worktree a changé (fichiers code/docs)
- **Opt-out :** `même Y` ou `same Y` dans le message user
- Ignore les seuls changements `build-revision.json` / `DEV_LOG_2_2.md`

**Manuel (backup ou lots multiples dans un tour) :**

```bash
npm run version:task
```

- Après chaque **lot cohérent** terminé (fix isolé, doc, refactor ciblé)
- Ajouter une **ligne Y** dans la section X courante du DEV_LOG
- Pas le HMR — voir § Dev HMR ci-dessous

### Dev HMR — sync uniquement (pas de bump Y)

- Sauvegarde fichier en `npm run dev` → resync `build-info.json` (commitHash, dirty)
- **Ne modifie pas** `subRevision` dans `build-revision.json`
- Ancien comportement (Y+1 à chaque save) abandonné — produisait des Y absurdes (ex. 314)

### PATCH / MINOR / MAJOR — remplacé par A / B / C

Voir [`08-versionnement-global.md`](./08-versionnement-global.md) § A·B·C.

Kickoff nouvelle phase : toujours [`07-kickoff-nouvelle-version.md`](./07-kickoff-nouvelle-version.md).

---

## DEV_LOG — journal par prompt (phase 2.2)

Fichier central : [`docs/traceability/changelog/DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)

Structure :

1. **`## ⚠️ Sections ouvertes`** — injectées par `version:prompt` ; à **compléter en fin de prompt**
2. **`## Historique complété`** — sections X finalisées

Chaque section X contient :

- Titre + date + **but du prompt**
- Tableau **Y** : résumé, hash commit, label UI
- Validations + risques

Complète le changelog micro (`entries/`) — ne pas dupliquer le détail fichier par fichier.

---

## Commits atomiques via DEV_LOG

Le DEV_LOG sert aussi à **découper les commits après coup** :

| DEV_LOG | Commit git |
|---------|------------|
| 1 ligne **Y** | 1 commit atomique (`git add` ciblé sur le lot Y) |
| Section **X** entière | 1 commit récap (message = but du prompt) |
| « But du prompt » | Base du message de commit |

Workflow type avant push :

1. Relire `## ⚠️ Sections ouvertes` puis `## Historique complété`
2. Pour chaque Y sans commit : stager les fichiers du lot, committer avec le résumé Y
3. Compléter titre / but / validations ; déplacer la section vers Historique si terminé

---

## Harmonisation UI ↔ Git (passage nouvelle phase)

**Problème connu fin 2.1 :** `revision` (= X) a dérivé (ex. 128) vs historique git / nombre de commits.

**Procédure kickoff (toute phase MINOR) :** voir [`07-kickoff-nouvelle-version.md`](./07-kickoff-nouvelle-version.md).

Résumé :

1. Branche `feature/{N}` depuis `main`
2. Bump `package.json` → `{N}.0.0`
3. Reset `build-revision.json` : `{ "revision": 1, "subRevision": 0 }`
4. Premier prompt de travail → hook ou `version:prompt` → label `v{N}.0.02`
5. Tag release future : `v{N}.0.0` (convention tag ≠ label UI)

**Exemple 2.2 (fait 2026-06-30) :** semver `2.2.0`, UI `v2.2.0.02` après kickoff + premier prompt.

---

## Exemple timeline 2.2

| Événement | Version affichée | Git / DEV_LOG |
|-----------|------------------|---------------|
| Reset branche 2.2 | `v2.2.0.01` | commit setup |
| Hook / `version:prompt` | `v2.2.0.04` | section ⚠️ injectée |
| Fix wording quête | `version:task` → `v2.2.0.04.1` | ligne Y + commit atomique |
| Doc versionnement | `version:task` → `v2.2.0.04.2` | ligne Y |
| Fin prompt → compléter DEV_LOG | — | section déplacée Historique |

---

## Lien avec changelog détaillé

Chaque entrée significative **doit** citer la version exacte :

```markdown
## v2.2.0.04.1 — 2026-07-01T10:15
**Intérêt :** Harmoniser libellé quête onboarding.
**Fichiers :** infiniteQuests.ts
```

Index global : [`docs/traceability/changelog/VERSION-INDEX.md`](../traceability/changelog/VERSION-INDEX.md)

---

## Anti-patterns

| ❌ | ✅ |
|----|-----|
| Compter sur l'agent pour bump X manuellement | Hook `beforeSubmitPrompt` + règle `.cursor/rules/02-*` |
| Bump Y sans log DEV_LOG | `version:task` + ligne Y |
| Confondre tag Git `v2.1.0.0` et label UI `v2.1.0.128` | Tag = jalon release ; UI = X/Y session |
| S'attendre à ce que HMR incrémente Y | HMR sync seulement ; Y = `version:task` |
| Committer tout le diff feature d'un coup | Relire DEV_LOG → commits par Y |
| Changer semver en `2.1.0.0` | Semver npm reste `2.1.0` ; tag git `v2.1.0.0` |
