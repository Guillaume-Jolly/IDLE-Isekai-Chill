# Chantier Myrion — MVP 15 assets visuels (15 biomes)

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Prérequis :** MVP 14 (runtime 45 filons actifs)

## Objectif

Fournir les PNG IA pour les **12 biomes extension** + vérifier les **3 biomes legacy**, avec **3 filons actifs** par biome (45 total), sans modifier économie / progression / save.

## Stratégie

| Couche | Rôle |
|--------|------|
| `myrionWorksiteBiomeCatalog.ts` | Chemins cibles (`backgroundAssetKey`, `assetKey`) — inchangé |
| `myrionWorksiteAssetRegistry.ts` | **Auto-généré** — `available: true` uniquement si PNG validé |
| `myrionWorksiteVisuals.ts` | Lit le registry pour backgrounds + spots runtime |
| `scripts/mvp15-install-worksite-assets.py` | Crop 2560×960 (fonds), 1024×1024 RGBA (filons), QA alpha |

Staging IA : `staging/myrion-worksite-mvp15/generated/`  
Manifest : `staging/manifests/myrion-worksite-mvp15.json`

## Backgrounds

### Conservés MVP 9 (vérifiés, non remplacés)

| Fichier | Biome | Taille |
|---------|-------|--------|
| `backgrounds/prairie.png` | Prairie lunaire | 2560×960 |
| `backgrounds/forest.png` | Forêt mousseuse | 2560×960 |
| `backgrounds/mine.png` | Mine douce | 2560×960 |

### Générés / régénérés MVP 15 (12)

| Fichier | Biome | Statut |
|---------|-------|--------|
| `backgrounds/swamp.png` | Marais des lucioles | **OK** — régénéré wide |
| `backgrounds/rivage-brumeux.png` | Rivage brumeux | **OK** |
| `backgrounds/vergers-suspendus.png` | Vergers suspendus | **OK** |
| `backgrounds/ruines-florales.png` | Ruines florales | **OK** |
| `backgrounds/crystal.png` | Grotte cristalline | **OK** — régénéré wide |
| `backgrounds/desert-cendres-roses.png` | Désert de cendres roses | **OK** |
| `backgrounds/montagne-vents.png` | Montagne des vents | **OK** |
| `backgrounds/lac-etoile.png` | Lac étoilé | **OK** |
| `backgrounds/bois-automne-eternel.png` | Bois d’automne éternel | **OK** |
| `backgrounds/jardin-fongique.png` | Jardin fongique | **OK** |
| `backgrounds/astral.png` | Sanctuaire astral | **OK** — régénéré (prestige faille utilise spot dédié) |
| `backgrounds/ile-celeste.png` | Île céleste | **OK** |

## Filons actifs (36 nouveaux + 9 legacy)

Les 9 filons biomes 1–3 conservent les fichiers MVP 4–9 (`champs`, `bosquet`, `pierrier`, etc.).

36 filons extension installés sous `spots/` selon le catalogue (ex. `marais-roseaux-lumineux.png`, `rivage-coquillages-nacres.png`, …).

**Total registry MVP 15 :** 61 assets (`15` backgrounds + `46` spots dont `faille-astrale` prestige).

## Assets activés / désactivés

- **Activés :** 61 (registry `WORKSITE_MVP15_AVAILABLE_ASSETS`)
- **Désactivés :** 0 rejetés par QA script
- **Fallback CSS :** toujours actif si fichier retiré du registry

## Post-traitement

```bash
# 1. Déposer les PNG IA dans staging/myrion-worksite-mvp15/generated/
# 2. Installer + valider + régénérer registry
python scripts/mvp15-install-worksite-assets.py
```

Contrôles automatiques :
- Fond : min 1920×720, pas >55 % blanc
- Filon : min 512×512, alpha transparent >8 %, opaque 4–72 %
- Détourage : blanc/noir/damier (seuil 245)

## Procédure vérification manuelle

1. Ouvrir Ferme lunaire, drawer 15 biomes
2. Dev unlock si besoin — vérifier fond PNG (pas damier)
3. Vérifier 3 filons par biome (image ou emoji fallback)
4. Console réseau : aucun 404 sous `/assets/minigames/myrion-worksite/`
5. Mobile ~390 px : fond `object-fit: cover`, filons lisibles

## Problèmes connus / à refaire

| Asset | Note |
|-------|------|
| `spots/ruines-lierre-ancien.png` | Opaque ratio bas (9.6 %) — acceptable, surveiller halo |
| `spots/montagne-courants-captifs.png` | Silhouette légère — OK mobile |
| Anciens `swamp/crystal/astral` 1536×1024 | Remplacés par wide 2560×960 |

## Dettes MVP 16+

- Placement visuel des 3 filons par biome (slots catalogue) — **fait MVP 16** → `docs/MYRION_WORKSITE_MVP16_PLACEMENT.md`
- 45 composants catalog-only restent sans asset dédié
- `astral.png` partagé sanctuaire + alias visuel faille — divergence possible MVP 16

## Checklist test

- [x] `npm run build`
- [x] Registry 61 assets
- [x] HTTP 200 sur échantillon assets (swamp, rivage, ile, marais spot, prairie)
- [ ] Smoke navigateur interactif 15 biomes (automatisé bloqué — test manuel conseillé)
- [ ] Mobile 390 px rapide

## Commits locaux (sans push)

- `feat(worksite): add visual assets for extended biomes`
- `docs: document worksite mvp15 asset pass`
