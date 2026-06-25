export function createStatsCollector() {
  const startedAt = Date.now()
  let requestsTotal = 0
  let requestsWindow = 0
  let windowStarted = Date.now()
  let lastError = null

  setInterval(() => {
    requestsWindow = 0
    windowStarted = Date.now()
  }, 60_000).unref()

  return {
    bumpRequest() {
      requestsTotal += 1
      requestsWindow += 1
    },
    setError(message) {
      lastError = { at: Date.now(), message }
    },
    snapshot(sessionSnapshot) {
      const mem = process.memoryUsage()
      return {
        up: true,
        startedAt,
        uptimeMs: Date.now() - startedAt,
        requestsTotal,
        requestsPerMinute: requestsWindow,
        memoryMb: {
          rss: Math.round(mem.rss / 1024 / 1024),
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        },
        sessions: sessionSnapshot(),
        lastError,
      }
    },
  }
}

export function isLoopbackIp(ip) {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}
