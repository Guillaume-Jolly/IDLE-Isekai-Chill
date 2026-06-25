/**
 * TNR baseline — build + validate + manifest inventory.
 * Usage: npm run tnr:baseline
 */
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function run(label, cmd) {
  console.log(`\n▶ ${label}`)
  execSync(cmd, { cwd: root, stdio: 'inherit' })
}

run('build', 'npm run build')
run('validate:link-corpus', 'npm run validate:link-corpus')
run('inventory-assets-manifest', 'node scripts/inventory-assets-manifest.mjs')
console.log('\n✓ tnr:baseline complete (lint optional: npm run lint)')
