/**
 * État du jeu — fonctionnalités terminées / commencées / envisagées.
 * Catégories alignées sur docs/BACKLOG.md et backlog-taxonomy.mjs.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readVersionConfig } from '../lib/version-config.mjs'
import {
  BACKLOG_CATEGORIES,
  categoryLabel,
  inferChangeCategory,
  normalizeCategoryValue,
} from './backlog-taxonomy.mjs'
import { loadBacklog } from './backlog-store.mjs'
import { SHIPPED_FEATURES } from './game-state-shipped.mjs'
import { writePanelExport } from './panel-export.mjs'

export const GAME_STATE_EXPORT = {
  md: 'docs/traceability/GAME_STATE_SNAPSHOT.md',
  json: 'docs/traceability/GAME_STATE_SNAPSHOT.json',
}

/** @typedef {'shipped'|'started'|'planned'} FeatureMaturity */

/**
 * @typedef {object} GameFeature
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} [categoryLabel]
 * @property {string} [summary]
 * @property {string} [note]
 * @property {FeatureMaturity} maturity
 * @property {string} [source]
 * @property {string} [ref]
 * @property {string} [since]
 * @property {string} [status]
 */

export const MATURITY_LABELS = {
  shipped: 'Terminées',
  started: 'Commencées',
  planned: 'Envisagées',
}

const STARTED_STATUSES = new Set(['actif', 'à affiner'])
const PLANNED_STATUSES = new Set(['idée', 'backlog', 'reporté', 'maybe'])
const SHIPPED_STATUSES = new Set(['done'])

const DEV_LOG_TOOLING_RE =
  /lanceur|launcher|dev-launcher|dev_log|hook|version:prompt|version:task|changelog|backlog|audit|monitoring|semver|build-revision|cursor|validate:|npm run|stack a\.b|product-changelog|game-state|dashboard\.html|server\.mjs/i

const GAME_CATEGORIES = new Set([
  'ui',
  'ux',
  'qol',
  'contenu-plus',
  'contenu-modif',
  'minijeu',
  'parler',
  'assets',
  'event',
])

/** @param {Partial<GameFeature> & Pick<GameFeature, 'title'|'category'|'maturity'>} row */
function normalizeFeature(row) {
  const category = normalizeCategoryValue(row.category) || row.category || 'meta'
  return {
    id: row.id ?? slugify(row.title),
    title: String(row.title ?? '').trim(),
    category,
    categoryLabel: categoryLabel(category),
    summary: row.summary?.trim() || undefined,
    note: row.note?.trim() || undefined,
    maturity: row.maturity,
    source: row.source,
    ref: row.ref,
    since: row.since,
    status: row.status,
  }
}

function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
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

function parseDevLogSectionHeader(block) {
  const headerLine = block.split('\n')[0] ?? ''
  const match = headerLine.match(/^(\d+)\s*—\s*([^—]+)—\s*(.+)$/u)
  if (!match) return null
  return {
    x: Number.parseInt(match[1], 10),
    date: match[2]?.trim() ?? '',
    title: match[3]?.trim() ?? '',
    incomplete: /À COMPLÉTER|à compléter/i.test(headerLine),
  }
}

