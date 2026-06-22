import { companionAssetPath, companionMiniaturePath } from './companionAssets'
import type { StatKey } from './companionStats'
import { STAT_LABELS } from './companionStats'
import { palmonChibiPngPath } from './minigameAssets'
import {
  COMPANION_FRAGMENT_IDS,
  COMPANION_FRAGMENT_NAMES,
  FRAGMENTS_PER_STAT,
  fragmentStatBudget,
} from './companionFragments'
import { FARM_CROPS, type FarmCropId, type FarmPlot, type MinigameSave, type PetState } from './minigameSave'
import { RESOURCE_LABELS, RESOURCE_ROLES, type ResourceKey } from './resources'
import { STAT_KEYS, totalStatTokens } from './companionStats'

export type InventoryItem = {
  id: string
  label: string
  amount: number
  hint?: string
  icon?: string
  iconKey?: string
  meta?: string
  imageSrc?: string
  imageFallbackSrc?: string
  resourceKey?: ResourceKey
  speciesId?: string
  /** Affiche le nom sur la puce (cultures, outils). */
  showLabel?: boolean
  /** Quantité en badge sur l'icone (fragments compagnons). */
  badgeOverlay?: boolean
}

export type InventorySection = {
  id: string
  title: string
  description?: string
  items: InventoryItem[]
  emptyLabel?: string
  /** Afficher aussi les lignes a quantite 0 (ressources, progression). */
  showZeroAmount?: boolean
}

export type CompanionInventoryRow = {
  id: string
  name: string
  fragments: number
  fragmentProgress: number
  fragmentBudget: number
  unspentStatPoints: number
}

export type InventorySnapshot = {
  sections: InventorySection[]
  companionRows: CompanionInventoryRow[]
  totalFragments: number
  totalStatTokens: number
  petCount: number
}

const STAT_TOKEN_ICONS: Record<StatKey, string> = {
  charm: '💋',
  wit: '💡',
  vigor: '💪',
  grace: '🌸',
  insight: '🔮',
}

const RESOURCE_GROUPS: { id: string; title: string; keys: ResourceKey[] }[] = [
  {
    id: 'village',
    title: 'Village & construction',
    keys: ['coins', 'wood', 'stone', 'food', 'ingredients'],
  },
  {
    id: 'craft',
    title: 'Artisanat & cadeaux',
    keys: ['silk', 'gifts'],
  },
  {
    id: 'arcane',
    title: 'Arcane & cristaux',
    keys: ['mana', 'crystals', 'stardust'],
  },
  {
    id: 'festival',
    title: 'Festival & prestige',
    keys: ['renown', 'tickets'],
  },
]

/** Outils débloqués selon le niveau des bâtiments (pas de stock séparé pour l'instant). */
const WORKSHOP_TOOLS: {
  id: string
  label: string
  buildingId: string
  minLevel: number
  hint: string
  icon: string
}[] = [
  {
    id: 'forge-hammer',
    label: 'Marteau de forge',
    buildingId: 'ribbon-workshop',
    minLevel: 1,
    hint: 'Atelier des Rubans niv. 1+',
    icon: '🔨',
  },
  {
    id: 'forge-tongs',
    label: 'Tenailles',
    buildingId: 'ribbon-workshop',
    minLevel: 1,
    hint: 'Atelier des Rubans niv. 1+',
    icon: '⊃',
  },
  {
    id: 'golden-thread',
    label: 'Fil d\'or',
    buildingId: 'ribbon-workshop',
    minLevel: 2,
    hint: 'Atelier des Rubans niv. 2+',
    icon: '◈',
  },
  {
    id: 'arcane-needle',
    label: 'Aiguille nacrée',
    buildingId: 'ribbon-workshop',
    minLevel: 3,
    hint: 'Atelier des Rubans niv. 3+',
    icon: '†',
  },
  {
    id: 'spring-anvil',
    label: 'Enclume de source',
    buildingId: 'clear-spring',
    minLevel: 2,
    hint: 'Source Claire niv. 2+',
    icon: '⚒️',
  },
  {
    id: 'moon-sickle',
    label: 'Faucille lunaire',
    buildingId: 'moon-farm',
    minLevel: 2,
    hint: 'Ferme Lunaire niv. 2+',
    icon: '🌙',
  },
  {
    id: 'garden-shears',
    label: 'Cisailles de brume',
    buildingId: 'mist-garden',
    minLevel: 2,
    hint: 'Jardin des Brumes niv. 2+',
    icon: '✂️',
  },
  {
    id: 'library-quill',
    label: 'Plume d\'archiviste',
    buildingId: 'arcane-library',
    minLevel: 2,
    hint: 'Bibliothèque niv. 2+',
    icon: '✒',
  },
]

const formatAmount = (amount: number) => Math.floor(amount).toLocaleString('fr-FR')

