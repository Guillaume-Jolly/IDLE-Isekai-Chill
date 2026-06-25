/**
 * Limite CPU/RAM des processus serveur (Windows en priorité).
 * Plafond configurable (défaut 20 %) partagé entre tous les processus enregistrés.
 */
import os from 'node:os'
import { runPowerShell, runPowerShellQuiet } from './windows-shell.mjs'

const IS_WIN = process.platform === 'win32'

export function readGovernorConfig(envText = '') {
  const readNum = (key, fallback) => {
    const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'))
    if (!match) return fallback
    const value = Number.parseFloat(match[1].trim())
    return Number.isFinite(value) ? value : fallback
  }
  const readBool = (key, fallback) => {
    const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'))
    if (!match) return fallback
    const value = match[1].trim().toLowerCase()
    if (value === '0' || value === 'false') return false
    if (value === '1' || value === 'true') return true
    return fallback
  }

  return {
    enabled: readBool('STABLE_RESOURCE_GOVERNOR', true),
    cpuMaxPct: readNum('STABLE_CPU_MAX_PCT', 20),
    cpuMinPct: readNum('STABLE_CPU_MIN_PCT', 10),
    memMaxPct: readNum('STABLE_MEM_MAX_PCT', 20),
    warnRatio: readNum('STABLE_RESOURCE_WARN_RATIO', 0.85),
    sampleMs: readNum('STABLE_RESOURCE_SAMPLE_MS', 15_000),
    freezeSamples: readNum('STABLE_RESOURCE_FREEZE_SAMPLES', 2),
    autoResumeMs: readNum('STABLE_RESOURCE_AUTO_RESUME_MS', 30_000),
  }
}

function coreCountFromPct(logical, pct) {
  return Math.max(1, Math.ceil((logical * pct) / 100))
}

/** @returns {Map<number, { cpuSec: number|null, memMb: number|null }>} */
function readProcessMetricsBatch(pids) {
  /** @type {Map<number, { cpuSec: number|null, memMb: number|null }>} */
  const map = new Map()
  if (!pids.length) return map

  if (IS_WIN) {
    try {
      const idList = pids.join(',')
      const raw = runPowerShellQuiet(
        `@(Get-Process -Id ${idList} -ErrorAction SilentlyContinue | ` +
          `Select-Object Id, CPU, @{n='memMb';e={[math]::Round($_.WorkingSet64/1MB,1)}}) | ` +
          `ConvertTo-Json -Compress`,
      )
      if (!raw) return map
      let parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) parsed = [parsed]
      for (const row of parsed) {
        if (!row?.Id) continue
        map.set(row.Id, { cpuSec: row.CPU ?? null, memMb: row.memMb ?? null })
      }
    } catch {
      /* ignore */
    }
    return map
  }

  for (const pid of pids) {
    try {
      process.kill(pid, 0)
      map.set(pid, { cpuSec: null, memMb: null })
    } catch {
      /* dead */
    }
  }
  return map
}

function applyLimitsToPid(pid, maxCores) {
  if (!IS_WIN || !pid) return false
  try {
    const mask = (1n << BigInt(maxCores)) - 1n
    runPowerShell(
      `$p=Get-Process -Id ${pid} -ErrorAction Stop;` +
        `$p.PriorityClass='BelowNormal';` +
        `$p.ProcessorAffinity=[IntPtr]${mask};` +
        `'ok'`,
    )
    return true
  } catch {
    return false
  }
}

