import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AppBuildInfo } from './src/buildInfo.types'

const root = join(dirname(fileURLToPath(import.meta.url)))
const revisionPath = join(root, 'build-revision.json')
const publicBuildInfoPath = join(root, 'public/build-info.json')

type BuildRevisionState = {
  revision: number
  subRevision: number
  fingerprint: string
  updatedAt: string
}

function runGit(command: string) {
  try {
    return execSync(command, { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function getWorktreeFingerprint() {
  const head = runGit('git rev-parse HEAD') || 'unknown'
  const status = runGit('git status --porcelain')
  const diff = runGit('git diff HEAD')
  const untracked = runGit('git ls-files --others --exclude-standard')

  return createHash('sha1')
    .update(head)
    .update('\0')
    .update(status)
    .update('\0')
    .update(diff)
    .update('\0')
    .update(untracked)
    .digest('hex')
    .slice(0, 12)
}

function readRevisionState(): BuildRevisionState | null {
  if (!existsSync(revisionPath)) return null
  try {
    const raw = JSON.parse(readFileSync(revisionPath, 'utf8')) as Partial<BuildRevisionState>
    if (typeof raw.revision !== 'number') return null
    return {
      revision: raw.revision,
      subRevision: typeof raw.subRevision === 'number' ? raw.subRevision : 0,
      fingerprint: typeof raw.fingerprint === 'string' ? raw.fingerprint : '',
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function writeRevisionState(state: BuildRevisionState) {
  writeFileSync(revisionPath, `${JSON.stringify(state, null, 2)}\n`)
}

function initialRevision() {
  const commitCount = Number.parseInt(runGit('git rev-list --count HEAD') || '0', 10)
  const dirty = runGit('git status --porcelain') !== ''
  return dirty ? Math.max(1, commitCount) + 1 : Math.max(1, commitCount)
}

function formatVersionLabel(semver: string, revision: number, subRevision: number) {
  const build = String(Math.max(0, revision)).padStart(2, '0')
  if (subRevision > 0) {
    return `v${semver}.${build}.${subRevision}`
  }
  return `v${semver}.${build}`
}

function createBuildInfo(revision: number, subRevision = 0): AppBuildInfo {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { version?: string }
  const semver = typeof pkg.version === 'string' ? pkg.version : '0.0.0'
  const commitHash = runGit('git rev-parse --short HEAD') || 'unknown'
  const commitCount = Number.parseInt(runGit('git rev-list --count HEAD') || '0', 10)
  const dirty = runGit('git status --porcelain') !== ''
  const build = String(Math.max(0, revision)).padStart(2, '0')

  return {
    semver,
    commitCount,
    commitHash,
    dirty,
    revision,
    subRevision,
    build,
    versionLabel: formatVersionLabel(semver, revision, subRevision),
    builtAt: new Date().toISOString(),
  }
}

/**
 * Nouveau prompt utilisateur → révision principale +1, sous-révision remise à 0.
 * Appeler une fois au début de chaque prompt (npm run version:prompt).
 */
export function bumpPromptRevision(): { revision: number; subRevision: number } {
  const fingerprint = getWorktreeFingerprint()
  const existing = readRevisionState()
  const revision = existing ? existing.revision + 1 : initialRevision()

  writeRevisionState({
    revision,
    subRevision: 0,
    fingerprint,
    updatedAt: new Date().toISOString(),
  })

  return { revision, subRevision: 0 }
}

/**
 * @deprecated HMR n’incrémente plus Y — réservé à `npm run version:task`.
 * Conservé pour appels legacy ; ne plus utiliser depuis Vite HMR.
 */
export function bumpSubRevisionIfChanged(): { revision: number; subRevision: number; changed: boolean } {
  const fingerprint = getWorktreeFingerprint()
  const existing = readRevisionState()

  if (!existing) {
    const revision = initialRevision()
    writeRevisionState({
      revision,
      subRevision: 0,
      fingerprint,
      updatedAt: new Date().toISOString(),
    })
    return { revision, subRevision: 0, changed: true }
  }

  if (existing.fingerprint === fingerprint) {
    return { revision: existing.revision, subRevision: existing.subRevision, changed: false }
  }

  const subRevision = existing.subRevision + 1
  writeRevisionState({
    revision: existing.revision,
    subRevision,
    fingerprint,
    updatedAt: new Date().toISOString(),
  })
  return { revision: existing.revision, subRevision, changed: true }
}

export function readCurrentRevision(): number {
  return readRevisionState()?.revision ?? initialRevision()
}

export function getGitBuildInfo(revision?: number, subRevision?: number): AppBuildInfo {
  const state = readRevisionState()
  const rev = revision ?? state?.revision ?? initialRevision()
  const sub = subRevision ?? state?.subRevision ?? 0
  return createBuildInfo(rev, sub)
}

export function writePublicBuildInfo(info: AppBuildInfo) {
  mkdirSync(dirname(publicBuildInfoPath), { recursive: true })
  writeFileSync(publicBuildInfoPath, `${JSON.stringify(info, null, 2)}\n`)
}

/** Écrit build-info.json sans incrémenter (dev / build). */
export function syncPublicBuildInfo() {
  const info = getGitBuildInfo()
  writePublicBuildInfo(info)
  return info
}

/** @deprecated Préférer syncPublicBuildInfo() — le mode hmr ne bump plus Y. */
export function refreshPublicBuildInfo(mode: 'sync' | 'hmr') {
  const info = syncPublicBuildInfo()
  return { ...info, changed: mode === 'hmr' }
}
