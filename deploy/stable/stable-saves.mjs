import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const MAX_SAVE_BYTES = 8 * 1024 * 1024

export function createSaveStore(rootDir) {
  const savesDir = join(rootDir, 'data', 'saves')
  const archiveDir = join(rootDir, 'data', 'archive')
  mkdirSync(savesDir, { recursive: true })
  mkdirSync(archiveDir, { recursive: true })

  function safeUserFile(user) {
    const safe = user.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 64)
    if (!safe) throw new Error('invalid_user')
    return join(savesDir, `${safe}.json`)
  }

  function read(user) {
    const path = safeUserFile(user)
    if (!existsSync(path)) return null
    return readFileSync(path, 'utf8')
  }

  function write(user, rawBody) {
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_SAVE_BYTES) {
      throw new Error('save_too_large')
    }
    JSON.parse(rawBody)
    const path = safeUserFile(user)
    if (existsSync(path)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const archived = join(archiveDir, `${user.replace(/[^a-zA-Z0-9_-]+/g, '_')}-${stamp}.json`)
      renameSync(path, archived)
    }
    writeFileSync(path, rawBody, 'utf8')
    return { bytes: Buffer.byteLength(rawBody, 'utf8') }
  }

  function listUsers() {
    if (!existsSync(savesDir)) return []
    return readdirSync(savesDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
  }

  return { read, write, listUsers, savesDir }
}
