/**
 * Serveur HTTP local pour le tableau de bord graphique du lanceur stable.
 * Écoute uniquement sur 127.0.0.1 (loopback).
 */
import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { killProcessByPid, runPowerShell, runPowerShellQuiet, runPowerShellFile } from './windows-shell.mjs'
import { buildLauncherGuiHost, launcherGuiHostExePath } from './build-launcher-gui-host.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.cer': 'application/x-x509-ca-cert',
}

export function createLauncherGuiServer({
  host = '127.0.0.1',
  port,
  uiRoot,
  caCertPath,
  getSnapshot,
  actions,
}) {
  const indexPath = join(uiRoot, 'index.html')
  const MOBILE_CERT_URL = '/setup/ca-mobile.cer'

  function sendJson(res, status, payload) {
    const body = JSON.stringify(payload)
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })
    res.end(body)
  }

  function readJsonBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = []
      req.on('data', (chunk) => chunks.push(chunk))
      req.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8').trim()
          resolve(raw ? JSON.parse(raw) : {})
        } catch (error) {
          reject(error)
        }
      })
      req.on('error', reject)
    })
  }

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://${host}:${port}`)
    const pathname = url.pathname

    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (pathname === '/api/dashboard' && req.method === 'GET') {
      sendJson(res, 200, getSnapshot())
      return
    }

    if (pathname === '/api/startup/apply' && req.method === 'POST') {
      try {
        const body = await readJsonBody(req)
        const result = await actions.applyStartup(body.profile)
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/restart' && req.method === 'POST') {
      try {
        await actions.restart()
        sendJson(res, 200, { ok: true })
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/unfreeze' && req.method === 'POST') {
      const ok = actions.unfreeze()
      sendJson(res, 200, { ok })
      return
    }

    if (pathname === '/api/shutdown' && req.method === 'POST') {
      try {
        await actions.shutdown()
        sendJson(res, 200, { ok: true })
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/quit-launcher' && req.method === 'POST') {
      sendJson(res, 200, { ok: true })
      setImmediate(() => {
        void actions.quitLauncher()
      })
      return
    }

    if (pathname === '/api/port/graceful' && req.method === 'POST') {
      try {
        const result = await actions.gracefulPortRelease()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/port/force-kill' && req.method === 'POST') {
      try {
        const result = await actions.forceKillPort()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/port/start' && req.method === 'POST') {
      try {
        const result = await actions.startServer()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/port/attach' && req.method === 'POST') {
      try {
        const result = await actions.attach()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/dev/start' && req.method === 'POST') {
      try {
        const result = await actions.startDev()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/dev/stop' && req.method === 'POST') {
      try {
        const result = await actions.stopDev()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/dev/restart' && req.method === 'POST') {
      try {
        const result = await actions.restartDev()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === '/api/dev/force-kill' && req.method === 'POST') {
      try {
        const result = await actions.forceKillDev()
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error.message ?? error) })
      }
      return
    }

    if (pathname === MOBILE_CERT_URL || pathname === `${MOBILE_CERT_URL}/`) {
      const certFile = caCertPath
      if (!certFile || !existsSync(certFile)) {
        res.writeHead(404).end('Certificat absent — npm run tls:stable')
        return
      }
      res.writeHead(200, {
        'Content-Type': 'application/x-x509-ca-cert',
        'Content-Disposition': 'attachment; filename="ca-mobile.cer"',
        'Cache-Control': 'no-cache',
      })
      createReadStream(certFile).pipe(res)
      return
    }

    if (pathname === '/favicon.ico') {
      const icoPath = join(uiRoot, 'app.ico')
      if (existsSync(icoPath)) {
        res.writeHead(200, {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=3600',
        })
        createReadStream(icoPath).pipe(res)
        return
      }
    }

    let filePath = pathname === '/' ? indexPath : join(uiRoot, pathname)
    if (!filePath.startsWith(uiRoot)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      filePath = indexPath
    }
    if (!existsSync(filePath)) {
      res.writeHead(404).end('Not found')
      return
    }

    const ext = extname(filePath).toLowerCase()
    res.writeHead(200, {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    })
    createReadStream(filePath).pipe(res)
  })

  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(port, host, () => resolve(server))
  })
}

function findWindowsChromiumBrowser() {
  const localAppData = process.env.LOCALAPPDATA ?? ''
  const programFilesX86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)'
  const programFiles = process.env.ProgramFiles ?? 'C:\\Program Files'
  const candidates = [
    join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  if (process.platform === 'win32') {
    try {
      for (const hive of ['HKLM', 'HKCU']) {
        const raw = runPowerShell(
          `(Get-ItemProperty -Path '${hive}:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe' -ErrorAction SilentlyContinue).'(default)'`,
        )
        if (raw && existsSync(raw.trim())) return raw.trim()
      }
    } catch {
      /* ignore */
    }
  }

  return null
}

function launcherGuiUserDataDir() {
  const base = process.env.LOCALAPPDATA ?? process.env.TEMP ?? 'C:\\Temp'
  return join(base, 'IDLE-Isekai-Chill', 'launcher-ui-edge')
}

export function killGuiBrowserWindow({ hostPid, userDataDir } = {}) {
  if (process.platform !== 'win32') return

  if (hostPid) {
    killProcessByPid(hostPid, true)
  }

  try {
    runPowerShell(
      `Get-CimInstance Win32_Process -Filter "Name='IDLE Isekai Chill Launcher.exe'" | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`,
    )
  } catch {
    /* ignore */
  }

  if (userDataDir) {
    const escaped = userDataDir.replace(/\\/g, '\\\\').replace(/'/g, "''")
    try {
      runPowerShell(
        `Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*${escaped}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`,
      )
    } catch {
      /* ignore */
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForDashboard(url, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) })
      if (res.ok) return true
    } catch {
      /* retry */
    }
    await sleep(250)
  }
  return false
}

function isProcessAlive(pid) {
  if (!pid) return false
  const raw = runPowerShellQuiet(
    `$p = Get-Process -Id ${pid} -ErrorAction SilentlyContinue; if ($null -ne $p) { 'yes' } else { 'no' }`,
  )
  return raw.trim() === 'yes'
}

function hasVisibleWindowForPid(pid) {
  if (!pid) return false
  const raw = runPowerShellQuiet(
    `$p = Get-Process -Id ${pid} -ErrorAction SilentlyContinue; if ($p -and $p.MainWindowHandle -ne 0) { 'yes' } else { 'no' }`,
  )
  return raw.trim() === 'yes'
}

function isChromiumAppRunning(userDataDir) {
  if (!userDataDir) return false
  const escaped = userDataDir.replace(/\\/g, '\\\\').replace(/'/g, "''")
  const raw = runPowerShellQuiet(
    `(Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*${escaped}*' } | Measure-Object).Count`,
  )
  return Number.parseInt(String(raw).trim(), 10) > 0
}

async function waitForGuiWindow(pid, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (hasVisibleWindowForPid(pid)) return true
    if (!isProcessAlive(pid)) return false
    await sleep(350)
  }
  return hasVisibleWindowForPid(pid) || isProcessAlive(pid)
}

function hostLaunchArgs(url, uiRoot) {
  const iconPath = join(uiRoot, 'icon-192.png')
  const args = [url]
  if (existsSync(iconPath)) args.push(iconPath)
  else {
    const icoPath = join(uiRoot, 'app.ico')
    if (existsSync(icoPath)) args.push(icoPath)
  }
  return args
}

function startProcessViaPowerShell(exePath, args, cwd) {
  const argList = args.map((a) => `'${a.replace(/'/g, "''")}'`).join(',')
  const script =
    `$p = Start-Process -FilePath '${exePath.replace(/'/g, "''")}'` +
    (argList ? ` -ArgumentList ${argList}` : '') +
    (cwd ? ` -WorkingDirectory '${cwd.replace(/'/g, "''")}'` : '') +
    ` -WindowStyle Normal -PassThru; if ($p) { $p.Id }`
  const raw = runPowerShell(script)
  const pid = Number.parseInt(String(raw).trim().split(/\r?\n/).pop(), 10)
  return Number.isFinite(pid) ? pid : null
}

function openNativeWebViewHost(url, uiRoot) {
  const hostExe = launcherGuiHostExePath()
  if (!existsSync(hostExe)) return null

  const args = hostLaunchArgs(url, uiRoot)
  try {
    const pid = startProcessViaPowerShell(hostExe, args, uiRoot)
    if (pid) return { ok: true, hostPid: pid, userDataDir: null, mode: 'webview2' }
  } catch {
    /* fallback spawn */
  }

  try {
    const proc = spawn(hostExe, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: false,
      cwd: uiRoot,
    })
    proc.unref()
    if (proc.pid) return { ok: true, hostPid: proc.pid, userDataDir: null, mode: 'webview2-spawn' }
  } catch {
    /* next fallback */
  }

  return null
}

