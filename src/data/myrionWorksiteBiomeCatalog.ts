/**
 * Catalogue étendu Ferme lunaire — MVP 13.
 * Module feuille : pas d'import gameplay / React / myrionWorksite.
 * Les 3 premiers biomes correspondent aux IDs techniques MVP 1–12.
 */

export const WORKSITE_CATALOG_BIOME_IDS = [
  'prairie-chantier',
  'foret-douce',
  'mine-tranquille',
  'marais-lucioles',
  'rivage-brumeux',
  'vergers-suspendus',
  'ruines-florales',
  'grotte-cristalline',
  'desert-cendres-roses',
  'montagne-vents',
  'lac-etoile',
  'bois-automne-eternel',
  'jardin-fongique',
  'sanctuaire-astral',
  'ile-celeste',
] as const

export type WorksiteCatalogBiomeId = (typeof WORKSITE_CATALOG_BIOME_IDS)[number]

/** Biomes déjà jouables en MVP 1–12 — IDs inchangés. */
export const LEGACY_PLAYABLE_BIOME_IDS = [
  'prairie-chantier',
  'foret-douce',
  'mine-tranquille',
] as const satisfies readonly WorksiteCatalogBiomeId[]

export type LegacyPlayableBiomeId = (typeof LEGACY_PLAYABLE_BIOME_IDS)[number]

export type WorksiteComponentType =
  | 'food'
  | 'wood'
  | 'stone'
  | 'herb'
  | 'water'
  | 'ore'
  | 'coal'
  | 'crystal'
  | 'flower'
  | 'mushroom'
  | 'sand'
  | 'shell'
  | 'wind'
  | 'astral'
  | 'seed'
  | 'relic'

export type WorksiteCatalogResourceId =
  | 'food'
  | 'wood'
  | 'stone'
  | 'herb'
  | 'water'
  | 'ore'
  | 'coal'
  | 'crystal'
  | 'flower'
  | 'mushroom'
  | 'sand'
  | 'shell'
  | 'wind'
  | 'astral'
  | 'seed'
  | 'relic'
  | 'ingredients'

export type WorksiteAssetStatus = 'active' | 'placeholder' | 'missing' | 'future'

export type WorksiteCatalogGameplayStatus = 'active' | 'catalog-only' | 'future'

export type WorksitePlacementSlotId =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'midLeft'
  | 'midRight'
  | 'bottomCenter'

export type WorksitePlacementSlot = {
  id: WorksitePlacementSlotId
  xPercent: number
  yPercent: number
  scale: number
  mobileXPercent?: number
  mobileYPercent?: number
  notes?: string
}

export type WorksiteCatalogComponent = {
  id: string
  displayName: string
  type: WorksiteComponentType
  producedResource: WorksiteCatalogResourceId
  description: string
  visualIntent: string
  assetKey: string
  recommendedPlacementSlot: WorksitePlacementSlotId
  internalUnlockTier: number
  assetStatus: WorksiteAssetStatus
  /** Quand false, aucun rendu gameplay (MVP 14+). */
  available: boolean
  /** Spot gameplay actuel (`myrionWorksiteDefs`) si déjà branché. */
  legacyGameplaySpotId?: string
  assetGenerationNotes?: string
  progressionNotes?: string
}

export type WorksiteCatalogBiome = {
  id: WorksiteCatalogBiomeId
  displayName: string
  tier: number
  description: string
  visualMood: string
  primaryResource: WorksiteCatalogResourceId
  secondaryResources: readonly WorksiteCatalogResourceId[]
  components: readonly WorksiteCatalogComponent[]
  placementSlots: readonly WorksitePlacementSlot[]
  assetStatus: WorksiteAssetStatus
  gameplayStatus: WorksiteCatalogGameplayStatus
  backgroundAssetKey: string
  progressionNotes?: string
  assetGenerationNotes?: string
  /** Alias visuel documenté (ex. marais-doux dans visuals MVP 9). */
  legacyVisualAlias?: string
}

const DEFAULT_PLACEMENT_SLOTS: readonly WorksitePlacementSlot[] = [
  {
    id: 'topLeft',
    xPercent: 16,
    yPercent: 28,
    scale: 1,
    mobileXPercent: 14,
    mobileYPercent: 30,
    notes: 'Zone arrière-gauche — vérifier MVP 16 sur fond wide 2560×960.',
  },
  {
    id: 'topCenter',
    xPercent: 50,
    yPercent: 22,
    scale: 1,
    mobileXPercent: 50,
    mobileYPercent: 24,
  },
  {
    id: 'topRight',
    xPercent: 84,
    yPercent: 28,
    scale: 1,
    mobileXPercent: 86,
    mobileYPercent: 30,
  },
  {
    id: 'midLeft',
    xPercent: 22,
    yPercent: 52,
    scale: 1,
    mobileXPercent: 20,
    mobileYPercent: 54,
  },
  {
    id: 'midRight',
    xPercent: 78,
    yPercent: 52,
    scale: 1,
    mobileXPercent: 80,
    mobileYPercent: 54,
  },
  {
    id: 'bottomCenter',
    xPercent: 50,
    yPercent: 74,
    scale: 1.05,
    mobileXPercent: 50,
    mobileYPercent: 76,
    notes: 'Point focal bas — éviter chevauchement chibi MVP 16.',
  },
] as const

type ComponentInput = Omit<
  WorksiteCatalogComponent,
  'assetStatus' | 'available'
> & {
  assetStatus?: WorksiteAssetStatus
  available?: boolean
}

function catalogComponent(input: ComponentInput): WorksiteCatalogComponent {
  return {
    assetStatus: input.assetStatus ?? 'future',
    available: input.available ?? false,
    ...input,
  }
}

