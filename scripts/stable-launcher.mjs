/**
 * Lanceur interactif — démarre, surveille et arrête le serveur stable.
 *
 * Usage: npm run launcher:stable
 *        double-clic sur "Launch Stable Server.cmd"
 *
 * Ne crash jamais si le port est occupé : ouvre le tableau de bord avec options.
 */
import { spawn, execSync } from 'node:child_process'
import net from 'node:net'
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import http from 'node:http'
import os from 'node:os'
import readline from 'node:readline'
import { createResourceGovernor, readGovernorConfig } from './stable-resource-governor.mjs'
import { createDevServerManager } from './dev-server-manager.mjs'
import { createLauncherGuiServer, openGuiWindow, killGuiBrowserWindow } from './stable-launcher-gui.mjs'
import { requireProdDist, PROD_BUILD_HINT } from './stable-prod-guard.mjs'
import { prepareLauncherUiAssets } from './prepare-launcher-ui-assets.mjs'
import {
  findPortOwnerInfo,
  killProcessByPid,
} from './windows-shell.mjs'
import {
  attachEndpointUsage,
  buildServerEndpoints,
  enrichSessions,
  readEnvValue,
} from './stable-server-endpoints.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const stableRoot = join(repoRoot, 'deploy', 'stable')
const serverScript = join(stableRoot, 'server.mjs')
const distIndex = join(stableRoot, 'dist', 'index.html')
const envLocal = join(stableRoot, '.env.stable.local')

const PORT = readEnvPort()
const useTls = readEnvTls()
const envText = readEnvFileText()
const governorConfig = readGovernorConfig(envText)
const governor = createResourceGovernor(governorConfig)
const GUI_PORT = readEnvNumber('STABLE_LAUNCHER_GUI_PORT', 8789)
const guiEnabled = !process.argv.includes('--no-gui') && readEnvBool('STABLE_LAUNCHER_GUI', true)
const uiRoot = join(stableRoot, 'launcher-ui')

let child = null
let attached = false
let connectionState = 'offline'
let portOwner = null
let monitorTimer = null
let governorTimer = null
let connectionPollTimer = null
let guiServer = null
let guiHostHandle = null
let shuttingDown = false
let lastStatus = null
let lastGovernorWarnAt = 0
let lastGovernorFreezeAt = 0
let startupProfile = null
let startupApplied = false

const STARTUP_PROFILES = new Set(['dev', 'prod', 'both', 'monitor'])

const devManager = createDevServerManager({
  repoRoot,
  governor,
  governorConfig,
  readEnvNumber,
  readEnvBool,
  log,
  isPortInUse,
  findPortOwnerInfo,
  killProcessByPid,
  isShuttingDown: () => shuttingDown,
})

function readEnvNumber(key, fallback) {
  const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'))
  if (!match) return fallback
  const value = Number.parseInt(match[1].trim(), 10)
  return Number.isFinite(value) ? value : fallback
}

function readEnvBool(key, fallback) {
  const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'))
  if (!match) return fallback
  const value = match[1].trim().toLowerCase()
  if (value === '0' || value === 'false') return false
  if (value === '1' || value === 'true') return true
  return fallback
}

function readEnvFileText() {
  return existsSync(envLocal) ? readFileSync(envLocal, 'utf8') : ''
}

function readEnvPort() {
  const match = readEnvFileText().match(/^STABLE_PORT=(.+)$/m)
  return match ? Number.parseInt(match[1], 10) || 8787 : 8787
}

function readEnvTls() {
  const match = readEnvFileText().match(/^STABLE_TLS=(.+)$/m)
  return !match || (match[1].trim() !== '0' && match[1].trim() !== 'false')
}

function detectLanIp() {
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address
      }
    }
  }
  return '127.0.0.1'
}

function log(line = '') {
  process.stdout.write(`${line}\n`)
}

function prepare() {
  const pfx = join(stableRoot, 'certs', 'cert.pfx')
  if (useTls && !existsSync(pfx)) {
    log('[launcher] Certificats absents — tls:stable…')
    execSync('node scripts/generate-stable-tls.mjs', { cwd: repoRoot, stdio: 'inherit' })
  }
  const caMobile = join(stableRoot, 'certs', 'ca-mobile.cer')
  const setupDir = join(stableRoot, 'dist', 'setup')
  if (existsSync(caMobile)) {
    mkdirSync(setupDir, { recursive: true })
    copyFileSync(caMobile, join(setupDir, 'ca-mobile.cer'))
  }
  mkdirSync(join(stableRoot, 'data', 'saves'), { recursive: true })
}

