/** Briefs IA pour le pipeline portrait en deux temps : cutout puis background. */

export type CompanionPortraitLevel = 1 | 2 | 3 | 4 | 5

export type CompanionPortraitVariant = 'primary' | 'soft' | 'perfect'

export type CompanionPortraitBrief = {
  cutout: string
  background: string
  /** Si l'IA refuse le primary — regénérer avec softFallback. */
  softFallback?: { cutout: string; background: string }
  /** Niveau 5 seulement — si intime refusée : version parfaite (tenue identique au 4). */
  perfectFallback?: { cutout: string; background: string }
}

const BASE_CUTOUT_STYLE =
  'anime gacha mobile game portrait, soft pastel colors, clean lineart, adult character, no text, no watermark'

const BASE_BACKGROUND_STYLE =
  'anime gacha mobile game environment illustration, soft colors, atmospheric lighting, no text, no watermark'

const MATURE_LIMITS =
  'adult suggestive only — NO explicit nudity, NO nipples, NO genitals, NO sex acts, NO minors'

const LEVEL_CUTOUT_NOTES: Record<CompanionPortraitLevel, string> = {
  1: 'travel/work outfit, curious warm expression, upper body or three-quarter portrait',
  2: 'date outfit, playful shy smile, restrained romantic gestures, pastel palette feel',
  3: 'elegant lighter outfit non-explicit, vulnerable calm expression, suggestive but respectful framing',
  4: [
    'MUST feel clearly more intimate and personal than level 3',
    'private night moment just for the player, soft eye contact, relaxed posture',
    'silk robe or thin chemise, bare shoulders and collarbones OK, legs partly visible OK',
    'sensual but tasteful — chemise slipping slightly off one shoulder, holding robe closed',
    MATURE_LIMITS,
  ].join(', '),
  5: [
    'MUST escalate intimacy beyond level 4 — closer, more vulnerable, more personal',
    'peak emotional bond, half-lidded tender gaze, blush, breathless calm after closeness',
    'nightwear or chemise more revealing than level 4 — thinner fabric, more skin (back, thighs, décolleté)',
    'still NO explicit nudity — use sheets, hair, hands, shadows for modesty',
    'same private relationship context as level 4, not a new public scene',
    MATURE_LIMITS,
  ].join(', '),
}

const LEVEL_BACKGROUND_NOTES: Record<CompanionPortraitLevel, string> = {
  1: 'workplace first meeting scene, welcoming daylight, decor fills frame',
  2: 'romantic date location, soft warm lights, cozy public-safe atmosphere',
  3: 'calm intimate interior, moonlit or dim elegant room, boudoir mood non-explicit',
  4: [
    'private bedroom or boudoir at night, candlelight and warm shadows',
    'personal details — rumpled sheets, single glass of wine, discarded day clothes',
    'feels like a space only shared with someone trusted',
  ].join(', '),
  5: [
    'continuation of level 4 intimacy — same bedroom or adjoining balcony at night',
    'more enveloping atmosphere than level 4 — rose petals, steam from bath, moon through curtains',
    'even more personal props — two cups, paired slippers, shared blanket',
  ].join(', '),
}

/** Regénération si refus contenu — paliers 4–5 moins suggestifs mais toujours romantiques. */
const SOFT_CUTOUT: Partial<Record<CompanionPortraitLevel, string>> = {
  4: [
    'soft romantic mode — elegant fully-covered nightgown or satin pajama set',
    'warm smile, less skin, tender mood not sensual, still more personal than level 3',
    'sitting on bed edge or window seat, cozy not provocative',
    MATURE_LIMITS,
  ].join(', '),
  5: [
    'soft romantic mode — same emotional peak but modest outfit (long chemise, cardigan, wrapped in blanket)',
    'joyful serene expression, golden hour or moonlight glow on face',
    'feels like "best night together" without revealing body',
    MATURE_LIMITS,
  ].join(', '),
}

const SOFT_BACKGROUND: Partial<Record<CompanionPortraitLevel, string>> = {
  4: 'cozy bedroom with fairy lights, warm blankets, safe romantic atmosphere, no provocative props',
  5: 'romantic terrace or bedroom with soft moonlight, flowers, gentle not steamy mood',
}

/**
 * Niveau 5 — si intime refusée même en soft :
 * version parfaite, hyper détaillée, MÊME tenue que le palier 4, le plus dénudé autorisé.
 */
