/**
 * Unified Assets 2.0 serving layer — maps `assets/` tree → stable runtime URLs.
 * Dev: middleware stream. Build: copy flat runtime layout into dist/.
 */
import { cpSync, createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'
import type { Plugin } from 'vite'

export function contentTypeForAsset(pathname: string): string | null {
  if (pathname.endsWith('.png')) return 'image/png'
  if (pathname.endsWith('.webp')) return 'image/webp'
  if (pathname.endsWith('.svg')) return 'image/svg+xml'
  if (pathname.endsWith('.json')) return 'application/json; charset=utf-8'
  if (pathname.endsWith('.moc3')) return 'application/octet-stream'
  if (pathname.endsWith('.js')) return 'text/javascript; charset=utf-8'
  if (pathname.endsWith('.md')) return 'text/markdown; charset=utf-8'
  if (pathname.endsWith('.mp4')) return 'video/mp4'
  if (pathname.endsWith('.webm')) return 'video/webm'
  return null
}

/** Legacy URL rewrites applied before repo asset resolution. */
export const LEGACY_ASSET_REWRITES: Array<[RegExp, string]> = [
  [/^\/minigames\/enclosures\/(.+)$/, '/assets/minigames/dressage/enclosures/$1'],
  [/^\/minigames\/palmons\/chibi\/(.+)$/, '/assets/minigames/dressage/myrions/chibi/$1'],
  [/^\/minigames\/palmons\/silhouettes\/(.+)$/, '/assets/minigames/capture/myrions/silhouette/$1'],
  [/^\/minigames\/palmons\/(.+)$/, '/assets/minigames/capture/myrions/cutout/$1'],
  [/^\/minigames\/biomes\/(.+)$/, '/assets/minigames/capture/biomes/$1'],
  [/^\/minigames\/guides\/talia-point-(.+)\.png$/, '/assets/minigames/capture/companions/talia/point-$1.png'],
  [/^\/minigames\/guides\/talia-point\.png$/, '/assets/minigames/capture/companions/talia/point.png'],
  [/^\/minigames\/guides\/(.+)$/, '/assets/minigames/capture/companions/$1'],
  [/^\/minigames\/presentations\/(.+)$/, '/assets/minigames/hub/presentations/$1'],
  [/^\/minigames\/stages\/(.+)$/, '/assets/minigames/hub/stages/$1'],
  [/^\/companions\/(.+)$/, '/assets/companions/$1'],
]

export function rewriteLegacyAssetUrl(pathname: string): string | null {
  for (const [pattern, replacement] of LEGACY_ASSET_REWRITES) {
    const next = pathname.replace(pattern, replacement)
    if (next !== pathname) return next
  }
  return null
}

/** Background biomes: assets/Background/{biomeId}/ → capture/dressage runtime paths. */
const BACKGROUND_URL_ROUTES = [
  {
    urlPrefix: '/assets/minigames/capture/biomes/',
    portraitSuffix: '-portrait.png',
    wideSuffix: '.png',
    wideFile: 'capture-wide.png',
    portraitFile: 'capture-portrait.png',
    distDir: 'assets/minigames/capture/biomes',
    distWide: (biomeId: string) => `${biomeId}.png`,
    distPortrait: (biomeId: string) => `${biomeId}-portrait.png`,
  },
  {
    urlPrefix: '/assets/minigames/dressage/enclosures/',
    portraitSuffix: '-portrait.png',
    wideSuffix: '.png',
    wideFile: 'dressage-wide.png',
    portraitFile: 'dressage-portrait.png',
    distDir: 'assets/minigames/dressage/enclosures',
    distWide: (biomeId: string) => `${biomeId}.png`,
    distPortrait: (biomeId: string) => `${biomeId}-portrait.png`,
  },
] as const

type MyrionVariant = 'cutout' | 'chibi' | 'silhouette'

const MYRION_URL_ROUTES: Array<{
  variant: MyrionVariant
  urlPrefix: string
  distDir: string
}> = [
  {
    variant: 'cutout',
    urlPrefix: '/assets/minigames/capture/myrions/cutout/',
    distDir: 'assets/minigames/capture/myrions/cutout',
  },
  {
    variant: 'chibi',
    urlPrefix: '/assets/minigames/dressage/myrions/chibi/',
    distDir: 'assets/minigames/dressage/myrions/chibi',
  },
  {
    variant: 'silhouette',
    urlPrefix: '/assets/minigames/capture/myrions/silhouette/',
    distDir: 'assets/minigames/capture/myrions/silhouette',
  },
]

const COMPANION_SUBDIRS = ['affinite', 'cutouts', 'chibis', 'NSFW'] as const

const GUIDE_CUTOUT_URL_PREFIX = '/assets/minigames/capture/companions/'
const GUIDE_CUTOUT_SOURCE_SUBDIR = 'Autres/guide'

type RepoAssetRoots = {
  gacha: string
  live2d: string
  background: string
  myrions: string
  companions: string
}

function resolveBackgroundAssetFile(pathname: string, baseDir: string): string | null {
  for (const route of BACKGROUND_URL_ROUTES) {
    if (!pathname.startsWith(route.urlPrefix)) continue
    const remainder = decodeURIComponent(pathname.slice(route.urlPrefix.length))
    if (!remainder || remainder.includes('/') || remainder.includes('..')) continue

    let biomeId: string
    let fileName: string
    if (remainder.endsWith(route.portraitSuffix)) {
      biomeId = remainder.slice(0, -route.portraitSuffix.length)
      fileName = route.portraitFile
    } else if (remainder.endsWith(route.wideSuffix)) {
      biomeId = remainder.slice(0, -route.wideSuffix.length)
      fileName = route.wideFile
    } else {
      continue
    }

    if (!biomeId) continue
    const filePath = normalize(join(baseDir, biomeId, fileName))
    if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      continue
    }
    return filePath
  }
  return null
}

