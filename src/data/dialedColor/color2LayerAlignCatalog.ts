/** Calques alignables — lab Color Toon (Laharl). */

export const COLOR2_LAHARL_PORTRAIT = '/assets/companions/laharl/affinity-1.png'

export type Color2AlignLayerDef = {
  id: string
  label: string
  src: string
  /** overlay = PNG transparent affiché tel quel ; mask = masque debug semi-transparent */
  kind: 'overlay' | 'mask'
}

/** Calque cheveux actif en lab (PNG alpha, affiché tel quel). */
export const COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID = 'cheveux-v3'

/** Ordre d’empilement (bas → haut). */
export const COLOR2_LAHARL_ALIGN_LAYERS: Color2AlignLayerDef[] = [
  {
    id: 'cheveux-v3',
    label: 'Cheveux v3',
    src: '/assets/companions/laharl/mask-chatgpt-cheveux-v3.png',
    kind: 'overlay',
  },
  {
    id: 'cheveux-v2',
    label: 'Cheveux v2',
    src: '/assets/companions/laharl/mask-chatgpt-cheveux-v2.png',
    kind: 'overlay',
  },
  {
    id: 'cheveux',
    label: 'Cheveux (ChatGPT v1)',
    src: '/assets/companions/laharl/mask-chatgpt-cheveux.png',
    kind: 'mask',
  },
  {
    id: 'yeux',
    label: 'Yeux',
    src: '/assets/companions/laharl/mask-chatgpt-yeux.png',
    kind: 'mask',
  },
  {
    id: 'echarpe',
    label: 'Écharpe',
    src: '/assets/companions/laharl/mask-chatgpt-echarpe.png',
    kind: 'mask',
  },
  {
    id: 'pantalon',
    label: 'Pantalon',
    src: '/assets/companions/laharl/mask-chatgpt-pantalon.png',
    kind: 'mask',
  },
  {
    id: 'ceinture',
    label: 'Ceinture',
    src: '/assets/companions/laharl/mask-chatgpt-ceinture.png',
    kind: 'mask',
  },
  {
    id: 'botte-gauche',
    label: 'Botte gauche',
    src: '/assets/companions/laharl/mask-chatgpt-botte-gauche.png',
    kind: 'mask',
  },
  {
    id: 'botte-droite',
    label: 'Botte droite',
    src: '/assets/companions/laharl/mask-chatgpt-botte-droite.png',
    kind: 'mask',
  },
  {
    id: 'bras-gauche',
    label: 'Brassard gauche',
    src: '/assets/companions/laharl/mask-chatgpt-bras-gauche.png',
    kind: 'mask',
  },
  {
    id: 'bras-droit',
    label: 'Brassard droit',
    src: '/assets/companions/laharl/mask-chatgpt-bras-droit.png',
    kind: 'mask',
  },
  {
    id: 'peau',
    label: 'Peau visible',
    src: '/assets/companions/laharl/mask-chatgpt-peau.png',
    kind: 'mask',
  },
  {
    id: 'oreilles',
    label: 'Oreilles',
    src: '/assets/companions/laharl/mask-chatgpt-oreilles.png',
    kind: 'mask',
  },
]

export function getColor2AlignLayer(id: string): Color2AlignLayerDef | undefined {
  return COLOR2_LAHARL_ALIGN_LAYERS.find((layer) => layer.id === id)
}
