#!/usr/bin/env node

/**

 * Havre des Brumes — lanceur dev local.

 * Démarre Vite, ouvre le jeu, expose un petit tableau de bord de monitoring.

 */



import { spawn, exec, execSync } from 'node:child_process'

import { createServer } from 'node:http'

import {

  appendFileSync,

  existsSync,

  mkdirSync,

  readFileSync,

  watchFile,

  writeFileSync,

} from 'node:fs'

import { dirname, join } from 'node:path'

import { fileURLToPath } from 'node:url'



const __dirname = dirname(fileURLToPath(import.meta.url))

const REPO_ROOT = join(__dirname, '..', '..')

const DASHBOARD_PORT = Number.parseInt(process.env.HAVRE_DEV_DASHBOARD_PORT ?? '9221', 10)

const MAX_LOG_LINES = 400

const DASHBOARD_PATH = join(__dirname, 'dashboard.html')

const SESSION_DIR = join(__dirname, '.dev-session')

const SESSION_STATE_FILE = join(SESSION_DIR, 'state.json')

const VITE_LOG_FILE = join(SESSION_DIR, 'vite.log')

const REATTACH_ARG = '--reattach'

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



/** @type {Record<string, unknown> | null} */

let lastBuildInfoSnapshot = null

/** @type {string | null} */

let lastBuildInfoKey = null

/** @type {ReturnType<typeof setTimeout> | null} */

let buildInfoWatchTimer = null

/** @type {ReturnType<typeof setInterval> | null} */

let attachedVitePollTimer = null



function ensureSessionDir() {

  mkdirSync(SESSION_DIR, { recursive: true })

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



function pushLog(line, source = 'vite') {

  const stamp = new Date().toLocaleTimeString('fr-FR', { hour12: false })

  const entry = `[${stamp}] [${source}] ${line}`

  logLines.push(entry)

  if (logLines.length > MAX_LOG_LINES) {

    logLines = logLines.slice(logLines.length - MAX_LOG_LINES)

  }

}



function appendViteOutputLine(line) {

  if (!line.trim()) return

  pushLog(line.trim(), 'vite')

  ensureSessionDir()

  appendFileSync(VITE_LOG_FILE, `${line.trim()}\n`, 'utf8')

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



function git(command) {

  try {

    return execSync(command, { cwd: REPO_ROOT, encoding: 'utf8' }).trim()

  } catch {

    return ''

  }

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

    branch: git('git rev-parse --abbrev-ref HEAD') || 'unknown',

    commit: git('git rev-parse --short HEAD') || 'unknown',

    dirty: git('git status --porcelain') !== '',

  }

}



async function fetchLiveBuildInfo(url) {

  try {

    const res = await fetch(new URL('/build-info.json', url), { cache: 'no-store' })

    if (!res.ok) return null

    return await res.json()

  } catch {

    return null

  }

}



function openInBrowser(url) {

  const safeUrl = url.replace(/"/g, '')

  const command =

    process.platform === 'win32'

      ? `start "" "${safeUrl}"`

      : process.platform === 'darwin'

        ? `open "${safeUrl}"`

        : `xdg-open "${safeUrl}"`

  exec(command, { shell: true })

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

  if (process.platform === 'win32') {

    spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { shell: true, stdio: 'ignore' })

  } else {

    child.kill('SIGTERM')

  }

}



function startDevServer() {

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

  pushLog('Démarrage de npm run dev…', 'launcher')



  devProcess = spawn('npm', ['run', 'dev'], {

    cwd: REPO_ROOT,

    shell: true,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: { ...process.env, FORCE_COLOR: '0' },

  })



  devProcess.stdout?.on('data', (chunk) => {

    const text = String(chunk)

    parseDevUrl(text)

    for (const line of text.split(/\r?\n/)) {

      appendViteOutputLine(line)

    }

    if (devStatus === 'starting' && (/ready in/i.test(text) || /➜\s+Local:/i.test(text))) {

      devStatus = 'running'

      if (!openedGameOnce && /localhost|127\.0\.0\.1/i.test(gameUrl)) {

        openedGameOnce = true

        pushLog(`Ouverture du jeu : ${gameUrl}`, 'launcher')

        setTimeout(() => openInBrowser(gameUrl), 400)

      }

    }

  })



  devProcess.stderr?.on('data', (chunk) => {

    const text = String(chunk)

    parseDevUrl(text)

    for (const line of text.split(/\r?\n/)) {

      appendViteOutputLine(line)

    }

  })



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



  const scriptPath = join(__dirname, 'server.mjs')

  const child = spawn(process.execPath, [scriptPath, REATTACH_ARG], {

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

    process.exit(0)

  })

}



function runBuild() {

  if (buildProcess) {

    pushLog('Un build est déjà en cours.', 'launcher')

    return

  }

  pushLog('Lancement de npm run build…', 'launcher')

  buildProcess = spawn('npm', ['run', 'build'], {

    cwd: REPO_ROOT,

    shell: true,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: { ...process.env, FORCE_COLOR: '0' },

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

  const liveBuildInfo = devStatus === 'running' ? await fetchLiveBuildInfo(gameUrl) : null

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

      const command =

        process.platform === 'win32'

          ? `start "" "${folder}"`

          : process.platform === 'darwin'

            ? `open "${folder}"`

            : `xdg-open "${folder}"`

      exec(command, { shell: true })

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/version-prompt' && req.method === 'POST') {

      spawn('npm', ['run', 'version:prompt'], { cwd: REPO_ROOT, shell: true, stdio: 'ignore' })

      pushLog('npm run version:prompt lancé', 'launcher')

      sendJson(res, 200, { ok: true })

      return

    }



    await readBody(req)

    sendJson(res, 404, { error: 'not-found' })

  })

}



function shutdown() {

  pushLog('Fermeture du lanceur…', 'launcher')

  stopDevServer()

  stopProcessTree(buildProcess)

  if (attachedVitePollTimer) {

    clearInterval(attachedVitePollTimer)

  }

  process.exit(0)

}



function listenDashboard(server, { delayMs = 0 } = {}) {

  const startListening = () => {

    server.listen(DASHBOARD_PORT, '127.0.0.1', () => {

      const dashboardUrl = `http://127.0.0.1:${DASHBOARD_PORT}/`

      console.log(`[Havre Dev Launcher] Tableau de bord : ${dashboardUrl}`)

      pushLog(`Tableau de bord prêt sur ${dashboardUrl}`, 'launcher')

      if (!openedDashboardOnce) {

        openedDashboardOnce = true

        openInBrowser(dashboardUrl)

      }

    })

  }



  server.on('error', (error) => {

    if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {

      pushLog(`Port ${DASHBOARD_PORT} occupé — nouvel essai dans 500 ms…`, 'launcher')

      setTimeout(() => {

        server.close(() => startListening())

      }, 500)

      return

    }

    console.error(error)

    process.exit(1)

  })



  if (delayMs > 0) {

    setTimeout(startListening, delayMs)

  } else {

    startListening()

  }

}



async function main() {

  if (!existsSync(join(REPO_ROOT, 'package.json'))) {

    console.error('Erreur : package.json introuvable. Lancez depuis la racine du repo.')

    process.exit(1)

  }



  ensureSessionDir()



  const isReattach = process.argv.includes(REATTACH_ARG)

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



  process.on('SIGINT', shutdown)

  process.on('SIGTERM', shutdown)

}



main()


