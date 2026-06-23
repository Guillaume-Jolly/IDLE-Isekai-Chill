/** Chemins assets mini-jeux (miroir de src/data/minigameAssets.ts). */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export const repoRoot = root

export const publicMinigamePaths = {
  dressageEnclosures: join(root, 'public/assets/minigames/dressage/enclosures'),
  dressageChibi: join(root, 'public/assets/minigames/dressage/myrions/chibi'),
  captureBiomes: join(root, 'public/assets/minigames/capture/biomes'),
  captureCutout: join(root, 'public/assets/minigames/capture/myrions/cutout'),
  captureSilhouette: join(root, 'public/assets/minigames/capture/myrions/silhouette'),
  captureCompanionTalia: join(root, 'public/assets/minigames/capture/companions/talia'),
  hubPresentations: join(root, 'public/assets/minigames/hub/presentations'),
  hubStages: join(root, 'public/assets/minigames/hub/stages'),
  companions: join(root, 'public/assets/companions'),
}

export const sourceMinigamePaths = {
  dressageChibi: join(root, 'assets/minigames/dressage/myrions/chibi/sources'),
  captureTaliaCompanionPack: join(root, 'assets/minigames/capture/companions/talia/sources/companion-pack'),
  captureTaliaChibis9: join(root, 'assets/minigames/capture/companions/talia/sources/chibis-9-pack'),
  captureCutout: join(root, 'assets/minigames/capture/myrions/cutout/sources'),
  myrionsImportDefault: join(root, 'assets/myrions-import/myrions_biomes_v2'),
  taliaImportDefault: join(root, 'assets/talia-import'),
}

export const oldAssetsRoot = join(root, 'old_assets')

export const oldAssetPaths = {
  biomesLegacy: join(oldAssetsRoot, 'biomes-legacy'),
  previews: join(oldAssetsRoot, 'previews'),
  vectorizePreview: join(oldAssetsRoot, 'previews', 'vectorize-chibi'),
  palmonSvgs: join(oldAssetsRoot, 'public-minigames-legacy', 'palmons'),
  palmonChibiSvgs: join(oldAssetsRoot, 'public-minigames-legacy', 'palmons', 'chibi'),
  guidesLegacy: join(oldAssetsRoot, 'public-minigames-legacy', 'guides'),
  sourcesBeforeCutout: join(oldAssetsRoot, 'minigames-sources-avant-detourage'),
  sourcesScattered: join(oldAssetsRoot, 'sources-scattered'),
}

/** Nom de fichier guide Talia en jeu : point-{biomeId}.png */
export const taliaGuideFile = (biomeId) => `point-${biomeId}.png`
