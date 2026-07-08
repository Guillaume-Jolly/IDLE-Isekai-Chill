import type { DialogueTone } from './types'

/** Qui mène la scène intime — par échange (corpus) ou défaut compagnon (palier). */
export type ParlerPowerDynamic =
  | 'companion_dominant'
  | 'companion_invites'
  | 'mutual'
  | 'protagonist_invited'

export const PARLER_POWER_DYNAMIC_LABELS: Record<ParlerPowerDynamic, string> = {
  companion_dominant: 'Compagnon·ne mène — le MC cède / suit',
  companion_invites: 'Compagnon·ne invite — le MC agit sur consigne',
  mutual: 'Rythme partagé',
  protagonist_invited: 'Compagnon·ne laisse le MC prendre l’initiative',
}

export type ParlerAffinityTier = {
  /** Indice affiché en session Parler (remplace le hint aff. 1 générique). */
  personalityHint: string
  defaultPowerDynamic: ParlerPowerDynamic
  toneWeights?: Partial<Record<DialogueTone, number>>
}

/** Palier d’affinité → personnalité Parler (Lyra et futurs compagnons). */
export const PARLER_COMPANION_TIERS: Record<
  string,
  Partial<Record<number, ParlerAffinityTier>>
> = {
  lyra: {
    1: {
      personalityHint:
        'Lyra est réservée et intellectuelle — écoute, patience, pas de flirts lourds.',
      defaultPowerDynamic: 'mutual',
    },
    2: {
      personalityHint:
        'Lyra s’ouvre un peu — complicité discrète, toujours sans lourdeur.',
      defaultPowerDynamic: 'mutual',
    },
    3: {
      personalityHint:
        'Lyra en complicité — sourires rares, confidences basse voix, romantic tempéré sans suggestif.',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint:
        'Lyra froide et en contrôle — bibliothèque, proximité suggestive, elle fixe le tempo.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint:
        'Lyra dominante — ordres secs, verrou à la bibliothèque puis lit ; le MC suit ou obéit.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
  maeve: {
    1: {
      personalityHint:
        'Maeve négocie au comptoir — directe, maline, audace mesurée ; pas de romance, des contreparties.',
      defaultPowerDynamic: 'companion_invites',
    },
    3: {
      personalityHint:
        'Maeve ferme le marché pour toi — complicité deal, crédit et registre, romantic toujours bas.',
      defaultPowerDynamic: 'companion_invites',
    },
    4: {
      personalityHint:
        'Maeve mène au comptoir fermé — provocation calculée, contact transactionnel.',
      defaultPowerDynamic: 'companion_invites',
    },
    5: {
      personalityHint:
        'Maeve alterne taquinerie et main ferme — le MC a mené la danse ou paie en confiance.',
      defaultPowerDynamic: 'mutual',
    },
  },
  noa: {
    1: {
      personalityHint: 'Noa taquine au labo — prétextes, ligne jaune, zéro poésie.',
      defaultPowerDynamic: 'mutual',
    },
    3: {
      personalityHint: 'Noa parie sur l’inventaire — brat léger, explosions (bluff).',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint: 'Noa colle « pour la sécurité » — suggestif ludique, rire nerveux.',
      defaultPowerDynamic: 'mutual',
    },
  },
  talia: {
    1: {
      personalityHint: 'Talia lit la piste — direct et playful, pas de déclaration.',
      defaultPowerDynamic: 'mutual',
    },
    3: {
      personalityHint: 'Talia lance des défis absurdes — complicité terrain, revanche demain.',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint: 'Talia partage l’abri — chaleur franche, suggestif outdoor léger.',
      defaultPowerDynamic: 'mutual',
    },
  },
  runa: {
    1: {
      personalityHint: 'Runa forge en silence — sincere et direct, romantic absent.',
      defaultPowerDynamic: 'mutual',
    },
    3: {
      personalityHint: 'Runa te laisse une place à la forge — confiance par le geste, pas les mots.',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint: 'Runa ralentit le marteau — proximité sobre, pas de grandiloquence.',
      defaultPowerDynamic: 'mutual',
    },
  },
  etna: {
    1: {
      personalityHint:
        'Etna exige qu’on la traite en bombe — snark, ordres taquins, graveleux tease (Disagrea).',
      defaultPowerDynamic: 'companion_dominant',
    },
    2: {
      personalityHint:
        'Etna teste ta audace — flatterie lourde ou defi ; elle domine le RP, pas la poésie.',
      defaultPowerDynamic: 'companion_dominant',
    },
    3: {
      personalityHint:
        'Etna parie et punit en jeu — BDSM tease, pudding off-limits, familiers en fond.',
      defaultPowerDynamic: 'companion_dominant',
    },
    4: {
      personalityHint:
        'Etna mène en cadre Disagrea — companionAction, ordres, possession jouée.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint:
        'Etna domine la nuit RP — BDSM à fond, comique-violent, rare crack loyal.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
  laharl: {
    1: {
      personalityHint:
        'Laharl hurle qu’il est méchant — provocation, chasse, panique si tu dis « amour ».',
      defaultPowerDynamic: 'mutual',
    },
    2: {
      personalityHint:
        'Laharl nie qu’il aime le havre — tsundere, graveleux compétitif, pas romance lisse.',
      defaultPowerDynamic: 'mutual',
    },
    3: {
      personalityHint:
        'Laharl veut une revanche — défis physiques, col attrapé en défi, toujours en déni.',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint:
        'Laharl grognonne contre ta bouche — lutte consentie, lit « récupération », RP Disagrea.',
      defaultPowerDynamic: 'mutual',
    },
    5: {
      personalityHint:
        'Laharl avoue maladroitement — possessif enfantin, compétition → intimacy, aftercare bref.',
      defaultPowerDynamic: 'mutual',
    },
  },
  roric: {
    1: {
      personalityHint:
        'Roric teste le tempo — recrue, ordres calmes, protocole consentement (signaux).',
      defaultPowerDynamic: 'companion_dominant',
    },
    3: {
      personalityHint:
        'Roric hors du tapis — confiance sobre, prénom, domination sans théâtre.',
      defaultPowerDynamic: 'companion_dominant',
    },
    4: {
      personalityHint:
        'Roric cadre le soir — BDSM Havre sobre, mains, pauses, safeword casse.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint:
        'Roric cède une vulnérabilité choisie — toujours dans le cadre, jamais cruel.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
  finn: {
    1: {
      personalityHint:
        'Finn cabotine puis tremble — shy en privé, pas de direct brutal.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    2: {
      personalityHint:
        'Finn dit « mon étoile » — sincere, demande la permission, MC mène.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    3: {
      personalityHint:
        'Finn montre ses billets d’excuse — complicité timide, playful léger.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    4: {
      personalityHint:
        'Finn offre le lead au MC — « dis-moi quand », réactions chaudes si guidé.',
      defaultPowerDynamic: 'companion_invites',
    },
    5: {
      personalityHint:
        'Finn demande sans numéro — aftercare important, warm, pas humiliation.',
      defaultPowerDynamic: 'companion_invites',
    },
  },
  iris: {
    1: {
      personalityHint: 'Iris rêveuse — métaphores, nature, tendresse discrète.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    4: {
      personalityHint: 'Iris attend patiemment — douceur, le MC peut avancer à son rythme.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    5: {
      personalityHint: 'Iris se laisse guider — murmures, pas d’ordres brusques.',
      defaultPowerDynamic: 'protagonist_invited',
    },
  },
  seren: {
    1: {
      personalityHint: 'Seren digne et froide — respect, fierté, jamais de moquerie.',
      defaultPowerDynamic: 'companion_dominant',
    },
    4: {
      personalityHint: 'Seren garde la distance — le MC doit mériter chaque pas.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint: 'Seren cède rarement — contrôle jusqu’au bout.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
}

function nearestTier(
  tiers: Partial<Record<number, ParlerAffinityTier>>,
  affinity: number,
): ParlerAffinityTier | null {
  const keys = Object.keys(tiers)
    .map(Number)
    .filter((level) => level <= affinity)
    .sort((left, right) => right - left)
  const key = keys[0]
  return key !== undefined ? (tiers[key] ?? null) : null
}

export function getParlerAffinityTier(
  companionId: string,
  affinity: number,
): ParlerAffinityTier | null {
  const tiers = PARLER_COMPANION_TIERS[companionId]
  if (!tiers) return null
  return nearestTier(tiers, affinity) ?? tiers[1] ?? null
}

export function getParlerPersonalityHint(companionId: string, affinity: number): string | null {
  return getParlerAffinityTier(companionId, affinity)?.personalityHint ?? null
}

export function getDefaultParlerPowerDynamic(
  companionId: string,
  affinity: number,
): ParlerPowerDynamic {
  return getParlerAffinityTier(companionId, affinity)?.defaultPowerDynamic ?? 'mutual'
}
