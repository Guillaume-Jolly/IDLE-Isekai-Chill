export function readEnvValue(envText, key) {
  const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'))
  return match ? match[1].trim() : ''
}

export function classifyClientIp(ip, lanIp = '') {
  if (!ip) return 'unknown'
  const normalized = ip.replace(/^::ffff:/, '')
  if (normalized === '127.0.0.1' || normalized === '::1') return 'pc'
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(normalized)) return 'mobile'
  if (lanIp && normalized === lanIp) return 'mobile'
  return 'public'
}

const ACCESS_LABELS = {
  pc: 'PC local',
  mobile: 'Mobile / Wi‑Fi',
  public: 'Internet distant',
  unknown: 'Autre',
}

const CERT_PATH = '/setup/ca-mobile.cer'

function withCert(endpoint, scheme, port) {
  return {
    ...endpoint,
    certUrl: `${scheme}://${endpoint.host}:${port}${CERT_PATH}`,
    certFile: 'ca-mobile.cer',
    certHint:
      endpoint.kind === 'pc'
        ? 'PC — ou npm run trust:stable pour faire confiance automatiquement'
        : endpoint.kind === 'mobile'
          ? 'Android/iOS — Paramètres → Certificat AC (pas VPN)'
          : '4G — envoie ce lien au téléphone (hors Wi‑Fi maison)',
  }
}

export function buildServerEndpoints({ scheme, port, lanIp, publicHost }) {
  const endpoints = [
    withCert(
      {
        id: 'pc',
        kind: 'pc',
        label: ACCESS_LABELS.pc,
        description: 'Navigateur sur ce PC · port ' + port,
        url: `${scheme}://127.0.0.1:${port}/`,
        host: '127.0.0.1',
        port,
        available: true,
      },
      scheme,
      port,
    ),
    withCert(
      {
        id: 'mobile',
        kind: 'mobile',
        label: ACCESS_LABELS.mobile,
        description: 'Téléphone / autre appareil sur le même Wi‑Fi · port ' + port,
        url: `${scheme}://${lanIp}:${port}/`,
        host: lanIp,
        port,
        available: Boolean(lanIp),
      },
      scheme,
      port,
    ),
  ]

  if (publicHost) {
    endpoints.push(
      withCert(
        {
          id: 'public',
          kind: 'public',
          label: ACCESS_LABELS.public,
          description: '4G / hors réseau maison · port ' + port,
          url: `${scheme}://${publicHost}:${port}/`,
          host: publicHost,
          port,
          available: true,
        },
        scheme,
        port,
      ),
    )
  }

  return endpoints
}

export function enrichSessions(sessions, lanIp) {
  return (sessions ?? []).map((session) => {
    const accessKind = classifyClientIp(session.ip, lanIp)
    return {
      ...session,
      accessKind,
      accessLabel: ACCESS_LABELS[accessKind] ?? ACCESS_LABELS.unknown,
    }
  })
}

export function countAccessUsage(sessions, lanIp) {
  const counts = { pc: 0, mobile: 0, public: 0, unknown: 0 }
  for (const session of sessions ?? []) {
    const kind = classifyClientIp(session.ip, lanIp)
    counts[kind] = (counts[kind] ?? 0) + 1
  }
  return counts
}

export function attachEndpointUsage(endpoints, sessions, lanIp) {
  const counts = countAccessUsage(sessions, lanIp)
  const total = (sessions ?? []).length
  const withUsage = endpoints.map((endpoint) => ({
    ...endpoint,
    activeSessions: counts[endpoint.kind] ?? 0,
    inUse: (counts[endpoint.kind] ?? 0) > 0,
  }))
  return {
    endpoints: withUsage,
    totalSessions: total,
    counts,
    primaryKind:
      counts.public > 0 ? 'public' : counts.mobile > 0 ? 'mobile' : counts.pc > 0 ? 'pc' : null,
  }
}
