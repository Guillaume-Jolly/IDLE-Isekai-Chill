/**
 * Backfill DEV_LOG sections ⚠️ À COMPLÉTER depuis transcripts Cursor.
 * Usage: node scripts/backfill-dev-log-from-transcripts.mjs [--dry-run]
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { devLogPath } from './lib/version-config.mjs'
import { findDevLogOpenBlockEnd } from './lib/dev-log-open-section.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')

const TRANSCRIPTS_ROOT = join(
  process.env.USERPROFILE ?? process.env.HOME ?? '',
  '.cursor/projects/c-Dev-Project-IDLE-Isekai-Chill/agent-transcripts',
)

const SKIP_QUERY_RE =
  /^(Briefly inform the user|Your response was cut off|Okay, let's think|^même X$|^same X$)/i
const NOISE_RE =
  /CONTEXTE PROJET|════════════════|Lire avant d'agir|agent développement \*\*phase/i

/** Overrides manuels (session courante, haute confiance). */
const MANUAL = {
  629: {
    title: 'Brief personnalités compagnons pour ChatGPT',
    but: 'Fichier unique exportable avec panel Parler, Roric/Finn, incohérences sources.',
    ys: ['`COMPANIONS_PERSONALITY_BRIEF_CHATGPT.md`'],
  },
  630: {
    title: 'Launcher — lisibilité dashboard aplati',
    but: 'Priorité lisibilité, scroll page, grille responsive, polices plus grandes (v1.2.42).',
    ys: ['dashboard.html', 'launcher-version 1.2.42'],
  },
  631: {
    title: 'Build app / lanceur empilés verticalement',
    but: 'Panneau versions : Build app au-dessus, Build lanceur en dessous (v1.2.43).',
    ys: ['dashboard.html version-build-stack'],
  },
  633: {
    title: 'Backfill DEV_LOG X/Y depuis transcripts',
    but: 'Mettre à jour tous les X et Y avec transcripts Cursor + regroupement artefacts hook.',
    ys: [
      'scripts/backfill-dev-log-from-transcripts.mjs',
      'scripts/append-missing-dev-log-x.mjs',
      'DEV_LOG_2_2.md',
    ],
  },
  634: {
    title: 'Lanceur dev — logs, monitoring, accueil compact',
    but: 'Itérations dashboard Havre Dev Launcher (logs canaux, monitoring serveurs, UI compacte).',
    ys: ['dashboard.html', 'log-channels.mjs', 'launcher v1.2.56–1.2.65'],
  },
  670: {
    title: 'Historique modif + filtre non documentés',
    but: 'Onglet historique app/lanceur, pleine largeur, maj forcée, toggle entrées synthèse.',
    ys: ['app-version-changelog.mjs', 'dashboard.html', 'append-missing-dev-log-x.mjs'],
  },
}

function extractUserQuery(text) {
  if (!text || typeof text !== 'string') return null
  if (NOISE_RE.test(text) && text.length > 800) return null
  const m = text.match(/<user_query>\s*([\s\S]*?)\s*<\/user_query>/i)
  const raw = (m ? m[1] : text)
    .replace(/<image_files>[\s\S]*?<\/image_files>/gi, '[image]')
    .replace(/<timestamp>[^<]*<\/timestamp>/gi, '')
    .replace(/\[Image\]/gi, '')
    .trim()
  if (!raw || raw.length < 4) return null
  if (SKIP_QUERY_RE.test(raw)) return null
  return raw.split('\n').map((l) => l.trim()).filter(Boolean).join(' ').slice(0, 500)
}

