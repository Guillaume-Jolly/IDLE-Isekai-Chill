# 06 — Pipeline validation

Updated: 2026-07-01

Ordre canonique pour valider une livraison ou une fin de session significative.

---

## Release gate (obligatoire)

```bash
npm run validate:companion-bonds   # 19 compagnons · 190 bonds
npm run validate:link-corpus       # 7500 conversations
npm run tnr:baseline               # bonds + corpus + build + manifest assets
```

Équivalent manuel si besoin :

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run build
node scripts/inventory-assets-manifest.mjs
```

---

## Scripts npm

| Script | Rôle | Modifie le repo ? |
|--------|------|-------------------|
| `validate:companion-bonds` | Cohérence catalogue bonds | Non |
| `validate:link-corpus` | Intégrité corpus V2 | Non |
| `build` | `tsc -b` + Vite production | Non |
| `tnr:baseline` | Enchaîne les trois ci-dessus + manifest | **Oui** — `asset-manifest.json` |
| `lint` | ESLint global | Non |

---

## Lint (optionnel, non bloquant release)

```bash
npm run lint
```

~**33** problèmes préexistants documentés (fin release 2.1). Ne pas bloquer une livraison. Ne pas lancer de fix massif sans demande Guillaume.

---

## CI GitHub Actions

Fichier : [`.github/workflows/validate.yml`](../../.github/workflows/validate.yml)

Déclenché sur `push` / `pull_request` vers `main` et branches `feature/**`.

Étapes : `npm ci` → `validate:companion-bonds` → `validate:link-corpus` → `build`.

**Hors scope CI :** lint, `tnr:baseline` complet (manifest), smoke navigateur.

---

## Legacy / ne pas utiliser pour la release gate

| Script | Statut |
|--------|--------|
| `scripts/validate-conversations.mjs` | Legacy — remplacé par `validate:link-corpus` |
| `generate:gacha-video` | Hors package.json — ponctuel |

---

## Smoke UI (manuel)

Si écrans, assets mapping ou mini-jeux touchés :

- Village panorama
- Hub mini-jeux (Ferme lunaire, Promenade Myrions, …)
- Liens + conversations
- Inventaire
- Pas d'erreur console bloquante
- Version UI cohérente avec `build-revision.json`

Checklist étendue : `staging/playbooks/06-tnr-checklist.md`

---

## Versionnement lié au pipeline

| Moment | Commande / mécanisme |
|--------|----------------------|
| Début prompt | Hook Cursor → `version:prompt` (X+1, Y→0) ; opt-out : `même X` |
| Fin tâche distincte | `npm run version:task` (Y+1) |
| Log résumé 2.2 | `docs/traceability/changelog/DEV_LOG_2_2.md` — section ⚠️ + lignes Y |
| Dev HMR | Sync `build-info.json` **sans** bump Y |

Voir [`05-politique-versionnement.md`](./05-politique-versionnement.md) et [`.cursor/hooks/README.md`](../../.cursor/hooks/README.md).
