#!/usr/bin/env node
/**
 * Validation complète corpus Parler curé — complète score-curated-exchange.mjs :
 * pipeline affichage, scores↔tons, émotions corpus, ponctuation, unicité, packs, doc, golden, runtime.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runSemanticsValidation } from './validate-curated-parler-semantics.mjs';
import { resolveFmcMirrorPath } from './curated-parler-advanced-rules.mjs';
import { runFmcMirrorFromPath } from './validate-fmc-mirror.mjs';
import { runPackWalkthrough, WALK_TONE_PROFILES } from './walk-pack-coherence.mjs';
import { corpusSupportsPackWalk } from './curated-parler-advanced-rules.mjs';
import { runAssetsValidation } from './validate-curated-parler-assets.mjs';
import { runSimulateValidation } from './validate-curated-parler-simulate.mjs';
import {
  COMPANION_NAME,
  INTIMATE_PACK_CUTOUT_EMOTIONS,
  JOYFUL_PORTRAIT_EMOTIONS,
  getScoreByTone,
  formatCompanionPromptLine,
  formatSpeech,
  normalizeDisplayText,
  normalizeCorpusLine,
  orderDialogueChoicesDev,
  parseDocExchanges,
  reactionPortraitEmotion,
  runBuiltInRegressions,
  shuffleChoices,
  stripSpeechGuillemets,
  fiveWordOpener,
} from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

const DEFAULT_JSON = path.join(__dirname, 'lyra-aff1-curated-12.json');
const jsonArg = process.argv.find((arg) => arg.endsWith('.json') && !arg.includes('golden'));
const jsonPath = path.resolve(jsonArg ?? DEFAULT_JSON);
const GOLDEN_PATH = jsonPath.replace(/\.json$/i, '.golden.json');
const SCORE_SCRIPT = path.join(__dirname, 'score-curated-exchange.mjs');

const updateGolden = process.argv.includes('--update-golden');

const failures = [];
const warnings = [];

function fail(code, message) {
  failures.push({ code, message });
}

function warn(code, message) {
  warnings.push({ code, message });
}

function checkDisplayPipeline(ex) {
  const prompt = formatSpeech(ex.companionLine);
  const stripped = stripSpeechGuillemets(prompt);
  const promptLine = formatCompanionPromptLine(COMPANION_NAME, prompt);

  if (ex.companionLine.includes('?') && !stripped.includes('?')) {
    fail('UI1', `${ex.id} : ? perdu après formatSpeech`);
  }
  if (ex.companionLine.includes('!') && !stripped.includes('!')) {
    fail('UI2', `${ex.id} : ! perdu après formatSpeech`);
  }

  const sourceLen = ex.companionLine.trim().length;
  if (sourceLen > 0 && stripped.length < sourceLen * 0.9) {
    fail('UI3', `${ex.id} : texte affiché < 90 % du companionLine (${stripped.length}/${sourceLen})`);
  }

  const afterColon = promptLine.split(':').slice(1).join(':').trim();
  if (!afterColon.includes(stripped.slice(0, Math.min(20, stripped.length)))) {
    fail('UI4', `${ex.id} : formatCompanionPromptLine tronque la réplique`);
  }

  for (const choice of ex.choices) {
    const reactionStripped = stripSpeechGuillemets(choice.reaction);
    if (!reactionStripped) {
      fail('UI5', `${ex.id} / ${choice.tone} : réaction vide après strip guillemets`);
    }
  }
}

function checkScoreToneMapping(ex, affinity) {
  const scoreByTone = getScoreByTone(affinity);
  for (const choice of ex.choices) {
    const expected = scoreByTone[choice.tone];
    if (expected === undefined) {
      fail('H1', `${ex.id} : ton inconnu « ${choice.tone} »`);
      continue;
    }
    if (choice.score !== expected) {
      fail('H1', `${ex.id} / ${choice.tone} : score ${choice.score} ≠ attendu ${expected}`);
    }
    if (choice.score < 0 || choice.score > 3) {
      fail('H1b', `${ex.id} / ${choice.tone} : score hors 0–3`);
    }
  }
}

function checkEmotionVsScore(ex) {
  for (const choice of ex.choices) {
    if (
      choice.score < 2 &&
      JOYFUL_PORTRAIT_EMOTIONS.has(choice.emotion) &&
      !INTIMATE_PACK_CUTOUT_EMOTIONS.has(choice.emotion)
    ) {
      fail(
        'H2',
        `${ex.id} / ${choice.tone} : émotion « ${choice.emotion} » interdite avec score ${choice.score} (< 2)`,
      );
    }
    const portrait = reactionPortraitEmotion(choice);
    if (
      choice.score < 2 &&
      JOYFUL_PORTRAIT_EMOTIONS.has(portrait) &&
      !INTIMATE_PACK_CUTOUT_EMOTIONS.has(portrait)
    ) {
      fail('H2b', `${ex.id} / ${choice.tone} : reactionPortraitEmotion renvoie encore une émotion joyeuse`);
    }
  }
}

function checkCompanionLinePunctuation(ex) {
  const trimmed = ex.companionLine.trim();
  if (!/[.!?]$/.test(trimmed)) {
    fail('C6', `${ex.id} : companionLine doit finir par . ou ? (${trimmed.slice(-40)})`);
  }
}

function checkGlobalUniqueness(exchanges) {
  const lines = exchanges.map((ex) => normalizeDisplayText(ex.companionLine));
  const lineDupes = lines.filter((line, index) => lines.indexOf(line) !== index);
  if (lineDupes.length > 0) {
    fail('U1', `companionLine dupliquée : ${[...new Set(lineDupes)].join(' | ')}`);
  }

  const allChoices = exchanges.flatMap((ex) =>
    ex.choices.map((c) => ({ id: ex.id, text: normalizeDisplayText(c.text) })),
  );
  const choiceTexts = allChoices.map((entry) => entry.text);
  const choiceDupes = choiceTexts.filter((text, index) => choiceTexts.indexOf(text) !== index);
  if (choiceDupes.length > 0) {
    fail('U2', `choix joueur dupliqué entre échanges : ${[...new Set(choiceDupes)].slice(0, 3).join(' | ')}`);
  }

  const openers = exchanges.flatMap((ex) =>
    ex.choices.map((c) => ({ id: ex.id, opener: fiveWordOpener(c.text) })),
  );
  const openerKeys = openers.map((entry) => entry.opener);
  const openerDupes = openerKeys.filter((opener, index) => openerKeys.indexOf(opener) !== index);
  if (openerDupes.length > 0) {
    fail('U3', `amorce 5 mots dupliquée entre échanges : ${[...new Set(openerDupes)].join(' | ')}`);
  }
}

function checkPackIntegrity(data) {
  const { exchanges, meta } = data;
  const byId = new Map(exchanges.map((ex) => [ex.id, ex]));
  const packs = meta.sessionPacks ?? [];
  const expectedExchangeCount = exchanges.length;
  const expectedPackCount = packs.length;

  if (expectedPackCount !== 4 && expectedPackCount !== 5) {
    fail('P1', `attendu 4 ou 5 packs, trouvé ${expectedPackCount}`);
  }

  const seenInPacks = new Set();
  for (const pack of packs) {
    const expectedSize = pack.exchangeIds.length;
    const allowedSize = pack.id === 'pack-5' ? 9 : 3;
    if (expectedSize !== allowedSize) {
      fail('P2', `${pack.id} : attendu ${allowedSize} exchangeIds, trouvé ${expectedSize}`);
    }
    for (const id of pack.exchangeIds) {
      if (!byId.has(id)) {
        fail('P3', `${pack.id} : id introuvable « ${id} »`);
      }
      if (seenInPacks.has(id)) {
        fail('P4', `id « ${id} » présent dans plusieurs packs`);
      }
      seenInPacks.add(id);
    }
  }

  if (seenInPacks.size !== exchanges.length) {
    fail('P5', `couverture packs ${seenInPacks.size}/${exchanges.length} échanges`);
  }

  const affinity = data.meta?.affinity ?? 1;
  const sampleId = data.exchanges[0]?.id ?? '';
  const idPrefixMatch = sampleId.match(/^(lyra-aff\d-curated(?:-[a-z-]+)?-)/);
  const idPrefix = idPrefixMatch?.[1] ?? `lyra-aff${affinity}-curated-`;

  for (let index = 1; index <= expectedExchangeCount; index += 1) {
    const expected = `${idPrefix}${String(index).padStart(2, '0')}`;
    if (!byId.has(expected)) {
      fail('P6', `id manquant : ${expected}`);
    }
  }
}

function exchangeToRoundMirror(exchange) {
  const choices = orderDialogueChoicesDev(exchange.choices);
  if (choices.length !== 4) return null;
  return {
    context: [exchange.bridge],
    companionAction: exchange.companionAction?.trim() || undefined,
    prompt: formatSpeech(exchange.companionLine),
    choices,
  };
}

function checkBuildCorpusMirror(data) {
  const byId = new Map(data.exchanges.map((ex) => [ex.id, ex]));

  for (const pack of data.meta.sessionPacks ?? []) {
    const exchanges = pack.exchangeIds
      .map((id) => byId.get(id))
      .filter((ex) => ex !== undefined);

    if (exchanges.length !== pack.exchangeIds.length) {
      fail('B1', `${pack.id} : buildCorpus — ${exchanges.length}/${pack.exchangeIds.length} échanges résolus`);
      continue;
    }

    const rounds = exchanges.map(exchangeToRoundMirror).filter((round) => round !== null);
    if (rounds.length !== pack.exchangeIds.length) {
      fail('B2', `${pack.id} : buildCorpus — ${rounds.length}/${pack.exchangeIds.length} rounds valides`);
    }

    for (const round of rounds) {
      if (round.choices.length !== 4) {
        fail('B3', `${pack.id} : round avec ${round.choices.length} choix`);
      }
      if (!round.prompt.startsWith('«')) {
        fail('B4', `${pack.id} : prompt sans guillemets français`);
      }
    }
  }
}

function parseDocChoiceRows(body) {
  const rows = [];
  const tableMatch = body.match(/\| Ton \| Réponse[\s\S]*?(?=\n\n---|\n## |$)/);
  if (!tableMatch) return rows;
  const lines = tableMatch[0].split('\n').slice(2);
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cells = line
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    if (cells.length < 4) continue;
    const toneRaw = cells[0].replace(/^✓\s*/, '').trim();
    rows.push({
      tone: toneRaw,
      text: stripSpeechGuillemets(cells[1]),
      reaction: cells[2],
      emotion: cells[3],
    });
  }
  return rows;
}

