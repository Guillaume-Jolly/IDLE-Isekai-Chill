# 05 — Politique de versionnement

Updated: 2026-06-25

Numéro affiché **en haut à gauche** dans l'UI : `UI_VERSION` depuis `build-revision.json` + `package.json`.

---

## Format affiché

```
v{MAJOR}.{MINOR}.{PATCH}.{PROMPT}.{MICRO}
```

**Exemple live :** `v1.0.1.43.543`

| Segment | Nom | Signification | Qui incrémente |
|---------|-----|---------------|----------------|
| **MAJOR** | `1` | Rupture majeure : format save incompatible, pivot produit | Manuel `package.json` — rare |
| **MINOR** | `0` | **Push `main` + déploiement prod stable** (`build:stable:prod`) | Manuel avant release prod |
| **PATCH** | `1` | **Baseline / jalon** sur branche (ex. Assets 2.0 lot, feature merge) | Manuel `package.json` |
| **PROMPT** | `43` | **Chaque nouveau prompt user** (session agent) | `npm run version:prompt` |
| **MICRO** | `543` | **Chaque micro-modification** distincte dans le prompt | Auto Vite HMR (`bumpSubRevisionIfChanged`) |

---

## Implémentation technique

| Fichier | Rôle |
|---------|------|
| [`package.json`](../../package.json) `version` | `MAJOR.MINOR.PATCH` (semver) |
| [`build-revision.json`](../../build-revision.json) | `revision` (= PROMPT), `subRevision` (= MICRO), `fingerprint` worktree |
| [`vite.git-build-info.ts`](../../vite.git-build-info.ts) | Format label + auto-bump MICRO |
| [`scripts/bump-prompt.mjs`](../../scripts/bump-prompt.mjs) | Bump PROMPT, reset MICRO à 0 |
| [`src/uiVersion.ts`](../../src/uiVersion.ts) | Constante injectée Vite |

---

## Règles d'incrément

### MICRO (+1) — automatique

- Sauvegarde fichier → HMR dev → fingerprint worktree change
- **Agent :** documenter chaque modif significative dans `docs/traceability/changelog/` avec le numéro affiché après save

### PROMPT (+1, MICRO → 0) — manuel début session

```bash
npm run version:prompt
```

- **Quand :** début d'un **nouveau message user** qui lance du travail (convention projet)
- Remet MICRO à 0

### PATCH (+1 MINOR reset) — jalon manuel

- **Quand :** lot cohérent terminé (ex. Phase 2 assets complete, corpus import validé)
- Éditer `package.json` : `"version": "1.0.2"` → prochain affichage `v1.0.2.{prompt}.{micro}`

### MINOR (+1 PATCH reset) — release prod

- **Quand :** push `main` **et** build prod stable déployé
- Ex. `1.0.1` → `1.1.0` si première prod post-baseline V2
- Documenter dans `docs/traceability/changelog/VERSION-INDEX.md`

### MAJOR — exceptionnel

- Migration save breaking, refonte incompatible
- Coordination user obligatoire

---

## Exemple timeline

| Événement | Version affichée |
|-----------|------------------|
| Début prompt user | `npm run version:prompt` → `v1.0.1.44.0` |
| Fix CSS chasse | HMR → `v1.0.1.44.1` |
| Fix path Myrion | HMR → `v1.0.1.44.2` |
| Fin phase assets → bump PATCH | `1.0.2` dans package.json → `v1.0.2.44.2` (prompt/micro inchangés jusqu'au prochain prompt) |
| Push main + prod | bump MINOR → `1.1.0` → `v1.1.0.44.2` |

*Note : après bump package.json, le label recombine semver + revision/subRevision existants.*

---

## Lien avec changelog détaillé

Chaque entrée **doit** citer la version exacte :

```markdown
## v1.0.1.44.3 — 2026-06-25T10:15
**Intérêt :** Corriger 404 cutout Lyra en chasse.
**Fichiers :** vite.repo-assets.ts (mapping cutouts)
```

Index global : [`docs/traceability/changelog/VERSION-INDEX.md`](../traceability/changelog/VERSION-INDEX.md)

---

## Anti-patterns

| ❌ | ✅ |
|----|-----|
| Bump manuel MICRO sans modif | Laisser HMR gérer |
| Oublier `version:prompt` sur grosse session | Bump en début de prompt |
| Même version pour 10 changements sans entrées changelog | 1 entrée / micro-modif significative |
| Confondre semver npm et PROMPT | PROMPT = sessions ; semver = jalons prod |
