import {
  COMPANION_EMOTION_IDS,
  companionAffinityNsfwPath,
  companionAssetPath,
  companionChibiPath,
  companionEmotionCutoutPath,
  DISAGREA_COMPANION_IDS,
} from './companionAssets'
import {
  integratedDisagreaRepoPath,
  publicCompanionRepoPath,
  stagingCompanionRepoPath,
} from './devVisualRepoPaths'
import type { DisagreaCompanionId } from './eventDisagreaPack'
import { VILLAGE_COMPANION_IDS } from './integratedPortraitPrompts'

export type DevVisualKind =
  | 'affinity'
  | 'emotion'
  | 'chibi'
  | 'cutout'
  | 'background'
  | 'integrated'
  | 'integrated-nsfw'

export type DevVisualEntry = {
  id: string
  kind: DevVisualKind
  label: string
  /** URL publique ou dev-assets */
  src: string
  /** Chemin relatif repo (Explorateur Windows en dev). */
  repoPath: string
  companionId: string
  level?: number
}

export type DevVisualSection = {
  kind: DevVisualKind
  title: string
  entries: DevVisualEntry[]
}

export const DEV_EVENT_DISAGREA_ROOT = '/dev-assets/event-disagrea'
export const DEV_STAGING_ROOT = '/dev-assets/staging-companion-visual-pack'

const DISAGREA_SET = new Set<string>(DISAGREA_COMPANION_IDS)

const INTEGRATED_LEVELS: { level: number; filename: (id: DisagreaCompanionId) => string; label: string }[] = [
  {
    level: 1,
    filename: (id) => `companion-${id}-affinity-01-scene-originale-v1.png`,
    label: 'L1 rencontre',
  },
  {
    level: 2,
    filename: (id) => `companion-${id}-affinity-02-flirt-proche-scene-originale-v1.png`,
    label: 'L2 flirt',
  },
  {
    level: 3,
    filename: (id) => `companion-${id}-affinity-03-vulnerable-complicite-scene-originale-v1.png`,
    label: 'L3 complicité',
  },
  {
    level: 4,
    filename: (id) => `companion-${id}-affinity-04-intime-soft-scene-originale-v1.png`,
    label: 'L4 intime',
  },
  {
    level: 5,
    filename: (id) => `companion-${id}-affinity-05-peak-bond-scene-originale-v1.png`,
    label: 'L5 peak',
  },
]

function devIntegratedUrl(companionId: string, filename: string) {
  return `${DEV_EVENT_DISAGREA_ROOT}/integrated/companions/${companionId}/${filename}`
}

function devStagingUrl(relativePath: string) {
  return `${DEV_STAGING_ROOT}/${relativePath.replace(/^\/+/, '')}`
}

/** Variantes NSFW Disagrea pour la galerie dev (Etna max 3). */
const DISAGREA_NSFW_VARIANTS: Record<
  DisagreaCompanionId,
  { id: string; label: string; src: string; repoPath: string }[]
> = {
  etna: [
    {
      id: 'lit-batch5-v5',
      label: 'Lit batch5-v5 (prod)',
      src: companionAffinityNsfwPath('etna'),
      repoPath: publicCompanionRepoPath('etna', 'affinity-4-nsfw.png'),
    },
    {
      id: 'lit-batch5-v4',
      label: 'Lit batch5-v4',
      src: devStagingUrl(
        'disagrea/etna/tests/companion-etna-affinity-05-lit-batch5-v4-v4-perfect-legs.png',
      ),
      repoPath: stagingCompanionRepoPath(
        'disagrea/etna/tests/companion-etna-affinity-05-lit-batch5-v4-v4-perfect-legs.png',
      ),
    },
    {
      id: 'lit-batch5-v3',
      label: 'Lit batch5-v3',
      src: devStagingUrl(
        'disagrea/etna/tests/companion-etna-affinity-05-lit-batch5-v3-v4-refined-tail.png',
      ),
      repoPath: stagingCompanionRepoPath(
        'disagrea/etna/tests/companion-etna-affinity-05-lit-batch5-v3-v4-refined-tail.png',
      ),
    },
  ],
  flonne: [
    {
      id: 'peak-plus-prod',
      label: 'L6 peak-plus (prod)',
      src: companionAffinityNsfwPath('flonne'),
      repoPath: publicCompanionRepoPath('flonne', 'affinity-4-nsfw.png'),
    },
    {
      id: 'l5-peak',
      label: 'L5 peak bond',
      src: devIntegratedUrl('flonne', 'companion-flonne-affinity-05-peak-bond-scene-originale-v1.png'),
      repoPath: integratedDisagreaRepoPath(
        'flonne',
        'companion-flonne-affinity-05-peak-bond-scene-originale-v1.png',
      ),
    },
    {
      id: 'l4-intime',
      label: 'L4 intime soft',
      src: devIntegratedUrl('flonne', 'companion-flonne-affinity-04-intime-soft-scene-originale-v1.png'),
      repoPath: integratedDisagreaRepoPath(
        'flonne',
        'companion-flonne-affinity-04-intime-soft-scene-originale-v1.png',
      ),
    },
  ],
  laharl: [
    {
      id: 'peak-plus-prod',
      label: 'L6 peak-plus (prod)',
      src: companionAffinityNsfwPath('laharl'),
      repoPath: publicCompanionRepoPath('laharl', 'affinity-4-nsfw.png'),
    },
    {
      id: 'l5-peak',
      label: 'L5 peak bond',
      src: devIntegratedUrl('laharl', 'companion-laharl-affinity-05-peak-bond-scene-originale-v1.png'),
      repoPath: integratedDisagreaRepoPath(
        'laharl',
        'companion-laharl-affinity-05-peak-bond-scene-originale-v1.png',
      ),
    },
    {
      id: 'l4-intime',
      label: 'L4 intime soft',
      src: devIntegratedUrl('laharl', 'companion-laharl-affinity-04-intime-soft-scene-originale-v1.png'),
      repoPath: integratedDisagreaRepoPath(
        'laharl',
        'companion-laharl-affinity-04-intime-soft-scene-originale-v1.png',
      ),
    },
  ],
  pleinair: [
    {
      id: 'peak-plus-prod',
      label: 'L6 peak-plus (prod)',
      src: companionAffinityNsfwPath('pleinair'),
      repoPath: publicCompanionRepoPath('pleinair', 'affinity-4-nsfw.png'),
    },
    {
      id: 'l5-peak',
      label: 'L5 peak bond',
      src: devIntegratedUrl(
        'pleinair',
        'companion-pleinair-affinity-05-peak-bond-scene-originale-v1.png',
      ),
      repoPath: integratedDisagreaRepoPath(
        'pleinair',
        'companion-pleinair-affinity-05-peak-bond-scene-originale-v1.png',
      ),
    },
    {
      id: 'l4-intime',
      label: 'L4 intime soft',
      src: devIntegratedUrl(
        'pleinair',
        'companion-pleinair-affinity-04-intime-soft-scene-originale-v1.png',
      ),
      repoPath: integratedDisagreaRepoPath(
        'pleinair',
        'companion-pleinair-affinity-04-intime-soft-scene-originale-v1.png',
      ),
    },
  ],
}

