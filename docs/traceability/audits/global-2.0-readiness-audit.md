# Relecture globale — readiness V2 (avant main)

**Date:** 2026-06-25  
**Statut:** revue collaborative avec Guillaume — **aucun push `main` autorisé sans go explicite**

---

## Synthèse exécutive

1. **Phases 0–3 assets** : faites localement (~1037 fichiers modifiés, **non commités**).
2. **`main` remote intact** — jamais écrasé ; `origin/main` ≠ branche locale actuelle.
3. **Dette immédiate** : ~606 PNG miroirs sous `public/assets/` (~189 Mo) — Vite sert déjà depuis `assets/`.
4. **`linkCorpusV2.json`** ~40 Mo — candidat #1 découpage (hors scope assets).
5. **WebP** : reporté (assessment phase4) — OK pour baseline.
6. **Lint** : 8 erreurs + 13 warnings pré-existants (`lootExplain.ts`, `useGameSettings.tsx`, `vite-env.d.ts`, `GachaOpening.tsx`, …) — fix ou waiver explicite.
7. **Docs** : ~82 `.md` utiles (`docs/` 21, `staging/` 25, `.ai/` 14) — consolidation P1 ; playbooks 05/PHASE0 légèrement stale.
8. **Playbooks** : 00–06 OK ; pas encore de playbook « commit baseline / main ».
9. **Commit baseline** : d'abord commit local + Backup ; **main seulement après ce checklist validé ensemble**.

---

## État git (à valider)

| Point | État |
|-------|------|
| Branche locale | `feature/link-corpus-v2` |
| Dernier commit local | `06961a1` Phase 0 backup snapshot |
| `origin/main` | `56de371` — **non modifié par la migration** |
| Working tree | ~1037 fichiers changed (Phases 2–3) |
| `Input chatgpt/` | ⚠️ 1 suppression détectée dans git status — **à restaurer / exclure** |

---

## Matrice fait / reste

| Domaine | Fait | Reste |
|---------|------|-------|
| Inventaire assets | ✅ manifest + script | regénérer post-commit |
| Playbooks dev | ✅ 00–06 | — |
| Migration `assets/` | ✅ Gacha, Background, Myrions, Compagnons | miroirs `public/assets/` |
| Vite single-root | ✅ `vite.repo-assets.ts` | fusionner legacy rewrites plus tard |
| WebP | ⏸ DEFER | selective si perf mobile |
| Découpage code | ❌ | linkCorpusV2, Minigames.css, gros composants |
| Corpus qualité | audit staging | 7500 scénarios, répétition templates |
| MD consolidation | ❌ | voir section docs |
| Lint clean | ❌ | 8 errors |
| Commit + main | ❌ | **bloqué — go user requis** |

---

## P0 — avant tout commit baseline

- [ ] **Restaurer / clarifier** `Input chatgpt/` (règle : ne pas toucher)
- [ ] **TNR fresh** : build + validate:link-corpus sur working tree actuel
- [ ] **Smoke visuel** manuel (chasse, dressage, Liens, gacha, Disagrea, Talia guide)
- [ ] Décider : **commit unique** vs 2 commits (assets + docs)
- [ ] Push **`Backup`** avant commit si gros diff

## P1 — pour une V2 « propre »

- [ ] Archiver ~606 miroirs `public/assets/**/*.png` (~189 Mo) → `old_assets/public-assets-mirror-2026-06-25/`
- [ ] Réduire `public/` au shell statique (index, favicon, redirect READMEs)
- [ ] Corriger 8 lint errors (quick wins)
- [ ] Plan découpage `linkCorpusV2.json` (lazy load / split par compagnon)
- [ ] Fusionner `.md` éparpillés : `.ai/` Codex legacy → archive ou playbook annexe

## P2 — après baseline stable

- [ ] Découpage `Minigames.css` (155 KB), gros TSX si besoin
- [ ] Brancher emotion cutouts en UI conversation (backlog B4)
- [ ] Hub presentations/stages quand assets existent
- [ ] WebP selective biomes si perf

---

## Découpage fichiers (candidats)

| Fichier | Taille | Risque | Piste |
|---------|--------|--------|-------|
| `src/data/linkCorpusV2.json` | ~40 MB / ~765k lignes | Haut | chunk externe / lazy load |
| `src/data/conversations/companionScenarios.generated.ts` | ~5 MB | Haut | idem corpus |
| `src/components/minigames/Minigames.css` | 7 509 lignes | Moyen | split par feature |
| `src/App.tsx` | 1 888 lignes | Moyen | handlers / panels / routing |
| `vite.repo-assets.ts` | ~14 KB | Bas | OK pour l'instant |

---

## Docs `.md` — inventaire rapide

| Dossier | Count | Action proposée |
|---------|-------|-----------------|
| `staging/` | 25 | garder — source playbooks/planning |
| `docs/` | 22 | garder — doc produit |
| `.ai/` | 14 | nettoyer Codex/heartbeat obsolètes → `staging/planning/archive/` |
| `public/` | 8 | README redirects — garder |
| racine | 3 | `AGENTS.md`, `README.md`, `REPO_SEPARATION.md` |
| `assets/` | 8 | README par lot — OK |

---

## Process dev (playbooks vs réalité)

| Workflow | Playbook | Gap |
|----------|----------|-----|
| Nouveau compagnon | 01 | OK |
| Gacha event | 02 | OK |
| Cutouts / NSFW | 03 | promote stoppé — OK |
| Promote assets | 04 | scripts à jour post phase 3 |
| Migration | 05 | doc stale (« go phase 2 ») — à mettre à jour |
| TNR | 06 | smoke phase 3 jamais coché manuellement |
| Commit baseline | — | **manquant** — playbook 07 à créer |

---

## Checklist « go main » (à cocher ensemble)

1. TNR green (build + validate:link-corpus)
2. Smoke visuel OK
3. Commit(s) sur branche feature
4. Backup push OK
5. Liste miroirs `public/assets/` traitée ou acceptée
6. Lint : fix ou accepté explicitement
7. **Go explicite Guillaume** : `git push origin HEAD:main --force`

---

## Ordre de session recommandé

1. Ce document — validation points P0 avec user
2. Fix Input chatgpt + TNR
3. Commit baseline local
4. Push Backup
5. Décider miroirs public/assets (P1)
6. Lint quick fix (optionnel avant commit)
7. **Seulement alors** — discussion push main
