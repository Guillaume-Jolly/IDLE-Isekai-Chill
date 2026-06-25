/**
 * Importe backgrounds + Myrions (v1 familiers/ ou v2 myrions/ + backgrounds/).
 * Chroma key, silhouettes, catalogue TS, chibis auto si "chibi" dans le nom.
 * Usage: node scripts/import-myrions-assets.mjs [dossier-import]
 */
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { lookupMyrionManifest, MYRION_MANIFEST_BY_STEM, slugifyStem } from './myrions-name-manifest.mjs'
import { backgroundAssetPaths, myrionAssetPaths, repoRoot, sourceMinigamePaths } from './minigame-asset-paths.mjs'

const importRoot = process.argv[2] ?? sourceMinigamePaths.myrionsImportDefault

const catalogPath = join(repoRoot, 'src/data/myrionsCatalog.generated.ts')

const BIOME_META = {
  '01_Prairie_solaire': {
    id: 'prairie-solaire',
    name: 'Prairie solaire',
    emoji: '☀️',
    fallbackGradient: 'linear-gradient(180deg, #fff8d8 0%, #ffe08a 40%, #9ed56b 100%)',
  },
  '02_Foret_ancienne': {
    id: 'foret-ancienne',
    name: 'Forêt ancienne',
    emoji: '🌲',
    fallbackGradient: 'linear-gradient(180deg, #1a3020 0%, #4a7850 45%, #2a5038 100%)',
  },
  '03_Marais_brumeux': {
    id: 'marais-brumeux',
    name: 'Marais brumeux',
    emoji: '🌫️',
    fallbackGradient: 'linear-gradient(180deg, #243038 0%, #5a7878 45%, #3a5848 100%)',
  },
  '04_Montagnes_cristallines': {
    id: 'montagnes-cristallines',
    name: 'Montagnes cristallines',
    emoji: '💎',
    fallbackGradient: 'linear-gradient(180deg, #1a2848 0%, #7ec8ff 50%, #e8f8ff 100%)',
  },
  '05_Desert_rouge': {
    id: 'desert-rouge',
    name: 'Désert rouge',
    emoji: '🏜️',
    fallbackGradient: 'linear-gradient(180deg, #3a1820 0%, #d06030 55%, #ffb86b 100%)',
  },
  '06_Rivage_corallien': {
    id: 'rivage-corallien',
    name: 'Rivage corallien',
    emoji: '🐚',
    fallbackGradient: 'linear-gradient(180deg, #1a2848 0%, #4a98c8 55%, #ffd9a8 100%)',
  },
  '07_Volcan_noir': {
    id: 'volcan-noir',
    name: 'Volcan noir',
    emoji: '🌋',
    fallbackGradient: 'linear-gradient(180deg, #120810 0%, #602028 50%, #ff7040 100%)',
  },
  '08_Ruines_astrales': {
    id: 'ruines-astrales',
    name: 'Ruines astrales',
    emoji: '✨',
    fallbackGradient: 'linear-gradient(180deg, #181028 0%, #5848a8 50%, #ffd56a 100%)',
  },
}

/** 12 slots par biome — tri décroissant par score visuel */
const RARITY_SLOTS = ['LR', 'UR', 'SSR', 'SR', 'SR', 'R', 'R', 'R', 'N', 'N', 'N', 'N']

