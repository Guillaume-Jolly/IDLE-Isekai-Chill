/**
 * Regroupe inputs + outputs + brouillons Event Disagrea dans catalog/
 * pour tri manuel. N'exécute pas de détourage ni ne modifie generated/.
 *
 * Usage: node scripts/organize-disagrea-catalog.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const eventRoot = join(repoRoot, 'assets', 'event-disagrea')
const cursorAssets = join(
  process.env.USERPROFILE ?? '',
  '.cursor',
  'projects',
  'c-Dev-Project-IDLE-Isekai-Chill',
  'assets',
)
const catalogRoot = join(eventRoot, 'catalog')

const COMPANION_SLUGS = {
  etna: {
    1: 'tenue-iconique-pose-confiante',
    2: 'meme-tenue-pose-flirt',
    3: 'meme-tenue-pose-vulnerable',
    4: 'meme-tenue-pose-intime-soft',
    5: 'meme-tenue-pose-peak-bond',
  },
  flonne: {
    1: 'tenue-soigneur-accueil',
    2: 'robe-rendez-vous-shy',
    3: 'robe-angelique-serene',
    4: 'chemise-intime',
    5: 'chemise-peak-bond-masterpiece',
  },
  laharl: {
    1: 'torse-nu-echarpe-pose-fiere-homme',
    2: 'meme-tenue-pose-detendue-homme',
    3: 'meme-tenue-pose-regal-homme',
    4: 'meme-tenue-pose-intime-soft-homme',
    5: 'meme-tenue-pose-peak-bond-homme',
  },
  pleinair: {
    1: 'robe-blanche-lapin-accueil',
    2: 'cardigan-rendez-vous',
    3: 'nuisette-calme',
    4: 'chemise-intime-lapin',
    5: 'chemise-peak-bond-masterpiece',
  },
}

const MYRIONS = [
  { id: 'prinnettenoire', name: 'prinnettenoire', owner: 'etna', rarity: 'N' },
  { id: 'chirodemon', name: 'chirodemon', owner: 'etna', rarity: 'SR' },
  { id: 'cranexplose', name: 'cranexplose', owner: 'etna', rarity: 'SSR' },
  { id: 'explosia', name: 'explosia', owner: 'etna', rarity: 'UR' },
  { id: 'prinnetteblanche', name: 'prinnetteblanche', owner: 'flonne', rarity: 'N' },
  { id: 'cupichoc', name: 'cupichoc', owner: 'flonne', rarity: 'SR' },
  { id: 'palabielle', name: 'palabielle', owner: 'flonne', rarity: 'SSR' },
  { id: 'archanielle', name: 'archanielle', owner: 'flonne', rarity: 'UR' },
  { id: 'chiroscarf', name: 'chiroscarf', owner: 'laharl', rarity: 'N' },
  { id: 'flammecaille', name: 'flammecaille', owner: 'laharl', rarity: 'SR' },
  { id: 'royalet', name: 'royalet', owner: 'laharl', rarity: 'SSR' },
  { id: 'supremarc', name: 'supremarc', owner: 'laharl', rarity: 'UR' },
  { id: 'lapichon', name: 'lapichon', owner: 'pleinair', rarity: 'N' },
  { id: 'noeudino', name: 'noeudino', owner: 'pleinair', rarity: 'SR' },
  { id: 'dormille', name: 'dormille', owner: 'pleinair', rarity: 'SSR' },
  { id: 'dreamille', name: 'dreamille', owner: 'pleinair', rarity: 'UR' },
]

const REF_RENAMES = {
  'D1_Etna.webp': 'ref-disgaea-etna-d1-identite.webp',
  'D2_Etna.webp': 'ref-disgaea-etna-d2-identite.webp',
  'DRPG_Etna_Artwork_1.webp': 'ref-disgaea-etna-drpg-artwork-identite.webp',
  'D1_Flonne.webp': 'ref-disgaea-flonne-d1-identite.webp',
  'D2_Fallen_Angel_Flonne.webp': 'ref-disgaea-flonne-d2-fallen-angel-identite.webp',
  'D4_Archangel_Flonne.webp': 'ref-disgaea-flonne-d4-archangel-identite.webp',
  'DRPG_Fallen_Angel_Flonne_Artwork_1.webp': 'ref-disgaea-flonne-drpg-fallen-artwork-identite.webp',
  'D1_Laharl.webp': 'ref-disgaea-laharl-d1-identite.webp',
  'DRPG_Laharl_Artwork_1.webp': 'ref-disgaea-laharl-drpg-artwork-homme-identite.webp',
  'DRPG_Girl_Laharl_Artwork_1.webp': 'ref-disgaea-laharl-drpg-girl-femme-a-eviter.webp',
  'Laharl2.webp': 'ref-disgaea-laharl-laharl2-identite.webp',
  'PleinairMW.webp': 'ref-disgaea-pleinair-mw-identite.webp',
}

let copied = 0
let skipped = 0

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function copyTo(src, dest) {
  if (!existsSync(src)) {
    skipped++
    return false
  }
  ensureDir(dirname(dest))
  copyFileSync(src, dest)
  copied++
  return true
}

function companionCutoutName(companion, level) {
  const slug = COMPANION_SLUGS[companion][level]
  const lv = String(level).padStart(2, '0')
  return `companion-${companion}-cutout-affinity-${lv}-${slug}-bg-cfcfcf.png`
}

function companionChibiName(companion) {
  return `companion-${companion}-chibi-miniature-bg-cfcfcf.png`
}

function myrionCutoutName(m) {
  return `myrion-${m.id}-cutout-rarity-${m.rarity}-proprietaire-${m.owner}-bg-cfcfcf.png`
}

function myrionChibiName(m) {
  return `myrion-${m.id}-chibi-rarity-${m.rarity}-proprietaire-${m.owner}-bg-cfcfcf.png`
}

// --- INPUTS : refs Disgaea ---
for (const [folder, companion] of [
  ['Etna', 'etna'],
  ['Flonne', 'flonne'],
  ['Laharl', 'laharl'],
  ['Pleinair', 'pleinair'],
]) {
  const srcDir = join(eventRoot, 'sources', 'references', folder)
  if (!existsSync(srcDir)) continue
  for (const file of readdirSync(srcDir)) {
    const destName = REF_RENAMES[file] ?? `ref-disgaea-${companion}-${file.toLowerCase()}`
    copyTo(join(srcDir, file), join(catalogRoot, 'inputs', 'references-disgaea', companion, destName))
  }
}

// --- INPUTS : style anchors jeu ---
const styleAnchors = [
  {
    src: join(repoRoot, 'public', 'assets', 'companions', 'talia', 'affinity-1.png'),
    dest: 'inputs/style-anchors-jeu/companion-talia-affinity-01-style-gacha-reference.png',
  },
  {
    src: join(repoRoot, 'public', 'assets', 'minigames', 'capture', 'myrions', 'cutout', 'moussprout.png'),
    dest: 'inputs/style-anchors-jeu/myrion-moussprout-cutout-style-reference.png',
  },
  {
    src: join(repoRoot, 'public', 'assets', 'minigames', 'dressage', 'myrions', 'chibi', 'moussprout.png'),
    dest: 'inputs/style-anchors-jeu/myrion-moussprout-chibi-style-reference.png',
  },
  {
    src: join(eventRoot, 'generated', 'companions', 'etna', 'cutout-1.png'),
    dest: 'inputs/style-anchors-jeu/companion-etna-cutout-affinity-01-style-approuve-reference.png',
  },
  {
    src: join(eventRoot, 'generated', 'myrions', 'cutout', 'prinnettenoire.png'),
    dest: 'inputs/style-anchors-jeu/myrion-prinnettenoire-cutout-style-approuve-reference.png',
  },
  {
    src: join(cursorAssets, 'source-talia-cutout.png'),
    dest: 'inputs/style-anchors-jeu/draft-companion-talia-cutout-source-generation.png',
  },
  {
    src: join(cursorAssets, 'source-talia-v2.png'),
    dest: 'inputs/style-anchors-jeu/draft-companion-talia-v2-source-generation.png',
  },
  {
    src: join(cursorAssets, 'source-talia-point-chibi.png'),
    dest: 'inputs/style-anchors-jeu/draft-companion-talia-chibi-source-generation.png',
  },
]
for (const { src, dest } of styleAnchors) {
  copyTo(src, join(catalogRoot, dest))
}

// --- INPUTS : backgrounds fournis ---
const bgAffinityMap = [
  ['Etna', 'etna'],
  ['Flonne', 'flonne'],
  ['Laharl', 'laharl'],
  ['Pleinair', 'pleinair'],
]
for (const [folder, slug] of bgAffinityMap) {
  const bgDir = join(eventRoot, 'backgrounds', 'affinity', folder)
  if (!existsSync(bgDir)) continue
  for (const file of readdirSync(bgDir)) {
    let destName = file
    if (file.includes('_01_03_mobile'))
      destName = `bg-affinity-${slug}-niveaux-01-03-mobile-portrait-sans-personnage.png`
    else if (file.includes('_01_03_pc'))
      destName = `bg-affinity-${slug}-niveaux-01-03-pc-wide-sans-personnage.png`
    else if (file.includes('_04_05_mobile'))
      destName = `bg-affinity-${slug}-niveaux-04-05-intime-mobile-portrait-sans-personnage.png`
    else if (file.includes('_04_05_pc'))
      destName = `bg-affinity-${slug}-niveaux-04-05-intime-pc-wide-sans-personnage.png`
    copyTo(join(bgDir, file), join(catalogRoot, 'inputs', 'backgrounds', 'affinity', slug, destName))
  }
}

const minigameBgs = [
  ['myrion_hunt_mobile.png', 'bg-minigame-chasse-myrions-mobile-portrait-sans-personnage.png'],
  ['myrion_hunt_pc.png', 'bg-minigame-chasse-myrions-pc-wide-sans-personnage.png'],
  [
    'myrion_training_enclosure_mobile.png',
    'bg-minigame-dressage-enclos-mobile-portrait-sans-personnage.png',
  ],
  [
    'myrion_training_enclosure_pc.png',
    'bg-minigame-dressage-enclos-pc-wide-sans-personnage.png',
  ],
]
for (const [srcFile, destName] of minigameBgs) {
  copyTo(
    join(eventRoot, 'backgrounds', 'minigame', srcFile),
    join(catalogRoot, 'inputs', 'backgrounds', 'minigame', destName),
  )
}

// --- OUTPUTS COURANTS (generated/ sélection actuelle pipeline) ---
for (const companion of Object.keys(COMPANION_SLUGS)) {
  for (let level = 1; level <= 5; level++) {
    copyTo(
      join(eventRoot, 'generated', 'companions', companion, `cutout-${level}.png`),
      join(
        catalogRoot,
        'outputs-courants',
        'companions',
        companion,
        companionCutoutName(companion, level),
      ),
    )
  }
  copyTo(
    join(eventRoot, 'generated', 'companions', companion, 'chibi.png'),
    join(catalogRoot, 'outputs-courants', 'companions', companion, companionChibiName(companion)),
  )
}

for (const m of MYRIONS) {
  copyTo(
    join(eventRoot, 'generated', 'myrions', 'cutout', `${m.id}.png`),
    join(catalogRoot, 'outputs-courants', 'myrions', m.owner, myrionCutoutName(m)),
  )
  copyTo(
    join(eventRoot, 'generated', 'myrions', 'chibi', `${m.id}.png`),
    join(catalogRoot, 'outputs-courants', 'myrions', m.owner, myrionChibiName(m)),
  )
}

copyTo(
  join(eventRoot, 'generated', 'myrions', 'cutout', 'chimerelle.png'),
  join(
    catalogRoot,
    'outputs-courants',
    'myrions',
    'legendary',
    'myrion-chimerelle-cutout-rarity-LR-fusion-4-univers-bg-cfcfcf.png',
  ),
)
copyTo(
  join(eventRoot, 'generated', 'myrions', 'chibi', 'chimerelle.png'),
  join(
    catalogRoot,
    'outputs-courants',
    'myrions',
    'legendary',
    'myrion-chimerelle-chibi-rarity-LR-fusion-4-univers-bg-cfcfcf.png',
  ),
)

// --- BROUILLONS (cursor temp — toutes versions intermédiaires) ---
function parseCompanionDraft(filename) {
  const chibi = filename.match(/^(etna|flonne|laharl|pleinair)-chibi(-v2)?\.png$/)
  if (chibi) {
    const [, companion, v2] = chibi
    const tag = v2 ? 'draft-v2' : 'draft-v1'
    const note = companion === 'laharl' && !v2 ? 'feminin-incorrect' : companion === 'laharl' && v2 ? 'masculin-corrige' : ''
    const suffix = note ? `${tag}-${note}` : tag
    return {
      companion,
      dest: join(
        catalogRoot,
        'brouillons-generation',
        'companions',
        companion,
        `companion-${companion}-chibi-miniature-${suffix}-bg-cfcfcf.png`,
      ),
    }
  }

  const cutout = filename.match(/^(etna|flonne|laharl|pleinair)-cutout-(\d)(-v2)?\.png$/)
  if (cutout) {
    const [, companion, levelStr, v2] = cutout
    const level = Number(levelStr)
    const slug = COMPANION_SLUGS[companion][level]
    const lv = levelStr.padStart(2, '0')
    let tag = v2 ? 'draft-v2' : 'draft-v1'
    if (companion === 'laharl' && !v2) tag += '-feminin-incorrect'
    if (companion === 'laharl' && v2) tag += '-masculin-corrige'
    if (companion === 'etna' && level === 1 && !v2) tag = 'draft-v1-style-approuve'
    return {
      companion,
      dest: join(
        catalogRoot,
        'brouillons-generation',
        'companions',
        companion,
        `companion-${companion}-cutout-affinity-${lv}-${slug}-${tag}-bg-cfcfcf.png`,
      ),
    }
  }
  return null
}

function parseMyrionDraft(filename) {
  const cutout = filename.match(/^([a-z]+)-cutout\.png$/)
  if (cutout) {
    const id = cutout[1]
    const m = MYRIONS.find((row) => row.id === id)
    if (m) {
      return join(
        catalogRoot,
        'brouillons-generation',
        'myrions',
        m.owner,
        myrionCutoutName(m).replace('-bg-cfcfcf', '-draft-generation-bg-cfcfcf'),
      )
    }
    if (id === 'chimerelle') {
      return join(
        catalogRoot,
        'brouillons-generation',
        'myrions',
        'legendary',
        'myrion-chimerelle-cutout-rarity-LR-fusion-draft-v1-bg-cfcfcf.png',
      )
    }
  }
  const chibi = filename.match(/^([a-z]+)-chibi\.png$/)
  if (chibi) {
    const id = chibi[1]
    const m = MYRIONS.find((row) => row.id === id)
    if (m) {
      return join(
        catalogRoot,
        'brouillons-generation',
        'myrions',
        m.owner,
        myrionChibiName(m).replace('-bg-cfcfcf', '-draft-generation-bg-cfcfcf'),
      )
    }
  }
  const chimerelleV2 = filename.match(/^chimerelle-lr-v2(-chibi)?\.png$/)
  if (chimerelleV2) {
    const isChibi = chimerelleV2[1]
    return join(
      catalogRoot,
      'brouillons-generation',
      'myrions',
      'legendary',
      isChibi
        ? 'myrion-chimerelle-chibi-rarity-LR-fusion-draft-v2-majestueux-bg-cfcfcf.png'
        : 'myrion-chimerelle-cutout-rarity-LR-fusion-draft-v2-majestueux-bg-cfcfcf.png',
    )
  }
  if (filename === 'chimerelle-lr-cutout.png') {
    return join(
      catalogRoot,
      'brouillons-generation',
      'myrions',
      'legendary',
      'myrion-chimerelle-cutout-rarity-LR-fusion-draft-v1-bg-cfcfcf.png',
    )
  }
  return null
}

if (existsSync(cursorAssets)) {
  for (const file of readdirSync(cursorAssets)) {
    const companionDraft = parseCompanionDraft(file)
    if (companionDraft) {
      copyTo(join(cursorAssets, file), companionDraft.dest)
      continue
    }
    const myrionDraft = parseMyrionDraft(file)
    if (myrionDraft) {
      copyTo(join(cursorAssets, file), myrionDraft)
    }
  }
}

// --- README index ---
const readme = `# Event Disagrea — catalogue pour tri

Dossier de **référence uniquement** pour trier ce que tu gardes.
Le pipeline jeu continue d'utiliser \`generated/\` tel quel.

## Structure

| Dossier | Contenu |
|---------|---------|
| \`inputs/references-disgaea/\` | Refs Disgaea (identité uniquement, pas le style) |
| \`inputs/style-anchors-jeu/\` | Talia, Moussprout, Etna L1 approuvé, Prinnettenoire |
| \`inputs/backgrounds/affinity/\` | Décors affinité par personnage (lv 1–3 et 4–5, mobile + PC) |
| \`inputs/backgrounds/minigame/\` | Décors chasse Myrions + dressage enclos |
| \`outputs-courants/\` | Sélection actuelle dans \`generated/\` (copie renommée) |
| \`brouillons-generation/\` | Toutes les versions intermédiaires IA (v1, v2, corrections Laharl…) |

## Convention de nommage

### Compagnons (cutout)
\`companion-{id}-cutout-affinity-{01-05}-{description-pose}-bg-cfcfcf.png\`

- **bg-cfcfcf** = fond gris plat pour détourage (pas un décor de scène)
- Les backgrounds de scène sont dans \`inputs/backgrounds/\`

### Compagnons (chibi)
\`companion-{id}-chibi-miniature-bg-cfcfcf.png\`

### Myrions
\`myrion-{id}-cutout-rarity-{N|SR|SSR|UR}-proprietaire-{owner}-bg-cfcfcf.png\`

### Backgrounds affinité
\`bg-affinity-{personnage}-niveaux-{01-03|04-05}-{mobile-portrait|pc-wide}-sans-personnage.png\`

### Brouillons
Suffixes \`draft-v1\`, \`draft-v2\`, \`masculin-corrige\`, \`feminin-incorrect\` selon l'itération.

## Régénérer ce catalogue

\`\`\`bash
node scripts/organize-disagrea-catalog.mjs
\`\`\`

Généré le ${new Date().toISOString().slice(0, 10)} — ${copied} fichiers copiés, ${skipped} sources manquantes ignorées.
`

ensureDir(catalogRoot)
writeFileSync(join(catalogRoot, 'README_TRI.md'), readme, 'utf8')

console.log(`Catalogue Disagrea : ${copied} fichiers copiés, ${skipped} ignorés`)
console.log(`→ ${catalogRoot}`)
