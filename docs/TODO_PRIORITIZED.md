# TODO priorisé — IDLE Isekai Chill

> Backlog actionnable issu de l'audit 2026-06-22.  
> Priorités : **P0** bloquant · **P1** important · **P2** amélioration · **P3** plus tard

---

## P0 — Bloquant release / CI

| ID | Tâche | Zone | Notes |
|----|-------|------|-------|
| P0-01 | Corriger 8 erreurs TypeScript build | `DressageGame`, `FamiliarCaptureGame`, `myrionMvp2/3` | `npm run build` doit passer |
| P0-02 | Valider save/load après corrections | `App.tsx`, `minigameSave.ts` | Ne pas casser saves existantes |
| P0-03 | Exécuter TNR zones touchées | voir `TNR.md` (Phase 3) | Manuel minimum |

---

## P1 — Stabilisation & maintenabilité

| ID | Tâche | Zone | Notes |
|----|-------|------|-------|
| P1-01 | Désactiver flags dev (`DEV_*`, `MYRION_REFUGE_DEBUG`) | `gacha.ts`, `myrionDebug.ts` | Config env ou constante build |
| P1-02 | Commit atomique du travail en cours | git | Myrions PNG, village, scripts — **hors scope Phase 1** |
| P1-03 | Documenter migration save v4 | `minigameSave.ts`, docs | Rétrocompat ou backup warn |
| P1-04 | Vérifier limite 10 exemplaires / espèce | `myrionRefuge.ts`, capture UI | TNR capture-03 |
| P1-05 | Vérifier éclosion œufs + reproduction | `myrionMvp3`, `EchoNursery` | TNR egg-* |
| P1-06 | Vérifier liaison Myrion ↔ compagnon + buffs | `myrionCompanionLinks`, `myrionMvp2` | TNR link-* |
| P1-07 | Vérifier faveurs chasse actives | `myrionMvp2`, `HuntActiveFavorsPanel` | TNR hunt-* |
| P1-08 | Ajouter `generate:gacha-video` à package.json | `package.json` | Script existe déjà |
| P1-09 | Aligner README avec état réel (portraits IA, village) | `README.md` | Doc drift |

---

## P2 — Qualité & UX

| ID | Tâche | Zone | Notes |
|----|-------|------|-------|
| P2-01 | Panorama village : source native ≥12800 ou recalibrer pancartes | `villageMap.ts`, assets | Actuellement upscale ×12.5 |
| P2-02 | Extraire `COMPANIONS` / `BUILDINGS` de App.tsx | `src/data/` | Sans refactor massif |
| P2-03 | Chibi pour tous compagnons (ou fallback affinity-1) | `companionAssets.ts` | Seule Talia a chibi |
| P2-04 | Nettoyage résidus dev (Phase 2) | src/, scripts/ | Voir `CLEANUP_REPORT.md` |
| P2-05 | Créer TNR checklist exécutable | `docs/TNR.md` | Phase 3 |
| P2-06 | Vidéo gacha fluide (remplacer slideshow) | `public/gacha/cinema/` | ChatGPT assets + ffmpeg script |
| P2-07 | Calibrer économie gacha sans mode dev | `gacha.ts` | Balance tickets / pity |
| P2-08 | Tests unitaires cibles (save merge, capture limit, fragments) | nouveau `tests/` | Vitest minimal |

---

## P3 — Évolutions futures

| ID | Tâche | Zone | Notes |
|----|-------|------|-------|
| P3-01 | PWA (manifest + service worker) | public/, vite | README roadmap |
| P3-02 | Quêtes quotidiennes sans FOMO | nouveau module | Design à valider |
| P3-03 | Paliers affinité 4–5 assets finaux | `public/companions/` | ChatGPT + validation contenu |
| P3-04 | Bâtiments futurs (caserne, etc.) | `cityArchetypes.ts` | Population security |
| P3-05 | Unifier layout village (single source) | `villageMap.ts` ↔ layout script | Éviter drift |
| P3-06 | CI GitHub Actions (build + lint + validate-conversations) | `.github/` | Après P0-01 |
| P3-07 | Inventaire assets unused (sans suppression auto) | `docs/ASSETS_PIPELINE.md` | Phase 5 |

---

## Phases chantier (suivi)

| Phase | Statut | Commit attendu |
|-------|--------|----------------|
| 1 — Audit & doc | ✅ En cours | `docs: document current project state` |
| 2 — Nettoyage | ⏳ Attente validation | `chore: clean obsolete development leftovers` |
| 3 — TNR | ⏳ | `test: add non-regression checklist` |
| 4 — Stabilisation P0/P1 | ⏳ | `fix: stabilize …` (3 commits max) |
| 5 — Pipeline assets | ⏳ | `docs: document visual assets pipeline` |
| 6 — Rapport final | ⏳ | `docs/CHANGELOG.md` |

---

## Décisions en attente (validation humaine)

1. **Commit du gros volume untracked** — quels dossiers inclure (Myrions PNG ~170 fichiers, village, scripts) ?
2. **Panorama 12800** — garder upscale ou attendre source native ?
3. **Flags dev** — désactiver maintenant ou garder jusqu'à fin playtest ?
4. **Suppression assets** — aucune sans liste validée (Phase 5)