function openChromiumApp(url) {
  const browser = findWindowsChromiumBrowser()
  if (!browser) return null

  const userDataDir = launcherGuiUserDataDir()
  const args = [
    `--app=${url}`,
    `--user-data-dir=${userDataDir}`,
    '--new-window',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
  ]

  try {
    const pid = startProcessViaPowerShell(browser, args, null)
    if (pid) return { ok: true, hostPid: pid, userDataDir, mode: 'chromium' }
  } catch {
    /* fallback spawn */
  }

  try {
    const proc = spawn(browser, args, { detached: true, stdio: 'ignore', windowsHide: false })
    proc.unref()
    if (proc.pid) return { ok: true, hostPid: proc.pid, userDataDir, mode: 'chromium-spawn' }
  } catch {
    /* ignore */
  }

  return null
}

function openChromiumAppViaScript(url) {
  const psScript = join(repoRoot, 'scripts', 'open-launcher-gui.ps1')
  if (!existsSync(psScript)) return null
  const userDataDir = launcherGuiUserDataDir()
  try {
    const pidRaw = runPowerShellFile(psScript, [
      '-Url',
      url,
      '-UserDataDir',
      userDataDir,
      '-AppName',
      'IDLE Isekai Chill',
    ])
    const pid = Number.parseInt(String(pidRaw).trim().split(/\r?\n/).pop(), 10)
    if (Number.isFinite(pid)) {
      return { ok: true, hostPid: pid, userDataDir, mode: 'edge-script' }
    }
  } catch {
    /* ignore */
  }
  return null
}

