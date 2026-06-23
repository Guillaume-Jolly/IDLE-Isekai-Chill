/** Chemins d'assets mini-jeux — structure sous public/assets/minigames/ */

import { MYRIONS_SPECIES } from './myrionsCatalog.generated'
import { publicAssetUrl } from './publicAssetUrl'

export const MINIGAME_ASSET_ROOT = publicAssetUrl('assets/minigames')
export const LEGACY_MINIGAME_ASSET_ROOT = publicAssetUrl('minigames')

export const DRESSAGE_ASSET_ROOT = `${MINIGAME_ASSET_ROOT}/dressage`
export const CAPTURE_ASSET_ROOT = `${MINIGAME_ASSET_ROOT}/capture`
export const MINIGAME_HUB_ASSET_ROOT = `${MINIGAME_ASSET_ROOT}/hub`

export const minigamePresentationPath = (activityId: string) =>
  `${MINIGAME_HUB_ASSET_ROOT}/presentations/${activityId}.png`

export const minigameStagePath = (activityId: string) =>
  `${MINIGAME_HUB_ASSET_ROOT}/stages/${activityId}.png`

export const enclosureAssetPath = (biomeId: string) =>
  `${DRESSAGE_ASSET_ROOT}/enclosures/${biomeId}.png`

export const enclosureAssetPathCandidates = (biomeId: string) => [
  `assets/minigames/dressage/enclosures/${biomeId}.png`,
  `minigames/enclosures/${biomeId}.png`,
]

/** Enclos portrait 9:16 — téléphone uniquement. */
export const enclosurePortraitAssetPath = (biomeId: string) =>
  `${DRESSAGE_ASSET_ROOT}/enclosures/${biomeId}-portrait.png`

export const enclosurePortraitAssetPathCandidates = (biomeId: string) => [
  `assets/minigames/dressage/enclosures/${biomeId}-portrait.png`,
  `minigames/enclosures/${biomeId}-portrait.png`,
]

export const biomeBackgroundPath = (biomeId: string) =>
  `${CAPTURE_ASSET_ROOT}/biomes/${biomeId}.svg`

export const biomeBackgroundPngPath = (biomeId: string) =>
  `${CAPTURE_ASSET_ROOT}/biomes/${biomeId}.png`

export const biomeBackgroundPngPathCandidates = (biomeId: string) => [
  `assets/minigames/capture/biomes/${biomeId}.png`,
  `minigames/biomes/${biomeId}.png`,
]

/** Fond biome portrait 9:16 — téléphone uniquement. */
export const biomeBackgroundPortraitPngPath = (biomeId: string) =>
  `${CAPTURE_ASSET_ROOT}/biomes/${biomeId}-portrait.png`

export const biomeBackgroundPortraitPngPathCandidates = (biomeId: string) => [
  `assets/minigames/capture/biomes/${biomeId}-portrait.png`,
  `minigames/biomes/${biomeId}-portrait.png`,
]

export type PalmonSpriteVariant = 'full' | 'chibi' | 'silhouette'

/** Espèces Myrion avec PNG chibi importé (catalogue officiel). */
export const MYRION_SPECIES_IDS = new Set<string>(MYRIONS_SPECIES.map((species) => species.id))

export const hasMyrionChibiAsset = (speciesId: string) => MYRION_SPECIES_IDS.has(speciesId)

export const palmonFullPngPath = (speciesId: string) =>
  `${CAPTURE_ASSET_ROOT}/myrions/cutout/${speciesId}.png`

export const palmonFullPngPathCandidates = (speciesId: string) => [
  `assets/minigames/capture/myrions/cutout/${speciesId}.png`,
  `minigames/palmons/${speciesId}.png`,
]

export const palmonChibiPngPath = (speciesId: string) =>
  `${DRESSAGE_ASSET_ROOT}/myrions/chibi/${speciesId}.png`

export const palmonChibiPngPathCandidates = (speciesId: string) => [
  `assets/minigames/dressage/myrions/chibi/${speciesId}.png`,
  `minigames/palmons/chibi/${speciesId}.png`,
]

/** Silhouette pour l'apparition en chasse. */
export const palmonSilhouettePngPath = (speciesId: string) =>
  `${CAPTURE_ASSET_ROOT}/myrions/silhouette/${speciesId}.png`

export const palmonSilhouettePngPathCandidates = (speciesId: string) => [
  `assets/minigames/capture/myrions/silhouette/${speciesId}.png`,
  `minigames/palmons/silhouettes/${speciesId}.png`,
]

/** @deprecated Anciens SVG procéduraux — utiliser palmonFullPngPath */
export const palmonFullPath = palmonFullPngPath

/** @deprecated Anciens SVG procéduraux — utiliser palmonChibiPngPath */
export const palmonChibiPath = palmonChibiPngPath

/** @deprecated Utiliser palmonFullPngPath */
export const palmonSpritePath = palmonFullPngPath

export const getPalmonAssetPath = (speciesId: string, variant: PalmonSpriteVariant = 'full') => {
  if (variant === 'chibi') return palmonChibiPngPath(speciesId)
  if (variant === 'silhouette') return palmonSilhouettePngPath(speciesId)
  return palmonFullPngPath(speciesId)
}

export const getPalmonAssetPathCandidates = (
  speciesId: string,
  variant: PalmonSpriteVariant = 'full',
) => {
  if (variant === 'chibi') return palmonChibiPngPathCandidates(speciesId)
  if (variant === 'silhouette') return palmonSilhouettePngPathCandidates(speciesId)
  return palmonFullPngPathCandidates(speciesId)
}

export type GuidePose = 'point' | 'cheer' | 'watch'

