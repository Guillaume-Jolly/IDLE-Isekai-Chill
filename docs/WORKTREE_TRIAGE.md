# Working Tree Triage — Phase 1.8

> **Date :** 2026-06-22 (mis à jour Phase 1.9)  
> **HEAD :** `e8911a3` — `feat: update companion inventory panels`  
> **Stash :** `stash@{0}` — `rewrite-git-temp-stash` (conservé, non droppé)  
> **Périmètre :** inventaire read-only du working tree ; Lot A commité en Phase 1.9.

### Phase 1.9 — Lot A (traité, partiel)

| Élément | Statut |
|---------|--------|
| Commit | `01ddfd0` — `refactor: simplify minigame hub navigation` |
| Fichiers commités | `MinigameHub.tsx`, `ConversationPicker.tsx`, `population.ts` (`BUILDING_UNLOCK_ORDER`) |
| Exclus volontairement | `gacha.ts` (`DEV_UNLOCK_ALL_MINIGAMES`), `App.css`, `CompanionMiniature` |
| CSS hub | Déjà sur HEAD dans `Minigames.css` (aucun diff WT) |
| Reste WT Lot A | `gacha.ts` — intégration flag dev hub (commit futur séparé, hors Phase 1.9) |

### Phase 1.10 — Lot C (traité)

| Élément | Statut |
|---------|--------|
| Commit | `e8911a3` — `feat: update companion inventory panels` |
| Fichiers commités | `InventoryPanel`, `CompanionStatsPanel`, `CompanionMiniature`, `inventoryView`, `companionAssets`, `resources` (`RESOURCE_ICONS`), `ImageLightbox.css`, CSS dédiés (`InventoryPanel.css`, `CompanionStatsPanel.css`, `CompanionMiniature.css`), `ConversationPicker` (portraits via `CompanionMiniature`) |
| Exclus | `App.css`, assets PNG, `InventoryChip.tsx`/`ResourceIcon.tsx`/`inventoryIcons.ts` (logique inlinée dans `InventoryPanel.tsx` + glyphes dans `inventoryView.ts`), `utils/tooltipPosition.ts` |
| Note | Chibi Talia : chemin `/companions/talia/chibi.png` documenté dans `companionAssets` ; PNG non commité — fallback affinity |

---

## 1. Résumé exécutif

| Métrique | Valeur |
|----------|--------|
| Fichiers **modifiés** tracked (`M`) | **23** (−3 vs Phase 1.8 : Lot A commité) |
| Fichiers **supprimés** tracked (`D`) | **50** |
| Entrées **untracked** (`??`, git status) | **~230** (fichiers + dossiers) |
| Fichiers réels sous `??` (estimation) | **~350–400** (dont `.tmp/` ≈ 116 fichiers) |
| Assets PNG untracked (estimation) | **~280** dans `public/` + sources dans `assets/*-import/` |
| Diff tracked global | **76 fichiers**, +2149 / −1628 lignes |
| Stash | **86 fichiers**, +2563 / −1822 lignes |

### Risques principaux

1. **Couplage fort App shell ↔ village ↔ inventaire ↔ hub** — `App.tsx` (+473 lignes refactor) importe des composants untracked (`AppNav`, `VillagePanorama`, `ResourceStrip`, `villageMap.ts`). Commit partiel = build cassé.
2. **Suppressions SVG legacy (Lot F) sans assets PNG commités (Lot G)** — 50 fichiers `D` ; les PNG Myrions correspondants sont untracked. Phase 2 cleanup SVG **avant** commit assets = régressions visuelles chasse/refuge.
3. **Flags dev dans le WT** — `gacha.ts` ajoute `DEV_UNLOCK_ALL_MINIGAMES = true` ; utilisé par `MinigameHub.tsx` et `App.tsx`. Ne pas committer sans décision explicite sur les flags dev.
4. **Stash partiellement obsolète** — contient des diffs déjà commités (`minigameSave`, `wildFamiliars`, `PalmonSprite`, etc.). `stash pop` = conflits probables.
5. **WT dirty masque l’état HEAD** — build commit-only vert sur `356698f`, mais dev local dépend du WT entier.

