/**
 * Diagnostics lanceur dev — audit freeze, inventaire fantômes, métriques processus.
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import {
  findAllPortListenerPids,
  getProcessCommandLine,
  getProcessMetrics,
  getProcessName,
  killProcessByPid,
  listDevRelatedNodeProcesses,
} from '../windows-shell.mjs'

const STUCK_STARTING_MS = 90_000
const LOG_IDLE_MS = 120_000
const SLOW_HTTP_MS = 5_000

/** Lignes réelles d’erreur — exclut les journaux d’action « Audit … ». */
function isReportErrorLogLine(line) {
  const plain = String(line)
  if (/Audit (freeze|diagnostic).*diagnostic serveur/i.test(plain)) return false
  if (/Audit terminé —/i.test(plain)) return false
  if (/\[audit\/(info|warn)\]/i.test(plain)) return false
  if (/\[audit\/(error|critical)\]/i.test(plain)) return true
  if (/sans freeze|aucun freeze|pas de freeze/i.test(plain)) return false
  if (/\bfreeze\b/i.test(plain) && !/audit freeze/i.test(plain)) return true
  if (/Processus Vite terminé/i.test(plain)) return false
  return /error|erreur|failed|échec|crash|crashed|EADDRINUSE|impossible|exception|fatal/i.test(plain)
}

export async function probeHttpTimed(url, timeoutMs = 8_000) {
  const started = Date.now()
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal })
    clearTimeout(timer)
    return {
      ok: res.ok,
      status: res.status,
      latencyMs: Date.now() - started,
      error: null,
    }
  } catch (error) {
    return {
      ok: false,
      status: null,
      latencyMs: Date.now() - started,
      error: String(error?.message ?? error),
    }
  }
}

function tailFileLines(filePath, maxLines = 20) {
  if (!existsSync(filePath)) return []
  try {
    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean)
    return lines.slice(-maxLines)
  } catch {
    return [`(lecture impossible : ${filePath})`]
  }
}

function buildProcessEntry(pid, role, port, status, extra = {}) {
  const alive = extra.isProcessAlive?.(pid) ?? true
  const metrics = alive ? getProcessMetrics(pid) : null
  return {
    pid,
    role,
    port: port ?? null,
    status,
    name: getProcessName(pid),
    commandLine: alive ? getProcessCommandLine(pid) : '',
    alive,
    metrics,
    ...extra.flags,
  }
}

const INVENTORY_CACHE_MS = 4_000

let inventoryCache = { key: '', at: 0, data: null }

function inventoryCacheKey(ctx) {
  return [
    ctx.launcherPid,
    ctx.devProcessPid,
    ctx.attachedVitePid,
    ctx.buildProcessPid,
    ctx.dashboardPort,
    ctx.vitePort,
  ].join(':')
}

export function invalidateProcessInventoryCache() {
  inventoryCache = { key: '', at: 0, data: null }
}

