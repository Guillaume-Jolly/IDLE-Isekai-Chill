/**
 * Fingerprint worktree git — partagé hooks + scripts version.
 * Une seule invocation git (status) quand possible.
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolveGitExecutable } from '../dev-launcher/resolve-git-exe.mjs'
import { readVersionConfig } from './version-config.mjs'

/** @param {string} root @param {string} command ex. "git status --porcelain" */
export function runGit(root, command) {
  const args = command.replace(/^git\s+/i, '').trim().split(/\s+/).filter(Boolean)
  try {
    return execFileSync(resolveGitExecutable(), args, {
      cwd: root,
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

/** Lit HEAD depuis .git sans subprocess. */
export function readGitHead(root) {
  try {
    const headPath = join(root, '.git', 'HEAD')
    if (!existsSync(headPath)) return ''
    let head = readFileSync(headPath, 'utf8').trim()
    if (head.startsWith('ref: ')) {
      const refPath = join(root, '.git', head.slice(5).trim())
      if (existsSync(refPath)) {
        head = readFileSync(refPath, 'utf8').trim()
      }
    }
    return head
  } catch {
    return ''
  }
}

export function getWorktreeFingerprint(root) {
  const head = readGitHead(root) || runGit(root, 'git rev-parse HEAD') || 'unknown'
  const status = runGit(root, 'git status --porcelain')
  return createHash('sha1')
    .update(head)
    .update('\0')
    .update(status)
    .digest('hex')
    .slice(0, 12)
}

/** Chemins modifiés (porcelain), normalisés slash forward. */
export function getChangedPaths(root) {
  const status = runGit(root, 'git status --porcelain')
  return parseChangedPaths(status)
}

export function parseChangedPaths(status) {
  if (!status) return []
  return status
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/\\/g, '/').trim())
    .filter(Boolean)
}

function versionMetaPaths(root) {
  const devLog = readVersionConfig(root).devLogRelativePath.replace(/\\/g, '/')
  return new Set(['build-revision.json', devLog, 'public/build-info.json'])
}

export function isVersionMetaOnlyChange(root, paths) {
  if (paths.length === 0) return true
  const meta = versionMetaPaths(root)
  return paths.every((p) => meta.has(p.replace(/\\/g, '/')))
}

export function readRevisionState(root) {
  const revisionPath = join(root, 'build-revision.json')
  if (!existsSync(revisionPath)) return null
  try {
    const raw = JSON.parse(readFileSync(revisionPath, 'utf8'))
    if (typeof raw.revision !== 'number') return null
    return raw
  } catch {
    return null
  }
}
