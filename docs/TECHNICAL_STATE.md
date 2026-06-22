# État technique — IDLE Isekai Chill

> Dernière mise à jour : 2026-06-22

## Environnement

| Élément | Version / détail |
|---------|------------------|
| Node | v24+ (ESM natif) |
| Package manager | npm |
| TypeScript | ~6.0, mode strict (`tsconfig.app.json`) |
| Vite | ^8.0.12, plugin React 6 |
| ESLint | 10, flat config |

## Scripts npm (`package.json`)

| Script | Rôle |
|--------|------|
| `dev` | Serveur dev Vite (port 5173) |
| `build` | `tsc -b && vite build` |
| `lint` | ESLint |
| `preview` | Preview build prod |
| `generate:assets` | PNG procéduraux compagnons/village (**skip si portrait existant**) |
| `restore:companions` | Restaure portraits IA depuis `public/generated-backup/` |
| `import:village` | Import panorama + spritesheet utilisateur → `villageMap.ts` |
| `sync:village-map` | Regénère `villageMap.ts` depuis `scripts/assets/village-map-layout.mjs` |
| `generate:minigame-svgs` | SVG palmon + biomes |
| `generate:dialogues` | `companionScenarios.generated.ts` (200 scénarios/compagnon) |
| `import:myrions` | Pack Myrions → catalogue + PNG public |
| `import:talia` | Pack compagnon Talia (chibi + guides biome) |
| `import:chibis` / `import:chibis-9` | Chibis Myrions |
| `vectorize:chibi` | Vectorisation PNG → SVG |
| `setup:live2d` | Assets démo Live2D Haru |

**Manquant dans package.json :** `generate:gacha-video` (script présent : `scripts/build-gacha-video.mjs`).

## Architecture applicative

```
main.tsx → App.tsx (état global GameState)
              ├── AppNav (12 vues)
              ├── ResourceStrip, PopulationPanel
              ├── VillagePanorama + VillageMapLabels
              ├── InventoryPanel, QuestBoard, GachaOpening
              ├── Companion cards + CompanionStatsPanel
              └── MinigamePlayer (lazy par type)
```

### État global (`GameState` — `App.tsx`)

```typescript
{
  resources, buildings, companions, companionFragments, statTokens,
  eventPulls, maturePlaceholders, lastSaved,
  minigameSave,  // MinigameSave (version 4)
  quests,        // { board, totalClaimed }
  village        // population / stage
}
```

### Persistance

- **Clé :** `idle-isekai-chill-game-v1`
- **Format :** JSON sérialisé dans `localStorage`
- **Chargement :** `loadInitialSession()` — merge defaults, migration `bonusStatPoints` → jetons charm, merge `minigameSave`
- **Sauvegarde :** `useEffect` sur chaque mutation `game`
- **Offline :** `applyOfflineProgress()` au boot (max 168 h)

### Sous-save mini-jeux (`minigameSave.ts`)

- `MINIGAME_SAVE_VERSION = 4`
- Contient : pets, farm plots, refuge, chasse active, œufs, favoris, liens compagnon-Myrion, craft, etc.
- Migration : reset collection pets si version < 4 (`PET_COLLECTION_RESET_VERSION`)

## Modules data (`src/data/`)

### Générés (ne pas éditer à la main)

| Fichier | Générateur |
|---------|------------|
| `myrionsCatalog.generated.ts` | `npm run import:myrions` |
| `conversations/companionScenarios.generated.ts` | `npm run generate:dialogues` |

### Hand-written (principaux)