function collectProcessInventoryUncached(ctx) {
  const {
    dashboardPort,
    vitePort,
    gameUrl,
    launcherPid,
    devProcessPid,
    attachedVitePid,
    buildProcessPid,
    isProcessAlive,
    lockFilePath,
  } = ctx

  const activePids = new Set(
    [launcherPid, devProcessPid, attachedVitePid, buildProcessPid].filter(
      (pid) => pid && isProcessAlive(pid),
    ),
  )

  const entries = []
  const seenPids = new Set()

  const addEntry = (entry) => {
    if (!entry.pid || seenPids.has(entry.pid)) return
    seenPids.add(entry.pid)
    entries.push(entry)
  }

  addEntry(
    buildProcessEntry(launcherPid, 'launcher', dashboardPort, 'active', {
      isProcessAlive,
      flags: { canKill: false, label: 'Lanceur (ce processus)' },
    }),
  )

  for (const pid of [devProcessPid, attachedVitePid]) {
    if (!pid || !isProcessAlive(pid)) continue
    addEntry(
      buildProcessEntry(pid, 'vite', vitePort, 'active', {
        isProcessAlive,
        flags: { canKill: false, label: 'Vite en service' },
      }),
    )
  }

  if (buildProcessPid && isProcessAlive(buildProcessPid)) {
    addEntry(
      buildProcessEntry(buildProcessPid, 'build', null, 'active', {
        isProcessAlive,
        flags: { canKill: true, label: 'Build npm en cours' },
      }),
    )
  }

  for (const port of [dashboardPort, vitePort]) {
    const role = port === dashboardPort ? 'launcher-port' : 'vite-port'
    for (const pid of findAllPortListenerPids(port)) {
      if (activePids.has(pid)) continue
      addEntry(
        buildProcessEntry(pid, role, port, 'ghost', {
          isProcessAlive,
          flags: {
            canKill: pid !== launcherPid,
            label: port === dashboardPort ? 'Fantôme lanceur (port)' : 'Fantôme Vite (port)',
          },
        }),
      )
    }
  }

  for (const nodeProc of listDevRelatedNodeProcesses(ctx.repoRoot)) {
    if (activePids.has(nodeProc.pid) || seenPids.has(nodeProc.pid)) continue
    const metrics = getProcessMetrics(nodeProc.pid)
    addEntry({
      pid: nodeProc.pid,
      role: 'node-orphan',
      port: null,
      status: 'ghost',
      name: nodeProc.name ?? getProcessName(nodeProc.pid),
      commandLine: nodeProc.commandLine ?? '',
      alive: isProcessAlive(nodeProc.pid),
      metrics,
      canKill: true,
      label: 'Processus Node lié au repo (non suivi)',
    })
  }

  if (lockFilePath && existsSync(lockFilePath)) {
    try {
      const lockPid = Number.parseInt(readFileSync(lockFilePath, 'utf8').trim(), 10)
      if (lockPid && lockPid !== launcherPid) {
        const lockAlive = isProcessAlive(lockPid)
        if (!lockAlive || !activePids.has(lockPid)) {
          addEntry(
            buildProcessEntry(lockPid, 'lock-owner', null, lockAlive ? 'ghost' : 'ghost', {
              isProcessAlive,
              flags: {
                canKill: lockAlive && lockPid !== launcherPid,
                label: lockAlive ? 'Verrou launcher (PID actif)' : 'Verrou launcher (PID mort)',
                lockStale: !lockAlive,
              },
            }),
          )
        }
      }
    } catch {
      /* ignore */
    }
  }

  const active = entries.filter((e) => e.status === 'active')
  const ghosts = entries.filter((e) => e.status === 'ghost')

  return {
    gameUrl,
    dashboardPort,
    vitePort,
    active,
    ghosts,
    all: entries,
    activeCount: active.length,
    ghostCount: ghosts.length,
  }
}

export function collectProcessInventory(ctx) {
  const key = inventoryCacheKey(ctx)
  const now = Date.now()
  if (
    inventoryCache.data &&
    inventoryCache.key === key &&
    now - inventoryCache.at < INVENTORY_CACHE_MS
  ) {
    return inventoryCache.data
  }
  const data = collectProcessInventoryUncached(ctx)
  inventoryCache = { key, at: now, data }
  return data
}

