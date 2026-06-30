# Cleanup Report — Session refuge / chasse / inventaire

> **Date session :** 2026-06-23  
> **Projet :** IDLE Isekai Chill (`idle-isekai-chill-game`)  
> **Branche :** `main`  
> **HEAD départ session :** `0d70328` (docs: add mobile ui validation report)  
> **État départ :** 6 commits ahead origin/main, ~34 modifiés + ~48 untracked, non commité

---

## Phase 0 — État initial

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 34 |
| Fichiers untracked | 48 (incl. 16 PNG portrait, scripts, composants refuge/chasse) |
| Diff stat | +5035 / −1458 lignes |
| Commits ahead origin | 6 (docs + shell mobile, non pushés) |

### Périmètre détecté

- **Refuge** : panneau soins, biomes, récap, mobile, enclos portrait
- **Chasse** : captures pending, politique capture, HUD mobile
- **Inventaire** : familiers empilés par espèce / biome / rareté
- **Shell** : chrome mini-jeux, drawer, AppNav mobile
- **Infra** : build metadata (revision, build-info)
- **Assets** : PNG portrait biomes + enclos (~2 Mo/fichier)

### Risques immédiats (session départ)

1. `CaptureCompareResult` non importé dans `FamiliarCaptureGame.tsx` → **corrigé**
2. ESLint `prefer-const` dans `useEnclosureWanderers.ts` → **corrigé**
3. `Minigames.css` très volumineux — **documenté, pas splitté**
4. `public/build-info.json` généré à chaque build — **ajouté à .gitignore**
5. MyrionDebugPanel retiré du refuge, conservé en chasse (mode dev)

---

## Phase 1 — Build / lint

| Commande | Résultat |
|----------|----------|
| `npm run build` | ✅ exit 0 |
| `npm run lint` | ✅ exit 0 (12 warnings documentés, 0 errors) |

### Warnings lint (préexistants ou hooks, non bloquants)

- `Live2DDemo.tsx`, `ConversationGame.tsx` — exhaustive-deps
- `DressageGame.tsx` — exhaustive-deps (minigameSave, pets)
- `FamiliarCaptureGame.tsx` — exhaustive-deps (3)
- `useEnclosureWanderers.ts` — exhaustive-deps (2)
- `useRefugeCarePopoverAnchor.ts`, `useWanderingSprites.ts`
- `companionScenarios.generated.ts` — eslint-disable inutilisé

---

## Phase 2 — Tri untracked

### A. Inclus dans commits

- Composants refuge/chasse listés dans le plan de découpage
- `docs/BACKLOG.md`, `docs/MANUAL_TEST_REFUGE_HUNT_INVENTORY.md`
- Scripts portrait : `generate-*-portraits.mjs`, `import-enclosure-portraits.mjs`
- `scripts/bump-prompt.mjs`
- PNG portrait biomes + enclos (référencés par `minigameAssets.ts`, `myrionRefuge.ts`)
- Infra build : `vite.git-build-info.ts`, `build-revision.json`, hooks build version

### B. Exclus / gitignore

| Fichier | Raison |
|---------|--------|
| `public/build-info.json` | Généré à chaque build/dev (vite plugin) |

### C. Untracked à arbitrer (utilisateur)

| Fichier | Statut |
|---------|--------|
| `public/minigames/biomes/moon-meadow-portrait.png` | Biome legacy ID — vérifier usage vs `prairie-solaire` |

---

## Phase 6 — Risques sauvegarde

### Champs MinigameSave touchés

- `pendingHuntCaptures?: PendingHuntCapture[]` — normalisé au chargement via `normalizeMinigameSave`
- `huntAutoDecision?: HuntAutoDecisionSettings` — défaut `DEFAULT_HUNT_AUTO_DECISION`
- Champs refuge existants (`refugeResources`, `echoEggs`, `companionMyrionLinks`) — inchangés structurellement

### Inventaire

- Regroupement **affichage uniquement** — pas de modification structure `pets[]`

### Migration

- Pas de migration destructrice détectée
- `saveVersion` / `PET_COLLECTION_RESET_VERSION` inchangés dans cette session

---

## Phase 7 — Validation finale

*(Complété en fin de session — voir résumé assistant)*

---

## Session autonome 2026-06-23 (suite) — Phases 0–9

### Phase 0 — État initial

| Métrique | Valeur |
|----------|--------|
| Branche | `feature/link-corpus-v2` |
| HEAD | `47b2900` (Disagrea portraits, commits séparés) |
| `npm run build` | ✅ |
| `npm run lint` | ✅ (12 warnings) |
| `npm run validate:link-corpus` | ✅ 7500 scénarios |

### Fichiers hors scope (non commités, non supprimés)

| Zone | Nature |
|------|--------|
| `assets/event-disagrea/` | Catalog import Disagrea |
| `public/assets/minigames/` | Migration chemins assets |
| `src/components/CompanionPortrait.*` | Portraits composés (WIP) |
| `ConversationGame.tsx` (WIP) | UX Lien + portraits (non commité) |
| Centaines de `deleted:` sous `public/minigames/` | Relocalisation assets |

**Action :** laissé en working tree ; build OK avec ou sans (selon fichiers présents). Ne pas mélanger avec commits corpus/tutoriel.

### Commits session (sans push)

1. `docs: update link corpus validation results`
2. `feat(progression): add tutorial objectives for 0.10`
3. `docs: document 0.10 tutorial objective flow` (+ TNR, backlog phases 4–8)

### Phases non codées (documentées)

- Phase 4 exploitation passive → `EXPLOITATION_PASSIVE_BACKLOG.md`
- Phase 5 papouille refuge → reportée (stable d'abord)
- Phase 6 course → `RACING_MINIGAME_PROTOTYPE.md`
- Phase 7 combat → `MYRION_COMBAT_PROTOTYPE.md`
- Phase 8 donjon → `DUNGEON_EXPLORATION_BACKLOG.md`

---

## Notes CSS

- `Minigames.css` : ~+2300 lignes — **à splitter plus tard**, pas dans cette session

---

## Session 2026-06-23 — Corpus Lien v2 (branche `feature/link-corpus-v2`)

| Item | Statut |
|------|--------|
| Push `main` → origin | ✅ `bc4c118..56de371` |
| Branche feature | ✅ `feature/link-corpus-v2` |
| Corpus zip localisé | ❌ absent du repo |
| Intégration ConversationGame | ⏸ bloquée (corpus absent) |
| Scripts | ✅ `validate-link-corpus`, `import-link-corpus-v2` (scaffold) |
| Docs | ✅ `LINK_CORPUS_V2_AUDIT.md`, `MANUAL_TEST_LINK_CORPUS.md` |
| Push branche feature | ❌ (règle session) |
- Doublons potentiels entre `MinigameChrome.css`, `RefugeMobile.css`, `CaptureMobile.css` — pas de fusion risquée effectuée