const buildResourceSections = (resources: Record<ResourceKey, number>): InventorySection[] =>
  RESOURCE_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    showZeroAmount: true,
    items: group.keys.map((key) => ({
      id: key,
      label: RESOURCE_LABELS[key],
      amount: resources[key] ?? 0,
      hint: RESOURCE_ROLES[key],
      resourceKey: key,
    })),
  }))

const buildFragmentSection = (
  fragments: Record<string, number>,
): InventorySection => ({
  id: 'fragments',
  title: 'Fragments compagnons',
  description: `${FRAGMENTS_PER_STAT} fragments = +1 stat (onglet Liens).`,
  items: COMPANION_FRAGMENT_IDS.map((id) => {
    const amount = fragments[id] ?? 0
    const budget = fragmentStatBudget(amount)
    const progress = amount % FRAGMENTS_PER_STAT
    return {
      id: `frag-${id}`,
      label: COMPANION_FRAGMENT_NAMES[id],
      amount,
      badgeOverlay: true,
      showLabel: true,
      imageSrc: companionMiniaturePath(id),
      imageFallbackSrc: companionAssetPath(id, 1),
      meta:
        budget > 0
          ? `${budget} échange${budget > 1 ? 's' : ''} prêt${budget > 1 ? 's' : ''}`
          : `${progress}/${FRAGMENTS_PER_STAT} vers +1 stat`,
      hint:
        amount > 0
          ? `${amount} fragment${amount > 1 ? 's' : ''} — échange 10 contre +1 stat sur ${COMPANION_FRAGMENT_NAMES[id]}`
          : 'Aucun fragment',
    }
  }).filter((item) => item.amount > 0),
  emptyLabel: 'Aucun fragment — invoque au festival pour en obtenir.',
})

const buildStatTokenSection = (statTokens: Record<StatKey, number>): InventorySection => ({
  id: 'stat-tokens',
  title: 'Jetons de stat (gacha)',
  description: 'Assigne-les sur la stat d\'un compagnon (onglet Liens).',
  items: STAT_KEYS.filter((key) => statTokens[key] > 0).map((key) => ({
    id: `token-${key}`,
    label: STAT_LABELS[key],
    amount: statTokens[key],
    icon: STAT_TOKEN_ICONS[key],
    hint: `+1 ${STAT_LABELS[key]} au compagnon de ton choix`,
  })),
  emptyLabel: 'Aucun jeton — rareté SR+ au gacha.',
})

const buildWorkshopSection = (buildings: Record<string, number>): InventorySection => ({
  id: 'workshop-tools',
  title: 'Outils & équipement',
  description: 'Débloqués par les niveaux de bâtiments.',
  items: WORKSHOP_TOOLS.filter((tool) => (buildings[tool.buildingId] ?? 0) >= tool.minLevel).map(
    (tool) => ({
      id: tool.id,
      label: tool.label,
      amount: 1,
      icon: tool.icon,
      iconKey: tool.id,
      showLabel: true,
      hint: tool.hint,
      meta: 'Possédé',
    }),
  ),
  emptyLabel: 'Améliore l\'atelier, la source ou le jardin pour débloquer des outils.',
})

const buildFarmSection = (farmPlots: FarmPlot[]): InventorySection => {
  const counts = new Map<FarmCropId, number>()
  for (const plot of farmPlots) {
    if (!plot) continue
    counts.set(plot.cropId, (counts.get(plot.cropId) ?? 0) + 1)
  }

  return {
    id: 'farm',
    title: 'Parcelles ferme lunaire',
    items: [...counts.entries()].flatMap(([cropId, amount]) => {
      const crop = FARM_CROPS[cropId]
      if (!crop) return []
      return [
        {
          id: `farm-crop-${cropId}`,
          label: crop.label,
          amount,
          icon: crop.emoji,
          iconKey: cropId,
          showLabel: true,
          hint: crop.hint,
          meta: amount > 1 ? `${amount} parcelles` : 'En croissance',
        },
      ]
    }),
    emptyLabel: 'Aucune culture en cours — lance la ferme lunaire.',
  }
}

const buildPetSection = (pets: PetState[]): InventorySection => ({
  id: 'pets',
  title: 'Familiers',
  items: pets.map((pet) => ({
    id: pet.id,
    label: pet.name,
    amount: 1,
    speciesId: pet.speciesId,
    imageSrc: palmonChibiPngPath(pet.speciesId),
    icon: pet.emoji,
    hint: `${pet.rarity} · faim ${Math.round(pet.hunger)} · joie ${Math.round(pet.joy)}`,
    meta: pet.rarity,
  })),
  emptyLabel: 'Aucun familier — capture-les au sanctuaire.',
})

