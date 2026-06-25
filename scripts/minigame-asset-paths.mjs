/** Chemins assets mini-jeux (miroir de src/data/minigameAssets.ts). */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export const repoRoot = root

/** Source-of-truth biome backgrounds (Assets 2.0 lot Background). */
export const backgroundAssetRoot = join(root, 'assets/Background')

export const backgroundAssetPaths = {
  root: backgroundAssetRoot,
  disagreaEventSources: join(backgroundAssetRoot, 'disagrea-event'),
  captureWide: (biomeId) => join(backgroundAssetRoot, biomeId, 'capture-wide.png'),
  capturePortrait: (biomeId) => join(backgroundAssetRoot, biomeId, 'capture-portrait.png'),
  dressageWide: (biomeId) => join(backgroundAssetRoot, biomeId, 'dressage-wide.png'),
  dressagePortrait: (biomeId) => join(backgroundAssetRoot, biomeId, 'dressage-portrait.png'),
}

/** Source-of-truth Myrion sprites (Assets 2.0 lot Myrions). */
export const myrionAssetRoot = join(root, 'assets/Myrions')

export const myrionAssetPaths = {
  root: myrionAssetRoot,
  cutout: (biomeId, speciesId) => join(myrionAssetRoot, biomeId, 'cutout', `${speciesId}.png`),
  chibi: (biomeId, speciesId) => join(myrionAssetRoot, biomeId, 'chibi', `${speciesId}.png`),
  silhouette: (biomeId, speciesId) => join(myrionAssetRoot, biomeId, 'silhouette', `${speciesId}.png`),
}

/** Source-of-truth companion portraits (Assets 2.0 lot Compagnons). */
export const companionAssetRoot = join(root, 'assets/Compagnons')

/** @deprecated Prefer affinite/nsfw paths — maps legacy integrated filenames to canonical assets. */
export const companionAssetPaths = {
  root: companionAssetRoot,
  affinite: (companionId, level) =>
    join(companionAssetRoot, companionId, 'affinite', `affinity-${level}.png`),
  emotion: (companionId, emotion) =>
    join(companionAssetRoot, companionId, 'cutouts', `emotion-${emotion}.png`),
  chibi: (companionId) => join(companionAssetRoot, companionId, 'chibis', 'chibi.png'),
  nsfw: (companionId) => join(companionAssetRoot, companionId, 'NSFW', 'affinity-4-nsfw.png'),
  /** @deprecated Legacy filename — resolves to affinite/ or NSFW/ canonical paths. */
  disagreaIntegrated: (companionId, filename) => {
    if (filename.includes('nsfw')) {
      return join(companionAssetRoot, companionId, 'NSFW', 'affinity-4-nsfw.png')
    }
    const levelMatch = filename.match(/affinity-(\d{2})/)
    if (levelMatch) {
      return join(companionAssetRoot, companionId, 'affinite', `affinity-${parseInt(levelMatch[1], 10)}.png`)
    }
    return join(companionAssetRoot, companionId, 'Autres', 'disagrea-integrated', filename)
  },
}

/** Source-of-truth guide cutouts (minigame overlay poses). */
export const guideCutoutAssetPaths = {
  root: (companionId) => join(companionAssetRoot, companionId, 'Autres', 'guide'),
  file: (companionId, fileName) =>
    join(companionAssetRoot, companionId, 'Autres', 'guide', fileName),
}

/**
 * @deprecated Use backgroundAssetPaths, myrionAssetPaths, companionAssetPaths, guideCutoutAssetPaths.
 * Kept for scripts that still reference legacy public/ layout during transition.
 */
export const publicMinigamePaths = {
  dressageEnclosures: join(root, 'public/assets/minigames/dressage/enclosures'),
  dressageChibi: join(root, 'public/assets/minigames/dressage/myrions/chibi'),
  captureBiomes: join(root, 'public/assets/minigames/capture/biomes'),
  captureCutout: join(root, 'public/assets/minigames/capture/myrions/cutout'),
  captureSilhouette: join(root, 'public/assets/minigames/capture/myrions/silhouette'),
  captureCompanionTalia: guideCutoutAssetPaths.root('talia'),
  hubPresentations: join(root, 'public/assets/minigames/hub/presentations'),
  hubStages: join(root, 'public/assets/minigames/hub/stages'),
  companions: companionAssetRoot,
}

/** Pipeline reference data (text/JSON — not runtime). */
export const pipelineReferencesRoot = join(root, 'scripts/references')

/** @deprecated Use pipelineReferencesRoot */
export const promptsAssetRoot = pipelineReferencesRoot

export const oldAssetsRoot = join(root, 'old_assets')

export const sourceMinigamePaths = {
  dressageChibi: join(oldAssetsRoot, 'Background/prompts/minigames/chibi-sources'),
  captureTaliaCompanionPack: join(oldAssetsRoot, 'Background/prompts/minigames/talia-sources/companion-pack'),
  captureTaliaChibis9: join(oldAssetsRoot, 'Background/prompts/minigames/talia-sources/chibis-9-pack'),
  captureCutout: join(oldAssetsRoot, 'Background/prompts/minigames/cutout-sources'),
  myrionsImportDefault: join(oldAssetsRoot, 'Myrions/imports/myrions-import/myrions_biomes_v2'),
  taliaImportDefault: join(oldAssetsRoot, 'Compagnons/imports/talia-import'),
}

export const disagreaPromptArchiveRoot = join(oldAssetsRoot, 'Compagnons/prompts/disagrea')

export const oldAssetPaths = {
  biomesLegacy: join(oldAssetsRoot, 'biomes-legacy'),
  previews: join(oldAssetsRoot, 'previews'),
  vectorizePreview: join(oldAssetsRoot, 'previews', 'vectorize-chibi'),
  palmonSvgs: join(oldAssetsRoot, 'public-minigames-legacy', 'palmons'),
  palmonChibiSvgs: join(oldAssetsRoot, 'public-minigames-legacy', 'palmons', 'chibi'),
  guidesLegacy: join(oldAssetsRoot, 'public-minigames-legacy', 'guides'),
  sourcesBeforeCutout: join(oldAssetsRoot, 'minigames-sources-avant-detourage'),
  sourcesScattered: join(oldAssetsRoot, 'sources-scattered'),
  publicCompanionsLegacy: join(oldAssetsRoot, 'public-companions-legacy'),
}

/** Nom de fichier guide Talia en jeu : point-{biomeId}.png */
export const taliaGuideFile = (biomeId) => `point-${biomeId}.png`
