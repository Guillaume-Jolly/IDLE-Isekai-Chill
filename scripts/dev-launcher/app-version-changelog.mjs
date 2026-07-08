/**
 * Historique version app (A.B.C.X.Y) pour le dashboard dev.
 * Sources : release-events.jsonl, DEV_LOG phase, VERSION-INDEX.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readVersionConfig } from '../lib/version-config.mjs'

const SEGMENT_INFO = {
  A: {
    label: 'A — MEP',
    hint: 'Mise en production (semver major). Déclenché manuellement via version:mep.',
  },
  B: {
    label: 'B — Push main',
    hint: 'Intégration sur main (minor semver). Hook pre-push branche main.',
  },
  C: {
    label: 'C — Push branche',
    hint: 'Itération branche feature (patch semver). Hook pre-push branche de travail.',
  },
  X: {
    label: 'X — Prompt',
    hint: 'Nouveau prompt utilisateur / session agent. Hook Cursor ou version:prompt.',
  },
  Y: {
    label: 'Y — Tâche',
    hint: 'Sous-tâche dans un prompt. Visible seulement si le prompt X a au moins deux tâches (Y≥2) — alors toutes les Y de ce X sont listées.',
  },
}

/** @param {unknown} raw */
export function normalizePageLimit(raw) {
  const n = Number.parseInt(String(raw ?? ''), 10)
  if (n === 50 || n === 100) return n
  return 10
}

function readText(root, relPath) {
  const path = join(root, relPath)
  if (!existsSync(path)) return ''
  return readFileSync(path, 'utf8')
}

function parseReleaseEvents(root) {
  const cfg = readVersionConfig(root)
  const raw = readText(root, cfg.releaseEventsRelativePath)
  const entries = { A: [], B: [], C: [] }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    try {
      const row = JSON.parse(trimmed)
      const segment = row.segment
      if (!['A', 'B', 'C'].includes(segment)) continue
      entries[segment].push({
        id: `${segment}-${row.after ?? row.at}`,
        segment,
        key: row.after ?? row.before ?? '?',
        sortKey: semverSortKey(row.after ?? row.before ?? '0.0.0'),
        label: row.after ? `v${row.after}` : segment,
        title: row.trigger === 'mep' ? 'MEP production' : row.trigger ?? row.reason ?? 'Release',
        lines: [
          row.before && row.after ? `${row.before} → ${row.after}` : null,
          row.branch ? `Branche : ${row.branch}` : null,
          row.at ? `Date : ${new Date(row.at).toLocaleString('fr-FR')}` : null,
        ].filter(Boolean),
        at: row.at ?? null,
      })
    } catch {
      /* ligne invalide */
    }
  }
  for (const seg of ['A', 'B', 'C']) {
    entries[seg].sort((a, b) => b.sortKey - a.sortKey)
  }
  return entries
}

function semverSortKey(semver) {
  const parts = String(semver)
    .replace(/^v/i, '')
    .split('.')
    .map((n) => Number.parseInt(n, 10) || 0)
  return parts[0] * 1_000_000 + (parts[1] ?? 0) * 1_000 + (parts[2] ?? 0)
}

function parseVersionIndex(root) {
  const cfg = readVersionConfig(root)
  const md = readText(root, cfg.versionIndexRelativePath)
  const entries = { A: [], B: [], C: [] }
  const semverRows = [...md.matchAll(/^\|\s*\*?\*?([0-9]+\.[0-9]+\.[0-9]+)\*?\*?\s*\|\s*([^|]+)\|\s*([^|]+)\|/gm)]
  for (const match of semverRows) {
    const semver = match[1].trim()
    const date = match[2].trim()
    const summary = match[3].trim().replace(/\*\*/g, '')
    const sortKey = semverSortKey(semver)
    const item = {
      id: `index-${semver}`,
      segment: sortKey >= 2_002_000 ? 'B' : 'A',
      key: semver,
      sortKey,
      label: `v${semver}`,
      title: summary.slice(0, 120),
      lines: [`Jalon documenté · ${date}`, summary],
      at: null,
      source: 'VERSION-INDEX',
    }
    if (semver.startsWith('2.2.')) entries.C.push({ ...item, segment: 'C' })
    else entries.B.push(item)
  }
  return entries
}

