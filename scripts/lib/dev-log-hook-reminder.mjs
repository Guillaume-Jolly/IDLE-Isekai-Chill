/**
 * Rappels agent DEV_LOG — hook X (fichier .ai) + hook stop (followup_message).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { devLogPath, readVersionConfig } from './version-config.mjs'
import { formatVersionLabel } from './version-hook-output.mjs'

export const DEV_LOG_PENDING_REL = '.ai/dev-log-pending.md'
export const DEV_LOG_FOLLOWUP_MAX = 3

function pendingPath(root) {
  return join(root, DEV_LOG_PENDING_REL)
}

export function getDevLogSectionBlock(root, revision) {
  const logPath = devLogPath(root)
  if (!existsSync(logPath)) return null
  const md = readFileSync(logPath, 'utf8')
  const headerRe = new RegExp(`^### X=${revision} [—?\\-]`, 'm')
  let match = headerRe.exec(md)
  if (!match) {
    const rangeRe = new RegExp(`^### X=(\\d+) [—?\\-] X=(\\d+)`, 'gm')
    let rangeMatch
    while ((rangeMatch = rangeRe.exec(md)) !== null) {
      const from = Number.parseInt(rangeMatch[1], 10)
      const to = Number.parseInt(rangeMatch[2], 10)
      if (revision >= from && revision <= to) {
        const idx = rangeMatch.index
        const nextHeader = md.indexOf('\n### X=', idx + rangeMatch[0].length)
        const historyIdx = md.indexOf('\n## Historique complété', idx)
        let end = md.length
        if (nextHeader >= 0) end = Math.min(end, nextHeader)
        if (historyIdx >= 0) end = Math.min(end, historyIdx)
        return md.slice(idx, end)
      }
    }
    return null
  }
  const idx = match.index
  const nextHeader = md.indexOf('\n### X=', idx + match[0].length)
  const historyIdx = md.indexOf('\n## Historique complété', idx)
  let end = md.length
  if (nextHeader >= 0) end = Math.min(end, nextHeader)
  if (historyIdx >= 0) end = Math.min(end, historyIdx)
  return md.slice(idx, end)
}

export function isDevLogSectionIncomplete(block) {
  if (!block) return true
  const titleLine = block.split('\n')[0] ?? ''
  if (/À COMPLÉTER|à compléter/i.test(titleLine)) return true
  const butMatch = block.match(/\*\*But du prompt\s*:\*\*\s*(.+)/i)
  if (/à compléter/i.test(butMatch?.[1] ?? '')) return true
  const validationsMatch = block.match(/\*\*Validations\s*:\*\*\s*(.+)/i)
  if (/⚠️\s*_…_|à compléter/i.test(validationsMatch?.[1] ?? '')) return true
  return false
}

export function isCurrentDevLogSectionIncomplete(root, revision) {
  return isDevLogSectionIncomplete(getDevLogSectionBlock(root, revision))
}

export function writeDevLogPendingReminder(root, revision, versionLabel) {
  const logRel = readVersionConfig(root).devLogRelativePath.replace(/\\/g, '/')
  const content = `# DEV_LOG — à compléter (hook X)

**Version :** ${versionLabel} · **X=${revision}**

Le hook X vient d'injecter une section stub dans \`${logRel}\`.

**Complète-la avant de terminer ce prompt :**

1. Remplace \`⚠️ À COMPLÉTER\` par un titre court (motif du prompt)
2. Rédige **But du prompt**, **Validations**, **Risques**
3. Ajoute une ligne **Y** par tâche distincte (\`| N | résumé | commit | label UI |\`)
4. Déplace vers **Historique complété** si le prompt est clos

> La ligne Y=0 (\`version:prompt\`) est déjà présente — la conserver.
`
  mkdirSync(join(root, '.ai'), { recursive: true })
  writeFileSync(pendingPath(root), content)
}

export function markDevLogPendingComplete(root, revision) {
  mkdirSync(join(root, '.ai'), { recursive: true })
  writeFileSync(
    pendingPath(root),
    `# DEV_LOG — OK

Section X=${revision} documentée. (Écrasé au prochain hook X.)
`,
  )
}

/**
 * @param {string} root
 * @param {{ revision: number, subRevision?: number, bumpedY?: boolean }} opts
 * @returns {string | null}
 */
export function buildStopDevLogFollowup(root, { revision, subRevision = 0, bumpedY = false }) {
  const block = getDevLogSectionBlock(root, revision)
  if (!isDevLogSectionIncomplete(block)) {
    markDevLogPendingComplete(root, revision)
    return null
  }

  const logRel = readVersionConfig(root).devLogRelativePath.replace(/\\/g, '/')
  const label = formatVersionLabel(root, { revision, subRevision })
  const yHint =
    bumpedY && subRevision > 0
      ? ` Ajoute ou mets à jour la ligne **Y=${subRevision}** (résumé de ce qui vient d'être fait).`
      : ''

  return (
    `même X — **[Hook DEV_LOG]** J'ai créé / laissé la section **X=${revision}** (${label}) dans \`${logRel}\` — elle est encore en stub « À COMPLÉTER ». ` +
    `Ouvre ce fichier et remplis : titre, but, validations, risques.${yHint} ` +
    `Ne considère pas le prompt terminé tant que ce n'est pas fait.`
  )
}
