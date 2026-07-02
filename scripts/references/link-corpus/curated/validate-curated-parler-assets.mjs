#!/usr/bin/env node
/** Vérifie émotions JSON ↔ cutouts compagnon sur disque. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactionPortraitEmotion } from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff1-curated-12.json');

const COMPANION_EMOTION_IDS = [
  'neutral',
  'happy',
  'shy',
  'annoyed',
  'sad',
  'surprised',
  'romantic',
  'playful',
  'focused',
  'pleased',
  'dry_amused',
  'concerned',
  'firm',
  'curious',
  'dismissive',
  'tired',
  'warm',
  'embarrassed',
  'commanding',
  'heated',
  'dominant',
  'lustful',
];

function cutoutCandidates(companionId, emotion) {
  return [
    path.join(ROOT, 'public/assets/companions', companionId, `emotion-${emotion}.png`),
    path.join(ROOT, 'assets/Compagnons', companionId, 'cutouts', `emotion-${emotion}.png`),
    path.join(ROOT, 'assets/companions', companionId, `emotion-${emotion}.png`),
  ];
}

function emotionAssetExists(companionId, emotion) {
  return cutoutCandidates(companionId, emotion).some((candidate) => fs.existsSync(candidate));
}

export function runAssetsValidation(data, hooks) {
  const { fail, warn } = hooks;
  const companionId = data.meta.companionId ?? 'lyra';

  for (const emotion of COMPANION_EMOTION_IDS) {
    if (!emotionAssetExists(companionId, emotion)) {
      warn('A0', `cutout manquant pour ${companionId}/emotion-${emotion}.png`);
    }
  }

  const usedEmotions = new Set();
  const usedPortraitEmotions = new Set();

  for (const exchange of data.exchanges) {
    for (const choice of exchange.choices) {
      if (!choice.emotion) {
        fail('A1', `${exchange.id} / ${choice.tone} : emotion absente`);
        continue;
      }
      if (!COMPANION_EMOTION_IDS.includes(choice.emotion)) {
        fail('A2', `${exchange.id} / ${choice.tone} : emotion inconnue « ${choice.emotion} »`);
        continue;
      }
      usedEmotions.add(choice.emotion);
      if (!emotionAssetExists(companionId, choice.emotion)) {
        fail('A3', `${exchange.id} / ${choice.tone} : pas de PNG pour emotion-${choice.emotion}`);
      }

      const portrait = reactionPortraitEmotion(choice);
      usedPortraitEmotions.add(portrait);
      if (!emotionAssetExists(companionId, portrait)) {
        fail('A4', `${exchange.id} / ${choice.tone} : portrait ${portrait} sans asset`);
      }
    }
  }

  const unusedInCorpus = COMPANION_EMOTION_IDS.filter((emotion) => !usedEmotions.has(emotion));
  if (unusedInCorpus.length > 0) {
    warn('A5', `émotions jamais taguées dans le corpus : ${unusedInCorpus.join(', ')}`);
  }
}

function main() {
  const jsonPath = path.resolve(process.argv.find((arg) => arg.endsWith('.json')) ?? DEFAULT_JSON);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const failures = [];
  const warnings = [];

  runAssetsValidation(data, {
    fail: (code, message) => failures.push({ code, message }),
    warn: (code, message) => warnings.push({ code, message }),
  });

  console.log('# Validation assets Parler curé —', path.basename(jsonPath));
  if (failures.length === 0) console.log('✓ Assets émotions OK.');
  else for (const entry of failures) console.log(`✗ [${entry.code}] ${entry.message}`);
  if (warnings.length > 0) {
    console.log('\n## Avertissements');
    for (const entry of warnings) console.log(`⚠ [${entry.code}] ${entry.message}`);
  }
  if (failures.length > 0) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
