import type { CharacterSheet } from './types'
import type { WheelPackId } from './wheelPacks'

export const DESTINY_WHEEL_MAX_CARDS_PER_PACK = 100

export type SavedDestinyWheelCard = {
  id: string
  packId: WheelPackId
  completedAt: number
  name: string
  title: string
  verdictId: string
  /** Score récompense run */
  score: number
  /** Note affichée fiche (0–100) */
  displayScore: number
  favorite: boolean
  sheet: CharacterSheet
}

export type DestinyWheelArchives = Record<WheelPackId, SavedDestinyWheelCard[]>

export type DestinyWheelSave = {
  totalRuns: number
  lastRunAt?: number
  lastVerdictId?: string
  lastName?: string
  archives: DestinyWheelArchives
}

type LegacyHistoryEntry = {
  id: string
  completedAt: number
  verdictId: string
  name: string
  title?: string
  score?: number
  favorite?: boolean
  packId?: string
}

const EMPTY_ARCHIVES = (): DestinyWheelArchives => ({
  havre: [],
  disgaea: [],
})

export function createDefaultDestinyWheelSave(): DestinyWheelSave {
  return { totalRuns: 0, archives: EMPTY_ARCHIVES() }
}

function isWheelPackId(value: string | undefined): value is WheelPackId {
  return value === 'havre' || value === 'disgaea'
}

function enforceArchiveOverflow(
  cards: SavedDestinyWheelCard[],
  maxCards: number,
): SavedDestinyWheelCard[] {
  const favorites = cards.filter((card) => card.favorite)
  const others = cards.filter((card) => !card.favorite)
  const overflow = favorites.length + others.length - maxCards
  if (overflow <= 0) return cards
  const trimmedOthers = others.slice(overflow)
  return [...favorites, ...trimmedOthers].sort((a, b) => a.completedAt - b.completedAt)
}

export function normalizeDestinyWheelSave(
  partial?: Partial<DestinyWheelSave & { history?: LegacyHistoryEntry[] }>,
): DestinyWheelSave {
  const base = createDefaultDestinyWheelSave()
  if (!partial) return base

  const archives = EMPTY_ARCHIVES()
  if (partial.archives) {
    archives.havre = [...(partial.archives.havre ?? [])]
    archives.disgaea = [...(partial.archives.disgaea ?? [])]
  }

  if (partial.history?.length && !partial.archives) {
    for (const entry of partial.history) {
      const packId = isWheelPackId(entry.packId) ? entry.packId : 'disgaea'
      archives[packId].push({
        id: entry.id,
        packId,
        completedAt: entry.completedAt,
        name: entry.name,
        title: entry.title ?? entry.verdictId,
        verdictId: entry.verdictId,
        score: entry.score ?? 0,
        displayScore: entry.score ?? 0,
        favorite: entry.favorite ?? false,
        sheet: legacyPlaceholderSheet(entry),
      })
    }
    archives.havre = enforceArchiveOverflow(archives.havre, DESTINY_WHEEL_MAX_CARDS_PER_PACK)
    archives.disgaea = enforceArchiveOverflow(archives.disgaea, DESTINY_WHEEL_MAX_CARDS_PER_PACK)
  }

  return {
    totalRuns: partial.totalRuns ?? base.totalRuns,
    lastRunAt: partial.lastRunAt,
    lastVerdictId: partial.lastVerdictId,
    lastName: partial.lastName,
    archives,
  }
}

function legacyPlaceholderSheet(entry: LegacyHistoryEntry): CharacterSheet {
  return {
    identity: {
      name: entry.name,
      title: entry.title ?? entry.verdictId,
      origin: '—',
      raceType: '—',
      mainClass: '—',
      rank: '—',
      affiliation: '—',
      crimeDebt: '—',
    },
    stats: { level: 1, core: {}, secondary: {} },
    weapons: { main: '—', mainMastery: '—' },
    item: { itemWorld: '—', mainItem: '—', itemTrait: '—' },
    evilities: { unique: '—', secondary1: '—', secondary2: '—', cursed: '—' },
    reincarnation: { status: '—' },
    ultimateForm: { label: 'Forme', name: '—' },
    finale: {
      rival: '—',
      boss: '—',
      verdict: { id: entry.verdictId, label: entry.verdictId, priority: 1, selected: true as const },
      winChance: 0,
      combos: [],
      statRoasts: [],
      reward: {},
      comicLine: 'Fiche non archivée (migration — relance une run pour une fiche complète).',
    },
  }
}

export function addCardToDestinyArchive(
  archives: DestinyWheelArchives | undefined,
  card: SavedDestinyWheelCard,
  maxCards = DESTINY_WHEEL_MAX_CARDS_PER_PACK,
): DestinyWheelArchives {
  const next = {
    havre: [...(archives?.havre ?? [])],
    disgaea: [...(archives?.disgaea ?? [])],
  }
  const bucket = [...next[card.packId], card]
  next[card.packId] = enforceArchiveOverflow(bucket, maxCards)
  return next
}

export function updateDestinyArchiveCard(
  archives: DestinyWheelArchives | undefined,
  cardId: string,
  updates: Partial<Pick<SavedDestinyWheelCard, 'name' | 'favorite'>>,
): DestinyWheelArchives {
  const next = {
    havre: [...(archives?.havre ?? [])],
    disgaea: [...(archives?.disgaea ?? [])],
  }
  for (const packId of ['havre', 'disgaea'] as const) {
    next[packId] = next[packId].map((card) =>
      card.id === cardId ? { ...card, ...updates, name: updates.name ?? card.name } : card,
    )
  }
  return next
}

export function countDestinyArchiveCards(archives: DestinyWheelArchives | undefined): number {
  return (archives?.havre.length ?? 0) + (archives?.disgaea.length ?? 0)
}

export function listDestinyArchiveForPack(
  archives: DestinyWheelArchives | undefined,
  packId: WheelPackId,
): SavedDestinyWheelCard[] {
  return archives?.[packId] ?? []
}
