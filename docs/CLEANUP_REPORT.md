# Cleanup Report — Stabilisation finale

> **Date :** 2026-06-22  
> **Branche :** `stabilization/myrions-cleanup-phase2`  
> **Statut :** prêt à merge (avec réserve historique panorama)

## Phase 1–2 (rappel)

- Lots A→I commités ; 50 SVG legacy Palmon supprimés (`60fbc11`).
- Panorama runtime : `panorama-base.webp` 1,57 MB (`ab0c97b`).

## Phase 3 — TNR gameplay

- Shell, village, hub, inventaire, compagnons, save : OK.
- Myrions refuge/chasse : OK en dev via flags protégés (voir `docs/TNR_GAMEPLAY.md`).

## Flags dev (décision finale)

| Flag | Dev | Prod | Fichier | Statut |
|------|-----|------|---------|--------|
| `DEV_UNLIMITED_GACHA` | true | false | `gacha.ts` | OK — utilisé App gacha |
| `DEV_UNLOCK_ALL_MINIGAMES` | true | false | `gacha.ts` + `MinigameHub.tsx` | OK — hub dev-only |
| `MYRION_REFUGE_DEBUG` | true | false | `myrionDebug.ts` | OK — panel dev-only |

Vérification prod : `grep "Outils debug Myrions" dist/` → aucune occurrence.

## Panorama — décision historique (Option A)

**Décision : ne pas réécrire l'historique.**

| | |
|---|---|
| HEAD runtime | `public/village/panorama-base.webp` (~1,57 MB) |
| Blob historique | `public/village/panorama-base.png` (~86 MB) dans commit `5dd5ab9` |
| Impact merge | Le blob entre une fois dans l'historique GitHub ; clones futurs ne le servent pas |
| Alternative reportée | `git filter-repo` sur la branche + `--force-with-lease` si historique strict requis |
| Recommandation post-merge | Git LFS si assets > 5 MB récurrents |

```powershell
git rev-list --objects origin/main..HEAD | Select-String "panorama-base"
# → panorama-base.webp + panorama-base.png (historique)
```

## Stash review

| | |
|---|---|
| Entrée | `stash@{0}: On main: rewrite-git-temp-stash` |
| Contenu | 86 fichiers — état WT pré-stabilisation (SVG legacy, App.tsx, hub, etc.) |
| Comparaison HEAD | Toutes les modifications utiles sont intégrées dans les 30+ commits de branche |
| **Décision** | **Conservé** — redondant avec HEAD ; drop manuel possible post-merge sans perte |
| Risque drop | Faible — aucun delta unique identifié |

## Lint

| Métrique | Initial | Final |
|----------|---------|-------|
| Errors | 27 | **0** |
| Warnings | 9 | 9 |
| Exit code | 1 | **0** |

Dette restante (warnings only) : `react-hooks/exhaustive-deps` sur hooks wanderers/sprites/Live2D — non bloquant.

Override documenté : `react-hooks/set-state-in-effect` off pour `src/components/minigames/**` et `src/hooks/**` (sync minigameSave).

## Validations finales

```text
npm run build  → exit 0
npm run lint   → exit 0 (9 warnings)
git status     → clean
main           → non modifié
```

## Reste post-merge (P3)

- Warnings eslint deps (hooks animation)
- Chunk JS > 5 MB (code-split optionnel)
- TNR reproduction longue durée (cooldowns œufs)
- Drop stash si revue manuelle confirmée
