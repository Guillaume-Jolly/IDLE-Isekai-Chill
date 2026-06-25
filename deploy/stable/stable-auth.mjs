import { timingSafeEqual } from 'node:crypto'

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function addAccount(accounts, user, pass) {
  const trimmedUser = String(user ?? '').trim()
  const trimmedPass = String(pass ?? '')
  if (!trimmedUser || !trimmedPass) return
  accounts.set(trimmedUser, trimmedPass)
}

export function createAuthStore(env) {
  const accounts = new Map()

  const usersLine = env.STABLE_AUTH_USERS
  if (usersLine) {
    for (const part of usersLine.split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const sep = trimmed.indexOf(':')
      if (sep <= 0) continue
      addAccount(accounts, trimmed.slice(0, sep), trimmed.slice(sep + 1))
    }
  }

  if (env.STABLE_AUTH_USER && env.STABLE_AUTH_PASS) {
    addAccount(accounts, env.STABLE_AUTH_USER, env.STABLE_AUTH_PASS)
  }

  return {
    count() {
      return accounts.size
    },
    usernames() {
      return [...accounts.keys()]
    },
    hasDefaultPassword() {
      for (const pass of accounts.values()) {
        if (pass === 'change-me-maintenant') return true
      }
      return false
    },
    verify(user, pass) {
      const expected = accounts.get(user)
      if (!expected) return false
      return safeEqual(pass, expected)
    },
  }
}
