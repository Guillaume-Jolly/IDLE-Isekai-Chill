#!/usr/bin/env node
/** Sonde santé lanceur — exit 0 = sain, 1 = absent, 2 = zombie */
const HEALTHY = new Set(['running', 'starting'])

try {
  const res = await fetch('http://127.0.0.1:9221/api/status', { cache: 'no-store' })
  if (!res.ok) process.exit(1)
  const data = await res.json()
  if (!data || typeof data.devStatus !== 'string') process.exit(1)
  process.exit(HEALTHY.has(data.devStatus) ? 0 : 2)
} catch {
  process.exit(1)
}
