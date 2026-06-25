/**
 * Utilitaires Windows sans dépendre de "powershell" dans le PATH.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

function systemRoot() {
  return process.env.SystemRoot ?? process.env.WINDIR ?? 'C:\\Windows'
}

export { systemRoot }

export function powershellExe() {
  const candidates = [
    join(systemRoot(), 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
    join(systemRoot(), 'Sysnative', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return 'powershell.exe'
}

export function system32Exe(name) {
  const candidate = join(systemRoot(), 'System32', name)
  return existsSync(candidate) ? candidate : name
}

export function runPowerShell(script, options = {}) {
  return execFileSync(
    powershellExe(),
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
    {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 15_000,
      ...options,
    },
  ).trim()
}

/** PowerShell sans stderr bruyant — pour sondes processus (PID absent = normal). */
export function runPowerShellQuiet(script) {
  try {
    return runPowerShell(script, { stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return ''
  }
}

export function runPowerShellFile(scriptPath, args = [], options = {}) {
  return execFileSync(powershellExe(), ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, ...args], {
    encoding: 'utf8',
    windowsHide: true,
    timeout: 15_000,
    ...options,
  }).trim()
}

export function findPortListenerPid(port) {
  if (process.platform !== 'win32') return null

  try {
    const out = execFileSync(system32Exe('netstat.exe'), ['-ano', '-p', 'tcp'], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 10_000,
    })
    const portToken = `:${port}`
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes('LISTENING')) continue
      if (!line.includes(portToken)) continue
      const parts = line.trim().split(/\s+/)
      const pid = Number.parseInt(parts[parts.length - 1], 10)
      if (Number.isFinite(pid) && pid > 0) return pid
    }
  } catch {
    /* fallback powershell */
  }

  try {
    const raw = runPowerShell(
      `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)`,
    )
    const pid = Number.parseInt(raw, 10)
    return Number.isFinite(pid) ? pid : null
  } catch {
    return null
  }
}

export function getProcessName(pid) {
  if (process.platform !== 'win32' || !pid) return 'inconnu'

  try {
    const out = execFileSync(system32Exe('tasklist.exe'), ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 10_000,
    }).trim()
    const match = out.match(/^"([^"]+)"/)
    if (match) return match[1]
  } catch {
    /* fallback */
  }

  try {
    return runPowerShell(`(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).ProcessName`) || 'inconnu'
  } catch {
    return 'inconnu'
  }
}

export function findPortOwnerInfo(port) {
  const pid = findPortListenerPid(port)
  if (!pid) return null
  return { pid, name: getProcessName(pid) }
}

export function killProcessByPid(pid, force = true) {
  if (!pid || pid === process.pid) {
    return { ok: false, error: 'PID invalide ou lanceur lui-même.' }
  }

  if (process.platform === 'win32') {
    const args = force ? ['/PID', String(pid), '/F'] : ['/PID', String(pid)]
    const result = spawnSync(system32Exe('taskkill.exe'), args, {
      stdio: 'ignore',
      windowsHide: true,
      timeout: 10_000,
    })
    if (result.error) {
      return { ok: false, error: String(result.error.message ?? result.error) }
    }
    return { ok: result.status === 0, pid, status: result.status ?? 1 }
  }

  try {
    process.kill(pid, force ? 'SIGKILL' : 'SIGTERM')
    return { ok: true, pid }
  } catch (error) {
    return { ok: false, error: String(error.message ?? error) }
  }
}
