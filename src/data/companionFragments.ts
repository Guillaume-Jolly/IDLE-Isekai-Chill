/** Compagnons éligibles aux fragments gacha (alignés sur COMPANIONS dans App). */
export const COMPANION_FRAGMENT_IDS = [
  'lyra',
  'maeve',
  'seren',
  'nami',
  'iris',
  'kael',
  'runa',
  'solene',
  'talia',
  'mira',
  'asha',
  'elwen',
  'noa',
  'sora',
  'zelie',
] as const

export type CompanionFragmentId = (typeof COMPANION_FRAGMENT_IDS)[number]

export const COMPANION_FRAGMENT_NAMES: Record<CompanionFragmentId, string> = {
  lyra: 'Lyra',
  maeve: 'Maeve',
  seren: 'Seren',
  nami: 'Nami',
  iris: 'Iris',
  kael: 'Kael',
  runa: 'Runa',
  solene: 'Solene',
  talia: 'Talia',
  mira: 'Mira',
  asha: 'Asha',
  elwen: 'Elwen',
  noa: 'Noa',
  sora: 'Sora',
  zelie: 'Zelie',
}

/** Fragments nécessaires pour +1 stat sur le compagnon associé. */
export const FRAGMENTS_PER_STAT = 10

export const createEmptyFragmentCounts = (): Record<string, number> =>
  Object.fromEntries(COMPANION_FRAGMENT_IDS.map((id) => [id, 0]))

export const fragmentStatBudget = (count: number) => Math.floor(count / FRAGMENTS_PER_STAT)

export const pickRandomCompanionFragment = (): CompanionFragmentId =>
  COMPANION_FRAGMENT_IDS[Math.floor(Math.random() * COMPANION_FRAGMENT_IDS.length)]

export const isCompanionFragmentId = (value: string): value is CompanionFragmentId =>
  (COMPANION_FRAGMENT_IDS as readonly string[]).includes(value)
