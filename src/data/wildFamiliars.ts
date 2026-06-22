import {
  biomeBackgroundPath,
  getPalmonAssetPath,
  type PalmonSpriteVariant,
} from './minigameAssets'

export type PalmonRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR'

export type Biome = {
  id: string
  name: string
  emoji: string
  /** Fallback CSS si /minigames/biomes/{id}.png absent */
  fallbackGradient: string
}

export type PalmonSpecies = {
  id: string
  name: string
  emoji: string
  rarity: PalmonRarity
  biomeId: string
}

export type WildEncounter = {
  biome: Biome
  palmon: PalmonSpecies
}

export const PALMON_RARITIES: PalmonRarity[] = ['N', 'R', 'SR', 'SSR', 'UR', 'LR']

export const RARITY_WEIGHTS: Record<PalmonRarity, number> = {
  N: 45,
  R: 28,
  SR: 15,
  SSR: 8,
  UR: 3.5,
  LR: 0.5,
}

export const RARITY_COLORS: Record<PalmonRarity, string> = {
  N: '#9aa3b2',
  R: '#5a9fd4',
  SR: '#b49bff',
  SSR: '#ffb347',
  UR: '#ff6eb4',
  LR: '#ffd700',
}

/** Fenetre de capture : anneau interieur rejoint l exterieur a ~66% du temps. */
export const RARITY_CAPTURE: Record<
  PalmonRarity,
  { sweetHalfWidth: number; durationMs: number; startScale: number; endScale: number }
> = {
  N: { sweetHalfWidth: 0.07, durationMs: 3000, startScale: 1.62, endScale: 0.68 },
  R: { sweetHalfWidth: 0.055, durationMs: 2700, startScale: 1.64, endScale: 0.66 },
  SR: { sweetHalfWidth: 0.042, durationMs: 2400, startScale: 1.66, endScale: 0.64 },
  SSR: { sweetHalfWidth: 0.032, durationMs: 2100, startScale: 1.68, endScale: 0.62 },
  UR: { sweetHalfWidth: 0.024, durationMs: 1850, startScale: 1.7, endScale: 0.6 },
  LR: { sweetHalfWidth: 0.018, durationMs: 1600, startScale: 1.72, endScale: 0.58 },
}

export const CAPTURE_SWEET_CENTER = 0.66

export const BIOMES: Biome[] = [
  {
    id: 'moon-meadow',
    name: 'Prairie lunaire',
    emoji: '🌙',
    fallbackGradient: 'linear-gradient(180deg, #1a2840 0%, #4a6a90 35%, #9ed56b 100%)',
  },
  {
    id: 'mist-forest',
    name: 'Foret brumeuse',
    emoji: '🌫️',
    fallbackGradient: 'linear-gradient(180deg, #2a3a48 0%, #6a8a78 40%, #3d5a48 100%)',
  },
  {
    id: 'crystal-spring',
    name: 'Source cristalline',
    emoji: '💎',
    fallbackGradient: 'linear-gradient(180deg, #1a3050 0%, #6ec8ff 45%, #a8e8ff 100%)',
  },
  {
    id: 'ember-ruins',
    name: 'Ruines ardentes',
    emoji: '🔥',
    fallbackGradient: 'linear-gradient(180deg, #2a1820 0%, #c05830 50%, #ffb86b 100%)',
  },
  {
    id: 'star-shore',
    name: 'Rivage etoile',
    emoji: '🌊',
    fallbackGradient: 'linear-gradient(180deg, #1a2848 0%, #4a88c8 55%, #ffd56a 100%)',
  },
  {
    id: 'snow-peaks',
    name: 'Sommets enneiges',
    emoji: '❄️',
    fallbackGradient: 'linear-gradient(180deg, #384858 0%, #a8c8e8 50%, #f0f8ff 100%)',
  },
]

