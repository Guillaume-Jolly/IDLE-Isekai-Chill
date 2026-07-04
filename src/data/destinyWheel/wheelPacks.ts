import disgaeaJson from './disgaea_destiny_wheel_enriched_v0_2.json' with { type: 'json' }
import { adaptHavreSeed } from './havreSeedAdapter.ts'
import type { DestinyWheelSeed } from './types.ts'

export type WheelPackId = 'havre' | 'disgaea'

export type WheelPackDefinition = {
  id: WheelPackId
  label: string
  subtitle: string
  kicker: string
  default: boolean
}

export const DESTINY_WHEEL_PACKS: WheelPackDefinition[] = [
  {
    id: 'havre',
    label: 'Roulette Isekai du Havre',
    subtitle: 'Refuge, Brume et destin cozy-comique',
    kicker: 'Roulette du Havre',
    default: true,
  },
  {
    id: 'disgaea',
    label: 'Roue Disgaea',
    subtitle: 'Overlord, prinny et chaos netherworld',
    kicker: 'Roue du Destin',
    default: false,
  },
]

export const DEFAULT_WHEEL_PACK_ID: WheelPackId = 'havre'
export const WHEEL_PACK_STORAGE_KEY = 'idle-isekai-destiny-wheel-pack'

const HAVRE_SEED = adaptHavreSeed()
const DISGAEA_SEED: DestinyWheelSeed = {
  ...(disgaeaJson as unknown as DestinyWheelSeed),
  pack: {
    id: 'disgaea',
    label: 'Roue Disgaea',
    kicker: 'Roue du Destin',
    commentators: {
      laharl: { name: 'Laharl' },
      etna: { name: 'Etna' },
      flonne: { name: 'Flonne' },
    },
  },
}

const PACK_SEEDS: Record<WheelPackId, DestinyWheelSeed> = {
  havre: HAVRE_SEED,
  disgaea: DISGAEA_SEED,
}

export function loadWheelPackSeed(packId: WheelPackId = DEFAULT_WHEEL_PACK_ID): DestinyWheelSeed {
  return PACK_SEEDS[packId] ?? PACK_SEEDS[DEFAULT_WHEEL_PACK_ID]
}

export function getWheelPackDefinition(packId: WheelPackId): WheelPackDefinition {
  return DESTINY_WHEEL_PACKS.find((pack) => pack.id === packId) ?? DESTINY_WHEEL_PACKS[0]
}

export function isWheelPackId(value: string): value is WheelPackId {
  return value === 'havre' || value === 'disgaea'
}

export function readStoredWheelPackId(): WheelPackId {
  if (typeof localStorage === 'undefined') return DEFAULT_WHEEL_PACK_ID
  try {
    const stored = localStorage.getItem(WHEEL_PACK_STORAGE_KEY)
    if (stored && isWheelPackId(stored)) return stored
  } catch {
    /* ignore storage errors */
  }
  return DEFAULT_WHEEL_PACK_ID
}

export function storeWheelPackId(packId: WheelPackId): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(WHEEL_PACK_STORAGE_KEY, packId)
  } catch {
    /* ignore storage errors */
  }
}
