import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const skip = new Set(['color-theme.css', 'index.css'])

const reps = [
  [
    'linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(255, 245, 252, 0.9))',
    'var(--mini-panel-bg)',
  ],
  [
    'linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(247, 236, 255, 0.88))',
    'var(--mini-stage-bg)',
  ],
  ['rgba(255, 252, 248, 0.94)', 'var(--panel-bg-sheet)'],
  ['rgba(255, 248, 252, 0.92)', 'var(--panel-bg-sheet)'],
  ['rgba(255, 246, 252, 0.85)', 'var(--overlay-sheet)'],
  ['rgba(255, 255, 255, 0.96)', 'var(--panel-bg-opaque)'],
  ['rgba(255, 255, 255, 0.92)', 'var(--panel-bg-solid)'],
  ['rgba(255, 255, 255, 0.9)', 'var(--panel-bg-solid)'],
  ['rgba(255, 255, 255, 0.88)', 'var(--panel-bg-solid)'],
  ['rgba(255, 255, 255, 0.85)', 'var(--overlay-sheet)'],
  ['rgba(255, 255, 255, 0.82)', 'var(--panel-bg-solid)'],
  ['rgba(255, 255, 255, 0.78)', 'var(--panel-bg-strong)'],
  ['rgba(255, 255, 255, 0.76)', 'var(--panel-bg-frosted)'],
  ['rgba(255, 255, 255, 0.74)', 'var(--panel-bg-frosted)'],
  ['rgba(255, 255, 255, 0.72)', 'var(--panel-bg)'],
  ['rgba(255, 255, 255, 0.7)', 'var(--panel-bg)'],
  ['rgba(255, 255, 255, 0.55)', 'var(--panel-bg-soft)'],
  ['rgba(255, 255, 255, 0.5)', 'var(--surface-muted)'],
  ['rgba(255, 255, 255, 0.45)', 'var(--surface-muted)'],
  ['background: #fff;', 'background: var(--panel-bg-solid);'],
  ['background: #fff9fd;', 'background: var(--panel-bg-sheet);'],
  ['rgba(255, 255, 255, 0.18)', 'var(--surface-hover-strong)'],
  ['rgba(255, 255, 255, 0.12)', 'var(--surface-hover-strong)'],
  ['rgba(255, 255, 255, 0.1)', 'var(--surface-hover)'],
  ['rgba(255, 255, 255, 0.08)', 'var(--surface-hover)'],
  ['rgba(255, 255, 255, 0.06)', 'var(--surface-inset-mid)'],
  ['rgba(255, 255, 255, 0.05)', 'var(--surface-inset)'],
  ['rgba(255, 255, 255, 0.04)', 'var(--surface-inset)'],
  ['rgba(255, 255, 255, 0.03)', 'var(--surface-inset)'],
  ['rgba(255, 255, 255, 0.25)', 'var(--surface-muted)'],
  ['rgba(255, 255, 255, 0.2)', 'var(--surface-muted)'],
]

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (ent.name.endsWith('.css') && !skip.has(ent.name)) out.push(p)
  }
  return out
}

let total = 0
for (const file of walk(root)) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  for (const [from, to] of reps) {
    const count = content.split(from).length - 1
    if (count > 0) {
      content = content.split(from).join(to)
      total += count
      changed = true
    }
  }
  if (changed) fs.writeFileSync(file, content)
}

console.log(`bulk-theme-css: ${total} replacements`)