function fetchStatus() {
  return new Promise((resolve) => {
    const client = useTls ? https : http
    const req = client.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: '/__stable/status',
        method: 'GET',
        rejectUnauthorized: false,
        timeout: 4000,
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
          } catch {
            resolve(null)
          }
        })
      },
    )
    req.on('error', () => resolve(null))
    req.on('timeout', () => {
      req.destroy()
      resolve(null)
    })
    req.end()
  })
}

function waitUntilUp(maxMs = 120_000) {
  const started = Date.now()
  return new Promise((resolve) => {
    const tick = async () => {
      const status = await fetchStatus()
      if (status?.up) {
        resolve(status)
        return
      }
      if (Date.now() - started > maxMs) {
        resolve(null)
        return
      }
      setTimeout(tick, 800)
    }
    tick()
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isPortInUse(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const probe = net.createServer()
    probe.once('error', (error) => resolve(error.code === 'EADDRINUSE'))
    probe.once('listening', () => {
      probe.close(() => resolve(false))
    })
    probe.listen(port, host)
  })
}

async function refreshConnectionState() {
  const status = await fetchStatus()
  const inUse = await isPortInUse(PORT)
  portOwner = inUse ? findPortOwnerInfo(PORT) : null

  if (status?.up) {
    lastStatus = status
    if (!child) {
      attached = true
      connectionState = 'watching'
      if (governorConfig.enabled && portOwner?.pid) {
        governor.registerPid(portOwner.pid, 'stable')
      }
    } else {
      attached = false
      connectionState = 'online'
    }
    return status
  }

  lastStatus = null
  attached = false
  if (child?.pid) governor.unregisterPid(child.pid)
  else if (portOwner?.pid) governor.unregisterPid(portOwner.pid)
  if (inUse) {
    connectionState = child ? 'starting' : 'blocked'
  } else {
    connectionState = child ? 'starting' : 'offline'
  }
  return null
}

function connectionMessage() {
  switch (connectionState) {
    case 'online':
      return portOwner
        ? `Serveur géré par ce lanceur · ${portOwner.name} (PID ${portOwner.pid}).`
        : 'Serveur géré par ce lanceur.'
    case 'watching':
      return portOwner
        ? `Serveur actif en arrière-plan · ${portOwner.name} (PID ${portOwner.pid}) — pas lancé par cette fenêtre.`
        : 'Serveur stable déjà actif — mode surveillance (aucun second process).'
    case 'blocked':
      return portOwner
        ? `Port ${PORT} occupé par ${portOwner.name} (PID ${portOwner.pid}).`
        : `Port ${PORT} occupé — origine inconnue.`
    case 'starting':
      return portOwner
        ? `Démarrage en cours · ${portOwner.name} (PID ${portOwner.pid}) sur le port.`
        : 'Démarrage en cours ou process bloqué sur le port…'
    default:
      return 'Aucun serveur détecté — tu peux en démarrer un.'
  }
}

function buildSnapshot() {
  const scheme = lastStatus?.scheme ?? (useTls ? 'https' : 'http')
  const lanIp = detectLanIp()
  const publicHost = readEnvValue(envText, 'STABLE_PUBLIC_HOST')
  const baseEndpoints = buildServerEndpoints({
    scheme,
    port: PORT,
    lanIp,
    publicHost,
  })
  const sessions = enrichSessions(lastStatus?.sessions, lanIp)
  const access = attachEndpointUsage(baseEndpoints, lastStatus?.sessions, lanIp)
  const portListener = findPortOwnerInfo(PORT)
  const orphanServer = Boolean(portListener?.pid && !child)

  return {
    server: lastStatus ? { ...lastStatus, sessions } : null,
    governor: governor.getState(),
    governorEnabled: governorConfig.enabled,
    dev: devManager.buildDevSnapshot(),
    attached,
    childPid: child?.pid ?? null,
    gamePort: PORT,
    prodDistReady: prodDistReady(),
    prodDistHint: prodDistReady() ? null : PROD_BUILD_HINT.trim(),
    useTls,
    lanIp,
    publicHost: publicHost || null,
    guiPort: GUI_PORT,
    launcherCertUrl: `http://127.0.0.1:${GUI_PORT}/setup/ca-mobile.cer`,
    endpoints: access.endpoints,
    accessUsage: {
      totalSessions: access.totalSessions,
      counts: access.counts,
      primaryKind: access.primaryKind,
    },
    connection: {
      state: connectionState,
      message: connectionMessage(),
      portInUse: Boolean(portListener),
      portOwner: portListener,
      orphanServer,
      canForceKill: Boolean(portListener?.pid),
      canGracefulShutdown: connectionState === 'blocked' || connectionState === 'watching' || connectionState === 'online',
      stableRecognized: connectionState === 'watching' || connectionState === 'online',
    },
    startup: {
      needsChoice: !startupApplied,
      profile: startupProfile,
      stableUp: connectionState === 'watching' || connectionState === 'online',
      devUp: devManager.buildDevSnapshot().connection?.up ?? false,
      prodDistReady: prodDistReady(),
      stablePort: PORT,
      devPort: devManager.DEV_PORT,
    },
  }
}

async function applyStartupProfile(profile) {
  if (!STARTUP_PROFILES.has(profile)) {
    return { ok: false, error: 'profil_invalide' }
  }

  startupProfile = profile
  startupApplied = true
  const results = { stable: null, dev: null }

  await refreshConnectionState()
  await devManager.refreshDevConnectionState()

  if (profile === 'monitor') {
    log('[launcher] surveillance seule — aucun nouveau serveur démarré')
    return { ok: true, profile, results }
  }

  if (profile === 'dev' || profile === 'both') {
    const devSnap = devManager.buildDevSnapshot()
    if (devSnap.connection.state === 'offline') {
      log('[launcher] démarrage dev Vite…')
      results.dev = await devManager.tryStartDevServer()
    } else {
      results.dev = { ok: true, state: devSnap.connection.state, message: 'Dev déjà actif — attaché' }
      log(`[launcher] dev — ${results.dev.message}`)
    }
  }

  if (profile === 'prod' || profile === 'both') {
    if (connectionState === 'offline') {
      log('[launcher] démarrage serveur stable…')
      results.stable = await tryStartServer()
    } else {
      results.stable = { ok: true, state: connectionState, message: 'Stable déjà actif — attaché' }
      log(`[launcher] stable — ${results.stable.message}`)
    }
  }

  if (governorConfig.enabled && !governorTimer) startGovernorMonitor()

  log(`[launcher] profil « ${profile} » appliqué`)
  return { ok: true, profile, results }
}

function clearLauncherTimers() {
  if (monitorTimer) {
    clearInterval(monitorTimer)
    monitorTimer = null
  }
  if (governorTimer) {
    clearInterval(governorTimer)
    governorTimer = null
  }
  if (connectionPollTimer) {
    clearInterval(connectionPollTimer)
    connectionPollTimer = null
  }
}

async function closeGuiServer() {
  if (!guiServer) return
  await new Promise((resolve) => {
    guiServer.close(() => resolve())
  })
  guiServer = null
}

function createGuiActions() {
  return {
    restart: async () => {
      await restartServer()
    },
    unfreeze: () => governor.resumeProcess(true),
    shutdown: async () => {
      await stopServer(true)
      await refreshConnectionState()
    },
    quitLauncher: async () => {
      if (shuttingDown) return
      shuttingDown = true
      clearLauncherTimers()
      try {
        await stopServer(true)
        await devManager.stopDevServer(true)
        devManager.shutdown()
        killGuiBrowserWindow(guiHostHandle ?? {})
        await closeGuiServer()
      } catch (error) {
        log(`[launcher] fermeture : ${error.message ?? error}`)
      } finally {
        process.exit(0)
      }
    },
    gracefulPortRelease: async () => {
      const ok = await tryGracefulPortRelease()
      await refreshConnectionState()
      return { ok, state: connectionState }
    },
    forceKillPort: async () => {
      const result = await forceKillPortProcess()
      await refreshConnectionState()
      return result
    },
    startServer: async () => {
      return tryStartServer()
    },
    attach: async () => {
      const status = await refreshConnectionState()
      return { ok: Boolean(status), state: connectionState }
    },
    startDev: async () => devManager.tryStartDevServer(),
    stopDev: async () => devManager.stopDevServer(false),
    restartDev: async () => devManager.restartDevServer(),
    forceKillDev: async () => {
      const result = await devManager.forceKillDevPort()
      await devManager.refreshDevConnectionState()
      return result
    },
    applyStartup: async (profile) => applyStartupProfile(profile),
  }
}

async function tryGracefulPortRelease() {
  await postShutdown()
  await sleep(1200)
  if (await fetchStatus()) return true
  return !(await isPortInUse(PORT))
}

async function forceKillPortProcess() {
  const listener = findPortOwnerInfo(PORT)
  if (!listener?.pid) {
    return { ok: false, error: `Aucun processus en écoute sur le port ${PORT}.` }
  }

  const pids = new Set([listener.pid])
  if (child?.pid) pids.add(child.pid)

  let killed = []
  let lastError = null
  for (const pid of pids) {
    if (pid === process.pid) continue
    const result = killProcessByPid(pid, true)
    if (result.ok) killed.push(pid)
    else lastError = result.error
  }

  child = null
  attached = false
  if (listener.pid) governor.unregisterPid(listener.pid)
  await sleep(900)
  await refreshConnectionState()

  const freed = !(await isPortInUse(PORT))
  return {
    ok: freed,
    pid: listener.pid,
    name: listener.name,
    killed,
    orphan: !child,
    error: freed
      ? undefined
      : lastError ?? 'Échec — clic droit sur le lanceur → Exécuter en tant qu’administrateur, puis réessaye.',
  }
}

function prodDistReady() {
  return existsSync(distIndex)
}

async function tryStartServer() {
  if (child) return { ok: false, error: 'Un process serveur est déjà lancé par ce lanceur.' }
  if (!prodDistReady()) {
    log('[launcher] build PROD absente — npm run build:stable:prod requis pour le serveur stable')
    return { ok: false, error: 'missing_dist', message: PROD_BUILD_HINT.trim() }
  }
  await refreshConnectionState()
  if (connectionState === 'watching' || connectionState === 'online') {
    return { ok: true, state: connectionState, message: 'Serveur déjà actif.' }
  }
  if (await isPortInUse(PORT)) {
    return { ok: false, error: 'port_occupe', state: 'blocked' }
  }
  startServer()
  connectionState = 'starting'
  if (governorConfig.enabled && !governorTimer) startGovernorMonitor()
  const status = await waitUntilUp(90_000)
  if (status) {
    lastStatus = status
    connectionState = 'online'
    attached = false
    return { ok: true, state: 'online' }
  }
  await refreshConnectionState()
  return { ok: false, error: 'timeout', state: connectionState }
}

async function ensureGuiServer() {
  if (guiServer) return guiServer
  if (await isPortInUse(GUI_PORT, '127.0.0.1')) {
    log(`[launcher] tableau de bord déjà actif sur le port ${GUI_PORT}`)
    return null
  }
  try {
    guiServer = await createLauncherGuiServer({
      port: GUI_PORT,
      uiRoot,
      caCertPath: join(stableRoot, 'certs', 'ca-mobile.cer'),
      getSnapshot: buildSnapshot,
      actions: createGuiActions(),
    })
    return guiServer
  } catch (error) {
    if (error?.code === 'EADDRINUSE') {
      log(`[launcher] tableau de bord déjà actif sur le port ${GUI_PORT}`)
      return null
    }
    throw error
  }
}

async function startGui() {
  if (!guiEnabled) return null
  const url = `http://127.0.0.1:${GUI_PORT}/`
  try {
    await ensureGuiServer()
  } catch (error) {
    log(`[launcher] serveur dashboard indisponible : ${error.message ?? error}`)
  }

  const opened = await openGuiWindow(url, uiRoot)
  guiHostHandle = opened.ok
    ? { hostPid: opened.hostPid ?? null, userDataDir: opened.userDataDir ?? null }
    : null
  if (opened.ok) {
    const via = opened.fallback
      ? `${opened.mode ?? 'navigateur'} (repli — WebView2 indisponible)`
      : (opened.mode ?? 'fenêtre native')
    log(`[launcher] interface graphique : ${url} (${via})`)
  } else {
    log(`[launcher] fenêtre auto impossible${opened.error ? ` — ${opened.error}` : ''}`)
    log(`[launcher] le serveur dashboard tourne quand même sur ${url}`)
  }
  return url
}

function startServer() {
  if (child) return
  child = spawn(process.execPath, [serverScript], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  })
  child.stdout.on('data', (buf) => process.stdout.write(buf))
  child.stderr.on('data', (buf) => process.stderr.write(buf))
  child.on('spawn', () => {
    if (governorConfig.enabled && child.pid) {
      governor.registerPid(child.pid, 'stable')
      log(
        `[launcher] gouverneur actif — plafond partagé ${governorConfig.cpuMaxPct}% CPU / ${governorConfig.memMaxPct}% RAM (stable + dev)`,
      )
    }
  })
  child.on('exit', (code, signal) => {
    log(`[launcher] process serveur terminé (code=${code ?? 'null'} signal=${signal ?? 'null'})`)
    if (child?.pid) governor.unregisterPid(child.pid)
    child = null
    void refreshConnectionState().then(() => {
      if (connectionState === 'blocked') {
        log(`[launcher] port ${PORT} toujours occupé — utilise le tableau de bord pour agir.`)
      }
    })
  })
}

