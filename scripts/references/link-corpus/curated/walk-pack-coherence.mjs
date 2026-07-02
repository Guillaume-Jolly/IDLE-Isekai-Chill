#!/usr/bin/env node
/**
 * Déroulé narratif d'un pack Parler curé — vérifie la cohérence séquentielle
 * (continuité ponts, spectateur, épilogues round + acte, alignement choix +3).
 *
 * Usage :
 *   node walk-pack-coherence.mjs [corpus.json] --pack pack-4 [--profile romantic|playful|mixed]
 *   node walk-pack-coherence.mjs lyra-aff5-curated-12.json --pack pack-5 --profile mixed -v
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COMPANION_NAME,
  exchangeSpectatorPresent,
  bridgePackHookOk,
  bridgeActionSpatialClashOk,
  powerDynamicChoiceAligned,
  romanticChoiceRespectsCompanionOnTop,
  reactionMatchesDominanceFlip,
  formatCompanionPromptLine,
  formatSpeech,
  stripSpeechGuillemets,
} from './curated-parler-lib.mjs';
import {
  spectatorCompanionLineOk,
  spectatorCompanionLineIntimateOk,
  spectatorReactionOk,
  roundFinaleProlepsisOk,
  exchangeCompanionLineProlepsisOk,
  roundFinaleMatchesScore,
  intimateFinaleLowToneOk,
} from './curated-parler-advanced-rules.mjs';
import { exchangeFullText, getPack4Thread } from './curated-parler-semantics-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff5-curated-12.json');

const PROFILES = {
  /** Session max — romantic (+3) à chaque échange. */
  romantic: (choices) => choices.find((c) => c.score === 3) ?? choices[0],
  /** Session sincere — +2 à chaque échange. */
  sincere: (choices) => choices.find((c) => c.score === 2) ?? choices[0],
  /** Session direct — +1 à chaque échange. */
  direct: (choices) => choices.find((c) => c.score === 1) ?? choices[0],
  /** Pire session — playful (+0). */
  playful: (choices) => choices.find((c) => c.score === 0) ?? choices[0],
  /** Session réaliste — +3, +2, +3 sur 3 rounds ; alternance sur 9. */
  mixed: (choices, index) => {
    const target = index % 2 === 0 ? 3 : 2;
    return choices.find((c) => c.score === target) ?? choices.find((c) => c.score === 3) ?? choices[0];
  },
};

export const WALK_TONE_PROFILES = ['romantic', 'sincere', 'direct', 'playful'];