const PERFECT_LEVEL_5_CUTOUT = [
  'PERFECT MASTERPIECE PORTRAIT — maximum illustration quality and fine detail',
  'IDENTICAL outfit and styling to affinity level 4 (same chemise/robe design, same colors, same accessories)',
  'push suggestive limit WITHOUT explicit nudity — same garment as level 4 but rendered with more realism',
  'fabric folds, lace trim, skin texture, hair strands, eye highlights, subtle sweat or candle glow on skin',
  'most revealing allowed: deep décolleté, bare shoulders, bare legs to mid-thigh, garment slightly displaced by pose',
  'cover sensitive areas with pose, fabric, hair, or shadow — never explicit',
  'expression of complete trust and beauty — the "ideal version" of the level 4 look',
  MATURE_LIMITS,
].join(', ')

const PERFECT_LEVEL_5_BACKGROUND = [
  'same location family as level 4 background but rendered as ultra-detailed masterpiece',
  'rich textures, bokeh candles, every prop crisp — the perfect intimate setting',
  'EMPTY clear zone in lower-middle 55% for character overlay',
].join(', ')

/** Identité visuelle — miroir de scripts/assets/data.mjs (id, name, role, accent). */
export const COMPANION_VISUAL_IDENTITY: Record<
  string,
  { name: string; role: string; place: string; mood: string; accent: string }
> = {
  lyra: { name: 'Lyra', role: 'Mage apprentie', place: 'la bibliotheque', mood: 'nuit etoilee', accent: '#8b6cf8' },
  maeve: { name: 'Maeve', role: 'Marchande nomade', place: 'la route des lanternes', mood: 'boudoir marchand', accent: '#e07a3a' },
  seren: { name: 'Seren', role: 'Chevaliere paisible', place: 'la place du village', mood: 'chambre aux bougies', accent: '#9eb0c9' },
  nami: { name: 'Nami', role: 'Cuisiniere solaire', place: 'la cuisine commune', mood: 'terrasse nocturne', accent: '#ff7a62' },
  iris: { name: 'Iris', role: 'Herboriste reveuse', place: 'le jardin des brumes', mood: 'serre au clair de lune', accent: '#6fd4a0' },
  kael: { name: 'Kael', role: 'Barde androgyne', place: 'le theatre', mood: 'loge privee', accent: '#7080e8' },
  runa: { name: 'Runa', role: 'Forgeronne douce', place: "l'atelier des rubans", mood: 'atelier tamise', accent: '#c07058' },
  solene: { name: 'Solene', role: 'Pretresse lunaire', place: 'la source claire', mood: 'sanctuaire nocturne', accent: '#e8c060' },
  talia: { name: 'Talia', role: 'Exploratrice rieuse', place: 'la lisiere de la foret', mood: 'camp sous les etoiles', accent: '#b88848' },
  mira: { name: 'Mira', role: 'Tailleur de rubans', place: "l'atelier textile", mood: 'boudoir de velours', accent: '#e878b8' },
  asha: { name: 'Asha', role: 'Gardienne des eaux', place: 'la cascade cachee', mood: 'bain thermal voile', accent: '#48b8d8' },
  elwen: { name: 'Elwen', role: 'Archiviste feerique', place: 'les archives feeriques', mood: 'alcove silencieuse', accent: '#98c858' },
  noa: { name: 'Noa', role: 'Alchimiste curieuse', place: 'le laboratoire', mood: 'observatoire prive', accent: '#68a8f0' },
  sora: { name: 'Sora', role: 'Dresseuse lunaire', place: 'la ferme lunaire', mood: 'grenier douillet', accent: '#f0a848' },
  zelie: { name: 'Zelie', role: 'Duchesse en visite', place: 'le salon des invites', mood: 'suite aux rideaux sombres', accent: '#b858c0' },
}

