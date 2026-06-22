/** Layout partagé script ↔ app — source de vérité des emplacements bâtiments. */
export const PANORAMA_WIDTH = 6400
export const PANORAMA_HEIGHT = 1080
export const SECTION_WIDTH = 800

/** Ordre de déblocage gauche → droite */
export const BUILDING_SLOT_ORDER = [
  'inn',
  'mist-garden',
  'ribbon-workshop',
  'clear-spring',
  'moon-farm',
  'arcane-library',
  'traveler-theater',
  'star-market',
]

export const BUILDING_UNLOCK_STAGE = {
  inn: 0,
  'mist-garden': 0,
  'ribbon-workshop': 1,
  'clear-spring': 1,
  'moon-farm': 2,
  'arcane-library': 2,
  'traveler-theater': 3,
  'star-market': 4,
}

const BUILDING_LABELS = {
  inn: 'Auberge',
  'mist-garden': 'Jardin',
  'ribbon-workshop': 'Atelier',
  'clear-spring': 'Source',
  'moon-farm': 'Ferme',
  'arcane-library': 'Bibliotheque',
  'traveler-theater': 'Theatre',
  'star-market': 'Bazar',
}

/** Y du sol (px depuis le haut) — alternance légère pour éviter l alignement rigide. */
const GROUND_Y = [540, 500, 530, 490, 540, 510, 500, 530]

export const BUILDING_SLOTS = BUILDING_SLOT_ORDER.map((id, index) => {
  const centerX = SECTION_WIDTH * 0.5 + index * SECTION_WIDTH
  const groundY = GROUND_Y[index]
  return {
    id,
    centerX,
    unlockStage: BUILDING_UNLOCK_STAGE[id],
    groundY,
    groundBottomPercent: Math.round(((PANORAMA_HEIGHT - groundY) / PANORAMA_HEIGHT) * 1000) / 10,
    widthPercent: Math.round((SECTION_WIDTH * 0.72 / PANORAMA_WIDTH) * 1000) / 10,
    labelYPercent: index % 2 === 0 ? 40 : 36,
    label: BUILDING_LABELS[id],
  }
})
