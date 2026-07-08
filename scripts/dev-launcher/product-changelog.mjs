/**
 * Changelog produit par version A.B — ajouts / modifs / suppressions.
 * Sources : manifeste curaté, VERSION-INDEX, DEV_LOG phase courante.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readVersionConfig } from '../lib/version-config.mjs'
import { BACKLOG_CATEGORIES, categoryLabel, inferChangeCategory } from './backlog-taxonomy.mjs'
import { CURATED_RELEASES_AB } from './product-changelog-curated.mjs'
import { TYPE_MARK, writePanelExport } from './panel-export.mjs'

export const PRODUCT_CHANGELOG_EXPORT = {
  md: 'docs/traceability/changelog/PRODUCT_CHANGELOG.md',
  json: 'docs/traceability/changelog/PRODUCT_CHANGELOG.json',
}

/** @typedef {'add'|'mod'|'del'|'fix'|'info'} ChangeType */

/**
 * @typedef {object} ChangeItem
 * @property {ChangeType} type
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} text
 * @property {string} [ref]
 * @property {string} [date]
 * @property {string} [source]
 */

/**
 * @typedef {object} ReleaseBlock
 * @property {string} ab
 * @property {string} semver
 * @property {string} title
 * @property {string} [dateStart]
 * @property {string} [dateEnd]
 * @property {string} status
 * @property {string} [tag]
 * @property {string} [summary]
 * @property {string} [source]
 * @property {boolean} [current]
 * @property {{ add: number, mod: number, del: number, fix: number, info: number }} [stats]
 * @property {ChangeItem[]} changes
 */

export { inferChangeCategory } from './backlog-taxonomy.mjs'

export const CHANGE_TYPE_LABELS = {
  add: 'Ajouts',
  mod: 'Modifications',
  del: 'Suppressions / archives',
  fix: 'Corrections',
  info: 'Divers · doc · infra',
}

/** @param {string} text */
export function inferChangeType(text) {
  const t = String(text).toLowerCase()
  if (/\bsuppr|\bretir|\bremove|\bdelete|\barchiv|\bd[eé]plac.*old_|\bmove.*gitignore/.test(t)) {
    return 'del'
  }
  if (/\bfix|\bcorrige|\bbug|\br[eé]gres|\bfaux positif|\bmenu refuge/.test(t)) {
    return 'fix'
  }
  if (
    /\bajout|\bnouveau|\bnouvel|\bcreate|\bimpl[eé]ment|\bintroduit|\bcr[eé][eé]|\badd\b|\bpipeline|\bonglet\b/.test(
      t,
    )
  ) {
    return 'add'
  }
  if (
    /\bmodif|\bm[aà]j\b|\bupdate|\brefactor|\bharmon|\bpolish|\bwording|\blayout|\bcss|\bnormalis|\bparse|\bfiltre|\bmigration/.test(
      t,
    )
  ) {
    return 'mod'
  }
  return 'info'
}

/** @param {Partial<ChangeItem> & { text: string }} row */
function enrichChange(row, hints = {}) {
  const category = row.category ?? inferChangeCategory(row.text, hints)
  return {
    ...row,
    category,
    categoryLabel: categoryLabel(category),
  }
}

/** @param {ChangeItem[]} changes */
function countTypeStats(changes) {
  const stats = { add: 0, mod: 0, del: 0, fix: 0, info: 0 }
  for (const row of changes) {
    if (stats[row.type] != null) stats[row.type] += 1
  }
  return stats
}

/** @param {ChangeItem[]} changes */
function countCategoryStats(changes) {
  /** @type {Record<string, number>} */
  const stats = {}
  for (const row of changes) {
    const key = row.category || 'meta'
    stats[key] = (stats[key] ?? 0) + 1
  }
  return stats
}

/** @param {ReleaseBlock} release */
function withStats(release) {
  const hints = { sectionTitle: release.source, source: release.source }
  const changes = (release.changes ?? []).map((row) => enrichChange(row, hints))
  return {
    ...release,
    changes,
    stats: countTypeStats(changes),
    categoryStats: countCategoryStats(changes),
  }
}

