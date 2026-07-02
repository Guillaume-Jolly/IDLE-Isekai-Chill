#!/usr/bin/env node

/**

 * Havre des Brumes — lanceur dev local.

 * Démarre Vite, ouvre le jeu, expose un petit tableau de bord de monitoring.

 */



import { spawn, exec, execFile } from 'node:child_process'

import { createServer } from 'node:http'

import {

  appendFileSync,

  existsSync,

  mkdirSync,

  readFileSync,

  unlinkSync,

  watchFile,

  writeFileSync,

} from 'node:fs'

import { dirname, join } from 'node:path'

import { fileURLToPath } from 'node:url'

import { findPortListenerPid, killProcessByPid } from '../windows-shell.mjs'



const __dirname = dirname(fileURLToPath(import.meta.url))

const REPO_ROOT = join(__dirname, '..', '..')

const DASHBOARD_PORT = Number.parseInt(process.env.HAVRE_DEV_DASHBOARD_PORT ?? '9221', 10)

const MAX_LOG_LINES = 400

const DASHBOARD_PATH = join(__dirname, 'dashboard.html')

const SESSION_DIR = join(__dirname, '.dev-session')

const SESSION_STATE_FILE = join(SESSION_DIR, 'state.json')

const LAUNCHER_LOCK_FILE = join(SESSION_DIR, 'launcher.lock')

const VITE_LOG_FILE = join(SESSION_DIR, 'vite.log')

const SPAWN_AUDIT_FILE = join(SESSION_DIR, 'spawn-audit.log')

const REATTACH_ARG = '--reattach'

const CLEANUP_GHOSTS_ARG = '--cleanup-ghosts'

const SESSION_VERSION = 1



/** @type {import('node:child_process').ChildProcess | null} */

let devProcess = null

/** @type {import('node:child_process').ChildProcess | null} */

let buildProcess = null

/** @type {import('node:http').Server | null} */

let dashboardServer = null



let gameUrl = 'http://localhost:5173/'

let devStatus = 'starting'

let startedAt = Date.now()

let openedGameOnce = false

let openedDashboardOnce = false

let launcherReattached = false

/** @type {number | null} */

let attachedVitePid = null

/** @type {string[]} */

let logLines = []

let viteLogOffset = 0

let viteLogWatchStarted = false

let buildInfoWatchStarted = false



/** @type {Record<string, unknown> | null} */

let lastBuildInfoSnapshot = null

/** @type {string | null} */

let lastBuildInfoKey = null

/** @type {ReturnType<typeof setTimeout> | null} */

let buildInfoWatchTimer = null

/** @type {ReturnType<typeof setInterval> | null} */

let attachedVitePollTimer = null



const BACKGROUND_ARG = '--background'

const DASHBOARD_IDLE_SHUTDOWN_MS = 20_000

const DASHBOARD_IDLE_CHECK_MS = 5_000

const CONSOLE_HIDE_DELAY_MS = 1_500

const SHUTDOWN_GRACE_MS = 4_000



let backgroundMode = process.argv.includes(BACKGROUND_ARG)

let consoleHidden = false

/** @type {ReturnType<typeof setTimeout> | null} */

let consoleHideTimer = null

/** @type {ReturnType<typeof setInterval> | null} */

let dashboardIdleTimer = null

let lastDashboardPingAt = 0

let dashboardEverConnected = false

/** @type {number} */

let pendingShutdownAt = 0

let shuttingDown = false



function ensureSessionDir() {

  mkdirSync(SESSION_DIR, { recursive: true })

}



/** Trace toute commande système — utile pour diagnostiquer les rafales cmd. */

function auditSpawn(label, detail = '') {

  try {

    ensureSessionDir()

    const stamp = new Date().toISOString()

    appendFileSync(

      SPAWN_AUDIT_FILE,

      `[${stamp}] ${label}${detail ? ` | ${detail}` : ''}\n`,

      'utf8',

    )

  } catch {

    /* ignore */

  }

}



function spawnHidden(command, args, options = {}) {

  auditSpawn('spawn', `${command} ${(args ?? []).join(' ')}`.trim())

  return spawn(command, args, {

    shell: false,

    windowsHide: process.platform === 'win32',

    ...options,

  })

}



function killProcessPid(pid) {

  if (!pid || pid === process.pid) return

  auditSpawn('taskkill', `pid=${pid}`)

  killProcessByPid(pid, true)

}



function releaseLauncherLock() {

  try {

    if (!existsSync(LAUNCHER_LOCK_FILE)) return

    const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

    if (owner === process.pid) unlinkSync(LAUNCHER_LOCK_FILE)

  } catch {

    /* ignore */

  }

}