### Ordre de traitement recommandé

1. **Documenter** (ce fichier) → commit `docs: add working tree triage`
2. ~~**Lot A** — Hub UI refactor~~ ✅ Phase 1.9 (`01ddfd0`, partiel — flag dev reporté)
3. ~~**Lot C** — Compagnons / inventaire UI~~ ✅ Phase 1.10 (`e8911a3`)
4. **Lot B** — Village / App shell (gros lot, dépend des lots C partiellement)
5. **Lot D** — Runtime divers (petits diffs, commitables en slice)
6. **Lot G** — Assets PNG (commits séparés, avant Lot F)
7. **Lot H + E** — Scripts import + package/vite (après assets stabilisés)
8. **Lot F** — Suppressions SVG legacy (**Phase 2**, après validation PNG)
9. **Lot I** — `.gitignore` pour temporaires
10. **Lot J** — Revoir stash après slices commitées

---

## 2. Classification par lot

### Lot A — Hub UI refactor

| Chemin | Statut |
|--------|--------|
| `src/components/minigames/MinigameHub.tsx` | M |
| `src/components/minigames/ConversationPicker.tsx` | ?? |
| `src/data/population.ts` (`BUILDING_UNLOCK_ORDER`) | M |
| `src/data/gacha.ts` (`DEV_UNLOCK_ALL_MINIGAMES`) | M |

**Nature :** Refactor hub — cartes compactes, `MetaChip`, tri via `sortActivitiesByUnlock` (déjà commité en 1.7), picker conversations groupé, hint mode test.

**Dépendances :** `sortActivitiesByUnlock` (HEAD), `BUILDING_UNLOCK_ORDER` (WT), `ConversationPicker` (untracked), flag dev (WT).

---

### Lot B — Village / App shell

| Chemin | Statut |
|--------|--------|
| `src/App.tsx` | M |
| `src/App.css` | M (+1380 lignes) |
| `src/index.css` | M |
| `src/components/VillageMapLabels.tsx` | M |
| `src/components/VillagePanorama.tsx` | ?? |
| `src/components/VillageBuildingTooltip.tsx` | ?? |
| `src/components/AppNav.tsx` | ?? |
| `src/components/ResourceStrip.tsx` | ?? |
| `src/components/CompanionMiniature.tsx` | ?? |
| `src/data/villageMap.ts` | ?? |
| `src/utils/tooltipPosition.ts` | ?? |
| `public/village/hero-banner.png` | M |
| `public/village/panorama-*.png` | ?? (×8) |
| `public/village/buildings-map/` | ?? |
| `scripts/assets/village-art.mjs` | M |
| `scripts/assets/village-art-v1.mjs` | ?? |
| `scripts/assets/village-map-layout.mjs` | ?? |
| `scripts/generate-assets.mjs` | M |
| `scripts/build-village-layout-guide.mjs` | ?? |
| `scripts/finalize-village-panorama.mjs` | ?? |
| `scripts/import-village-user-pack.mjs` | ?? |
| `scripts/sync-village-map.mjs` | ?? |
| `assets/village-layout/` | ?? |

**Nature :** Nouveau panorama scrollable, navigation extraite (`AppNav`), bandeau ressources, tooltips bâtiments, refactor layout App.

---

### Lot C — Compagnons / inventaire UI

| Chemin | Statut |
|--------|--------|
| `src/components/CompanionStatsPanel.tsx` | M |
| `src/components/InventoryPanel.tsx` | M |
| `src/components/ImageLightbox.css` | M |
| `src/components/InventoryChip.tsx` | ?? |
| `src/components/ResourceIcon.tsx` | ?? |
| `src/data/inventoryView.ts` | M |
| `src/data/inventoryIcons.ts` | ?? |
| `src/data/companionAssets.ts` | M |
| `src/data/resources.ts` (`RESOURCE_ICONS`) | M |

