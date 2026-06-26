import type { PetState } from './minigameSave'
import {
  getSpotsForBiome,
  worksiteAssignedPets,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksite'
import { isWorksiteSpotUnlocked } from './myrionWorksiteProgression'

export type DecorativeMyrionState = 'working' | 'resting' | 'eating' | 'sleeping'

export const WORKSITE_LIFE_BUCKET_SEC = 60
export const WORKSITE_LIFE_MAX_VISIBLE = 8

export type WorksiteLifeEntry = {
  pet: PetState
  spotId: WorksiteSpotId
  spotKey: string
  spotIndex: number
  slotAtSpot: number
  state: DecorativeMyrionState
}

export type WorksiteLifeView = {
  visible: WorksiteLifeEntry[]
  overflow: number
  totalAssigned: number
  dominantState: DecorativeMyrionState | null
  stateCounts: Record<DecorativeMyrionState, number>
}

export function getLifeTimeBucket(now = Date.now(), bucketSec = WORKSITE_LIFE_BUCKET_SEC): number {
  return Math.floor(now / (bucketSec * 1000))
}

export function getDecorativeMyrionState(
  myrionId: string,
  bucket: number,
  assignedSpotKey: string,
): DecorativeMyrionState {
  const seed = `${myrionId}:${bucket}:${assignedSpotKey}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  const roll = hash % 10
  if (roll < 5) return 'working'
  if (roll < 7) return 'resting'
  if (roll < 9) return 'eating'
  return 'sleeping'
}

export function decorativeStateLabel(state: DecorativeMyrionState): string {
  switch (state) {
    case 'working':
      return 'Au travail'
    case 'resting':
      return 'Repos'
    case 'eating':
      return 'Repas'
    case 'sleeping':
      return 'Sommeil'
    default:
      return state
  }
}

export function shortMyrionName(name: string, max = 8): string {
  const trimmed = name.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

export function buildWorksiteLifeView(
  worksite: MyrionWorksiteSave,
  activeBiomeId: WorksiteBiomeId,
  pets: PetState[],
  bucket = getLifeTimeBucket(),
): WorksiteLifeView {
  const spots = getSpotsForBiome(activeBiomeId)
  const entries: WorksiteLifeEntry[] = []

  for (let spotIndex = 0; spotIndex < spots.length; spotIndex++) {
    const spot = spots[spotIndex]
    if (!isWorksiteSpotUnlocked(worksite, activeBiomeId, spot.id)) continue
    const assigned = worksiteAssignedPets(worksite, activeBiomeId, spot.id, pets)
    const spotKey = worksiteSpotKey(activeBiomeId, spot.id)
    assigned.forEach((pet, slotAtSpot) => {
      entries.push({
        pet,
        spotId: spot.id,
        spotKey,
        spotIndex,
        slotAtSpot,
        state: getDecorativeMyrionState(pet.id, bucket, spotKey),
      })
    })
  }

  const stateCounts: Record<DecorativeMyrionState, number> = {
    working: 0,
    resting: 0,
    eating: 0,
    sleeping: 0,
  }
  for (const entry of entries) stateCounts[entry.state]++

  const dominantState =
    entries.length === 0
      ? null
      : (Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0] as DecorativeMyrionState)

  return {
    visible: entries.slice(0, WORKSITE_LIFE_MAX_VISIBLE),
    overflow: Math.max(0, entries.length - WORKSITE_LIFE_MAX_VISIBLE),
    totalAssigned: entries.length,
    dominantState,
    stateCounts,
  }
}

export type WorksiteLifeAnchor = {
  left: string
  bottom: string
}

export function spotAnchorPercent(spotIndex: number, spotCount: number): WorksiteLifeAnchor {
  if (spotCount <= 1) return { left: '50%', bottom: '42%' }
  const t = spotIndex / (spotCount - 1)
  const left = 18 + t * 64
  return { left: `${left}%`, bottom: '42%' }
}

export const WORKSITE_REST_ZONE_ANCHOR: WorksiteLifeAnchor = { left: '14%', bottom: '68%' }
export const WORKSITE_FOOD_ZONE_ANCHOR: WorksiteLifeAnchor = { left: '86%', bottom: '68%' }

export function lifeEntryAnchor(
  entry: WorksiteLifeEntry,
  spotCount: number,
): WorksiteLifeAnchor {
  const spotOffset = (entry.slotAtSpot % 3) - 1
  const jitter = ((entry.pet.id.charCodeAt(0) ?? 0) % 5) - 2

  switch (entry.state) {
    case 'resting':
    case 'sleeping':
      return {
        left: `calc(${WORKSITE_REST_ZONE_ANCHOR.left} + ${spotOffset * 6 + jitter}px)`,
        bottom: WORKSITE_REST_ZONE_ANCHOR.bottom,
      }
    case 'eating':
      return {
        left: `calc(${WORKSITE_FOOD_ZONE_ANCHOR.left} + ${spotOffset * 6 + jitter}px)`,
        bottom: WORKSITE_FOOD_ZONE_ANCHOR.bottom,
      }
    default: {
      const base = spotAnchorPercent(entry.spotIndex, spotCount)
      return {
        left: `calc(${base.left} + ${spotOffset * 10 + jitter}px)`,
        bottom: base.bottom,
      }
    }
  }
}
