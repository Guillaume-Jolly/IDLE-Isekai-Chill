import { BIOMES, PALMON_SPECIES, getBiome, type Biome, type PalmonSpecies } from './wildFamiliars'
import {
  biomeBackgroundPngPath,
  companionGuideCutoutPngPath,
  palmonChibiPngPath,
  palmonFullPngPath,
} from './minigameAssets'

export type PalmonArtBrief = {
  /** Cutout sans fond — superpose sur le biome en rencontre. */
  cutout: string
  /** Mascotte SD pour le refuge. */
  chibi: string
}

/** @deprecated Utiliser cutout */
export type PalmonArtBriefLegacy = { full: string; chibi: string }

const baseStyle =
  'anime gacha mobile game, Palworld-inspired cute fantasy familiar, soft colors, no text, no watermark'

/**
 * Pipeline de generation recommande, biome par biome :
 * 1. Background biome (zone libre au centre)
 * 2. Cutouts palmons du biome (fond transparent/blanc uni)
 * 3. Chibis pour le refuge
 */
export const BIOME_ART_HINTS: Record<string, string> = {
  'moon-meadow':
    'Wide anime gacha landscape 16:9. Prairie lunaire at night: ALL scenery (trees, hills, flowers) pushed to FAR LEFT edge and FAR RIGHT edge only. The CENTER 60% and lower-middle is EMPTY open moonlit grass field with nothing in it — flat clear zone for game character overlay. Fireflies optional in sky only. No creatures, no characters, no text',
  'mist-forest':
    'Wide anime gacha landscape, misty enchanted forest path, fog and teal greens, EMPTY CLEAR CENTER (lower-middle 45%) for character overlay, no creatures, no text',
  'crystal-spring':
    'Wide anime gacha landscape, crystal clear hot spring grotto, water reflections, EMPTY CLEAR CENTER (lower-middle 45%) for character overlay, no creatures, no text',
  'ember-ruins':
    'Wide anime gacha landscape, warm ember ancient ruins, orange glow and stone arches, EMPTY CLEAR CENTER (lower-middle 45%) for character overlay, no creatures, no text',
  'star-shore':
    'Wide anime gacha landscape, starlit beach shore, waves and golden horizon, EMPTY CLEAR CENTER (lower-middle 45%) for character overlay, no creatures, no text',
  'snow-peaks':
    'Wide anime gacha landscape, snowy mountain peaks, aurora sky, EMPTY CLEAR CENTER (lower-middle 45%) for character overlay, no creatures, no text',
}

function cutoutBrief(species: PalmonSpecies): string {
  const biome = getBiome(species.biomeId)?.name ?? 'fantasy biome'
  return [
    `${species.name} (${species.emoji}), ${biome} familiar creature`,
    'character cutout ONLY, full body, dynamic encounter pose facing viewer',
    'PNG with REAL alpha transparency (export from remove.bg / Photoshop — NOT white canvas, NOT checkerboard)',
    `designed to overlay on ${biome} background, rarity ${species.rarity}`,
    baseStyle,
  ].join(', ')
}

function chibiBrief(species: PalmonSpecies): string {
  return [
    `${species.name} (${species.emoji}), super deformed chibi mascot`,
    'tiny round body, cute walking side pose, farm pet sprite',
    'TRUE alpha transparent PNG (NO white canvas, NO checkerboard), NO biome scenery',
    baseStyle,
  ].join(', ')
}

function briefFor(species: PalmonSpecies): PalmonArtBrief {
  return {
    cutout: cutoutBrief(species),
    chibi: chibiBrief(species),
  }
}

export const PALMON_ART_HINTS: Record<string, PalmonArtBrief> = Object.fromEntries(
  PALMON_SPECIES.map((species) => [species.id, briefFor(species)]),
)

export type BiomeGenerationBatch = {
  biome: Biome
  biomePath: string
  biomeHint: string
  palmons: Array<{
    species: PalmonSpecies
    cutoutPath: string
    cutoutHint: string
    chibiPath: string
    chibiHint: string
  }>
}

/** Ordre de generation : 6 biomes × (1 bg + N cutouts + N chibis). */
export function listGenerationPipelineByBiome(): BiomeGenerationBatch[] {
  return BIOMES.map((biome) => ({
    biome,
    biomePath: biomeBackgroundPngPath(biome.id),
    biomeHint: BIOME_ART_HINTS[biome.id] ?? biome.name,
    palmons: PALMON_SPECIES.filter((species) => species.biomeId === biome.id).map((species) => ({
      species,
      cutoutPath: palmonFullPngPath(species.id),
      cutoutHint: PALMON_ART_HINTS[species.id].cutout,
      chibiPath: palmonChibiPngPath(species.id),
      chibiHint: PALMON_ART_HINTS[species.id].chibi,
    })),
  }))
}

export const listPalmonAssetPaths = () =>
  PALMON_SPECIES.flatMap((species) => [
    {
      step: 'cutout' as const,
      biomeId: species.biomeId,
      path: palmonFullPngPath(species.id),
      hint: PALMON_ART_HINTS[species.id].cutout,
    },
    {
      step: 'chibi' as const,
      biomeId: species.biomeId,
      path: palmonChibiPngPath(species.id),
      hint: PALMON_ART_HINTS[species.id].chibi,
    },
  ])

export const countPipelineAssets = () => {
  const batches = listGenerationPipelineByBiome()
  const biomes = batches.length
  const cutouts = PALMON_SPECIES.length
  const chibis = PALMON_SPECIES.length
  const guides = 1
  return { biomes, cutouts, chibis, guides, total: biomes + cutouts + chibis + guides }
}

export const CAPTURE_GUIDE_ASSETS = [
  {
    companionId: 'talia',
    pose: 'point' as const,
    path: companionGuideCutoutPngPath('talia', 'point', 'prairie-solaire'),
    hint:
      'Match public/assets/companions/talia/affinity-1.png — redhead braid, olive crop top, khaki shorts. Pointing right cutout, transparent.',
  },
]