function tryAcquireLauncherLock() {

  ensureSessionDir()

  if (existsSync(LAUNCHER_LOCK_FILE)) {

    try {

      const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

      if (owner && owner !== process.pid && isProcessAlive(owner)) return false

    } catch {

      /* lock corrompu — on remplace */

    }

    try {

      unlinkSync(LAUNCHER_LOCK_FILE)

    } catch {

      return false

    }

  }

  try {

    writeFileSync(LAUNCHER_LOCK_FILE, String(process.pid), { flag: 'wx' })

    return true

  } catch {

    return false

  }

}



function buildInfoFingerprint(info) {

  if (!info || typeof info !== 'object') return null

  return `${info.versionLabel ?? '?'}|${info.revision ?? '?'}|${info.subRevision ?? '?'}|${info.builtAt ?? '?'}`

}



function formatBuildInfoCapture(previous, next) {

  if (!next || typeof next !== 'object') {

    return 'build-info.json mis à jour (contenu illisible)'

  }



  const label = next.versionLabel ?? '?'

  const commit = next.commitHash ?? '?'

  const dirty = next.dirty ? ' · working tree sale' : ''



  if (!previous) {

    return `Version captée : ${label} (${commit})${dirty}`

  }



  if (previous.versionLabel !== next.versionLabel) {

    return `Version captée : ${previous.versionLabel ?? '?'} → ${label} (${commit})${dirty}`

  }



  if (previous.revision !== next.revision) {

    return `Version captée : ${label} · révision ${previous.revision ?? '?'} → ${next.revision ?? '?'} (${commit})${dirty}`

  }



  if (previous.subRevision !== next.subRevision) {

    return `Version captée : ${label} · sous-révision .${previous.subRevision ?? '?'} → .${next.subRevision ?? '?'} (${commit})${dirty}`

  }



  if (previous.commitHash !== next.commitHash) {

    return `Version captée : ${label} · commit ${previous.commitHash} → ${commit}${dirty}`

  }



  return `Version captée : ${label} (${commit})${dirty}`

}



function handleBuildInfoDiskUpdate() {

  const buildInfoPath = join(REPO_ROOT, 'public', 'build-info.json')

  const next = readJson(buildInfoPath)

  const fingerprint = buildInfoFingerprint(next)



  if (!fingerprint) {

    pushLog('build-info.json touché mais illisible', 'launcher')

    return

  }



  if (fingerprint === lastBuildInfoKey) {

    return

  }



  pushLog(formatBuildInfoCapture(lastBuildInfoSnapshot, next), 'launcher')

  lastBuildInfoSnapshot = next

  lastBuildInfoKey = fingerprint

}



function watchBuildInfoFile() {

  if (buildInfoWatchStarted) return

  buildInfoWatchStarted = true

  const buildInfoPath = join(REPO_ROOT, 'public', 'build-info.json')

  if (!existsSync(buildInfoPath)) {

    return

  }



  const initial = readJson(buildInfoPath)

  if (initial) {

    lastBuildInfoSnapshot = initial

    lastBuildInfoKey = buildInfoFingerprint(initial)

  }



  watchFile(buildInfoPath, { interval: 1500 }, () => {

    if (buildInfoWatchTimer) {

      clearTimeout(buildInfoWatchTimer)

    }

    buildInfoWatchTimer = setTimeout(() => {

      buildInfoWatchTimer = null

      handleBuildInfoDiskUpdate()

    }, 250)

  })

}



