/**
 * Chemins à précharger au boot (splash → village → gacha → myrions → hub → compagnons).
 * Conserve les fallbacks legacy — résolution via assetProbeCache.
 */
import { BUILDING_SLOT_ORDER, PANORAMA_BASE_ASSET, panoramaLegacyAsset } from '../data/villageMap'
import { BUILDING_ACTIVITIES } from '../data/buildingActivities'
import { BIOMES_WITH_BACKGROUNDS } from '../data/wildFamiliars'
import { FESTIVAL_EVENT_BANNER } from '../data/festivalGacha'
import {
  COMPANIONS_WITH_CHIBI,
  companionAssetPathCandidates,
  companionBackgroundPathCandidates,
  companionBackgroundWidePathCandidates,
  companionChibiPathCandidates,
  companionCutoutPathCandidates,
  DISAGREA_COMPANION_IDS,
} from '../data/companionAssets'
import {
  biomeBackgroundPngPathCandidates,
  biomeBackgroundPortraitPngPathCandidates,
  enclosureAssetPathCandidates,
  enclosurePortraitAssetPathCandidates,
  getPalmonAssetPathCandidates,
  MYRION_SPECIES_IDS,
} from '../data/minigameAssets'
import { WORKSITE_MVP15_AVAILABLE_ASSETS } from '../data/myrionWorksiteAssetRegistry'
import { SPLASH_IMAGE_URLS } from '../data/splashSlides'

const WARMUP_COMPANION_LEVELS = [1, 2, 3, 4, 5] as const

const GACHA_ICON_RELATIVES = [
  'gacha/icons/gift.svg',
  'gacha/icons/guest.svg',
  'gacha/icons/meteor.svg',
  'gacha/icons/silk.svg',
  'gacha/icons/celestial.svg',
  'gacha/icons/kimono.svg',
  'gacha/icons/coins.svg',
  'gacha/icons/food.svg',
  'gacha/icons/wood.svg',
  'gacha/icons/ticket.svg',
  'gacha/icons/lantern.svg',
  'gacha/icons/snow.svg',
  'gacha/icons/aurora.svg',
  'gacha/icons/eclipse.svg',
  'gacha/cinema/hostess-intro.png',
  'gacha/cinema/disagrea/start.png',
] as const

export type WarmupPhase = 'splash' | 'village' | 'gacha' | 'myrions' | 'minigames' | 'companions'

export type WarmupPathTask = {
  phase: WarmupPhase
  /** Candidats relatifs (canonique + legacy) — premier résolu gagne. */
  relatives: string[]
}

export const WARMUP_PHASE_LABELS: Record<WarmupPhase, string> = {
  splash: 'Visuels de présentation…',
  village: 'Village et panorama…',
  gacha: 'Gacha et événements…',
  myrions: 'Myrions et biomes…',
  minigames: 'Mini-jeux et Ferme lunaire…',
  companions: 'Portraits compagnons…',
}

function stripLeadingSlash(path: string) {
  return path.replace(/^\/+/, '')
}

function isDisagreaCompanion(companionId: string) {
  return (DISAGREA_COMPANION_IDS as readonly string[]).includes(companionId)
}

