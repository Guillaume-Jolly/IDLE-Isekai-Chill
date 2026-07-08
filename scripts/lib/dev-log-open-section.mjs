/**
 * Injecte une section ⚠️ À COMPLÉTER dans DEV_LOG (chemin via version.config.json).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { devLogPath, projectLabel } from './version-config.mjs'

const OPEN_HEADER = '## ⚠️ Sections ouvertes (X non finalisés)'
const OPEN_HEADER_ALT = '## ?? Sections ouvertes (X non finalis?s)'
const COMMIT_ANCHOR = '**Commit :** 1 commit'
const OPEN_BLOCK_END_MARKERS = [
  '## Historique complété',
  '## Template section X',
  '## Template section',
]

export function findDevLogOpenBlockEnd(content, openHeaderIdx) {
  let end = content.length
  for (const marker of OPEN_BLOCK_END_MARKERS) {
    const idx = content.indexOf(marker, openHeaderIdx)
    if (idx >= 0) end = Math.min(end, idx)
  }
  return end
}

export function maxDocumentedXInDevLog(content) {
  const nums = [...content.matchAll(/^### X=(\d+)/gm)].map((m) => Number.parseInt(m[1], 10))
  return nums.length ? Math.max(...nums) : 0
}

export function appendDevLogOpenSection(root, revision, versionLabel) {
  const logPath = devLogPath(root)
  const label = projectLabel(root)

  if (!existsSync(logPath)) {
    console.warn(`[${label}] DEV_LOG introuvable (${logPath}) — section ouverte non injectée`)
    return
  }

  const date = new Date().toISOString().slice(0, 10)
  const section = `### X=${revision} — ${date} — ⚠️ À COMPLÉTER

**But du prompt :** ⚠️ _(à compléter — relire le message user de ce prompt)_

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`${versionLabel}\` |

**Validations :** ⚠️ _…_
**Risques :** ⚠️ _…_

`

  let content = readFileSync(logPath, 'utf8')

  const openHeader = content.includes(OPEN_HEADER)
    ? OPEN_HEADER
    : content.includes(OPEN_HEADER_ALT)
      ? OPEN_HEADER_ALT
      : null

  if (!openHeader) {
    const anchorIdx = content.indexOf(COMMIT_ANCHOR)
    if (anchorIdx < 0) {
      console.warn(`[${label}] Ancre DEV_LOG introuvable — section ouverte non injectée`)
      return
    }
    const lineEnd = content.indexOf('\n', anchorIdx)
    const anchorLine = content.slice(anchorIdx, lineEnd >= 0 ? lineEnd : content.length)
    content = content.replace(
      anchorLine,
      `${OPEN_HEADER}

> Injecté par \`npm run version:prompt\` / hook Cursor. **Compléter en fin de prompt** (titre, but, Y, validations).

${anchorLine}`,
    )
  }

  const sectionHeaderRe = new RegExp(`^### X=${revision} [—?\\-]`, 'm')
  if (sectionHeaderRe.test(content)) {
    return
  }

  const headerIdx =
    content.indexOf(OPEN_HEADER) >= 0
      ? content.indexOf(OPEN_HEADER)
      : content.indexOf(OPEN_HEADER_ALT)
  if (headerIdx < 0) {
    console.warn(`[${label}] En-tête sections ouvertes introuvable`)
    return
  }

  const insertIdx = findDevLogOpenBlockEnd(content, headerIdx)
  if (insertIdx <= headerIdx) {
    console.warn(`[${label}] Fin de bloc « sections ouvertes » introuvable`)
    return
  }

  content = `${content.slice(0, insertIdx)}${section}${content.slice(insertIdx)}`
  writeFileSync(logPath, content)
}
