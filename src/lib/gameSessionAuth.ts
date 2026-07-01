const AUTH_KEY = 'havre-session-auth'
const USER_KEY = 'havre-session-user'
const PRELOAD_KEY = 'havre-preload-done'

const DEV_DEMO_USERNAME = 'voyageur'
const DEV_DEMO_PASSWORD = 'brumes'

/** true uniquement en `vite` / `npm run dev` — jamais dans un build production. */
export function isDevSessionLogin(): boolean {
  return import.meta.env.DEV
}

/** Préremplissage formulaire — valeurs vides hors dev local. */
export function getDevLoginDefaults(): { username: string; password: string } {
  if (!import.meta.env.DEV) {
    return { username: '', password: '' }
  }
  return { username: DEV_DEMO_USERNAME, password: DEV_DEMO_PASSWORD }
}

function readProductionLoginCredentials(): { username: string; password: string } | null {
  if (import.meta.env.DEV) return null

  const username = import.meta.env.VITE_HAVRE_LOGIN_USER?.trim().toLowerCase()
  const password = import.meta.env.VITE_HAVRE_LOGIN_PASSWORD
  if (!username || !password) return null

  return { username, password }
}

/** Build prod avec identifiants injectés (CI / hébergeur privé). */
export function isProductionLoginConfigured(): boolean {
  return readProductionLoginCredentials() !== null
}

export function validateLogin(username: string, password: string): boolean {
  const normalized = username.trim().toLowerCase()

  if (import.meta.env.DEV) {
    return normalized === DEV_DEMO_USERNAME && password === DEV_DEMO_PASSWORD
  }

  const production = readProductionLoginCredentials()
  if (!production) return false

  return normalized === production.username && password === production.password
}

export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function getSessionUsername(): string | null {
  return sessionStorage.getItem(USER_KEY)
}

export function setSessionAuthenticated(username: string) {
  sessionStorage.setItem(AUTH_KEY, '1')
  sessionStorage.setItem(USER_KEY, username.trim())
}

export function isPreloadDone(): boolean {
  return sessionStorage.getItem(PRELOAD_KEY) === '1'
}

export function setPreloadDone() {
  sessionStorage.setItem(PRELOAD_KEY, '1')
}

export function clearSessionGateForTests() {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(PRELOAD_KEY)
}

/** Déconnexion locale — retour à l'écran de connexion. */
export function logoutSession(options?: { resetPreload?: boolean }) {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(USER_KEY)
  if (options?.resetPreload) {
    sessionStorage.removeItem(PRELOAD_KEY)
  }
}
