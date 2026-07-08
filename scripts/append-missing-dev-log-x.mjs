/**
 * Ajoute les sections X manquantes jusqu'à build-revision.revision.
 * Usage: node scripts/append-missing-dev-log-x.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { appendDevLogOpenSection, maxDocumentedXInDevLog } from './lib/dev-log-open-section.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const revPath = join(root, 'build-revision.json')
const { revision } = JSON.parse(readFileSync(revPath, 'utf8'))
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const semver = pkg.version ?? '2.2.0'

const logPath = join(root, 'docs/traceability/changelog/DEV_LOG_2_2.md')
const md = readFileSync(logPath, 'utf8')
const maxX = maxDocumentedXInDevLog(md)

let added = 0
for (let x = maxX + 1; x <= revision; x++) {
  const label = `v${semver}.${String(x).padStart(2, '0')}`
  const before = readFileSync(logPath, 'utf8')
  appendDevLogOpenSection(root, x, label)
  const after = readFileSync(logPath, 'utf8')
  if (after !== before) added++
}
console.log(`Sections ajoutées: ${added} (X max ${maxX} → revision ${revision})`)