async function postShutdown() {
  return new Promise((resolve) => {
    const client = useTls ? https : http
    const req = client.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: '/__stable/shutdown',
        method: 'POST',
        rejectUnauthorized: false,
        timeout: 3000,
      },
      () => resolve(true),
    )
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
    req.end()
  })
}

async function stopServer(graceful = true) {
  if (attached || (!child && (connectionState === 'watching' || connectionState === 'online'))) {
    if (graceful) await postShutdown()
    attached = false
    await sleep(600)
    await refreshConnectionState()
    return
  }
  if (!child) return
  if (graceful) {
    await postShutdown()
    await new Promise((r) => setTimeout(r, 600))
  }
  if (child) {
    child.kill('SIGTERM')
    await new Promise((r) => setTimeout(r, 1500))
    if (child) child.kill('SIGKILL')
  }
  await refreshConnectionState()
}

async function restartServer() {
  log('[launcher] redémarrage…')
  await stopServer(true)
  attached = false
  return tryStartServer()
}

function formatUptime(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}h ${m}m ${sec}s`
}

function renderDashboard(status) {
  const scheme = status.scheme ?? (useTls ? 'https' : 'http')
  const gov = governor.getState()
  log('')
  log('=== Havre des Brumes — serveur stable ===')
  log(`Etat        : ${connectionMessage()}`)
  if (status?.uptimeMs) log(`Uptime      : ${formatUptime(status.uptimeMs)}`)
  if (governorConfig.enabled) log(`Ressources  : ${gov.formatLine}`)
  log(`Local       : ${scheme}://127.0.0.1:${PORT}/`)
  log('')
}