function extractDate(text, fileMtime) {
  const m = text.match(/<timestamp>([^<]+)<\/timestamp>/i)
  if (m) {
    const d = new Date(m[1])
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  return fileMtime.slice(0, 10)
}

function collectTranscriptPrompts() {
  const byDate = new Map()
  if (!existsSync(TRANSCRIPTS_ROOT)) {
    console.warn('Transcripts introuvables:', TRANSCRIPTS_ROOT)
    return byDate
  }

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      const st = statSync(p)
      if (st.isDirectory()) {
        if (name === 'subagents') continue
        walk(p)
        continue
      }
      if (!name.endsWith('.jsonl')) continue
      const mtime = st.mtime.toISOString()
      for (const line of readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean)) {
        try {
          const row = JSON.parse(line)
          if (row.role !== 'user') continue
          const text = (row.message?.content ?? [])
            .filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join('\n')
          const query = extractUserQuery(text)
          if (!query) continue
          const date = extractDate(text, mtime)
          if (date === 'unknown') continue
          if (!byDate.has(date)) byDate.set(date, [])
          byDate.get(date).push({ at: extractDate(text, mtime), query })
        } catch {
          /* skip */
        }
      }
    }
  }

  walk(TRANSCRIPTS_ROOT)

  for (const [date, list] of byDate) {
    const seen = new Set()
    byDate.set(
      date,
      list.filter((p) => {
        const key = p.query.slice(0, 100)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    )
  }
  return byDate
}

function parseIncompleteSections(md) {
  const openStart =
    md.indexOf('## ⚠️ Sections ouvertes') >= 0
      ? md.indexOf('## ⚠️ Sections ouvertes')
      : md.indexOf('## ?? Sections ouvertes')
  if (openStart < 0) return []
  const openEnd = findDevLogOpenBlockEnd(md, openStart)
  const openBlock = md.slice(openStart, openEnd)
  const sections = []
  const re =
    /^### X=(\d+) [—?-] ([^\n]+) [—?-] ([^\n]+)\n([\s\S]*?)(?=\n### X=|\n## Historique complété|\n## Template section X)/gm
  let m
  while ((m = re.exec(openBlock)) !== null) {
    const x = Number.parseInt(m[1], 10)
    const title = m[3].trim()
    const body = m[4]
    const incompleteTitle = /À COMPLÉTER|COMPL[\?É]TER|à compléter|\?\? \? COMPL/i.test(title)
    const incompleteBody = /à compléter|COMPL[\?É]TER|\?\? _\(/i.test(body)
    if (!incompleteTitle && !incompleteBody) continue
    if (/Increments hook|Increment hook|Bloc compteur/i.test(title)) continue
    sections.push({ x, date: m[2].trim(), title, full: m[0] })
  }
  return sections.sort((a, b) => a.x - b.x)
}

function titleFromQuery(query) {
  const q = query.replace(/\s+/g, ' ').trim()
  if (q.length <= 78) return q
  return `${q.slice(0, 75)}…`
}

function padX(x) {
  return String(x).padStart(2, '0')
}

function buildSection(x, date, title, but, yRows, validations, risks) {
  const table = `| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
${yRows.map((r) => `| ${r.y} | ${r.summary} | ${r.commit} | ${r.label} |`).join('\n')}
`
  return `### X=${x} — ${date} — ${title}

**But du prompt :** ${but}

${table}**Validations :** ${validations}
**Risques :** ${risks}

`
}

function buildFromPrompt(x, date, query) {
  const title = titleFromQuery(query)
  return buildSection(
    x,
    date,
    title,
    query,
    [
      { y: 0, summary: '`version:prompt`', commit: '*(non commité)*', label: `\`v2.2.0.${padX(x)}\`` },
      { y: 1, summary: title.slice(0, 120), commit: '*(non commité)*', label: `\`v2.2.0.${padX(x)}.1\`` },
    ],
    'relecture manuelle si lot code touché',
    'backfill transcript 2026-07-06',
  )
}

function buildFromManual(x, date, info) {
  const ys = [
    { y: 0, summary: '`version:prompt`', commit: '*(non commité)*', label: `\`v2.2.0.${padX(x)}\`` },
    ...info.ys.map((s, i) => ({
      y: i + 1,
      summary: s,
      commit: '*(non commité)*',
      label: `\`v2.2.0.${padX(x)}.${i + 1}\``,
    })),
  ]
  return buildSection(x, date, info.title, info.but, ys, 'relecture changelog launcher', 'aucun')
}

function buildRange(from, to, date, count, note) {
  return buildSection(
    from,
    date,
    `X=${from} … X=${to} — increments hook (${count}×)`,
    note,
    [
      {
        y: 0,
        summary: `\`version:prompt\` × ${count}`,
        commit: '—',
        label: `v2.2.0.${padX(from)}…${to}`,
      },
    ],
    'aucune',
    'artefacts hook — ne pas rétro-documenter en détail',
  )
}

function backfill() {
  const logPath = devLogPath(root)
  let md = readFileSync(logPath, 'utf8')
  const incomplete = parseIncompleteSections(md)
  const promptsByDate = collectTranscriptPrompts()

  console.log(`Sections incomplètes: ${incomplete.length}`)

  const byDate = new Map()
  for (const s of incomplete) {
    if (!byDate.has(s.date)) byDate.set(s.date, [])
    byDate.get(s.date).push(s)
  }

  const replacements = new Map()

  for (const [date, sections] of [...byDate.entries()].sort()) {
    const prompts = [...(promptsByDate.get(date) ?? [])]
    let pi = 0

    let hookRun = []

    const flushHookRun = () => {
      if (hookRun.length === 0) return
      if (hookRun.length === 1) {
        const s = hookRun[0]
        replacements.set(
          s.x,
          buildSection(
            s.x,
            date,
            `Increment hook (X=${s.x})`,
            'Increment X automatique (hook Cursor) — prompt métier non retrouvé dans transcripts datés.',
            [{ y: 0, summary: '`version:prompt`', commit: '—', label: `\`v2.2.0.${padX(s.x)}\`` }],
            'aucune',
            'artefact hook',
          ),
        )
      } else {
        const from = hookRun[0].x
        const to = hookRun[hookRun.length - 1].x
        replacements.set(
          from,
          buildRange(
            from,
            to,
            date,
            hookRun.length,
            `${hookRun.length} increments X (${from}→${to}) sans prompt transcript distinct pour ${date} — hook / relances session.`,
          ),
        )
        for (let i = 1; i < hookRun.length; i++) replacements.set(hookRun[i].x, '___REMOVE___')
      }
      hookRun = []
    }

    for (const s of sections) {
      if (MANUAL[s.x]) {
        flushHookRun()
        replacements.set(s.x, buildFromManual(s.x, date, MANUAL[s.x]))
        continue
      }

      if (pi < prompts.length) {
        flushHookRun()
        replacements.set(s.x, buildFromPrompt(s.x, date, prompts[pi].query))
        pi++
      } else {
        hookRun.push(s)
      }
    }
    flushHookRun()
  }

  let applied = 0
  let removed = 0
  for (const s of incomplete) {
    const rep = replacements.get(s.x)
    if (!rep) continue
    if (rep === '___REMOVE___') {
      md = md.replace(s.full, '')
      removed++
      continue
    }
    if (md.includes(s.full)) {
      md = md.replace(s.full, rep)
      applied++
    }
  }

  md = md.replace(/\n{4,}/g, '\n\n\n')

  console.log(`Remplacées: ${applied}, supprimées (plages): ${removed}`)

  if (dryRun) {
    console.log('Dry-run — fichier non écrit')
    return
  }

  writeFileSync(logPath, md)
  console.log(`Écrit: ${logPath}`)
}

backfill()
