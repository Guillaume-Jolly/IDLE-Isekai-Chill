/** Règles sémantiques partagées — corpus Parler curé. */

import {
  normalizeCorpusLine,
  normalizeDisplayText,
  stripSpeechGuillemets,
  companionActionIsThirdPerson,
  companionLineIsSpokenDialogue,
  exchangeSpectatorPresent,
} from './curated-parler-lib.mjs';

export { normalizeCorpusLine, normalizeDisplayText, stripSpeechGuillemets };

export const ANSWER_RULE_IDS = ['either-or', 'yes-no', 'imperative', 'report', 'open', 'action'];

/** Profil voix Lyra aff. 1 (miroir profiles.ts + rubrique F). */
export const LYRA_AFF1_VOICE = {
  forbidden: /\b(mon c[œoe]ur|ch[ée]ri|amour|bisou|embrasse|corps)\b/i,
  vouvoiement: /(?<!rendez-)\bvous\b/i,
  maxRomanticChoiceChars: 72,
  maxSubordinateClauses: 4,
};

/** Aff. 2 : même cadre, romantic un peu plus long autorisé. */
export const LYRA_AFF2_VOICE = {
  ...LYRA_AFF1_VOICE,
  maxRomanticChoiceChars: 78,
};

/** Aff. 3 : complicité — romantic tempéré, pas suggestif. */
export const LYRA_AFF3_VOICE = {
  ...LYRA_AFF2_VOICE,
  maxRomanticChoiceChars: 84,
};

/** Aff. 5 : registre adulte explicite — amour, corps, embrasser autorisés. */
export const LYRA_AFF5_VOICE = {
  forbidden: /\bbisou\b/i,
  vouvoiement: /(?<!rendez-)\bvous\b/i,
  maxRomanticChoiceChars: 96,
  maxSubordinateClauses: 5,
};

/** Aff. 4 : suggestif — peau, lit, baiser ; pas le registre cru aff. 5. */
export const LYRA_AFF4_VOICE = {
  forbidden: /\b(mon c[œoe]ur|chéri|bisou)\b/i,
  vouvoiement: /(?<!rendez-)\bvous\b/i,
  maxRomanticChoiceChars: 88,
  maxSubordinateClauses: 5,
};

export function getLyraVoiceProfile(affinity = 1) {
  if (affinity >= 5) return LYRA_AFF5_VOICE;
  if (affinity === 4) return LYRA_AFF4_VOICE;
  if (affinity === 3) return LYRA_AFF3_VOICE;
  if (affinity === 2) return LYRA_AFF2_VOICE;
  return LYRA_AFF1_VOICE;
}

/** Profil voix Parler curé — maeve/runa aff. 1–3 = cadre Lyra aff. 1–3 ; aff. 4–5 = Lyra aff. 4–5. */
export function getCompanionVoiceProfile(companionId = 'lyra', affinity = 1) {
  const id = String(companionId ?? 'lyra').toLowerCase();
  if (id === 'maeve' || id === 'runa') {
    if (affinity >= 5) return LYRA_AFF5_VOICE;
    if (affinity === 4) return LYRA_AFF4_VOICE;
    if (affinity === 3) return LYRA_AFF3_VOICE;
    if (affinity === 2) return LYRA_AFF2_VOICE;
    return LYRA_AFF1_VOICE;
  }
  return getLyraVoiceProfile(affinity);
}