**Nature :** Puces inventaire avec images (Myrions chibi, compagnons), icônes ressources, panneau stats enrichi.

---

### Lot D — Runtime divers

| Chemin | Statut |
|--------|--------|
| `src/data/gacha.ts` (flag dev — chevauche Lot A) | M |
| `src/data/conversations/engine.ts` | M |
| `src/data/conversations/companionScenarios.generated.ts` | M |
| `src/components/minigames/BiomeEncounterScene.tsx` | M |
| `src/components/minigames/PetSanctuaryGame.tsx` | M |
| `src/hooks/useWanderingSprites.ts` | M |
| `scripts/generate-companion-scenarios.mjs` | M |
| `scripts/validate-conversations.mjs` | ?? |
| `public/minigames/_preview/index.html` | M |

**Nature :** Guides Talia par biome, hitbox sprites, sync wanderers préservant positions, preview HTML assets.

**Note :** Diffs chasse (`BiomeEncounterScene`) liés aux PNG guides/biomes (Lot G).

---

### Lot E — Package / config

| Chemin | Statut |
|--------|--------|
| `package.json` | M |
| `vite.config.ts` | M |

**Nature :** 7 scripts npm (`import:myrions`, `import:talia`, `sync:village-map`, etc.) ; ignore watch Vite pour `.tmp/`, `.tools/`, `assets/`.

---

### Lot F — Suppressions legacy SVG

| Chemin | Statut |
|--------|--------|
| `public/minigames/palmons/*.svg` (24 fichiers) | D |
| `public/minigames/palmons/chibi/*.svg` (22 fichiers) | D |
| `public/minigames/palmons/moon-hop.png` | D |
| `public/minigames/palmons/moon-queen.png` | D |
| `public/minigames/palmons/moon-sprout.png` | D |
| `public/minigames/palmons/chibi/moon-sprout.png` | D |

**Total : 50 suppressions tracked** (46 SVG + 4 PNG legacy placeholder).

---

### Lot G — Assets PNG / publics

| Groupe | Chemins | Statut |
|--------|---------|--------|
| Myrions full | `public/minigames/palmons/*.png` (~80 espèces) | ?? |
| Myrions chibi | `public/minigames/palmons/chibi/*.png` (~80) | ?? |
| Silhouettes | `public/minigames/palmons/silhouettes/` | ?? |
| Biomes | `public/minigames/biomes/*.png` (8) | ?? |
| Enclos refuge | `public/minigames/enclosures/*.png` (8) | ?? |
| Guides Talia | `public/minigames/guides/talia-point-*.png` (8) + `talia-point.png` (M) | ?? / M |
| Compagnon Talia | `public/companions/talia/chibi.png` | ?? |
| Preview | `_preview/chibis-9-pack/`, `talia-forest-cutout.png` | ?? |
| Village | `public/village/panorama-*.png`, `buildings-map/` | ?? / M |
| Sources import | `assets/myrions-import/`, `assets/talia-import/` | ?? |

**Estimation : ~280+ PNG** untracked dans `public/` ; **~497 PNG** total sous `public/` (incl. existants).

---

### Lot H — Scripts import

| Chemin | Statut |
|--------|--------|
| `scripts/import-myrions-assets.mjs` | ?? |
| `scripts/import-myrions-chibis.mjs` | ?? |
| `scripts/import-talia-companion-pack.mjs` | ?? |
| `scripts/import-chibis-9-pack.mjs` | ?? |
| `scripts/import-biome-backgrounds.mjs` | ?? |
| `scripts/myrions-name-manifest.mjs` | ?? |
| `scripts/magenta-guide-cutout.mjs` | ?? |
| `scripts/restore-companion-ai-art.mjs` | ?? |
| (+ scripts village Lot B) | ?? / M |

---

### Lot I — Temporaire

| Chemin | Statut |
|--------|--------|
| `.tmp/` | ?? (~116 fichiers : packs import bruts, `git-reword-msg.sh`) |
| `assets/myrions-import/` | ?? (sources avant pipeline) |
| `assets/talia-import/` | ?? |
| `assets/village-layout/` | ?? |