function countMeaningfulYRows(block) {
  let count = 0
  const rows = [...block.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+)\|/gm)]
  for (const row of rows) {
    if (row[0].includes('---')) continue
    const yNum = Number.parseInt(row[1], 10)
    const summary = row[2]?.trim().replace(/`/g, '') ?? ''
    if (!Number.isFinite(yNum) || yNum === 0) continue
    if (!summary || summary === 'Résumé' || summary === 'version:prompt') continue
    count += 1
  }
  return count
}

/** @param {string} root */
function parseDevLogFeatures(root) {
  const cfg = readVersionConfig(root)
  const path = join(root, cfg.devLogRelativePath)
  if (!existsSync(path)) return { shipped: [], started: [] }

  const md = readFileSync(path, 'utf8')
  const sections = md.split(/^### X=/m).slice(1)
  /** @type {GameFeature[]} */
  const shipped = []
  /** @type {GameFeature[]} */
  const started = []

  for (const block of sections) {
    const header = parseDevLogSectionHeader(block)
    if (!header?.title) continue
    const yCount = countMeaningfulYRows(block)
    if (yCount === 0) continue

    const category = inferChangeCategory(header.title, { sectionTitle: header.title })
    const title = header.title.replace(/\s*⚠️.*$/u, '').trim()
    if (DEV_LOG_TOOLING_RE.test(title)) continue

    const base = {
      id: `devlog-x${header.x}`,
      title,
      category,
      ref: `X=${header.x}`,
      source: 'DEV_LOG',
    }

    if (header.incomplete || !isCompleteDevLogSection(block)) {
      if (GAME_CATEGORIES.has(category)) {
        started.push(normalizeFeature({ ...base, maturity: 'started', note: `${yCount} tâche(s) · en cours` }))
      }
    } else if (GAME_CATEGORIES.has(category)) {
      shipped.push(
        normalizeFeature({
          ...base,
          maturity: 'shipped',
          since: '2.2',
          summary: `${yCount} livrable(s) DEV_LOG`,
        }),
      )
    }
  }

  return { shipped, started }
}

/** @param {import('./backlog-store.mjs').loadBacklog extends Function ? ReturnType<import('./backlog-store.mjs').loadBacklog> : never} backlog */
function featuresFromBacklog(backlog) {
  /** @type {GameFeature[]} */
  const rows = []
  if (!backlog.ok) return rows

  for (const item of backlog.items ?? []) {
    if (item.meta) continue
    const status = String(item.status ?? '').toLowerCase()
    if (status === 'abandonné' || status === 'abandonne') continue

    let maturity /** @type {FeatureMaturity} */ = 'planned'
    if (SHIPPED_STATUSES.has(status)) maturity = 'shipped'
    else if (STARTED_STATUSES.has(status)) maturity = 'started'
    else if (PLANNED_STATUSES.has(status)) maturity = 'planned'
    else if (status) maturity = 'planned'

    rows.push(
      normalizeFeature({
        id: `backlog-${item.id}`,
        title: item.title,
        category: item.category || inferChangeCategory(`${item.title} ${item.note}`, {}),
        summary: item.note || backlogPreview(item.body),
        note: item.note,
        maturity,
        source: 'BACKLOG.md',
        status: item.status,
      }),
    )
  }

  return rows
}

function backlogPreview(body, maxLen = 160) {
  const text = String(body ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen)}…`
}

/** @param {GameFeature[]} list */
function dedupeFeatures(list) {
  const seen = new Set()
  /** @type {GameFeature[]} */
  const out = []
  for (const row of list) {
    const key = `${row.maturity}::${row.id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
  }
  return out
}

/** @param {GameFeature[]} features */
function countByMaturity(features) {
  return {
    shipped: features.filter((r) => r.maturity === 'shipped').length,
    started: features.filter((r) => r.maturity === 'started').length,
    planned: features.filter((r) => r.maturity === 'planned').length,
  }
}

/** @param {GameFeature[]} features */
function countByCategory(features) {
  /** @type {Record<string, number>} */
  const stats = {}
  for (const row of features) {
    const key = row.category || 'meta'
    stats[key] = (stats[key] ?? 0) + 1
  }
  return stats
}

/** @param {GameFeature[]} features @param {FeatureMaturity} maturity */
function groupByCategory(features, maturity) {
  const filtered = features.filter((r) => r.maturity === maturity)
  /** @type {Record<string, GameFeature[]>} */
  const groups = {}
  for (const row of filtered) {
    const key = row.category || 'meta'
    if (!groups[key]) groups[key] = []
    groups[key].push(row)
  }
  const order = BACKLOG_CATEGORIES.map((c) => c.id)
  return order
    .filter((id) => groups[id]?.length)
    .map((id) => ({
      category: id,
      categoryLabel: categoryLabel(id),
      items: groups[id],
    }))
    .concat(
      Object.keys(groups)
        .filter((id) => !order.includes(id))
        .map((id) => ({
          category: id,
          categoryLabel: categoryLabel(id),
          items: groups[id],
        })),
    )
}

/** @param {string} root */
export function getGameState(root) {
  const backlog = loadBacklog(root)
  const devLog = parseDevLogFeatures(root)

  const shippedCurated = SHIPPED_FEATURES.map((row) =>
    normalizeFeature({ ...row, maturity: 'shipped' }),
  )

  const all = dedupeFeatures([
    ...shippedCurated,
    ...devLog.shipped,
    ...devLog.started,
    ...featuresFromBacklog(backlog),
  ])

  const maturityTotals = countByMaturity(all)
  const categoryTotals = countByCategory(all)

  return {
    ok: true,
    readAt: new Date().toISOString(),
    maturityLabels: MATURITY_LABELS,
    categories: BACKLOG_CATEGORIES,
    maturityTotals,
    categoryTotals,
    featureCount: all.length,
    tiers: {
      shipped: groupByCategory(all, 'shipped'),
      started: groupByCategory(all, 'started'),
      planned: groupByCategory(all, 'planned'),
    },
    features: all,
    notes: [
      'Terminées = jeu livré (curaté 2.1/2.2) + backlog done + sections DEV_LOG complètes (hors dev/infra/meta).',
      'Commencées = backlog actif / à affiner + sections DEV_LOG ⚠️ avec au moins une tâche Y.',
      'Envisagées = backlog idée · backlog · reporté · maybe (docs/BACKLOG.md).',
      'Catégories identiques à l’onglet Backlog.',
    ],
    sources: {
      shippedCurated: shippedCurated.length,
      devLog: devLog.shipped.length + devLog.started.length,
      backlog: backlog.ok ? backlog.itemCount : 0,
    },
  }
}

/** @param {ReturnType<typeof getGameState>} data */
export function serializeGameStateMarkdown(data) {
  const lines = [
    '# État du jeu — snapshot',
    '',
    '> **Export auto** — généré par le lanceur dev (`Maj état du jeu`). Ne pas éditer à la main.',
    `> Dernière compilation : ${data.readAt ?? '—'}`,
    '',
    `**${data.featureCount ?? 0}** fonctionnalités · Terminées **${data.maturityTotals?.shipped ?? 0}** · Commencées **${data.maturityTotals?.started ?? 0}** · Envisagées **${data.maturityTotals?.planned ?? 0}**`,
    '',
  ]

  for (const [tierKey, tierLabel] of Object.entries(data.maturityLabels ?? {})) {
    const groups = data.tiers?.[tierKey] ?? []
    if (!groups.length) continue
    lines.push(`## ${tierLabel}`, '')
    for (const group of groups) {
      lines.push(`### ${group.categoryLabel} (${group.items.length})`, '')
      for (const row of group.items) {
        const bits = [row.title]
        if (row.summary) bits.push(`— ${row.summary}`)
        if (row.since) bits.push(`_(depuis ${row.since})_`)
        if (row.ref) bits.push(`\`${row.ref}\``)
        lines.push(`- ${bits.join(' ')}`)
      }
      lines.push('')
    }
  }

  return `${lines.join('\n').trim()}\n`
}

/** Recompile depuis curaté + backlog + DEV_LOG et exporte vers docs/. */
export function compileGameState(root) {
  const data = getGameState(root)
  const md = serializeGameStateMarkdown(data)
  const exported = writePanelExport(root, GAME_STATE_EXPORT, { md, json: data })
  return {
    ...data,
    compiled: true,
    exported,
    message: `État du jeu compilé · ${data.featureCount ?? 0} entrées · ${exported.md}`,
  }
}