export const FRENCH_LINT_PATTERNS = [
  { id: 'FR1', pattern: /\bune \w+ clair\b/i, hint: 'accord féminin (une … claire)' },
  { id: 'FR2', pattern: /\bdes \w+ clair\b/i, hint: 'accord pluriel (des … clairs)' },
  { id: 'FR3', pattern: /\bun \w+ heureux\b/i, hint: 'accord (une … heureuse)' },
  { id: 'FR4', pattern: /\bt'enroule de jambes\b/i, hint: 'préférer « enroule ses jambes autour de toi »' },
  { id: 'FR13', pattern: /\bque je [aeiouhâêéèëï]/i, hint: 'élision : que j\'… (ex. que j\'halète)' },
];

const LYRA_PACK4_THREADS = {
  1: {
    'lyra-aff1-curated-10': {
      label: 'réservation livre',
      pattern: /livre|flux de mana|demain matin|mets de côté/i,
    },
    'lyra-aff1-curated-11': {
      label: 'lecture lendemain',
      pattern: /livre|volume|flux de mana|comptoir|affluence|lire/i,
    },
    'lyra-aff1-curated-12': {
      label: 'mission mana',
      pattern: /mana|havre|note|demain matin|consigne/i,
    },
  },
  2: {
    'lyra-aff2-curated-10': {
      label: 'place gardée',
      pattern: /place|chapitre|lis ici|emporter|table du fond/i,
    },
    'lyra-aff2-curated-11': {
      label: 'lecture partagée',
      pattern: /page vingt|chapitre|auteur|mana|signet/i,
    },
    'lyra-aff2-curated-12': {
      label: 'mission chiffres',
      pattern: /fourneaux|chiffres|vendredi|registre|havre/i,
    },
  },
  // archivé 2.2.1 — lyra-aff3 hors build ; règles conservées pour relecture corpus archivé
  3: {
    'lyra-aff3-curated-10': {
      label: 'place gardée',
      pattern: /place|lampe|chapitre|lis ici|emporter|table du fond/i,
    },
    'lyra-aff3-curated-11': {
      label: 'même page',
      pattern: /même page|doigts|page vingt|chapitre|lampe/i,
    },
    'lyra-aff3-curated-12': {
      label: 'lampe qui faiblit',
      pattern: /lampe|faiblit|reste|moment|mèche|silhouettes/i,
    },
  },
  4: {
    'lyra-aff4-curated-10': {
      label: 'jardin aube',
      pattern: /jardin|aube|pavillon|cou|village/i,
    },
    'lyra-aff4-curated-11': {
      label: 'pavillon proche',
      pattern: /pavillon|jambe|serre|matelas|cou/i,
    },
    'lyra-aff4-curated-12': {
      label: 'rythme pavillon',
      pattern: /pavillon|rythme|embrasse|perds|suis|couverture/i,
    },
  },
  5: {
    'lyra-aff5-curated-10': {
      label: 'toit / aube',
      pattern: /toit|aube|couverture|village|nuit/i,
    },
    'lyra-aff5-curated-11': {
      label: 'chevauche toit',
      pattern: /toit|couverture|chevauche|enfourche|hanches/i,
    },
    'lyra-aff5-curated-12': {
      label: 'aube finale',
      pattern: /aube|toit|couverture|jouis|mène|deuxième/i,
    },
  },
};

const MAEVE_PACK4_THREADS = {
  1: {
    'maeve-aff1-curated-10': { label: 'crédit ouverture', pattern: /crédit|comptant|comptoir|registre/i },
    'maeve-aff1-curated-11': { label: 'crédit suite', pattern: /crédit|comptant|registre|comptoir/i },
    'maeve-aff1-curated-12': { label: 'deal crédit', pattern: /crédit|comptant|havre|deal|registre/i },
  },
  2: {
    'maeve-aff2-curated-10': { label: 'crédit informel', pattern: /crédit|comptoir|registre|faveur/i },
    'maeve-aff2-curated-11': { label: 'pari crédit', pattern: /crédit|pari|comptoir|registre/i },
    'maeve-aff2-curated-12': { label: 'crédit clôture', pattern: /crédit|comptant|havre|registre/i },
  },
  3: {
    'maeve-aff3-curated-10': { label: 'comptoir fermé', pattern: /comptoir|fermeture|crédit|registre/i },
    'maeve-aff3-curated-11': { label: 'confidence deal', pattern: /comptoir|crédit|registre|bouteille/i },
    'maeve-aff3-curated-12': { label: 'deal sans bourse', pattern: /crédit|comptoir|havre|deal|registre/i },
  },
  4: {
    'maeve-aff4-curated-10': { label: 'deux verres', pattern: /verre|comptoir|bouteille|marché/i },
    'maeve-aff4-curated-11': { label: 'main poignet', pattern: /poignet|comptoir|verre|main/i },
    'maeve-aff4-curated-12': { label: 'comptoir privé', pattern: /comptoir|verre|poignet|fermeture/i },
  },
  5: {
    'maeve-aff5-curated-10': { label: 'comptoir privé', pattern: /comptoir|crédit|nuit|registre/i },
    'maeve-aff5-curated-11': { label: 'nuit sans négocier', pattern: /comptoir|crédit|nuit|poignet/i },
    'maeve-aff5-curated-12': { label: 'deal final', pattern: /comptoir|crédit|nuit|havre|registre/i },
  },
};

const RUNA_PACK4_THREADS = {
  1: {
    'runa-aff1-curated-10': { label: 'commande commune', pattern: /commande|lingot|projet|mesure|forge/i },
    'runa-aff1-curated-11': { label: 'marque au fer', pattern: /marque|fer|lame|projet|forge/i },
    'runa-aff1-curated-12': { label: 'projet final', pattern: /lingot|projet|mesure|forge|havre/i },
  },
  2: {
    'runa-aff2-curated-10': { label: 'marque au fer', pattern: /marque|fer|mesure|forge/i },
    'runa-aff2-curated-11': { label: 'marque suite', pattern: /marque|mesure|enclume|forge/i },
    'runa-aff2-curated-12': { label: 'place marquée', pattern: /marque|place|forge|havre|mesure/i },
  },
  3: {
    'runa-aff3-curated-10': { label: 'projet commun', pattern: /projet|enclume|lingot|forge/i },
    'runa-aff3-curated-11': { label: 'confiance outil', pattern: /enclume|outil|lingot|mesure|forge/i },
    'runa-aff3-curated-12': { label: 'projet clôture', pattern: /projet|lingot|forge|havre|mesure/i },
  },
  4: {
    'runa-aff4-curated-10': { label: 'forge tard', pattern: /forge|enclume|lingot|mesure/i },
    'runa-aff4-curated-11': { label: 'dos-à-dos', pattern: /enclume|dos|acier|lingot|forge/i },
    'runa-aff4-curated-12': { label: 'proximité enclume', pattern: /enclume|forge|lingot|acier|mesure/i },
  },
  5: {
    'runa-aff5-curated-10': { label: 'forge arrêt', pattern: /enclume|forge|lingot|mesure/i },
    'runa-aff5-curated-11': { label: 'frappe finale', pattern: /frappe|enclume|forge|lingot/i },
    'runa-aff5-curated-12': { label: 'ne pars pas', pattern: /frappe|forge|enclume|lingot|havre/i },
  },
};

export const PACK4_THREADS = LYRA_PACK4_THREADS;

const PACK4_THREADS_BY_COMPANION = {
  lyra: LYRA_PACK4_THREADS,
  maeve: MAEVE_PACK4_THREADS,
  runa: RUNA_PACK4_THREADS,
};

const PACK4_HOOK_PATTERNS = {
  lyra: {
    1: /livre|flux de mana|volume/i,
    2: /chapitre|place|signet|lecture/i,
    3: /même page|doigts|lampe|chapitre|page vingt/i,
    4: /jardin|pavillon|matelas|embrasse|cou/i,
    5: /toit|couverture|aube|chevauche|enfourche/i,
  },
  maeve: {
    1: /crédit|comptant|registre|comptoir/i,
    2: /crédit|pari|comptoir|registre/i,
    3: /comptoir|crédit|registre|fermeture/i,
    4: /verre|comptoir|poignet|bouteille/i,
    5: /comptoir|crédit|nuit|registre/i,
  },
  runa: {
    1: /commande|lingot|enclume|forge|mesure/i,
    2: /marque|fer|forge|enclume|mesure/i,
    3: /projet|enclume|outil|forge|mesure/i,
    4: /forge tard|enclume|dos|acier|braise/i,
    5: /forge|enclume|frappe|braise|marteau/i,
  },
};

/** @deprecated Préférer getPack4Thread(companionId, affinity) */
export const PACK4_THREAD = LYRA_PACK4_THREADS[1];

export function getPack4Thread(companionId = 'lyra', affinity = 1) {
  const id = String(companionId ?? 'lyra').toLowerCase();
  const table = PACK4_THREADS_BY_COMPANION[id] ?? LYRA_PACK4_THREADS;
  return table[affinity] ?? table[1] ?? LYRA_PACK4_THREADS[1];
}

export function getPack4HookPattern(companionId = 'lyra', affinity = 1) {
  const id = String(companionId ?? 'lyra').toLowerCase();
  const table = PACK4_HOOK_PATTERNS[id] ?? PACK4_HOOK_PATTERNS.lyra;
  if (affinity >= 5) return table[5] ?? PACK4_HOOK_PATTERNS.lyra[5];
  if (affinity === 4) return table[4] ?? PACK4_HOOK_PATTERNS.lyra[4];
  if (affinity === 3) return table[3] ?? PACK4_HOOK_PATTERNS.lyra[3];
  if (affinity === 2) return table[2] ?? PACK4_HOOK_PATTERNS.lyra[2];
  return table[1] ?? PACK4_HOOK_PATTERNS.lyra[1];
}

export function curatedIdPrefix(companionId = 'lyra', affinity = 1) {
  const id = String(companionId ?? 'lyra').toLowerCase();
  return `${id}-aff${affinity}-curated-`;
}

const STOPWORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'à', 'au', 'en', 'et', 'ou', 'si', 'tu', 'je',
  'te', 'me', 'on', 'ce', 'c', 'est', 'pas', 'que', 'qui', 'pour', 'dans', 'sur', 'avec', 'ton', 'ta',
  'il', 'elle', 'n', 'y', 'a', 'l', 'd', 'm', 't', 's', 'j', 'ne', 'se', 'mon', 'ma', 'mes', 'toi',
  'lui', 'eux', 'plus', 'tout', 'tous', 'toute', 'toutes', 'comme', 'mais', 'donc', 'car', 'ni',
]);

