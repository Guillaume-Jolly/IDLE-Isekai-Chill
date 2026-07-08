import type { DisagreaCompanionId } from '../eventDisagreaPack'
import type { HsbColor } from './scoring'
import { DIALED_COLOR_ROUNDS } from './scoring'

export type Color2Prompt = {
  id: string
  companionId: DisagreaCompanionId
  imageSrc: string
  promptFr: string
  target: HsbColor
}

/** Teintes curées — event Disagrea (usage perso). */
export const COLOR2_PROMPT_POOL: Color2Prompt[] = [
  {
    id: 'etna-hair',
    companionId: 'etna',
    imageSrc: '/assets/companions/etna/affinity-1.png',
    promptFr: 'Couleur des cheveux d’Etna',
    target: { h: 310, s: 72, b: 42 },
  },
  {
    id: 'etna-wings',
    companionId: 'etna',
    imageSrc: '/assets/companions/etna/affinity-1.png',
    promptFr: 'Membranes des ailes d’Etna',
    target: { h: 285, s: 55, b: 38 },
  },
  {
    id: 'etna-eyes',
    companionId: 'etna',
    imageSrc: '/assets/companions/etna/affinity-1.png',
    promptFr: 'Couleur des yeux d’Etna',
    target: { h: 0, s: 82, b: 52 },
  },
  {
    id: 'etna-boots',
    companionId: 'etna',
    imageSrc: '/assets/companions/etna/affinity-1.png',
    promptFr: 'Teinte des bottes d’Etna',
    target: { h: 0, s: 0, b: 12 },
  },
  {
    id: 'etna-belt',
    companionId: 'etna',
    imageSrc: '/assets/companions/etna/affinity-1.png',
    promptFr: 'Couleur de la ceinture d’Etna',
    target: { h: 0, s: 0, b: 96 },
  },
  {
    id: 'flonne-hair',
    companionId: 'flonne',
    imageSrc: '/assets/companions/flonne/affinity-1.png',
    promptFr: 'Couleur des cheveux de Flonne',
    target: { h: 48, s: 28, b: 94 },
  },
  {
    id: 'flonne-ribbon',
    companionId: 'flonne',
    imageSrc: '/assets/companions/flonne/affinity-1.png',
    promptFr: 'Rubans roses de Flonne',
    target: { h: 345, s: 42, b: 92 },
  },
  {
    id: 'flonne-tunic',
    companionId: 'flonne',
    imageSrc: '/assets/companions/flonne/affinity-1.png',
    promptFr: 'Bleu de la tunique de Flonne',
    target: { h: 205, s: 38, b: 88 },
  },
  {
    id: 'flonne-eyes',
    companionId: 'flonne',
    imageSrc: '/assets/companions/flonne/affinity-1.png',
    promptFr: 'Couleur des yeux de Flonne',
    target: { h: 212, s: 68, b: 72 },
  },
  {
    id: 'flonne-cross',
    companionId: 'flonne',
    imageSrc: '/assets/companions/flonne/affinity-1.png',
    promptFr: 'Or du motif croix de Flonne',
    target: { h: 46, s: 88, b: 78 },
  },
  {
    id: 'laharl-hair',
    companionId: 'laharl',
    imageSrc: '/assets/companions/laharl/affinity-1.png',
    promptFr: 'Couleur des cheveux de Laharl',
    target: { h: 218, s: 88, b: 58 },
  },
  {
    id: 'laharl-scarf',
    companionId: 'laharl',
    imageSrc: '/assets/companions/laharl/affinity-1.png',
    promptFr: 'Couleur de l’écharpe de Laharl',
    target: { h: 2, s: 86, b: 48 },
  },
  {
    id: 'laharl-pants',
    companionId: 'laharl',
    imageSrc: '/assets/companions/laharl/affinity-1.png',
    promptFr: 'Teinte du pantalon de Laharl',
    target: { h: 5, s: 78, b: 38 },
  },
  {
    id: 'laharl-eyes',
    companionId: 'laharl',
    imageSrc: '/assets/companions/laharl/affinity-1.png',
    promptFr: 'Couleur des yeux de Laharl',
    target: { h: 0, s: 80, b: 50 },
  },
  {
    id: 'laharl-buckle',
    companionId: 'laharl',
    imageSrc: '/assets/companions/laharl/affinity-1.png',
    promptFr: 'Or de la boucle de ceinture de Laharl',
    target: { h: 42, s: 92, b: 72 },
  },
  {
    id: 'pleinair-hair',
    companionId: 'pleinair',
    imageSrc: '/assets/companions/pleinair/affinity-1.png',
    promptFr: 'Couleur des cheveux de Pleinair',
    target: { h: 198, s: 32, b: 86 },
  },
  {
    id: 'pleinair-bow',
    companionId: 'pleinair',
    imageSrc: '/assets/companions/pleinair/affinity-1.png',
    promptFr: 'Couleur du grand nœud de Pleinair',
    target: { h: 0, s: 78, b: 52 },
  },
  {
    id: 'pleinair-dress',
    companionId: 'pleinair',
    imageSrc: '/assets/companions/pleinair/affinity-1.png',
    promptFr: 'Blanc de la robe de Pleinair',
    target: { h: 0, s: 4, b: 98 },
  },
  {
    id: 'pleinair-eyes',
    companionId: 'pleinair',
    imageSrc: '/assets/companions/pleinair/affinity-1.png',
    promptFr: 'Couleur des yeux de Pleinair',
    target: { h: 0, s: 72, b: 48 },
  },
  {
    id: 'pleinair-trim',
    companionId: 'pleinair',
    imageSrc: '/assets/companions/pleinair/affinity-1.png',
    promptFr: 'Accents rouges de la robe de Pleinair',
    target: { h: 355, s: 70, b: 55 },
  },
]

export type Color2Round = Color2Prompt

export function buildColor2Rounds(count = DIALED_COLOR_ROUNDS): Color2Round[] {
  const laharlOnly =
    import.meta.env.DEV && new URLSearchParams(window.location.search).has('colorToonPoc')
  const pool = laharlOnly
    ? COLOR2_PROMPT_POOL.filter((p) => p.companionId === 'laharl')
    : [...COLOR2_PROMPT_POOL]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
