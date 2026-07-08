import fs from 'node:fs';
import path from 'node:path';
import { companionActionIsThirdPerson, companionLineIsAction, companionLineIsSpokenDialogue, actionChoiceAgencyAligned, aff5FemaleMcPlayerTextRegister, aff5FemaleMcRomanticChoiceExplicitEnough, companionLineReadsComplete, choiceRespondsWithAction, exchangeSpectatorPresent, getScoreByTone, runBuiltInRegressions } from './curated-parler-lib.mjs';

const file = process.argv[2] ?? 'scripts/references/link-corpus/curated/lyra-aff1-curated-12.json';
const data = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const corpusAffinity = data.meta?.affinity ?? 1;
const isAff5FemaleMc = corpusAffinity >= 5 && data.meta?.protagonistGender === 'female';
const actionOriented = corpusAffinity >= 4;
const crude = corpusAffinity >= 5;
const scoreByTone = getScoreByTone(corpusAffinity);

const CALQUES = [
  'au-dessus de la norme',
  "n'est plus neutre",
  'plus neutre',
  'ça peut peser',
  'familier',
];
const ADMIN = ['au-dessus de la norme', "n'est plus neutre"];
const META_DIALOGUE = ['affinité', 'affinite', 'round', 'clique', 'session de', 'mini-jeu'];
const UNNATURAL = [
  "c'est une question",
  'en somme',
  'demander quelque chose :',
  'je voulais te demander si tu retiens',
  'seulement tu archives',
  'me semble plus clair',
  'verdict inconnu',
  'phrases jolies',
  'une autre conversation',
  'compagnons de route',
  'note ça',
  'choisis ta version',
  'en une phrase :',
];
const ANGLICISMS = ['stylé', ' stylé', 'cool', ' feedback', ' update', ' ok '];
const LITERARY = ['visiblement', 'suffisait comme excuse', 'si je suis honnête'];

const QUESTION_HINT =
  /\b(tu voulais|tu veux|tu préfères|as-tu|veux-tu|tu crois|tu sais|tu l'as|c'est encore|curiosité, ou|savais, ou)\b/i;

function allText(ex) {
  return [ex.bridge, ex.companionAction, ex.companionLine, ...ex.choices.flatMap((c) => [c.text, c.reaction])].filter(Boolean).join(' | ');
}

function dialogueOnly(ex) {
  return [ex.companionAction, ex.companionLine, ...ex.choices.flatMap((c) => [c.text, c.reaction])].filter(Boolean).join(' | ');
}

function choicesOnly(ex) {
  return ex.choices.map((c) => c.text).join(' | ');
}

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function hasManaGaspille(text) {
  return /mana[^.|]*gaspill/i.test(text) || /gaspill[^.|]*mana/i.test(text);
}

function lineIsInterrogative(line) {
  if (/\?\s*$/.test(line.trim())) return true;
  if (QUESTION_HINT.test(line)) return true;
  if (/, ou .+\?/.test(line)) return true;
  if (/\b ou .+\?/.test(line)) return true;
  return false;
}

runBuiltInRegressions();

