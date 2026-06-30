/**
 * Soutien compagnon léger — MVP 11.
 * Hints et associations système uniquement (pas de bonus économique).
 */

export type CompanionSupportSystemId =
  | 'moon-farm'
  | 'refuge'
  | 'hunt'
  | 'village'
  | 'gacha'
  | 'inventory'
  | 'prestige'

export const COMPANION_SUPPORT_SYSTEM_LABELS: Record<CompanionSupportSystemId, string> = {
  'moon-farm': 'Ferme lunaire',
  refuge: 'Refuge',
  hunt: 'Chasse',
  village: 'Village',
  gacha: 'Gacha',
  inventory: 'Inventaire',
  prestige: 'Prestige astral',
}

export type CompanionSupportProfile = {
  companionId: string
  displayName: string
  systems: CompanionSupportSystemId[]
  /** Phrase courte affichée en jeu. */
  supportLine: string
  /** Rôle / conseil (qualité de vie). */
  roleLine: string
}

export const COMPANION_SUPPORT_PROFILES: Record<string, CompanionSupportProfile> = {
  lyra: {
    companionId: 'lyra',
    displayName: 'Lyra',
    systems: ['gacha', 'inventory', 'village'],
    supportLine: 'Relie mana et curiosités du havre.',
    roleLine: 'Suggère où chercher des ressources rares.',
  },
  maeve: {
    companionId: 'maeve',
    displayName: 'Maeve',
    systems: ['village', 'inventory', 'gacha'],
    supportLine: 'Connaît les routes du marché.',
    roleLine: 'Indique les échanges utiles sans presser.',
  },
  seren: {
    companionId: 'seren',
    displayName: 'Seren',
    systems: ['hunt', 'village'],
    supportLine: 'Veille sur les expéditions.',
    roleLine: 'Encourage une chasse mesurée.',
  },
  nami: {
    companionId: 'nami',
    displayName: 'Nami',
    systems: ['moon-farm', 'village'],
    supportLine: 'Pense aux vivres et au moral.',
    roleLine: 'Aide à organiser les récoltes.',
  },
  iris: {
    companionId: 'iris',
    displayName: 'Iris',
    systems: ['moon-farm', 'inventory'],
    supportLine: 'Sent les herbes et les coins calmes.',
    roleLine: 'Repère les zones fertiles de la Ferme lunaire.',
  },
  kael: {
    companionId: 'kael',
    displayName: 'Kael',
    systems: ['gacha', 'village'],
    supportLine: 'Anime le village sans bruit.',
    roleLine: 'Rappelle les festivals à venir.',
  },
  runa: {
    companionId: 'runa',
    displayName: 'Runa',
    systems: ['moon-farm', 'village'],
    supportLine: 'Conseille pierre et outillage.',
    roleLine: 'Prépare doucement la mine tranquille.',
  },
  solene: {
    companionId: 'solene',
    displayName: 'Solene',
    systems: ['moon-farm', 'prestige'],
    supportLine: 'Écoute le clair de lune sur les filons.',
    roleLine: 'Évoque la faille lointaine, sans urgence.',
  },
  talia: {
    companionId: 'talia',
    displayName: 'Talia',
    systems: ['moon-farm', 'hunt'],
    supportLine: 'Lit les pistes aux lisières.',
    roleLine: 'Repère les filons voisins sur la Ferme lunaire.',
  },
  mira: {
    companionId: 'mira',
    displayName: 'Mira',
    systems: ['refuge', 'inventory'],
    supportLine: 'Pense au confort après le travail.',
    roleLine: 'Rappelle de laisser les Myrions souffler.',
  },
  asha: {
    companionId: 'asha',
    displayName: 'Asha',
    systems: ['refuge', 'prestige'],
    supportLine: 'Veille sur les sources et les cristaux.',
    roleLine: 'Apaise les Myrions fatigués.',
  },
  elwen: {
    companionId: 'elwen',
    displayName: 'Elwen',
    systems: ['inventory', 'village'],
    supportLine: 'Classe trouvailles et archives.',
    roleLine: 'Retrouve vite ce dont tu as besoin.',
  },
  noa: {
    companionId: 'noa',
    displayName: 'Noa',
    systems: ['inventory', 'gacha'],
    supportLine: 'Mélange léger et curiosités.',
    roleLine: 'Propose des combinaisons sans risque.',
  },
  sora: {
    companionId: 'sora',
    displayName: 'Sora',
    systems: ['moon-farm', 'refuge'],
    supportLine: 'Lie Myrions et Ferme lunaire.',
    roleLine: 'Rend la Ferme lunaire plus accueillante.',
  },
  zelie: {
    companionId: 'zelie',
    displayName: 'Zelie',
    systems: ['village', 'gacha'],
    supportLine: 'Ouvre des pistes sociales.',
    roleLine: 'Partage des rumeurs du salon.',
  },
  etna: {
    companionId: 'etna',
    displayName: 'Etna',
    systems: ['gacha', 'prestige'],
    supportLine: 'Invitée de la faille Disagrea.',
    roleLine: 'Observe le prestige de loin.',
  },
  flonne: {
    companionId: 'flonne',
    displayName: 'Flonne',
    systems: ['refuge', 'gacha'],
    supportLine: 'Douceur et liens invités.',
    roleLine: 'Encourage le repos au refuge.',
  },
  laharl: {
    companionId: 'laharl',
    displayName: 'Laharl',
    systems: ['hunt', 'gacha'],
    supportLine: 'Énergie d’invité sans obligation.',
    roleLine: 'Propose la chasse pour s’échauffer.',
  },
  pleinair: {
    companionId: 'pleinair',
    displayName: 'Pleinair',
    systems: ['refuge', 'prestige'],
    supportLine: 'Présence calme des invités.',
    roleLine: 'Rappelle de ralentir parfois.',
  },
}