function buildMyrionAssetIndex(baseDir: string): Map<string, string> {
  const index = new Map<string, string>()
  if (!existsSync(baseDir)) return index
  for (const biomeId of readdirSync(baseDir)) {
    const biomeDir = join(baseDir, biomeId)
    if (!statSync(biomeDir).isDirectory()) continue
    for (const route of MYRION_URL_ROUTES) {
      const variantDir = join(biomeDir, route.variant)
      if (!existsSync(variantDir)) continue
      for (const file of readdirSync(variantDir)) {
        if (!file.endsWith('.png')) continue
        index.set(`${route.variant}/${file}`, join(variantDir, file))
      }
    }
  }
  return index
}

function resolveMyrionFile(pathname: string, index: Map<string, string>): string | null {
  for (const route of MYRION_URL_ROUTES) {
    if (!pathname.startsWith(route.urlPrefix)) continue
    const fileName = decodeURIComponent(pathname.slice(route.urlPrefix.length))
    if (!fileName || fileName.includes('/') || fileName.includes('..') || !fileName.endsWith('.png')) {
      continue
    }
    const filePath = index.get(`${route.variant}/${fileName}`)
    if (filePath && existsSync(filePath)) return filePath
  }
  return null
}

function resolveCompanionAssetFile(pathname: string, baseDir: string): string | null {
  const match = /^\/assets\/companions\/([^/]+)\/([^/]+\.png)$/.exec(pathname)
  if (!match) return null
  const companionId = decodeURIComponent(match[1])
  const fileName = decodeURIComponent(match[2])
  if (!companionId || companionId.includes('..')) return null

  let subdir: string
  if (/^affinity-[1-5]\.png$/.test(fileName)) {
    subdir = 'affinite'
  } else if (fileName.startsWith('emotion-')) {
    subdir = 'cutouts'
  } else if (fileName === 'chibi.png') {
    subdir = 'chibis'
  } else if (fileName === 'affinity-4-nsfw.png') {
    subdir = 'NSFW'
  } else {
    return null
  }

  const filePath = normalize(join(baseDir, companionId, subdir, fileName))
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null
  }
  return filePath
}