/** Conserve les couleurs ANSI ; retire seulement les caractères de contrôle nuisibles. */
function preserveAnsiLogLine(text) {
  return String(text)
    .replace(/(?<!\u001B)\[(\d{1,3}(?:;\d{1,3})*)m/g, '\u001B[$1m')
    .replace(/[\u0000-\u0009\u000b-\u001a\u001c-\u001f]/g, '')
    .trim()
}

function pushLog(line, source = 'vite') {

  const stamp = new Date().toLocaleTimeString('fr-FR', { hour12: false })

  const entry = `[${stamp}] [${source}] ${preserveAnsiLogLine(line)}`

  logLines.push(entry)

  if (logLines.length > MAX_LOG_LINES) {

    logLines = logLines.slice(logLines.length - MAX_LOG_LINES)

  }

}



function appendViteOutputLine(line) {

  const preserved = preserveAnsiLogLine(line)

  if (!preserved) return

  pushLog(preserved, 'vite')

  ensureSessionDir()

  appendFileSync(VITE_LOG_FILE, `${preserved}\n`, 'utf8')

}



function resetViteLogFile() {

  ensureSessionDir()

  writeFileSync(VITE_LOG_FILE, '', 'utf8')

  viteLogOffset = 0

}



function tailViteLogFile() {

  if (!existsSync(VITE_LOG_FILE)) return

  const content = readFileSync(VITE_LOG_FILE, 'utf8')

  if (content.length <= viteLogOffset) return

  const chunk = content.slice(viteLogOffset)

  viteLogOffset = content.length

  for (const line of chunk.split(/\r?\n/)) {

    if (line.trim()) pushLog(line.trim(), 'vite')

  }

}



function initViteLogTail() {

  if (viteLogWatchStarted) return

  viteLogWatchStarted = true

  if (!existsSync(VITE_LOG_FILE)) {

    viteLogOffset = 0

    return

  }

  viteLogOffset = readFileSync(VITE_LOG_FILE, 'utf8').length

  watchFile(VITE_LOG_FILE, { interval: 500 }, () => {

    tailViteLogFile()

  })

}



function isProcessAlive(pid) {

  if (!pid || pid <= 0) return false

  try {

    process.kill(pid, 0)

    return true

  } catch {

    return false

  }

}



async function probeGameServer(url) {

  try {

    const res = await fetch(url, { cache: 'no-store' })

    return res.ok

  } catch {

    return false

  }

}



function saveSessionState({ pendingReattach = false } = {}) {

  ensureSessionDir()

  const payload = {

    version: SESSION_VERSION,

    pendingReattach,

    vitePid: devProcess?.pid ?? attachedVitePid,

    gameUrl,

    devStatus,

    startedAt,

    openedGameOnce,

    logs: logLines,

    lastBuildInfoSnapshot,

    lastBuildInfoKey,

    savedAt: Date.now(),

  }

  writeFileSync(SESSION_STATE_FILE, JSON.stringify(payload, null, 2), 'utf8')

}



function loadSessionState() {

  if (!existsSync(SESSION_STATE_FILE)) return null

  try {

    return JSON.parse(readFileSync(SESSION_STATE_FILE, 'utf8'))

  } catch {

    return null

  }

}



function clearPendingReattachFlag() {

  const state = loadSessionState()

  if (!state) return

  saveSessionState({ pendingReattach: false })

}



function startAttachedVitePoll() {

  if (attachedVitePollTimer) {

    clearInterval(attachedVitePollTimer)

  }

  attachedVitePollTimer = setInterval(async () => {

    if (!attachedVitePid) return

    if (isProcessAlive(attachedVitePid)) return

    attachedVitePid = null

    const alive = await probeGameServer(gameUrl)

    if (alive) {

      pushLog('Processus Vite d’origine introuvable, mais le serveur répond encore.', 'launcher')

      devStatus = 'running'

      return

    }

    pushLog('Session Vite interrompue (processus terminé).', 'launcher')

    devStatus = 'stopped'

  }, 3000)

}



async function tryReattachSession() {

  const state = loadSessionState()

  if (!state?.pendingReattach) {

    return false

  }



  const pid = Number(state.vitePid) || null

  const url = typeof state.gameUrl === 'string' ? state.gameUrl : gameUrl

  const pidAlive = pid ? isProcessAlive(pid) : false

  const serverAlive = await probeGameServer(url)



  if (!pidAlive && !serverAlive) {

    pushLog('Reprise impossible : aucune session Vite active détectée.', 'launcher')

    saveSessionState({ pendingReattach: false })

    return false

  }



  attachedVitePid = pidAlive ? pid : null

  gameUrl = url

  devStatus = 'running'

  startedAt = state.startedAt ?? Date.now()

  openedGameOnce = state.openedGameOnce ?? true

  logLines = Array.isArray(state.logs) ? state.logs.slice(-MAX_LOG_LINES) : []

  lastBuildInfoSnapshot = state.lastBuildInfoSnapshot ?? null

  lastBuildInfoKey = state.lastBuildInfoKey ?? null

  launcherReattached = true



  initViteLogTail()

  startAttachedVitePoll()

  clearPendingReattachFlag()

  pushLog('Lanceur redémarré — session Vite et monitoring restaurés.', 'launcher')

  if (!pidAlive && serverAlive) {

    pushLog(`Vite répond sur ${url} (PID d’origine perdu).`, 'launcher')

  } else if (pid) {

    pushLog(`Vite toujours actif (PID ${pid}).`, 'launcher')

  }

  return true

}



function readJson(path) {

  if (!existsSync(path)) return null

  try {

    return JSON.parse(readFileSync(path, 'utf8'))

  } catch {

    return null

  }

}



function readLocalBuildInfo() {

  const pkg = readJson(join(REPO_ROOT, 'package.json')) ?? {}

  const buildInfo = readJson(join(REPO_ROOT, 'public', 'build-info.json'))

  const revision = readJson(join(REPO_ROOT, 'build-revision.json'))

  return {

    packageVersion: pkg.version ?? '?',

    buildInfo,

    revision,

    branch: buildInfo?.branch ?? '—',

    commit: buildInfo?.commitHash ?? '—',

    dirty: Boolean(buildInfo?.dirty),

  }

}



async function probeExistingDashboard() {

  try {

    const controller = new AbortController()

    const timer = setTimeout(() => controller.abort(), 1_500)

    const res = await fetch(`http://127.0.0.1:${DASHBOARD_PORT}/api/status`, {

      cache: 'no-store',

      signal: controller.signal,

    })

    clearTimeout(timer)

    if (!res.ok) return null

    const data = await res.json()

    if (!data || typeof data.devStatus !== 'string') return null

    if (data.devStatus === 'stopping' || data.devStatus === 'stopped' || data.devStatus === 'crashed') {

      return null

    }

    return data

  } catch {

    return null

  }

}



function findAllListeningPidsOnPort(port) {

  if (process.platform !== 'win32') return []

  auditSpawn('netstat', `port=${port}`)

  const pid = findPortListenerPid(port)

  return pid ? [pid] : []

}



function findListeningPidOnPort(port) {

  return findAllListeningPidsOnPort(port)[0] ?? null

}



function parseGameUrlPort(url) {

  try {

    const parsed = new URL(url)

    if (parsed.port) return Number.parseInt(parsed.port, 10)

    return parsed.protocol === 'https:' ? 443 : 80

  } catch {

    return 5173

  }

}



function clearStaleLauncherLock() {

  if (!existsSync(LAUNCHER_LOCK_FILE)) return false

  try {

    const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

    if (owner && isProcessAlive(owner) && owner !== process.pid) return false

    unlinkSync(LAUNCHER_LOCK_FILE)

    return true

  } catch {

    try {

      unlinkSync(LAUNCHER_LOCK_FILE)

      return true

    } catch {

      return false

    }

  }

}



async function cleanupGhostProcesses() {

  const killed = []

  const ourPid = process.pid

  const keepVitePid = devProcess?.pid ?? attachedVitePid ?? null



  for (const pid of findAllListeningPidsOnPort(DASHBOARD_PORT)) {

    if (pid === ourPid) continue

    killProcessPid(pid)

    killed.push({ pid, port: DASHBOARD_PORT, role: 'launcher' })

    pushLog(`Fantôme arrêté : PID ${pid} (lanceur, port ${DASHBOARD_PORT})`, 'launcher')

  }



  const lockCleared = clearStaleLauncherLock()

  if (lockCleared) {

    pushLog('Verrou launcher obsolète supprimé.', 'launcher')

  }



  const vitePort = parseGameUrlPort(gameUrl)

  const viteAlive = devStatus === 'running' && (await probeGameServer(gameUrl))



  if (!viteAlive) {

    for (const pid of findAllListeningPidsOnPort(vitePort)) {

      if (pid === ourPid) continue

      if (keepVitePid && pid === keepVitePid) continue

      killProcessPid(pid)

      killed.push({ pid, port: vitePort, role: 'vite' })

      pushLog(`Fantôme arrêté : PID ${pid} (Vite, port ${vitePort})`, 'launcher')

    }

    if (devProcess && !isProcessAlive(devProcess.pid)) {

      devProcess = null

      attachedVitePid = null

      devStatus = 'stopped'

    }

  } else {

    pushLog(`Vite actif sur le port ${vitePort} — conservé.`, 'launcher')

  }



  return { killed, lockCleared, viteKept: viteAlive }

}



function killProcessOnPort(port) {

  const pid = findListeningPidOnPort(port)

  if (!pid || pid === process.pid) return false

  try {

    process.kill(pid, 0)

  } catch {

    return false

  }

  pushLog(`Port ${port} occupé par PID ${pid} — libération…`, 'launcher')

  killProcessPid(pid)

  return true

}



async function handOffToExistingDashboard() {

  const existing = await probeExistingDashboard()

  if (!existing) return false

  const dashboardUrl = `http://127.0.0.1:${DASHBOARD_PORT}/`

  console.log('[Havre Dev Launcher] Lanceur déjà actif — ouverture du tableau de bord existant.')

  console.log(`[Havre Dev Launcher] Tableau de bord : ${dashboardUrl}`)

  openInBrowser(dashboardUrl)

  setTimeout(() => process.exit(0), 400)

  return true

}



function openInBrowser(url) {

  const safeUrl = url.replace(/"/g, '')

  if (process.platform === 'win32') {

    execFile('rundll32', ['url.dll,FileProtocolHandler', safeUrl], {

      windowsHide: true,

    })

    return

  }

  const command =

    process.platform === 'darwin'

      ? `open "${safeUrl}"`

      : `xdg-open "${safeUrl}"`

  exec(command, { windowsHide: true })

}



function scriptSpawnArgs(script) {

  if (script === 'dev') {

    const viteBin = join(REPO_ROOT, 'node_modules', 'vite', 'bin', 'vite.js')

    if (existsSync(viteBin)) {

      return { command: process.execPath, args: [viteBin] }

    }

  }

  if (script === 'version:prompt') {

    const scriptPath = join(REPO_ROOT, 'scripts', 'bump-prompt.mjs')

    if (existsSync(scriptPath)) {

      return { command: process.execPath, args: [scriptPath] }

    }

  }

  const npmCli = join(REPO_ROOT, 'node_modules', 'npm', 'bin', 'npm-cli.js')

  if (existsSync(npmCli)) {

    return { command: process.execPath, args: [npmCli, 'run', script] }

  }

  if (process.platform === 'win32') {

    return {

      command: process.env.ComSpec || 'cmd.exe',

      args: ['/d', '/s', '/c', 'npm', 'run', script],

    }

  }

  return { command: 'npm', args: ['run', script] }

}



function touchDashboardActivity(fromDashboard) {

  if (!fromDashboard) return

  lastDashboardPingAt = Date.now()

  dashboardEverConnected = true

  pendingShutdownAt = 0

}



function startDashboardIdleWatch() {

  /* Désactivé — l’arrêt se fait via la fenêtre .bat ou le bouton Quitter tout. */

}



function hideAttachedConsoleWindow() {

  if (process.platform !== 'win32' || consoleHidden || shuttingDown) return

  const psCommand = [

    "Add-Type @'",

    'using System;',

    'using System.Runtime.InteropServices;',

    'public class HavreConsole {',

    '  [DllImport("kernel32.dll", SetLastError=true)] public static extern bool AttachConsole(uint dwProcessId);',

    '  [DllImport("kernel32.dll", SetLastError=true)] public static extern bool FreeConsole();',

    '  [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();',

    '  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);',

    '}',

    "'@;",

    `if ([HavreConsole]::AttachConsole(${process.pid})) {`,

    '  $hwnd = [HavreConsole]::GetConsoleWindow();',

    '  if ($hwnd -ne [IntPtr]::Zero) { [void][HavreConsole]::ShowWindow($hwnd, 0) }',

    '  [void][HavreConsole]::FreeConsole()',

    '}',

  ].join('\n')



  execFile(

    'powershell.exe',

    ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', psCommand],

    { windowsHide: true },

    (error) => {

      if (error) {

        console.error('[Havre Dev Launcher] Impossible de masquer la console :', error.message)

        return

      }

      consoleHidden = true

      backgroundMode = true

      pushLog(

        'Console masquée — fermez l’onglet du tableau de bord pour tout arrêter.',

        'launcher',

      )

      startDashboardIdleWatch()

    },

  )

}



function scheduleConsoleHide() {

  if (process.env.HAVRE_HIDE_CONSOLE !== '1') return

  if (consoleHidden || consoleHideTimer || shuttingDown || backgroundMode) return

  consoleHideTimer = setTimeout(() => {

    consoleHideTimer = null

    if (shuttingDown || devStatus === 'crashed') return

    hideAttachedConsoleWindow()

    if (process.platform !== 'win32') {

      consoleHidden = true

      backgroundMode = true

      pushLog(

        'Lanceur en arrière-plan — fermez l’onglet du tableau de bord pour tout arrêter.',

        'launcher',

      )

      startDashboardIdleWatch()

    }

  }, CONSOLE_HIDE_DELAY_MS)

}



function bindConsoleCloseShutdown() {

  if (process.platform !== 'win32') return

  process.stdin.resume()

  process.stdin.on('close', () => {

    if (!shuttingDown) shutdown()

  })

}



function markDevServerReady(sourceText) {

  if (devStatus !== 'starting') return

  if (!/ready in/i.test(sourceText) && !/➜\s+Local:/i.test(sourceText)) return

  devStatus = 'running'

  if (openedGameOnce || !/localhost|127\.0\.0\.1/i.test(gameUrl)) return

  openedGameOnce = true

  pushLog(`Ouverture du jeu : ${gameUrl}`, 'launcher')

  setTimeout(() => openInBrowser(gameUrl), 400)

}



function parseDevUrl(chunk) {

  const text = String(chunk)

  const localMatch =

    text.match(/Local:\s+(https?:\/\/[^\s]+)/i) ??

    text.match(/(https?:\/\/localhost:\d+\/?)/i) ??

    text.match(/(http:\/\/127\.0\.0\.1:\d+\/?)/i)

  if (localMatch?.[1]) {

    gameUrl = localMatch[1].endsWith('/') ? localMatch[1] : `${localMatch[1]}/`

  }

}



function stopProcessTree(child) {

  if (!child?.pid) return

  killProcessPid(child.pid)

}



function startDevServer() {

  if (devStatus === 'running' && devProcess?.pid && isProcessAlive(devProcess.pid)) {

    pushLog('Vite déjà actif — démarrage ignoré.', 'launcher')

    return

  }

  if (devProcess) {

    stopProcessTree(devProcess)

    devProcess = null

  }



  attachedVitePid = null

  if (attachedVitePollTimer) {

    clearInterval(attachedVitePollTimer)

    attachedVitePollTimer = null

  }



  devStatus = 'starting'

  startedAt = Date.now()

  openedGameOnce = false

  resetViteLogFile()

  pushLog('Démarrage de Vite…', 'launcher')

  const devSpawn = scriptSpawnArgs('dev')

  devProcess = spawnHidden(devSpawn.command, devSpawn.args, {

    cwd: REPO_ROOT,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },

  })



  devProcess.on('error', (error) => {

    if (consoleHideTimer) {

      clearTimeout(consoleHideTimer)

      consoleHideTimer = null

    }

    pushLog(`Impossible de lancer Vite : ${error.message}`, 'launcher')

    devStatus = 'crashed'

    devProcess = null

  })



  const handleDevOutput = (chunk) => {

    const text = String(chunk)

    parseDevUrl(text)

    for (const line of text.split(/\r?\n/)) {

      appendViteOutputLine(line)

    }

    markDevServerReady(text)

  }



  devProcess.stdout?.on('data', handleDevOutput)



  devProcess.stderr?.on('data', handleDevOutput)



  devProcess.on('exit', (code, signal) => {

    pushLog(`Processus Vite terminé (code ${code ?? 'null'}, signal ${signal ?? 'null'})`, 'launcher')

    devProcess = null

    attachedVitePid = null

    if (devStatus !== 'stopping') {

      devStatus = code === 0 ? 'stopped' : 'crashed'

    } else {

      devStatus = 'stopped'

    }

  })

}



function stopDevServer() {

  devStatus = 'stopping'

  pushLog('Arrêt du serveur Vite…', 'launcher')

  stopProcessTree(devProcess)

  devProcess = null

  attachedVitePid = null

}



function restartDevServer() {

  pushLog('Redémarrage Vite demandé…', 'launcher')

  stopDevServer()

  setTimeout(() => startDevServer(), 800)

}



function restartLauncher() {

  if (devStatus !== 'running' && !attachedVitePid && !devProcess) {

    pushLog('Redémarrage du lanceur seul (Vite n’est pas actif).', 'launcher')

  } else {

    pushLog('Redémarrage du lanceur — Vite reste actif, monitoring préservé.', 'launcher')

  }



  saveSessionState({ pendingReattach: true })



  releaseLauncherLock()



  const scriptPath = join(__dirname, 'server.mjs')

  const args = [scriptPath, REATTACH_ARG]

  if (backgroundMode || consoleHidden) args.push(BACKGROUND_ARG)

  const child = spawnHidden(process.execPath, args, {

    cwd: REPO_ROOT,

    detached: true,

    stdio: 'ignore',

    env: process.env,

  })

  child.unref()



  if (!dashboardServer) {

    process.exit(0)

    return

  }



  dashboardServer.close(() => {

    releaseLauncherLock()

    process.exit(0)

  })

}



function runBuild() {

  if (buildProcess) {

    pushLog('Un build est déjà en cours.', 'launcher')

    return

  }

  pushLog('Lancement de npm run build…', 'launcher')

  const buildSpawn = scriptSpawnArgs('build')

  buildProcess = spawnHidden(buildSpawn.command, buildSpawn.args, {

    cwd: REPO_ROOT,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },

  })

  const pipe = (chunk, level) => {

    for (const line of String(chunk).split(/\r?\n/)) {

      if (line.trim()) pushLog(line.trim(), level)

    }

  }

  buildProcess.stdout?.on('data', (c) => pipe(c, 'build'))

  buildProcess.stderr?.on('data', (c) => pipe(c, 'build'))

  buildProcess.on('exit', (code) => {

    pushLog(`Build terminé (code ${code ?? 'null'})`, 'launcher')

    buildProcess = null

  })

}



