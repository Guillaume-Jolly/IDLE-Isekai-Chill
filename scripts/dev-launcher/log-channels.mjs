/** Canaux journaux techniques du lanceur dev (remplace l’onglet Verbose fourre-tout). */

export const LOG_CHANNEL_IDS = ['launcher', 'vite:game', 'vite:minigames', 'build', 'dashboard']

export const MAX_LOG_CHANNEL_LINES = 4000

export const LOG_CHANNEL_LABELS = {
  launcher: 'Lanceur',
  'vite:game': 'Vite jeu',
  'vite:minigames': 'Vite lab',
  build: 'Build',
  dashboard: 'Dashboard',
}

export const LOG_CHANNEL_HINTS = {
  launcher:
    'Node + navigateur — ports, session, maj lanceur, sondes /api/health (pendant maj). Historique 24 h.',
  'vite:game': 'Sortie brute Vite jeu (:5173) — compilation, HMR, erreurs, URLs. Historique 24 h.',
  'vite:minigames': 'Sortie brute Vite lab (:5174). Historique 24 h.',
  build: 'npm run build — stdout/stderr. Historique 24 h.',
  dashboard: 'Navigateur — sondes /api/health, fetch, reload maj lanceur. Historique 24 h.',
}

const LOG_LINE_SOURCE_RE = /^\[[^\]]+\] \[([^\]]+)\]/

export function createEmptyLogChannels() {
  return Object.fromEntries(LOG_CHANNEL_IDS.map((id) => [id, []]))
}

export function viteLogChannel(serverId = 'game') {
  return serverId === 'minigames' ? 'vite:minigames' : 'vite:game'
}

export function normalizeLogChannel(source = 'launcher') {
  if (LOG_CHANNEL_IDS.includes(source)) return source
  if (source === 'vite') return 'vite:game'
  if (source === 'build') return 'build'
  if (source === 'dashboard') return 'dashboard'
  return 'launcher'
}

export function parseLogLineChannel(line) {
  const match = String(line).match(LOG_LINE_SOURCE_RE)
  if (!match) return null
  return normalizeLogChannel(match[1])
}

export function migrateVerboseLogsToChannels(verboseLines) {
  const channels = createEmptyLogChannels()
  if (!Array.isArray(verboseLines)) return channels
  for (const entry of verboseLines) {
    const text = String(entry)
    const channel = parseLogLineChannel(text) ?? 'launcher'
    channels[channel].push(text)
  }
  for (const id of LOG_CHANNEL_IDS) {
    channels[id] = channels[id].slice(-MAX_LOG_CHANNEL_LINES)
  }
  return channels
}

export function migrateStateLogChannels(state) {
  if (state?.logChannels && typeof state.logChannels === 'object') {
    const channels = createEmptyLogChannels()
    for (const id of LOG_CHANNEL_IDS) {
      const lines = state.logChannels[id]
      if (Array.isArray(lines)) {
        channels[id] = lines.slice(-MAX_LOG_CHANNEL_LINES)
      }
    }
    return channels
  }
  if (Array.isArray(state?.verboseLogs)) {
    return migrateVerboseLogsToChannels(state.verboseLogs)
  }
  return createEmptyLogChannels()
}

export function totalChannelLineCount(channels) {
  return LOG_CHANNEL_IDS.reduce((sum, id) => sum + (channels[id]?.length ?? 0), 0)
}

export function channelLineCounts(channels) {
  return Object.fromEntries(LOG_CHANNEL_IDS.map((id) => [id, channels[id]?.length ?? 0]))
}