| Module | Responsabilité |
|--------|----------------|
| `gacha.ts` | Pool, pity, rolls, flags dev |
| `buildingActivities.ts` | 29 activités → 14 types mini-jeux |
| `villageMap.ts` | Panorama 12800×4263, slots pancartes |
| `population.ts` | Besoins, stades village |
| `companionStats.ts` / `companionFragments.ts` | Stats, fragments (10 = +1 stat) |
| `companionAssets.ts` | Chemins portraits / chibi |
| `inventoryView.ts` | Snapshot inventaire UI |
| `wildFamiliars.ts` | Biomes, espèces, raretés |
| `myrionRefuge.ts` | Refuge, enclos, `MAX_SPECIES_COPIES = 10` |
| `myrionMvp2.ts` | Faveurs chasse, buffs support, comparaison |
| `myrionMvp3.ts` | Reproduction, œufs, compatibilité |
| `myrionCompanionLinks.ts` | Liaison Myrion ↔ compagnon |
| `captureHunt.ts` | Logique chasse / capture |
| `minigameAssets.ts` | Chemins `/minigames/...` |

## Assets (`public/`)

| Dossier | Convention |
|---------|------------|
| `companions/<id>/affinity-{1-5}.png` | Portraits compagnons |
| `companions/<id>/chibi.png` | Miniature (Talia seulement) |
| `village/panorama-base.webp` | Panorama village actif (12800×4263, ~1.6 MB WebP) |
| `village/buildings-map/<id>.png` | Sprites bâtiments |
| `minigames/palmons/{species}.png` | Sprites Myrions |
| `minigames/palmons/chibi/{species}.png` | Chibis Myrions |
| `minigames/biomes/{biome-id}.png` | Fonds biome |
| `minigames/enclosures/{biome-id}.png` | Enclos refuge |
| `minigames/guides/talia-point-*.png` | Guide Talia par biome |
| `gacha/cinema/opening.mp4` | Vidéo ouverture gacha |
| `generated-backup/` | Backup portraits IA compagnons |

Staging (non servi) : `assets/myrions-import/`, `assets/talia-import/`, `assets/village-layout/`.

## Vite config (`vite.config.ts`)

- Watch ignore : `.tmp/`, `.tools/`, `assets/`
- Pre-bundle : `@pixi/cubism4` pour Live2D
- Hosts tunnel autorisés

## État build / lint (2026-06-22)

### `npm run build` — **ÉCHEC**

```
src/components/minigames/DressageGame.tsx(50,10): TS6133 'applyCraftRecipe' unused
src/components/minigames/DressageGame.tsx(496,10): TS18048 'comparison.weakestDuplicate' possibly undefined
src/components/minigames/FamiliarCaptureGame.tsx(41,1): TS6133 'normalizeRefugeBiomeId' unused
src/components/minigames/FamiliarCaptureGame.tsx(204,32): TS18048 'minigameSave' possibly undefined
src/data/myrionMvp2.ts(504,9): TS6133 'siblings' unused
src/data/myrionMvp2.ts(513,9): TS6133 'protectFromAutoRelease' unused
src/data/myrionMvp3.ts(277,5): TS2322 Compatibility 'blocked' not assignable
src/data/myrionMvp3.ts(380,58): TS6133 'parentB' unused
```

### Tests automatisés

- **Aucun** (pas de vitest/jest/playwright)
- Validation dialogues : `node scripts/validate-conversations.mjs`

## Dette technique

1. **Monolithe `App.tsx`** (~1670 lignes) — handlers, types, données inline
2. **Flags dev hardcodés** — gacha gratuit, mini-jeux débloqués, debug refuge
3. **Build cassé** — bloque CI / release
4. **Pas de tests** — régression manuelle uniquement
5. **État git** — énorme volume non commité (Myrions PNG, scripts, village)
6. **Duplication layout village** — `villageMap.ts` vs `scripts/assets/village-map-layout.mjs`
7. **README obsolète** — mentionne placeholders CSS compagnons (remplacés par IA)
8. **Panorama upscalé** — 12800 px depuis source 1024 px (artefacts possibles)

## Séparation des rôles (chantier)

- **Phase 1 (actuelle) :** documentation — aucun changement fonctionnel
- **Phases suivantes :** nettoyage, TNR, stabilisation P0/P1, pipeline assets — voir `TODO_PRIORITIZED.md`
