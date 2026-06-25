import { randomUUID } from 'node:crypto'

export function createSessionManager(options) {
  const {
    enabled = true,
    timeoutMs = 5 * 60_000,
    singleSession = true,
  } = options

  /** @type {Map<string, { ip: string, sessionId: string, lastSeen: number, connectedAt: number }>} */
  const byUser = new Map()

  function prune() {
    const now = Date.now()
    for (const [user, session] of byUser.entries()) {
      if (now - session.lastSeen > timeoutMs) byUser.delete(user)
    }
  }

  function authorize(user, ip) {
    if (!enabled || !user) return { ok: true }
    prune()
    const now = Date.now()
    const current = byUser.get(user)
    const expired = !current || now - current.lastSeen > timeoutMs

    if (!singleSession || expired || current.ip === ip) {
      const session = expired || !current
        ? { ip, sessionId: randomUUID(), lastSeen: now, connectedAt: now }
        : { ...current, lastSeen: now }
      if (!expired && current && current.ip !== ip) {
        session.ip = ip
        session.connectedAt = now
        session.sessionId = randomUUID()
      }
      byUser.set(user, session)
      return { ok: true, session }
    }

    return { ok: false, reason: 'session_busy', activeIp: current.ip, session: current }
  }

  function release(user) {
    if (user) byUser.delete(user)
  }

  function snapshot() {
    prune()
    return [...byUser.entries()].map(([user, session]) => ({
      user,
      ip: session.ip,
      lastSeen: session.lastSeen,
      connectedAt: session.connectedAt,
      idleSec: Math.round((Date.now() - session.lastSeen) / 1000),
    }))
  }

  return { authorize, release, snapshot, prune }
}
