/**
 * Serveur statique isolé pour la build stable (prod locale + accès distant).
 * Auth HTTP Basic + rate limit + en-têtes de sécurité de base.
 *
 * Usage: node deploy/stable/server.mjs
 * Prérequis: deploy/stable/dist/ (npm run build:stable)
 */
import { createServer as createHttpServer } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { networkInterfaces } from 'node:os'
import { rewriteLegacyAssetUrl } from '../../scripts/legacy-asset-rewrites.mjs'
import { createSessionManager } from './stable-sessions.mjs'
import { createSaveStore } from './stable-saves.mjs'
import { createStatsCollector, isLoopbackIp } from './stable-stats.mjs'
import { createAuthStore } from './stable-auth.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_ROOT = join(__dirname, 'dist')
const ENV_PATH = join(__dirname, '.env.stable.local')
const MAX_URL_LENGTH = 2048
const MAX_SAVE_BYTES = 8 * 1024 * 1024

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
  '.cer': 'application/x-x509-ca-cert',
}

function loadEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return out
}

const env = {
  STABLE_HOST: '0.0.0.0',
  STABLE_PORT: '8787',
  STABLE_AUTH_USER: 'Joueur',
  STABLE_AUTH_PASS: 'change-me-maintenant',
  STABLE_AUTH_USERS: '',
  STABLE_RATE_LIMIT_PER_MIN: '240',
  STABLE_AUTH_FAIL_LIMIT: '20',
  STABLE_TLS: '1',
  STABLE_TLS_CERT: '',
  STABLE_TLS_KEY: '',
  STABLE_TLS_PFX: '',
  STABLE_TLS_PFX_PASS: 'stable-local',
  STABLE_SINGLE_SESSION: '1',
  STABLE_SESSION_TIMEOUT_MIN: '5',
  STABLE_CLOUD_SAVES: '1',
  ...loadEnvFile(ENV_PATH),
  ...process.env,
}

const HOST = env.STABLE_HOST
const PORT = Number.parseInt(env.STABLE_PORT, 10) || 8787
const authStore = createAuthStore(env)
const RATE_LIMIT = Number.parseInt(env.STABLE_RATE_LIMIT_PER_MIN, 10) || 240
const AUTH_FAIL_LIMIT = Number.parseInt(env.STABLE_AUTH_FAIL_LIMIT, 10) || 20
const TLS_ENABLED = env.STABLE_TLS !== '0' && env.STABLE_TLS !== 'false'
const TLS_CERT_PATH = env.STABLE_TLS_CERT || join(__dirname, 'certs', 'cert.pem')
const TLS_KEY_PATH = env.STABLE_TLS_KEY || join(__dirname, 'certs', 'key.pem')
const TLS_PFX_PATH = env.STABLE_TLS_PFX || join(__dirname, 'certs', 'cert.pfx')
const TLS_PFX_PASS = env.STABLE_TLS_PFX_PASS || 'stable-local'
const PUBLIC_HOST = (env.STABLE_PUBLIC_HOST || '').trim()
const MOBILE_CERT_PATH = join(__dirname, 'certs', 'ca-mobile.cer')
const MOBILE_CERT_FALLBACK = join(__dirname, 'certs', 'cert-mobile.cer')
const MOBILE_CERT_URL = '/setup/ca-mobile.cer'
const MOBILE_CERT_URL_LEGACY = '/setup/cert-mobile.cer'
const STATUS_URL = '/__stable/status'
const SHUTDOWN_URL = '/__stable/shutdown'
const SAVE_URL = '/api/stable/save'

const SINGLE_SESSION = env.STABLE_SINGLE_SESSION !== '0' && env.STABLE_SINGLE_SESSION !== 'false'
const SESSION_TIMEOUT_MS = (Number.parseInt(env.STABLE_SESSION_TIMEOUT_MIN, 10) || 5) * 60_000
const CLOUD_SAVES = env.STABLE_CLOUD_SAVES !== '0' && env.STABLE_CLOUD_SAVES !== 'false'

const sessions = createSessionManager({
  enabled: SINGLE_SESSION,
  timeoutMs: SESSION_TIMEOUT_MS,
  singleSession: true,
})
const saves = createSaveStore(__dirname)
const stats = createStatsCollector()

let shuttingDown = false

if (authStore.count() === 0) {
  console.warn('[stable] ATTENTION: aucun compte configure — edite deploy/stable/.env.stable.local')
} else if (authStore.hasDefaultPassword()) {
  console.warn('[stable] ATTENTION: mot de passe par defaut — edite deploy/stable/.env.stable.local')
}

const rateBuckets = new Map()
const authFailBuckets = new Map()

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress ?? 'unknown'
}

