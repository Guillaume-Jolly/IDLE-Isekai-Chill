/** Définitions des serveurs Vite gérés par le lanceur. */
export const VITE_SERVER_DEFS = {
  game: {
    id: 'game',
    label: 'Jeu complet',
    npmScript: 'dev',
    defaultUrl: 'http://localhost:5173/',
    port: 5173,
    openLabel: 'Ouvrir le jeu',
    autoStart: false,
  },
  minigames: {
    id: 'minigames',
    label: 'Lab mini-jeux',
    npmScript: 'dev:minigames',
    defaultUrl: 'http://127.0.0.1:5174/',
    port: 5174,
    openLabel: 'Ouvrir le lab',
    autoStart: false,
  },
}

export const VITE_DEV_PORTS = Object.values(VITE_SERVER_DEFS).map((def) => def.port)

export function resolveViteServerId(serverId) {
  if (serverId && VITE_SERVER_DEFS[serverId]) return serverId
  return 'game'
}

export function createViteSlots() {
  return Object.fromEntries(
    Object.entries(VITE_SERVER_DEFS).map(([id, def]) => [
      id,
      {
        id,
        def,
        process: null,
        attachedPid: null,
        status: def.autoStart ? 'starting' : 'stopped',
        startedAt: 0,
        url: def.defaultUrl,
        networkUrl: null,
        pollTimer: null,
        openedOnce: false,
      },
    ]),
  )
}

export function parseGameUrlPort(url) {
  try {
    return Number.parseInt(new URL(url).port || '80', 10)
  } catch {
    return 5173
  }
}

export function slotForPort(slots, port) {
  return Object.values(slots).find((slot) => slot.def.port === port) ?? null
}

export function serializeViteSlots(slots) {
  return Object.fromEntries(
    Object.entries(slots).map(([id, slot]) => [
      id,
      {
        vitePid: slot.process?.pid ?? slot.attachedPid ?? null,
        url: slot.url,
        networkUrl: slot.networkUrl,
        status: slot.status,
        startedAt: slot.startedAt,
        openedOnce: slot.openedOnce,
      },
    ]),
  )
}

export function restoreViteSlotsFromSession(slots, state) {
  if (!state) return

  const saved = state.viteServers
  if (saved && typeof saved === 'object') {
    for (const [id, snapshot] of Object.entries(saved)) {
      const slot = slots[id]
      if (!slot || !snapshot || typeof snapshot !== 'object') continue
      if (typeof snapshot.url === 'string') slot.url = snapshot.url
      if (typeof snapshot.networkUrl === 'string') slot.networkUrl = snapshot.networkUrl
      if (typeof snapshot.status === 'string') slot.status = snapshot.status
      if (typeof snapshot.startedAt === 'number') slot.startedAt = snapshot.startedAt
      if (typeof snapshot.openedOnce === 'boolean') slot.openedOnce = snapshot.openedOnce
      const pid = Number(snapshot.vitePid) || null
      slot.attachedPid = pid
    }
    return
  }

  // Migration session mono-serveur
  const legacySlot = slots.game
  if (!legacySlot) return
  if (typeof state.gameUrl === 'string') legacySlot.url = state.gameUrl
  if (typeof state.networkGameUrl === 'string') legacySlot.networkUrl = state.networkGameUrl
  if (typeof state.devStatus === 'string') legacySlot.status = state.devStatus
  if (typeof state.startedAt === 'number') legacySlot.startedAt = state.startedAt
  if (typeof state.openedGameOnce === 'boolean') legacySlot.openedOnce = state.openedGameOnce
  const pid = Number(state.vitePid) || null
  legacySlot.attachedPid = pid

  if (state.devServerProfile === 'minigames') {
    const lab = slots.minigames
    if (lab) {
      lab.url = VITE_SERVER_DEFS.minigames.defaultUrl
      if (typeof state.gameUrl === 'string' && state.gameUrl.includes(':5174')) {
        lab.url = state.gameUrl
        lab.status = state.devStatus ?? 'stopped'
        lab.startedAt = state.startedAt ?? 0
        lab.attachedPid = pid
      }
      legacySlot.status = 'stopped'
      legacySlot.attachedPid = null
    }
  }
}

export function buildViteSlotStatusPayload(slot, { devHostExposure, lanAddresses }) {
  const uptimeMs = slot.status === 'running' && slot.startedAt ? Date.now() - slot.startedAt : 0
  const vitePort = slot.def.port
  const inferredNetworkUrl =
    slot.networkUrl ??
    (devHostExposure && lanAddresses[0] ? `http://${lanAddresses[0]}:${vitePort}/` : null)

  return {
    id: slot.id,
    label: slot.def.label,
    openLabel: slot.def.openLabel,
    port: vitePort,
    status: slot.status,
    gameUrl: slot.url,
    networkGameUrl: inferredNetworkUrl,
    uptimeMs,
    pid: slot.process?.pid ?? slot.attachedPid ?? null,
    autoStart: slot.def.autoStart,
  }
}
