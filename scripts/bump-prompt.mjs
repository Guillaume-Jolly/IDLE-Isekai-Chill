/**
 * Nouveau prompt utilisateur → révision +1 (npm run version:prompt).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { appendDevLogOpenSection } from './lib/dev-log-open-section.mjs'
import {
  getWorktreeFingerprint,
  readGitHead,
  runGit,
} from './lib/worktree-fingerprint.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const revisionPath = join(root, 'build-revision.json')
const publicBuildInfoPath = join(root, 'public/build-info.json')

function readState() {
  if (!existsSync(revisionPath)) return null
  try {
    const raw = JSON.parse(readFileSync(revisionPath, 'utf8'))
    if (typeof raw.revision !== 'number') return null
    return raw
  } catch {
    return null
  }
}

function initialRevision() {
  const commitCount = Number.parseInt(runGit(root, 'git rev-list --count HEAD') || '0', 10)
  const dirty = runGit(root, 'git status --porcelain') !== ''
  return dirty ? Math.max(1, commitCount) + 1 : Math.max(1, commitCount)
}

const existing = readState()
const revision = existing ? existing.revision + 1 : initialRevision()
const subRevision = 0
const fingerprint = getWorktreeFingerprint(root)

writeFileSync(
  revisionPath,
  `${JSON.stringify({ revision, subRevision, fingerprint, updatedAt: new Date().toISOString() }, null, 2)}\n`,
)

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const semver = typeof pkg.version === 'string' ? pkg.version : '0.0.0'
const build = String(revision).padStart(2, '0')
const versionLabel = `v${semver}.${build}`

const head = readGitHead(root)
const porcelain = runGit(root, 'git status --porcelain')
const commitHash = head ? head.slice(0, 7) : runGit(root, 'git rev-parse --short HEAD') || 'unknown'

const buildInfo = {
  semver,
  commitCount: Number.parseInt(runGit(root, 'git rev-list --count HEAD') || '0', 10),
  commitHash,
  dirty: porcelain !== '',
  revision,
  subRevision,
  build,
  versionLabel,
  builtAt: new Date().toISOString(),
}

mkdirSync(dirname(publicBuildInfoPath), { recursive: true })
writeFileSync(publicBuildInfoPath, `${JSON.stringify(buildInfo, null, 2)}\n`)

appendDevLogOpenSection(root, revision, versionLabel)

console.log(`[Havre des Brumes] Prompt → ${versionLabel}`)