function parseDevLog(root) {
  const cfg = readVersionConfig(root)
  const md = readText(root, cfg.devLogRelativePath)
  const xEntries = []
  const yEntries = []
  const sections = md.split(/^### /m).slice(1)

  for (const block of sections) {
    const headerLine = block.split('\n')[0] ?? ''
    const headerMatch = headerLine.match(/^X=(\d+(?:\s*…\s*X=\d+)?)\s*—\s*([^—]+)—\s*(.+)$/u)
    if (!headerMatch) continue

    const xKeyRaw = headerMatch[1].trim()
    const date = headerMatch[2].trim()
    const title = headerMatch[3].trim()

    const butMatch = block.match(/\*\*But du prompt\s*:\*\*\s*(.+)/i)
    const validationsMatch = block.match(/\*\*Validations\s*:\*\*\s*(.+)/i)
    const risksMatch = block.match(/\*\*Risques\s*:\*\*\s*(.+)/i)

    const rangeMatch = xKeyRaw.match(/^(\d+)\s*…\s*X=(\d+)$/)
    const xNum = rangeMatch ? Number.parseInt(rangeMatch[1], 10) : Number.parseInt(xKeyRaw, 10)
    if (!Number.isFinite(xNum)) continue

    const xLines = [
      butMatch?.[1]?.trim(),
      validationsMatch?.[1]?.trim() ? `Validations : ${validationsMatch[1].trim()}` : null,
      risksMatch?.[1]?.trim() ? `Risques : ${risksMatch[1].trim()}` : null,
    ].filter(Boolean)

    const incomplete =
      /À COMPLÉTER|à compléter/i.test(title) ||
      /à compléter/i.test(butMatch?.[1] ?? '')

    const entryBase = {
      incomplete,
      at: date,
    }

    if (rangeMatch) {
      xEntries.push({
        id: `X-${xKeyRaw}`,
        segment: 'X',
        key: xNum,
        sortKey: xNum,
        label: `X=${xKeyRaw}`,
        title: title || 'Artefacts hook',
        lines: xLines.length ? xLines : [`Plage ${xKeyRaw} · ${date}`],
        ...entryBase,
        meta: { xFrom: xNum, xTo: Number.parseInt(rangeMatch[2], 10) },
      })
    } else {
      xEntries.push({
        id: `X-${xNum}`,
        segment: 'X',
        key: xNum,
        sortKey: xNum,
        label: `X=${xNum}`,
        title,
        lines: xLines.length
          ? xLines
          : incomplete
            ? ['Section auto-créée par version:prompt — contenu agent non rédigé.']
            : [`Prompt du ${date}`],
        ...entryBase,
        meta: { x: xNum },
      })
    }

    const tableRows = [...block.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|/gm)]
    for (const row of tableRows) {
      if (row[0].includes('---')) continue
      const yNum = Number.parseInt(row[1], 10)
      if (!Number.isFinite(yNum)) continue
      const summary = row[2].trim().replace(/`/g, '')
      const commit = row[3].trim()
      const labelUi = row[4].trim().replace(/`/g, '') || null
      if (summary === 'Résumé') continue

      yEntries.push({
        id: `Y-${xNum}-${yNum}`,
        segment: 'Y',
        key: `${xNum}.${yNum}`,
        sortKey: xNum * 1000 + yNum,
        label: labelUi ?? `X=${xNum} · Y=${yNum}`,
        title: summary.slice(0, 140),
        lines: [
          `Prompt X=${xNum} · tâche Y=${yNum}`,
          commit && commit !== '*(non commité)*' ? `Commit : ${commit}` : 'Non commité',
          title && !/À COMPLÉTER/i.test(title) ? `Contexte : ${title}` : null,
          incomplete ? '⚠ Prompt parent non documenté dans DEV_LOG.' : null,
        ].filter(Boolean),
        incomplete: incomplete || summary === 'version:prompt',
        at: date,
        meta: { x: xNum, y: yNum, labelUi },
      })
    }
  }

  xEntries.sort((a, b) => b.sortKey - a.sortKey)
  yEntries.sort((a, b) => b.sortKey - a.sortKey)
  return { X: xEntries, Y: yEntries }
}

function maxDocumentedX(xEntries) {
  let max = 0
  for (const entry of xEntries) {
    if (typeof entry.key === 'number') max = Math.max(max, entry.key)
    if (entry.meta?.x != null) max = Math.max(max, entry.meta.x)
    if (entry.meta?.xTo != null) max = Math.max(max, entry.meta.xTo)
    if (entry.meta?.xFrom != null) max = Math.max(max, entry.meta.xFrom)
  }
  return max
}

