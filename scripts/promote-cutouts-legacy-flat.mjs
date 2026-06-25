#!/usr/bin/env node
/** Move cutouts from _archive batch → Compagnons/{id}/cutouts-legacy/ */
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const SRC = join(ROOT, 'old_assets/Compagnons/_archive/2026-06-25-cutouts-emotion-legacy')
let moved = 0

function rel(f) {
  return f.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function walk(d, h) {
  if (!existsSync(d)) return
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) walk(f, h)
    else h(f)
  }
}

walk(SRC, (full) => {
  const fromRel = rel(full)
  const m =
    /old_assets\/Compagnons\/_archive\/2026-06-25-cutouts-emotion-legacy\/([^/]+)\/cutouts\/(emotion-[^/]+\.png)$/.exec(
      fromRel,
    )
  if (!m) return
  const toRel = `old_assets/Compagnons/${m[1]}/cutouts-legacy/${m[2]}`
  mkdirSync(dirname(join(ROOT, toRel)), { recursive: true })
  try {
    execSync(`git mv -f "${fromRel}" "${toRel}"`, { cwd: ROOT, stdio: 'pipe' })
  } catch {
    renameSync(full, join(ROOT, toRel))
  }
  moved++
})

console.log(JSON.stringify({ moved }))
