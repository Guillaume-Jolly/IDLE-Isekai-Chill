/**
 * Injecte une section ⚠️ À COMPLÉTER dans DEV_LOG_2_2.md après version:prompt.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OPEN_HEADER = '## ⚠️ Sections ouvertes (X non finalisés)'

export function appendDevLogOpenSection(root, revision, versionLabel) {
  const devLogPath = join(root, 'docs/traceability/changelog/DEV_LOG_2_2.md')
  if (!existsSync(devLogPath)) {
    console.warn('[Havre des Brumes] DEV_LOG_2_2.md introuvable — section ouverte non injectée')
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

  let content = readFileSync(devLogPath, 'utf8')

  if (!content.includes(OPEN_HEADER)) {
    const anchor = '**Commit :** 1 commit principal par **X**'
    if (!content.includes(anchor)) {
      console.warn('[Havre des Brumes] Ancre DEV_LOG introuvable — section ouverte non injectée')
      return
    }
    content = content.replace(
      anchor,
      `${OPEN_HEADER}

> Injecté par \`npm run version:prompt\` / hook Cursor. **Compléter en fin de prompt** (titre, but, Y, validations).

${anchor}`,
    )
  }

  const sectionHeader = `### X=${revision} —`
  if (content.includes(sectionHeader)) {
    return
  }

  const headerIdx = content.indexOf(OPEN_HEADER)
  if (headerIdx < 0) {
    console.warn('[Havre des Brumes] En-tête sections ouvertes introuvable')
    return
  }

  const historyMarker = '## Historique complété'
  const historyIdx = content.indexOf(historyMarker, headerIdx)
  if (historyIdx < 0) {
    console.warn('[Havre des Brumes] Marqueur historique DEV_LOG introuvable')
    return
  }

  content = `${content.slice(0, historyIdx)}${section}${content.slice(historyIdx)}`
  writeFileSync(devLogPath, content)
}