/** Détourage compagnon — superposable sur biomes (ex. Talia qui pointe le palmon). */
export const companionGuideCutoutPath = (companionId: string, pose: GuidePose = 'point') =>
  `${CAPTURE_ASSET_ROOT}/companions/${companionId}/${pose}.svg`

export const companionGuideCutoutPngPath = (
  companionId: string,
  pose: GuidePose = 'point',
  biomeId?: string,
) =>
  biomeId
    ? `${CAPTURE_ASSET_ROOT}/companions/${companionId}/${pose}-${biomeId}.png`
    : `${CAPTURE_ASSET_ROOT}/companions/${companionId}/${pose}.png`

export const companionGuideCutoutPngPathCandidates = (
  companionId: string,
  pose: GuidePose = 'point',
  biomeId?: string,
) => {
  if (biomeId) {
    return [
      `assets/minigames/capture/companions/${companionId}/${pose}-${biomeId}.png`,
      `minigames/guides/talia-${pose}-${biomeId}.png`,
      `minigames/guides/${companionId}-${pose}-${biomeId}.png`,
    ]
  }
  return [
    `assets/minigames/capture/companions/${companionId}/${pose}.png`,
    `minigames/guides/talia-${pose}.png`,
    `minigames/guides/${companionId}-${pose}.png`,
  ]
}

export const COMPANION_GUIDE_HINTS: Record<string, Partial<Record<GuidePose, string>>> = {
  talia: {
    point:
      'Same character as reference: Talia, young redhead explorer with long orange-red braid over right shoulder tied with green ribbon, messy bangs, big emerald green eyes, wide cheerful smile. Outfit EXACTLY: dark olive-green sleeveless crop top showing midriff, open beige short-sleeve shirt worn as vest, very short khaki utility shorts with twin brown leather belts, brown fingerless gloves, green teardrop necklace, brown leather satchel strap on shoulder, thigh leather strap. Upper body cutout ONLY, isolated character on FULLY TRANSPARENT alpha PNG (NO forest, NO camp, NO tent, NO scenery, NO floor, NO checkerboard, NO white canvas, NO grey box, NO border), pointing index finger toward RIGHT side of frame, anime gacha style, no text',
    cheer:
      'Same Talia as reference: redhead long braid green ribbon, olive crop top, open beige vest-shirt, khaki short shorts, belts, fingerless gloves, green gem necklace, satchel. Upper body cutout celebrating with both fists up, transparent background, anime gacha, no text',
    watch:
      'Same Talia as reference: redhead long braid green ribbon, olive crop top, open beige vest-shirt, khaki short shorts, belts, fingerless gloves, green gem necklace, satchel. Upper body cutout hand shading eyes looking far, transparent background, anime gacha, no text',
  },
}

/** Fallback CSS par batiment si l'image de scene n'existe pas encore. */
export const STAGE_FALLBACK_CSS: Record<string, string> = {
  inn: 'linear-gradient(165deg, #fff4e8 0%, #ffd9c0 55%, #ffb88a 100%)',
  'mist-garden': 'linear-gradient(165deg, #e8fff0 0%, #b8e8c8 50%, #7ecf8a 100%)',
  'ribbon-workshop': 'linear-gradient(165deg, #fff0ff 0%, #e8c8ff 55%, #d486ff 100%)',
  'clear-spring': 'linear-gradient(165deg, #e8f8ff 0%, #b8e4ff 50%, #6ec8ff 100%)',
  'moon-farm': 'linear-gradient(165deg, #f0ffe8 0%, #c8e8a0 45%, #9ed56b 100%)',
  'arcane-library': 'linear-gradient(165deg, #f0ecff 0%, #c8b8ff 55%, #9b7bff 100%)',
  'traveler-theater': 'linear-gradient(165deg, #fff0f8 0%, #ffc8e8 55%, #ff6eb4 100%)',
  'star-market': 'linear-gradient(165deg, #fffbe8 0%, #ffe9a8 55%, #ffd56a 100%)',
}

/** Indications pour generation IA (compagnon + decor du mini-jeu, pose presentation). */
export const PRESENTATION_GENERATION_HINTS: Record<string, string> = {
  'inn-service':
    'Nami, serveuse chaleureuse, posture accueillante, fond auberge cosy anime gacha, tenue service',
  'garden-td':
    'Iris, jardiniere magique, posture confiante, fond jardin brumeux avec herbes, anime gacha',
  'garden-harvest': 'Iris, panier de recolte, fond potager brumeux lumineux, anime gacha',
  'workshop-thread': 'Mira, tailleur, fil et aiguille, fond atelier rubans, anime gacha',
  'spring-bubbles': 'Solene, pretresse, fond source thermale vapeur douce, anime gacha',
  'farm-idle': 'Sora, fermiere lunaire, posture detendue, fond champs sous lune, anime gacha',
  'farm-pets': 'Sora, posture maternelle, fond petite ferme familiers mignons, anime gacha',
  'farm-dressage':
    'Sora dresseuse, vue enclos lunaire avec familiers chibi qui se promenent, anime gacha',
  'farm-capture':
    'Talia rousse natte longue ruban vert, crop top olive, chemise beige ouverte, short kaki, ceintures cuir, gants sans doigts, collier gemme verte, sac exploratrice — doigt pointe vers palmon, cutout transparent, anime gacha',
  'farm-merge': 'Sora, graines lunaires, fond serre magique, anime gacha',
  'library-memory': 'Lyra, archiviste, grimoire, fond bibliotheque arcanique, anime gacha',
  'theater-beat': 'Kael, artiste scene, fond theatre rideaux, anime gacha',
  'market-swap': 'Maeve, marchande, fond bazar etoiles cristaux, anime gacha',
}
