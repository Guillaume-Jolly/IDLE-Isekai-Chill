/** Écriture exports Markdown + JSON (onglets lanceur). */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * @param {string} root
 * @param {{ md: string, json: string }} relPaths chemins relatifs repo
 * @param {{ md: string, json: object }} payload
 */
export function writePanelExport(root, relPaths, payload) {
  const mdAbs = join(root, relPaths.md)
  const jsonAbs = join(root, relPaths.json)
  mkdirSync(dirname(mdAbs), { recursive: true })
  mkdirSync(dirname(jsonAbs), { recursive: true })
  writeFileSync(mdAbs, payload.md, 'utf8')
  writeFileSync(jsonAbs, `${JSON.stringify(payload.json, null, 2)}\n`, 'utf8')
  return {
    md: relPaths.md.replace(/\\/g, '/'),
    json: relPaths.json.replace(/\\/g, '/'),
  }
}

export const TYPE_MARK = { add: '+', mod: '~', fix: '!', del: '-', info: '…' }
