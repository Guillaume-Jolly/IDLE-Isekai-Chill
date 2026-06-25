/**
 * Build production isolée → deploy/stable/dist (sans toucher au dev Vite).
 * L’ancienne build est déplacée vers deploy/stable/archive/ (jamais supprimée).
 *
 * PROD volontaire uniquement :
 *   npm run build:stable:prod
 *
 * Exige : --confirm-prod, working tree propre, branche synchronisée avec GitHub.
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertProdBuildAllowed } from './stable-prod-guard.mjs'

const confirmProd = process.argv.includes('--confirm-prod')
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const bin = (name) => join(repoRoot, 'node_modules', '.bin', name)
const stableRoot = join(repoRoot, 'deploy', 'stable')
const distDir = join(stableRoot, 'dist')
const archiveRoot = join(stableRoot, 'archive')

const git = assertProdBuildAllowed(repoRoot, { confirmProd })

mkdirSync(archiveRoot, { recursive: true })

if (existsSync(distDir)) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const archived = join(archiveRoot, `dist-${stamp}`)
  renameSync(distDir, archived)
  console.log(`[build:stable:prod] Ancienne build archivee → ${archived}`)
}

console.log('[build:stable:prod] Compilation TypeScript + Vite…')
execSync(`"${bin('tsc')}" -b`, { cwd: repoRoot, stdio: 'inherit', shell: true })
execSync(`"${bin('vite')}" build --outDir "${distDir}"`, {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VITE_STABLE_PRESET: 'demo' },
})

const manifest = {
  builtAt: new Date().toISOString(),
  gitHash: git.hash,
  gitBranch: git.branch,
  gitUpstream: git.upstream,
  gitRemoteHash: git.remoteHash,
  workingTreeDirty: false,
  prodBuild: true,
  outDir: 'deploy/stable/dist',
}
writeFileSync(join(stableRoot, 'BUILD_INFO.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')

console.log('')
console.log('[build:stable:prod] Termine.')
console.log(`  Commit : ${git.hash} (${git.branch}) = ${git.upstream}`)
console.log(`  Dossier: deploy/stable/dist`)
console.log('  Lance   : Launch Stable Server.cmd')
console.log('')
