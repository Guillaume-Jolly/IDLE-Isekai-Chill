#!/usr/bin/env node
/** Validation sémantique corpus Parler curé — answerRule, diversité, réactions, fil pack, anti-calque. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ANSWER_RULE_IDS,
  FRENCH_LINT_PATTERNS,
  curatedIdPrefix,
  getLyraVoiceProfile,
  getPack4Thread,
  checkEmotionReactionCoherence,
  choiceStarter,
  countSubordinateClauses,
  exchangeFullText,
  jaccardSimilarity,
  normalizeCorpusLine,
  stripSpeechGuillemets,
  tokenizeWords,
  validateAnswerRule,
} from './curated-parler-semantics-lib.mjs';
import {
  companionActionIsThirdPerson,
  companionLineIsAction,
  companionLineIsSpokenDialogue,
  companionLineLooksLikeThirdPersonNarration,
  actionChoiceAgencyAligned,
  actionChoiceWardrobeAligned,
  actionChoiceWardrobeLayerOk,
  choicesToneBehaviorContract,
  romanticSincereDistinct,
  choicesSharedPhraseAligned,
  getJaccardFailThreshold,
  intimateFinaleIsValid,
  aff5FinaleHasCompanionReaction,
  aff5FinaleAgencyCoherenceOk,
  frenchElisionAfterQueOk,
  aff5FemaleMcPlayerTextRegister,
  aff5MaleMcPlayerTextRegister,
  aff5McPlayerTextRegister,
  aff5CompanionActionRegister,
  explicitEnfonceLexiconOk,
  aff5FemaleMcRomanticChoiceExplicitEnough,
  aff5MaleMcAnatomyOk,
  aff5MaleMcActionAnatomyOk,
  aff5FemaleMcActionAnatomyOk,
  isActionOrientedAffinity,
  isCrudeRegisterAffinity,
  powerDynamicFieldValid,
  powerDynamicChoiceAligned,
  aff4SuggestiveMcChoiceOk,
  corpusLexiconOk,
  choicePoseAlignedWithAction,
  choiceReactionCoherenceOk,
  romanticChoiceObeysStripConsigne,
  companionLineReadsComplete,
  exchangeNarrativeEconomyOk,
  exchangeSceneLogicOk,
  exchangeVestiaireDominanceOk,
  packNuLabelVestiaireOk,
  frenchStringGenderOk,
  bridgePlaceAnchored,
  bridgePackHookOk,
  packSessionContinuityOk,
  corpusTemplateQuotaWarnings,
  intimateFinaleLowCoherenceOk,
  reactionOralDidascalieWarn,
  exchangeSpectatorPresent,
} from './curated-parler-lib.mjs';
import { runAdvancedExchangeRules } from './curated-parler-advanced-rules.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const DEFAULT_JSON = path.join(__dirname, 'lyra-aff1-curated-12.json');

const JACCARD_FAIL = 0.58;
const GENERIC_MIN_LEN = 36;

function loadLyraGenericLines() {
  const dir = path.join(ROOT, 'public/data/link-corpus/lyra');
  const lines = new Set();
  if (!fs.existsSync(dir)) return lines;

  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json'))) {
    const batch = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const scenario of batch.scenarios ?? []) {
      for (const round of scenario.rounds ?? []) {
        if (round.prompt) lines.add(normalizeCorpusLine(round.prompt));
        for (const choice of round.choices ?? []) {
          if (choice.text && choice.text.length >= GENERIC_MIN_LEN) {
            lines.add(normalizeCorpusLine(choice.text));
          }
        }
      }
    }
  }
  return lines;
}

export function runSemanticsValidation(data, hooks) {
  const { fail, warn } = hooks;
  const genericLines = loadLyraGenericLines();
  const affinity = data.meta?.affinity ?? 1;
  const protagonistGender = data.meta?.protagonistGender ?? 'male';
  const isAff5FemaleMc = affinity >= 5 && protagonistGender === 'female';
  const isAff5MaleMc = affinity >= 5 && protagonistGender === 'male';
  const isAff4 = affinity === 4;
  const voiceProfile = getLyraVoiceProfile(affinity);
  const pack4Thread = getPack4Thread(affinity);
  const jaccardFail = getJaccardFailThreshold(affinity);
  const packCtxByExchangeId = new Map();
  for (const pack of data.meta.sessionPacks ?? []) {
    for (let i = 0; i < (pack.exchangeIds ?? []).length; i += 1) {
      packCtxByExchangeId.set(pack.exchangeIds[i], {
        packId: pack.id,
        packIndex: i,
        packLabel: pack.label ?? '',
      });
    }
  }

  for (const exchange of data.exchanges) {
    if (isActionOrientedAffinity(affinity) && exchange.answerRule !== 'action') {
      fail('S15', `${exchange.id} : aff. ${affinity} — answerRule doit être « action »`);
    }
    if (isActionOrientedAffinity(affinity) && !exchange.companionAction?.trim()) {
      fail('S17', `${exchange.id} : companionAction (3e personne) requis en aff. ${affinity}`);
    }
    if (isActionOrientedAffinity(affinity) && exchange.companionAction && !companionActionIsThirdPerson(exchange.companionAction)) {
      fail('S18', `${exchange.id} : companionAction sans verbe d'action 3e personne`);
    }
    if (isActionOrientedAffinity(affinity) && /\?\s*$/.test(exchange.companionLine.trim())) {
      fail('S16', `${exchange.id} : companionLine en question (?) — privilégier réplique Lyra`);
    }
    if (isActionOrientedAffinity(affinity) && !companionLineIsAction(exchange)) {
      fail('S19', `${exchange.id} : format action incomplet (companionAction ou companionLine)`);
    }
    if (isActionOrientedAffinity(affinity)) {
      const spoken = companionLineIsSpokenDialogue(exchange.companionLine, affinity, {
        visitorFacing: exchangeSpectatorPresent(exchange),
      });
      if (!spoken.ok) fail('S20', `${exchange.id} : ${spoken.reason}`);
      if (!companionLineReadsComplete(exchange.companionLine)) {
        fail('B7', `${exchange.id} : companionLine fragmentée ou télégraphique (ex. « Tout. » / « Maintenant. » seuls)`);
      }
    }
    if (isActionOrientedAffinity(affinity) && exchange.companionAction && exchange.companionLine) {
      const actionNorm = normalizeCorpusLine(exchange.companionAction);
      const lineNorm = normalizeCorpusLine(exchange.companionLine);
      if (actionNorm === lineNorm) {
        fail('S21', `${exchange.id} : companionLine duplique companionAction`);
      }
      if (companionLineLooksLikeThirdPersonNarration(exchange.companionLine)) {
        fail('S21', `${exchange.id} : companionLine ne doit pas être narration 3e personne`);
      }
    }
    if (isActionOrientedAffinity(affinity)) {
      const agency = actionChoiceAgencyAligned(exchange);
      if (!agency.ok) fail('S22', `${exchange.id} : ${agency.reason}`);
      const wardrobe = actionChoiceWardrobeAligned(exchange);
      if (!wardrobe.ok) fail('S33', `${exchange.id} : ${wardrobe.reason}`);
      const layer = actionChoiceWardrobeLayerOk(exchange);
      if (!layer.ok) fail('S34', `${exchange.id} : ${layer.reason}`);
      const lexicon = corpusLexiconOk(exchange);
      if (!lexicon.ok) fail('S38', `${exchange.id} : ${lexicon.reason}`);
      for (const choice of exchange.choices) {
        const pose = choicePoseAlignedWithAction(choice, exchange);
        if (!pose.ok) fail('S36', `${exchange.id} / ${choice.tone} : ${pose.reason}`);
        const reaction = choiceReactionCoherenceOk(choice, exchange);
        if (!reaction.ok) {
          const code = /montée|descends sur toi|bite en elle/i.test(reaction.reason)
            ? 'S44'
            : /MC passif|presse-toi \/ entre|j['']avale/i.test(reaction.reason)
              ? 'S37b'
              : 'S37';
          fail(code, `${exchange.id} / ${choice.tone} : ${reaction.reason}`);
        }
      }
      const oralDidascalie = reactionOralDidascalieWarn(exchange);
      if (oralDidascalie) warn('S37c', oralDidascalie);
      const vestiaire = exchangeVestiaireDominanceOk(exchange);
      if (!vestiaire.ok) {
        const code = /déshabille|laisse-toi faire|enlève ta chemise/i.test(vestiaire.reason)
          ? 'S42'
          : /Lyra au-dessus|retourner/i.test(vestiaire.reason)
            ? 'S41'
            : 'S39';
        fail(code, `${exchange.id} : ${vestiaire.reason}`);
      }
      const economy = exchangeNarrativeEconomyOk(exchange);
      if (!economy.ok) fail('S40', `${exchange.id} : ${economy.reason}`);
      const sceneLogic = exchangeSceneLogicOk(exchange);
      if (!sceneLogic.ok) fail('S48', `${exchange.id} : ${sceneLogic.reason}`);
      const packCtx = packCtxByExchangeId.get(exchange.id);
      const packNu = packNuLabelVestiaireOk(exchange, packCtx);
      if (!packNu.ok) fail('S49', `${exchange.id} : ${packNu.reason}`);
      if (exchange.companionLine?.trim()) {
        const stringLine = frenchStringGenderOk(exchange.companionLine, 'companionLine');
        if (!stringLine.ok) fail('FR14', `${exchange.id} : ${stringLine.reason}`);
      }
      if (isCrudeRegisterAffinity(affinity) && exchange.companionAction?.trim()) {
        const actionRegister = aff5CompanionActionRegister(
          exchange.companionAction,
          protagonistGender,
          'companionAction',
        );
        if (!actionRegister.ok) fail('S44', `${exchange.id} : ${actionRegister.reason}`);
      }
      if (isCrudeRegisterAffinity(affinity)) {
        const bridgeAnchor = bridgePlaceAnchored(exchange.bridge ?? '');
        if (!bridgeAnchor.ok) fail('C1', `${exchange.id} : ${bridgeAnchor.reason}`);
      }
    }
    if (affinity >= 5) {
      if (!exchange.intimateFinale?.trim()) {
        fail('S23', `${exchange.id} : intimateFinale requis en aff. 5`);
      } else {
        const finale = intimateFinaleIsValid(exchange.intimateFinale, affinity);
        if (!finale.ok) fail('S24', `${exchange.id} : ${finale.reason}`);
        const finaleReaction = aff5FinaleHasCompanionReaction(exchange.intimateFinale);
        if (!finaleReaction.ok) fail('S32', `${exchange.id} : ${finaleReaction.reason}`);
        const finaleAgency = aff5FinaleAgencyCoherenceOk(exchange, protagonistGender);
        if (!finaleAgency.ok) fail('S47', `${exchange.id} : ${finaleAgency.reason}`);
        const finaleElision = frenchElisionAfterQueOk(exchange.intimateFinale, 'intimateFinale');
        if (!finaleElision.ok) fail('FR13', `${exchange.id} : ${finaleElision.reason}`);
      }
      if (exchange.intimateFinaleLow?.trim()) {
        const lowFinale = intimateFinaleIsValid(exchange.intimateFinaleLow, affinity);
        if (!lowFinale.ok) fail('S24', `${exchange.id} intimateFinaleLow : ${lowFinale.reason}`);
        const lowReaction = aff5FinaleHasCompanionReaction(exchange.intimateFinaleLow);
        if (!lowReaction.ok) fail('S32', `${exchange.id} intimateFinaleLow : ${lowReaction.reason}`);
        const lowCoherence = intimateFinaleLowCoherenceOk(exchange);
        if (!lowCoherence.ok) fail('S47b', `${exchange.id} : ${lowCoherence.reason}`);
      }
    }

    if (isAff5MaleMc || isAff5FemaleMc) {
      for (const choice of exchange.choices) {
        const mcText = aff5McPlayerTextRegister(choice.text, protagonistGender, `choix ${choice.tone}`);
        if (!mcText.ok) fail('S43', `${exchange.id} : ${mcText.reason}`);
        const elision = frenchElisionAfterQueOk(choice.text, `choix ${choice.tone}`);
        if (!elision.ok) fail('FR13', `${exchange.id} : ${elision.reason}`);
        const stringChoice = frenchStringGenderOk(choice.text, `choix ${choice.tone}`);
        if (!stringChoice.ok) fail('FR14', `${exchange.id} : ${stringChoice.reason}`);
      }
      if (exchange.intimateFinale?.trim()) {
        const mcFinale = aff5McPlayerTextRegister(exchange.intimateFinale, protagonistGender, 'intimateFinale');
        if (!mcFinale.ok) fail('S43', `${exchange.id} : ${mcFinale.reason}`);
      }
    }

    if (isAff5FemaleMc) {
      const explicitRomantic = aff5FemaleMcRomanticChoiceExplicitEnough(exchange);
      if (!explicitRomantic.ok) fail('S26', `${exchange.id} : ${explicitRomantic.reason}`);
    }

    if (isAff5MaleMc && exchange.companionAction?.trim()) {
      const anatomy = aff5MaleMcAnatomyOk(exchange.companionAction, 'companionAction');
      if (!anatomy.ok) fail('S27', `${exchange.id} : ${anatomy.reason}`);
    }
    if (isAff5MaleMc && exchange.intimateFinale?.trim()) {
      const finaleAnatomy = aff5MaleMcAnatomyOk(exchange.intimateFinale, 'intimateFinale');
      if (!finaleAnatomy.ok) fail('S27', `${exchange.id} : ${finaleAnatomy.reason}`);
    }

    if (isAff5FemaleMc && exchange.companionAction?.trim()) {
      const anatomy = aff5FemaleMcActionAnatomyOk(exchange.companionAction);
      if (!anatomy.ok) fail('S28', `${exchange.id} : ${anatomy.reason}`);
    }

    if (isCrudeRegisterAffinity(affinity)) {
      const pdField = powerDynamicFieldValid(exchange.powerDynamic);
      if (!pdField.ok) fail('S29a', `${exchange.id} : ${pdField.reason}`);
      const pdChoice = powerDynamicChoiceAligned(exchange);
      if (!pdChoice.ok) fail('S29', `${exchange.id} : ${pdChoice.reason}`);
    }

    if (isAff4) {
      for (const choice of exchange.choices) {
        const suggestive = aff4SuggestiveMcChoiceOk(choice.text, `choix ${choice.tone}`);
        if (!suggestive.ok) fail('S31', `${exchange.id} : ${suggestive.reason}`);
      }
    }

    if (!exchange.answerRule) {
      fail('S0', `${exchange.id} : answerRule manquant`);
    } else if (!ANSWER_RULE_IDS.includes(exchange.answerRule)) {
      fail('S0', `${exchange.id} : answerRule invalide « ${exchange.answerRule} »`);
    } else {
      const rule = validateAnswerRule(exchange);
      if (!rule.ok) fail('S1', `${exchange.id} : ${rule.reason}`);
    }

    if (exchange.answerRule !== 'report') {
      const starters = exchange.choices.map((choice) => choiceStarter(choice.text));
      const starterCounts = new Map();
      for (const starter of starters) {
        starterCounts.set(starter, (starterCounts.get(starter) ?? 0) + 1);
      }
      for (const [word, count] of starterCounts) {
        if (count >= 4) {
          fail('S2', `${exchange.id} : 4/4 choix commencent par « ${word} »`);
        } else if (count >= 3) {
          warn('S2', `${exchange.id} : ${count}/4 choix commencent par « ${word} » — diversifier si possible (D'abord… pour playful)`);
        }
      }
    }

    for (let left = 0; left < exchange.choices.length; left += 1) {
      for (let right = left + 1; right < exchange.choices.length; right += 1) {
        const similarity = jaccardSimilarity(
          exchange.choices[left].text,
          exchange.choices[right].text,
        );
        if (similarity >= jaccardFail) {
          fail(
            'S3',
            `${exchange.id} : choix ${exchange.choices[left].tone}/${exchange.choices[right].tone} trop proches (Jaccard ${similarity.toFixed(2)} ≥ ${jaccardFail})`,
          );
        }
      }
    }

    if (isActionOrientedAffinity(affinity) && exchange.answerRule === 'action') {
      const toneContract = choicesToneBehaviorContract(exchange);
      if (!toneContract.ok) fail('S35', `${exchange.id} : ${toneContract.reason}`);
      const topPair = romanticSincereDistinct(exchange, affinity >= 5 ? 0.45 : 0.48, affinity >= 5 ? 4 : 5);
      if (!topPair.ok) fail('S35', `${exchange.id} : ${topPair.reason}`);
      const sharedPhrase = choicesSharedPhraseAligned(exchange, affinity >= 5 ? 4 : 5);
      if (!sharedPhrase.ok) fail('S35', `${exchange.id} : ${sharedPhrase.reason}`);
    }

    for (const choice of exchange.choices) {
      const coherence = checkEmotionReactionCoherence(choice, affinity);
      if (!coherence.ok) {
        fail('S4', `${exchange.id} / ${choice.tone} : ${coherence.reason}`);
      }
    }

    const dialogue = exchangeFullText(exchange);
    if (voiceProfile.forbidden.test(dialogue)) {
      fail('S5', `${exchange.id} : registre Lyra — mot mièvre/interdit`);
    }
    const spoken = [exchange.companionLine, ...exchange.choices.flatMap((c) => [c.text, c.reaction])].join(' ');
    if (!exchangeSpectatorPresent(exchange) && voiceProfile.vouvoiement.test(spoken)) {
      fail('S5b', `${exchange.id} : vouvoiement dans le dialogue parlé`);
    }

    const romantic = exchange.choices.find((choice) => choice.tone === 'romantic');
    if (romantic && romantic.text.length > voiceProfile.maxRomanticChoiceChars) {
      warn('S6', `${exchange.id} : choix romantic long (${romantic.text.length} car) pour aff. ${affinity}`);
    }

    const subordinates = countSubordinateClauses(dialogue);
    if (subordinates > voiceProfile.maxSubordinateClauses) {
      warn('S7', `${exchange.id} : ${subordinates} subordonnées — oralité à vérifier`);
    }

    const shortSentences = dialogue.split(/[.!?]+/).filter((part) => part.trim().split(/\s+/).length <= 8).length;
    const longSentences = dialogue.split(/[.!?]+/).filter((part) => part.trim().split(/\s+/).length > 15).length;
    if (longSentences > shortSentences && longSentences >= 3) {
      warn('S8', `${exchange.id} : phrases longues dominantes (${longSentences} vs ${shortSentences} courtes)`);
    }

    for (const { id, pattern, hint } of FRENCH_LINT_PATTERNS) {
      if (pattern.test(dialogue)) {
        fail(id, `${exchange.id} : ${hint}`);
      }
    }

    const sincere = exchange.choices.find((choice) => choice.tone === 'sincere');
    if (sincere) {
      const lineTokens = new Set(tokenizeWords(exchange.companionLine));
      const overlap = tokenizeWords(sincere.text).filter((token) => lineTokens.has(token)).length;
      const maxLen = Math.max(...exchange.choices.map((choice) => choice.text.length));
      if (sincere.text.length === maxLen && overlap >= 3) {
        warn('S9', `${exchange.id} : sincere = plus long + reprend Lyra (évident en dev)`);
      }
    }

    for (const field of [exchange.companionLine, ...exchange.choices.map((c) => c.text)]) {
      const normalized = normalizeCorpusLine(field);
      if (normalized.length >= GENERIC_MIN_LEN && genericLines.has(normalized)) {
        fail('S10', `${exchange.id} : copie quasi exacte du corpus link générique`);
      }
    }
  }

  const reactionMap = new Map();
  for (const exchange of data.exchanges) {
    for (const choice of exchange.choices) {
      const key = normalizeCorpusLine(stripSpeechGuillemets(choice.reaction));
      if (key.length < 8) continue;
      const bucket = reactionMap.get(key) ?? [];
      bucket.push(`${exchange.id}/${choice.tone}`);
      reactionMap.set(key, bucket);
    }
  }
  for (const [reaction, locations] of reactionMap) {
    if (locations.length > 1) {
      fail('S11', `réaction dupliquée (${locations.join(', ')}) : « ${reaction.slice(0, 48)}… »`);
    }
  }

  const pack4 = data.meta.sessionPacks?.find((pack) => pack.id === 'pack-4');
  const pack5 = data.meta.sessionPacks?.find((pack) => pack.id === 'pack-5');
  if (pack4) {
    for (const id of pack4.exchangeIds) {
      const rule = pack4Thread[id];
      const exchange = data.exchanges.find((entry) => entry.id === id);
      if (!rule || !exchange) continue;
      const blob = exchangeFullText(exchange);
      if (!rule.pattern.test(blob)) {
        fail('S12', `${id} : fil pack 4 — mot-clé « ${rule.label} » absent`);
      }
    }
    if (affinity >= 5 && !pack4.packIntimateFinale?.trim()) {
      fail('S46', 'pack-4 aff. 5 : packIntimateFinale requis (clôture d\'acte toit)');
    }
    if (affinity >= 5 && pack4.packIntimateFinale?.trim()) {
      const packFinale = intimateFinaleIsValid(pack4.packIntimateFinale, affinity);
      if (!packFinale.ok) fail('S46', `pack-4 packIntimateFinale : ${packFinale.reason}`);
      const packReaction = aff5FinaleHasCompanionReaction(pack4.packIntimateFinale);
      if (!packReaction.ok) fail('S46', `pack-4 packIntimateFinale : ${packReaction.reason}`);
    }
    if (affinity >= 5 && pack4.packIntimateFinaleLow?.trim()) {
      const packFinaleLow = intimateFinaleIsValid(pack4.packIntimateFinaleLow, affinity);
      if (!packFinaleLow.ok) fail('S46', `pack-4 packIntimateFinaleLow : ${packFinaleLow.reason}`);
    }
    const ex10 = data.exchanges.find((entry) => entry.id === pack4.exchangeIds[0]);
    const ex11 = data.exchanges.find((entry) => entry.id === pack4.exchangeIds[1]);
    const hookPattern =
      affinity >= 5
        ? /toit|couverture|aube|chevauche|enfourche/i
        : affinity === 4
          ? /jardin|pavillon|matelas|embrasse|cou/i
          : affinity === 2
            ? /chapitre|place|signet|lecture/i
            : /livre|flux de mana|volume/i;
    if (ex10 && ex11 && !hookPattern.test(ex11.bridge)) {
      fail('S13', `pack 4 : échange 11 ne raccroche pas au fil de l'échange 10`);
    }
  }

  if (pack5) {
    if (affinity >= 5 && !pack5.packIntimateFinale?.trim()) {
      fail('S46', 'pack-5 aff. 5 : packIntimateFinale requis (clôture d\'acte bibliothèque)');
    }
    if (affinity >= 5 && pack5.packIntimateFinale?.trim()) {
      const packFinale = intimateFinaleIsValid(pack5.packIntimateFinale, affinity);
      if (!packFinale.ok) fail('S46', `pack-5 packIntimateFinale : ${packFinale.reason}`);
      const packReaction = aff5FinaleHasCompanionReaction(pack5.packIntimateFinale);
      if (!packReaction.ok) fail('S46', `pack-5 packIntimateFinale : ${packReaction.reason}`);
    }
    if (affinity >= 5 && pack5.packIntimateFinaleLow?.trim()) {
      const packFinaleLow = intimateFinaleIsValid(pack5.packIntimateFinaleLow, affinity);
      if (!packFinaleLow.ok) fail('S46', `pack-5 packIntimateFinaleLow : ${packFinaleLow.reason}`);
    }
  }

  if (affinity >= 4) {
    const packContinuity = packSessionContinuityOk(data);
    if (!packContinuity.ok) fail('S45', packContinuity.reason);
  }

  for (const entry of corpusTemplateQuotaWarnings(data)) {
    if (affinity >= 5) {
      fail(entry.code, entry.message);
    } else {
      warn(entry.code, entry.message);
    }
  }

  runAdvancedExchangeRules(data, { fail, warn });
}

function main() {
  const jsonPath = path.resolve(process.argv.find((arg) => arg.endsWith('.json')) ?? DEFAULT_JSON);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const failures = [];
  const warnings = [];

  runSemanticsValidation(data, {
    fail: (code, message) => failures.push({ code, message }),
    warn: (code, message) => warnings.push({ code, message }),
  });

  console.log('# Validation sémantique Parler curé —', path.basename(jsonPath));
  if (failures.length === 0) {
    console.log('✓ Sémantique OK.');
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