/** Guide cutouts: assets/Compagnons/{id}/Autres/guide/{file} → /assets/minigames/capture/companions/{id}/{file} */
function resolveGuideCutoutFile(pathname: string, baseDir: string): string | null {
  if (!pathname.startsWith(GUIDE_CUTOUT_URL_PREFIX)) return null
  const remainder = decodeURIComponent(pathname.slice(GUIDE_CUTOUT_URL_PREFIX.length))
  const slash = remainder.indexOf('/')
  if (slash <= 0) return null
  const companionId = remainder.slice(0, slash)
  const fileName = remainder.slice(slash + 1)
  if (!companionId || companionId.includes('..') || fileName.includes('/') || fileName.includes('..')) {
    return null
  }
  if (!/\.(png|svg|webp)$/.test(fileName)) return null

  const filePath = normalize(join(baseDir, companionId, GUIDE_CUTOUT_SOURCE_SUBDIR, fileName))
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null
  }
  return filePath
}

function resolveGachaFile(pathname: string, baseDir: string): string | null {
  if (!pathname.startsWith('/gacha/')) return null
  const relative = decodeURIComponent(pathname.replace(/^\/gacha\//, ''))
  const filePath = normalize(join(baseDir, relative))
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null
  }
  return filePath
}

function resolveLive2dFile(pathname: string, baseDir: string): string | null {
  if (!pathname.startsWith('/live2d/')) return null
  const relative = decodeURIComponent(pathname.replace(/^\/live2d\//, ''))
  if (!relative || relative.includes('..')) return null
  const filePath = normalize(join(baseDir, relative))
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null
  }
  return filePath
}

function resolveRepoAssetFile(pathname: string, roots: RepoAssetRoots, myrionIndex: Map<string, string>): string | null {
  return (
    resolveGachaFile(pathname, roots.gacha) ??
    resolveLive2dFile(pathname, roots.live2d) ??
    resolveBackgroundAssetFile(pathname, roots.background) ??
    resolveMyrionFile(pathname, myrionIndex) ??
    resolveCompanionAssetFile(pathname, roots.companions) ??
    resolveGuideCutoutFile(pathname, roots.companions)
  )
}

function pipeAssetFile(
  filePath: string,
  res: NodeJS.WritableStream & { setHeader: (name: string, value: string) => void },
  options?: { devImmutableCache?: boolean },
) {
  const contentType = contentTypeForAsset(filePath)
  if (contentType) {
    res.setHeader('Content-Type', contentType)
  }
  if (options?.devImmutableCache && contentType?.startsWith('image/')) {
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  }
  createReadStream(filePath).pipe(res)
}

function copyBackgroundAssets(baseDir: string, distRoot: string) {
  if (!existsSync(baseDir)) return
  for (const biomeId of readdirSync(baseDir)) {
    const biomeDir = join(baseDir, biomeId)
    if (!statSync(biomeDir).isDirectory()) continue
    for (const route of BACKGROUND_URL_ROUTES) {
      const wideSrc = join(biomeDir, route.wideFile)
      const portraitSrc = join(biomeDir, route.portraitFile)
      const outDir = join(distRoot, route.distDir)
      if (existsSync(wideSrc)) {
        mkdirSync(outDir, { recursive: true })
        cpSync(wideSrc, join(outDir, route.distWide(biomeId)))
      }
      if (existsSync(portraitSrc)) {
        mkdirSync(outDir, { recursive: true })
        cpSync(portraitSrc, join(outDir, route.distPortrait(biomeId)))
      }
    }
  }
}

function copyMyrionAssets(index: Map<string, string>, distRoot: string) {
  for (const [key, filePath] of index) {
    const [variant, fileName] = key.split('/')
    const route = MYRION_URL_ROUTES.find((r) => r.variant === variant)
    if (!route) continue
    const outDir = join(distRoot, route.distDir)
    mkdirSync(outDir, { recursive: true })
    cpSync(filePath, join(outDir, fileName))
  }
}

function copyCompanionAssets(baseDir: string, distRoot: string) {
  if (!existsSync(baseDir)) return
  const companionsDist = join(distRoot, 'assets', 'companions')
  for (const companionId of readdirSync(baseDir)) {
    const companionDir = join(baseDir, companionId)
    if (!statSync(companionDir).isDirectory()) continue
    for (const subdir of COMPANION_SUBDIRS) {
      const srcSub = join(companionDir, subdir)
      if (!existsSync(srcSub)) continue
      for (const file of readdirSync(srcSub)) {
        if (!file.endsWith('.png')) continue
        const outDir = join(companionsDist, companionId)
        mkdirSync(outDir, { recursive: true })
        cpSync(join(srcSub, file), join(outDir, file))
      }
    }
  }
}

function copyGuideCutoutAssets(baseDir: string, distRoot: string) {
  if (!existsSync(baseDir)) return
  for (const companionId of readdirSync(baseDir)) {
    const guideDir = join(baseDir, companionId, GUIDE_CUTOUT_SOURCE_SUBDIR)
    if (!existsSync(guideDir) || !statSync(guideDir).isDirectory()) continue
    const outDir = join(distRoot, 'assets', 'minigames', 'capture', 'companions', companionId)
    for (const file of readdirSync(guideDir)) {
      if (!/\.(png|svg|webp)$/.test(file)) continue
      mkdirSync(outDir, { recursive: true })
      cpSync(join(guideDir, file), join(outDir, file))
    }
  }
}

function copyGachaAssets(baseDir: string, distRoot: string) {
  const outDir = join(distRoot, 'gacha')
  if (!existsSync(baseDir)) return
  cpSync(baseDir, outDir, {
    recursive: true,
    filter: (src) => !src.replace(/\\/g, '/').includes('/sources/'),
  })
}

function copyLive2dAssets(baseDir: string, distRoot: string) {
  const outDir = join(distRoot, 'live2d')
  if (!existsSync(baseDir)) return
  cpSync(baseDir, outDir, { recursive: true })
}

/** Single plugin: Gacha, Live2D, Background, Myrions, Compagnons, guide cutouts. */
export function repoAssetsPlugin(repoRoot: string): Plugin {
  const roots: RepoAssetRoots = {
    gacha: join(repoRoot, 'assets', 'Gacha'),
    live2d: join(repoRoot, 'assets', 'Live2D'),
    background: join(repoRoot, 'assets', 'Background'),
    myrions: join(repoRoot, 'assets', 'Myrions'),
    companions: join(repoRoot, 'assets', 'Compagnons'),
  }
  let myrionIndex = buildMyrionAssetIndex(roots.myrions)

  const serveRepoAsset = (
    req: { url?: string },
    res: NodeJS.WritableStream,
    next: () => void,
  ) => {
    const pathname = req.url?.split('?')[0] ?? '/'
    const filePath = resolveRepoAssetFile(pathname, roots, myrionIndex)
    if (!filePath) {
      next()
      return
    }
    pipeAssetFile(
      filePath,
      res as NodeJS.WritableStream & { setHeader: (name: string, value: string) => void },
      { devImmutableCache: true },
    )
  }

  return {
    name: 'repo-assets',
    configureServer(server) {
      myrionIndex = buildMyrionAssetIndex(roots.myrions)
      server.middlewares.use(serveRepoAsset)
    },
    closeBundle() {
      myrionIndex = buildMyrionAssetIndex(roots.myrions)
      const distRoot = join(repoRoot, 'dist')
      copyGachaAssets(roots.gacha, distRoot)
      copyLive2dAssets(roots.live2d, distRoot)
      copyBackgroundAssets(roots.background, distRoot)
      copyMyrionAssets(myrionIndex, distRoot)
      copyCompanionAssets(roots.companions, distRoot)
      copyGuideCutoutAssets(roots.companions, distRoot)
    },
  }
}

export function legacyPublicAssetPlugin(): Plugin {
  return {
    name: 'legacy-public-asset-rewrites',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = req.url?.split('?')[0]
        if (!pathname) {
          next()
          return
        }
        const rewritten = rewriteLegacyAssetUrl(pathname)
        if (rewritten) {
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
          req.url = `${rewritten}${query}`
        }
        next()
      })
    },
  }
}