function cutoutBrief(
  companionId: string,
  level: CompanionPortraitLevel,
  variant: CompanionPortraitVariant = 'primary',
): string {
  const identity = COMPANION_VISUAL_IDENTITY[companionId]
  const name = identity?.name ?? companionId
  const role = identity?.role ?? 'compagnon du village'

  let notes = LEVEL_CUTOUT_NOTES[level]
  if (variant === 'soft' && SOFT_CUTOUT[level]) notes = SOFT_CUTOUT[level]!
  if (variant === 'perfect' && level === 5) notes = PERFECT_LEVEL_5_CUTOUT
  if (level === 5 && variant === 'primary') {
    notes += ', reference level 4 outfit as baseline then reveal slightly more within policy'
  }

  return [
    `${name}, ${role}, affinity level ${level}${variant !== 'primary' ? ` (${variant} variant)` : ''}`,
    notes,
    'CHARACTER CUTOUT ONLY — no background scenery, no floor, no props behind character',
    'full or upper body portrait facing viewer, centered composition',
    'export on plain white or light grey background OR true alpha PNG after cutout',
    'preserve hair strands, accessories, outfit details',
    BASE_CUTOUT_STYLE,
  ].join(', ')
}

function backgroundBrief(
  companionId: string,
  level: CompanionPortraitLevel,
  variant: CompanionPortraitVariant = 'primary',
): string {
  const identity = COMPANION_VISUAL_IDENTITY[companionId]
  const place = identity?.place ?? 'cozy fantasy village interior'
  const mood = identity?.mood ?? 'warm atmosphere'

  let notes = LEVEL_BACKGROUND_NOTES[level]
  if (variant === 'soft' && SOFT_BACKGROUND[level]) notes = SOFT_BACKGROUND[level]!
  if (variant === 'perfect' && level === 5) notes = PERFECT_LEVEL_5_BACKGROUND

  return [
    `Anime gacha portrait background 3:4 aspect ratio, ${place}`,
    notes,
    `Ambiance ${mood}`,
    'EMPTY clear zone in lower-middle 55% for character overlay — no people, no creatures',
    'environment and props only, rich depth, cinematic framing',
    BASE_BACKGROUND_STYLE,
  ].join(', ')
}

/** Ordre de génération recommandé pour les paliers 4–5. */
export const MATURE_TIER_GENERATION_ORDER: CompanionPortraitLevel[] = [4, 5]

export const MATURE_VARIANT_ORDER: CompanionPortraitVariant[] = ['primary', 'soft', 'perfect']

export function companionPortraitBrief(
  companionId: string,
  level: CompanionPortraitLevel,
  variant: CompanionPortraitVariant = 'primary',
): CompanionPortraitBrief {
  const brief: CompanionPortraitBrief = {
    cutout: cutoutBrief(companionId, level, variant),
    background: backgroundBrief(companionId, level, variant),
  }

  if (level >= 4 && variant === 'primary') {
    brief.softFallback = {
      cutout: cutoutBrief(companionId, level, 'soft'),
      background: backgroundBrief(companionId, level, 'soft'),
    }
  }

  if (level === 5 && variant === 'primary') {
    brief.perfectFallback = {
      cutout: cutoutBrief(companionId, 5, 'perfect'),
      background: backgroundBrief(companionId, 5, 'perfect'),
    }
  }

  return brief
}

/** Toutes les variantes utiles pour un palier (primary + fallbacks si 4–5). */
export function companionPortraitBriefVariants(
  companionId: string,
  level: CompanionPortraitLevel,
): Array<{ variant: CompanionPortraitVariant; cutout: string; background: string }> {
  const primary = companionPortraitBrief(companionId, level, 'primary')
  const rows: Array<{ variant: CompanionPortraitVariant; cutout: string; background: string }> = [
    { variant: 'primary', cutout: primary.cutout, background: primary.background },
  ]
  if (primary.softFallback) {
    rows.push({ variant: 'soft', ...primary.softFallback })
  }
  if (primary.perfectFallback) {
    rows.push({ variant: 'perfect', ...primary.perfectFallback })
  }
  return rows
}

export const listCompanionPortraitBriefs = () =>
  Object.keys(COMPANION_VISUAL_IDENTITY).flatMap((companionId) =>
    ([1, 2, 3, 4, 5] as CompanionPortraitLevel[]).flatMap((level) =>
      companionPortraitBriefVariants(companionId, level).map((row) => ({
        companionId,
        level,
        variant: row.variant,
        cutout: row.cutout,
        background: row.background,
        cutoutPath: `public/assets/companions/${companionId}/cutout-${level}.png`,
        backgroundPath: `public/assets/companions/${companionId}/background-${level}.png`,
      })),
    ),
  )