---

### Lot J — Stash (`stash@{0}`)

| Aspect | Détail |
|--------|--------|
| Taille | 86 fichiers, +2563 / −1822 |
| Chevauchement WT | **~76/86** fichiers identiques au diff WT actuel |
| Déjà commité depuis stash | `buildingActivities.ts`, `MinigamePlayer.tsx` (1.7), `minigameSave.ts`, `wildFamiliars.ts`, `PalmonSprite.tsx`, `MinigameFrame.tsx`, `BiomeBackground.tsx`, `GuideCompanionCutout.tsx`, `minigameAssets.ts`, `palmonArtHints.ts` |
| Absent du stash | Tous untracked (PNG, composants village, scripts import, `.tmp/`) |
| WT sans stash | Aucun fichier `M`/`D` hors overlap (hors commits 1.6–1.7) |

---

## 3. Tableau détaillé

Légende actions : **CM** commit maintenant · **CL** commit plus tard · **UT** laisser untracked · **IG** ignorer via `.gitignore` · **SV** supprimer après validation · **RV** revert après validation · **IN** inspecter plus finement

### Lot A — Hub UI

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `MinigameHub.tsx` | M | A | UX hub compacte, conversations groupées | Moyen — CSS dans `App.css` ? | CL | `refactor: simplify minigame hub navigation` |
| `ConversationPicker.tsx` | ?? | A | Modal choix compagnon conversation | Faible | CL | idem |
| `population.ts` (`BUILDING_UNLOCK_ORDER`) | M | A | Tri hub par progression village | Faible | CL | idem |
| `gacha.ts` (`DEV_UNLOCK_ALL_MINIGAMES`) | M | A/D | Flag dev hub test | **Élevé** — règle « ne pas toucher flags dev » | **IN** | Exclure ou commit séparé explicite |

### Lot B — Village / App shell

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `App.tsx` | M | B | Panorama, AppNav, ResourceStrip, wiring | **Élevé** — imports untracked | CL | `feat: add village panorama shell` |
| `App.css` | M | B | Styles village + hub + inventaire | Élevé — mélange lots | IN | Split CSS idéalement |
| `index.css` | M | B | Tokens / globals | Faible | CL | idem village ou chore |
| `VillageMapLabels.tsx` | M | B | Labels carte (refactor spots) | Moyen | CL | idem |
| `VillagePanorama.tsx` | ?? | B | Composant panorama scroll | Élevé si seul | CL | idem |
| `VillageBuildingTooltip.tsx` | ?? | B | Tooltips bâtiments | Faible | CL | idem |
| `AppNav.tsx` | ?? | B | Nav extraite | Faible | CL | idem |
| `ResourceStrip.tsx` | ?? | B | Bandeau ressources | Faible | CL | idem |
| `CompanionMiniature.tsx` | ?? | B/C | Miniatures compagnons | Faible | CL | village ou inventaire |
| `villageMap.ts` | ?? | B | Positions / reveal ratio | Faible | CL | idem |
| `tooltipPosition.ts` | ?? | B | Utilitaire tooltip | Faible | CL | idem |
| `hero-banner.png` | M | B/G | Banner village (compressé 3.2→72 KB) | Moyen — asset | CL | assets village |
| `public/village/panorama-*.png` | ?? | G | Panoramas par stade | Moyen | CL | `assets: add village panorama images` |
| `buildings-map/` | ?? | G | Carte bâtiments | Faible | CL | idem |
| `village-art.mjs` | M | B/H | Pipeline art village | Moyen | CL | scripts village |
| `village-art-v1.mjs` | ?? | H | Archive v1 | Faible | UT ou IG | — |
| `generate-assets.mjs` | M | H | Orchestrateur assets | Moyen | CL | scripts |
| Scripts village `??` | ?? | H | Import/sync panorama | Faible | CL | scripts village |

