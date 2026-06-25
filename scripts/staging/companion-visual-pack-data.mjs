/**
 * Données + prompts cutouts émotion v3 — ancre par compagnon (affinity-1), PAS Etna global.
 */

export const CUTOUT_BG =
  'BACKGROUND MUST BE single flat solid matte color exactly #CFCFCF light gray, uniform everywhere, no gradient, no vignette, no floor, no cast shadow on ground, no scenery, no texture'

/** Style rendu jeu — Talia / Moussprout, jamais cel-shading Disgaea. */
export const CUTOUT_RENDER_STYLE = [
  'IDLE Isekai Chill mobile gacha illustration style',
  'soft painterly anime shading with smooth gradients NOT Disgaea cel-shading NOT harsh cartoon',
  'standard young-adult gacha proportions head-to-body ratio about 1:6',
  'clean thin colored lineart, detailed hair strands fabric folds subtle material sheen',
  'soft rim light on hair and outfit edges, large detailed eyes with multiple highlights',
  'full body head to toe both feet visible centered vertical composition single character only',
  'MATCH EXACT character identity colors outfit and render quality of THIS companion affinity-1 reference',
  'NOT Etna NOT generic demon girl unless this character IS Etna',
  CUTOUT_BG,
  'no text, no watermark',
].join(', ')

export const DISAGREA_COMPANIONS = {
  etna: {
    displayName: 'Etna',
    dna: 'demon vassal girl archetype, magenta twin ponytails, red eyes, tiny bat wings, heart-tip tail, mischievous energy',
    palette: 'magenta hair, black and plum outfit accents, gold buckles, soft purple wing membranes',
    baseOutfit:
      'ICONIC BASE OUTFIT level 1: black strapless top, black shorts, white belt, fingerless gloves, red thigh highs, oversized black boots, choker, skull earring',
    identityLock: 'MUST be Etna demon vassal girl with magenta twin ponytails red eyes bat wings heart tail',
  },
  flonne: {
    displayName: 'Flonne',
    dna: 'angelic healer archetype, long blonde hair with pink highlights, blue eyes, ribbon bows, pure cheerful aura',
    palette: 'white, sky blue, soft pink, gold cross motif',
    baseOutfit:
      'cozy isekai healer outfit level 1: white and blue layered tunic with ribbons, practical boots, herb pouch',
    identityLock: 'MUST be Flonne angel healer blonde pink highlights blue eyes ribbons NOT demon NOT Etna',
  },
  laharl: {
    displayName: 'Laharl',
    dna: 'YOUNG MALE demon overlord boy, bright BLUE spiky hair with two long antenna ahoge strands, red eyes, pointed ears, arrogant charisma — NOT female',
    palette: 'blue hair, crimson red scarf, red pants, black belt gold buckle, dark purple boots',
    baseOutfit:
      'ICONIC BASE OUTFIT male level 1: shirtless bare chest, large flowing red scarf, red pants, black belt gold buckle, black fingerless gloves gold cross, chunky purple-red boots',
    identityLock: 'MUST be Laharl YOUNG MALE blue spiky hair red scarf shirtless NOT female NOT Etna',
  },
  pleinair: {
    displayName: 'Pleinair',
    dna: 'quiet kuudere demon girl archetype, short light blue hair, red eyes, oversized red bow, bunny motif, childlike proportions but SAME gacha render technique NOT chibi',
    palette: 'ice blue hair, white dress, red bow and trim, pastel bunny plush',
    baseOutfit:
      'cozy isekai quiet mage outfit level 1: white sleeveless dress with red accents, arm warmers, holding soft bunny plush',
    identityLock: 'MUST be Pleinair short light blue hair red bow white dress bunny plush NOT Etna NOT magenta hair',
  },
}

