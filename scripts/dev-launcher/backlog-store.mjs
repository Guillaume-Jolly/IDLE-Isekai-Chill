/**
 * Backlog produit — lecture / écriture docs/BACKLOG.md (format sections ## / ###).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  BACKLOG_CATEGORIES,
  BACKLOG_STATUS_PRESETS,
  categoryLabel,
  normalizeCategoryValue,
  normalizeStatusValue,
  splitLegacyStatus,
} from './backlog-taxonomy.mjs'

export { BACKLOG_CATEGORIES, BACKLOG_STATUS_PRESETS, categoryLabel } from './backlog-taxonomy.mjs'

export const BACKLOG_REL = 'docs/BACKLOG.md'

const FOOTER_TITLE_RE = /^autres idées \(template\)|^modèle pour nouvelle entrée/i
const STATUS_RE = /\*\*Statut\s*:\*\*\s*(.+)/i
const CATEGORY_RE = /\*\*Catégorie\s*:\*\*\s*(.+)/i
const NOTE_RE = /\*\*Note\s*:\*\*\s*(.+)/i
const PRIORITY_RE = /\*\*(?:Priorité|Priority)\s*:\*\*\s*(.+)/i

function upsertBodyField(body, field, value) {
  const re = new RegExp(`\\*\\*${field}\\s*:\\*\\*\\s*[^\\n]*`, 'i')
  const line = `**${field} :** ${value}`
  if (re.test(body)) return body.replace(re, line)
  if (/<!--\s*backlog-id:/i.test(body)) {
    return body.replace(/(<!--\s*backlog-id:[^>]+>\s*\n?)/i, `$1${line}\n`)
  }
  return `${line}\n\n${body}`.trim()
}

function parseItemFields(body) {
  const statusRaw = body.match(STATUS_RE)?.[1]?.trim() ?? ''
  const categoryRaw = body.match(CATEGORY_RE)?.[1]?.trim() ?? ''
  let status = normalizeStatusValue(statusRaw)
  let legacyNote = ''
  if (!status && statusRaw) {
    const split = splitLegacyStatus(statusRaw)
    status = split.status
    legacyNote = split.note
  }
  const category = normalizeCategoryValue(categoryRaw)
  const note = body.match(NOTE_RE)?.[1]?.trim() ?? legacyNote
  return { status, category, note, categoryLabel: categoryLabel(category) }
}

function applyItemMetaToBody(body, { status, category, note }) {
  let next = body
  if (status != null) next = upsertBodyField(next, 'Statut', status)
  if (category != null) next = upsertBodyField(next, 'Catégorie', categoryLabel(category) || category)
  if (note != null && note.trim()) {
    next = upsertBodyField(next, 'Note', note.trim())
  }
  return next
}

function slugify(title) {
  return String(title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'item'
}

function extractId(body, title, used) {
  const match = body.match(/<!--\s*backlog-id:\s*([a-z0-9-]+)\s*-->/i)
  if (match) return match[1]
  let base = slugify(title)
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}

function ensureIdComment(body, id) {
  const trimmed = String(body ?? '').trim()
  if (/<!--\s*backlog-id:/i.test(trimmed)) {
    return trimmed.replace(/<!--\s*backlog-id:\s*[a-z0-9-]+\s*-->/i, `<!-- backlog-id: ${id} -->`)
  }
  return `<!-- backlog-id: ${id} -->\n\n${trimmed}`.trim()
}

function parseBlock(block, orderStart, usedIds) {
  const trimmed = block.trim()
  if (!trimmed) return []

  const lines = trimmed.split('\n')
  const items = []
  let i = 0
  let order = orderStart

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const h3 = line.match(/^###\s+(.+)$/)
    const h2 = line.match(/^##\s+(.+)$/)
    if (!h2 && !h3) {
      i += 1
      continue
    }

    const level = h3 ? 3 : 2
    const title = (h3?.[1] ?? h2?.[1] ?? '').trim()
    i += 1
    const bodyLines = []
    while (i < lines.length && !/^#{2,3}\s/.test(lines[i])) {
      bodyLines.push(lines[i])
      i += 1
    }

    let body = bodyLines.join('\n').trim()
    const id = extractId(body, title, usedIds)
    usedIds.add(id)
    body = ensureIdComment(body, id)

    const statusMatch = body.match(STATUS_RE)
    const priorityMatch = body.match(PRIORITY_RE)
    const fields = parseItemFields(body)

    items.push({
      id,
      level,
      title,
      status: fields.status,
      category: fields.category,
      categoryLabel: fields.categoryLabel,
      note: fields.note,
      priority: priorityMatch?.[1]?.trim() ?? '',
      body,
      order,
      meta: FOOTER_TITLE_RE.test(title),
    })
    order += 1
  }

  return items
}

/**
 * @param {string} md
 */
