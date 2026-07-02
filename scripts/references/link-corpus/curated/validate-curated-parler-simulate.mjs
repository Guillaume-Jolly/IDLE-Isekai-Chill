#!/usr/bin/env node
/** Simulation headless — 4 packs × parcours choix, budgets affichage. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COMPANION_NAME,
  formatCompanionPromptLine,
  formatCompanionReactionLine,
  formatSpeech,
  orderDialogueChoicesDev,
  stripSpeechGuillemets,
} from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff1-curated-12.json');

const DISPLAY_BUDGET = {
  promptLine: 128,
  choiceText: 96,
  reactionLine: 132,
  bridgeLine: 140,
};

function exchangeToRound(exchange) {
  const choices = orderDialogueChoicesDev(exchange.choices);
  if (choices.length !== 4) return null;
  return {
    bridge: exchange.bridge,
    companionAction: exchange.companionAction?.trim() || undefined,
    prompt: formatSpeech(exchange.companionLine),
    choices,
  };
}

export function runSimulateValidation(data, hooks) {
  const { fail, warn } = hooks;
  const byId = new Map(data.exchanges.map((exchange) => [exchange.id, exchange]));
  const packs = data.meta.sessionPacks ?? [];

  for (const pack of packs) {
    const exchanges = pack.exchangeIds
      .map((id) => byId.get(id))
      .filter((exchange) => exchange !== undefined);

    if (exchanges.length < 1 || exchanges.length !== pack.exchangeIds.length) {
      fail('M1', `${pack.id} : ${exchanges.length}/${pack.exchangeIds.length} échanges`);
      continue;
    }

    for (const tone of ['sincere', 'direct', 'playful', 'romantic']) {
      for (const exchange of exchanges) {
        const round = exchangeToRound(exchange);
        if (!round) {
          fail('M2', `${pack.id} / ${exchange.id} : round invalide`);
          continue;
        }

        if (round.bridge.length > DISPLAY_BUDGET.bridgeLine) {
          warn('M3', `${exchange.id} : bridge ${round.bridge.length} car (scroll)`);
        }

        if (round.companionAction) {
          const actionLine = formatCompanionPromptLine(COMPANION_NAME, round.companionAction);
          if (actionLine.length > DISPLAY_BUDGET.promptLine) {
            warn('M4b', `${exchange.id} : action affichée ${actionLine.length} car`);
          }
        }

        const promptLine = formatCompanionPromptLine(COMPANION_NAME, round.prompt);
        if (promptLine.length > DISPLAY_BUDGET.promptLine) {
          warn('M4', `${exchange.id} : prompt affiché ${promptLine.length} car`);
        }

        const choice = round.choices.find((entry) => entry.tone === tone);
        if (!choice) {
          fail('M5', `${exchange.id} : ton ${tone} absent`);
          continue;
        }

        if (choice.text.length > DISPLAY_BUDGET.choiceText) {
          warn('M6', `${exchange.id} / ${tone} : choix ${choice.text.length} car`);
        }

        const reactionLine = formatCompanionReactionLine(COMPANION_NAME, choice.reaction);
        if (reactionLine.length > DISPLAY_BUDGET.reactionLine) {
          warn('M7', `${exchange.id} / ${tone} : réaction ${reactionLine.length} car`);
        }

        if (!stripSpeechGuillemets(choice.reaction)) {
          fail('M8', `${exchange.id} / ${tone} : réaction vide après formatage`);
        }

        if (choice.score < 0 || choice.score > 3) {
          fail('M9', `${exchange.id} / ${tone} : score hors plage`);
        }
      }
    }
  }
}

function main() {
  const jsonPath = path.resolve(process.argv.find((arg) => arg.endsWith('.json')) ?? DEFAULT_JSON);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const failures = [];
  const warnings = [];

  runSimulateValidation(data, {
    fail: (code, message) => failures.push({ code, message }),
    warn: (code, message) => warnings.push({ code, message }),
  });

  console.log('# Simulation Parler curé —', path.basename(jsonPath));
  if (failures.length === 0) console.log('✓ Simulation OK.');
  else for (const entry of failures) console.log(`✗ [${entry.code}] ${entry.message}`);
  if (warnings.length > 0) {
    console.log('\n## Avertissements affichage');
    for (const entry of warnings) console.log(`⚠ [${entry.code}] ${entry.message}`);
  }
  if (failures.length > 0) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
