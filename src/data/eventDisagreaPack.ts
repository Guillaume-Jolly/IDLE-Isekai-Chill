/**
 * Event Disagrea — compagnons invités + Myrions associés.
 *
 * RÈGLE CRITIQUE : les refs Disgaea servent à l'IDENTITÉ (silhouette, couleurs, archétype),
 * PAS au style de rendu. Le rendu doit matcher IDLE Isekai Chill (gacha cozy, pastel doux).
 */

export type DisagreaCompanionId = 'etna' | 'flonne' | 'laharl' | 'pleinair'

export type DisagreaMyrionDef = {
  id: string
  name: string
  emoji: string
  ownerId: DisagreaCompanionId
  rarity: 'N' | 'SR' | 'SSR' | 'UR'
  cutoutHint: string
  chibiHint: string
}

export const DISAGREA_BIOME = {
  id: 'disagrea-event',
  name: 'Faille Disagrea',
  emoji: '🔥',
  fallbackGradient: 'linear-gradient(180deg, #2a1020 0%, #8d2a56 48%, #ffd56a 100%)',
} as const

/** Fond détourage — couleur plate unique, sans dégradé ni ombre au sol. */
export const CUTOUT_BACKGROUND = {
  hex: '#CFCFCF',
  prompt:
    'BACKGROUND MUST BE single flat solid matte color exactly #CFCFCF light gray, uniform everywhere, no gradient, no vignette, no floor, no cast shadow on ground, no scenery, no texture',
}

/** Ancres visuelles du JEU (style à copier). */
export const APP_STYLE_ANCHORS = {
  /** Compagnon event validé — référence de rendu prioritaire. */
  companionRenderApproved: 'public/assets/companions/etna/affinity-1.png',
  companionRender: 'public/assets/companions/talia/affinity-1.png',
  myrionFull: 'public/assets/minigames/capture/myrions/cutout/moussprout.png',
  myrionFullApproved: 'public/assets/minigames/capture/myrions/cutout/prinnettenoire.png',
  myrionChibi: 'public/assets/minigames/dressage/myrions/chibi/moussprout.png',
  eventBackgroundMood: 'public/assets/companions/flonne/affinity-1.png',
}

/** Mob légendaire LR — fusion des 4 compagnons event. */
export const DISAGREA_LEGENDARY_MYRION = {
  id: 'chimerelle',
  name: 'Chimerelle',
  emoji: '✨',
  rarity: 'LR' as const,
  cutoutHint:
    'Legendary LR majestic proud chimera guardian: spread magenta bat wings, white-gold halo, golden horned crown, crimson royal scarf-cape, red bow crest, bunny ear tufts, heart tail, ice-blue fur collar, floating gold LR crystals — regal heroic stance chest out, fusion of Etna Flonne Laharl Pleinair themes',
  chibiHint: 'chibi chimerelle proud regal pose, crown halo scarf bow, LR gold aura',
}

/**
 * Style IDLE Isekai Chill — PAS le cel-shading Disgaea.
 * - Illustration gacha mobile moderne, lumière douce, bloom léger
 * - Contours propres mais shading painterly / dégradés doux (comme Talia)
 * - Proportions légèrement réalistes gacha (pas super-chibi sauf mode chibi)
 * - Tenues fantasy isekai cozy : cuir, rubans, capes, détails aventurier/ village
 * - Palette pastel chaude même pour démons/anges
 */
export const APP_RENDER_STYLE = [
  'IDLE Isekai Chill mobile gacha illustration style',
  'soft painterly anime shading with gentle gradients NOT harsh Disgaea cel-shading',
  'warm cozy fantasy isekai mood, pastel-leaning saturated colors',
  'clean thin lineart, subtle bloom on highlights, detailed fabric and hair rendering',
  'match visual quality of companion Talia and Myrion Moussprout in this game',
  'ORIGINAL outfit design inspired by character archetype — do NOT copy Disgaea costume pixel-for-pixel',
  'no text, no watermark',
].join(', ')

const FULL_BODY =
  'FULL BODY head to toe, both feet visible, centered vertical composition, single character only'

/** ADN identitaire — motifs à conserver, pas le dessin source. */
export const DISAGREA_COMPANIONS: Record<
  DisagreaCompanionId,
  {
    displayName: string
    /** Ref Disgaea — identité uniquement, ne pas imiter le trait. */
    identityRef: string
    dna: string
    palette: string
    levels: Record<1 | 2 | 3 | 4 | 5, string>
    chibi: string
  }
