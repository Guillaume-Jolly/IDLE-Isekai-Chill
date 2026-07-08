/**
 * Répare DEV_LOG après backfill : supprime blocs orphelins ⚠️ sans en-tête ### X=.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { devLogPath } from './lib/version-config.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const logPath = devLogPath(root)
let md = readFileSync(logPath, 'utf8')

const orphanRe =
  /\n\*\*But du prompt :\*\* ⚠️ _\(à compléter[\s\S]*?\*\*Risques :\*\* ⚠️ _…_\n/g

let n = 0
md = md.replace(orphanRe, () => {
  n++
  return '\n'
})

md = md.replace(/\n{4,}/g, '\n\n\n')
writeFileSync(logPath, md)
console.log(`Orphelins supprimés: ${n}`)