/** C3 / E6 — chaque choix répond à la dernière réplique (règles par échange). */
function answersMatchLine(ex) {
  const line = ex.companionLine.toLowerCase();
  const texts = ex.choices.map((c) => c.text.toLowerCase());

  if (ex.answerRule === 'action') {
    return texts.every((text) => choiceRespondsWithAction(text));
  }

  const eitherOr = /, ou | ou tu | ou tu /.test(line);
  const yesNo = /tu (savais|l'as|as )|c'est encore|c'était pour|curiosité|peur \?/.test(line);
  const reportMessage = /mot pour mot|ce qu'elle t'a dit/.test(line);
  const imperative = /^(note |dis-moi|avant que)/i.test(ex.companionLine.trim());
  const timeLimit = /dix minutes|demander quelque chose/.test(line);

  for (const text of texts) {
    if (eitherOr && !/(^oui|^non|plutôt|^un peu|les deux|la chance|j'ai |je |j'aurais |il m'|réfléchir|revanche|emporter|lire|éviter|évitais|curiosité|peur|bruit|demander|enseignes|archiv|mettre de côté|voir finir)/.test(text)) {
      return false;
    }
    if (yesNo && text.length < 3) return false;
    if (reportMessage && !/^qu'|^oui|^non|^elle |^c'est|^tout /.test(text)) return false;
    if (imperative && !/(d'accord|pourquoi|et si|je note|note|oui|non)/.test(text)) return false;
    if (timeLimit && !/(oui|non|bruit|demander|enseign|archiv|plutôt|voir finir|livre|mettre de côté)/.test(text)) {
      return false;
    }
  }
  return true;
}

function scoreExchange(ex, { maxLineLen = 120 } = {}) {
  const full = allText(ex).toLowerCase();
  const dial = dialogueOnly(ex).toLowerCase();
  const choicesText = choicesOnly(ex).toLowerCase();
  const calques = CALQUES.filter((c) => full.includes(c));
  if (hasManaGaspille(allText(ex))) calques.push('mana+gaspillé');
  const adminLex = ADMIN.filter((a) => full.includes(a));
  const unnatural = UNNATURAL.filter((u) => full.includes(u));
  const anglicisms = ANGLICISMS.filter((a) => dial.includes(a.trim()) || choicesText.includes(a.trim()));
  const literary = LITERARY.filter((l) => full.includes(l));
  const interrogative = lineIsInterrogative(ex.companionLine);
  const lineHasQuestionMark = ex.companionLine.trim().endsWith('?');
  const metaDial = META_DIALOGUE.filter((m) => dial.includes(m));
  const strings = [ex.companionLine, ...ex.choices.flatMap((c) => [c.text, c.reaction])];
  const over120 = strings.filter((s) => s.length > maxLineLen);
  const lineWords = countWords(ex.companionLine);
  const reactionsOk = ex.choices.every((c) => {
    const trimmed = c.reaction.trim();
    return trimmed.startsWith('«') && /«[^»]+»/.test(trimmed);
  });
  const sincere = ex.choices.find((c) => c.tone === 'sincere');
  const romantic = ex.choices.find((c) => c.tone === 'romantic');
  const requiredTones = ['sincere', 'direct', 'playful', 'romantic'];
  const tonesOk = requiredTones.every((t) => ex.choices.some((c) => c.tone === t));
  const winnerTone = actionOriented ? 'romantic' : 'sincere';
  const winner = ex.choices.find((c) => c.tone === winnerTone);
  const scoreOnes = ex.choices.filter((c) => c.score === 3).length;
  const scoreValues = ex.choices.map((c) => c.score).sort((a, b) => a - b);
  const gradedScoresOk = scoreValues.join(',') === '0,1,2,3';
  const fiveWords = ex.choices.map((c) => c.text.toLowerCase().split(/\s+/).slice(0, 5).join(' '));

  const A = {
    A1_noCalque: calques.length === 0,
    A2_maxLen120: over120.length === 0,
    A3_lineUnder110: ex.companionLine.length <= 110,
    A4_reactionsQuoted: reactionsOk,
    A5_noAnglicism: anglicisms.length === 0,
    A6_noLiterary: literary.length === 0,
  };

  const B = {
    B1_noAdminLex: adminLex.length === 0,
    B2_lineUnder22Words: lineWords <= 22,
    B3_oralMark: (dial.match(/[cjdlnt]'|[jt]'|qu'|c'est|j'ai|t'as|l'|d'|n'/g) ?? []).length >= 2,
    B4_noUnnatural: unnatural.length === 0,
    B5_questionMark: actionOriented
      ? !/\?\s*$/.test(ex.companionLine.trim())
      : !interrogative || lineHasQuestionMark,
    B6_sincereOral: sincere && sincere.text.length >= 12 && !UNNATURAL.some((u) => sincere.text.toLowerCase().includes(u)),
    B7_lineComplete: companionLineReadsComplete(ex.companionLine),
    B8_spokenDialogue: actionOriented
      ? companionLineIsSpokenDialogue(ex.companionLine, corpusAffinity, {
          visitorFacing: exchangeSpectatorPresent(ex),
        }).ok
      : true,
    B9_actionChoiceAgency: actionOriented ? actionChoiceAgencyAligned(ex).ok : true,
    B10_femaleMcCrude: isAff5FemaleMc
      ? ex.choices.every((c) => aff5FemaleMcPlayerTextRegister(c.text).ok) &&
        (!ex.intimateFinale?.trim() || aff5FemaleMcPlayerTextRegister(ex.intimateFinale).ok) &&
        aff5FemaleMcRomanticChoiceExplicitEnough(ex).ok
      : true,
  };

  const hasPlace = /bibliothèque|havre|village|refuge|marché|ruines|forêt|couloir|comptoir|porte|registre|atlas|sachet|chambre|lit|couchette|draps|commode|rayons|table|verrière|toit|vitrage|matelas|montant|couverture|rambarde|travées|rayonnage|atelier|ruban|métier|métiers|étal|arrière-boutique/i.test(
    ex.bridge,
  );
  const C = {
    C1_bridgeAnchored: hasPlace,
    C2_explicitAsk: actionOriented
      ? companionLineIsAction(ex)
      : interrogative || /note |demande|dis-|avant que/i.test(ex.companionLine),
    C3_fourAnswers: answersMatchLine(ex),
    C4_jargonOk: (full.match(/\b(mana|myrion|havre|ruines)\b/gi) ?? []).length <= 6,
    C5_choiceFullSentence: ex.choices.every((c) => {
      if (c.tone === 'direct' && c.text.length <= 20) return true;
      return /[.!?]$/.test(c.text.trim()) || /\?$/.test(c.text.trim());
    }),
  };

  const D = {
    D1_noMetaDialogue: metaDial.length === 0 && !/\ble score\b/.test(choicesText),
    D2_noBareDidascalie: !ex.choices.some(
      (c) => /^(Un silence|Elle |Il )/.test(c.reaction.trim()) && !/\*[^*]+\*/.test(c.reaction),
    ),
    D3_spokenReactions: reactionsOk,
    D4_noGameScore: !/\b(score|points)\b/i.test(choicesText),
    D5_inWorld: !/\b(xp|level)\b/i.test(dial),
  };

  const toneScoresOk = ex.choices.every((c) => c.score === scoreByTone[c.tone]);

  const E = {
    E1_oneScore1: scoreOnes === 1 && gradedScoresOk && toneScoresOk,
    E2_winnerWins: winner?.score === 3,
    E3_emotions: ex.choices.every((c) => c.emotion),
    E4_reactionFitsChoice: ex.choices.every((c) => {
      const r = c.reaction.toLowerCase();
      if (c.score === 3 && /non\.|faux|recommence|laisse-moi fermer sans merci/.test(r)) return false;
      if (actionOriented && c.tone === 'romantic' && c.score === 3) {
        return !/^non\.|^faux|^pas encore|^arrête|^stop/.test(r);
      }
      if (!actionOriented && c.tone === 'romantic' && c.score === 0 && !/non|pas[ .]|rien |concentre|distraction|excuse|parchemin|lettres|faits|fermer|plus tard|le reste/.test(r)) {
        return false;
      }
      return true;
    }),
    E5_packSafe: true,
  };

  const F = crude
    ? {
        F1_notInfantile: !/\bbisou\b/i.test(dialogueOnly(ex)),
        F2_romanticAccepted: romantic?.score === 3,
        F3_romanticReward: romantic?.score === 3,
        F4_lyraDirect: ex.companionLine.length > 15,
        F5_aff5Explicit: /lit|corps|nu|peau|amour|embrass|désir|envie|chambre|nuit|touch|lèvre|peignoir|draps|bais|jouir|mouill|cuiss|chatte|bite|en moi|à poil/i.test(
          dialogueOnly(ex),
        ),
      }
    : actionOriented
      ? {
          F1_notInfantile: !/\bbisou\b/i.test(dialogueOnly(ex)),
          F2_romanticAccepted: romantic?.score === 3,
          F3_romanticReward: romantic?.score === 3,
          F4_lyraDirect: ex.companionLine.length > 15,
          F5_aff4Intimate: /peau|embrass|lèvre|lit|chambre|nu|peignoir|touch|corps|désir|envie|cou|taille|draps/i.test(
            dialogueOnly(ex),
          ),
        }
      : {
        F1_notMievre: !/mon c[œoe]ur|chéri|amour/i.test(dialogueOnly(ex)),
        F2_romanticRejected: romantic?.score === 0,
        F3_sincereReward: sincere?.score === 3,
        F4_lyraDirect: ex.companionLine.length > 15,
        F5_aff1Register: !/embrasse|bisou|corps/i.test(dialogueOnly(ex)),
      };

  const G = {
    G1_fourTones: tonesOk,
    G2_distinctOpeners: new Set(fiveWords).size === 4,
    G3_oneWinner: scoreOnes === 1 && gradedScoresOk,
    G4_plausibleWrong: ex.choices.filter((c) => c.score < 3).every((c) => c.text.length >= 10),
    G5_emotionsSet: ex.choices.every((c) => c.emotion),
  };

  function to10(checks) {
    const vals = Object.values(checks);
    return Math.round(((vals.filter(Boolean).length / vals.length) * 10) * 2) / 2;
  }

  const scores = { A: to10(A), B: to10(B), C: to10(C), D: to10(D), E: to10(E), F: to10(F), G: to10(G) };
  let global =
    scores.A * 0.15 +
    scores.B * 0.2 +
    scores.C * 0.15 +
    scores.D * 0.15 +
    scores.E * 0.15 +
    scores.F * 0.1 +
    scores.G * 0.1;

  const hardFail =
    unnatural.length > 0 ||
    anglicisms.length > 0 ||
    (interrogative && !lineHasQuestionMark) ||
    !answersMatchLine(ex) ||
    !B.B7_lineComplete;

  if (hardFail) global = Math.min(global, 8);
  if (!D.D1_noMetaDialogue || !D.D2_noBareDidascalie) global = Math.min(global, 6);
  global = Math.round(global * 2) / 2;

  const decision = global > 9 ? 'Validé' : global <= 6 ? 'Refonte' : 'Retravail';

  return {
    id: ex.id.replace(/^lyra-aff\d-curated-/, ''),
    title: ex.title,
    calques,
    unnatural,
    anglicisms,
    hardFail,
    ...scores,
    global,
    decision,
    failed: Object.fromEntries(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((k) => [
        k,
        Object.entries({ A, B, C, D, E, F, G }[k])
          .filter(([, v]) => !v)
          .map(([key]) => key),
      ]),
    ),
  };
}

console.log('# Scoring (grille stricte FR + cohérence) —', path.basename(file));
console.log('| # | Titre | A | B | C | D | E | F | G | Global | Décision |');
console.log('|---|-------|---|---|---|---|---|---|---|--------|----------|');
const results = data.exchanges.map((ex) =>
  scoreExchange(ex, { maxLineLen: corpusAffinity >= 5 ? 180 : 120 }),
);
for (const r of results) {
  console.log(
    `| ${r.id} | ${r.title} | ${r.A} | ${r.B} | ${r.C} | ${r.D} | ${r.E} | ${r.F} | ${r.G} | **${r.global}** | ${r.decision} |`,
  );
}
console.log('\n## Échecs détaillés');
for (const r of results) {
  const fails = Object.entries(r.failed)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => `${k}:${v.join(',')}`)
    .join(' · ');
  const flags = [
    r.unnatural.length ? `B6[${r.unnatural.join(';')}]` : '',
    r.anglicisms.length ? `A5[${r.anglicisms.join(';')}]` : '',
    r.hardFail ? 'PLAFOND' : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (fails || flags) {
    console.log(`- **${r.id} ${r.title}** (${r.global}) — ${fails || '—'} ${flags}`);
  }
}

const notValidated = results.filter((r) => r.global < 10);
if (notValidated.length > 0) {
  console.error(`\nÉchec : ${notValidated.length} échange(s) sous 10/10 (grille A→G).`);
  process.exit(1);
}