function checkDocSync(data) {
  const reviewDoc = data.meta.reviewDoc;
  if (!reviewDoc) {
    fail('D0', 'meta.reviewDoc manquant');
    return;
  }

  const docPath = path.resolve(ROOT, reviewDoc);
  if (!fs.existsSync(docPath)) {
    fail('D0', `reviewDoc introuvable : ${reviewDoc}`);
    return;
  }

  const docText = fs.readFileSync(docPath, 'utf8');
  const docExchanges = parseDocExchanges(docText);

  if (docExchanges.length !== data.exchanges.length) {
    fail('D1', `doc ${docExchanges.length} sections ≠ json ${data.exchanges.length}`);
  }

  for (let index = 0; index < data.exchanges.length; index += 1) {
    const jsonEx = data.exchanges[index];
    const docEx = docExchanges[index];
    const num = String(index + 1).padStart(2, '0');

    if (!docEx) {
      fail('D2', `${num} : section doc absente`);
      continue;
    }

    if (normalizeCorpusLine(docEx.companionLine ?? '') !== normalizeCorpusLine(jsonEx.companionLine)) {
      fail('D3', `${num} ${jsonEx.title} : companionLine doc ≠ json`);
    }

    if (normalizeDisplayText(docEx.bridge ?? '') !== normalizeDisplayText(jsonEx.bridge)) {
      fail('D4', `${num} ${jsonEx.title} : bridge doc ≠ json`);
    }

    const sectionBody = docText.split(new RegExp(`^## ${num} — `, 'm'))[1]?.split(/^## /m)[0] ?? '';
    const docRows = parseDocChoiceRows(sectionBody);

    if (docRows.length !== jsonEx.choices.length) {
      fail('D5', `${num} : ${docRows.length} lignes tableau doc ≠ ${jsonEx.choices.length} choix json`);
      continue;
    }

    for (let choiceIndex = 0; choiceIndex < jsonEx.choices.length; choiceIndex += 1) {
      const jsonChoice = jsonEx.choices[choiceIndex];
      const docChoice = docRows[choiceIndex];
      if (docChoice.tone !== jsonChoice.tone) {
        fail('D6', `${num} / ${jsonChoice.tone} : ton doc « ${docChoice.tone} »`);
      }
      if (normalizeCorpusLine(docChoice.text) !== normalizeCorpusLine(jsonChoice.text)) {
        fail('D7', `${num} / ${jsonChoice.tone} : texte choix doc ≠ json`);
      }
      if (docChoice.reaction.trim() !== jsonChoice.reaction.trim()) {
        fail('D8', `${num} / ${jsonChoice.tone} : réaction doc ≠ json`);
      }
      if (docChoice.emotion !== jsonChoice.emotion) {
        fail('D9', `${num} / ${jsonChoice.tone} : émotion doc « ${docChoice.emotion} » ≠ json « ${jsonChoice.emotion} »`);
      }
    }
  }
}

function buildGoldenPayload(data) {
  return {
    version: 1,
    source: path.relative(ROOT, jsonPath).replace(/\\/g, '/'),
    exchanges: data.exchanges.map((ex) => ({
      id: ex.id,
      bridge: ex.bridge,
      companionLine: ex.companionLine,
      answerRule: ex.answerRule,
      choices: ex.choices.map((c) => ({
        tone: c.tone,
        text: c.text,
        score: c.score,
        emotion: c.emotion,
        reaction: c.reaction,
      })),
    })),
  };
}

function checkGolden(data) {
  const payload = buildGoldenPayload(data);

  if (updateGolden) {
    fs.writeFileSync(GOLDEN_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`Golden mis à jour : ${path.relative(ROOT, GOLDEN_PATH)}`);
    return;
  }

  if (!fs.existsSync(GOLDEN_PATH)) {
    fail('G0', `golden absent — lancer : npm run validate:curated-parler:update-golden`);
    return;
  }

  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
  const current = JSON.stringify(payload.exchanges);
  const expected = JSON.stringify(golden.exchanges);

  if (current !== expected) {
    fail('G1', 'diff golden — review obligatoire (npm run validate:curated-parler:update-golden si voulu)');
  }
}

function checkUiLengthWarnings(exchanges) {
  for (const ex of exchanges) {
    // W1 (bridge+line scroll mobile) désactivé — repoussé.
    for (const choice of ex.choices) {
      if (choice.text.length > 88) {
        warn('W2', `${ex.id} / ${choice.tone} : choix ${choice.text.length} car — ~2 lignes mobile`);
      }
    }
  }
}

function checkRuntimeMirrors() {
  const choices = [
    { tone: 'romantic', score: 0, emotion: 'playful' },
    { tone: 'sincere', score: 3, emotion: 'happy' },
    { tone: 'direct', score: 2, emotion: undefined },
  ];

  const devOrder = orderDialogueChoicesDev(choices);
  if (devOrder.map((c) => c.score).join(',') !== '3,2,0') {
    fail('R1', 'orderDialogueChoices dev : ordre score incorrect');
  }

  let permuted = false;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const shuffled = shuffleChoices(choices);
    if (shuffled.map((c) => c.score).join(',') !== '3,2,0') {
      permuted = true;
      break;
    }
  }
  if (!permuted) {
    fail('R2', 'shuffleChoices : ordre jamais permuté sur 32 essais');
  }

  if (reactionPortraitEmotion({ score: 1, emotion: 'playful' }) !== 'annoyed') {
    fail('R3', 'reactionPortraitEmotion playful score 1 → annoyed');
  }
}

