/**
 * Vérifie le module rappel DEV_LOG (hooks X/Y) sans Cursor.
 * Usage : npm run validate:dev-log-hooks
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildStopDevLogFollowup,
  DEV_LOG_PENDING_REL,
  getDevLogSectionBlock,
  isCurrentDevLogSectionIncomplete,
  isDevLogSectionIncomplete,
  writeDevLogPendingReminder,
} from './lib/dev-log-hook-reminder.mjs'
import { readRevisionState } from './lib/worktree-fingerprint.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failed = 0

function ok(label) {
  console.log(`  ✓ ${label}`)
}

function fail(label, detail = '') {
  failed += 1
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
}

function assert(condition, label, detail = '') {
  if (condition) ok(label)
  else fail(label, detail)
}

console.log('[validate:dev-log-hooks] Module rappel DEV_LOG\n')

const state = readRevisionState(root)
assert(state?.revision != null, 'build-revision.json lisible', `X=${state?.revision}`)

const completeBlock = getDevLogSectionBlock(root, 692)
assert(completeBlock?.includes('Alignement 2 points'), 'section X=692 trouvée')
assert(!isDevLogSectionIncomplete(completeBlock), 'X=692 détectée complète')

const incompleteBlock = getDevLogSectionBlock(root, state.revision)
if (isDevLogSectionIncomplete(incompleteBlock)) {
  ok(`X=${state.revision} incomplète (stub attendu sur prompt ouvert)`)
} else {
  ok(`X=${state.revision} complète`)
}

const followup = buildStopDevLogFollowup(root, {
  revision: state.revision,
  subRevision: state.subRevision ?? 0,
  bumpedY: true,
})
if (isDevLogSectionIncomplete(incompleteBlock)) {
  assert(typeof followup === 'string' && followup.includes('même X'), 'followup contient même X')
  assert(followup.includes('[Hook DEV_LOG]'), 'followup contient marqueur Hook DEV_LOG')
  assert(followup.includes('DEV_LOG_2_2.md'), 'followup cite le DEV_LOG')
} else {
  assert(followup === null, 'followup null si section complète')
}

const pendingPath = join(root, DEV_LOG_PENDING_REL)
const hadPending = existsSync(pendingPath)
let pendingBackup = null
if (hadPending) pendingBackup = readFileSync(pendingPath, 'utf8')

writeDevLogPendingReminder(root, state.revision, `v2.2.0.${state.revision}`)
assert(existsSync(pendingPath), `${DEV_LOG_PENDING_REL} écrit par hook X simulé`)
assert(
  readFileSync(pendingPath, 'utf8').includes(`X=${state.revision}`),
  'pending mentionne le X courant',
)

if (pendingBackup != null) writeFileSync(pendingPath, pendingBackup)
else writeFileSync(pendingPath, '# DEV_LOG — OK\n\nRestauré après validate:dev-log-hooks.\n')

const hookX = join(root, '.cursor/hooks/A.B.C.X.Y - X update - prompt indent.mjs')
const hookY = join(root, '.cursor/hooks/A.B.C.X.Y - Y update - subprompt indent.mjs')
assert(existsSync(hookX), 'hook X présent')
assert(existsSync(hookY), 'hook Y présent')
assert(
  readFileSync(hookX, 'utf8').includes('writeDevLogPendingReminder'),
  'hook X appelle writeDevLogPendingReminder',
)
assert(
  readFileSync(hookY, 'utf8').includes('followup_message'),
  'hook Y peut émettre followup_message',
)
assert(
  readFileSync(hookY, 'utf8').includes('buildStopDevLogFollowup'),
  'hook Y appelle buildStopDevLogFollowup',
)

console.log('')
if (failed > 0) {
  console.error(`[validate:dev-log-hooks] ÉCHEC (${failed})`)
  process.exit(1)
}
console.log('[validate:dev-log-hooks] OK')