function readCurrentVersion(root) {
  let pkg = { version: '0.0.0' }
  let revision = { revision: 0, subRevision: 0 }
  try {
    pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  } catch {
    /* ignore */
  }
  try {
    revision = JSON.parse(readFileSync(join(root, 'build-revision.json'), 'utf8'))
  } catch {
    /* ignore */
  }
  const [a, b, c] = String(pkg.version ?? '0.0.0').split('.').map((n) => Number.parseInt(n, 10) || 0)
  const x = revision.revision ?? 0
  const y = revision.subRevision ?? 0
  const ab = `${a}.${b}`
  const label = y > 0 ? `v${pkg.version}.${x}.${y}` : `v${pkg.version}.${x}`
  return { semver: pkg.version ?? '0.0.0', a, b, c, x, y, ab, label }
}

function isCompleteDevLogSection(block) {
  const headerLine = block.split('\n')[0] ?? ''
  if (/À COMPLÉTER|à compléter/i.test(headerLine)) return false
  if (/Artefact hook|artefacts hook/i.test(headerLine)) return false
  const butMatch = block.match(/\*\*But du prompt\s*:\*\*\s*(.+)/i)
  if (/à compléter/i.test(butMatch?.[1] ?? '')) return false
  if (/^\d+\s*…\s*X=\d+/i.test(headerLine)) return false
  return true
}

