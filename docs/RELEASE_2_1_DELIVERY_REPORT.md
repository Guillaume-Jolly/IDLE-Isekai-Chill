# Rapport de livraison — Havre des Brumes 2.1

**Date :** 2026-06-30  
**MVP :** 21 — Release finale

---

## 1. Branche

`feature/myrion-worksite-mvp2`

---

## 2. Version cible

**2.1.0** (`package.json`) — label UI **v2.1.0.128** après `version:prompt` + build release.

---

## 3. HEAD final

À compléter après commit : voir `git log -1 --oneline`.

Commits release précédents sur la branche :
- `ca5ad07` — docs: add release 2.1 tnr report
- `34d1589` — fix(release): resolve blocking tnr issues
- (MVP 1–19 : voir `git log --oneline -n 30`)

---

## 4. Commits release MVP 21

| Commit | Message |
|--------|---------|
| *(ce livrable)* | `chore(release): prepare havre des brumes 2.1` |

Contenu prévu :
- `package.json` → 2.1.0
- `build-revision.json` → revision 128
- `docs/CHANGELOG_2_1.md`, `docs/RELEASE_NOTES_2_1.md`
- `docs/traceability/changelog/VERSION-INDEX.md`
- `docs/traceability/assets/asset-manifest.json` (regénéré tnr)
- `.cursor/rules/00-idle-isekai-core.mdc` (remplace Wonderland)

---

## 5. Validations finales

| Commande | Résultat | Détail |
|----------|----------|--------|
| `npm run validate:companion-bonds` | **OK** | 19 compagnons, 190 conversations |
| `npm run validate:link-corpus` | **OK** | 7500 conversations |
| `npm run tnr:baseline` | **OK** | build + corpus + asset manifest |
| `npm run build` | **OK** | v2.1.0.128 (via tnr:baseline) |
| `npm run lint` | **KO** | 33 problèmes préexistants — non bloquant |

---

## 6. Build result

```
[Havre des Brumes] Build v2.1.0.128 (ca5ad07)
✓ built in ~6s
```

Warning chunk > 500 kB — documenté, non bloquant.

---

## 7. Lint status

**KO** — 19 errors, 14 warnings (identique MVP 20). Non corrigé volontairement (hors périmètre 2.1).

---

## 8. Cleanup effectué

**Cleanup ciblé — classification, pas de suppression massive.**

### Groupe A — Intégré au commit release

- Versioning 2.1.0
- Changelog, release notes, VERSION-INDEX
- Asset manifest traceability (tnr:baseline)
- Règle Cursor Havre des Brumes (remplace Wonderland)

### Groupe B — Conservé hors commit (WIP / hors scope 2.1)

| Catégorie | Exemples |
|-----------|----------|
| Assets compagnons WIP | `assets/Compagnons/{brann,korren,marin,nyx,thorne}/` |
| Hub backgrounds WIP | `assets/Background/hub/` |
| Story WIP | `src/components/story/`, `src/data/story/` |
| Scene generator WIP | `src/data/sceneGenerator/` |
| Staging | `staging/myrion-worksite-mvp15/`, manifests JSON |
| Archives | `old_assets/**` (conservé, non versionné) |
| Coordination agent | `.ai/*` modifications locales |
| Docs MVP intermédiaires modifiés | `docs/MYRION_WORKSITE_MVP*.md` (drift local) |
| Build log temp | `build-output.txt` |

### Groupe C — Non supprimé (politique archivage)

Aucune suppression de fichiers assets ou archives.

### Groupe D — Documenté pour plus tard

- Lint préexistant (33)
- TNR 45 filons intégral preview prod
- Dev flags inactifs en preview prod
- `ruines-lierre-ancien.png` silhouette
- Corpus Parler B1–B3
- Chunk size warning
- Wording quêtes « Chantier du havre »

---

## 9. Fichiers volontairement laissés hors scope

Voir tableau Groupe B ci-dessus. Le working tree reste **dirty** avec WIP intentionnellement non commité.

---

## 10. Push status

À mettre à jour après `git push origin feature/myrion-worksite-mvp2`.

---

## 11. PR status

`gh` CLI non disponible sur l’environnement d’exécution.

**Action recommandée pour Guillaume :**
1. Ouvrir PR `feature/myrion-worksite-mvp2` → `main` (ou branche cible du dépôt)
2. Titre : **Release 2.1 — Ferme lunaire étendue, biomes et liens compagnons**
3. Corps : résumé 2.1, validations, réserves, liens changelog + TNR
4. **Ne pas merger** sans revue explicite

---

## 12. Réserves connues

Identiques à [`CHANGELOG_2_1.md`](./CHANGELOG_2_1.md) §7 et [`TNR_RELEASE_2_1_MVP20.md`](./TNR_RELEASE_2_1_MVP20.md).

---

## 13. Recommandation post-release

1. Merger la PR après smoke test manuel sur build `v2.1.0.128`.
2. Tag git `v2.1.0` optionnel.
3. `build:stable:prod` si déploiement stable prévu.
4. Backlog : lint cleanup, split chunks, regen `ruines-lierre-ancien.png`, intégrer assets WIP compagnons quand prêts.
5. Commit séparé futur pour WIP story / nouveaux compagnons — hors 2.1.

---

## Verdict final release 2.1

**Livré** — build et validations OK, documentation release complète, push branche feature autorisé. Merge prod sous validation Guillaume.