function startGovernorMonitor() {
  if (!governorConfig.enabled) return
  if (governorTimer) return
  governorTimer = setInterval(() => {
    devManager.syncGovernorPid()
    if (governor.getTargetCount() === 0) return
    const before = governor.getState()
    governor.tick()
    const after = governor.getState()
    const now = Date.now()
    if (after.warning && !before.warning && now - lastGovernorWarnAt > 30_000) {
      lastGovernorWarnAt = now
      log(`[launcher] WARNING ressources — ${after.formatLine}`)
    }
    if (after.frozen && !before.frozen && now - lastGovernorFreezeAt > 5000) {
      lastGovernorFreezeAt = now
      log(`[launcher] FREEZE — ${after.frozenReason ?? 'depassement'}`)
    }
  }, governorConfig.sampleMs)
}

function startConnectionPoll() {
  if (connectionPollTimer) return
  connectionPollTimer = setInterval(() => {
    void refreshConnectionState()
    void devManager.refreshDevConnectionState()
  }, 5000)
}

function startMonitor() {
  if (monitorTimer) return
  monitorTimer = setInterval(async () => {
    const status = await fetchStatus()
    if (status) lastStatus = status
    if (!status?.up && child) {
      log('[launcher] alerte : process vivant mais HTTP ne répond pas')
    }
    await devManager.monitorDevHealth()
  }, 15_000)
}