### Lot C — Compagnons / inventaire

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `CompanionStatsPanel.tsx` | M | C | UI stats enrichie | Faible | CL | `feat: update companion inventory panels` |
| `InventoryPanel.tsx` | M | C | Grille puces visuelles | Faible | CL | idem |
| `ImageLightbox.css` | M | C | Lightbox inventaire | Faible | CL | idem |
| `InventoryChip.tsx` | ?? | C | Puce item | Faible | CL | idem |
| `ResourceIcon.tsx` | ?? | C | Icône ressource | Faible | CL | idem |
| `inventoryView.ts` | M | C | Items avec images Myrions | Moyen — dépend PNG | CL | idem (+ assets avant?) |
| `inventoryIcons.ts` | ?? | C | Mapping icônes | Faible | CL | idem |
| `companionAssets.ts` | M | C | Paths compagnons | Faible | CL | idem |
| `resources.ts` (`RESOURCE_ICONS`) | M | C | Emojis ressources | Faible | CL | idem |

### Lot D — Runtime divers

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `BiomeEncounterScene.tsx` | M | D | Guide Talia par biome | Moyen — dépend PNG guides | CL | `fix: wire biome guide cutouts per biome` |
| `PetSanctuaryGame.tsx` | M | D | Hitbox sprite (`mg-sprite-hitbox`) | Faible | CL | `fix: improve pet sanctuary sprite hitboxes` |
| `useWanderingSprites.ts` | M | D | Préserve positions sprites | Faible | CL | idem ou fix wander |
| `conversations/engine.ts` | M | D | Ajustement moteur | Faible | IN | commit conversations si pertinent |
| `companionScenarios.generated.ts` | M | D | Régénération dialogues | Faible | CL | si diff intentionnel |
| `generate-companion-scenarios.mjs` | M | D | Script gen | Faible | CL | idem |
| `validate-conversations.mjs` | ?? | H | Validation CI dialogues | Faible | CL | chore scripts |
| `_preview/index.html` | M | D | Preview assets dev | Faible | UT ou CL | preview dev |

### Lot E — Package / config

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `package.json` | M | E | Scripts npm import | Faible | CL | `chore: add asset import npm scripts` |
| `vite.config.ts` | M | E | Ignore watch temp | Faible | CL | idem |

### Lot F — Suppressions SVG

| Chemin | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `public/minigames/palmons/**/*.svg` (46) | D | F | Remplacés par PNG Myrions | **Élevé** si PNG non commités | **SV** | `chore: remove legacy palmon svg assets` |
| Legacy PNG moon-* (4) | D | F | Placeholders obsolètes | Moyen | SV | idem |

### Lot G — Assets PNG (groupes)

| Groupe | Git | Lot | Utilité | Risque | Action | Commit cible |
|--------|-----|-----|---------|--------|--------|--------------|
| `palmons/*.png` + `chibi/*.png` | ?? | G | Sprites Myrions runtime | Faible une fois validés | CL | `assets: add myrion palmon png sprites` |
| `biomes/*.png` | ?? | G | Fonds chasse | Faible | CL | `assets: add myrion biome backgrounds` |
| `enclosures/*.png` | ?? | G | Fonds refuge dressage | Faible | CL | `assets: add myrion enclosure backgrounds` |
| `guides/talia-point*.png` | ??/M | G | Cutouts guide Talia | Faible | CL | `assets: add talia guide cutouts` |
| `companions/talia/chibi.png` | ?? | G | Compagnon Talia | Faible | CL | assets companions |
| `_preview/*` | ?? | G | Dev preview only | Faible | UT ou IG | — |
| `silhouettes/` | ?? | G | Silhouettes capture | Faible | CL | avec palmons |

### Lot H — Scripts import

| Chemin | Git | Lot | Action | Commit cible |
|--------|-----|-----|--------|--------------|
| `import-myrions-*.mjs`, `import-talia-*.mjs`, etc. | ?? | H | CL | `chore: add myrion asset import scripts` |
| `restore-companion-ai-art.mjs` | ?? | H | CL | chore scripts |

### Lot I — Temporaire