export function parseBacklogMarkdown(md) {
  const parts = String(md).split(/\n---\n/)
  const preamble = parts[0]?.trim() ?? ''
  const usedIds = new Set()
  const parsed = []

  for (let i = 1; i < parts.length; i += 1) {
    const blockItems = parseBlock(parts[i], parsed.length, usedIds)
    parsed.push(...blockItems)
  }

  const footerIdx = parsed.findIndex((item) => item.meta)
  const footer = footerIdx >= 0 ? parsed.splice(footerIdx) : []
  parsed.forEach((item, idx) => {
    item.order = idx
  })
  footer.forEach((item, idx) => {
    item.order = idx
  })

  return { preamble, items: parsed, footer }
}

/**
 * @param {{ preamble: string, items: object[], footer?: object[] }} data
 */
export function serializeBacklogMarkdown(data) {
  const chunks = [String(data.preamble ?? '').trim()]
  const all = [...(data.items ?? []), ...(data.footer ?? [])]
  for (const item of all) {
    const header = item.level === 3 ? `### ${item.title}` : `## ${item.title}`
    const body = ensureIdComment(item.body ?? '', item.id)
    chunks.push(`${header}\n\n${body}`.trim())
  }
  return `${chunks.filter(Boolean).join('\n\n---\n\n')}\n`
}

export function backlogPath(root) {
  return join(root, BACKLOG_REL)
}

export function loadBacklog(root) {
  const path = backlogPath(root)
  if (!existsSync(path)) {
    return {
      ok: false,
      error: `${BACKLOG_REL} introuvable.`,
      path: BACKLOG_REL,
    }
  }
  const md = readFileSync(path, 'utf8')
  const parsed = parseBacklogMarkdown(md)
  return {
    ok: true,
    path: BACKLOG_REL,
    readAt: new Date().toISOString(),
    ...parsed,
    itemCount: parsed.items.length,
  }
}

export function saveBacklog(root, data) {
  const path = backlogPath(root)
  const md = serializeBacklogMarkdown(data)
  writeFileSync(path, md, 'utf8')
  return loadBacklog(root)
}

function findItemIndex(items, id) {
  return items.findIndex((item) => item.id === id)
}

