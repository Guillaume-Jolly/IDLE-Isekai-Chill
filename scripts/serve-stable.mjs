/**
 * Prépare puis lance le serveur stable (env local, build si absente).
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'
import { requireProdDist } from './stable-prod-guard.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const stableRoot = join(repoRoot, 'deploy', 'stable')
const distIndex = join(stableRoot, 'dist', 'index.html')
const envExample = join(stableRoot, 'env.example')
const envLocal = join(stableRoot, '.env.stable.local')

if (!existsSync(envLocal) && existsSync(envExample)) {
  copyFileSync(envExample, envLocal)
  console.log('')
  console.log('[serve:stable] Fichier créé : deploy/stable/.env.stable.local')
  console.log('[serve:stable] Édite STABLE_AUTH_PASS avant un accès Internet.')
  console.log('')
}

requireProdDist(distIndex)

const certPath = join(stableRoot, 'certs', 'cert.pem')
const pfxPath = join(stableRoot, 'certs', 'cert.pfx')
if (!existsSync(pfxPath) && !existsSync(certPath)) {
  console.log('[serve:stable] Certificats HTTPS absents — génération…')
  execSync('node scripts/generate-stable-tls.mjs', { cwd: repoRoot, stdio: 'inherit' })
}

const mobileCertSrc = join(stableRoot, 'certs', 'ca-mobile.cer')
const mobileCertFallback = join(stableRoot, 'certs', 'cert-mobile.cer')
const setupDir = join(stableRoot, 'dist', 'setup')
const mobileSrc = existsSync(mobileCertSrc) ? mobileCertSrc : mobileCertFallback
if (existsSync(mobileSrc)) {
  mkdirSync(setupDir, { recursive: true })
  copyFileSync(mobileSrc, join(setupDir, 'ca-mobile.cer'))
  copyFileSync(mobileSrc, join(setupDir, 'cert-mobile.cer'))
}

await import(pathToFileURL(join(stableRoot, 'server.mjs')).href)
