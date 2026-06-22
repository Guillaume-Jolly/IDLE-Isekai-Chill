import type { PalmonRarity } from './wildFamiliars'

export type RecentCaptureEntry = {
  key: string
  speciesId: string
  name: string
  emoji: string
  rarity: PalmonRarity
  biomeId: string
  success: boolean
  timestamp: number
}

export function buildRecentCapturesFromPets(
  pets: Array<{
    id: string
    speciesId: string
    name: string
    emoji: string
    rarity: PalmonRarity
    biomeId: string
  }>,
): RecentCaptureEntry[] {
  return [...pets]
    .map((pet) => {
      const match = pet.id.match(/-(\d+)$/)
      return {
        key: pet.id,
        speciesId: pet.speciesId,
        name: pet.name,
        emoji: pet.emoji,
        rarity: pet.rarity,
        biomeId: pet.biomeId,
        success: true,
        timestamp: match ? Number.parseInt(match[1], 10) : 0,
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
}