export const PALMON_SPECIES: PalmonSpecies[] = [
  { id: 'moon-sprout', name: 'Pousselune', emoji: '🌱', rarity: 'N', biomeId: 'moon-meadow' },
  { id: 'moon-hop', name: 'Sautelune', emoji: '🐰', rarity: 'R', biomeId: 'moon-meadow' },
  { id: 'moon-glow', name: 'Clairlune', emoji: '✨', rarity: 'SR', biomeId: 'moon-meadow' },
  { id: 'moon-queen', name: 'Regalune', emoji: '🌙', rarity: 'SSR', biomeId: 'moon-meadow' },
  { id: 'mist-wisp', name: 'Brumeux', emoji: '💧', rarity: 'N', biomeId: 'mist-forest' },
  { id: 'mist-fox', name: 'Renard brume', emoji: '🦊', rarity: 'R', biomeId: 'mist-forest' },
  { id: 'mist-owl', name: 'Noctivox', emoji: '🦉', rarity: 'SR', biomeId: 'mist-forest' },
  { id: 'mist-spirit', name: 'Esprit brume', emoji: '👻', rarity: 'UR', biomeId: 'mist-forest' },
  { id: 'spring-drop', name: 'Gouttele', emoji: '💧', rarity: 'N', biomeId: 'crystal-spring' },
  { id: 'spring-koi', name: 'Koiciel', emoji: '🐟', rarity: 'R', biomeId: 'crystal-spring' },
  { id: 'spring-pearl', name: 'Nacrenoir', emoji: '🫧', rarity: 'SSR', biomeId: 'crystal-spring' },
  { id: 'spring-angel', name: 'Angelle', emoji: '🪽', rarity: 'LR', biomeId: 'crystal-spring' },
  { id: 'ember-puff', name: 'Cendrelin', emoji: '🔥', rarity: 'N', biomeId: 'ember-ruins' },
  { id: 'ember-salam', name: 'Salambrase', emoji: '🦎', rarity: 'R', biomeId: 'ember-ruins' },
  { id: 'ember-phoenix', name: 'Braiseaile', emoji: '🐦‍🔥', rarity: 'SSR', biomeId: 'ember-ruins' },
  { id: 'star-shell', name: 'Coquille', emoji: '🐚', rarity: 'N', biomeId: 'star-shore' },
  { id: 'star-crab', name: 'Astecrab', emoji: '🦀', rarity: 'R', biomeId: 'star-shore' },
  { id: 'star-dolphin', name: 'Delphire', emoji: '🐬', rarity: 'SR', biomeId: 'star-shore' },
  { id: 'star-leviathan', name: 'Leviastre', emoji: '🐋', rarity: 'UR', biomeId: 'star-shore' },
  { id: 'snow-puff', name: 'Flocon', emoji: '❄️', rarity: 'N', biomeId: 'snow-peaks' },
  { id: 'snow-bear', name: 'Ours givre', emoji: '🐻‍❄️', rarity: 'R', biomeId: 'snow-peaks' },
  { id: 'snow-yeti', name: 'Yetinuit', emoji: '🏔️', rarity: 'SR', biomeId: 'snow-peaks' },
  { id: 'snow-dragon', name: 'Dracogivre', emoji: '🐉', rarity: 'LR', biomeId: 'snow-peaks' },
]

export const getBiome = (biomeId: string) => BIOMES.find((biome) => biome.id === biomeId)

export const getPalmonImage = (speciesId: string, variant: PalmonSpriteVariant = 'full') =>
  getPalmonAssetPath(speciesId, variant)

export const getBiomeImage = (biomeId: string) => biomeBackgroundPath(biomeId)

/** Biomes dont le PNG de fond existe deja dans public/minigames/biomes/ */
export const BIOMES_WITH_BACKGROUNDS = BIOMES.map((biome) => biome.id)

export function rollRarity(): PalmonRarity {
  const roll = Math.random() * 100
  let cumulative = 0
  for (const rarity of PALMON_RARITIES) {
    cumulative += RARITY_WEIGHTS[rarity]
    if (roll <= cumulative) {
      return rarity
    }
  }
  return 'N'
}

export function rollEncounter(): WildEncounter {
  const readyBiomes = BIOMES.filter((biome) =>
    (BIOMES_WITH_BACKGROUNDS as readonly string[]).includes(biome.id),
  )
  const biome = readyBiomes[Math.floor(Math.random() * readyBiomes.length)] ?? BIOMES[0]
  const rarity = rollRarity()
  const pool = PALMON_SPECIES.filter(
    (species) => species.biomeId === biome.id && species.rarity === rarity,
  )
  const fallbackPool = PALMON_SPECIES.filter((species) => species.biomeId === biome.id)
  const palmon =
    pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : fallbackPool[Math.floor(Math.random() * fallbackPool.length)]

  return { biome, palmon }
}

export function captureRingScale(progress: number, rarity: PalmonRarity) {
  const { startScale, endScale } = RARITY_CAPTURE[rarity]
  return startScale - progress * (startScale - endScale)
}

export function isCaptureSuccess(progress: number, rarity: PalmonRarity) {
  const { sweetHalfWidth } = RARITY_CAPTURE[rarity]
  return (
    progress >= CAPTURE_SWEET_CENTER - sweetHalfWidth &&
    progress <= CAPTURE_SWEET_CENTER + sweetHalfWidth
  )
}

export const wildToPetState = (
  palmon: PalmonSpecies,
  instanceId: string,
  now = Date.now(),
) => ({
  id: instanceId,
  speciesId: palmon.id,
  name: palmon.name,
  emoji: palmon.emoji,
  rarity: palmon.rarity,
  biomeId: palmon.biomeId,
  hunger: 72,
  joy: 78,
  lastVisit: now,
})