const NAME_FILLERS = new Set([
  'petit', 'petite', 'sur', 'fond', 'aux', 'avec', 'dans', 'une', 'des', 'les', 'et', 'de', 'du', 'la', 'le',
  'en', 'forme', 'portrait', 'illustration', 'chibi', 'kawaii', 'mignon', 'mignonne', 'joyeux', 'joyeuse',
  'curieux', 'curieuse', 'adorable', 'heureux', 'heureuse', 'energique', 'magique', 'mystique', 'fantastique',
  'fantaisie', 'fantasy', 'stylise', 'stylisee', 'heroique', 'et', 'l', 'a', 'au', 'et', 'colore', 'pose',
  'pleine', 'dansant', 'sous', 'douc', 'douce', 'lumiere', 'determinee', 'menacant', 'fiere', 'flottant',
  'epanouies', 'accents', 'ornements', 'motifs', 'apparence', 'fourrure', 'queues', 'cinq', 'antlers',
  'details', 'detail', 'couleurs', 'couleur', 'illustration', 'portrait', 'collier', 'feuillu', 'decorée',
  'decoration', 'decoree', 'carapace', 'shell', 'armure', 'brillante', 'lumineux', 'lumineuse', 'lumineuses',
  'galactiques', 'cosmos', 'regard', 'aura', 'ardente', 'enflammee', 'enflamme', 'volant', 'naturelle',
  'curieuses', 'vegetal', 'vegetale', 'forestiere', 'forestier', 'marins', 'marin', 'aquatiques', 'coraux',
  'ecailles', 'ailes', 'feuilles', 'fleurs', 'floral', 'verdure', 'bois', 'feu', 'flammes', 'gelée', 'gelee',
  'bulle', 'larva', 'ametystes', 'amethystes', 'cristaux', 'cristal', 'comete', 'comète', 'zephyr', 'zéphyr',
  'etoile', 'etoiles', 'mecanique', 'mecanique', 'jellyfish', 'fleur', 'turquoise', 'cyan', 'orange', 'rose',
  'violet', 'vert', 'bleu', 'uni', 'idyllic', 'idyllique', 'apocalyptique', 'enflamme', 'enflammé', 'animé',
  'anime', 'crépuscule', 'crepuscule', 'minuit', 'ciel', 'paysage', 'sentier', 'plage', 'ruines', 'passage',
])

const PRETTY_WORDS = {
  dores: 'Doré',
  dore: 'Doré',
  doree: 'Doré',
  celeste: 'Céleste',
  cristallin: 'Cristallin',
  cristalline: 'Cristalline',
  cosmique: 'Cosmique',
  lunaire: 'Lunaire',
  solaire: 'Solaire',
  majestueux: 'Majestueux',
  majestueuse: 'Majestueuse',
  mythologique: 'Mythique',
  mythique: 'Mythique',
  venimeuse: 'Venimeux',
  venimeux: 'Venimeux',
  eternel: 'Éternel',
  eternels: 'Éternels',
  royal: 'Royal',
  flammes: 'Flammes',
  lave: 'Lave',
  glace: 'Glace',
  etoile: 'Étoile',
  galactiques: 'Galactique',
  coraux: 'Corail',
  feuilles: 'Feuillé',
  floral: 'Floral',
  feerique: 'Féerique',
  mecanique: 'Mécano',
  ametystes: 'Améthyste',
  comete: 'Comète',
  epanouies: 'Épanoui',
  jellyfish: 'Méduse',
  monstrueuse: 'Monstrueux',
  serpentine: 'Serpentin',
  canin: 'Canin',
  felin: 'Félin',
  feline: 'Félin',
  amphibie: 'Amphibie',
  insecte: 'Insecte',
  oiseau: 'Oiseau',
  oisillon: 'Oisillon',
  grenouille: 'Grenouille',
  dragon: 'Dragon',
  cerf: 'Cerf',
  renard: 'Renard',
  renardeau: 'Renardeau',
  loup: 'Loup',
  chaton: 'Chaton',
  lapin: 'Lapin',
  chameau: 'Chameau',
  scorpion: 'Scorpion',
  lezard: 'Lézard',
  tortue: 'Tortue',
  crabe: 'Crabe',
  poisson: 'Poisson',
  souris: 'Souris',
  bovin: 'Bovin',
  chimere: 'Chimère',
  chevre: 'Chèvre',
  cochon: 'Cochon',
  herisson: 'Hérisson',
  escargot: 'Escargot',
  marmotte: 'Marmotte',
  guerrier: 'Guerrier',
  gardien: 'Gardien',
  roi: 'Roi',
  esprit: 'Esprit',
  element: 'Élémentaire',
  monstre: 'Monstre',
  chevalier: 'Chevalier',
  abeille: 'Abeille',
  scarabe: 'Scarabe',
  ram: 'Bélier',
  hibou: 'Hibou',
  chouette: 'Chouette',
  armadillo: 'Armadillo',
  cactus: 'Cactus',
  champignon: 'Champignon',
  rat: 'Rat',
  limace: 'Limace',
  bulle: 'Bulle',
  nature: 'Nature',
  foret: 'Forêt',
  marais: 'Marais',
  desert: 'Désert',
  rivage: 'Rivage',
  volcan: 'Volcan',
  ruines: 'Ruines',
  cristal: 'Cristal',
  brume: 'Brume',
  brumeux: 'Brumeux',
  solaire: 'Solaire',
  auree: 'Auré',
  feu: 'Feu',
  flamboyante: 'Flamboyant',
  noble: 'Noble',
  sagesse: 'Sage',
  majeste: 'Majesté',
  charmant: 'Charmant',
  fantaisiste: 'Fantaisiste',
  forestiere: 'Forestier',
  creature: 'Créature',
  monstrueuse: 'Monstrueux',
}

