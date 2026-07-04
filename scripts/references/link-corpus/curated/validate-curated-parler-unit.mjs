#!/usr/bin/env node
/** Tests unitaires ciblés — split épilogue, S37b, S29, S50–S58, FM2, LQ6. */
import {
  powerDynamicChoiceAligned,
  reactionMcPassiveCoherenceOk,
  packActFinaleNarrativeCoherenceOk,
} from './curated-parler-lib.mjs';
import {
  spectatorCompanionLineOk,
  pack5BusinessRuleOk,
  fmcPackBusinessRuleOk,
  normalizedQuoteSimilarity,
  runFmcMirrorValidation,
  packLevelProlepsisInText,
  exchangeCompanionLineProlepsisOk,
  intimateFinaleLowToneOk,
  roundFinaleMatchesScore,
} from './curated-parler-advanced-rules.mjs';

function splitIntimateFinaleForDisplay(finale) {
  return finale
    .split(/\s*;\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// splitIntimateFinaleForDisplay
{
  const parts = splitIntimateFinaleForDisplay(
    'Premier segment ; deuxième segment ; troisième.',
  );
  assert(parts.length === 3, 'splitIntimateFinaleForDisplay : 3 segments attendus');
  assert(parts[0] === 'Premier segment', 'splitIntimateFinaleForDisplay : segment 1');
}

// reactionMcPassiveCoherenceOk (S37b)
{
  const exchange = {
    companionAction: 'Elle suce ta bite, paume sur ton ventre.',
    companionLine: 'Bouche ouverte.',
  };
  const bad = {
    tone: 'romantic',
    score: 3,
    text: 'Je reste immobile, bouche ouverte, je la laisse sucer ma bite.',
    reaction: '« Presse-toi. Continue. »',
  };
  const good = {
    tone: 'romantic',
    score: 3,
    text: 'Dos à la rambarde, immobile, je la laisse sucer ma bite jusqu\'à ce que je jouisse.',
    reaction: '« Laisse-toi… aller. J\'avale. » *Elle hache chaque mot.*',
  };
  assert(!reactionMcPassiveCoherenceOk(bad, exchange).ok, 'S37b : presse-toi au MC passif doit échouer');
  assert(reactionMcPassiveCoherenceOk(good, exchange).ok, 'S37b : laisse-toi aller doit passer');
}

// powerDynamicChoiceAligned + je reste allongé
{
  const exchange = {
    powerDynamic: 'companion_dominant',
    companionLine: 'Attends mon signal sur tes hanches — après, tu entres.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je reste allongé — je la laisse serrer mes hanches avant de glisser en elle.',
      },
      { tone: 'sincere', score: 2, text: 'Je ralentis quand elle serre.' },
      { tone: 'direct', score: 1, text: 'Je compte trente secondes puis je bouge.' },
      { tone: 'playful', score: 0, text: 'D\'abord je feins de rester immobile.' },
    ],
  };
  assert(powerDynamicChoiceAligned(exchange).ok, 'S29 : je reste allongé + companion_dominant doit passer');
}

// S50 spectateur — companionLine visiteur
{
  const ok = {
    title: 'Sans prévenir',
    bridge: 'Le visiteur feuillette un registre ; Lyra commente une gravure.',
    companionLine: 'Je vous montre cette gravure — remarquez le trait du scribe.',
    choices: [{ tone: 'romantic', score: 3, text: 'x', reaction: '« … »' }],
  };
  const bad = {
    title: 'Sans prévenir',
    bridge: 'Le visiteur feuillette un registre.',
    companionLine: 'Reste là — je décide quand tu bouges.',
    choices: [{ tone: 'romantic', score: 3, text: 'x', reaction: '« … »' }],
  };
  assert(spectatorCompanionLineOk(ok).ok, 'S50 : line visiteur doit passer');
  assert(!spectatorCompanionLineOk(bad).ok, 'S50 : line intime MC doit échouer');
}

// S53 pack-5 métier gravure
{
  const ex = {
    id: 'lyra-aff5-curated-15',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Sans prévenir, je glisse le gode — sa voix reprend sur la gravure sans faillir.',
      },
    ],
  };
  assert(pack5BusinessRuleOk(ex).ok, 'S53 : choix +3 gravure doit passer');
}