function buildDisagreaNsfwSection(companionId: DisagreaCompanionId): DevVisualSection {
  const variants = DISAGREA_NSFW_VARIANTS[companionId]
  return {
    kind: 'integrated-nsfw',
    title: 'Variantes NSFW',
    entries: variants.map((variant) => ({
      id: `${companionId}-nsfw-${variant.id}`,
      kind: 'integrated-nsfw' as const,
      label: variant.label,
      src: variant.src,
      repoPath: variant.repoPath,
      companionId,
      level: 4,
    })),
  }
}

export const ALL_DEV_COMPANION_IDS = [...VILLAGE_COMPANION_IDS, ...DISAGREA_COMPANION_IDS]

export function buildCompanionDevVisualSections(
  companionId: string,
  _options?: { includeNsfw?: boolean },
): DevVisualSection[] {
  const sections: DevVisualSection[] = []

  sections.push({
    kind: 'affinity',
    title: 'Affinité L1–L5 (jeu)',
    entries: [1, 2, 3, 4, 5].map((level) => ({
      id: `${companionId}-affinity-${level}`,
      kind: 'affinity' as const,
      label: `Palier ${level}`,
      src: companionAssetPath(companionId, level),
      repoPath: publicCompanionRepoPath(companionId, `affinity-${level}.png`),
      companionId,
      level,
    })),
  })

  sections.push({
    kind: 'emotion',
    title: 'Cutouts émotion',
    entries: COMPANION_EMOTION_IDS.map((emotion) => ({
      id: `${companionId}-emotion-${emotion}`,
      kind: 'emotion' as const,
      label: emotion,
      src: companionEmotionCutoutPath(companionId, emotion),
      repoPath: publicCompanionRepoPath(companionId, `emotion-${emotion}.png`),
      companionId,
    })),
  })

  sections.push({
    kind: 'chibi',
    title: 'Chibi',
    entries: [
      {
        id: `${companionId}-chibi`,
        kind: 'chibi' as const,
        label: 'chibi.png',
        src: companionChibiPath(companionId),
        repoPath: publicCompanionRepoPath(companionId, 'chibi.png'),
        companionId,
      },
    ],
  })

  if (DISAGREA_SET.has(companionId)) {
    sections.push(buildDisagreaNsfwSection(companionId as DisagreaCompanionId))

    sections.push({
      kind: 'integrated',
      title: 'Source intégrée (assets/) — miroir affinity',
      entries: INTEGRATED_LEVELS.map(({ level, filename, label }) => {
        const id = companionId as DisagreaCompanionId
        const file = filename(id)
        return {
          id: `${companionId}-integrated-${level}`,
          kind: 'integrated' as const,
          label,
          src: devIntegratedUrl(id, file),
          repoPath: integratedDisagreaRepoPath(id, file),
          companionId,
          level,
        }
      }),
    })
  }

  return sections
}

export function flattenDevVisualEntries(sections: DevVisualSection[]): DevVisualEntry[] {
  return sections.flatMap((section) => section.entries)
}