const buildCaptureSection = (captureStats: MinigameSave['captureStats']): InventorySection | null => {
  if (!captureStats || captureStats.totalCaught <= 0) return null
  return {
    id: 'capture',
    title: 'Chasse aux familiers',
    items: [
      {
        id: 'capture-total',
        label: 'Captures totales',
        amount: captureStats.totalCaught,
        icon: '🎯',
        hint: 'Familiers attrapés en exploration',
      },
      ...(captureStats.bestRarity
        ? [
            {
              id: 'capture-best',
              label: 'Meilleure rareté',
              amount: 1,
              icon: '🏆',
              meta: captureStats.bestRarity,
              hint: 'Record personnel de capture',
            },
          ]
        : []),
    ],
  }
}

export type BuildInventoryInput = {
  resources: Record<ResourceKey, number>
  companionFragments: Record<string, number>
  statTokens: Record<StatKey, number>
  buildings: Record<string, number>
  minigameSave: MinigameSave
  companions: Record<
    string,
    {
      unspentStatPoints: number
    }
  >
  eventPulls: number
  questsClaimed: number
}

export const buildInventorySnapshot = (input: BuildInventoryInput): InventorySnapshot => {
  const companionRows: CompanionInventoryRow[] = COMPANION_FRAGMENT_IDS.map((id) => {
    const fragments = input.companionFragments[id] ?? 0
    return {
      id,
      name: COMPANION_FRAGMENT_NAMES[id],
      fragments,
      fragmentProgress: fragments % FRAGMENTS_PER_STAT,
      fragmentBudget: fragmentStatBudget(fragments),
      unspentStatPoints: input.companions[id]?.unspentStatPoints ?? 0,
    }
  })

  const statPointItems: InventoryItem[] = companionRows
    .filter((row) => row.unspentStatPoints > 0)
    .map((row) => ({
      id: `statpt-${row.id}`,
      label: row.name,
      amount: row.unspentStatPoints,
      badgeOverlay: true,
      imageSrc: companionMiniaturePath(row.id),
      imageFallbackSrc: companionAssetPath(row.id, 1),
      hint: 'Points niveau / affinité — onglet Liens',
      meta: 'À assigner sur une stat',
    }))

  const sections: InventorySection[] = [
    ...buildResourceSections(input.resources),
    buildFragmentSection(input.companionFragments),
    buildStatTokenSection(input.statTokens),
    ...(statPointItems.length > 0
      ? [
          {
            id: 'companion-stat-points',
            title: 'Points de stat compagnons',
            description: 'Gagnés en montant de niveau ou d\'affinité.',
            items: statPointItems,
          } satisfies InventorySection,
        ]
      : []),
    buildWorkshopSection(input.buildings),
    buildFarmSection(input.minigameSave.farmPlots),
    buildPetSection(input.minigameSave.pets),
    ...(buildCaptureSection(input.minigameSave.captureStats)
      ? [buildCaptureSection(input.minigameSave.captureStats)!]
      : []),
    {
      id: 'misc',
      title: 'Progression festival',
      showZeroAmount: true,
      emptyLabel: 'Aucune progression enregistree pour le moment.',
      items: [
        {
          id: 'event-pulls',
          label: 'Invocations gacha',
          amount: input.eventPulls,
          icon: '🎊',
          hint: 'Total de tirages effectués',
        },
        {
          id: 'quests-claimed',
          label: 'Quêtes terminées',
          amount: input.questsClaimed,
          icon: '📜',
          hint: 'Mini-quêtes réclamées',
        },
      ],
    },
  ]

  const totalFragments = Object.values(input.companionFragments).reduce(
    (sum, value) => sum + value,
    0,
  )

  return {
    sections,
    companionRows,
    totalFragments,
    totalStatTokens: totalStatTokens(input.statTokens),
    petCount: input.minigameSave.pets.length,
  }
}

export { formatAmount as formatInventoryAmount, FRAGMENTS_PER_STAT, WORKSHOP_TOOLS }

const INVENTORY_GLYPH_KEYS = new Set([
  'star-berry',
  'arcane-needle',
  'library-quill',
  'golden-thread',
  'forge-hammer',
  'forge-tongs',
  'spring-anvil',
  'moon-sickle',
  'garden-shears',
])

export const inventoryGlyphChar = (iconKey: string): string | null => {
  switch (iconKey) {
    case 'star-berry':
      return '★'
    case 'arcane-needle':
      return '†'
    case 'library-quill':
      return '✒'
    case 'golden-thread':
      return '◈'
    case 'forge-hammer':
      return '⌁'
    case 'forge-tongs':
      return '⊃'
    case 'spring-anvil':
      return '⛏'
    case 'moon-sickle':
      return '☽'
    case 'garden-shears':
      return '✂'
    default:
      return null
  }
}

export const usesInventoryGlyph = (iconKey?: string): iconKey is string =>
  Boolean(iconKey && INVENTORY_GLYPH_KEYS.has(iconKey))