export async function runFreezeAudit(ctx) {
  const {
    devStatus,
    startedAt,
    gameUrl,
    lastViteOutputAt,
    logLines,
    viteLogFile,
    spawnAuditFile,
    isProcessAlive,
    devProcessPid,
    attachedVitePid,
    buildRunning,
  } = ctx

  const findings = []
  const now = Date.now()

  const viteProbe = await probeHttpTimed(gameUrl, 8_000)
  const dashboardProbe = {
    ok: true,
    status: 200,
    latencyMs: 0,
    error: null,
    note: 'sonde interne (même processus)',
  }

  if (devStatus === 'starting' && now - startedAt > STUCK_STARTING_MS) {
    findings.push({
      severity: 'critical',
      code: 'stuck-starting',
      message: `Vite bloqué en « starting » depuis ${Math.round((now - startedAt) / 1000)}s (> ${STUCK_STARTING_MS / 1000}s).`,
    })
  }

  if (devStatus === 'running' && !viteProbe.ok) {
    findings.push({
      severity: 'critical',
      code: 'running-no-http',
      message: `État « running » mais HTTP Vite échoue (${viteProbe.error ?? `status ${viteProbe.status}`}).`,
    })
  }

  if (devProcessPid && !isProcessAlive(devProcessPid)) {
    findings.push({
      severity: 'critical',
      code: 'vite-process-dead',
      message: `PID Vite enregistré (${devProcessPid}) mais processus terminé.`,
    })
  }

  if (
    devStatus === 'running' &&
    lastViteOutputAt &&
    now - lastViteOutputAt > LOG_IDLE_MS
  ) {
    findings.push({
      severity: 'warn',
      code: 'log-idle',
      message: `Aucune sortie Vite depuis ${Math.round((now - lastViteOutputAt) / 1000)}s — possible freeze silencieux.`,
    })
  }

  if (viteProbe.ok && viteProbe.latencyMs > SLOW_HTTP_MS) {
    findings.push({
      severity: 'warn',
      code: 'slow-http',
      message: `Vite répond lentement (${viteProbe.latencyMs}ms > ${SLOW_HTTP_MS}ms).`,
    })
  }

  if (devStatus === 'crashed') {
    findings.push({
      severity: 'critical',
      code: 'crashed',
      message: 'État interne « crashed » — Vite s’est arrêté avec erreur.',
    })
  }

  if (devStatus === 'stopped' && viteProbe.ok) {
    findings.push({
      severity: 'warn',
      code: 'stopped-but-http',
      message: 'État « stopped » mais un serveur répond encore sur l’URL Vite (fantôme ?).',
    })
  }

  if (buildRunning) {
    findings.push({
      severity: 'info',
      code: 'build-active',
      message: 'Build production en cours — Vite peut sembler moins réactif.',
    })
  }

  const inventory = collectProcessInventory(ctx)
  if (inventory.ghostCount > 0) {
    findings.push({
      severity: 'warn',
      code: 'ghosts-present',
      message: `${inventory.ghostCount} fantôme(s) détecté(s) — ports ou Node non suivis.`,
    })
  }

  const errorLogLines = (logLines ?? [])
    .slice(-80)
    .filter(isReportErrorLogLine)
    .slice(-12)

  const viteLogTail = tailFileLines(viteLogFile, 15)
  const spawnAuditTail = tailFileLines(spawnAuditFile, 12)

  const frozen = findings.some((f) => f.severity === 'critical')
  const degraded = findings.some((f) => f.severity === 'warn')

  let summary = 'Serveur OK — aucun freeze détecté.'
  if (frozen) summary = 'Freeze ou panne probable — voir findings.'
  else if (degraded) summary = 'Anomalies mineures — serveur peut être lent ou partiellement bloqué.'
  else if (findings.length > 0) summary = 'Informations contextuelles — pas de freeze critique.'

  return {
    at: new Date().toISOString(),
    frozen,
    degraded,
    summary,
    devStatus,
    probes: {
      vite: viteProbe,
      dashboard: dashboardProbe,
    },
    findings,
    inventory,
    excerpts: {
      errorLogs: errorLogLines,
      viteLog: viteLogTail,
      spawnAudit: spawnAuditTail,
    },
    hints: frozen
      ? [
          'Redémarrer Vite depuis le tableau de bord.',
          'Onglet Monitoring → tuer les fantômes un par un.',
          'Consulter vite.log et spawn-audit.log ci-dessous.',
        ]
      : degraded
        ? ['Vérifier les fantômes dans Monitoring.', 'Relancer Vite si la lenteur persiste.']
        : [],
  }
}

export function killInventoryProcess(pid, launcherPid) {
  if (!pid || pid === launcherPid) {
    return { ok: false, error: 'Impossible de tuer le lanceur actif.' }
  }
  return killProcessByPid(pid, true)
}

export async function collectMonitoringSnapshot(ctx) {
  const inventory = collectProcessInventory(ctx)
  const launcherMetrics = getProcessMetrics(ctx.launcherPid)
  const mem = process.memoryUsage()

  return {
    at: new Date().toISOString(),
    launcher: {
      pid: ctx.launcherPid,
      metrics: launcherMetrics,
      memory: {
        rssMb: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
        heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10,
      },
      uptimeMs: Date.now() - ctx.launcherStartedAt,
    },
    devStatus: ctx.devStatus,
    lastViteOutputAt: ctx.lastViteOutputAt ?? null,
    viteLogAgeMs: ctx.lastViteOutputAt ? Date.now() - ctx.lastViteOutputAt : null,
    inventory,
  }
}