const NAME_STOP = new Set([...NAME_FILLERS])

function normalizeKey(value) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/_/g, '_')
    .toLowerCase()
}

function findBiomeMeta(folderName) {
  if (BIOME_META[folderName]) return BIOME_META[folderName]
  const norm = normalizeKey(folderName)
  for (const [key, meta] of Object.entries(BIOME_META)) {
    if (normalizeKey(key) === norm) return meta
  }
  return null
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function capitalize(word) {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function prettyWord(word) {
  return PRETTY_WORDS[word] ?? capitalize(word)
}

function gameNameFromStem(stem) {
  const slug = slugify(stem)
  const parts = slug.split('-').filter((p) => p.length > 1 && !NAME_FILLERS.has(p))
  if (parts.length === 0) return capitalize(slug.slice(0, 14))

  const creature = parts[0]
  const trait =
    parts.find((w, index) => index > 0 && (PRETTY_WORDS[w] || w.length >= 5)) ??
    parts[parts.length - 1] ??
    creature

  if (creature === trait) return prettyWord(creature)
  return `${prettyWord(creature)} ${prettyWord(trait)}`
}

function rarityScore(stem) {
  const s = stem.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  let score = 0
  if (/dragon|_roi|roi_|gardien|mythologique|cosmique|celeste|eternel|monstre_|chimere|serpent_royal|cerf_dragon|loup_cosmique|ram_de_lave|roi_des/.test(s)) {
    score += 45
  }
  if (/majestueux|majestueuse|heroique|chevalier|guerrier|noble|sagesse|flamboyante|venimeuse|menacant|royal|mythologique|celeste/.test(s)) {
    score += 28
  }
  if (/armure|enflamm|lave|cristallin_majestueux|marine_majestueuse|solaire_majestueuse/.test(s)) {
    score += 18
  }
  if (/chibi|mignon|petit|kawaii|charmant|joyeux|curieux|adorable|heureux|gelée|gelee|bulle/.test(s)) {
    score -= 18
  }
  if (/insecte|souris|escargot|oisillon|moustik|limace|scorpion_mignon|lezard_mignon/.test(s)) {
    score -= 12
  }
  return score
}

function assignRarity(sortedStems, index) {
  return RARITY_SLOTS[Math.min(index, RARITY_SLOTS.length - 1)]
}

function sampleKeyColor(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  const counts = new Map()
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  let best = [0, 0, 0]
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = key.split(',').map(Number)
    }
  }
  return best
}

function chromaMask(data, w, h, key, tolerance) {
  const mask = new Uint8Array(w * h)
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    const dist = Math.max(
      Math.abs(data[i] - key[0]),
      Math.abs(data[i + 1] - key[1]),
      Math.abs(data[i + 2] - key[2]),
    )
    mask[pi] = data[i + 3] >= 8 && dist > tolerance ? 1 : 0
  }
  return mask
}