export function createBacklogItem(root, payload) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  const used = new Set([...data.items, ...data.footer].map((i) => i.id))
  const title = String(payload.title ?? 'Nouvelle entrée').trim() || 'Nouvelle entrée'
  const id = payload.id && !used.has(payload.id) ? payload.id : extractId('', title, used)
  const status = normalizeStatusValue(payload.status ?? 'idée') || 'idée'
  const category = normalizeCategoryValue(payload.category ?? 'contenu-plus') || 'contenu-plus'
  const level = payload.level === 3 ? 3 : 2
  let body = String(payload.body ?? '').trim()
  body = applyItemMetaToBody(body, { status, category, note: payload.note ?? '' })
  if (!STATUS_RE.test(body)) {
    body = applyItemMetaToBody('', { status, category, note: payload.note ?? '' })
    body = `${body}\n\n${String(payload.body ?? '').trim()}`.trim()
  }
  body = ensureIdComment(body, id)

  const item = {
    id,
    level,
    title,
    status,
    category,
    categoryLabel: categoryLabel(category),
    note: String(payload.note ?? '').trim(),
    priority: String(payload.priority ?? '').trim(),
    body,
    order: data.items.length,
    meta: false,
  }

  if (payload.afterId) {
    const idx = findItemIndex(data.items, payload.afterId)
    if (idx >= 0) data.items.splice(idx + 1, 0, item)
    else data.items.push(item)
  } else if (payload.beforeId) {
    const idx = findItemIndex(data.items, payload.beforeId)
    if (idx >= 0) data.items.splice(idx, 0, item)
    else data.items.push(item)
  } else {
    data.items.push(item)
  }

  data.items.forEach((row, idx) => {
    row.order = idx
  })

  const saved = saveBacklog(root, data)
  return { ...saved, created: item }
}

export function updateBacklogItem(root, id, payload) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  const all = [...data.items, ...data.footer]
  const item = all.find((row) => row.id === id)
  if (!item) return { ok: false, error: `Entrée « ${id} » introuvable.` }
  if (item.meta && payload.title && !payload.forceMeta) {
    return { ok: false, error: 'Section modèle — modification du titre bloquée.' }
  }

  if (payload.title != null) item.title = String(payload.title).trim() || item.title
  if (payload.level === 2 || payload.level === 3) item.level = payload.level
  if (payload.body != null) item.body = ensureIdComment(String(payload.body), item.id)
  if (payload.status != null) {
    item.status = normalizeStatusValue(payload.status) || String(payload.status).trim()
    item.body = upsertBodyField(item.body, 'Statut', item.status)
  }
  if (payload.category != null) {
    item.category = normalizeCategoryValue(payload.category) || String(payload.category).trim()
    item.categoryLabel = categoryLabel(item.category)
    item.body = upsertBodyField(item.body, 'Catégorie', item.categoryLabel)
  }
  if (payload.note != null) {
    item.note = String(payload.note).trim()
    if (item.note) item.body = upsertBodyField(item.body, 'Note', item.note)
  }
  if (payload.priority != null) {
    item.priority = String(payload.priority).trim()
    if (PRIORITY_RE.test(item.body)) {
      item.body = item.body.replace(PRIORITY_RE, `**Priorité :** ${item.priority}`)
    } else if (item.priority) {
      item.body = item.body.replace(
        /(\*\*Statut\s*:\*\*[^\n]*\n)/i,
        `$1**Priorité :** ${item.priority}\n`,
      )
    }
  }

  const saved = saveBacklog(root, data)
  return { ...saved, updated: item }
}

export function deleteBacklogItem(root, id) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  const idx = findItemIndex(data.items, id)
  if (idx < 0) {
    const fIdx = findItemIndex(data.footer, id)
    if (fIdx < 0) return { ok: false, error: `Entrée « ${id} » introuvable.` }
    return { ok: false, error: 'Impossible de supprimer une section modèle / pied de page.' }
  }

  const removed = data.items.splice(idx, 1)[0]
  data.items.forEach((row, i) => {
    row.order = i
  })
  const saved = saveBacklog(root, data)
  return { ...saved, removed }
}

export function reorderBacklogItems(root, order) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  const ids = Array.isArray(order) ? order.map(String) : []
  const byId = new Map(data.items.map((item) => [item.id, item]))
  const next = []
  for (const id of ids) {
    if (byId.has(id)) {
      next.push(byId.get(id))
      byId.delete(id)
    }
  }
  for (const item of data.items) {
    if (byId.has(item.id)) next.push(item)
  }
  data.items = next.map((item, idx) => ({ ...item, order: idx }))
  return saveBacklog(root, data)
}

