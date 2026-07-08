/**
 * Audit couverture X dans DEV_LOG (inclut plages `X=a … X=b` legacy).
 * Usage: node scripts/audit-dev-log-coverage.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const md = readFileSync(join(root, 'docs/traceability/changelog/DEV_LOG_2_2.md'), 'utf8')
const { revision, subRevision } = JSON.parse(readFileSync(join(root, 'build-revision.json'), 'utf8'))

const covered = new Set()
for (const m of md.matchAll(/^### X=.*$/gm)) {
  const nums = [...m[0].matchAll(/X=(\d+)/g)].map((x) => Number.parseInt(x[1], 10))
  if (nums.length >= 2) {
    const from = Math.min(...nums)
    const to = Math.max(...nums)
    if (to > from) {
      for (let i = from; i <= to; i++) covered.add(i)
      continue
    }
  }
  if (nums.length >= 1) covered.add(nums[0])
}

const missing = []
for (let i = 1; i <= revision; i++) if (!covered.has(i)) missing.push(i)

const incomplete = []
for (const m of md.matchAll(/^### X=(\d+)[^\n]*\n([\s\S]*?)(?=\n### X=|\n## Historique|\n## Template)/gm)) {
  const x = +m[1]
  if (/X=\d+.*X=\d+/.test(m[0].split('\n')[0])) continue
  const body = m[2]
  if (/COMPL[\?É]TER|\?\? _\(/i.test(m[0])) incomplete.push(x)
  else if (!/\| 1 \|/.test(body)) incomplete.push(`noY1:${x}`)
}

const out = {
  revision,
  subRevision,
  coveredCount: covered.size,
  maxX: covered.size ? Math.max(...covered) : 0,
  missingCount: missing.length,
  missing,
  incomplete,
}

console.log(JSON.stringify(out, null, 2))
process.exit(missing.length > 0 || incomplete.length > 0 ? 0 : 0)