async function chromaCutout(inputPath, cutoutPath, silhouettePath, tolerance = 52) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const key = sampleKeyColor(rgba, info.width, info.height)
  const mask = chromaMask(rgba, info.width, info.height, key, tolerance)

  const cut = new Uint8ClampedArray(rgba.length)
  const sil = new Uint8ClampedArray(rgba.length)
  for (let pi = 0; pi < info.width * info.height; pi += 1) {
    const i = pi * 4
    if (mask[pi]) {
      cut[i] = rgba[i]
      cut[i + 1] = rgba[i + 1]
      cut[i + 2] = rgba[i + 2]
      cut[i + 3] = 255
      sil[i] = 14
      sil[i + 1] = 14
      sil[i + 2] = 22
      sil[i + 3] = 255
    }
  }

  mkdirSync(dirname(cutoutPath), { recursive: true })
  await sharp(Buffer.from(cut), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(cutoutPath)

  await sharp(Buffer.from(sil), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(silhouettePath)

  return key
}

function parseFamiliarFileV1(fileName) {
  const match = /^([A-Z]+)_(.+)\.png$/i.exec(fileName)
  if (!match) return null
  const rarity = match[1].toUpperCase()
  const rawName = match[2]
  return {
    rarity,
    rawName,
    id: slugify(rawName),
    name: rawName.split('_').map((p) => capitalize(p.toLowerCase())).join('-'),
  }
}

function listPng(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png')).sort()
}

async function pickBackgroundLandscape(bgDir) {
  const files = listPng(bgDir)
  if (files.length === 0) return null

  let best = null
  for (const file of files) {
    const meta = await sharp(join(bgDir, file)).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 1
    const ratio = width / height
    if (width >= height && (!best || ratio > best.ratio)) {
      best = { file, ratio }
    }
  }

  if (best) return best.file

  const prefer = files.find((f) =>
    /ensoleill|soleil|pastoral|clairi|sentier|passage|plage|desertique|volcanique|ruines_celestes|mystique_au/i.test(
      f,
    ),
  )
  return prefer ?? files[0]
}

function resolveLayout(folderPath) {
  const v1Bg = join(folderPath, 'background', 'background.png')
  const v1Fam = join(folderPath, 'familiers')
  const v2BgDir = join(folderPath, 'backgrounds')
  const v2Myr = join(folderPath, 'myrions')

  if (existsSync(v1Bg)) {
    return { kind: 'v1', bgPath: v1Bg, famDir: v1Fam }
  }
  if (existsSync(v2Myr)) {
    return { kind: 'v2', bgDir: v2BgDir, myrDir: v2Myr }
  }
  return null
}

const biomes = []
const species = []

mkdirSync(backgroundAssetPaths.root, { recursive: true })
mkdirSync(myrionAssetPaths.root, { recursive: true })

console.log(`Import from: ${importRoot}`)

const folders = readdirSync(importRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

for (const folder of folders) {
  const meta = findBiomeMeta(folder)
  if (!meta) {
    console.warn(`Skip unknown biome folder: ${folder}`)
    continue
  }

  const folderPath = join(importRoot, folder)
  const layout = resolveLayout(folderPath)
  if (!layout) {
    console.warn(`Skip ${folder}: no background/myrions layout`)
    continue
  }

  let bgSrc = null
  if (layout.kind === 'v1') {
    bgSrc = layout.bgPath
  } else {
    const picked = await pickBackgroundLandscape(layout.bgDir)
    bgSrc = picked ? join(layout.bgDir, picked) : null
  }

  if (!bgSrc || !existsSync(bgSrc)) {
    console.warn(`Skip ${meta.id}: missing background`)
    continue
  }

  const bgDest = backgroundAssetPaths.captureWide(meta.id)
  mkdirSync(dirname(bgDest), { recursive: true })
  await sharp(bgSrc).png().toFile(bgDest)
  console.log(`BG  ${meta.id} ← ${basename(bgSrc)}`)
  biomes.push(meta)

  let famFiles = []
  if (layout.kind === 'v1') {
    famFiles = listPng(layout.famDir)
  } else {
    famFiles = listPng(layout.myrDir)
  }

  if (layout.kind === 'v2') {
    const stems = famFiles.map((f) => basename(f, '.png'))
    const ranked = stems
      .map((stem) => ({ stem, score: rarityScore(stem) }))
      .sort((a, b) => b.score - a.score)

    for (let i = 0; i < famFiles.length; i += 1) {
      const file = famFiles[i]
      const stem = basename(file, '.png')
      const rank = ranked.findIndex((r) => r.stem === stem)
      const manifest = lookupMyrionManifest(stem)
      const legacySlug = slugifyStem(stem)
      const id = manifest?.id ?? legacySlug
      const name = manifest?.name ?? gameNameFromStem(stem)
      const rarity = manifest?.rarity ?? assignRarity(ranked, rank)
      const src = join(layout.myrDir, file)
      const cutout = myrionAssetPaths.cutout(meta.id, id)
      const silhouette = myrionAssetPaths.silhouette(meta.id, id)
      const tolerance = /fond_(uni|violet|vert|cyan|turquoise|orange|rose)/i.test(stem) ? 48 : 56
      await chromaCutout(src, cutout, silhouette, tolerance)
      console.log(`PAL ${id} (${name}, ${rarity})${manifest ? ' [manifest]' : ''}`)

      if (/chibi/i.test(stem)) {
        await sharp(cutout).png().toFile(myrionAssetPaths.chibi(meta.id, id))
        console.log(`  ↳ chibi ${id}`)
      }

      if (manifest && legacySlug !== id) {
        for (const resolver of [
          (legacyId) => myrionAssetPaths.cutout(meta.id, legacyId),
          (legacyId) => myrionAssetPaths.silhouette(meta.id, legacyId),
          (legacyId) => myrionAssetPaths.chibi(meta.id, legacyId),
        ]) {
          const legacy = resolver(legacySlug)
          if (existsSync(legacy)) {
            try {
              unlinkSync(legacy)
            } catch {
              /* ignore */
            }
          }
        }
      }

      species.push({ id, name, emoji: meta.emoji, rarity, biomeId: meta.id })
    }
    continue
  }

  for (const file of famFiles) {
    const parsed = parseFamiliarFileV1(file)
    if (!parsed) {
      console.warn(`Skip ${file}`)
      continue
    }

    const src = join(layout.famDir, file)
    const cutout = myrionAssetPaths.cutout(meta.id, parsed.id)
    const silhouette = myrionAssetPaths.silhouette(meta.id, parsed.id)
    await chromaCutout(src, cutout, silhouette)
    console.log(`PAL ${parsed.id} (${parsed.name}, ${parsed.rarity})`)

    species.push({
      id: parsed.id,
      name: parsed.name,
      emoji: meta.emoji,
      rarity: parsed.rarity,
      biomeId: meta.id,
    })
  }
}

const validIds = new Set(species.map((s) => s.id))
if (existsSync(myrionAssetPaths.root)) {
  for (const biomeId of readdirSync(myrionAssetPaths.root)) {
    const biomeDir = join(myrionAssetPaths.root, biomeId)
    if (!existsSync(biomeDir)) continue
    for (const variant of ['cutout', 'silhouette', 'chibi']) {
      const dir = join(biomeDir, variant)
      if (!existsSync(dir)) continue
      for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
        const id = basename(file, '.png')
        if (!validIds.has(id)) {
          unlinkSync(join(dir, file))
          console.log(`DEL orphan ${biomeId}/${variant}/${file}`)
        }
      }
    }
  }
}

const catalog = `/* Auto-generated by scripts/import-myrions-assets.mjs — do not edit by hand. */

export const MYRIONS_BIOMES = ${JSON.stringify(biomes, null, 2)} as const

export const MYRIONS_SPECIES = ${JSON.stringify(species, null, 2)} as const

export const MYRIONS_BIOME_IDS = MYRIONS_BIOMES.map((biome) => biome.id)
`

writeFileSync(catalogPath, catalog, 'utf8')
console.log(`\nCatalog: ${catalogPath}`)
console.log(`Biomes: ${biomes.length}, Species: ${species.length}`)