/** X récents présents dans build-revision mais sans section ### dans DEV_LOG */
function appendUndocumentedXPrompts(xEntries, root) {
  const current = readCurrentVersion(root)
  const liveX = current.x
  if (!Number.isFinite(liveX) || liveX <= 0) return xEntries

  const maxDoc = maxDocumentedX(xEntries)
  if (liveX <= maxDoc) return xEntries

  const from = maxDoc + 1
  const list = [...xEntries]
  if (from === liveX) {
    list.push({
      id: `X-${liveX}-live`,
      segment: 'X',
      key: liveX,
      sortKey: liveX,
      label: `X=${liveX}`,
      title: 'Prompt en cours — absent du DEV_LOG',
      lines: [
        `Version UI : ${current.label}`,
        'Aucune section ### X=… dans DEV_LOG pour ce numéro.',
        'Complétez DEV_LOG en fin de prompt (hook version:prompt).',
      ],
      incomplete: true,
      at: null,
      meta: { x: liveX, live: true },
    })
  } else {
    list.push({
      id: `X-${from}-${liveX}-gap`,
      segment: 'X',
      key: from,
      sortKey: liveX,
      label: `X=${from} … X=${liveX}`,
      title: 'Prompts non documentés dans DEV_LOG',
      lines: [
        `${liveX - maxDoc} numéros X sans section ### (de ${from} à ${liveX}).`,
        `Version actuelle : ${current.label}`,
        'L’historique liste les sections DEV_LOG + cette synthèse depuis build-revision.json.',
      ],
      incomplete: true,
      at: null,
      meta: { xFrom: from, xTo: liveX, live: true },
    })
  }
  list.sort((a, b) => b.sortKey - a.sortKey)
  return list
}

/** Entrée synthèse (build-revision), incomplète DEV_LOG, ou plage hook non détaillée */
export function isUndocumentedChangelogEntry(entry) {
  if (!entry) return false
  if (entry.meta?.live) return true
  if (entry.undocumented) return true
  if (entry.incomplete) return true
  return false
}

function parseIncludeUndocumented(raw) {
  if (raw === '0' || raw === 'false' || raw === 'off') return false
  return true
}

/**
 * Segment Y : n’afficher les tâches d’un prompt X que si max(Y) ≥ 2 sur ce X
 * (ex. 305.1 seul → rien ; 307.1+307.2+307.3 → toutes les Y de 307).
 * @param {Array<{ meta?: { x?: number, y?: number } }>} yEntries
 */
export function filterYEntriesForChangelog(yEntries) {
  const maxYByX = new Map()
  for (const entry of yEntries) {
    const x = entry.meta?.x
    const y = entry.meta?.y
    if (x == null || !Number.isFinite(y)) continue
    maxYByX.set(x, Math.max(maxYByX.get(x) ?? 0, y))
  }
  return yEntries.filter((entry) => {
    const x = entry.meta?.x
    if (x == null) return true
    return (maxYByX.get(x) ?? 0) >= 2
  })
}

function mergeReleaseSegments(events, indexFallback) {
  const merged = { A: [...events.A], B: [...events.B], C: [...events.C] }
  for (const seg of ['A', 'B', 'C']) {
    const seen = new Set(merged[seg].map((e) => e.key))
    for (const item of indexFallback[seg] ?? []) {
      if (!seen.has(item.key)) merged[seg].push(item)
    }
    merged[seg].sort((a, b) => b.sortKey - a.sortKey)
  }
  if (merged.A.length === 0) {
    merged.A.push({
      id: 'A-doc',
      segment: 'A',
      key: 'A',
      sortKey: 0,
      label: 'A',
      title: 'MEP — mise en production',
      lines: [
        'Incrément semver major lors d’une mise en prod validée.',
        'Commande : npm run version:mep (avec accord explicite).',
        'Aucun événement A enregistré dans release-events.jsonl pour l’instant.',
      ],
      at: null,
    })
  }
  if (merged.C.length === 0) {
    merged.C.push({
      id: 'C-doc',
      segment: 'C',
      key: 'C',
      sortKey: 0,
      label: 'C',
      title: 'Push branche — patch semver',
      lines: [
        'Chaque git push sur une branche feature incrémente le patch (ex. 2.2.0 → 2.2.1).',
        'Journal : docs/traceability/changelog/release-events.jsonl',
        'Aucun événement C enregistré pour l’instant sur ce clone.',
      ],
      at: null,
    })
  }
  return merged
}

function loadAllSegments(root) {
  const release = parseReleaseEvents(root)
  const index = parseVersionIndex(root)
  const dev = parseDevLog(root)
  const abc = mergeReleaseSegments(release, index)
  return {
    ...abc,
    X: appendUndocumentedXPrompts(dev.X, root),
    Y: filterYEntriesForChangelog(dev.Y),
  }
}