console.log('# Validation complète Parler curé —', path.basename(jsonPath));
console.log('');

runBuiltInRegressions();
checkRuntimeMirrors();

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const corpusAffinity = data.meta?.affinity ?? 1;

for (const ex of data.exchanges) {
  checkDisplayPipeline(ex);
  checkScoreToneMapping(ex, corpusAffinity);
  checkEmotionVsScore(ex);
  checkCompanionLinePunctuation(ex);
}

checkGlobalUniqueness(data.exchanges);
checkPackIntegrity(data);
checkBuildCorpusMirror(data);
checkDocSync(data);
checkGolden(data);
checkUiLengthWarnings(data.exchanges);

console.log('## Compléments (UI · tons · émotions · packs · doc · golden · runtime)');
if (failures.length === 0) {
  console.log('✓ Tous les contrôles complémentaires passent.');
} else {
  for (const entry of failures) {
    console.log(`✗ [${entry.code}] ${entry.message}`);
  }
}

if (warnings.length > 0) {
  console.log('\n## Avertissements (relecture)');
  for (const entry of warnings) {
    console.log(`⚠ [${entry.code}] ${entry.message}`);
  }
}

if (failures.length > 0) {
  console.error(`\nÉchec compléments : ${failures.length} problème(s).`);
  process.exit(1);
}

