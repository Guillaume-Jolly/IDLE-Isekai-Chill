const AUTH_KEY = 'havre-session-auth'
const USER_KEY = 'havre-session-user'
const PRELOAD_KEY = 'havre-preload-done'

/** Identifiants démo locale — pas de backend ; session navigateur uniquement. */
export const DEMO_LOGIN = {
  username: 'voyageur',
  password: 'brumes',
} as const

export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function getSessionUsername(): string | null {
  return sessionStorage.getItem(USER_KEY)
}

export function validateLogin(username: string, password: string): boolean {
  const normalized = username.trim().toLowerCase()
  return normalized === DEMO_LOGIN.username && password === DEMO_LOGIN.password
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
