# 06 — TNR Checklist (tests non-régression)

Exécuter **entre chaque étape principale** (promote, migration lot, refactor code).

---

## Automatique (obligatoire)

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline   # bonds + corpus + build + manifest
npm run build
npm run lint           # optionnel — ~33 erreurs préexistantes connues
```

Liste checks visuels normalisés : [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md).

Noter version : `build-revision.json` / console build.

---

## Smoke visuel — Core (5 min)

| # | Zone | Action | OK |
|---|------|--------|-----|
| 1 | Accueil | App charge sans écran blanc | ☐ |
| 2 | Ressources | Compteurs visibles | ☐ |
| 3 | Liens | Lancer 1 conversation (Lyra aff1) | ☐ |
| 4 | Chasse | Entrer biome connu, fond visible | ☐ |
| 5 | Dressage | 1 Myrion chibi visible | ☐ |
| 6 | Gacha | Ouvrir UI (pas obligé pull) | ☐ |
| 7 | Compagnon | Portrait layered ou fallback | ☐ |

---

## Smoke assets — après promote/migration

| # | Check | Comment |
|---|-------|---------|
| A1 | Network 404 images | DevTools → filtrer png/webp |
| A2 | Compagnon test ID | `talia` affinity 1–3 |
| A3 | Emotion cutout | si promote : 1 emotion en galerie |
| A4 | Myrion cutout | `moussprout` ou biome actif |
| A5 | Biome background | capture scene |
| A6 | Gacha cinéma | frames Disagrea si touché |
| A7 | Legacy path | `/companions/` rewrite still works |

---

## Smoke Disagrea (si event touché)

| # | Check |
|---|-------|
| D1 | Bannière event visible |
| D2 | Guest companions portrait (etna/flonne/laharl/pleinair) |
| D3 | Biome disagrea-event capture |
| D4 | 1 Myrion Disagrea chibi dressage |

Doc détaillée : `docs/TNR_EVENT_DISAGREA.md`

---

## Smoke stable launcher (si deploy/ touché)

```bash
npm run build:stable:prod   # si demandé
npm run launcher:stable     # profil surveillance
```

Dashboard `8789` — pas de crash node.

---

## Régression silencieuse — grep rapide

```bash
# chemins hardcodés public/ (exemples)
rg "public/assets/companions" src --glob "*.ts"
rg "public/companions/" src --glob "*.ts"
rg "404" src/components --glob "*.tsx" -i
```

---

## Rapport TNR

Copier ce template dans `docs/traceability/tnr/tnr-YYYY-MM-DD.md` :

```markdown
# TNR — {date} — {phase/lot}

## Commands
- build: OK/FAIL
- lint: OK/FAIL (N warnings)
- validate:link-corpus: OK/N/A

## Smoke
- Liens: OK/FAIL — notes
- Chasse: ...
- ...

## 404 found
- (list URLs)

## Blockers
- ...

## Sign-off
- [ ] Prêt étape suivante
```

---

## Échec = stop

Si build FAIL ou 404 critique gameplay → **ne pas** enchaîner lot suivant. Fix ou rollback depuis `origin/Backup`.