function isNativeHostVisible(pid) {
  if (hasVisibleWindowForPid(pid)) return true
  const raw = runPowerShellQuiet(
    `(Get-Process -Name 'IDLE Isekai Chill Launcher' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Measure-Object).Count`,
  )
  return Number.parseInt(String(raw).trim(), 10) > 0
}

function isNativeHostRunning() {
  const raw = runPowerShellQuiet(
    `(Get-Process -Name 'IDLE Isekai Chill Launcher' -ErrorAction SilentlyContinue | Measure-Object).Count`,
  )
  return Number.parseInt(String(raw).trim(), 10) > 0
}

async function waitForNativeHost(pid, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (isNativeHostVisible(pid)) return true
    if (isNativeHostRunning()) return true
    await sleep(350)
  }
  return isNativeHostVisible(pid) || isNativeHostRunning()
}

async function tryBrowserFallback(url) {
  const chromium = openChromiumApp(url)
  if (chromium?.ok) {
    await sleep(2000)
    if (
      isChromiumAppRunning(chromium.userDataDir) ||
      (await waitForGuiWindow(chromium.hostPid, 3000))
    ) {
      return { ...chromium, fallback: true }
    }
  }

  const scripted = openChromiumAppViaScript(url)
  if (scripted?.ok) {
    await sleep(2000)
    if (
      isChromiumAppRunning(scripted.userDataDir) ||
      (await waitForGuiWindow(scripted.hostPid, 3000))
    ) {
      return { ...scripted, fallback: true }
    }
  }

  const forced = openChromiumAppViaScript(url) ?? openChromiumApp(url)
  if (forced?.ok) return { ...forced, fallback: true }

  return null
}

function killNativeHost(pid) {
  if (pid) killProcessByPid(pid, true)
  runPowerShellQuiet(
    `Get-Process -Name 'IDLE Isekai Chill Launcher' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue`,
  )
}

export async function openGuiWindow(url, uiRoot) {
  const platform = process.platform

  await waitForDashboard(url)

  if (platform === 'win32') {
    try {
      await buildLauncherGuiHost()
    } catch {
      /* fallback navigateur */
    }

    const native = openNativeWebViewHost(url, uiRoot)
    if (native?.ok) {
      const visible = await waitForNativeHost(native.hostPid, 6000)
      if (visible) return native
      killNativeHost(native.hostPid)
    }

    const browser = await tryBrowserFallback(url)
    if (browser) return browser

    return {
      ok: false,
      hostPid: null,
      userDataDir: null,
      mode: null,
      error: 'Ouvre manuellement ' + url + ' dans Edge ou Chrome',
    }
  }

  if (platform === 'darwin') {
    const result = spawnSync('open', ['-a', 'Safari', url], { stdio: 'ignore' })
    return { ok: result.error == null, hostPid: null, userDataDir: null, mode: 'safari' }
  }

  const result = spawnSync('xdg-open', [url], { stdio: 'ignore' })
  return { ok: result.error == null, hostPid: null, userDataDir: null, mode: 'xdg' }
}
