#!/usr/bin/env node
/**
 * Archive phase 2.2.1 — move-only (no file deletion).
 * Annulé → old_2_2/old_2_2_1/annule/
 * Reliquats dev → old_2_2/old_2_2_1/reliquats/
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const ARCHIVE = path.join(REPO, 'old_2_2', 'old_2_2_1');

const ANNULE_DIRS = [
  'staging/parler-scenarios',
  'staging/parler-loop',
  'scripts/references/link-corpus/curated/havre-parler',
  'scripts/docs',
];

const ANNULE_FILES = [
  'staging/parler-scenarios.rar',
  'scripts/parler-editorial-loop.mjs',
  'scripts/references/link-corpus/curated/build-maeve-parler-corpus.mjs',
  'scripts/references/link-corpus/curated/build-runa-parler-corpus.mjs',
  'scripts/references/link-corpus/curated/build-havre-parler-corpus.mjs',
  'scripts/references/link-corpus/curated/build-havre-parler-corpora.mjs',
  'scripts/references/link-corpus/curated/generate-maeve-runa-corpora.mjs',
  'scripts/references/link-corpus/curated/fix-maeve-runa-corpus-quality.mjs',
  'scripts/references/link-corpus/curated/export-runa-forge-corpora.mjs',
  'scripts/references/link-corpus/curated/havre-parler-corpus-fix.mjs',
  'scripts/references/link-corpus/curated/sync-maeve-runa-docs.mjs',
  'scripts/references/link-corpus/curated/sync-havre-parler-docs.mjs',
  'scripts/references/link-corpus/curated/validate-havre-parler-all.mjs',
];

const ANNULE_GLOBS = [
  { dir: 'scripts/references/link-corpus/curated', re: /^(maeve|runa)-.*\.(json|golden\.json)$/ },
  { dir: 'docs/traceability/link-corpus-review', re: /^(MAEVE_|RUNA_|RELECTURE_MAEVE|RELECTURE_PARLER|RETEX_PARLER|PARLER_SCENARIO_FIRST|PARLER_EDITORIAL_LOOP|WRITER_PARLER)/ },
  { dir: 'docs/traceability/companions', re: /^(MAEVE|RUNA)_PROFILE\.md$/ },
];

const RELIQUAT_FILES = [
  '.tmp-audit-dev-log.mjs',
  '.tmp-audit-dev-log.out.txt',
  '.tmp-audit-output.txt',
  '.tmp-launcher-served.html',
  '.tmp-validate-l5.txt',
  '.tmp-validate-output.txt',
];

const log = [];

function isTracked(rel) {
  try {
    execSync(`git ls-files --error-unmatch "${rel.replace(/\\/g, '/')}"`, {
      cwd: REPO,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

function ensureParent(destAbs) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
}

function moveOne(relSrc, bucket) {
  const srcAbs = path.join(REPO, relSrc);
  if (!fs.existsSync(srcAbs)) {
    log.push({ status: 'skip', rel: relSrc, reason: 'missing' });
    return;
  }
  const relNorm = relSrc.replace(/\\/g, '/');
  const destRel = path.posix.join(bucket, relNorm);
  const destAbs = path.join(REPO, destRel);
  if (fs.existsSync(destAbs)) {
    log.push({ status: 'skip', rel: relSrc, reason: 'dest exists', dest: destRel });
    return;
  }
  ensureParent(destAbs);
  const tracked = isTracked(relNorm);
  if (tracked) {
    execSync(`git mv "${srcAbs}" "${destAbs}"`, { cwd: REPO, stdio: 'inherit' });
  } else {
    fs.renameSync(srcAbs, destAbs);
  }
  log.push({ status: 'ok', rel: relSrc, dest: destRel, tracked });
}

function collectGlobMoves() {
  const out = [];
  for (const { dir, re } of ANNULE_GLOBS) {
    const absDir = path.join(REPO, dir);
    if (!fs.existsSync(absDir)) continue;
    for (const name of fs.readdirSync(absDir)) {
      if (re.test(name)) out.push(path.posix.join(dir, name));
    }
  }
  return out;
}

function removeEmptyDirs(rootRel) {
  const removed = [];
  const rootAbs = path.join(REPO, rootRel);
  if (!fs.existsSync(rootAbs)) return removed;

  function walk(dirAbs) {
    const entries = fs.readdirSync(dirAbs);
    for (const e of entries) {
      const p = path.join(dirAbs, e);
      if (fs.statSync(p).isDirectory()) walk(p);
    }
    if (dirAbs === rootAbs) return;
    const left = fs.readdirSync(dirAbs);
    if (left.length === 0) {
      fs.rmdirSync(dirAbs);
      removed.push(path.relative(REPO, dirAbs).replace(/\\/g, '/'));
    }
  }
  walk(rootAbs);
  return removed;
}

function main() {
  fs.mkdirSync(path.join(ARCHIVE, 'annule'), { recursive: true });
  fs.mkdirSync(path.join(ARCHIVE, 'reliquats'), { recursive: true });

  for (const d of ANNULE_DIRS) moveOne(d, 'old_2_2/old_2_2_1/annule');
  for (const f of ANNULE_FILES) moveOne(f, 'old_2_2/old_2_2_1/annule');
  for (const f of collectGlobMoves()) moveOne(f, 'old_2_2/old_2_2_1/annule');
  for (const f of RELIQUAT_FILES) moveOne(f, 'old_2_2/old_2_2_1/reliquats');

  const emptied = [
    ...removeEmptyDirs('staging'),
    ...removeEmptyDirs('scripts/docs'),
    ...removeEmptyDirs('scripts/references/link-corpus/curated/havre-parler'),
  ];

  const reportPath = path.join(REPO, 'old_2_2', 'old_2_2_1', 'archive-run-log.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ at: new Date().toISOString(), moves: log, emptyDirsRemoved: emptied }, null, 2),
    'utf8',
  );

  const ok = log.filter((x) => x.status === 'ok').length;
  const skip = log.filter((x) => x.status === 'skip').length;
  console.log(`\nArchive 2.2.1: ${ok} moved, ${skip} skipped, ${emptied.length} empty dirs removed.`);
  console.log(`Log: ${reportPath}`);
}

main();