> = {
  etna: {
    displayName: 'Etna',
    identityRef: 'old_assets/event-disagrea/sources/references/Etna/D1_Etna.webp',
    dna: 'demon vassal girl archetype, magenta twin ponytails, red eyes, tiny bat wings, heart-tip tail, mischievous energy',
    palette: 'magenta hair, black and plum outfit accents, gold buckles, soft purple wing membranes',
    levels: {
      1: 'ICONIC BASE OUTFIT: black strapless top, black shorts, white belt, fingerless gloves, red thigh highs, oversized black boots, choker, skull earring — confident smirk, standing pose',
      2: 'SAME outfit as level 1, NO extra layers — flirt pose hand on hip, playful wink, slightly closer body language',
      3: 'SAME outfit as level 1, NO dress or jacket added — softer vulnerable smile, leaning pose, more personal eye contact',
      4: 'SAME outfit pieces as level 1, NO robe added — intimate pose one strap slightly slipped tasteful, trusting gaze, blush',
      5: 'SAME outfit as level 1 and 4, masterpiece detail — peak bond pose most revealing within same clothes, NO new garments, NO explicit nudity',
    },
    chibi: 'round Palworld-style chibi demon girl mascot, huge head tiny body, bat wing nubs, heart tail, oversized boots simplified, cute smirk',
  },
  flonne: {
    displayName: 'Flonne',
    identityRef: 'old_assets/event-disagrea/sources/references/Flonne/D1_Flonne.webp',
    dna: 'angelic healer archetype, long blonde hair with pink highlights, blue eyes, ribbon bows, pure cheerful aura',
    palette: 'white, sky blue, soft pink, gold cross motif',
    levels: {
      1: 'cozy isekai healer outfit: white and blue layered tunic with ribbons, practical boots, herb pouch, bright welcoming smile',
      2: 'date dress pastel white-blue with ribbons and light shawl, shy blush, flower basket',
      3: 'elegant angelic gown light and flowing non-explicit, serene expression, moonlit soft shading',
      4: 'intimate chemise white blue trim, bare shoulders, sitting pose suggested, tasteful warm lighting on figure only',
      5: 'same chemise as level 4, masterpiece detail, slightly more revealing tasteful, gentle smile, no explicit nudity',
    },
    chibi: 'round chibi angel healer mascot, giant blue bow, tiny wing nubs, pleated dress, open happy smile, Moussprout-like cuteness',
  },
  laharl: {
    displayName: 'Laharl',
    identityRef: 'old_assets/event-disagrea/sources/references/Laharl/DRPG_Laharl_Artwork_1.webp',
    dna: 'YOUNG MALE demon overlord boy, bright BLUE spiky hair with two long antenna ahoge strands, red eyes, pointed ears, arrogant charisma — NOT female',
    palette: 'blue hair, crimson red scarf, red pants, black belt gold buckle, dark purple boots',
    levels: {
      1: 'ICONIC BASE OUTFIT male: shirtless bare chest, large flowing red scarf, red pants, black belt gold buckle, black fingerless gloves gold cross, chunky purple-red boots — arms crossed proud smirk',
      2: 'SAME male outfit level 1, NO jacket or coat added — softer smile, hand on scarf, relaxed confident pose',
      3: 'SAME shirtless scarf pants outfit, NO formal gown — regal calm pose looking away then back, complicit gaze',
      4: 'SAME outfit pieces NO robe — scarf loosened intimate, softer private expression male, tasteful NO explicit',
      5: 'SAME outfit as 1 and 4 male, masterpiece — peak trust vulnerable smirk same clothes most personal pose, NO new garments',
    },
    chibi: 'round chibi demon BOY overlord mascot, blue spiky hair antenna, huge red scarf, proud pout, male child demon lord',
  },
  pleinair: {
    displayName: 'Pleinair',
    /** Backlog : docs/BACKLOG.md — Event Disagrea / Pleinair (L2–5 proximité enfant, pas intimité adulte). */
    identityRef: 'old_assets/event-disagrea/sources/references/Pleinair/PleinairMW.webp',
    dna: 'quiet kuudere demon girl archetype, short light blue hair, red eyes, oversized red bow, bunny motif',
    palette: 'ice blue hair, white dress, red bow and trim, pastel bunny plush',
    levels: {
      1: 'cozy isekai quiet mage outfit: white sleeveless dress with red accents, arm warmers, holding soft bunny plush, blank gentle expression',
      2: 'soft cardigan over dress pastel tones, slight smile, bunny plush under arm',
      3: 'light nightdress white and red non-explicit, calm vulnerable look',
      4: 'intimate pastel chemise, bunny plush hugged to chest, bare shoulders OK, tasteful',
      5: 'same chemise as level 4, masterpiece detail, rare gentle smile, tasteful, no explicit nudity',
    },
    chibi: 'round chibi quiet girl mascot, giant red bow, tiny bunny plush, blank cute eyes, Moussprout-like roundness',
  },
}