async function getStatusPayload() {

  const local = readLocalBuildInfo()

  const liveBuildInfo =

    devStatus === 'running' ? readJson(join(REPO_ROOT, 'public', 'build-info.json')) : null

  const uptimeMs = devStatus === 'running' ? Date.now() - startedAt : 0



  return {

    devStatus,

    gameUrl,

    dashboardUrl: `http://127.0.0.1:${DASHBOARD_PORT}/`,

    uptimeMs,

    pid: devProcess?.pid ?? attachedVitePid ?? null,

    buildRunning: Boolean(buildProcess),

    packageVersion: local.packageVersion,

    branch: local.branch,

    commit: local.commit,

    dirty: local.dirty,

    buildInfo: liveBuildInfo ?? local.buildInfo,

    revisionUpdatedAt: local.revision?.updatedAt ?? null,

    logCount: logLines.length,

    launcherReattached,

  }

}



function sendJson(res, statusCode, payload) {

  res.writeHead(statusCode, {

    'Content-Type': 'application/json; charset=utf-8',

    'Cache-Control': 'no-store',

  })

  res.end(JSON.stringify(payload))

}



function readBody(req) {

  return new Promise((resolve) => {

    let body = ''

    req.on('data', (chunk) => {

      body += chunk

    })

    req.on('end', () => resolve(body))

  })

}