const mark = () => failures.length;

console.log('\n## Sémantique (answerRule · diversité · fil pack · anti-calque)');
const semanticsStart = mark();
runSemanticsValidation(data, { fail, warn });
if (failures.length === semanticsStart) console.log('✓ Sémantique OK.');
else failures.slice(semanticsStart).forEach((entry) => console.log(`✗ [${entry.code}] ${entry.message}`));

console.log('\n## Assets émotions');
const assetsStart = mark();
runAssetsValidation(data, { fail, warn });
if (failures.length === assetsStart) console.log('✓ Assets OK.');
else failures.slice(assetsStart).forEach((entry) => console.log(`✗ [${entry.code}] ${entry.message}`));

console.log('\n## Simulation headless');
const simulateStart = mark();
runSimulateValidation(data, { fail, warn });
if (failures.length === simulateStart) console.log('✓ Simulation OK.');
else failures.slice(simulateStart).forEach((entry) => console.log(`✗ [${entry.code}] ${entry.message}`));

if (failures.length > semanticsStart) {
  console.error(`\nÉchec sémantique/assets/simulation.`);
  process.exit(1);
}

const fmcStart = mark();
if (resolveFmcMirrorPath(jsonPath)) {
  console.log('\n## Miroir H/F (cohérence anatomie FM2)');
  runFmcMirrorFromPath(jsonPath, { fail, warn });
  if (failures.length === fmcStart) console.log('✓ Miroir H/F OK.');
  else failures.slice(fmcStart).forEach((entry) => console.log(`✗ [${entry.code}] ${entry.message}`));
}

