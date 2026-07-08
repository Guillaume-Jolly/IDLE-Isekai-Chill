#!/usr/bin/env node
/**
 * Archive pass 2 — move-only.
 * - mini jeu lien → old_2_2_1/mini jeu lien/{maeve,runa,lyra,...}
 * - color toon dev → staging/mini jeu/color 2/
 * - nest old_2_2_1 → old_2_2/old_2_2_1
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const MJL = path.join(REPO, 'old_2_2', 'old_2_2_1', 'mini jeu lien');
const COLOR2 = path.join(REPO, 'staging', 'mini jeu', 'color 2');

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

function moveOne(srcRel, destRel) {
  const src = path.join(REPO, srcRel);
  const dest = path.join(REPO, destRel);
  if (!fs.existsSync(src)) {
    log.push({ status: 'skip', src: srcRel, reason: 'missing' });
    return;
  }
  if (fs.existsSync(dest)) {
    log.push({ status: 'skip', src: srcRel, reason: 'dest exists', dest: destRel });
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const relNorm = srcRel.replace(/\\/g, '/');
  const tracked = isTracked(relNorm);
  if (tracked) {
    execSync(`git mv "${src}" "${dest}"`, { cwd: REPO, stdio: 'inherit' });
  } else {
    fs.renameSync(src, dest);
  }
  log.push({ status: 'ok', src: srcRel, dest: destRel, tracked });
}

function moveDir(srcRel, destRel) {
  const src = path.join(REPO, srcRel);
  const dest = path.join(REPO, destRel);
  if (!fs.existsSync(src)) {
    log.push({ status: 'skip', src: srcRel, reason: 'missing dir' });
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    log.push({ status: 'skip', src: srcRel, reason: 'dest dir exists' });
    return;
  }
  fs.renameSync(src, dest);
  log.push({ status: 'ok', src: srcRel, dest: destRel, kind: 'dir' });
}

function classifyRootScratch(name) {
  if (name.startsWith('validate-out-maeve') || name.startsWith('validate-maeve') || name.startsWith('v-maeve'))
    return 'maeve';
  if (
    name.startsWith('validate-out-runa') ||
    name.startsWith('validate-runa') ||
    name.startsWith('val-runa') ||
    name.startsWith('v-runa')
  )
    return 'runa';
  return 'racine';
}

function main() {
  fs.mkdirSync(path.join(MJL, 'maeve'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'runa'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'lyra'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'outils'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'code'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'skills-cursor'), { recursive: true });
  fs.mkdirSync(path.join(MJL, 'racine'), { recursive: true });

  for (const name of fs.readdirSync(REPO)) {
    if (
      /^(validate|v-maeve|v-runa|val-runa)/.test(name) &&
      (name.endsWith('.txt') || name.endsWith('.log'))
    ) {
      const bucket = classifyRootScratch(name);
      moveOne(name, path.posix.join('old_2_2/old_2_2_1/mini jeu lien', bucket, name));
    }
  }
  moveOne('test-hook-stdin.json', 'old_2_2/old_2_2_1/mini jeu lien/racine/test-hook-stdin.json');

  const lyraAff3 = [
    'scripts/references/link-corpus/curated/lyra-aff3-curated-12.json',
    'scripts/references/link-corpus/curated/lyra-aff3-curated-12.golden.json',
    'scripts/references/link-corpus/curated/lyra-aff3-curated-12-female-mc.json',
    'docs/traceability/link-corpus-review/LYRA_AFF3_CURATED_12.md',
  ];
  for (const f of lyraAff3) {
    moveOne(f, path.posix.join('old_2_2/old_2_2_1/mini jeu lien/lyra', path.basename(f)));
  }

  const outils = [
    'scripts/references/link-corpus/curated/parler-catalog-lib.mjs',
    'scripts/references/link-corpus/curated/parler-catalog-expansion.mjs',
    'scripts/references/link-corpus/curated/companion-scene-profile-rules.mjs',
    'scripts/references/link-corpus/curated/parler-lot3-rules.mjs',
    'scripts/references/link-corpus/curated/parler-lot5-rules.mjs',
    'scripts/references/link-corpus/curated/parler-lot6-rules.mjs',
    'scripts/references/link-corpus/curated/validate-parler-scenario.mjs',
    'scripts/references/link-corpus/curated/build-parler-scenario-preview.mjs',
  ];
  for (const f of outils) {
    moveOne(f, path.posix.join('old_2_2/old_2_2_1/mini jeu lien/outils', path.basename(f)));
  }

  moveOne(
    'src/data/conversations/stagingParlerCorpus.ts',
    'old_2_2/old_2_2_1/mini jeu lien/code/stagingParlerCorpus.ts',
  );

  const skillDirs = [
    '.cursor/skills/parler-loop',
    '.cursor/skills/regles-parler',
    '.cursor/skills/relecture-parler',
    '.cursor/skills/writer-parler',
  ];
  for (const d of skillDirs) {
    const base = path.basename(d);
    moveDir(d, path.posix.join('old_2_2/old_2_2_1/mini jeu lien/skills-cursor', base));
  }

  // Color Toon → staging
  moveDir(
    'assets/Compagnons/laharl/color-masks',
    path.posix.join('staging/mini jeu/color 2/masks/laharl'),
  );
  moveDir('staging/color-toon-masks', path.posix.join('staging/mini jeu/color 2/chatgpt-cursor-test'));
  moveDir('staging/image-exports', path.posix.join('staging/mini jeu/color 2/exports'));
  moveDir('scripts/color-toon', path.posix.join('staging/mini jeu/color 2/scripts'));
  moveOne(
    'scripts/tmp-stylize-hair-bw.py',
    path.posix.join('staging/mini jeu/color 2/scripts/tmp-stylize-hair-bw.py'),
  );

  // Nest old_2_2_1 inside old_2_2
  const nested = path.join(REPO, 'old_2_2', 'old_2_2_1');
  if (!fs.existsSync(nested) && fs.existsSync(path.join(REPO, 'old_2_2_1'))) {
    fs.mkdirSync(path.join(REPO, 'old_2_2'), { recursive: true });
    fs.renameSync(path.join(REPO, 'old_2_2_1'), nested);
    log.push({ status: 'ok', src: 'old_2_2_1', dest: 'old_2_2/old_2_2_1', kind: 'nest' });
  }

  const report = path.join(REPO, 'old_2_2', 'old_2_2_1', 'reorg-pass2-log.json');
  fs.mkdirSync(path.dirname(report), { recursive: true });
  fs.writeFileSync(report, JSON.stringify({ at: new Date().toISOString(), moves: log }, null, 2));
  const ok = log.filter((x) => x.status === 'ok').length;
  console.log(`\nReorg pass2: ${ok} ops OK, log: ${report}`);
}

main();