function createDashboardServer() {

  const dashboardHtml = readFileSync(DASHBOARD_PATH, 'utf8')



  return createServer(async (req, res) => {

    const url = new URL(req.url ?? '/', `http://127.0.0.1:${DASHBOARD_PORT}`)

    const path = url.pathname



    if (path === '/' && req.method === 'GET') {

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

      res.end(dashboardHtml)

      return

    }



    if (path === '/api/status' && req.method === 'GET') {

      touchDashboardActivity(req.headers['x-havre-dashboard'] === '1')

      sendJson(res, 200, await getStatusPayload())

      return

    }



    if (path === '/api/logs' && req.method === 'GET') {

      sendJson(res, 200, { lines: logLines })

      return

    }



    if (path === '/api/open-game' && req.method === 'POST') {

      openInBrowser(gameUrl)

      sendJson(res, 200, { ok: true, gameUrl })

      return

    }



    if (path === '/api/restart' && req.method === 'POST') {

      restartDevServer()

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/restart-launcher' && req.method === 'POST') {

      sendJson(res, 200, { ok: true, message: 'Redémarrage du lanceur en cours…' })

      setTimeout(() => restartLauncher(), 150)

      return

    }



    if (path === '/api/stop' && req.method === 'POST') {

      stopDevServer()

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/shutdown' && req.method === 'POST') {

      sendJson(res, 200, { ok: true })

      setTimeout(() => shutdown(), 100)

      return

    }



    if (path === '/api/quit-all' && req.method === 'POST') {

      sendJson(res, 200, { ok: true })

      setTimeout(() => shutdown(), 100)

      return

    }



    if (path === '/api/cleanup-ghosts' && req.method === 'POST') {

      const result = await cleanupGhostProcesses()

      sendJson(res, 200, { ok: true, ...result })

      return

    }



    if (path === '/api/build' && req.method === 'POST') {

      runBuild()

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/clear-logs' && req.method === 'POST') {

      logLines = []

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/open-repo' && req.method === 'POST') {

      const folder = REPO_ROOT.replace(/"/g, '')

      if (process.platform === 'win32') {

        execFile('explorer.exe', [folder], { windowsHide: true })

      } else {

        const command =

          process.platform === 'darwin'

            ? `open "${folder}"`

            : `xdg-open "${folder}"`

        exec(command, { windowsHide: true })

      }

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/version-prompt' && req.method === 'POST') {

      const versionSpawn = scriptSpawnArgs('version:prompt')

      spawnHidden(versionSpawn.command, versionSpawn.args, {

        cwd: REPO_ROOT,

        stdio: 'ignore',

      })

      pushLog('npm run version:prompt lancé', 'launcher')

      sendJson(res, 200, { ok: true })

      return

    }



    await readBody(req)

    sendJson(res, 404, { error: 'not-found' })

  })

}



function shutdown() {

  if (shuttingDown) return

  shuttingDown = true

  releaseLauncherLock()

  if (consoleHideTimer) {

    clearTimeout(consoleHideTimer)

    consoleHideTimer = null

  }

  if (dashboardIdleTimer) {

    clearInterval(dashboardIdleTimer)

    dashboardIdleTimer = null

  }

  pushLog('Fermeture du lanceur…', 'launcher')

  stopDevServer()

  stopProcessTree(buildProcess)

  if (attachedVitePollTimer) {

    clearInterval(attachedVitePollTimer)

  }

  const exitNow = () => process.exit(0)

  if (dashboardServer?.listening) {

    dashboardServer.close(exitNow)

    setTimeout(exitNow, 2000)

    return

  }

  exitNow()

}



function listenDashboard(server, { delayMs = 0 } = {}) {

  server.setMaxListeners(16)

  let listenAttempts = 0

  const MAX_LISTEN_ATTEMPTS = 2

  const dashboardUrl = `http://127.0.0.1:${DASHBOARD_PORT}/`



  const onListening = () => {

    listenAttempts = 0

    console.log(`[Havre Dev Launcher] Tableau de bord : ${dashboardUrl}`)

    pushLog(`Tableau de bord prêt sur ${dashboardUrl}`, 'launcher')

    if (!openedDashboardOnce) {

      openedDashboardOnce = true

      openInBrowser(dashboardUrl)

    }

  }



  const scheduleListen = () => {

    server.removeAllListeners('error')

    server.removeAllListeners('listening')

    server.once('listening', onListening)



    server.once('error', (error) => {

      if (error?.code !== 'EADDRINUSE') {

        console.error(error)

        process.exit(1)

        return

      }



      void (async () => {

        if (listenAttempts === 0) {

          const existing = await probeExistingDashboard()

          if (existing) {

            console.log(

              '[Havre Dev Launcher] Lanceur déjà actif — ouverture du tableau de bord existant.',

            )

            openInBrowser(dashboardUrl)

            setTimeout(() => process.exit(0), 400)

            return

          }

        }



        if (listenAttempts >= MAX_LISTEN_ATTEMPTS) {

          const blockerPid = findListeningPidOnPort(DASHBOARD_PORT)

          console.error(

            `[Havre Dev Launcher] Port ${DASHBOARD_PORT} occupé${

              blockerPid ? ` (PID ${blockerPid})` : ''

            }.`,

          )

          console.error(

            'Fermez l’onglet du tableau de bord précédent ou exécutez : taskkill /PID <pid> /F /T',

          )

          process.exit(1)

          return

        }



        listenAttempts += 1

        pushLog(

          `Port ${DASHBOARD_PORT} occupé — nouvel essai ${listenAttempts}/${MAX_LISTEN_ATTEMPTS} dans 800 ms…`,

          'launcher',

        )



        setTimeout(() => {

          if (server.listening) {

            server.close(() => scheduleListen())

            return

          }

          scheduleListen()

        }, 800)

      })()

    })



    server.listen(DASHBOARD_PORT, '127.0.0.1')

  }



  if (delayMs > 0) {

    setTimeout(scheduleListen, delayMs)

  } else {

    scheduleListen()

  }

}



async function main() {

  if (!existsSync(join(REPO_ROOT, 'package.json'))) {

    console.error('Erreur : package.json introuvable. Lancez depuis la racine du repo.')

    process.exit(1)

  }



  ensureSessionDir()



  if (process.argv.includes(CLEANUP_GHOSTS_ARG)) {

    const result = await cleanupGhostProcesses()

    if (result.killed.length === 0 && !result.lockCleared) {

      console.log('[Havre Dev Launcher] Aucun fantôme détecté.')

    } else {

      console.log('[Havre Dev Launcher] Nettoyage terminé :')

      for (const item of result.killed) {

        console.log(`  - PID ${item.pid} (${item.role}, port ${item.port})`)

      }

      if (result.lockCleared) console.log('  - Verrou launcher supprimé')

      if (result.viteKept) console.log('  - Vite actif conservé')

    }

    process.exit(0)

  }



  const isReattach = process.argv.includes(REATTACH_ARG)



  if (!isReattach && (await handOffToExistingDashboard())) {

    return

  }



  if (!tryAcquireLauncherLock()) {

    if (await handOffToExistingDashboard()) return

    console.error(

      '[Havre Dev Launcher] Un lanceur démarre déjà. Attendez 5 secondes ou fermez l’onglet du tableau de bord.',

    )

    process.exit(1)

  }



  process.on('exit', releaseLauncherLock)



  let reattached = false

  if (isReattach) {

    reattached = await tryReattachSession()

    if (reattached) {

      openedDashboardOnce = true

    }

  }



  dashboardServer = createDashboardServer()

  listenDashboard(dashboardServer, { delayMs: isReattach ? 700 : 0 })



  watchBuildInfoFile()



  if (!reattached) {

    startDevServer()

  }



  bindConsoleCloseShutdown()

  if (backgroundMode) {

    startDashboardIdleWatch()

  }



  process.on('SIGINT', shutdown)

  process.on('SIGTERM', shutdown)

}



main()