if (failures.length > fmcStart) {
  console.error(`\nÉchec miroir H/F.`);
  process.exit(1);
}

if (corpusSupportsPackWalk(data)) {
  const walkStart = mark();
  const packIds = (data.meta?.sessionPacks ?? []).map((pack) => pack.id);
  console.log('\n## Déroulé packs × 4 tons (WALK-* séquentiel)');
  let walkOk = 0;
  const walkTotal = packIds.length * WALK_TONE_PROFILES.length;
  for (const packId of packIds) {
    for (const profile of WALK_TONE_PROFILES) {
      const walk = runPackWalkthrough(data, { packId, profile, verbose: false });
      if (walk.ok) {
        walkOk += 1;
        console.log(
          `✓ ${packId} / ${profile} — ${walk.session.totalScore}/${walk.session.maxScore} pts`,
        );
      } else {
        for (const issue of walk.issues) {
          fail(
            issue.code,
            `${packId}/${profile} ${issue.exchangeId} (${issue.title}) — ${issue.message}`,
          );
        }
        walk.issues.forEach((issue) =>
          console.log(
            `✗ [${issue.code}] ${packId}/${profile} ${issue.exchangeId} (${issue.title}) — ${issue.message}`,
          ),
        );
      }
    }
  }
  console.log(`## Bilan walk : ${walkOk}/${walkTotal} déroulés OK`);
  if (failures.length > walkStart) {
    console.error(`\nÉchec déroulé pack(s).`);
    process.exit(1);
  }
}

console.log('\n## Grille A→G (score-curated-exchange.mjs)\n');
const scoreRun = spawnSync(process.execPath, [SCORE_SCRIPT, jsonPath], {
  cwd: ROOT,
  stdio: 'inherit',
});

if (scoreRun.status !== 0) {
  process.exit(scoreRun.status ?? 1);
}

console.log('\n✓ Validation complète Parler curé OK.');
