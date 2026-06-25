/**
 * Surveillance et contrôle du serveur Vite de développement (port 5173).
 */
import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export function createDevServerManager({
  repoRoot,
  governor,
  governorConfig,
  readEnvNumber,
  readEnvBool,
  log,
  isPortInUse,
  findPortOwnerInfo,
  killProcessByPid,
  isShuttingDown,
}) {
  const DEV_PORT = readEnvNumber('LAUNCHER_DEV_PORT', 5173)
  const enabled = readEnvBool('LAUNCHER_DEV_ENABLED', true)
  const autoStart = readEnvBool('LAUNCHER_DEV_AUTO_START', false)
  const autoRestart = readEnvBool('LAUNCHER_DEV_AUTO_RESTART', true)
  const viteBin = join(repoRoot, 'node_modules', 'vite', 'bin', 'vite.js')

  let devChild = null
  let devAttached = false
  let devConnectionState = 'offline'
  let devPortOwner = null
  let devStartedAt = null
  let devRestartTimer = null
  let devRestartCount = 0

  function devUrl() {
    return `http://127.0.0.1:${DEV_PORT}/`
  }

  function fetchDevStatus() {
    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: DEV_PORT,
          path: '/',
          method: 'GET',
          timeout: 3000,
        },
        (res) => {
          res.resume()
          resolve(res.statusCode != null && res.statusCode < 500)
        },
      )
      req.on('error', () => resolve(false))
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
      req.end()
    })
  }

  function waitUntilDevUp(maxMs = 90_000) {
    const started = Date.now()
    return new Promise((resolve) => {
      const tick = async () => {
        if (await fetchDevStatus()) {
          resolve(true)
          return
        }
        if (Date.now() - started > maxMs) {
          resolve(false)
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

  function syncGovernorPid() {
    if (!governorConfig.enabled) return
    if (devChild?.pid) {
      governor.registerPid(devChild.pid, 'dev')
      return
    }
    if (devAttached && devPortOwner?.pid) {
      governor.registerPid(devPortOwner.pid, 'dev')
    }
  }

  function clearGovernorPid() {
    if (devChild?.pid) governor.unregisterPid(devChild.pid)
    else if (devPortOwner?.pid) governor.unregisterPid(devPortOwner.pid)
  }

  async function refreshDevConnectionState() {
    if (!enabled) {
      devConnectionState = 'disabled'
      return false
    }

    const up = await fetchDevStatus()
    const inUse = await isPortInUse(DEV_PORT)
    devPortOwner = inUse ? findPortOwnerInfo(DEV_PORT) : null

    if (up) {
      if (!devChild) {
        devAttached = true
        devConnectionState = 'watching'
      } else {
        devAttached = false
        devConnectionState = 'online'
      }
      syncGovernorPid()
      return true
    }

    if (inUse) {
      devConnectionState = devChild ? 'starting' : 'blocked'
    } else {
      devConnectionState = devChild ? 'starting' : 'offline'
      devAttached = false
      if (!devChild) clearGovernorPid()
    }
    return false
  }

  function devConnectionMessage() {
    switch (devConnectionState) {
      case 'disabled':
        return 'Serveur dev désactivé dans la config.'
      case 'online':
        return devPortOwner
          ? `Vite géré par ce lanceur · ${devPortOwner.name} (PID ${devPortOwner.pid}).`
          : 'Vite géré par ce lanceur.'
      case 'watching':
        return devPortOwner
          ? `Vite déjà actif · ${devPortOwner.name} (PID ${devPortOwner.pid}) — pas lancé par cette fenêtre.`
          : 'Vite déjà actif — mode surveillance.'
      case 'blocked':
        return devPortOwner
          ? `Port ${DEV_PORT} occupé par ${devPortOwner.name} (PID ${devPortOwner.pid}).`
          : `Port ${DEV_PORT} occupé.`
      case 'starting':
        return 'Démarrage Vite en cours…'
      default:
        return 'Vite arrêté — tu peux le démarrer depuis l’onglet Dev.'
    }
  }

  function scheduleAutoRestart(reason) {
    if (!autoRestart || isShuttingDown() || devRestartTimer) return
    devRestartCount += 1
    log(`[launcher] dev — ${reason} · redémarrage auto (#${devRestartCount}) dans 3s…`)
    devRestartTimer = setTimeout(() => {
      devRestartTimer = null
      void tryStartDevServer()
    }, 3000)
  }

  function startDevServer() {
    if (!enabled) return { ok: false, error: 'disabled' }
    if (devChild) return { ok: false, error: 'already_managed' }
    if (!existsSync(viteBin)) {
      return { ok: false, error: 'missing_vite', message: 'Lance npm install à la racine du projet.' }
    }

    devChild = spawn(
      process.execPath,
      [viteBin, '--host', '127.0.0.1', '--port', String(DEV_PORT), '--strictPort'],
      {
        cwd: repoRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0' },
      },
    )
    devStartedAt = Date.now()
    devConnectionState = 'starting'

    devChild.stdout.on('data', (buf) => process.stdout.write(buf))
    devChild.stderr.on('data', (buf) => process.stderr.write(buf))
    devChild.on('spawn', () => {
      if (governorConfig.enabled && devChild.pid) {
        governor.registerPid(devChild.pid, 'dev')
        log(`[launcher] dev Vite PID ${devChild.pid} · port ${DEV_PORT}`)
      }
    })
    devChild.on('exit', (code, signal) => {
      log(`[launcher] dev Vite terminé (code=${code ?? 'null'} signal=${signal ?? 'null'})`)
      if (devChild?.pid) governor.unregisterPid(devChild.pid)
      devChild = null
      devStartedAt = null
      void refreshDevConnectionState()
      if (!isShuttingDown() && autoRestart && code !== 0) {
        scheduleAutoRestart('crash')
      }
    })

    return { ok: true }
  }

  async function stopDevServer(force = false) {
    if (devChild) {
      devChild.kill('SIGTERM')
      await sleep(1500)
      if (devChild) devChild.kill('SIGKILL')
      devChild = null
      devStartedAt = null
      await refreshDevConnectionState()
      return { ok: true }
    }

    if (force && devPortOwner?.pid) {
      const result = killProcessByPid(devPortOwner.pid, true)
      await sleep(900)
      await refreshDevConnectionState()
      return { ok: result.ok, pid: devPortOwner?.pid }
    }

    await refreshDevConnectionState()
    return { ok: !devPortOwner }
  }

  async function forceKillDevPort() {
    const listener = findPortOwnerInfo(DEV_PORT)
    if (!listener?.pid) {
      return { ok: false, error: `Aucun processus en écoute sur le port ${DEV_PORT}.` }
    }

    const pids = new Set([listener.pid])
    if (devChild?.pid) pids.add(devChild.pid)

    let killed = []
    for (const pid of pids) {
      if (pid === process.pid) continue
      const result = killProcessByPid(pid, true)
      if (result.ok) killed.push(pid)
    }

    devChild = null
    devAttached = false
    devStartedAt = null
    if (listener.pid) governor.unregisterPid(listener.pid)
    await sleep(900)
    await refreshDevConnectionState()

    return {
      ok: !(await isPortInUse(DEV_PORT)),
      pid: listener.pid,
      name: listener.name,
      killed,
    }
  }

  async function tryStartDevServer() {
    if (!enabled) return { ok: false, error: 'disabled' }
    if (devChild) return { ok: false, error: 'already_managed' }
    await refreshDevConnectionState()
    if (devConnectionState === 'watching' || devConnectionState === 'online') {
      return { ok: true, state: devConnectionState, message: 'Vite déjà actif.' }
    }
    if (await isPortInUse(DEV_PORT)) {
      return { ok: false, error: 'port_occupe', state: 'blocked' }
    }

    const started = startDevServer()
    if (!started.ok) return started

    const up = await waitUntilDevUp(90_000)
    await refreshDevConnectionState()
    if (up) {
      devConnectionState = 'online'
      return { ok: true, state: 'online' }
    }
    return { ok: false, error: 'timeout', state: devConnectionState }
  }

  async function restartDevServer() {
    log('[launcher] redémarrage dev Vite…')
    await stopDevServer(true)
    devAttached = false
    return tryStartDevServer()
  }

  async function monitorDevHealth() {
    if (!enabled || !devChild) return
    const up = await fetchDevStatus()
    if (!up) {
      log('[launcher] alerte dev : process vivant mais HTTP ne répond pas')
    }
  }

  function buildDevSnapshot() {
    return {
      enabled,
      port: DEV_PORT,
      url: devUrl(),
      autoStart,
      autoRestart,
      restartCount: devRestartCount,
      startedAt: devStartedAt,
      uptimeMs: devStartedAt ? Date.now() - devStartedAt : null,
      childPid: devChild?.pid ?? null,
      attached: devAttached,
      connection: {
        state: devConnectionState,
        message: devConnectionMessage(),
        portInUse: Boolean(devPortOwner),
        portOwner: devPortOwner,
        orphanServer: Boolean(devPortOwner?.pid && !devChild),
        canForceKill: Boolean(devPortOwner?.pid),
        canStart: enabled && !devChild && devConnectionState !== 'online' && devConnectionState !== 'watching',
        up: devConnectionState === 'online' || devConnectionState === 'watching',
      },
    }
  }

  function shutdown() {
    if (devRestartTimer) {
      clearTimeout(devRestartTimer)
      devRestartTimer = null
    }
  }

  return {
    enabled,
    autoStart,
    DEV_PORT,
    refreshDevConnectionState,
    tryStartDevServer,
    stopDevServer,
    restartDevServer,
    forceKillDevPort,
    buildDevSnapshot,
    monitorDevHealth,
    shutdown,
    syncGovernorPid,
  }
}
