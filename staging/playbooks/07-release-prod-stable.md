# 07 — Release prod stable

Déploiement local **prod** : build stable, TLS, launcher, smoke.

Voir aussi [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) et [`06-tnr-checklist.md`](./06-tnr-checklist.md).

---

## Prérequis

- [ ] TNR baseline OK : `npm run tnr:baseline`
- [ ] Smoke visuel core (playbook 10)
- [ ] User sign-off si push `main` prévu
- [ ] Bump **MINOR** semver si push main + prod (`package.json`) — voir [`../../docs/agent-guide/05-politique-versionnement.md`](../../docs/agent-guide/05-politique-versionnement.md)

---

## Pipeline

### 1. Backup

```bash
git push origin HEAD:Backup --force   # si user OK
```

### 2. Build prod stable

```bash
npm run build:stable:prod
```

Fichiers touchés : `deploy/stable/dist/`, `deploy/stable/BUILD_INFO.json` (local gitignore).

### 3. TLS (si certificat expiré / nouvelle machine)

```bash
npm run tls:stable
npm run trust:stable   # PowerShell admin — une fois par machine
```

### 4. Launcher

```bash
npm run launcher:stable
```

Dashboard surveillance : port **8789**.

Scripts : `scripts/stable-launcher.mjs`, `scripts/build-stable-release.mjs`, `scripts/serve-stable.mjs`.

---

## Fichiers importants (checklist)

| Fichier / zone | Quand modifier |
|----------------|----------------|
| `deploy/stable/` config | URL, port, chemins dist |
| `scripts/build-stable-release.mjs` | Process build prod |
| `scripts/stable-launcher.mjs` | Comportement launcher |
| `scripts/stable-prod-guard.mjs` | Garde-fous prod |
| `scripts/generate-stable-tls.mjs` | Certs |
| `package.json` `version` | MINOR bump release main |
| `build-revision.json` | Auto — vérifier label UI |
| `docs/traceability/changelog/` | Entrée + VERSION-INDEX |
| `.ai/current-state.md` | Post-release |

---

## Smoke post-deploy

- [ ] Jeu charge via launcher (pas seulement `npm run dev`)
- [ ] Version UI affichée cohérente
- [ ] Accueil, chasse, dressage, liens — pas de 404 PNG
- [ ] Gacha + event actif si inclus dans release
- [ ] Save locale compatible (pas de crash load)
- [ ] Dashboard 8789 sans crash

---

## Rollback

- Restaurer depuis `origin/Backup`
- Redéployer build stable précédent depuis `deploy/stable/archive/` si conservé

---

## Anti-patterns

- ❌ `build:stable:prod` sans TNR préalable
- ❌ Commit secrets `deploy/stable/.env*`, certs
- ❌ Bump MINOR sans entrée changelog « intérêt release »
