#!/usr/bin/env node
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..')
const SCAN = ['assets', 'public']
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const full = join(dir, name)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(full, out)
    else if (EXTS.has(extname(name).toLowerCase())) out.push({ full, bytes: st.size })
  }
  return out
}

function categorize(rel) {
  const p = rel.replace(/\\/g, '/')
  if (p.includes('/Background/') || p.includes('/biomes/') || p.includes('/enclosures/')) return 'background'
  if (p.includes('/cutout') || p.includes('/cutouts/') || p.includes('/silhouette/') || p.includes('/companions/') && p.includes('/point')) return 'cutout-alpha'
  if (p.includes('/Compagnons/') || p.includes('/companions/')) return 'companion'
  if (p.includes('/Gacha/') || p.includes('/gacha/')) return 'gacha'
  if (p.includes('/chibis/') || p.includes('/chibi/')) return 'chibi-cutout'
  if (p.includes('/UI/') || p.includes('/icons')) return 'ui'
  if (p.includes('/Myrions/') || p.includes('/myrions/')) return 'myrion'
  return 'other'
}

const files = SCAN.flatMap((r) => walk(join(ROOT, r)))
const results = files
  .map(({ full, bytes }) => {
    const rel = relative(ROOT, full).replace(/\\/g, '/')
    return { rel, bytes, kb: Math.round((bytes / 1024) * 10) / 10, category: categorize(rel) }
  })
  .sort((a, b) => b.bytes - a.bytes)

const thresholds = {
  total: results.length,
  over500kb: results.filter((r) => r.bytes > 512000).length,
  over1mb: results.filter((r) => r.bytes > 1048576).length,
  over2mb: results.filter((r) => r.bytes > 2097152).length,
}

const byRoot = {}
for (const r of results) {
  const root = r.rel.startsWith('assets/') ? 'assets' : 'public'
  if (!byRoot[root]) byRoot[root] = { count: 0, bytes: 0 }
  byRoot[root].count++
  byRoot[root].bytes += r.bytes
}

const report = {
  scannedAt: new Date().toISOString(),
  scanRoots: SCAN,
  thresholds,
  byRoot,
  top20: results.slice(0, 20),
  over500kb: results.filter((r) => r.bytes > 512000),
  over1mb: results.filter((r) => r.bytes > 1048576),
}

const outPath = join(ROOT, 'docs/traceability/assets/phase4-size-scan.json')
writeFileSync(outPath, JSON.stringify(report, null, 2))

// Runtime-critical subset analysis
const RUNTIME_EXCLUDE = [
  /^assets\/myrions-import\//,
  /^assets\/talia-import\//,
  /^assets\/source-/,
  /^public\/generated-backup\//,
  /^public\/references\//,
  /^public\/village\/panorama\.png$/,
  /^public\/village\/panorama-ai\.png$/,
  /^assets\/Compagnons\/[^/]+\/Autres\/disagrea-integrated\//,
]

function isRuntime(rel) {
  return !RUNTIME_EXCLUDE.some((re) => re.test(rel))
}

const runtime = results.filter((r) => isRuntime(r.rel))
const critical = {
  biomeCaptureWide: runtime.filter((r) => /assets\/Background\/[^/]+\/capture-wide\.png$/.test(r.rel)),
  biomeCapturePortrait: runtime.filter((r) => /assets\/Background\/[^/]+\/capture-portrait\.png$/.test(r.rel)),
  biomeDressageWide: runtime.filter((r) => /assets\/Background\/[^/]+\/dressage-wide\.png$/.test(r.rel)),
  biomeDressagePortrait: runtime.filter((r) => /assets\/Background\/[^/]+\/dressage-portrait\.png$/.test(r.rel)),
  myrionCutout: runtime.filter((r) => /assets\/Myrions\/[^/]+\/cutout\//.test(r.rel)),
  companionAffinite: runtime.filter((r) => /assets\/Compagnons\/[^/]+\/affinite\//.test(r.rel)),
  companionChibi: runtime.filter((r) => /assets\/Compagnons\/[^/]+\/chibis\//.test(r.rel)),
  gacha: runtime.filter((r) => /assets\/[Gg]acha\//.test(r.rel)),
  guideCutout: runtime.filter((r) => /assets\/Compagnons\/[^/]+\/Autres\/guide\//.test(r.rel)),
  publicRuntime: runtime.filter((r) => r.rel.startsWith('public/')),
}

function sum(arr) {
  return {
    count: arr.length,
    bytes: arr.reduce((a, r) => a + r.bytes, 0),
    avgKb: arr.length ? Math.round((arr.reduce((a, r) => a + r.bytes, 0) / arr.length / 1024) * 10) / 10 : 0,
    maxKb: arr.length ? Math.round((Math.max(...arr.map((r) => r.bytes)) / 1024) * 10) / 10 : 0,
  }
}

const criticalSummary = Object.fromEntries(
  Object.entries(critical).map(([k, v]) => [k, { ...sum(v), files: v.slice(0, 5).map((r) => ({ rel: r.rel, kb: r.kb })) }]),
)

// Typical capture scene: 1 biome bg + 1 myrion cutout + optional guide
const avgBiomeWide = critical.biomeCaptureWide.length
  ? critical.biomeCaptureWide.reduce((a, r) => a + r.bytes, 0) / critical.biomeCaptureWide.length
  : 0
const avgBiomePortrait = critical.biomeCapturePortrait.length
  ? critical.biomeCapturePortrait.reduce((a, r) => a + r.bytes, 0) / critical.biomeCapturePortrait.length
  : 0
const avgMyrionCutout = critical.myrionCutout.length
  ? critical.myrionCutout.reduce((a, r) => a + r.bytes, 0) / critical.myrionCutout.length
  : 0

const runtimeSummary = {
  total: sum(runtime),
  thresholds: {
    over500kb: runtime.filter((r) => r.bytes > 512000).length,
    over1mb: runtime.filter((r) => r.bytes > 1048576).length,
  },
  criticalSummary,
  typicalCaptureSceneKb: {
    desktop: Math.round((avgBiomeWide + avgMyrionCutout) / 1024),
    mobile: Math.round((avgBiomePortrait + avgMyrionCutout) / 1024),
    note: '1 biome bg + 1 myrion cutout; guide cutout optional (~200-400KB)',
  },
  top20Runtime: runtime.slice(0, 20),
}

const summaryPath = join(ROOT, 'docs/traceability/assets/phase4-size-scan-runtime.json')
writeFileSync(summaryPath, JSON.stringify(runtimeSummary, null, 2))
console.log('Wrote', outPath)
console.log('Wrote', summaryPath)