async function main() {
  process.title = 'IDLE Isekai Chill — Lanceur'

  const onQuitSignal = () => {
    void createGuiActions().quitLauncher()
  }
  process.once('SIGINT', onQuitSignal)
  process.once('SIGTERM', onQuitSignal)
  if (process.platform === 'win32') {
    readline.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', onQuitSignal)
  }

  log('')
  log('IDLE Isekai Chill — lanceur stable + dev')
  try {
    await prepareLauncherUiAssets()
  } catch (error) {
    log(`[launcher] préparation UI : ${error.message ?? error}`)
  }
  await startGui()
  prepare()

  await refreshConnectionState()
  await devManager.refreshDevConnectionState()

  log('[launcher] choisis Dev / Prod / Les deux dans le tableau de bord')

  startConnectionPoll()
  startMonitor()

  if (!guiEnabled && lastStatus) renderDashboard(lastStatus)

  if (guiEnabled) return

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.on('line', async (line) => {
    const cmd = line.trim().toLowerCase()
    if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
      rl.close()
      await createGuiActions().quitLauncher()
    } else if (cmd === 'r' || cmd === 'restart') {
      await restartServer()
    } else if (cmd === 'u' || cmd === 'unfreeze' || cmd === 'resume') {
      governor.resumeProcess(true)
    } else if (cmd === 'k' || cmd === 'kill') {
      await forceKillPortProcess()
      await refreshConnectionState()
    } else {
      await refreshConnectionState()
      if (lastStatus) renderDashboard(lastStatus)
      else log(`[launcher] ${connectionMessage()}`)
    }
  })
}

main().catch((error) => {
  console.error('[launcher] fatal', error)
  process.exit(1)
})
