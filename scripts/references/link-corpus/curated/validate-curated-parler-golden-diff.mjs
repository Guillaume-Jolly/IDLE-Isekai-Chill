#!/usr/bin/env node
/** Diff golden lisible — review obligatoire avant update. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff1-curated-12.json');
const GOLDEN_PATH = path.join(__dirname, 'lyra-aff1-curated-12.golden.json');

function buildPayload(data) {
  return data.exchanges.map((exchange) => ({
    id: exchange.id,
    bridge: exchange.bridge,
    companionAction: exchange.companionAction,
    companionLine: exchange.companionLine,
    intimateFinale: exchange.intimateFinale,
    intimateFinaleLow: exchange.intimateFinaleLow,
    answerRule: exchange.answerRule,
    choices: exchange.choices.map((choice) => ({
      tone: choice.tone,
      text: choice.text,
      score: choice.score,
      emotion: choice.emotion,
      reaction: choice.reaction,
    })),
  }));
}

function diffField(label, before, after) {
  if (before === after) return null;
  return { label, before, after };
}

function main() {
  const jsonPath = path.resolve(process.argv.find((arg) => arg.endsWith('.json') && !arg.includes('golden')) ?? DEFAULT_JSON);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const current = buildPayload(data);

  if (!fs.existsSync(GOLDEN_PATH)) {
    console.error('Golden absent. Lancer : npm run validate:curated-parler:update-golden');
    process.exit(1);
  }

  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8')).exchanges ?? [];
  const diffs = [];

  for (let index = 0; index < Math.max(current.length, golden.length); index += 1) {
    const now = current[index];
    const was = golden[index];
    if (!now || !was) {
      diffs.push({ id: now?.id ?? was?.id ?? `#${index + 1}`, label: 'échange', before: was ? 'présent' : '∅', after: now ? 'présent' : '∅' });
      continue;
    }

    for (const field of ['bridge', 'companionLine', 'answerRule', 'intimateFinale', 'intimateFinaleLow']) {
      const change = diffField(field, was[field], now[field]);
      if (change) diffs.push({ id: now.id, ...change });
    }

    for (let choiceIndex = 0; choiceIndex < 4; choiceIndex += 1) {
      const tone = now.choices[choiceIndex]?.tone ?? `choix-${choiceIndex + 1}`;
      for (const key of ['text', 'score', 'emotion', 'reaction']) {
        const change = diffField(
          `${tone}.${key}`,
          was.choices[choiceIndex]?.[key],
          now.choices[choiceIndex]?.[key],
        );
        if (change) diffs.push({ id: now.id, ...change });
      }
    }
  }

  console.log('# Diff golden Parler curé\n');
  if (diffs.length === 0) {
    console.log('Aucune différence avec le golden.');
    process.exit(0);
  }

  for (const entry of diffs) {
    console.log(`## ${entry.id} — ${entry.label}`);
    console.log(`- avant : ${entry.before ?? '∅'}`);
    console.log(`+ après : ${entry.after ?? '∅'}`);
    console.log('');
  }

  console.log(`${diffs.length} changement(s). Review requise avant : npm run validate:curated-parler:update-golden`);
  process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
