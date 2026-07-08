#!/usr/bin/env node
/**
 * A.B.C.X.Y - Y update - subprompt indent
 * Event Cursor : stop
 */
import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getWorktreeFingerprint,
  isVersionMetaOnlyChange,
  parseChangedPaths,
  readRevisionState,
  runGit,
} from '../../scripts/lib/worktree-fingerprint.mjs'
import {
  buildStopDevLogFollowup,
  DEV_LOG_FOLLOWUP_MAX,
} from '../../scripts/lib/dev-log-hook-reminder.mjs'
import { logVersionHook, peekVersionHookProject } from '../../scripts/lib/version-hook-log.mjs'
import {
  enrichHookPayload,
  VERSION_HOOK_Y_NAME,
} from '../../scripts/lib/version-hook-output.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

function readStopInput() {
  try {
    const raw = readFileSync(0, 'utf8')
    if (!raw.trim()) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function lastUserMessageFromTranscript() {
  const transcriptPath = process.env.CURSOR_TRANSCRIPT_PATH
  if (!transcriptPath || !existsSync(transcriptPath)) return ''
  try {
    const lines = readFileSync(transcriptPath, 'utf8').trim().split('\n')
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const line = lines[i]
      if (!line.includes('"role":"user"')) continue
      const match = line.match(/"text":"((?:\\.|[^"\\])*)"/)
      if (match) {
        return match[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
      }
    }
  } catch {
    return ''
  }
  return ''
}

let versionHook = { hookName: VERSION_HOOK_Y_NAME, started: peekVersionHookProject(root) }

const input = readStopInput()
const status = input.status ?? 'completed'
const loopCount = Number.isFinite(input.loop_count) ? input.loop_count : 0

function finishStop(hookRecord) {
  const stateAfter = readRevisionState(root)
  const revision = stateAfter?.revision
  const subRevision = stateAfter?.subRevision ?? 0
  const bumpedY = hookRecord.action === 'bump-y'
  const inDevLogFollowupLoop = loopCount > 0 && loopCount < DEV_LOG_FOLLOWUP_MAX
  const metaOnlyWhileFollowingUp =
    hookRecord.action === 'skip' && hookRecord.reason === 'meta version seulement' && inDevLogFollowupLoop
  const shouldCheckDevLog =
    status === 'completed' &&
    loopCount < DEV_LOG_FOLLOWUP_MAX &&
    revision != null &&
    (bumpedY || metaOnlyWhileFollowingUp || inDevLogFollowupLoop)

  let followupMessage = null
  if (shouldCheckDevLog) {
    followupMessage = buildStopDevLogFollowup(root, {
      revision,
      subRevision,
      bumpedY: bumpedY || metaOnlyWhileFollowingUp,
    })
  }

  const stopPayload = followupMessage ? { followup_message: followupMessage } : {}
  emit(enrichHookPayload(root, VERSION_HOOK_Y_NAME, hookRecord, stopPayload))
  process.exit(0)
}

if (status !== 'completed') {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: `status=${status}`,
  })
  finishStop(versionHook)
}

const lastUserText = lastUserMessageFromTranscript()
if (/même\s*Y|meme\s*Y|same\s*Y/i.test(lastUserText)) {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: 'opt-out même Y',
  })
  finishStop(versionHook)
}

const state = readRevisionState(root)
const porcelain = runGit(root, 'git status --porcelain')

if (!porcelain.trim()) {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: 'worktree inchangé',
  })
  finishStop(versionHook)
}

const changedPaths = parseChangedPaths(porcelain)
if (isVersionMetaOnlyChange(root, changedPaths)) {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: 'meta version seulement',
  })
  finishStop(versionHook)
}

const currentFingerprint = getWorktreeFingerprint(root)
if (state?.fingerprint === currentFingerprint) {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: 'fingerprint identique',
  })
  finishStop(versionHook)
}

const result = spawnSync(process.execPath, [join(root, 'scripts', 'bump-task.mjs')], {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
})

if (result.status !== 0) {
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'skip',
    reason: 'bump-task failed',
    error: (result.stderr || '').trim() || null,
  })
} else {
  const line = (result.stdout || '').trim().split('\n').pop() || ''
  const labelMatch = line.match(/→\s*(v[\d.]+)/)
  versionHook = logVersionHook(root, {
    hook: 'stop',
    hookName: VERSION_HOOK_Y_NAME,
    action: 'bump-y',
    versionLabel: labelMatch?.[1] ?? (line || undefined),
  })
}

finishStop(versionHook)