function bumpBucket(map, key, windowMs) {
  const now = Date.now()
  let entry = map.get(key)
  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 0 }
    map.set(key, entry)
  }
  entry.count += 1
  return entry.count
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith('Basic ')) return null
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const sepIndex = decoded.indexOf(':')
    if (sepIndex < 0) return null
    return { user: decoded.slice(0, sepIndex), pass: decoded.slice(sepIndex + 1) }
  } catch {
    return null
  }
}

function getAuthUser(req) {
  const creds = parseBasicAuth(req.headers.authorization)
  if (!creds) return null
  if (!authStore.verify(creds.user, creds.pass)) return null
  return creds.user
}

function isAuthorized(req) {
  return getAuthUser(req) !== null
}

function sendJson(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...headers,
  })
  res.end(body)
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) {
        reject(new Error('body_too_large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function authorizeProtected(req, res, ip) {
  const user = getAuthUser(req)
  if (!user) {
    if (bumpBucket(authFailBuckets, ip, 60_000) > AUTH_FAIL_LIMIT) {
      send(res, 429, 'Too Many Failed Auth Attempts', { 'Retry-After': '120' })
      return null
    }
    send(res, 401, 'Authentication required', {
      'WWW-Authenticate': 'Basic realm="IDLE Isekai Chill - stable", charset="UTF-8"',
    })
    return null
  }
  const session = sessions.authorize(user, ip)
  if (!session.ok) {
    send(res, 409, 'Compte deja connecte ailleurs. Une seule session simultanee.')
    return null
  }
  return user
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...headers,
  })
  res.end(body)
}

function resolveFile(pathname) {
  let urlPath = pathname.split('?')[0] || '/'
  const rewritten = rewriteLegacyAssetUrl(urlPath)
  if (rewritten) urlPath = rewritten

  if (urlPath === '/') urlPath = '/index.html'

  const relative = urlPath.replace(/^\/+/, '').replace(/\.\./g, '')
  const absolute = normalize(join(DIST_ROOT, relative))
  if (!absolute.startsWith(normalize(DIST_ROOT + sep)) && absolute !== normalize(DIST_ROOT)) {
    return null
  }
  if (!existsSync(absolute) || !statSync(absolute).isFile()) {
    const spaIndex = join(DIST_ROOT, 'index.html')
    return existsSync(spaIndex) ? spaIndex : null
  }
  return absolute
}

function lanAddresses(scheme) {
  const lines = []
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family !== 'IPv4' || entry.internal) continue
      lines.push(`${scheme}://${entry.address}:${PORT}/`)
    }
  }
  return lines
}

function resolveTlsOptions() {
  if (!TLS_ENABLED) return null

  if (existsSync(TLS_PFX_PATH)) {
    return {
      pfx: readFileSync(TLS_PFX_PATH),
      passphrase: TLS_PFX_PASS,
    }
  }

  if (existsSync(TLS_CERT_PATH) && existsSync(TLS_KEY_PATH)) {
    return {
      cert: readFileSync(TLS_CERT_PATH),
      key: readFileSync(TLS_KEY_PATH),
    }
  }

  console.warn('[stable] HTTPS demandé mais certificats absents.')
  console.warn('         Lance : npm run tls:stable')
  return null
}

function isPublicAssetPath(pathname) {
  if (
    pathname.startsWith('/_vite/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/gacha/') ||
    pathname.startsWith('/minigames/') ||
    pathname.startsWith('/companions/')
  ) {
    return true
  }
  if (pathname === '/favicon.svg' || pathname === '/build-info.json') {
    return true
  }
  if (pathname === MOBILE_CERT_URL || pathname === MOBILE_CERT_URL_LEGACY) {
    return true
  }
  const ext = extname(pathname).toLowerCase()
  return ext.length > 0 && ext !== '.html'
}

function requestPathname(url) {
  return (url?.split('?')[0] ?? '/')
}

