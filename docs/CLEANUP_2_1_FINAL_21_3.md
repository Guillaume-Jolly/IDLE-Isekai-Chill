# Cleanup 2.1 — Rapport final MVP 21.3

> ⚠️ **Document historique** — décrit l’état **avant** merge final. Push / PR / merge : **terminés** (PR #3, tag `v2.1.0.0`).  
> **Voir :** [`DOC_AGENT_INDEX.md`](./DOC_AGENT_INDEX.md) · [`RELEASE_2_1_DELIVERY_REPORT.md`](./RELEASE_2_1_DELIVERY_REPORT.md) §14.

**Date :** 2026-06-30  
**Objectif :** Figer l’état post-cleanup, valider, pousser la branche release 2.1, préparer la PR — sans merge.

---

## 1. Objectif

Synchroniser les commits locaux post-release (`bf2df63` … `0bdb60d`) vers `origin/feature/myrion-worksite-mvp2` et documenter l’état final prêt pour revue Guillaume.

---

## 2. HEAD initial

`0bdb60d` — `chore(cleanup): validate post-2.1 archive state`

Chaîne locale post-release :

| Commit | Message |
|--------|---------|
| `bf2df63` | chore(release): prepare havre des brumes 2.1 |
| `16dc8be` | docs: finalize release 2.1 delivery report |
| `d4bb3d0` | chore(cleanup): archive post-2.1 out-of-scope files |
| `0bdb60d` | chore(cleanup): validate post-2.1 archive state |
| *(ce rapport)* | docs: add final post-2.1 cleanup report |

---

## 3. Status Git initial

**Propre** — aucun fichier modifié avant rapport 21.3.

(`asset-manifest.json` régénéré par `tnr:baseline` pendant validation → restauré à HEAD pour conserver un arbre propre ; contenu inchangé fonctionnellement.)

---

## 4. Validations finales

| Commande | Résultat |
|----------|----------|
| `npm run validate:companion-bonds` | **OK** — 19 compagnons, 190 conversations |
| `npm run validate:link-corpus` | **OK** — 7500 conversations |
| `npm run tnr:baseline` | **OK** — build + corpus + manifest |
| `npm run build` | **OK** (via tnr:baseline) |

**Lint :** non lancé (33 issues préexistantes documentées — hors scope).

---

## 5. Résultat build

```
[Havre des Brumes] Build v2.1.0.128 (0bdb60d)
✓ built in ~6.6s
```

Warning chunk > 500 kB — connu, non bloquant.

---

## 6. État `old_v2.1/`

| Métrique | Valeur |
|----------|--------|
| Fichiers archivés | 456 (incl. manifests + README post-21.1) |
| Opérations documentées | 70 (manifeste MVP 21.1) |
| Stub `.ai/` actif | `.ai/` à la racine (MVP 21.2) |
| Archive historique `.ai` | `old_v2.1/ai_work/.ai/` |

Références : [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md), [`CLEANUP_2_1_VALIDATION_21_2.md`](./CLEANUP_2_1_VALIDATION_21_2.md).

---

## 7. Confirmation aucune suppression définitive

**Aucune suppression** (`rm`, `del`, etc.) à aucune étape MVP 21.1–21.3.  
Archivage uniquement via `git mv` / `mv` vers `old_v2.1/`.

---

## 8. Status Git avant push

Propre après commit de ce rapport.

---

## 9. Push status

Commande exécutée en fin de MVP 21.3 :

```bash
git push origin feature/myrion-worksite-mvp2
```

*(Résultat consigné dans le résumé agent / historique remote.)*

---

## 10. PR status

**GitHub CLI (`gh`) :** non disponible sur l’environnement d’exécution.

**Création manuelle :**  
https://github.com/Guillaume-Jolly/IDLE-Isekai-Chill/pull/new/feature/myrion-worksite-mvp2

**Titre recommandé :** Release 2.1 — Ferme lunaire étendue, biomes et liens compagnons

**Ne pas merger** sans validation explicite de Guillaume.

### Corps PR suggéré

- Release Havre des Brumes **2.1.0**
- Ferme lunaire : 15 biomes, 45 filons, assets, placement, surveillance, prestige LR
- Compagnons : 19 compagnons, 190 conversations de lien, 5 paliers
- Gameplay : guidance, consolidation, terminologie Myrions / Ferme lunaire
- Cleanup : archive `old_v2.1/` non destructive + stub `.ai/`
- Validations : bonds OK, corpus OK, tnr:baseline OK, build OK
- Lint : KO préexistant (33) — documenté
- Réserves : TNR 45 filons complet en dev/save riche ; `ruines-lierre-ancien.png` ; chunk size
- Docs : `CHANGELOG_2_1.md`, `TNR_RELEASE_2_1_MVP20.md`, `RELEASE_NOTES_2_1.md`

---

## 11. Recommandation MVP 22

1. **Merge PR** après smoke test Guillaume sur build `v2.1.0.128`.
2. Tag optionnel `v2.1.0`.
3. `build:stable:prod` si déploiement stable prévu.
4. Backlog : lint cleanup, code-split bundle, regen asset lierre si besoin.
5. Intégrer WIP depuis `old_v2.1/` par lots séparés (compagnons, story, hub assets).

---

## Verdict

**Release 2.1 post-cleanup : prête pour revue PR** — build et validations OK, branche synchronisable, merge sous validation Guillaume uniquement.