export function createResourceGovernor(config) {
  const logicalCpus = os.cpus().length
  const maxCores = coreCountFromPct(logicalCpus, config.cpuMaxPct)
  const minCores = coreCountFromPct(logicalCpus, config.cpuMinPct)
  const totalMemMb = Math.round(os.totalmem() / 1024 / 1024)
  const memMaxMb = Math.round((totalMemMb * config.memMaxPct) / 100)
  const cpuWarnPct = config.cpuMaxPct * config.warnRatio
  const memWarnMb = Math.round(memMaxMb * config.warnRatio)

  /** @type {Map<number, { label: string, lastCpuSample: { cpuSec: number, at: number } | null }>} */
  const targets = new Map()
  let overHotStreak = 0
  let frozen = false
  let frozenAt = 0
  let frozenReason = null
  let limitsApplied = false

  const state = {
    frozen: false,
    warning: false,
    cpuPct: null,
    memMb: null,
    memPct: null,
    maxCores,
    minCores,
    cpuMaxPct: config.cpuMaxPct,
    cpuMinPct: config.cpuMinPct,
    memMaxMb,
    memMaxPct: config.memMaxPct,
    logicalCpus,
    limitsApplied: false,
    frozenReason: null,
    sharedCap: true,
    targets: [],
  }

  function syncStateTargets(breakdown) {
    state.targets = breakdown
  }

  function registerPid(pid, label = 'process') {
    if (!pid || pid === process.pid) return state
    if (!targets.has(pid)) {
      targets.set(pid, { label, lastCpuSample: null })
    } else {
      targets.get(pid).label = label
    }
    if (config.enabled) {
      limitsApplied = applyLimitsToPid(pid, maxCores) || limitsApplied
      state.limitsApplied = limitsApplied
    }
    return state
  }

  function unregisterPid(pid) {
    if (!pid) return
    targets.delete(pid)
    if (targets.size === 0) {
      limitsApplied = false
      state.limitsApplied = false
    }
  }

  function suspendAll() {
    if (!IS_WIN || frozen) return
    const pids = [...targets.keys()]
    if (pids.length) {
      try {
        runPowerShellQuiet(
          `$pids=@(${pids.join(',')});foreach($id in $pids){Suspend-Process -Id $id -ErrorAction SilentlyContinue}`,
        )
      } catch {
        /* process may have exited */
      }
    }
    frozen = true
    frozenAt = Date.now()
    state.frozen = true
    state.frozenReason = frozenReason
  }

  function resumeAll(manual = false) {
    if (!IS_WIN || !frozen) return false
    const pids = [...targets.keys()]
    if (!pids.length) return false
    try {
      runPowerShellQuiet(
        `$pids=@(${pids.join(',')});foreach($id in $pids){Resume-Process -Id $id -ErrorAction SilentlyContinue}`,
      )
    } catch {
      return false
    }
    frozen = false
    frozenAt = 0
    frozenReason = null
    overHotStreak = 0
    for (const meta of targets.values()) {
      meta.lastCpuSample = null
    }
    state.frozen = false
    state.frozenReason = null
    if (manual) state.lastManualResume = Date.now()
    return true
  }

  function tick() {
    if (!config.enabled || targets.size === 0) {
      state.warning = false
      return state
    }

    const now = Date.now()
    let totalCpuPct = 0
    let totalMemMb = 0
    let hasCpu = false
    let hasMem = false
    const breakdown = []
    const deadPids = []

    const metricsByPid = readProcessMetricsBatch([...targets.keys()])

    for (const [pid, meta] of targets) {
      const metrics = metricsByPid.get(pid)
      if (!metrics) {
        deadPids.push(pid)
        continue
      }

      let cpuPct = null
      if (metrics.cpuSec != null) {
        if (meta.lastCpuSample) {
          const dtSec = (now - meta.lastCpuSample.at) / 1000
          const dCpu = metrics.cpuSec - meta.lastCpuSample.cpuSec
          if (dtSec > 0.2 && dCpu >= 0) {
            cpuPct = Math.round(((dCpu / dtSec) / logicalCpus) * 1000) / 10
          }
        }
        meta.lastCpuSample = { cpuSec: metrics.cpuSec, at: now }
      }

      const memMb = metrics.memMb
      if (cpuPct != null) {
        totalCpuPct += cpuPct
        hasCpu = true
      }
      if (memMb != null) {
        totalMemMb += memMb
        hasMem = true
      }

      breakdown.push({
        pid,
        label: meta.label,
        cpuPct,
        memMb,
        memPct:
          memMb != null
            ? Math.round(((memMb * 1024 * 1024) / os.totalmem()) * 1000) / 10
            : null,
      })
    }

    for (const pid of deadPids) targets.delete(pid)

    const cpuPct = hasCpu ? Math.round(totalCpuPct * 10) / 10 : state.cpuPct
    const memMb = hasMem ? Math.round(totalMemMb * 10) / 10 : state.memMb
    const memPct =
      memMb != null ? Math.round(((memMb * 1024 * 1024) / os.totalmem()) * 1000) / 10 : null

    state.cpuPct = cpuPct
    state.memMb = memMb
    state.memPct = memPct
    syncStateTargets(breakdown)

    const cpuHot = cpuPct != null && cpuPct >= config.cpuMaxPct
    const cpuWarn = cpuPct != null && cpuPct >= cpuWarnPct && cpuPct < config.cpuMaxPct
    const memHot = memMb != null && memMb >= memMaxMb
    const memWarn = memMb != null && memMb >= memWarnMb && memMb < memMaxMb

    state.warning = !frozen && (cpuWarn || memWarn)

    if (frozen) {
      if (config.autoResumeMs > 0 && now - frozenAt >= config.autoResumeMs) {
        resumeAll(false)
      }
      return state
    }

    if (cpuHot || memHot) {
      overHotStreak += 1
      if (overHotStreak >= config.freezeSamples) {
        frozenReason = cpuHot
          ? `CPU combinée ${cpuPct}% > plafond ${config.cpuMaxPct}%`
          : `RAM combinée ${memMb} Mo > plafond ${memMaxMb} Mo (${config.memMaxPct}%)`
        suspendAll()
      }
    } else {
      overHotStreak = 0
    }

    return state
  }

  function reset() {
    if (frozen) resumeAll(false)
    targets.clear()
    overHotStreak = 0
    frozen = false
    frozenAt = 0
    frozenReason = null
    limitsApplied = false
    Object.assign(state, {
      frozen: false,
      warning: false,
      cpuPct: null,
      memMb: null,
      memPct: null,
      limitsApplied: false,
      frozenReason: null,
      targets: [],
    })
  }

  function formatLine() {
    const cpu = state.cpuPct != null ? `${state.cpuPct}%` : '?'
    const mem =
      state.memMb != null
        ? `${state.memMb} Mo (${state.memPct ?? '?'}%)`
        : '?'
    const cores = `${minCores}-${maxCores}/${logicalCpus} coeur(s)`
    const count = state.targets.length
    if (state.frozen) {
      return `GELE — ${state.frozenReason ?? 'depassement'} · [U] reprendre`
    }
    if (state.warning) {
      return `ALERTE CPU/RAM · ${cpu} / ${config.cpuMaxPct}% · ${mem} / ${memMaxMb} Mo · ${count} proc. · ${cores}`
    }
    return `${cpu} / max ${config.cpuMaxPct}% · ${mem} / max ${memMaxMb} Mo · ${count} proc. · ${cores}`
  }

  return {
    registerPid,
    unregisterPid,
    applyLimits: registerPid,
    tick,
    reset,
    resumeProcess: resumeAll,
    getTargetCount: () => targets.size,
    getState: () => ({ ...state, formatLine: formatLine() }),
    config,
  }
}