function catalogBiome(
  biome: Omit<WorksiteCatalogBiome, 'placementSlots'> & {
    placementSlots?: readonly WorksitePlacementSlot[]
  },
): WorksiteCatalogBiome {
  return {
    placementSlots: biome.placementSlots ?? DEFAULT_PLACEMENT_SLOTS,
    ...biome,
  }
}

export const WORKSITE_BIOME_CATALOG: Record<WorksiteCatalogBiomeId, WorksiteCatalogBiome> = {
  'prairie-chantier': catalogBiome({
    id: 'prairie-chantier',
    displayName: 'Prairie lunaire',
    tier: 1,
    description: 'Premier biome doux — vivres et matériaux de base sous la lune.',
    visualMood: 'Herbes hautes, lumière pâle, collines rondes et ciel étoilé.',
    primaryResource: 'food',
    secondaryResources: ['wood', 'stone', 'flower', 'herb', 'water'],
    assetStatus: 'active',
    gameplayStatus: 'active',
    backgroundAssetKey: 'backgrounds/prairie.png',
    progressionNotes: 'Biome de départ — 3 filons actifs en gameplay MVP 1–12.',
    assetGenerationNotes: 'Fond wide MVP 9 validé ; composants catalogue 4–6 en attente MVP 14.',
    components: [
      catalogComponent({
        id: 'champs-tendres',
        displayName: 'Champs tendres',
        type: 'food',
        producedResource: 'food',
        description: 'Petites parcelles de céréales lunaires.',
        visualIntent: 'Champs dorés, gerbes basses, clôture légère.',
        assetKey: 'spots/champs.png',
        recommendedPlacementSlot: 'bottomCenter',
        internalUnlockTier: 1,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'champs',
        progressionNotes: 'Spot actif — production food.',
      }),
      catalogComponent({
        id: 'bosquet-clair',
        displayName: 'Bosquet clair',
        type: 'wood',
        producedResource: 'wood',
        description: 'Arbustes clairs au bord de la prairie.',
        visualIntent: 'Petits arbres fruitiers, lumière filtrée.',
        assetKey: 'spots/bosquet.png',
        recommendedPlacementSlot: 'topLeft',
        internalUnlockTier: 1,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'bosquet',
        progressionNotes: 'Spot actif — label gameplay « Verger », food en MVP 10 (migration ressource MVP 14).',
      }),
      catalogComponent({
        id: 'pierrier-doux',
        displayName: 'Pierrier doux',
        type: 'stone',
        producedResource: 'stone',
        description: 'Rochers arrondis faciles à extraire.',
        visualIntent: 'Pierres moussues, taille modeste.',
        assetKey: 'spots/pierrier.png',
        recommendedPlacementSlot: 'midRight',
        internalUnlockTier: 1,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'pierrier',
        progressionNotes: 'Spot actif — label gameplay « Potager », food en MVP 10 (migration ressource MVP 14).',
      }),
      catalogComponent({
        id: 'fleurs-rosee',
        displayName: 'Fleurs de rosée',
        type: 'flower',
        producedResource: 'flower',
        description: 'Fleurs qui captent la rosée lunaire.',
        visualIntent: 'Massif floral bleuté, gouttes lumineuses.',
        assetKey: 'spots/prairie-fleurs-rosee.png',
        recommendedPlacementSlot: 'topCenter',
        internalUnlockTier: 3,
        assetGenerationNotes: 'PNG spot dédié — palette douce, lisible à petite échelle.',
      }),
      catalogComponent({
        id: 'herbes-lunaires',
        displayName: 'Herbes lunaires',
        type: 'herb',
        producedResource: 'herb',
        description: 'Herbes médicinales pâles.',
        visualIntent: 'Touffes d’herbes argentées, paniers optionnels.',
        assetKey: 'spots/prairie-herbes-lunaires.png',
        recommendedPlacementSlot: 'midLeft',
        internalUnlockTier: 4,
      }),
      catalogComponent({
        id: 'source-basse',
        displayName: 'Source basse',
        type: 'water',
        producedResource: 'water',
        description: 'Source calme en contrebas.',
        visualIntent: 'Petit bassin, pierres humides, reflets lunaires.',
        assetKey: 'spots/prairie-source-basse.png',
        recommendedPlacementSlot: 'topRight',
        internalUnlockTier: 5,
      }),
    ],
  }),

  'foret-douce': catalogBiome({
    id: 'foret-douce',
    displayName: 'Forêt mousseuse',
    tier: 2,
    description: 'Sous-bois humide et bois feuillu pour alimenter la ferme.',
    visualMood: 'Mousse verte, troncs arrondis, brume légère entre les arbres.',
    primaryResource: 'wood',
    secondaryResources: ['herb', 'water', 'food'],
    assetStatus: 'active',
    gameplayStatus: 'active',
    backgroundAssetKey: 'backgrounds/forest.png',
    progressionNotes: 'Déblocage ~28 total chantier (MVP 10).',
    components: [
      catalogComponent({
        id: 'sous-bois-dense',
        displayName: 'Sous-bois dense',
        type: 'wood',
        producedResource: 'wood',
        description: 'Bois feuillu ramassé sous la canopée.',
        visualIntent: 'Tas de branches, fougères, tronc couché.',
        assetKey: 'spots/sous-bois.png',
        recommendedPlacementSlot: 'midLeft',
        internalUnlockTier: 1,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'sous-bois',
      }),
      catalogComponent({
        id: 'clairiere-herbes',
        displayName: 'Clairière d’herbes',
        type: 'herb',
        producedResource: 'herb',
        description: 'Clairière ensoleillée d’herbes sauvages.',
        visualIntent: 'Clairière circulaire, herbes hautes.',
        assetKey: 'spots/clairiere-herbes.png',
        recommendedPlacementSlot: 'topCenter',
        internalUnlockTier: 2,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'clairiere-herbes',
        progressionNotes: 'Gameplay wood — migration herb MVP 14.',
      }),
      catalogComponent({
        id: 'source-claire',
        displayName: 'Source claire',
        type: 'water',
        producedResource: 'water',
        description: 'Eau cristalline entre les racines.',
        visualIntent: 'Ruisselet, pierres mouillées, reflets verts.',
        assetKey: 'spots/source-claire.png',
        recommendedPlacementSlot: 'bottomCenter',
        internalUnlockTier: 3,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'source-claire',
        progressionNotes: 'Gameplay wood — migration water MVP 14.',
      }),
      catalogComponent({
        id: 'tronc-ancien',
        displayName: 'Tronc ancien',
        type: 'wood',
        producedResource: 'wood',
        description: 'Vieux tronc résineux encore exploitable.',
        visualIntent: 'Souche massive, bûches empilées.',
        assetKey: 'spots/foret-tronc-ancien.png',
        recommendedPlacementSlot: 'topRight',
        internalUnlockTier: 4,
      }),
      catalogComponent({
        id: 'baies-sauvages',
        displayName: 'Baies sauvages',
        type: 'food',
        producedResource: 'food',
        description: 'Buissons de baies en lisière.',
        visualIntent: 'Buissons rouges, paniers en bois.',
        assetKey: 'spots/foret-baies-sauvages.png',
        recommendedPlacementSlot: 'topLeft',
        internalUnlockTier: 5,
      }),
      catalogComponent({
        id: 'mousse-medicinale',
        displayName: 'Mousse médicinale',
        type: 'herb',
        producedResource: 'herb',
        description: 'Mousse récoltée sur les troncs humides.',
        visualIntent: 'Tronc couvert de mousse bleutée.',
        assetKey: 'spots/foret-mousse-medicinale.png',
        recommendedPlacementSlot: 'midRight',
        internalUnlockTier: 6,
      }),
    ],
  }),

  'mine-tranquille': catalogBiome({
    id: 'mine-tranquille',
    displayName: 'Mine douce',
    tier: 3,
    description: 'Galerie calme pour pierre et futurs minerais spécialisés.',
    visualMood: 'Roches arrondies, lanternes douces, pas de danger.',
    primaryResource: 'stone',
    secondaryResources: ['ore', 'coal', 'crystal', 'mushroom', 'water'],
    assetStatus: 'active',
    gameplayStatus: 'active',
    backgroundAssetKey: 'backgrounds/mine.png',
    progressionNotes: 'Déblocage ~52 total + 18 bois (MVP 10).',
    components: [
      catalogComponent({
        id: 'pierrier-profond',
        displayName: 'Pierrier profond',
        type: 'stone',
        producedResource: 'stone',
        description: 'Pierre brute en galerie large.',
        visualIntent: 'Paroi rocheuse, pioches posées.',
        assetKey: 'spots/pierrier-profond.png',
        recommendedPlacementSlot: 'midLeft',
        internalUnlockTier: 1,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'pierrier-profond',
      }),
      catalogComponent({
        id: 'veine-brute',
        displayName: 'Veine brute',
        type: 'ore',
        producedResource: 'ore',
        description: 'Fil de minerai encore brut.',
        visualIntent: 'Veine métallique dans la roche.',
        assetKey: 'spots/veine-brute.png',
        recommendedPlacementSlot: 'topCenter',
        internalUnlockTier: 2,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'veine-brute',
        progressionNotes: 'Gameplay stone — migration ore MVP 14.',
      }),
      catalogComponent({
        id: 'charbonniere-calme',
        displayName: 'Charbonnière calme',
        type: 'coal',
        producedResource: 'coal',
        description: 'Dépôt de charbon compact.',
        visualIntent: 'Tas sombre, lueur ambre discrète.',
        assetKey: 'spots/charbonniere.png',
        recommendedPlacementSlot: 'topRight',
        internalUnlockTier: 3,
        assetStatus: 'active',
        available: true,
        legacyGameplaySpotId: 'charbonniere',
        progressionNotes: 'Gameplay stone — migration coal MVP 14.',
      }),
      catalogComponent({
        id: 'cristaux-pales',
        displayName: 'Cristaux pâles',
        type: 'crystal',
        producedResource: 'crystal',
        description: 'Cristaux faiblement lumineux.',
        visualIntent: 'Amas cristallin blanc-rosé.',
        assetKey: 'spots/mine-cristaux-pales.png',
        recommendedPlacementSlot: 'bottomCenter',
        internalUnlockTier: 4,
      }),
      catalogComponent({
        id: 'champignons-cave',
        displayName: 'Champignons de cave',
        type: 'mushroom',
        producedResource: 'mushroom',
        description: 'Champignons comestibles en alcôve.',
        visualIntent: 'Champignons violets, humidité visible.',
        assetKey: 'spots/mine-champignons-cave.png',
        recommendedPlacementSlot: 'midRight',
        internalUnlockTier: 5,
      }),
      catalogComponent({
        id: 'ruissellement-mineral',
        displayName: 'Ruissellement minéral',
        type: 'water',
        producedResource: 'water',
        description: 'Eau filtrée le long des parois.',
        visualIntent: 'Filet d’eau, bassin rocheux.',
        assetKey: 'spots/mine-ruissellement-mineral.png',
        recommendedPlacementSlot: 'topLeft',
        internalUnlockTier: 6,
      }),
    ],
  }),

  'marais-lucioles': catalogBiome({
    id: 'marais-lucioles',
    displayName: 'Marais des lucioles',
    tier: 4,
    description: 'Marais lumineux entre eau stagnante et végétation mouillée.',
    visualMood: 'Lucioles, brume basse, roseaux et reflets verts.',
    primaryResource: 'herb',
    secondaryResources: ['water', 'mushroom', 'wood', 'stone', 'flower'],
    assetStatus: 'placeholder',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/swamp.png',
    legacyVisualAlias: 'marais-doux',
    assetGenerationNotes: 'Réutiliser pipeline swamp MVP 9 ; harmoniser nom marais-doux → marais-lucioles MVP 14.',
    progressionNotes: 'Déblocage à définir MVP 14 — après Mine douce stabilisée.',
    components: [
      catalogComponent({ id: 'roseaux-lumineux', displayName: 'Roseaux lumineux', type: 'herb', producedResource: 'herb', description: 'Roseaux légèrement phosphorescents.', visualIntent: 'Roseaux hauts, lucioles.', assetKey: 'spots/marais-roseaux-lumineux.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 1 }),
      catalogComponent({ id: 'flaque-fertile', displayName: 'Flaque fertile', type: 'water', producedResource: 'water', description: 'Flaque riche en nutriments.', visualIntent: 'Eau stagnante, nénuphars.', assetKey: 'spots/marais-flaque-fertile.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 2 }),
      catalogComponent({ id: 'champignons-luisants', displayName: 'Champignons luisants', type: 'mushroom', producedResource: 'mushroom', description: 'Champignons bioluminescents.', visualIntent: 'Chapeaux bleutés.', assetKey: 'spots/marais-champignons-luisants.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'racines-noyees', displayName: 'Racines noyées', type: 'wood', producedResource: 'wood', description: 'Racines et bois flottant local.', visualIntent: 'Racines entrelacées dans l’eau.', assetKey: 'spots/marais-racines-noyees.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 4 }),
      catalogComponent({ id: 'vase-minerale', displayName: 'Vase minérale', type: 'stone', producedResource: 'stone', description: 'Vase durcie riche en minéraux.', visualIntent: 'Banc de boue grise, cristaux.', assetKey: 'spots/marais-vase-minerale.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'fleurs-brume', displayName: 'Fleurs de brume', type: 'flower', producedResource: 'flower', description: 'Fleurs qui s’ouvrent à la brume.', visualIntent: 'Corolles pâles, vapeur légère.', assetKey: 'spots/marais-fleurs-brume.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 6 }),
    ],
  }),

  'rivage-brumeux': catalogBiome({
    id: 'rivage-brumeux',
    displayName: 'Rivage brumeux',
    tier: 5,
    description: 'Littoral calme bordé de brume et de coquillages.',
    visualMood: 'Sable humide, brume marine, bois flotté.',
    primaryResource: 'shell',
    secondaryResources: ['herb', 'wood', 'sand', 'water', 'stone'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/rivage-brumeux.png',
    assetGenerationNotes: 'Nouveau fond wide — horizon bas, brume 30 % opacité.',
    components: [
      catalogComponent({ id: 'coquillages-nacres', displayName: 'Coquillages nacrés', type: 'shell', producedResource: 'shell', description: 'Coquillages à reflets nacrés.', visualIntent: 'Tas de coquillages, reflets.', assetKey: 'spots/rivage-coquillages-nacres.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'algues-douces', displayName: 'Algues douces', type: 'herb', producedResource: 'herb', description: 'Algues comestibles de rive.', visualIntent: 'Algues vertes sur rochers.', assetKey: 'spots/rivage-algues-douces.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'bois-flotte', displayName: 'Bois flotté', type: 'wood', producedResource: 'wood', description: 'Bois poli par les vagues.', visualIntent: 'Troncs lissés, cordages.', assetKey: 'spots/rivage-bois-flotte.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 3 }),
      catalogComponent({ id: 'sable-humide', displayName: 'Sable humide', type: 'sand', producedResource: 'sand', description: 'Sable riche en minéraux marins.', visualIntent: 'Dune basse, empreintes.', assetKey: 'spots/rivage-sable-humide.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 4 }),
      catalogComponent({ id: 'bassin-maree', displayName: 'Bassin de marée', type: 'water', producedResource: 'water', description: 'Bassin laissé par la marée.', visualIntent: 'Flaque d’eau salée calme.', assetKey: 'spots/rivage-bassin-maree.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 5 }),
      catalogComponent({ id: 'galets-polis', displayName: 'Galets polis', type: 'stone', producedResource: 'stone', description: 'Galets lissés par l’eau.', visualIntent: 'Cercle de galets ronds.', assetKey: 'spots/rivage-galets-polis.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 6 }),
    ],
  }),

  'vergers-suspendus': catalogBiome({
    id: 'vergers-suspendus',
    displayName: 'Vergers suspendus',
    tier: 6,
    description: 'Arbres fruitiers flottant dans une brise légère.',
    visualMood: 'Plateformes végétales, ciel ouvert, lianes dorées.',
    primaryResource: 'food',
    secondaryResources: ['wood', 'seed', 'flower', 'herb'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/vergers-suspendus.png',
    components: [
      catalogComponent({ id: 'pommiers-flottants', displayName: 'Pommiers flottants', type: 'food', producedResource: 'food', description: 'Pommiers sur îlots suspendus.', visualIntent: 'Couronnes d’arbres dans le vide.', assetKey: 'spots/vergers-pommiers-flottants.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'branches-legeres', displayName: 'Branches légères', type: 'wood', producedResource: 'wood', description: 'Branches récoltées en hauteur.', visualIntent: 'Bûches légères, cordes.', assetKey: 'spots/vergers-branches-legeres.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'graines-dorees', displayName: 'Graines dorées', type: 'seed', producedResource: 'seed', description: 'Graines stellaires des vergers.', visualIntent: 'Sacs de graines lumineuses.', assetKey: 'spots/vergers-graines-dorees.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'fleurs-fruitieres', displayName: 'Fleurs fruitières', type: 'flower', producedResource: 'flower', description: 'Fleurs avant fructification.', visualIntent: 'Blossom blanc-rosé.', assetKey: 'spots/vergers-fleurs-fruitieres.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 4 }),
      catalogComponent({ id: 'ruches-calmes', displayName: 'Ruches calmes', type: 'food', producedResource: 'food', description: 'Miel doux des vergers aériens.', visualIntent: 'Ruches suspendues, abeilles paisibles.', assetKey: 'spots/vergers-ruches-calmes.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'lianes-porteuses', displayName: 'Lianes porteuses', type: 'herb', producedResource: 'herb', description: 'Lianes tressées pour liens et herbes.', visualIntent: 'Lianes épaisses, nœuds verts.', assetKey: 'spots/vergers-lianes-porteuses.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 6 }),
    ],
  }),

  'ruines-florales': catalogBiome({
    id: 'ruines-florales',
    displayName: 'Ruines florales',
    tier: 7,
    description: 'Vestiges de pierre envahis par la végétation fleurie.',
    visualMood: 'Pierres gravées, lierre, fleurs de mémoire.',
    primaryResource: 'relic',
    secondaryResources: ['stone', 'herb', 'water', 'flower', 'wood'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/ruines-florales.png',
    components: [
      catalogComponent({ id: 'pierres-gravees', displayName: 'Pierres gravées', type: 'stone', producedResource: 'stone', description: 'Blocs gravés encore extractibles.', visualIntent: 'Dalles runiques, mousse.', assetKey: 'spots/ruines-pierres-gravees.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 1 }),
      catalogComponent({ id: 'reliques-fleuries', displayName: 'Reliques fleuries', type: 'relic', producedResource: 'relic', description: 'Fragments d’anciens sanctuaires.', visualIntent: 'Autel fleuri, relique dorée.', assetKey: 'spots/ruines-reliques-fleuries.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 2 }),
      catalogComponent({ id: 'lierre-ancien', displayName: 'Lierre ancien', type: 'herb', producedResource: 'herb', description: 'Lierre aux propriétés calmantes.', visualIntent: 'Mur couvert de lierre épais.', assetKey: 'spots/ruines-lierre-ancien.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 3 }),
      catalogComponent({ id: 'bassin-fissure', displayName: 'Bassin fissuré', type: 'water', producedResource: 'water', description: 'Bassin de ruine encore alimenté.', visualIntent: 'Fontaine cassée, eau claire.', assetKey: 'spots/ruines-bassin-fissure.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 4 }),
      catalogComponent({ id: 'fleurs-memoire', displayName: 'Fleurs de mémoire', type: 'flower', producedResource: 'flower', description: 'Fleurs liées aux souvenirs du havre.', visualIntent: 'Corolles violettes, lueur douce.', assetKey: 'spots/ruines-fleurs-memoire.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'racines-pierre', displayName: 'Racines dans la pierre', type: 'wood', producedResource: 'wood', description: 'Racines boisées dans les fissures.', visualIntent: 'Racines épaisses, pierre fendue.', assetKey: 'spots/ruines-racines-pierre.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 6 }),
    ],
  }),

  'grotte-cristalline': catalogBiome({
    id: 'grotte-cristalline',
    displayName: 'Grotte cristalline',
    tier: 8,
    description: 'Caverne de cristaux et reflets froids.',
    visualMood: 'Parois bleutées, prismes, silence minéral.',
    primaryResource: 'crystal',
    secondaryResources: ['ore', 'stone', 'water', 'mushroom'],
    assetStatus: 'placeholder',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/crystal.png',
    legacyVisualAlias: 'cristal-lumineux',
    assetGenerationNotes: 'crystal.png existe MVP 9 mais available:false — activer MVP 14+.',
    components: [
      catalogComponent({ id: 'cristaux-bleutes', displayName: 'Cristaux bleutés', type: 'crystal', producedResource: 'crystal', description: 'Cristaux bleus en colonnes.', visualIntent: 'Stalactites cristallines.', assetKey: 'spots/grotte-cristaux-bleutes.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'veine-argentee', displayName: 'Veine argentée', type: 'ore', producedResource: 'ore', description: 'Minerai argenté fragile.', visualIntent: 'Veine brillante dans paroi.', assetKey: 'spots/grotte-veine-argentee.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'pierre-translucide', displayName: 'Pierre translucide', type: 'stone', producedResource: 'stone', description: 'Pierre semi-transparente.', visualIntent: 'Rochers de verre doux.', assetKey: 'spots/grotte-pierre-translucide.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'flaque-souterraine', displayName: 'Flaque souterraine', type: 'water', producedResource: 'water', description: 'Miroir d’eau souterrain.', visualIntent: 'Bassin noir réfléchissant.', assetKey: 'spots/grotte-flaque-souterraine.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 4 }),
      catalogComponent({ id: 'champignons-prismatiques', displayName: 'Champignons prismatiques', type: 'mushroom', producedResource: 'mushroom', description: 'Champignons réfractant la lumière.', visualIntent: 'Chapeaux irisés.', assetKey: 'spots/grotte-champignons-prismatiques.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 5 }),
      catalogComponent({ id: 'eclats-lumineux', displayName: 'Éclats lumineux', type: 'crystal', producedResource: 'crystal', description: 'Éclats à haute pureté.', visualIntent: 'Tas d’éclats au sol.', assetKey: 'spots/grotte-eclats-lumineux.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 6 }),
    ],
  }),

  'desert-cendres-roses': catalogBiome({
    id: 'desert-cendres-roses',
    displayName: 'Désert de cendres roses',
    tier: 9,
    description: 'Dunes roses et chaleur douce sans aridité punitive.',
    visualMood: 'Sable rose, cactus ronds, oasis pâle.',
    primaryResource: 'sand',
    secondaryResources: ['herb', 'stone', 'crystal', 'wood', 'water'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/desert-cendres-roses.png',
    components: [
      catalogComponent({ id: 'dunes-roses', displayName: 'Dunes roses', type: 'sand', producedResource: 'sand', description: 'Sable fin aux reflets rosés.', visualIntent: 'Dunes ondulées, ciel pâle.', assetKey: 'spots/desert-dunes-roses.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'cactus-doux', displayName: 'Cactus doux', type: 'herb', producedResource: 'herb', description: 'Cactus sans épines agressives.', visualIntent: 'Cactus ronds, fleurs jaunes.', assetKey: 'spots/desert-cactus-doux.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'pierres-chauffees', displayName: 'Pierres chauffées', type: 'stone', producedResource: 'stone', description: 'Pierre tiède des dunes.', visualIntent: 'Rochers fissurés, chaleur visible.', assetKey: 'spots/desert-pierres-chauffees.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'verre-cendre', displayName: 'Verre de cendre', type: 'crystal', producedResource: 'crystal', description: 'Verre volcanique rose translucide.', visualIntent: 'Éclats vitreux au sol.', assetKey: 'spots/desert-verre-cendre.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 4 }),
      catalogComponent({ id: 'racines-seches', displayName: 'Racines sèches', type: 'wood', producedResource: 'wood', description: 'Racines fossilisées légères.', visualIntent: 'Racines blanchies, courbes.', assetKey: 'spots/desert-racines-seches.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'oasis-pale', displayName: 'Oasis pâle', type: 'water', producedResource: 'water', description: 'Oasis discrète entre les dunes.', visualIntent: 'Petit palmier, bassin clair.', assetKey: 'spots/desert-oasis-pale.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 6 }),
    ],
  }),

  'montagne-vents': catalogBiome({
    id: 'montagne-vents',
    displayName: 'Montagne des vents',
    tier: 10,
    description: 'Pics exposés où l’on capte la brise stellaire.',
    visualMood: 'Falaises, pins tordus, bannières au vent.',
    primaryResource: 'wind',
    secondaryResources: ['stone', 'wood', 'herb', 'food', 'crystal'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/montagne-vents.png',
    components: [
      catalogComponent({ id: 'courants-captifs', displayName: 'Courants captifs', type: 'wind', producedResource: 'wind', description: 'Courants d’air emmagasinés calmement.', visualIntent: 'Filets de vent, rubans flottants.', assetKey: 'spots/montagne-courants-captifs.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'pierres-hautes', displayName: 'Pierres hautes', type: 'stone', producedResource: 'stone', description: 'Pierre d’altitude compacte.', visualIntent: 'Menhirs, éboulis.', assetKey: 'spots/montagne-pierres-hautes.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'pins-tordus', displayName: 'Pins tordus', type: 'wood', producedResource: 'wood', description: 'Bois de pin résistant au vent.', visualIntent: 'Arbres inclinés, branches courbes.', assetKey: 'spots/montagne-pins-tordus.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 3 }),
      catalogComponent({ id: 'herbes-alpines', displayName: 'Herbes alpines', type: 'herb', producedResource: 'herb', description: 'Herbes de crête parfumées.', visualIntent: 'Touffes basses, fleurs bleues.', assetKey: 'spots/montagne-herbes-alpines.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 4 }),
      catalogComponent({ id: 'nid-abandonne', displayName: 'Nid abandonné', type: 'food', producedResource: 'food', description: 'Œufs et réserves laissés au havre.', visualIntent: 'Nid douillet, plumes.', assetKey: 'spots/montagne-nid-abandonne.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'cristaux-altitude', displayName: 'Cristaux d’altitude', type: 'crystal', producedResource: 'crystal', description: 'Cristaux formés par le froid venté.', visualIntent: 'Cristaux sur roche nue.', assetKey: 'spots/montagne-cristaux-altitude.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 6 }),
    ],
  }),

  'lac-etoile': catalogBiome({
    id: 'lac-etoile',
    displayName: 'Lac étoilé',
    tier: 11,
    description: 'Plan d’eau qui reflète la carte du ciel.',
    visualMood: 'Surface miroir, nénuphars, lumière astrale.',
    primaryResource: 'water',
    secondaryResources: ['herb', 'stone', 'food', 'astral'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/lac-etoile.png',
    components: [
      catalogComponent({ id: 'eau-etoilee', displayName: 'Eau étoilée', type: 'water', producedResource: 'water', description: 'Eau imprégnée de lumière stellaire.', visualIntent: 'Surface constellée, reflets.', assetKey: 'spots/lac-eau-etoilee.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'nenuphars-doux', displayName: 'Nénuphars doux', type: 'herb', producedResource: 'herb', description: 'Feuilles et tiges de nénuphar.', visualIntent: 'Nénuphars roses, eau calme.', assetKey: 'spots/lac-nenuphars-doux.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'galets-lunaires', displayName: 'Galets lunaires', type: 'stone', producedResource: 'stone', description: 'Galets lisses aux reflets lunaires.', visualIntent: 'Rive de galets blancs.', assetKey: 'spots/lac-galets-lunaires.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'poissons-calmes', displayName: 'Poissons calmes', type: 'food', producedResource: 'food', description: 'Pêche douce du lac étoilé.', visualIntent: 'Filet posé, poissons argentés.', assetKey: 'spots/lac-poissons-calmes.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 4 }),
      catalogComponent({ id: 'roseaux-argentes', displayName: 'Roseaux argentés', type: 'herb', producedResource: 'herb', description: 'Roseaux métalliques légers.', visualIntent: 'Roseaux hauts, reflets argent.', assetKey: 'spots/lac-roseaux-argentes.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'reflets-astraux', displayName: 'Reflets astraux', type: 'astral', producedResource: 'astral', description: 'Essence captée sur l’eau.', visualIntent: 'Motif constellation à la surface.', assetKey: 'spots/lac-reflets-astraux.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 6 }),
    ],
  }),

  'bois-automne-eternel': catalogBiome({
    id: 'bois-automne-eternel',
    displayName: 'Bois d’automne éternel',
    tier: 12,
    description: 'Forêt figée en automne doré, sans déclin triste.',
    visualMood: 'Feuilles orangées, brume dorée, sol feuillu.',
    primaryResource: 'herb',
    secondaryResources: ['wood', 'mushroom', 'food', 'stone', 'flower'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/bois-automne-eternel.png',
    components: [
      catalogComponent({ id: 'feuilles-dorees', displayName: 'Feuilles dorées', type: 'herb', producedResource: 'herb', description: 'Feuilles d’automne aux vertus calmantes.', visualIntent: 'Tapis de feuilles, paniers.', assetKey: 'spots/automne-feuilles-dorees.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'bois-roux', displayName: 'Bois roux', type: 'wood', producedResource: 'wood', description: 'Bois teinté par la sève d’automne.', visualIntent: 'Bûches roux-orangé.', assetKey: 'spots/automne-bois-roux.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'champignons-ambres', displayName: 'Champignons ambrés', type: 'mushroom', producedResource: 'mushroom', description: 'Champignons couleur miel.', visualIntent: 'Chapeaux ambrés, souche.', assetKey: 'spots/automne-champignons-ambres.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'baies-tardives', displayName: 'Baies tardives', type: 'food', producedResource: 'food', description: 'Dernières baies de la saison.', visualIntent: 'Buissons pourpres.', assetKey: 'spots/automne-baies-tardives.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 4 }),
      catalogComponent({ id: 'pierre-moussue', displayName: 'Pierre moussue', type: 'stone', producedResource: 'stone', description: 'Pierre couverte de mousse dorée.', visualIntent: 'Rochers bas, mousse jaune.', assetKey: 'spots/automne-pierre-moussue.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'fleurs-fanees', displayName: 'Fleurs fanées', type: 'flower', producedResource: 'flower', description: 'Fleurs d’automne encore utiles.', visualIntent: 'Fleurs séchées élégantes.', assetKey: 'spots/automne-fleurs-fanees.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 6 }),
    ],
  }),

  'jardin-fongique': catalogBiome({
    id: 'jardin-fongique',
    displayName: 'Jardin fongique',
    tier: 13,
    description: 'Écosystème de champignons géants et spores douces.',
    visualMood: 'Chapeaux immenses, sol spongieux, lueur violette.',
    primaryResource: 'mushroom',
    secondaryResources: ['herb', 'wood', 'water', 'crystal', 'food'],
    assetStatus: 'missing',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/jardin-fongique.png',
    components: [
      catalogComponent({ id: 'gros-champignons', displayName: 'Gros champignons', type: 'mushroom', producedResource: 'mushroom', description: 'Champignons géants comestibles.', visualIntent: 'Champignons taille humaine.', assetKey: 'spots/fongique-gros-champignons.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'spores-douces', displayName: 'Spores douces', type: 'herb', producedResource: 'herb', description: 'Spores récoltées sans nuage irritant.', visualIntent: 'Nuage léger rose, fioles.', assetKey: 'spots/fongique-spores-douces.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'racines-blanches', displayName: 'Racines blanches', type: 'wood', producedResource: 'wood', description: 'Mycélium boisé structurant.', visualIntent: 'Racines blanches entrelacées.', assetKey: 'spots/fongique-racines-blanches.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 3 }),
      catalogComponent({ id: 'flaques-tiedes', displayName: 'Flaques tièdes', type: 'water', producedResource: 'water', description: 'Eau tiède entre les spores.', visualIntent: 'Flaques fumantes douces.', assetKey: 'spots/fongique-flaques-tiedes.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 4 }),
      catalogComponent({ id: 'cristaux-myceliens', displayName: 'Cristaux mycéliens', type: 'crystal', producedResource: 'crystal', description: 'Cristaux poussant sur le mycélium.', visualIntent: 'Cristaux violets organiques.', assetKey: 'spots/fongique-cristaux-myceliens.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 5 }),
      catalogComponent({ id: 'terre-fertile', displayName: 'Terre fertile', type: 'food', producedResource: 'food', description: 'Humus riche pour vivres du havre.', visualIntent: 'Tas de terre sombre, graines.', assetKey: 'spots/fongique-terre-fertile.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 6 }),
    ],
  }),

  'sanctuaire-astral': catalogBiome({
    id: 'sanctuaire-astral',
    displayName: 'Sanctuaire astral',
    tier: 14,
    description: 'Lieu sacré d’énergie stellaire — distinct de la Faille prestige LR.',
    visualMood: 'Autel lunaire, cristaux stellaires, silence recueilli.',
    primaryResource: 'astral',
    secondaryResources: ['stone', 'crystal', 'flower', 'water', 'relic'],
    assetStatus: 'placeholder',
    gameplayStatus: 'catalog-only',
    backgroundAssetKey: 'backgrounds/astral.png',
    legacyVisualAlias: 'faille-astrale',
    progressionNotes: 'Ne pas confondre avec prestige LR (faille-astrale spot) — migration MVP 14.',
    assetGenerationNotes: 'astral.png actif MVP 9 pour prestige ; fond sanctuaire peut diverger MVP 15 assets.',
    components: [
      catalogComponent({ id: 'fragment-astral', displayName: 'Fragment astral', type: 'astral', producedResource: 'astral', description: 'Fragments d’énergie stellaire stable.', visualIntent: 'Éclats flottants, halo doux.', assetKey: 'spots/sanctuaire-fragment-astral.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'pierre-sacree', displayName: 'Pierre sacrée', type: 'stone', producedResource: 'stone', description: 'Pierre consacrée du sanctuaire.', visualIntent: 'Dalle gravée de constellations.', assetKey: 'spots/sanctuaire-pierre-sacree.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'cristaux-stellaires', displayName: 'Cristaux stellaires', type: 'crystal', producedResource: 'crystal', description: 'Cristaux alignés sur les étoiles.', visualIntent: 'Colonnes fines lumineuses.', assetKey: 'spots/sanctuaire-cristaux-stellaires.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'fleurs-celestes', displayName: 'Fleurs célestes', type: 'flower', producedResource: 'flower', description: 'Fleurs qui ne se fanent pas.', visualIntent: 'Pétales blancs, centre doré.', assetKey: 'spots/sanctuaire-fleurs-celestes.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 4 }),
      catalogComponent({ id: 'source-lunaire', displayName: 'Source lunaire', type: 'water', producedResource: 'water', description: 'Eau bénie du sanctuaire.', visualIntent: 'Fontaine circulaire, lueur.', assetKey: 'spots/sanctuaire-source-lunaire.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 5 }),
      catalogComponent({ id: 'reliques-anciennes', displayName: 'Reliques anciennes', type: 'relic', producedResource: 'relic', description: 'Reliques des premiers gardiens.', visualIntent: 'Reliquaire ouvert, rubans.', assetKey: 'spots/sanctuaire-reliques-anciennes.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 6 }),
    ],
  }),

  'ile-celeste': catalogBiome({
    id: 'ile-celeste',
    displayName: 'Île céleste',
    tier: 15,
    description: 'Îlot flottant au-dessus des nuages — sommet de progression.',
    visualMood: 'Rochers flottants, herbes aériennes, ciel infini.',
    primaryResource: 'seed',
    secondaryResources: ['water', 'herb', 'stone', 'wind', 'crystal'],
    assetStatus: 'missing',
    gameplayStatus: 'future',
    backgroundAssetKey: 'backgrounds/ile-celeste.png',
    progressionNotes: 'Biome cible fin de progression — activation tardive MVP 14+.',
    components: [
      catalogComponent({ id: 'nuages-condenses', displayName: 'Nuages condensés', type: 'water', producedResource: 'water', description: 'Eau extraite des nuages proches.', visualIntent: 'Cuve à nuage, vapeur douce.', assetKey: 'spots/ile-nuages-condenses.png', recommendedPlacementSlot: 'bottomCenter', internalUnlockTier: 1 }),
      catalogComponent({ id: 'herbes-aeriennes', displayName: 'Herbes aériennes', type: 'herb', producedResource: 'herb', description: 'Herbes poussant sans sol dense.', visualIntent: 'Herbes flottantes, racines aériennes.', assetKey: 'spots/ile-herbes-aeriennes.png', recommendedPlacementSlot: 'midLeft', internalUnlockTier: 2 }),
      catalogComponent({ id: 'pierres-flottantes', displayName: 'Pierres flottantes', type: 'stone', producedResource: 'stone', description: 'Pierre légère des îlots.', visualIntent: 'Rochers suspendus, chaînes.', assetKey: 'spots/ile-pierres-flottantes.png', recommendedPlacementSlot: 'topRight', internalUnlockTier: 3 }),
      catalogComponent({ id: 'courants-doux', displayName: 'Courants doux', type: 'wind', producedResource: 'wind', description: 'Brise constante et exploitable.', visualIntent: 'Rubans au vent, voiles.', assetKey: 'spots/ile-courants-doux.png', recommendedPlacementSlot: 'topCenter', internalUnlockTier: 4 }),
      catalogComponent({ id: 'graines-celestes', displayName: 'Graines célestes', type: 'seed', producedResource: 'seed', description: 'Graines pour les biomes du havre.', visualIntent: 'Gousses lumineuses, sacs.', assetKey: 'spots/ile-graines-celestes.png', recommendedPlacementSlot: 'topLeft', internalUnlockTier: 5 }),
      catalogComponent({ id: 'cristaux-ciel', displayName: 'Cristaux de ciel', type: 'crystal', producedResource: 'crystal', description: 'Cristaux formés en altitude extrême.', visualIntent: 'Cristaux translucides, arc-en-ciel pâle.', assetKey: 'spots/ile-cristaux-ciel.png', recommendedPlacementSlot: 'midRight', internalUnlockTier: 6 }),
    ],
  }),
}

export const WORKSITE_CATALOG_COMPONENT_COUNT = WORKSITE_CATALOG_BIOME_IDS.reduce(
  (sum, id) => sum + WORKSITE_BIOME_CATALOG[id].components.length,
  0,
)

export function getCatalogBiome(id: WorksiteCatalogBiomeId): WorksiteCatalogBiome {
  return WORKSITE_BIOME_CATALOG[id]
}

export function listCatalogBiomes(): WorksiteCatalogBiome[] {
  return WORKSITE_CATALOG_BIOME_IDS.map((id) => WORKSITE_BIOME_CATALOG[id])
}

export function isLegacyPlayableBiome(id: string): id is LegacyPlayableBiomeId {
  return (LEGACY_PLAYABLE_BIOME_IDS as readonly string[]).includes(id)
}

export function getCatalogComponent(
  biomeId: WorksiteCatalogBiomeId,
  componentId: string,
): WorksiteCatalogComponent | null {
  return WORKSITE_BIOME_CATALOG[biomeId].components.find((c) => c.id === componentId) ?? null
}

export function listActiveGameplayComponents(biomeId: LegacyPlayableBiomeId): WorksiteCatalogComponent[] {
  return WORKSITE_BIOME_CATALOG[biomeId].components.filter((c) => c.available && c.legacyGameplaySpotId)
}

export function getPlacementSlot(
  biomeId: WorksiteCatalogBiomeId,
  slotId: WorksitePlacementSlotId,
): WorksitePlacementSlot | null {
  return WORKSITE_BIOME_CATALOG[biomeId].placementSlots.find((s) => s.id === slotId) ?? null
}