export const VILLAGE_COMPANIONS = {
  lyra: {
    name: 'Lyra',
    role: 'Mage apprentie',
    outfit: 'deep violet mage robes with star embroidery, silver circlet, leather spellbook satchel, long dark purple hair',
    identityLock: 'MUST have long dark purple hair silver circlet violet mage robes NOT magenta NOT Etna demon',
  },
  maeve: {
    name: 'Maeve',
    role: 'Marchande nomade',
    outfit: 'travel merchant vest, layered scarves, coin pouch belt, gold jewelry, vibrant orange-red wavy long hair, golden amber eyes',
    identityLock: 'MUST have vibrant orange-red wavy hair golden amber eyes merchant vest NOT magenta NOT Etna',
  },
  seren: {
    name: 'Seren',
    role: 'Chevaliere paisible',
    outfit: 'light silver-blue knight tunic without heavy armor, white cape clasp, braided ash-blonde hair',
    identityLock: 'MUST have braided ash-blonde hair silver-blue knight tunic NOT demon NOT Etna',
  },
  nami: {
    name: 'Nami',
    role: 'Cuisiniere solaire',
    outfit: 'apron over sunny orange dress, wooden spoon accessory, short cheerful red hair',
    identityLock: 'MUST have short cheerful red hair orange apron cook outfit NOT demon NOT Etna',
  },
  iris: {
    name: 'Iris',
    role: 'Herboriste reveuse',
    outfit: 'green herb-gatherer dress, flower basket, soft mint and cream palette, wavy green-tinted hair',
    identityLock: 'MUST have wavy green-tinted hair green herb dress NOT demon NOT Etna',
  },
  kael: {
    name: 'Kael',
    role: 'Barde androgyne',
    outfit: 'theatrical bard coat with gold trim, feathered hat, lute strap, androgynous elegant features, light blue messy hair, purple eyes',
    identityLock: 'MUST have light blue messy hair purple eyes bard coat feathered hat androgynous NOT Etna demon girl',
  },
  runa: {
    name: 'Runa',
    role: 'Forgeronne douce',
    outfit: 'forge apron over rustic dress, hammer at belt, copper-red hair in bun',
    identityLock: 'MUST have copper-red hair in bun forge apron NOT demon NOT Etna',
  },
  solene: {
    name: 'Solene',
    role: 'Pretresse lunaire',
    outfit: 'white-gold lunar priestess robes, crescent moon tiara, pale gold hair',
    identityLock: 'MUST have pale gold hair crescent moon tiara white-gold priestess robes NOT Etna',
  },
  talia: {
    name: 'Talia',
    role: 'Exploratrice rieuse',
    outfit: 'dark olive crop top, open beige vest-shirt, khaki shorts, green ribbon braid, explorer satchel',
    identityLock: 'MUST match Talia explorer green ribbon braid khaki shorts olive crop top NOT Etna',
  },
  mira: {
    name: 'Mira',
    role: 'Tailleur de rubans',
    outfit: 'pink tailor dress with ribbon tools, measuring tape, rose-pink bob hair',
    identityLock: 'MUST have rose-pink bob hair pink tailor dress ribbons NOT Etna NOT magenta pigtails',
  },
  asha: {
    name: 'Asha',
    role: 'Gardienne des eaux',
    outfit: 'pale blue translucent water-guardian dress, pearl and shell jewelry, long bright cyan light-blue hair, blue eyes',
    identityLock: 'MUST have long bright cyan light-blue hair blue eyes water dress NOT Etna NOT magenta',
  },
  elwen: {
    name: 'Elwen',
    role: 'Archiviste feerique',
    outfit: 'scholarly green fairy archivist coat, round gold glasses, leaf hair clips, long golden blonde hair, pointed elf ears, green eyes',
    identityLock: 'MUST have long golden blonde hair pointed elf ears green eyes archivist coat NOT Etna',
  },
  noa: {
    name: 'Noa',
    role: 'Alchimiste curieuse',
    outfit: 'lab coat over purple dress, potion vials belt, bright pink hair in pigtails, purple eyes',
    identityLock: 'MUST have bright pink pigtails purple eyes lab coat NOT Etna demon NOT magenta twin tails',
  },
  sora: {
    name: 'Sora',
    role: 'Dresseuse lunaire',
    outfit: 'kitsune fox-girl with large blonde fox ears and fluffy orange-blonde tail, brown leather corset and white blouse, golden amber eyes, farm trainer vials belt',
    identityLock: 'MUST be kitsune fox-girl blonde fox ears fluffy tail NOT Etna NOT demon bat wings',
  },
  zelie: {
    name: 'Zelie',
    role: 'Duchesse en visite',
    outfit: 'elegant dark purple visiting gown, lace gloves, refined updo black hair',
    identityLock: 'MUST have refined updo black hair dark purple elegant gown NOT Etna NOT magenta pigtails',
  },
}

export function cutoutStyleAnchor(companionId) {
  return `public/assets/companions/${companionId}/affinity-1.png`
}

export function cutoutOutputPath(companionId, emotionId, version = 'v3') {
  const pack = DISAGREA_COMPANIONS[companionId] ? 'disagrea' : 'village'
  return `staging/companion-visual-pack/${pack}/${companionId}/cutouts/companion-${companionId}-emotion-${emotionId}-cutout-${version}.png`
}