/** @param {string} root */
function parseDevLogChanges(root) {
  const cfg = readVersionConfig(root)
  const path = join(root, cfg.devLogRelativePath)
  if (!existsSync(path)) return []

  const md = readFileSync(path, 'utf8')
  const sections = md.split(/^### X=/m).slice(1)
  /** @type {ChangeItem[]} */
  const changes = []

  for (const block of sections) {
    if (!isCompleteDevLogSection(block)) continue

    const headerLine = block.split('\n')[0] ?? ''
    const headerMatch = headerLine.match(/^(\d+)\s*—\s*([^—]+)—\s*(.+)$/u)
    const xNum = headerMatch ? Number.parseInt(headerMatch[1], 10) : null
    const date = headerMatch?.[2]?.trim() ?? ''
    const sectionTitle = headerMatch?.[3]?.trim() ?? ''
    const hints = { sectionTitle, source: sectionTitle }

    const rows = [...block.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]*)\|\s*([^|]*)\|/gm)]
    for (const row of rows) {
      if (row[0].includes('---')) continue
      const yNum = Number.parseInt(row[1], 10)
      if (!Number.isFinite(yNum) || yNum === 0) continue
      const summary = row[2].trim().replace(/`/g, '')
      if (!summary || summary === 'Résumé' || summary === 'version:prompt') continue

      changes.push(
        enrichChange(
          {
            type: inferChangeType(summary),
            text: summary,
            ref: xNum != null ? `X=${xNum} · Y=${yNum}` : undefined,
            date: date || undefined,
            source: sectionTitle ? sectionTitle.slice(0, 80) : 'DEV_LOG',
          },
          hints,
        ),
      )
    }
  }

  return changes
}

/** @param {string} root */
export function getProductChangelog(root) {
  const current = readCurrentVersion(root)
  const devLogChanges = parseDevLogChanges(root)

  /** @type {ReleaseBlock} */
  const release22 = withStats({
    ab: current.ab,
    semver: current.semver,
    title: 'Phase 2.2 — retouches libres & Parler curé',
    dateStart: '2026-06-30',
    status: 'en cours',
    current: true,
    summary:
      'Branche feature/2.2 — corrections reviewables, corpus Parler, lanceur dev, infra versionnement. Détail auto depuis DEV_LOG.',
    source: readVersionConfig(root).devLogRelativePath.replace(/\\/g, '/'),
    changes: devLogChanges,
  })

  const curated = CURATED_RELEASES_AB.map((row) =>
    withStats({
      ...row,
      current: false,
    }),
  )

  const releases = [release22, ...curated].sort((a, b) => {
    const [aM, aN] = a.ab.split('.').map(Number)
    const [bM, bN] = b.ab.split('.').map(Number)
    if (aM !== bM) return bM - aM
    return bN - aN
  })

  const totals = countTypeStats(releases.flatMap((r) => r.changes))
  const categoryTotals = countCategoryStats(releases.flatMap((r) => r.changes))

  return {
    ok: true,
    readAt: new Date().toISOString(),
    current: {
      ...current,
      status: 'en cours',
      uiLabel: current.label,
    },
    changeTypes: CHANGE_TYPE_LABELS,
    categories: BACKLOG_CATEGORIES,
    totals,
    categoryTotals,
    releaseCount: releases.length,
    releases,
    notes: [
      'Versions A.B = semver major.minor (ex. 2.2 pour package 2.2.0).',
      'Catégories = mêmes clés que l’onglet Backlog (UI, UX, QoL, dev, contenu…).',
      'Phase 2.2 : détail auto depuis DEV_LOG (sections complètes, Y≥1).',
      'Phases 2.1 / 2.0 / 1.0 : jalons curatés (VERSION-INDEX, project-state).',
      'Prochaine itération : release-events.jsonl + CHANGELOG archivé old_v2.1.',
    ],
  }
}

function groupChangesByCategory(changes) {
  /** @type {Map<string, import('./product-changelog.mjs').ChangeItem[]>} */
  const byCat = new Map()
  for (const row of changes ?? []) {
    const key = row.category || 'meta'
    if (!byCat.has(key)) byCat.set(key, [])
    byCat.get(key).push(row)
  }
  const order = BACKLOG_CATEGORIES.map((c) => c.id)
  return [
    ...order.filter((id) => byCat.has(id)).map((id) => ({ id, label: categoryLabel(id), items: byCat.get(id) })),
    ...[...byCat.keys()]
      .filter((id) => !order.includes(id))
      .map((id) => ({ id, label: categoryLabel(id), items: byCat.get(id) })),
  ]
}

/** @param {ReturnType<typeof getProductChangelog>} data */
export function serializeProductChangelogMarkdown(data) {
  const lines = [
    '# Changelog produit (A.B)',
    '',
    '> **Export auto** — généré par le lanceur dev (`Maj changelog`). Ne pas éditer à la main.',
    `> Dernière compilation : ${data.readAt ?? '—'}`,
    '',
  ]

  for (const release of data.releases ?? []) {
    const abParts = String(release.ab).split('.')
    lines.push(`## A.${abParts[0]} B.${abParts[1] ?? '0'} — ${release.title}`)
    lines.push('')
    if (release.summary) lines.push(release.summary, '')
    if (release.tag) lines.push(`Tag : \`${release.tag}\` · Statut : ${release.status ?? '—'}`, '')
    const stats = release.stats ?? {}
    lines.push(
      `Résumé types : +${stats.add ?? 0} · ~${stats.mod ?? 0} · !${stats.fix ?? 0} · -${stats.del ?? 0} · …${stats.info ?? 0}`,
      '',
    )

    for (const group of groupChangesByCategory(release.changes)) {
      lines.push(`### ${group.label} (${group.items.length})`, '')
      for (const row of group.items) {
        const mark = TYPE_MARK[row.type] ?? row.type
        const ref = row.ref ? ` \`${row.ref}\`` : ''
        lines.push(`- **${mark}** ${row.text}${ref}`)
      }
      lines.push('')
    }
  }

  return `${lines.join('\n').trim()}\n`
}

/** Recompile depuis DEV_LOG + curaté et exporte vers docs/. */
export function compileProductChangelog(root) {
  const data = getProductChangelog(root)
  const md = serializeProductChangelogMarkdown(data)
  const exported = writePanelExport(root, PRODUCT_CHANGELOG_EXPORT, { md, json: data })
  const lineCount = (data.releases ?? []).reduce((n, r) => n + (r.changes?.length ?? 0), 0)
  return {
    ...data,
    compiled: true,
    exported,
    message: `Changelog compilé · ${lineCount} lignes · ${exported.md}`,
  }
}