function uniqueTasks(tasks: WarmupPathTask[]): WarmupPathTask[] {
  const seen = new Set<string>()
  const out: WarmupPathTask[] = []
  for (const task of tasks) {
    const key = `${task.phase}:${task.relatives.join('|')}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(task)
  }
  return out
}

export function collectVillageWarmupTasks(): WarmupPathTask[] {
  const tasks: WarmupPathTask[] = [
    {
      phase: 'village',
      relatives: [stripLeadingSlash(PANORAMA_BASE_ASSET), stripLeadingSlash(panoramaLegacyAsset)],
    },
  ]

  for (const buildingId of BUILDING_SLOT_ORDER) {
    tasks.push({
      phase: 'village',
      relatives: [`buildings/${buildingId}.png`],
    })
  }

  return tasks
}

export function collectGachaWarmupTasks(): WarmupPathTask[] {
  const tasks: WarmupPathTask[] = GACHA_ICON_RELATIVES.map((relative) => ({
    phase: 'gacha' as const,
    relatives: [relative],
  }))

  if (FESTIVAL_EVENT_BANNER.bannerSrc) {
    tasks.push({
      phase: 'gacha',
      relatives: [stripLeadingSlash(FESTIVAL_EVENT_BANNER.bannerSrc)],
    })
  }

  return tasks
}

export function collectMyrionWarmupTasks(): WarmupPathTask[] {
  const tasks: WarmupPathTask[] = []

  for (const biomeId of BIOMES_WITH_BACKGROUNDS) {
    tasks.push({
      phase: 'myrions',
      relatives: biomeBackgroundPngPathCandidates(biomeId),
    })
    tasks.push({
      phase: 'myrions',
      relatives: biomeBackgroundPortraitPngPathCandidates(biomeId),
    })
    tasks.push({
      phase: 'myrions',
      relatives: enclosureAssetPathCandidates(biomeId),
    })
    tasks.push({
      phase: 'myrions',
      relatives: enclosurePortraitAssetPathCandidates(biomeId),
    })
  }

  for (const speciesId of MYRION_SPECIES_IDS) {
    for (const variant of ['full', 'chibi', 'silhouette'] as const) {
      tasks.push({
        phase: 'myrions',
        relatives: getPalmonAssetPathCandidates(speciesId, variant),
      })
    }
  }

  return tasks
}

export function collectMinigameHubWarmupTasks(): WarmupPathTask[] {
  const activityIds = new Set<string>()
  for (const activity of BUILDING_ACTIVITIES) {
    activityIds.add(activity.id)
  }

  const tasks: WarmupPathTask[] = []

  for (const activityId of activityIds) {
    tasks.push({
      phase: 'minigames',
      relatives: [
        `assets/minigames/hub/presentations/${activityId}.png`,
        `minigames/presentations/${activityId}.png`,
      ],
    })
    tasks.push({
      phase: 'minigames',
      relatives: [
        `assets/minigames/hub/stages/${activityId}.png`,
        `minigames/stages/${activityId}.png`,
      ],
    })
  }

  for (const relPath of WORKSITE_MVP15_AVAILABLE_ASSETS) {
    tasks.push({
      phase: 'minigames',
      relatives: [`assets/minigames/myrion-worksite/${relPath}`],
    })
  }

  return tasks
}

export function collectCompanionWarmupTasks(): WarmupPathTask[] {
  const tasks: WarmupPathTask[] = []

  for (const companionId of COMPANIONS_WITH_CHIBI) {
    tasks.push({
      phase: 'companions',
      relatives: companionChibiPathCandidates(companionId),
    })

    for (const level of WARMUP_COMPANION_LEVELS) {
      tasks.push({
        phase: 'companions',
        relatives: companionAssetPathCandidates(companionId, level),
      })

      if (!isDisagreaCompanion(companionId)) {
        tasks.push({
          phase: 'companions',
          relatives: companionCutoutPathCandidates(companionId, level),
        })
        tasks.push({
          phase: 'companions',
          relatives: companionBackgroundPathCandidates(companionId, level),
        })
        tasks.push({
          phase: 'companions',
          relatives: companionBackgroundWidePathCandidates(companionId, level),
        })
      }
    }
  }

  return tasks
}

export function collectSplashWarmupUrls(): string[] {
  return [...SPLASH_IMAGE_URLS]
}

export function collectAllGameWarmupTasks(): WarmupPathTask[] {
  return uniqueTasks([
    ...collectVillageWarmupTasks(),
    ...collectGachaWarmupTasks(),
    ...collectMyrionWarmupTasks(),
    ...collectMinigameHubWarmupTasks(),
    ...collectCompanionWarmupTasks(),
  ])
}

/** Boot rapide — village + gacha (SVG / bannières). */
export function collectCriticalWarmupTasks(): WarmupPathTask[] {
  return uniqueTasks([...collectVillageWarmupTasks(), ...collectGachaWarmupTasks()])
}

/** Après entrée au jeu — portraits, Myrions, hub mini-jeux, Ferme lunaire. */
export function collectDeferredWarmupTasks(): WarmupPathTask[] {
  return uniqueTasks([
    ...collectMyrionWarmupTasks(),
    ...collectMinigameHubWarmupTasks(),
    ...collectCompanionWarmupTasks(),
  ])
}

/** @deprecated Utiliser collectCompanionWarmupTasks */
export function collectCompanionWarmupRelatives(): string[] {
  return collectCompanionWarmupTasks().flatMap((task) => task.relatives[0]).filter(Boolean) as string[]
}
