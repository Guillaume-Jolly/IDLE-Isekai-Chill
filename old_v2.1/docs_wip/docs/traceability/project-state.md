# État projet (remplace `.ai/current-state`)

Updated: 2026-06-26 (session nuit — suite directe)

## Session en cours (agent direct, pas subagent)

| Ajout | Détail |
|-------|--------|
| Chapitres story | +7 (Maeve, Solène, Mira, Elwen, Kael, Sora, Korren) → **25 chapitres** total |
| Compagnon **Korren** | Renard rôdeur (M), portrait IA, Liens, chapitre |
| Hub mini-jeux | Fonds sur cartes (`hubAssets.ts`) — library, farm, theater, spring |
| Build | ✅ |

## Baseline

- **Branche :** `main` — Assets 2.0 (`2.0.0`, commit `664d2a0`)
- **Build :** `npm run build` ✅ (session overnight)
- **Prod visuelle :** `assets/` — runtime via `vite.repo-assets.ts`
- **Archive :** `old_assets/` (~778 Mo, tri finalisé)
- **Coordination agents :** `.ai/` désactivé — voir `.ai/README.md`

---

## Backlog consolidé — statut session overnight

### Déjà fait (vérifié, ne pas refaire)

| Item | Statut |
|------|--------|
| B4 ConversationGame cutouts + biome BG + animations | ✅ |
| Intime bed v2→aff4, v3→aff5 (15 villageois) | ✅ promu |
| old_assets flatten (211 moves) | ✅ |
| Palmon SVG scripts retirés | ✅ |
| Manifests gacha-opening, talia-pack, plan-asset-moves | ✅ |
| `.ai/` nettoyé / désactivé | ✅ |
| staging/input guardrails doc | ✅ |
| StoryReader + sceneGenerator fondations | ✅ |
| Cahier des charges + scene-generator-schema | ✅ |

### A. Story & gameplay

| Item | Statut |
|------|--------|
| 4–6+ chapitres SceneChapter JSON | ✅ **25 chapitres** dans `src/data/story/chapters/` |
| Registry `src/data/story/registry.ts` | ✅ 25 chapitres enregistrés |
| VillageStoryPanel + hub mini-jeux | ✅ `VillageStoryPanel` dans `MinigameHub` |
| Bouton « Histoire » onglet Liens (affinité) | ✅ `App.tsx` |
| Branch Lyra (encre froide + deuxième marge) | ✅ |
| Disagrea interactif (Etna, Flonne×2, Laharl) | ✅ |
| Corpus B1–B3 (7500 scénarios R2/R3, dedup) | ❌ hors scope session — voir `staging/planning/conversation-v2-fix-backlog.md` |

### B. Nouveaux compagnons non-humains

| ID | Archétype | Données | Art affinité/cutouts/chibi |
|----|-----------|---------|----------------------------|
| `brann` | Golem artisan (M) | ✅ App, profiles, fragments, activities | ✅ `assets/Compagnons/brann/` |
| `thorne` | Dragonkin érudit (M) | ✅ | ✅ |
| `nyx` | Fae-lune (F) | ✅ | ✅ |
| `marin` | Merfolk corallien | ✅ | ✅ |
| `korren` | Renard rôdeur (M) | ✅ | ✅ |

### C. Assets & pipelines

| Item | Statut |
|------|--------|
| Hub mini-jeux art (3 PNG) | ⏳ **4 fonds** branchés sur cartes hub (`arcane-library`, `moon-farm`, `traveler-theater`, `clear-spring`) |
| Etna intime bed staging | ✅ vérifié `staging/companion-visual-pack/intime-bed-batch/MANIFEST.json` (70 PNG, Etna variants) |
| `minigame-asset-paths.mjs` post-flatten | ✅ chemins `assets/Compagnons`, `assets/Background`, `assets/Myrions` |
| `public/generated-backup/` | ✅ absent (rien à supprimer) |
| Docs phase5 / global-2.0 / TODO | ⏳ note de renvoi ci-dessous |

### D. Skinline premium

| Item | Statut |
|------|--------|
| Gameplay skinline | ⏸️ skip — design options dans `staging/skinline-premium/README` |

### E. Minigames cahier des charges

| Item | Statut |
|------|--------|
| Prototype chill OU polish StoryReader | ✅ polish : affinité → chapitres débloqués + StoryReader |

### F. TNR & qualité

| Item | Statut |
|------|--------|
| `npm run build` | ✅ |
| `tnr-checklist-status` | ✅ mis à jour |
| Lint fichiers touchés | ⏳ lint global 8 erreurs pré-existantes |

### G. SKIP (confirmé)

| Item | Statut |
|------|--------|
| old_assets export D: | skip |
| `.ai/` backlog system | skip |
| Commit sans accord user | skip |
| Auto-promote staging → assets | skip |

---

## Fichiers clés ajoutés / modifiés (session)

- `src/data/story/chapters/*.json` (18 chapitres)
- `src/data/story/registry.ts`
- `src/components/story/VillageStoryPanel.tsx`
- `src/data/conversations/starterCorpus.ts`
- `src/App.tsx`, `buildingActivities.ts`, `profiles.ts`, `companionFragments.ts`
- `staging/manifests/new-companions-2026-06-25.json`

## Validation

```bash
npm run build
npm run validate:link-corpus
npm run tnr:baseline
```

## Garde-fous

- `staging/` et `Input chatgpt/` = travail temporaire — pas d’auto-promote
- Ne jamais supprimer visuels — archiver dans `old_assets/`

## Docs stale — renvoi

- `docs/TODO_PRIORITIZED.md` — priorité story + nouveaux compagnons traitée cette session
- `docs/traceability/audits/global-2.0-readiness-audit.md` — prod assets 2.0 stable ; story pack shippé
- `phase5-main-v2-baseline.md` — non trouvé dans repo ; baseline = `tnr-checklist-status`
