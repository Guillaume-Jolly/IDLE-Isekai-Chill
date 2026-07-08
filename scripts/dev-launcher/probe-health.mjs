#!/usr/bin/env node
/** Sonde santé lanceur — exit 0 = à jour, 1 = absent / injoignable, 2 = obsolète / à remplacer */
import { LAUNCHER_VERSION } from './launcher-version.mjs'

const PROBE_TIMEOUT_MS = 4_000
const HEALTHY = new Set(['running', 'starting', 'stopped'])

async function fetchStatus() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
  try {
    const res = await fetch('http://127.0.0.1:9221/api/status', {
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!res.ok) return null
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

try {
  const data = await fetchStatus()
  if (!data || typeof data.devStatus !== 'string') process.exit(1)

  const liveVersion = data.launcherVersion ?? null
  const versionMatch = liveVersion === LAUNCHER_VERSION
  const processStale = Boolean(data.launcherBuild?.processStale)
  const statusOk = HEALTHY.has(data.devStatus)

  if (statusOk && versionMatch && !processStale) {
    process.exit(0)
  }

  if (liveVersion && !versionMatch) {
    console.error(
      `[probe-health] Lanceur v${liveVersion} sur :9221 ≠ disque v${LAUNCHER_VERSION} — remplacement requis.`,
    )
    process.exit(2)
  }

  if (processStale) {
    console.error('[probe-health] Lanceur obsolète (sources plus récentes que le processus).')
    process.exit(2)
  }

  if (!statusOk) {
    process.exit(2)
  }

  process.exit(0)
} catch (error) {
  if (error?.name === 'AbortError') {
    console.error(
      `[probe-health] Pas de réponse sur :9221 après ${PROBE_TIMEOUT_MS / 1000}s — processus bloqué ou fantôme.`,
    )
  }
  process.exit(1)
}
