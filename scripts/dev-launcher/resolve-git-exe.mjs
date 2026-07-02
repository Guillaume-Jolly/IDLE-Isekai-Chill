import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

/** @type {string | null} */
let cachedGitExe = null

function preferBinGitPath(path) {
  const normalized = path.replace(/\//g, '\\')
  if (normalized.includes('\\cmd\\git.exe')) return false
  return normalized.endsWith('\\git.exe')
}

/** Chemin vers Git\bin\git.exe — jamais cmd\git.exe ni git.cmd (flash cmd Windows). */
export function resolveGitExecutable() {
  if (cachedGitExe) return cachedGitExe

  const fromEnv = process.env.HAVRE_GIT_EXE
  if (fromEnv && existsSync(fromEnv) && preferBinGitPath(fromEnv)) {
    cachedGitExe = fromEnv
    return cachedGitExe
  }

  const candidates = [
    'C:\\Program Files\\Git\\bin\\git.exe',
    'C:\\Program Files (x86)\\Git\\bin\\git.exe',
    'C:\\Program Files\\Git\\mingw64\\bin\\git.exe',
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      cachedGitExe = candidate
      return cachedGitExe
    }
  }

  if (process.platform === 'win32') {
    try {
      const out = execFileSync(
        join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'where.exe'),
        ['git.exe'],
        {
          encoding: 'utf8',
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'ignore'],
        },
      )
      for (const line of out.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (trimmed && existsSync(trimmed) && preferBinGitPath(trimmed)) {
          cachedGitExe = trimmed
          return cachedGitExe
        }
      }
    } catch {
      /* ignore */
    }
  }

  throw new Error(
    'git.exe introuvable (Git\\bin\\git.exe). Installez Git for Windows ou définissez HAVRE_GIT_EXE.',
  )
}
