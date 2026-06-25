#!/usr/bin/env node
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const [src, destRel] = process.argv.slice(2)
if (!src || !destRel) process.exit(1)
const dest = join(ROOT, destRel)
mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log(`✓ ${destRel}`)