function splitBridgeSegments(bridge) {
  return bridge
    .split(/\s*;\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveRoundFinale(exchange, score, affinity) {
  if (affinity < 5 || score === undefined) return undefined;
  const low = exchange.intimateFinaleLow?.trim();
  const high = exchange.intimateFinale?.trim();
  if (score <= 1 && low) return { tier: 'low', text: low };
  if (score >= 2 && high) return { tier: 'high', text: high };
  return undefined;
}

function resolvePackFinale(pack, totalScore, roundCount, affinity) {
  if (affinity < 5 || roundCount <= 0) return undefined;
  const high = pack.packIntimateFinale?.trim();
  const low = pack.packIntimateFinaleLow?.trim();
  const threshold = roundCount * 2;
  if (totalScore >= threshold && high) return { tier: 'high', text: high };
  if (totalScore < threshold && low) return { tier: 'low', text: low };
  return undefined;
}

function reactionSpokenQuotes(reaction = '') {
  const matches = [...reaction.matchAll(/«([^»]*)»/g)];
  return matches
    .map((match) => match[1].trim())
    .filter(Boolean)
    .map((part) => part.replace(/^[^a-zàâäéèêëïîôùûüç]+/i, '').trim());
}

function reactionVisitorCoherence(exchange, choice) {
  return spectatorReactionOk(exchange, choice);
}

function roundFinaleProlepsisOkLocal(exchange, roundFinale, packId, packIndex, packLength) {
  return roundFinaleProlepsisOk(exchange, roundFinale, packId, packIndex, packLength);
}

function runExchangeChecks(exchange, priorExchange, packId, index, affinity, choice) {
  const issues = [];
  const passes = [];

  if (index > 0 && priorExchange) {
    const hook = bridgePackHookOk(exchange, priorExchange, packId, index, affinity);
    if (hook.ok) passes.push('continuité pont ↔ échange précédent');
    else issues.push({ code: 'WALK-CONT', message: hook.reason });
  }

  const spatial = bridgeActionSpatialClashOk(exchange);
  if (spatial.ok) passes.push('pont / companionAction cohérents');
  else issues.push({ code: 'WALK-SPACE', message: spatial.reason });

  const onTop = romanticChoiceRespectsCompanionOnTop(exchange);
  if (onTop.ok) passes.push('companionAction ↔ choix +3 (dominance)');
  else if (choice.score === 3) issues.push({ code: 'WALK-DOM', message: onTop.reason });

  const power = powerDynamicChoiceAligned(exchange);
  if (power.ok) passes.push('powerDynamic ↔ choix +3');
  else if (choice.score === 3) issues.push({ code: 'WALK-PWR', message: power.reason });

  const flip = reactionMatchesDominanceFlip(choice);
  if (flip.ok) passes.push('réaction ↔ retournement éventuel');
  else issues.push({ code: 'WALK-FLIP', message: flip.reason });

  const spectator = exchangeSpectatorPresent(exchange);
  if (spectator) {
    const lineOk = spectatorCompanionLineOk(exchange);
    if (lineOk.ok) passes.push('companionLine orientée visiteur');
    else issues.push({ code: 'WALK-SPEC-LINE', message: lineOk.reason });

    const intimateOk = spectatorCompanionLineIntimateOk(exchange);
    if (!intimateOk.ok) {
      issues.push({ code: 'WALK-SPEC-INT', message: intimateOk.reason });
    }
  } else {
    passes.push('pas de spectateur (Lyra peut parler au MC)');
  }

  const reactVisitor = reactionVisitorCoherence(exchange, choice);
  if (reactVisitor.ok) passes.push('réaction compatible spectateur');
  else issues.push({ code: 'WALK-SPEC-REACT', message: reactVisitor.reason });

  const pack4Thread = getPack4Thread(affinity);
  const threadRule = pack4Thread[exchange.id];
  if (threadRule && !threadRule.pattern.test(exchangeFullText(exchange))) {
    issues.push({
      code: 'WALK-THREAD',
      message: `fil pack — mot-clé « ${threadRule.label} » absent`,
    });
  } else if (threadRule) {
    passes.push(`fil pack (${threadRule.label})`);
  }

  return { issues, passes };
}

export function runPackWalkthrough(data, options = {}) {
  const packId = options.packId ?? 'pack-4';
  const profileName = options.profile ?? 'romantic';
  const verbose = Boolean(options.verbose);
  const pickChoice = PROFILES[profileName] ?? PROFILES.romantic;

  const affinity = data.meta?.affinity ?? 5;
  const pack = (data.meta.sessionPacks ?? []).find((entry) => entry.id === packId);
  if (!pack) {
    return { ok: false, error: `pack « ${packId} » introuvable` };
  }

  const byId = new Map(data.exchanges.map((exchange) => [exchange.id, exchange]));
  const exchanges = pack.exchangeIds.map((id) => byId.get(id)).filter(Boolean);
  if (exchanges.length !== pack.exchangeIds.length) {
    return { ok: false, error: `pack incomplet : ${exchanges.length}/${pack.exchangeIds.length} échanges` };
  }

  const steps = [];
  const allIssues = [];
  let totalScore = 0;
  let prior = null;

  for (let index = 0; index < exchanges.length; index += 1) {
    const exchange = exchanges[index];
    const choice = pickChoice(exchange.choices, index);
    totalScore += choice.score ?? 0;

    const roundFinale = resolveRoundFinale(exchange, choice.score, affinity);
    const { issues, passes } = runExchangeChecks(exchange, prior, packId, index, affinity, choice);
    const prolepsis = roundFinaleProlepsisOkLocal(exchange, roundFinale, packId, index, exchanges.length);
    if (prolepsis.ok) passes.push('épilogue round cohérent');
    else issues.push({ code: 'WALK-FINALE', message: prolepsis.reason });

    const lineProlepsis = exchangeCompanionLineProlepsisOk(exchange, index, exchanges.length);
    if (lineProlepsis.ok) passes.push('companionLine sans prolepse pack');
    else issues.push({ code: 'WALK-LINE', message: lineProlepsis.reason });

    const scoreFinale = roundFinaleMatchesScore(exchange, choice.score, roundFinale, affinity);
    if (scoreFinale.ok) {
      if (
        (profileName === 'playful' || profileName === 'direct') &&
        choice.score <= 1 &&
        exchange.intimateFinaleLow?.trim() &&
        roundFinale?.tier === 'low'
      ) {
        passes.push('WALK-LOW épilogue round');
      }
    } else if (exchange.intimateFinaleLow?.trim()) {
      issues.push({ code: 'WALK-LOW', message: scoreFinale.reason });
    }
    for (const issue of issues) allIssues.push({ ...issue, exchangeId: exchange.id, title: exchange.title });

    const bridgeSegments = splitBridgeSegments(exchange.bridge);

    steps.push({
      index: index + 1,
      id: exchange.id,
      title: exchange.title,
      spectator: exchangeSpectatorPresent(exchange),
      bridgeSegments,
      companionAction: exchange.companionAction?.trim(),
      companionLine: exchange.companionLine,
      choice: { tone: choice.tone, score: choice.score, text: choice.text },
      reaction: choice.reaction,
      roundFinale,
      passes,
      issues,
    });

    prior = exchange;
  }

  const maxScore = exchanges.length * 3;
  const packFinale = resolvePackFinale(pack, totalScore, exchanges.length, affinity);

  if (profileName === 'playful' && affinity >= 5 && pack.packIntimateFinaleLow?.trim()) {
    if (packFinale?.tier !== 'low') {
      allIssues.push({
        code: 'WALK-LOW',
        exchangeId: pack.id,
        title: pack.label,
        message: 'session playful (+0) — épilogue d\'acte low attendu',
      });
    } else {
      const tone = intimateFinaleLowToneOk(packFinale.text ?? '');
      if (!tone.ok) {
        allIssues.push({
          code: 'WALK-LOW',
          exchangeId: pack.id,
          title: pack.label,
          message: tone.reason,
        });
      }
    }
  }

  return {
    ok: allIssues.length === 0,
    packId,
    packLabel: pack.label,
    profile: profileName,
    affinity,
    protagonistGender: data.meta.protagonistGender ?? 'male',
    steps,
    session: { totalScore, maxScore },
    packFinale,
    issues: allIssues,
    verbose,
  };
}

function printReport(result) {
  if (result.error) {
    console.log(`✗ ${result.error}`);
    process.exit(1);
  }

  console.log(
    `# Déroulé pack — ${result.packLabel} (${result.packId}) — aff. ${result.affinity} — MC ${result.protagonistGender} — profil ${result.profile}`,
  );
  console.log('');

  for (const step of result.steps) {
    console.log(`## Échange ${step.index}/${result.steps.length} — ${step.title} (${step.id})`);
    if (result.verbose) {
      for (const segment of step.bridgeSegments) {
        console.log(`  [Pont] ${segment}`);
      }
      if (step.companionAction) console.log(`  [Action] ${step.companionAction}`);
      console.log(`  [Lyra] ${step.companionLine}`);
      console.log(`  [Choix ${step.choice.tone} +${step.choice.score}] ${step.choice.text}`);
      console.log(`  [Réaction] ${stripSpeechGuillemets(step.reaction).slice(0, 120)}${step.reaction.length > 120 ? '…' : ''}`);
    } else {
      console.log(`  Pont (${step.bridgeSegments.length} seg.) · ${step.spectator ? 'spectateur' : 'intime'} · choix ${step.choice.tone} +${step.choice.score}`);
    }
    if (step.roundFinale) {
      console.log(`  [Épilogue round ${step.roundFinale.tier}] ${step.roundFinale.text.slice(0, 90)}…`);
    } else if (result.affinity >= 5) {
      console.log(`  [Épilogue round] — (score ${step.choice.score} — pas d'épilogue)`);
    }
    for (const pass of step.passes) console.log(`  ✓ ${pass}`);
    for (const issue of step.issues) console.log(`  ✗ [${issue.code}] ${issue.message}`);
    console.log('');
  }

  console.log(`## Session : ${result.session.totalScore}/${result.session.maxScore} pts`);
  if (result.packFinale) {
    console.log(`## Épilogue d'acte (${result.packFinale.tier})`);
    console.log(`  ${result.packFinale.text}`);
  } else if (result.affinity >= 5 && (result.packId === 'pack-4' || result.packId === 'pack-5')) {
    console.log(`## Épilogue d'acte — absent (score session ou champ pack manquant)`);
  }

  console.log('');
  if (result.ok) {
    console.log('✓ Déroulé pack cohérent — aucun blocage automatique.');
  } else {
    console.log(`✗ ${result.issues.length} problème(s) de cohérence :`);
    for (const issue of result.issues) {
      console.log(`  [${issue.code}] ${issue.exchangeId} (${issue.title}) — ${issue.message}`);
    }
  }
}

function parseArgs(argv) {
  const jsonPath = path.resolve(argv.find((arg) => arg.endsWith('.json')) ?? DEFAULT_JSON);
  const packIdx = argv.indexOf('--pack');
  const packId = packIdx >= 0 ? argv[packIdx + 1] : 'pack-4';
  const profileIdx = argv.indexOf('--profile');
  const profile = profileIdx >= 0 ? argv[profileIdx + 1] : 'romantic';
  const verbose = argv.includes('-v') || argv.includes('--verbose');
  return { jsonPath, packId, profile, verbose };
}

function main() {
  const { jsonPath, packId, profile, verbose } = parseArgs(process.argv);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const result = runPackWalkthrough(data, { packId, profile, verbose });
  printReport(result);
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