export const DISAGREA_MYRIONS: DisagreaMyrionDef[] = [
  {
    id: 'prinnettenoire',
    name: 'Prinnettenoire',
    emoji: '🐧',
    ownerId: 'etna',
    rarity: 'N',
    cutoutHint:
      'ORIGINAL Palworld-inspired familiar: round puffbird demon pet, matte black-purple fluff, tiny bat wings, orange beak pouch, cute clumsy stance — NOT a Prinny copy',
    chibiHint: 'tiny round chibi puffbird demon, mini bat wings, one eye closed smile',
  },
  {
    id: 'chirodemon',
    name: 'Chirodémon',
    emoji: '🦇',
    ownerId: 'etna',
    rarity: 'SR',
    cutoutHint:
      'ORIGINAL cute bat familiar, round body soft fur, heart-shaped tail tip, big glossy eyes, purple and magenta palette like Moussprout style',
    chibiHint: 'round chibi bat blob with heart tail',
  },
  {
    id: 'cranexplose',
    name: 'Crânexplose',
    emoji: '💀',
    ownerId: 'etna',
    rarity: 'SSR',
    cutoutHint:
      'ORIGINAL skull-spark imp familiar, round floating body, soft purple flame wisps, mischievous cute face not scary',
    chibiHint: 'chibi round skull imp with tiny purple sparkles',
  },
  {
    id: 'prinnetteblanche',
    name: 'Prinnetteblanche',
    emoji: '🕊️',
    ownerId: 'flonne',
    rarity: 'N',
    cutoutHint:
      'ORIGINAL angel puff familiar, white fluffy round bird-like body, tiny halo ring, blue ribbon, Moussprout-level cuteness',
    chibiHint: 'chibi white puff angel with halo nub',
  },
  {
    id: 'cupichoc',
    name: 'Cupichoc',
    emoji: '💗',
    ownerId: 'flonne',
    rarity: 'SR',
    cutoutHint:
      'ORIGINAL heart-sprite familiar, round pastel pink body, small wings, blush marks, floating full body',
    chibiHint: 'tiny heart-shaped chibi mascot with wing nubs',
  },
  {
    id: 'palabielle',
    name: 'Palabielle',
    emoji: '☁️',
    ownerId: 'flonne',
    rarity: 'SSR',
    cutoutHint:
      'ORIGINAL cloud bell familiar, soft white-blue round cloud body, tiny golden bell collar, gentle smile',
    chibiHint: 'chibi cloud with bell collar',
  },
  {
    id: 'chiroscarf',
    name: 'Chiroscarf',
    emoji: '🧣',
    ownerId: 'laharl',
    rarity: 'N',
    cutoutHint:
      'ORIGINAL bat familiar wrapped in oversized red scarf, round fluffy body, proud expression, soft shading',
    chibiHint: 'chibi bat with scarf bigger than body',
  },
  {
    id: 'flammecaille',
    name: 'Flammécaille',
    emoji: '🔥',
    ownerId: 'laharl',
    rarity: 'SR',
    cutoutHint:
      'ORIGINAL fire imp familiar, round orange-red body, tiny crown nub, warm glow, cute sharp grin',
    chibiHint: 'chibi fire round imp with mini crown',
  },
  {
    id: 'royalet',
    name: 'Royalet',
    emoji: '👑',
    ownerId: 'laharl',
    rarity: 'SSR',
    cutoutHint:
      'ORIGINAL royal imp familiar, round purple body, gold crown, tiny cape, imposing but adorable',
    chibiHint: 'chibi crown imp with flutter cape',
  },
  {
    id: 'lapichon',
    name: 'Lapichon',
    emoji: '🐰',
    ownerId: 'pleinair',
    rarity: 'N',
    cutoutHint:
      'ORIGINAL bunny familiar like living plush, round white body, red inner ears, stitched mouth X, soft pastel shading Moussprout style',
    chibiHint: 'chibi round bunny plush pet',
  },
  {
    id: 'noeudino',
    name: 'Nœudino',
    emoji: '🎀',
    ownerId: 'pleinair',
    rarity: 'SR',
    cutoutHint:
      'ORIGINAL ribbon spirit familiar, living red bow shape with tiny sleepy face in center, floating round form',
    chibiHint: 'chibi living red bow with dot eyes',
  },
  {
    id: 'dormille',
    name: 'Dormille',
    emoji: '💤',
    ownerId: 'pleinair',
    rarity: 'SSR',
    cutoutHint:
      'ORIGINAL sleepy blob familiar, round pastel blue-pink gradient body, Zzz bubble, soft fuzzy texture',
    chibiHint: 'tiny sleeping round blob with nightcap',
  },
  {
    id: 'explosia',
    name: 'Explosia',
    emoji: '💥',
    ownerId: 'etna',
    rarity: 'UR',
    cutoutHint:
      'UR ultra-rare evolved demon familiar: round majestic black-purple body, golden horn nubs, purple flame aura wings, skull gem forehead, imposing cute expression, premium gold trim accents',
    chibiHint: 'chibi UR demon familiar golden horns purple flames',
  },
  {
    id: 'archanielle',
    name: 'Archanielle',
    emoji: '🪽',
    ownerId: 'flonne',
    rarity: 'UR',
    cutoutHint:
      'UR ultra-rare angel familiar: radiant white-gold round body, large soft angel wings, golden halo with cross light, blue ribbon crown, serene glowing smile, premium sparkle aura',
    chibiHint: 'chibi UR angel puff radiant wings',
  },
  {
    id: 'supremarc',
    name: 'Suprémarc',
    emoji: '👑',
    ownerId: 'laharl',
    rarity: 'UR',
    cutoutHint:
      'UR ultra-rare overlord imp: round purple body, massive golden crown, flowing crimson royal cape, red aura glow, regal proud cute face, premium metallic gold details',
    chibiHint: 'chibi UR crown imp huge cape',
  },
  {
    id: 'dreamille',
    name: 'Dreamille',
    emoji: '🌙',
    ownerId: 'pleinair',
    rarity: 'UR',
    cutoutHint:
      'UR ultra-rare dream blob familiar: round pastel blue-pink cosmic gradient body, crescent moon mark, floating Zzz stardust, bunny ear nubs, red bow, ethereal soft glow aura',
    chibiHint: 'chibi UR dream blob moon and stars',
  },
]

