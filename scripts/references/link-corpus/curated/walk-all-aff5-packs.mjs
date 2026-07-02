#!/usr/bin/env node
/**
 * Déroulé aff. 5 — les 5 packs × corpus H + F.
 * Usage : node walk-all-aff5-packs.mjs [--profile romantic|playful|mixed]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runPackWalkthrough } from './walk-pack-coherence.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKS = ['pack-1', 'pack-2', 'pack-3', 'pack-4', 'pack-5'];
const CORPORA = [
  { label: 'H', path: path.join(__dirname, 'lyra-aff5-curated-12.json') },
  { label: 'F', path: path.join(__dirname, 'lyra-aff5-curated-12-female-mc.json') },
];

function parseProfile(argv) {
  const idx = argv.indexOf('--profile');
  return idx >= 0 ? argv[idx + 1] : 'romantic';
}

function main() {
  const profile = parseProfile(process.argv);
  const results = [];
  let failed = 0;

  console.log(`# Déroulé aff. 5 — 5 packs × 2 corpus — profil ${profile}\n`);

  for (const corpus of CORPORA) {
    const data = JSON.parse(fs.readFileSync(corpus.path, 'utf8'));
    for (const packId of PACKS) {
      const result = runPackWalkthrough(data, { packId, profile, verbose: false });
      const pack = data.meta.sessionPacks?.find((entry) => entry.id === packId);
      const label = pack?.label ?? packId;
      const ok = result.ok !== false && (result.issues?.length ?? 0) === 0;
      if (!ok) failed += 1;
      results.push({ corpus: corpus.label, packId, label, ok, issues: result.issues ?? [] });
      const mark = ok ? '✓' : '✗';
      const finale =
        result.packFinale?.tier
          ? ` · acte ${result.packFinale.tier}`
          : packId === 'pack-4' || packId === 'pack-5'
            ? ' · acte —'
            : '';
      console.log(
        `${mark} ${corpus.label} ${packId} (${label}) — ${result.session?.totalScore ?? '?'}/${result.session?.maxScore ?? '?'}${finale}`,
      );
      if (!ok) {
        for (const issue of result.issues ?? []) {
          console.log(`    [${issue.code}] ${issue.exchangeId} — ${issue.message}`);
        }
      }
    }
    console.log('');
  }

  console.log(`## Bilan : ${results.length - failed}/${results.length} déroulés OK`);
  if (failed > 0) process.exit(1);
}

main();