/** Normalise statut + catégorie sur toutes les entrées éditables. */
export function normalizeAllBacklogItems(root) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  for (const item of data.items) {
    const fields = parseItemFields(item.body)
    item.body = applyItemMetaToBody(item.body, {
      status: fields.status || 'idée',
      category: fields.category || inferCategoryFromItem(item),
      note: fields.note,
    })
    Object.assign(item, parseItemFields(item.body))
  }

  return saveBacklog(root, data)
}

/** @param {{ id: string, title: string }} item */
function inferCategoryFromItem(item) {
  const map = {
    'dev-cache-chargement-assets': 'dev',
    'old-assets-deplacement-hors-repo': 'infra',
    'parler-generation-procedurale-linkcorpusv2': 'parler',
    'comment-ajouter-une-entree': 'meta',
    'idees-mini-jeux-modes-de-jeu': 'minijeu',
    'top-war-like-plateformes-aleatoires': 'minijeu',
    'capybara-go-like-aventure-rp': 'minijeu',
    'war-thunder-like-tir-lateral-vagues-evolution': 'minijeu',
    'refuge-mini-jeux-avec-compagnons-myrions': 'minijeu',
    'dressage-mini-jeux-dedies-par-myrion': 'minijeu',
    'mini-course-course-de-chocobo': 'minijeu',
    'combat-style-criquet-wwm': 'minijeu',
    'caresser-main-fixe-animation': 'minijeu',
    'modes-de-jeu-combat-auto': 'minijeu',
    'tft-auto-battler-myrions-compagnons': 'minijeu',
    'raid-boss-compagnons-regroupes-style-rpg': 'minijeu',
    'vampire-survivors-like': 'minijeu',
    'gestion-refuge-etendu': 'qol',
    'mini-jeux-de-gestion-zoo-auberge': 'minijeu',
    'refuge-onglets-ferme-mine-donjon': 'contenu-plus',
    'event-disagrea-compagnons-invites': 'event',
    'pleinair-paliers-affinite-2-5-proximite-enfant': 'assets',
    'skinline-premium-skins-intimes-caches-v4': 'contenu-plus',
  }
  return map[item.id] ?? 'contenu-plus'
}

const STATUS_OVERRIDE = {
  'skinline-premium-skins-intimes-caches-v4': 'backlog',
}

const LEGACY_STATUS_NOTES = {
  'dev-cache-chargement-assets':
    'Phase 2.2 — warmup splash + village + gacha + myrions + hub + compagnons (`gameWarmupPaths.ts`, `gameAssetWarmup.ts`)',
  'old-assets-deplacement-hors-repo': 'Premier tri en fin de nettoyage repo, puis archivage disque',
  'parler-generation-procedurale-linkcorpusv2':
    'Très tardif — après base curée stable pour tous les compagnons',
  'pleinair-paliers-affinite-2-5-proximite-enfant':
    'À traiter avant intégration jeu / regénération visuelle',
  'skinline-premium-skins-intimes-caches-v4': 'Assets prêts — intégration jeu à planifier',
}

/** Migration one-shot : statuts courts + catégories + notes déplacées. */
export function migrateBacklogTaxonomy(root) {
  const data = loadBacklog(root)
  if (!data.ok) return data

  for (const item of data.items) {
    const rawStatus = item.body.match(STATUS_RE)?.[1]?.trim() ?? ''
    const split = splitLegacyStatus(rawStatus)
    const status =
      STATUS_OVERRIDE[item.id] || split.status || normalizeStatusValue(rawStatus) || 'idée'
    const category = normalizeCategoryValue(item.body.match(CATEGORY_RE)?.[1]) || inferCategoryFromItem(item)
    const note =
      item.body.match(NOTE_RE)?.[1]?.trim() ||
      LEGACY_STATUS_NOTES[item.id] ||
      split.note ||
      ''

    item.body = applyItemMetaToBody(item.body, { status, category, note })
    Object.assign(item, parseItemFields(item.body))
  }

  const saved = saveBacklog(root, data)
  return { ...saved, migrated: data.items.length }
}
