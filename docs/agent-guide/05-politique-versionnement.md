# 05 — Politique de versionnement

Updated: 2026-06-30 (post-release 2.1.0.0)

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

| Segment | Nom | Signification | Qui incrémente |
|---------|-----|---------------|----------------|
| **SEMVER** | `2.1.0` | Jalon produit (`MAJOR.MINOR.PATCH` dans `package.json`) | Manuel — release / baseline |
| **X** | `128` | **Chaque nouveau prompt user** (session agent) | `npm run version:prompt` |
| **Y** | `3` | **Chaque tâche distincte** dans le même prompt | `npm run version:task` ou HMR auto (`bumpSubRevisionIfChanged`) |

> **Note historique :** avant 2.1 le format documenté était `v1.0.1.43.543` (5 segments découpés). Depuis 2.1 le semver complet (`2.1.0`) précède X et Y.

---

## Implémentation technique

| Fichier | Rôle |
|---------|------|
| [`package.json`](../../package.json) `version` | `MAJOR.MINOR.PATCH` (semver npm) |
| [`build-revision.json`](../../build-revision.json) | `revision` (= X), `subRevision` (= Y), `fingerprint` worktree |
| [`vite.git-build-info.ts`](../../vite.git-build-info.ts) | Format label + auto-bump Y en dev HMR |
| [`scripts/bump-prompt.mjs`](../../scripts/bump-prompt.mjs) | Bump X, reset Y à 0 |
| [`scripts/bump-task.mjs`](../../scripts/bump-task.mjs) | Bump Y (+1), garde X |
| [`src/uiVersion.ts`](../../src/uiVersion.ts) | Constante injectée Vite |

---

## Règles d'incrément

### Y (+1) — tâche distincte dans un prompt

**Préféré (agent 2.2+) :**

```bash
npm run version:task
```

- Après chaque **lot cohérent** terminé dans le même prompt (fix isolé, doc, refactor ciblé)
- Documenter dans [`docs/traceability/changelog/DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)

**Automatique (dev HMR) :**

- Sauvegarde fichier → fingerprint worktree change → Y +1
- Utile en session interactive ; moins fiable pour traçabilité agent → préférer `version:task`

### X (+1, Y → 0) — nouveau prompt

```bash
npm run version:prompt
```

- **Quand :** début d'un **nouveau message user** qui lance du travail
- Remet Y à 0
- **Commit git recommandé** en fin de prompt : 1 commit par X, message = but du prompt

### PATCH / MINOR / MAJOR — jalon semver

| Bump | Quand | Exemple |
|------|-------|---------|
| **PATCH** | Lot cohérent sur branche (feature merge interne) | `2.1.0` → `2.1.1` |
| **MINOR** | Release produit majeure | `2.1.0` → `2.2.0` (kickoff phase 2.2) |
| **MAJOR** | Rupture save / pivot incompatible | Rare — coordination user |

Documenter dans [`docs/traceability/changelog/VERSION-INDEX.md`](../traceability/changelog/VERSION-INDEX.md).

---

## Harmonisation UI ↔ Git (passage nouvelle phase)

**Problème connu fin 2.1 :** `revision` (= X) a dérivé (ex. 128) vs historique git / nombre de commits.

**Procédure kickoff (toute phase MINOR) :** voir [`07-kickoff-nouvelle-version.md`](./07-kickoff-nouvelle-version.md).

Résumé :

1. Branche `feature/{N}` depuis `main`
2. Bump `package.json` → `{N}.0.0`
3. Reset `build-revision.json` : `{ "revision": 1, "subRevision": 0 }`
4. Premier prompt de travail → `npm run version:prompt` → label `v{N}.0.02`
5. Tag release future : `v{N}.0.0` (convention tag ≠ label UI)

**Exemple 2.2 (fait 2026-06-30) :** semver `2.2.0`, UI `v2.2.0.02` après kickoff + premier prompt.

---

## Log dev 2.2 (obligatoire phase 2.2)

Fichier central : [`docs/traceability/changelog/DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md)

- Une section par **X** (prompt)
- Tableau des **Y** (tâches) avec résumé + hash commit
- Complète le changelog micro (`entries/`) — ne pas dupliquer le détail fichier par fichier

---

## Exemple timeline 2.2

| Événement | Version affichée | Git |
|-----------|------------------|-----|
| Reset branche 2.2 | `v2.2.0.01` | commit setup |
| `version:prompt` nouveau prompt | `v2.2.0.02.0` | — |
| Fix wording quête | `version:task` → `v2.2.0.02.1` | commit fix |
| Fix lint fichier touché | `version:task` → `v2.2.0.02.2` | commit fix |
| Fin prompt → commit récap X | — | `chore(2.2): …` |

---

## Lien avec changelog détaillé

Chaque entrée significative **doit** citer la version exacte :

```markdown
## v2.2.0.02.1 — 2026-07-01T10:15
**Intérêt :** Harmoniser libellé quête onboarding.
**Fichiers :** infiniteQuests.ts
```

Index global : [`docs/traceability/changelog/VERSION-INDEX.md`](../traceability/changelog/VERSION-INDEX.md)

---

## Anti-patterns

| ❌ | ✅ |
|----|-----|
| Bump manuel Y sans log | `version:task` + ligne DEV_LOG |
| Oublier `version:prompt` sur grosse session | Bump en début de prompt |
| Confondre tag Git `v2.1.0.0` et label UI `v2.1.0.128` | Tag = jalon release ; UI = X/Y session |
| Committer `build-revision.json` à chaque save HMR | Committer en fin de tâche Y ou fin prompt X |
| Changer semver en `2.1.0.0` | Semver npm reste `2.1.0` ; tag git `v2.1.0.0` |