export function tokenizeWords(text) {
  return normalizeDisplayText(text)
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export function tokenSet(text) {
  return new Set(tokenizeWords(text));
}

export function jaccardSimilarity(left, right) {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function exchangeFullText(exchange) {
  return [
    exchange.bridge,
    exchange.companionLine,
    ...exchange.choices.flatMap((choice) => [choice.text, choice.reaction]),
  ].join(' ');
}

export function choiceStarter(text) {
  const first = text.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  if (first.startsWith("j'")) return 'je';
  return first.replace(/[^a-zàâäéèêëïîôùûüç'-]/gi, '');
}

export function validateAnswerRule(exchange) {
  const rule = exchange.answerRule;
  if (!rule || !ANSWER_RULE_IDS.includes(rule)) {
    return { ok: false, reason: `answerRule manquant ou invalide (${rule ?? '∅'})` };
  }

  const line = exchange.companionLine.toLowerCase();
  const texts = exchange.choices.map((choice) => choice.text.toLowerCase());

  const branchOk = (text) =>
    /(^oui|^non|plutôt|^un peu|les deux|curiosité|peur|revanche|réfléchir|demander|bruit|couloir|lire|emporter|éviter|note|savais|chance|affluence|demain|silence|chapitre|fourneaux|bottes|coiffure|dettes|politesse|spectacles|vent|lampe|garde|ruines|myrion|thé|destin|hasard|message|messager|faits|mots|impression|d'accord|pourquoi|et si|écris|amusant)/.test(
      text,
    ) || text.length >= 12;

  switch (rule) {
    case 'either-or':
      if (!/, ou | ou tu | ou pas|curiosité, ou|savais, ou|lire ici, ou|emporter|revanche|réfléchir|bruit du couloir|éviter/.test(line)) {
        return { ok: false, reason: 'either-or : companionLine sans branche A/B détectable' };
      }
      if (!texts.every(branchOk)) {
        return { ok: false, reason: 'either-or : choix ne couvre pas les branches' };
      }
      return { ok: true };

    case 'yes-no':
      if (!/\?/.test(exchange.companionLine)) {
        return { ok: false, reason: 'yes-no : pas de ? dans companionLine' };
      }
      if (!texts.some((text) => /\b(oui|non)\b/.test(text))) {
        return { ok: false, reason: 'yes-no : aucun choix oui/non explicite' };
      }
      if (!texts.every((text) => text.length >= 12 || /\b(oui|non|peur|curiosité|crois|sais|remarqu|observ|vu)\b/.test(text))) {
        return { ok: false, reason: 'yes-no : choix trop courts ou hors sujet' };
      }
      return { ok: true };

    case 'imperative':
      if (!/\b(note|dis-le|laisse-moi|prends|avant que|finir|phrase)\b/i.test(exchange.companionLine)) {
        return { ok: false, reason: 'imperative : consigne impérative absente' };
      }
      if (!texts.every((text) => /d'accord|pourquoi|et si|je note|note|oui|non|prends|temps|écris|amusant|si tu|ligne|vois|imagine|promets|franc|urgent|mana|village|calme|voler|voir|monté|envie|phrase|page|important|hasard|destin|retenu|dérang|mains vides|chance|excuser/.test(text))) {
        return { ok: false, reason: 'imperative : choix ne répond pas à la consigne' };
      }
      return { ok: true };

    case 'report':
      if (!/mot pour mot|ce qu'elle t'a dit|dis-moi d'abord/.test(line)) {
        return { ok: false, reason: 'report : consigne de rapport absente' };
      }
      if (!texts.every((text) => /^qu'|^qu'|qu'elle|qu'il|elle |c'est|tout |mot |message|espérait|veut|doit|devait|préfère|sortie|délai|dette|confiance/.test(text))) {
        return { ok: false, reason: 'report : choix ne cite pas le message' };
      }
      return { ok: true };

    case 'open':
      if (!texts.every((text) => text.length >= 10)) {
        return { ok: false, reason: 'open : choix trop courts' };
      }
      return { ok: true };

    case 'action': {
      const action = exchange.companionAction?.trim() ?? '';
      const speech = exchange.companionLine.trim();
      if (/\?\s*$/.test(speech)) {
        return { ok: false, reason: 'action : companionLine ne doit pas finir par ?' };
      }
      if (!action || !companionActionIsThirdPerson(action)) {
        return { ok: false, reason: 'action : companionAction (3e personne) requis' };
      }
      if (speech.length < 8) {
        return { ok: false, reason: 'action : companionLine (réplique Lyra) trop courte' };
      }
      const spoken = companionLineIsSpokenDialogue(speech, 5, {
        visitorFacing: exchangeSpectatorPresent(exchange),
      });
      if (!spoken.ok) {
        return { ok: false, reason: `action : ${spoken.reason}` };
      }
      if (!texts.every((text) => /\b(je |j'|d'accord|lentement|stop|attends|te |tu |m'|t'|plutôt|et si|maintenant|allonge|monte|embrasse|touche|laisse|prends|serre|guide|retourne|passe|reste|viens|signale|tape|colle|rapproche|m'allonge|obéis|suiv|perds|resiste|cède|plaque|enfonce|gémis|obtempère)\b/.test(text) && text.length >= 10)) {
        return { ok: false, reason: 'action : choix doivent répondre par acte ou consigne' };
      }
      return { ok: true };
    }

    default:
      return { ok: false, reason: `règle inconnue : ${rule}` };
  }
}

export function checkEmotionReactionCoherence(choice, affinity = 1) {
  const stripped = stripSpeechGuillemets(choice.reaction).toLowerCase();
  const intimate = affinity >= 4;

  if (choice.score >= 3 && /^non\.|^faux|^recommence|^laisse-moi fermer sans merci/.test(stripped)) {
    return { ok: false, reason: 'score 3 avec réaction de rejet' };
  }

  if (intimate && choice.tone === 'romantic' && choice.score === 3) {
    if (/^non\.|^faux|^pas encore|^arrête|^stop/.test(stripped)) {
      return { ok: false, reason: 'romantic aff.5 accepté avec réaction de refus' };
    }
    return { ok: true };
  }

  if (choice.tone === 'romantic' && choice.score === 0) {
    if (
      !/non|pas[ .!]|rien |concentre|distraction|excuse|parchemin|lettres|faits|fermer|plus tard|le reste|simple|discours|utile|tendres|présence|moment|autre discussion|messager/.test(
        stripped,
      )
    ) {
      return { ok: false, reason: 'romantic repoussé sans marqueur de refus' };
    }
  }

  if (choice.emotion === 'annoyed' && choice.score <= 1 && /^merci|^bien\.|^exact|^d'accord/.test(stripped)) {
    return { ok: false, reason: 'annoyed + mauvais score mais réaction accueillante' };
  }

  if (choice.emotion === 'happy' && choice.score >= 2 && /^non\.|^faux|^alors tu n'avais rien/.test(stripped)) {
    return { ok: false, reason: 'happy avec réaction négative en tête' };
  }

  return { ok: true };
}

export function countSubordinateClauses(text) {
  const markers = text.match(/\b(parce que|si tu|quand tu|puisque|afin que|bien que|quoique|tandis que)\b/gi);
  return markers?.length ?? 0;
}