export function disagreaCutoutPrompt(companionId, emotionPrompt, options = {}) {
  const c = DISAGREA_COMPANIONS[companionId]
  if (!c) throw new Error(`Unknown Disagrea companion: ${companionId}`)
  const version = options.version ?? 3
  return [
    `${c.displayName} emotion cutout portrait.`,
    c.dna,
    `Palette: ${c.palette}.`,
    c.baseOutfit,
    c.identityLock,
    `EXPRESSION & POSE ONLY (outfit unchanged from affinity-1): ${emotionPrompt}`,
    version >= 3 ? CUTOUT_RENDER_STYLE : legacyEmotionCutoutStyle(),
  ].join(', ')
}

export function villageCutoutPrompt(companionId, emotionPrompt, options = {}) {
  const c = VILLAGE_COMPANIONS[companionId]
  if (!c) throw new Error(`Unknown village companion: ${companionId}`)
  const version = options.version ?? 3
  return [
    `${c.name} emotion cutout portrait, ${c.role}.`,
    `Outfit and colors: ${c.outfit}.`,
    c.identityLock,
    `EXPRESSION & POSE ONLY (outfit unchanged from affinity-1): ${emotionPrompt}`,
    version >= 3 ? CUTOUT_RENDER_STYLE : legacyEmotionCutoutStyle(),
  ].join(', ')
}

function legacyEmotionCutoutStyle() {
  return [
    'MATCH EXACT RENDERING of companion-etna-affinity-01-scene-originale-v1 and Talia affinity-1',
    'modern IDLE Isekai Chill mobile gacha portrait, soft painterly anime shading with smooth gradients',
    'NOT chibi NOT super-deformed NOT Disgaea cel-shading NOT flat cartoon NOT semi-realistic 3D',
    'standard young-adult gacha proportions head-to-body ratio about 1:6',
    CUTOUT_BG,
    'no text, no watermark',
  ].join(', ')
}

export const EMOTION_CUTOUT_STYLE = legacyEmotionCutoutStyle()

export function cutoutPrompt(companionId, emotionPrompt, options = {}) {
  if (DISAGREA_COMPANIONS[companionId]) {
    return disagreaCutoutPrompt(companionId, emotionPrompt, options)
  }
  return villageCutoutPrompt(companionId, emotionPrompt, options)
}

export const FULL_BODY =
  'FULL BODY head to toe, both feet visible, centered vertical composition, single character only'

export const CHIBI_STYLE = [
  'MATCH chibi mascot rendering of Talia companion chibi and Moussprout myrion chibi from IDLE Isekai Chill',
  'super-deformed SD proportions large round head tiny cute body head-to-body about 1:2',
  'soft painterly anime shading, big expressive eyes with highlights, clean thin lineart',
  'full body head to toe both feet visible centered vertical composition single character only',
  'friendly welcoming pose, cheerful mascot energy',
  CUTOUT_BG,
  'no text, no watermark',
].join(', ')

export const CHIBI_AFFINITY_COLOR_LOCK = {
  kael: 'MUST have light blue messy hair and purple eyes exactly like affinity-1 portrait',
  noa: 'MUST have bright pink hair in pigtails and purple eyes exactly like affinity-1 portrait',
  elwen: 'MUST have long golden blonde hair, pointed elf ears and green eyes exactly like affinity-1 portrait',
  maeve: 'MUST have vibrant orange-red wavy hair and golden amber eyes exactly like affinity-1 portrait',
  sora: 'MUST be kitsune fox-girl with blonde fox ears, fluffy orange-blonde tail, blonde hair and amber eyes exactly like affinity-1 portrait',
  asha: 'MUST have long bright cyan light-blue hair and blue eyes exactly like affinity-1 portrait',
}

export function villageChibiPrompt(companionId) {
  const c = VILLAGE_COMPANIONS[companionId]
  const colorLock = CHIBI_AFFINITY_COLOR_LOCK[companionId]
  return [
    `${c.name} chibi mascot companion, ${c.role}`,
    `ICONIC outfit hair and colors: ${c.outfit}`,
    colorLock ?? 'hair and eye colors MUST match companion affinity-1 portrait exactly',
    CHIBI_STYLE,
  ].join(', ')
}

export const VILLAGE_CHIBI_IDS = Object.keys(VILLAGE_COMPANIONS).filter((id) => id !== 'talia')

export const ALL_CUTOUT_COMPANION_IDS = [
  ...Object.keys(VILLAGE_COMPANIONS),
  ...Object.keys(DISAGREA_COMPANIONS),
]
