import { DEFAULT_WHEEL_PACK_ID, loadWheelPackSeed } from './wheelPacks.ts'
import type { DestinyWheelSeed, WheelDef } from './types.ts'

export const DESTINY_WHEEL_SEED = loadWheelPackSeed(DEFAULT_WHEEL_PACK_ID)

export function loadDestinyWheelSeed(): DestinyWheelSeed {
  return DESTINY_WHEEL_SEED
}

export function getSortedWheels(seed: DestinyWheelSeed = DESTINY_WHEEL_SEED): WheelDef[] {
  return [...seed.wheels].sort((a, b) => a.order - b.order)
}

export function getWheelById(wheelId: string, seed: DestinyWheelSeed = DESTINY_WHEEL_SEED): WheelDef | undefined {
  return seed.wheels.find((wheel) => wheel.id === wheelId)
}

export {
  DEFAULT_WHEEL_PACK_ID,
  DESTINY_WHEEL_PACKS,
  loadWheelPackSeed,
  readStoredWheelPackId,
  storeWheelPackId,
  getWheelPackDefinition,
  type WheelPackDefinition,
  type WheelPackId,
} from './wheelPacks.ts'