| Chemin | Git | Lot | Action | Commit cible |
|--------|-----|-----|--------|--------------|
| `.tmp/` | ?? | I | **IG** | `chore: ignore local import temp files` |
| `assets/*-import/` | ?? | I | **IG** ou UT | idem |

### Lot J — Stash

| Aspect | Action | Commit cible |
|--------|--------|--------------|
| Contenu global | **Garder** jusqu’à slices commitées | — |
| Fichiers déjà sur HEAD | Considérés **redondants** | — |
| Diff restant vs WT | **Partiellement redondant** | — |
| Drop | **Interdit** pour l’instant | — |

---

## 4. Plan de commits recommandé (non exécuté)

### Commit 0 — Documentation (immédiat)

**Message :** `docs: add working tree triage`

| | |
|---|---|
| **Périmètre** | `docs/WORKTREE_TRIAGE.md` uniquement |
| **Exclus** | Tout le reste |
| **Risque** | Aucun |
| **Validation** | Lecture humaine |
| **TNR** | `npm run build` (HEAD inchangé fonctionnellement) |

---

### Commit 1 — Hub UI ✅ Phase 1.9

**Message :** `refactor: simplify minigame hub navigation` — **commité `01ddfd0`**

| | |
|---|---|
| **Inclus** | `MinigameHub.tsx`, `ConversationPicker.tsx`, `population.ts` |
| **Exclus** | `gacha.ts`, `CompanionMiniature`, `App.css` |
| **Note** | Déblocage via `villageStage >= requiredStage` uniquement ; flag dev WT non commité |

---

### Commit 2 — Inventaire / compagnons ✅ Phase 1.10

**Message :** `feat: update companion inventory panels` — **commité `e8911a3`**

| | |
|---|---|
| **Inclus** | Voir Phase 1.10 ci-dessus |
| **Exclus** | `App.css`, PNG, fichiers helper WT orphelins |

---

### Commit 3 — Village panorama

**Message :** `feat: add village panorama shell`

| | |
|---|---|
| **Inclus** | `App.tsx`, `AppNav`, `ResourceStrip`, `VillagePanorama`, `VillageBuildingTooltip`, `VillageMapLabels`, `villageMap.ts`, `tooltipPosition.ts`, CSS village dans `App.css`/`index.css`, scripts village trackés |
| **Exclus** | PNG panoramas (commit 5), hub refactor si pas commit 1, flags dev |
| **Risque** | **Élevé** — gros diff, couplage CSS |
| **Validation** | build, navigation onglets, panorama scroll, clic bâtiment |
| **TNR** | Village → bâtiments → retour ; pas de crash |

---

### Commit 4 — Runtime divers

**Message :** `fix: polish minigame runtime behaviors`

| | |
|---|---|
| **Inclus** | `BiomeEncounterScene`, `PetSanctuaryGame`, `useWanderingSprites`, conversations si diffs validés |
| **Exclus** | Assets, hub, App shell |
| **Risque** | Faible à moyen |
| **Validation** | build, chasse 1 biome, refuge familiers |
| **TNR** | Sprites wander OK, guide Talia visible si assets présents |

---

### Commit 5 — Assets Myrions (multi-commit suggéré)

**Messages :**
- `assets: add myrion palmon png sprites`
- `assets: add myrion biome and enclosure images`
- `assets: add talia guide and companion images`
- `assets: add village panorama images`

| | |
|---|---|
| **Inclus** | Lot G par domaine |
| **Exclus** | `.tmp/`, `assets/*-import/`, `_preview/` dev |
| **Risque** | Taille repo, LFS non utilisé |
| **Validation** | build, chasse + refuge visuels, inventaire icônes |
| **TNR** | Pas de 404 console sur espèces connues |

---

### Commit 6 — Scripts + config

**Message :** `chore: add asset import npm scripts`

| | |
|---|---|
| **Inclus** | `package.json`, `vite.config.ts`, scripts Lot H |
| **Exclus** | Assets binaires |
| **Risque** | Faible |
| **Validation** | `npm run build`, smoke `npm run import:myrions --dry` si existe |
| **TNR** | Scripts référencés existent |

