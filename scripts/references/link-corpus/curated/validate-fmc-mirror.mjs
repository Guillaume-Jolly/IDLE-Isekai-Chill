#!/usr/bin/env node
/** Validation miroir H/F — cohérence anatomie / registre (FM2). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runFmcMirrorValidation, resolveFmcMirrorPath } from './curated-parler-advanced-rules.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff5-curated-12-female-mc.json');

export function runFmcMirrorFromPath(jsonPath, hooks) {
  const pairPath = resolveFmcMirrorPath(jsonPath);
  if (!pairPath) {
    hooks.fail('FM0', `pas de corpus homologue pour ${path.basename(jsonPath)}`);
    return;
  }
  const resolvedPair = path.resolve(pairPath);
  if (!fs.existsSync(resolvedPair)) {
    hooks.fail('FM0', `corpus homologue introuvable : ${pairPath}`);
    return;
  }

  const primary = JSON.parse(fs.readFileSync(path.resolve(jsonPath), 'utf8'));
  const mirror = JSON.parse(fs.readFileSync(resolvedPair, 'utf8'));
  const maleData = jsonPath.includes('-female-mc') ? mirror : primary;
  const femaleData = jsonPath.includes('-female-mc') ? primary : mirror;
  runFmcMirrorValidation(maleData, femaleData, hooks);
}

function main() {
  const jsonPath = path.resolve(process.argv.find((arg) => arg.endsWith('.json')) ?? DEFAULT_JSON);
  const failures = [];
  const warnings = [];

  runFmcMirrorFromPath(jsonPath, {
    fail: (code, message) => failures.push({ code, message }),
    warn: (code, message) => warnings.push({ code, message }),
  });

  console.log('# Validation miroir FMC —', path.basename(jsonPath));
  if (failures.length === 0) {
    console.log('✓ Miroir H/F OK.');
  } else {
    for (const entry of failures) console.log(`✗ [${entry.code}] ${entry.message}`);
  }
  if (warnings.length > 0) {
    console.log('\n## Avertissements');
    for (const entry of warnings) console.log(`⚠ [${entry.code}] ${entry.message}`);
  }
  if (failures.length > 0) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