export function getCompanionSupportProfile(companionId: string): CompanionSupportProfile | null {
  return COMPANION_SUPPORT_PROFILES[companionId] ?? null
}

export function formatCompanionSupportSystems(systems: CompanionSupportSystemId[]): string {
  return systems.map((id) => COMPANION_SUPPORT_SYSTEM_LABELS[id]).join(', ')
}

export function listProfilesForSystem(systemId: CompanionSupportSystemId): CompanionSupportProfile[] {
  return Object.values(COMPANION_SUPPORT_PROFILES).filter((profile) =>
    profile.systems.includes(systemId),
  )
}

export function listCompanionNamesForSystem(systemId: CompanionSupportSystemId): string[] {
  return listProfilesForSystem(systemId).map((profile) => profile.displayName)
}

export type CompanionSupportPick = {
  profile: CompanionSupportProfile
  badge: 'Compagnon conseillé' | 'Soutien du jour'
}

function daySeed(now = Date.now()): number {
  return Math.floor(now / 86_400_000)
}

/** Choisit un profil pour un système — préfère le compagnon hôte si compatible. */
export function pickCompanionSupportForSystem(
  systemId: CompanionSupportSystemId,
  options?: {
    preferCompanionId?: string
    preferAffinity?: number
    now?: number
  },
): CompanionSupportPick | null {
  const candidates = listProfilesForSystem(systemId)
  if (candidates.length === 0) return null

  const preferId = options?.preferCompanionId
  if (preferId) {
    const preferred = COMPANION_SUPPORT_PROFILES[preferId]
    if (preferred?.systems.includes(systemId)) {
      return { profile: preferred, badge: 'Compagnon conseillé' }
    }
  }

  const seed = daySeed(options?.now)
  const sorted = [...candidates].sort((a, b) => a.companionId.localeCompare(b.companionId))
  const affinity = options?.preferAffinity ?? 0
  const weighted =
    affinity >= 3
      ? sorted.filter((profile) => profile.companionId === preferId)
      : sorted
  const pool = weighted.length > 0 ? weighted : sorted
  const profile = pool[seed % pool.length]
  return { profile, badge: 'Soutien du jour' }
}
