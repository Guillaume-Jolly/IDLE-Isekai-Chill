#!/usr/bin/env node
/** Met à jour data/PROGRESS.json en scannant les PNG présents dans staging. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const STAGING = join(ROOT, 'staging/companion-visual-pack')
const queue = JSON.parse(readFileSync(join(STAGING, 'data/GENERATION_QUEUE.json'), 'utf8'))

let done = 0
for (const job of queue.jobs) {
  const abs = join(ROOT, job.output)
  job.status = existsSync(abs) ? 'done' : 'pending'
  if (job.status === 'done') done++
}

writeFileSync(
  join(STAGING, 'data/PROGRESS.json'),
  JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      total: queue.jobs.length,
      done,
      pending: queue.jobs.length - done,
      percent: Math.round((done / queue.jobs.length) * 100),
      byPhase: Object.groupBy(queue.jobs, (j) => j.phase),
    },
    null,
    2,
  ),
)

console.log(`Progress: ${done}/${queue.jobs.length} (${Math.round((done / queue.jobs.length) * 100)}%)`)