// LQ6 similarité réactions
{
  const sim = normalizedQuoteSimilarity('Alors viens. Ne te retiens pas.', 'Bien. Ne te retiens pas.');
  assert(sim >= 0.5 && sim < 0.85, 'LQ6 : similarité partielle attendue');
}

// S56 prolepse pack mid-pack
{
  assert(!packLevelProlepsisInText('Demain, tout le bestiaire.').ok, 'S56 : demain mid-pack doit échouer');
  const spectator = {
    bridge: 'Visiteur au couloir.',
    companionLine: 'Je peux vous noter demain matin.',
    choices: [],
  };
  assert(
    exchangeCompanionLineProlepsisOk(spectator, 1, 3).ok,
    'S56 : demain visiteur mid-pack doit passer',
  );
}

// S48 geste vestimentaire incohérent
{
  assert(
    !packActFinaleNarrativeCoherenceOk(
      'Sous le verrou — elle lisse sa robe sur ta paume encore humide ; murmure : « Bien. »',
    ).ok,
    'S48 : robe sur paume doit échouer',
  );
  assert(
    packActFinaleNarrativeCoherenceOk(
      'Sous le verrou — elle remonte sa robe, essuie ta paume sur sa cuisse ; murmure : « Bien. »',
    ).ok,
    'S48 : gestes séparés doit passer',
  );
}

// S58 low tone
{
  assert(!intimateFinaleLowToneOk('Parfait. Comme il faut.').ok, 'S58 : victoire low doit échouer');
  assert(
    roundFinaleMatchesScore(
      { intimateFinaleLow: 'Regard sec : « Recommence. »' },
      0,
      { tier: 'low', text: 'Regard sec : « Recommence. »' },
      5,
    ).ok,
    'S58/WALK-LOW : score 0 + low doit passer',
  );
}

// FM2 anatomie — pas de fail FM1 sur texte identique
{
  const male = {
    meta: {
      affinity: 5,
      sessionPacks: [{ id: 'pack-1', exchangeIds: ['lyra-aff5-curated-01'] }],
    },
    exchanges: [
      {
        id: 'lyra-aff5-curated-01',
        bridge: 'À la bibliothèque, Lyra vient de tirer le verrou sur la porte du fond.',
        companionAction: 'Elle te plaque contre la table.',
        companionLine: 'Reste là.',
        choices: [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }],
      },
    ],
  };
  const female = {
    meta: { affinity: 5 },
    exchanges: [
      {
        id: 'lyra-aff5-curated-female-mc-01',
        bridge: 'À la bibliothèque, Lyra vient de tirer le verrou sur la porte du fond.',
        companionAction: 'Elle te plaque contre la table.',
        companionLine: 'Reste là.',
        choices: [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }],
      },
    ],
  };
  const failures = [];
  runFmcMirrorValidation(male, female, {
    fail: (code, message) => failures.push({ code, message }),
    warn: () => {},
  });
  assert(!failures.some((f) => f.code === 'FM1'), 'FM1 retiré : texte identique H/F ne doit plus échouer');
}

// FM-NQ5 — table pack-1 FMC
{
  const ex = {
    id: 'lyra-aff5-curated-female-mc-02',
    bridge: 'Bibliothèque — debout contre le mur.',
    companionAction: 'x',
    companionLine: 'l',
    choices: [{ tone: 'romantic', score: 3, text: 'x' }],
  };
  assert(!fmcPackBusinessRuleOk(ex).ok, 'FM-NQ5 : ex.02 FMC sans table doit échouer');
  const ok = {
    id: 'lyra-aff5-curated-female-mc-02',
    bridge: 'Lyra te tire sur la table de travail ; tu t\'assois au bord.',
    companionAction: 'Elle presse sa paume contre ta chatte.',
    companionLine: 'l',
    choices: [{ tone: 'romantic', score: 3, text: 'Je presse ma chatte contre sa paume.' }],
  };
  assert(fmcPackBusinessRuleOk(ok).ok, 'FM-NQ5 : ex.02 FMC table + chatte doit passer');
}

console.log('✓ validate-curated-parler-unit — 11 tests OK');
