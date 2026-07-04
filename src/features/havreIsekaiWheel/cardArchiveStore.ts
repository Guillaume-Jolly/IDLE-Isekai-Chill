import type { MinigameSave } from '../../data/minigameSave'
import type {
  HavreArchiveBucket,
  HavreArchiveRules,
  HavreGameModeId,
  HavreWheelSave,
  SavedHavreIsekaiCard,
} from './types'

export const EMPTY_HAVRE_ARCHIVES: Record<HavreArchiveBucket, SavedHavreIsekaiCard[]> = {
  hardcore: [],
  auto_roll: [],
  artist: [],
}

export function createDefaultHavreWheelSave(mode: HavreGameModeId = 'hardcore'): HavreWheelSave {
  return {
    preferredMode: mode,
    archives: { ...EMPTY_HAVRE_ARCHIVES, hardcore: [], auto_roll: [], artist: [] },
  }
}

export function normalizeHavreWheelSave(partial?: Partial<HavreWheelSave>): HavreWheelSave {
  const base = createDefaultHavreWheelSave(partial?.preferredMode ?? 'hardcore')
  if (!partial) return base
  return {
    preferredMode: partial.preferredMode ?? base.preferredMode,
    archives: {
      hardcore: partial.archives?.hardcore ?? [],
      auto_roll: partial.archives?.auto_roll ?? [],
      artist: partial.archives?.artist ?? [],
    },
  }
}

function isProtected(card: SavedHavreIsekaiCard): boolean {
  return card.playerMeta.favorite || card.playerMeta.locked
}

function enforceArchiveOverflow(
  cards: SavedHavreIsekaiCard[],
  maxCards: number,
): SavedHavreIsekaiCard[] {
  const protectedCards = cards.filter(isProtected)
  const mutable = cards.filter((card) => !isProtected(card))
  const overflow = mutable.length + protectedCards.length - maxCards
  if (overflow <= 0) return cards
  const trimmedMutable = mutable.slice(overflow)
  return [...protectedCards, ...trimmedMutable].sort((a, b) => a.createdAt - b.createdAt)
}

export function addCardToHavreArchive(
  save: HavreWheelSave,
  card: SavedHavreIsekaiCard,
  rules: HavreArchiveRules,
): HavreWheelSave {
  const bucket = card.mode
  const nextBucket = [...save.archives[bucket], card]
  const trimmed = enforceArchiveOverflow(nextBucket, rules.max_cards_per_mode)
  return {
    ...save,
    archives: {
      ...save.archives,
      [bucket]: trimmed,
    },
  }
}

export function updateHavreCard(
  save: HavreWheelSave,
  cardId: string,
  updates: Partial<Pick<SavedHavreIsekaiCard, 'customName' | 'displayName'>> & {
    favorite?: boolean
    locked?: boolean
    note?: string
  },
): HavreWheelSave {
  const archives = { ...save.archives }
  for (const bucket of Object.keys(archives) as HavreArchiveBucket[]) {
    archives[bucket] = archives[bucket].map((card) => {
      if (card.id !== cardId) return card
      const displayName = updates.displayName ?? updates.customName ?? card.displayName
      return {
        ...card,
        updatedAt: Date.now(),
        customName: updates.customName ?? card.customName,
        displayName,
        playerMeta: {
          ...card.playerMeta,
          favorite: updates.favorite ?? card.playerMeta.favorite,
          locked: updates.locked ?? card.playerMeta.locked,
          note: updates.note ?? card.playerMeta.note,
        },
      }
    })
  }
  return { ...save, archives }
}

export function mergeHavreWheelIntoMinigameSave(
  minigameSave: MinigameSave | undefined,
  havreWheel: HavreWheelSave,
): MinigameSave {
  return {
    ...(minigameSave ?? { farmPlots: [], pets: [] }),
    havreWheel,
  }
}