function buildPrompt(parts: string[]) {
  return [...parts, FULL_BODY, CUTOUT_BACKGROUND.prompt, APP_RENDER_STYLE].join(', ')
}

export function disagreaCutoutPrompt(companionId: DisagreaCompanionId, level: 1 | 2 | 3 | 4 | 5) {
  const c = DISAGREA_COMPANIONS[companionId]
  return buildPrompt([
    `${c.displayName} guest companion for cozy isekai village`,
    `Character DNA (motifs only, redesign outfit): ${c.dna}`,
    `Color palette: ${c.palette}`,
    `Affinity level ${level}: ${c.levels[level]}`,
    'Translate archetype into IDLE Isekai Chill original costume — NOT a Disgaea artwork trace',
  ])
}

export function disagreaChibiPrompt(companionId: DisagreaCompanionId) {
  const c = DISAGREA_COMPANIONS[companionId]
  return buildPrompt([
    `${c.displayName} chibi mascot`,
    c.chibi,
    'match Moussprout chibi roundness and soft shading from this game',
  ])
}

export function disagreaMyrionCutoutPrompt(myrionId: string) {
  const m = DISAGREA_MYRIONS.find((row) => row.id === myrionId)
  if (!m) throw new Error(`Unknown myrion ${myrionId}`)
  return buildPrompt([
    m.name,
    m.cutoutHint,
    'Palworld-inspired cute fantasy familiar for IDLE Isekai Chill',
  ])
}

export function disagreaMyrionChibiPrompt(myrionId: string) {
  const m = DISAGREA_MYRIONS.find((row) => row.id === myrionId)
  if (!m) throw new Error(`Unknown myrion ${myrionId}`)
  return buildPrompt([m.name, m.chibiHint, 'Moussprout-style chibi familiar'])
}

/** Chemins style anchor absolus depuis la racine repo. */
export function disagreaStyleReferencePaths(repoRoot: string) {
  return {
    companionStyle: `${repoRoot}/${APP_STYLE_ANCHORS.companionRender}`,
    myrionFullStyle: `${repoRoot}/${APP_STYLE_ANCHORS.myrionFull}`,
    myrionChibiStyle: `${repoRoot}/${APP_STYLE_ANCHORS.myrionChibi}`,
  }
}

/** Chemins runtime (public/) — staging IA reste sous assets/event-disagrea/. */
export const DISAGREA_ASSET_PATHS = {
  companionAffinity: (id: DisagreaCompanionId, level: number) =>
    `assets/companions/${id}/affinity-${level}.png`,
  companionAffinityNsfw: (id: DisagreaCompanionId) =>
    `assets/companions/${id}/affinity-4-nsfw.png`,
  companionChibi: (id: DisagreaCompanionId) => `assets/companions/${id}/chibi.png`,
  myrionCutout: (id: string) => `assets/minigames/capture/myrions/cutout/${id}.png`,
  myrionChibi: (id: string) => `assets/minigames/dressage/myrions/chibi/${id}.png`,
  huntBackgroundPortrait: 'assets/minigames/capture/biomes/disagrea-event-portrait.png',
  huntBackgroundWide: 'assets/minigames/capture/biomes/disagrea-event.png',
  dressageBackgroundPortrait: 'assets/minigames/dressage/enclosures/disagrea-event-portrait.png',
  dressageBackgroundWide: 'assets/minigames/dressage/enclosures/disagrea-event.png',
}