---

### Commit 7 — Gitignore temporaires

**Message :** `chore: ignore local import temp files`

| | |
|---|---|
| **Inclus** | `.gitignore` entries : `.tmp/`, `assets/myrions-import/`, `assets/talia-import/`, optionnel `_preview/` |
| **Exclus** | Fichiers déjà trackés |
| **Risque** | Faible |
| **Validation** | `git status` allégé |
| **TNR** | — |

---

### Commit 8 — Phase 2 : cleanup SVG (après commit 5)

**Message :** `chore: remove legacy palmon svg assets`

| | |
|---|---|
| **Inclus** | 50 fichiers Lot F (`D` staged) |
| **Exclus** | Tout autre |
| **Risque** | **Élevé** sans PNG commités — régression visuelle |
| **Validation** | build, chasse, refuge, inventaire — comparaison visuelle |
| **TNR** | Aucun palmon ne référence encore `.svg` dans le code |

---

## 5. Décision sur stash

| Question | Réponse |
|----------|---------|
| **Drop possible ?** | **Non** — pas encore |
| **Drop interdit ?** | **Oui** tant que slices WT non commitées |
| **Inspection nécessaire ?** | **Oui** — comparaison fine sur les 10 fichiers déjà commités |

### Recommandation

**Garder le stash** comme sauvegarde. Il est **partiellement redondant** avec le WT pour ~76 fichiers, mais :

- Il capture un état antérieur incluant des modules **déjà re-commités** (1.6–1.7) avec des diffs potentiellement différents.
- Il **ne contient pas** les untracked (~350 fichiers) — le WT est la source de vérité pour assets et nouveaux composants.
- Un `git stash pop` aujourd’hui provoquerait très probablement des **conflits** sur `minigameSave.ts`, `wildFamiliars.ts`, etc.

### Commandes de comparaison fine (à exécuter avant tout drop)

```powershell
# Diff stash vs HEAD pour un fichier déjà commité
git diff HEAD stash@{0} -- src/data/minigameSave.ts

# Diff stash vs working tree pour un fichier encore modifié
git diff stash@{0} -- src/components/minigames/MinigameHub.tsx

# Lister fichiers stash absents du WT
git stash show --name-only stash@{0} | ForEach-Object { if (-not (Test-Path $_)) { $_ } }
```

**Drop envisageable uniquement après :** tous les lots A–G commités ou abandonnés explicitement, ET vérification que `git diff stash@{0}` ne contient plus de delta utile vs HEAD.

---

## 6. Décision sur Phase 2

| Critère | Verdict |
|---------|---------|
| Phase 2 globale maintenant | **Non** — trop de modifications non classées et non commitées |
| Phase 2 sur lot précis | **Oui, uniquement Lot F** — et **seulement après** commit assets PNG (Lot G) validé |
| Phase 2 après commit préalable | **Oui** — ordre : docs → slices A–G → puis Lot F |
| Phase 2 après revert | Non requis pour l’instant |

**Conclusion :** La Phase 2 (nettoyage) **ne doit pas démarrer** tant que le WT n’a pas été découpé en commits atomiques. Le **premier slice Phase 2 autorisé** sera le commit 8 (suppressions SVG), conditionné à la présence des PNG Myrions sur HEAD.

---

## Annexe — État HEAD vs WT

| Élément | HEAD (`356698f`) | Working tree |
|---------|------------------|--------------|
| Build commit-only | ✅ Vert | N/A |
| Refuge hub | ✅ Enregistré | ✅ + hub refactor (WT) |
| Panorama village | ❌ Ancien | ✅ Nouveau (untracked deps) |
| PNG Myrions | ❌ Absents | ✅ Untracked |
| SVG legacy | ✅ Présents | ❌ Supprimés localement (D) |
| Stash | Conservé | Partiellement redondant |

---

*Document généré en Phase 1.8 — triage read-only. Prochaine étape : commit de ce document seul, puis exécution du plan de commits par slices.*
