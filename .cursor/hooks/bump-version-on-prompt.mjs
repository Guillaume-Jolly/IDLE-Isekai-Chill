#!/usr/bin/env node
/**
 * Hook Cursor beforeSubmitPrompt — bump X via npm run version:prompt.
 * Opt-out : message user contient « même X » ou « same X ».
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function readPromptFromStdin() {
  try {
    const raw = readFileSync(0, 'utf8')
    if (!raw.trim()) return ''
    const json = JSON.parse(raw)
    const candidates = [
      json.prompt,
      json.text,
      json.userMessage,
      json.user_message,
      json.message,
      json.content,
    ]
    for (const value of candidates) {
      if (typeof value === 'string' && value.trim()) return value
    }
    return ''
  } catch {
    return ''
  }
}

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

const prompt = readPromptFromStdin()

if (/même\s*X|meme\s*X|same\s*X/i.test(prompt)) {
  emit({ continue: true })
  process.exit(0)
}

const result = spawnSync(process.execPath, [join(root, 'scripts', 'bump-prompt.mjs')], {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
})

if (result.status !== 0) {
  process.stderr.write(result.stderr || '[hook] bump-prompt failed\n')
  emit({ continue: true })
  process.exit(0)
}

const line = (result.stdout || '').trim().split('\n').pop() || ''
emit({
  continue: true,
  agent_message: line
    ? `[version hook] ${line}`
    : '[version hook] npm run version:prompt exécuté',
})