const requestHandler = async (req, res) => {
  const ip = clientIp(req)
  const pathname = requestPathname(req.url)
  stats.bumpRequest()

  if (shuttingDown) {
    send(res, 503, 'Server shutting down')
    return
  }

  if (pathname === MOBILE_CERT_URL || pathname === MOBILE_CERT_URL_LEGACY || pathname === `${MOBILE_CERT_URL}/` || pathname === `${MOBILE_CERT_URL_LEGACY}/`) {
    const certFile = existsSync(MOBILE_CERT_PATH) ? MOBILE_CERT_PATH : MOBILE_CERT_FALLBACK
    if (!existsSync(certFile)) {
      send(res, 404, 'Certificat mobile absent — npm run tls:stable sur le PC')
      return
    }
    res.writeHead(200, {
      'Content-Type': 'application/x-x509-ca-cert',
      'Content-Disposition': 'attachment; filename="idle-isekai-chill-ca.cer"',
      'Cache-Control': 'no-cache',
    })
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    createReadStream(certFile).pipe(res)
    return
  }

  const publicAsset = isPublicAssetPath(pathname)

  if ((req.url?.length ?? 0) > MAX_URL_LENGTH) {
    send(res, 414, 'URI Too Long')
    return
  }

  if (pathname === STATUS_URL && isLoopbackIp(ip)) {
    sendJson(res, 200, {
      ...stats.snapshot(() => sessions.snapshot()),
      saves: saves.listUsers(),
      port: PORT,
      scheme: tlsOptions ? 'https' : 'http',
      authUsers: authStore.usernames(),
      singleSession: SINGLE_SESSION,
      cloudSaves: CLOUD_SAVES,
    })
    return
  }

  if (pathname === SHUTDOWN_URL && isLoopbackIp(ip) && req.method === 'POST') {
    sendJson(res, 200, { ok: true, message: 'shutdown initiated' })
    shuttingDown = true
    setTimeout(() => {
      server.close(() => process.exit(0))
    }, 250)
    return
  }

  if (pathname === SAVE_URL && CLOUD_SAVES) {
    if (req.method === 'GET') {
      const user = authorizeProtected(req, res, ip)
      if (!user) return
      const raw = saves.read(user)
      if (!raw) {
        send(res, 404, 'No save')
        return
      }
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      })
      res.end(raw)
      return
    }
    if (req.method === 'PUT') {
      const user = authorizeProtected(req, res, ip)
      if (!user) return
      try {
        const body = await readBody(req, MAX_SAVE_BYTES)
        saves.write(user, body)
        sendJson(res, 200, { ok: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'save_failed'
        send(res, message === 'save_too_large' ? 413 : 400, message)
      }
      return
    }
    send(res, 405, 'Method Not Allowed', { Allow: 'GET, PUT' })
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD, PUT' })
    return
  }

  if (bumpBucket(rateBuckets, ip, 60_000) > RATE_LIMIT) {
    send(res, 429, 'Too Many Requests', { 'Retry-After': '60' })
    return
  }

  if (!publicAsset && !authorizeProtected(req, res, ip)) {
    return
  }

  const filePath = resolveFile(req.url ?? '/')
  if (!filePath) {
    send(res, 404, 'Not Found')
    return
  }

  const ext = extname(filePath).toLowerCase()
  const type = MIME[ext] ?? 'application/octet-stream'

  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  createReadStream(filePath).on('error', () => {
    if (!res.headersSent) send(res, 500, 'Internal Server Error')
  }).pipe(res)
}

if (!existsSync(DIST_ROOT)) {
  console.error('[stable] Build PROD manquante — npm run build:stable:prod (apres commit + push)')
  process.exit(1)
}

const tlsOptions = resolveTlsOptions()
const scheme = tlsOptions ? 'https' : 'http'
const server = tlsOptions
  ? createHttpsServer(tlsOptions, requestHandler)
  : createHttpServer(requestHandler)

server.maxHeadersCount = 32
server.headersTimeout = 10_000
server.requestTimeout = 15_000

server.listen(PORT, HOST, () => {
  process.stdout.write(`[stable] ready ${scheme}://127.0.0.1:${PORT}/\n`)
  console.log('')
  console.log('=== IDLE Isekai Chill — serveur STABLE (isolé du dev) ===')
  console.log(`Auth    : ${authStore.count()} compte(s) — ${authStore.usernames().join(', ')}`)
  console.log(`TLS     : ${tlsOptions ? 'HTTPS (cert auto-signé)' : 'HTTP — génère les certs pour HTTPS'}`)
  console.log(`Local   : ${scheme}://127.0.0.1:${PORT}/`)
  for (const url of lanAddresses(scheme)) {
    console.log(`Réseau  : ${url}  (téléphone / autre PC — même Wi‑Fi)`)
  }
  if (tlsOptions) {
    console.log('')
    console.log('Mobile CA   : installer ca-mobile.cer une fois (Parametres > Certificat AC)')
    console.log(`  Wi-Fi       : ${scheme}://192.168.x.x:${PORT}${MOBILE_CERT_URL}`)
    if (PUBLIC_HOST) {
      console.log(`  4G / ext.   : ${scheme}://${PUBLIC_HOST}:${PORT}/`)
    } else {
      console.log('  4G / ext.   : definis STABLE_PUBLIC_HOST dans .env.stable.local + npm run tls:stable')
    }
  }
  console.log('')
  console.log('Guide mobile exterieur : deploy/stable/README.md')
  console.log('Launcher : npm run launcher:stable')
  console.log('Arrêt : Ctrl+C')
  console.log('')
})

function shutdownGracefully(signal) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`\n[stable] ${signal} — arret propre…`)
  server.close(() => {
    console.log('[stable] serveur arrete.')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGINT', () => shutdownGracefully('SIGINT'))
process.on('SIGTERM', () => shutdownGracefully('SIGTERM'))