function readCurrentVersion(root) {
  let pkg = { version: '?' }
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
  const [major, minor, patch] = String(pkg.version ?? '0.0.0').split('.').map(Number)
  const x = revision.revision ?? 0
  const y = revision.subRevision ?? 0
  const label = y > 0 ? `v${pkg.version}.${x}.${y}` : `v${pkg.version}.${x}`
  return {
    semver: pkg.version ?? '?',
    a: major ?? 0,
    b: minor ?? 0,
    c: patch ?? 0,
    x,
    y,
    label,
  }
}

function findGoToOffset(entries, goTo, limit) {
  if (!goTo) return 0
  const raw = String(goTo).trim().replace(/^v/i, '')
  let index = -1

  if (/^[ABCXYZ]$/i.test(raw)) {
    return 0
  }

  const labelMatch = raw.match(/^(\d+\.\d+\.\d+)(?:\.(\d+)(?:\.(\d+))?)?$/)
  if (labelMatch) {
    const [, semver, xStr, yStr] = labelMatch
    if (yStr != null) {
      index = entries.findIndex(
        (e) =>
          e.segment === 'Y' &&
          e.meta?.x === Number.parseInt(xStr, 10) &&
          e.meta?.y === Number.parseInt(yStr, 10),
      )
    } else if (xStr != null) {
      index = entries.findIndex(
        (e) =>
          (e.segment === 'X' && e.key === Number.parseInt(xStr, 10)) ||
          (e.segment === 'Y' && e.meta?.x === Number.parseInt(xStr, 10) && e.meta?.y === 0),
      )
    } else {
      index = entries.findIndex((e) => e.key === semver || e.label === `v${semver}`)
    }
  } else if (/^\d+\.\d+$/.test(raw)) {
    const [xStr, yStr] = raw.split('.')
    index = entries.findIndex(
      (e) => e.segment === 'Y' && e.meta?.x === Number.parseInt(xStr, 10) && e.meta?.y === Number.parseInt(yStr, 10),
    )
  } else if (/^\d+$/.test(raw)) {
    const num = Number.parseInt(raw, 10)
    index = entries.findIndex(
      (e) =>
        e.key === num ||
        e.sortKey === num ||
        e.meta?.x === num ||
        (e.meta?.xFrom != null && e.meta?.xTo != null && num >= e.meta.xFrom && num <= e.meta.xTo),
    )
  }

  if (index < 0) return 0
  return Math.floor(index / limit) * limit
}

/**
 * @param {string} root
 * @param {{ segment?: string, offset?: number, limit?: number, goTo?: string, includeUndocumented?: string }} query
 */
export function getAppVersionChangelogPage(root, query = {}) {
  const segment = String(query.segment ?? 'X').toUpperCase()
  if (!['A', 'B', 'C', 'X', 'Y'].includes(segment)) {
    return { ok: false, error: 'Segment invalide (A, B, C, X, Y).' }
  }

  const limit = normalizePageLimit(query.limit)
  let offset = Math.max(Number.parseInt(query.offset, 10) || 0, 0)
  const includeUndocumented = parseIncludeUndocumented(query.includeUndocumented)

  const all = loadAllSegments(root)
  const rawEntries = all[segment] ?? []
  const undocumentedCount = rawEntries.filter(isUndocumentedChangelogEntry).length
  const entries = includeUndocumented
    ? rawEntries
    : rawEntries.filter((entry) => !isUndocumentedChangelogEntry(entry))
  const total = entries.length

  if (query.goTo) {
    offset = findGoToOffset(entries, query.goTo, limit)
  } else if (offset >= total && total > 0) {
    offset = Math.max(total - limit, 0)
  }

  const page = entries.slice(offset, offset + limit)
  const cfg = readVersionConfig(root)

  return {
    ok: true,
    readAt: new Date().toISOString(),
    sources: {
      devLog: cfg.devLogRelativePath,
      releaseEvents: cfg.releaseEventsRelativePath,
      versionIndex: cfg.versionIndexRelativePath,
    },
    segment,
    segmentInfo: SEGMENT_INFO[segment],
    segments: SEGMENT_INFO,
    includeUndocumented,
    undocumentedCount,
    undocumentedHidden: !includeUndocumented ? undocumentedCount : 0,
    current: readCurrentVersion(root),
    total,
    offset,
    limit,
    pageCount: Math.max(Math.ceil(total / limit), 1),
    pageIndex: total === 0 ? 0 : Math.floor(offset / limit),
    entries: page,
  }
}
