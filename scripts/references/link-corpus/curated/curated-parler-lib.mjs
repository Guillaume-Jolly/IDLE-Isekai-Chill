/** Utilitaires partagés — validation corpus Parler curé (miroir runtime TS). */

/** Aff. 1–2 : sincere gagne ; romantic repoussé. */
export const SCORE_BY_TONE_AFF1 = {
  sincere: 3,
  direct: 2,
  playful: 1,
  romantic: 0,
};

/** Aff. 4 : suggestif — romantic gagne, sans registre cru aff. 5. */
export const SCORE_BY_TONE_AFF4 = {
  romantic: 3,
  sincere: 2,
  direct: 1,
  playful: 0,
};

/** Aff. 5 : romantic explicite gagne ; playful casse l'ambiance. */
export const SCORE_BY_TONE_AFF5 = {
  romantic: 3,
  sincere: 2,
  direct: 1,
  playful: 0,
};

/** @deprecated Préférer getScoreByTone(affinity) */
export const SCORE_BY_TONE = SCORE_BY_TONE_AFF1;

export function getScoreByTone(affinity = 1) {
  if (affinity >= 5) return SCORE_BY_TONE_AFF5;
  if (affinity >= 4) return SCORE_BY_TONE_AFF4;
  return SCORE_BY_TONE_AFF1;
}

export function isActionOrientedAffinity(affinity = 1) {
  return affinity >= 4;
}

export function isCrudeRegisterAffinity(affinity = 1) {
  return affinity >= 5;
}

/** Pack 5 bibliothèque — Lyra parle au visiteur/apprenti, pas au MC (échanges comptoir). */
export const SPECTATOR_PRESENT_TITLES = new Set([
  'Pas de pas',
  'Tiroir secret',
  'Sans prévenir',
  'Voix posée',
  'Deux doigts',
  'Deux allées plus loin',
  'Plume immobile',
]);

export function exchangeSpectatorPresent(exchange) {
  if (SPECTATOR_PRESENT_TITLES.has(exchange.title?.trim())) return true;
  const blob = [exchange.bridge, exchange.companionAction].filter(Boolean).join(' ');
  return /\b(visiteur|apprenti|quelqu'un tourne des pages)\b/i.test(blob);
}

/** Réplique Lyra face au public (vouvoiement / registre comptoir). */
export const SPOKEN_VISITOR_FACING_PATTERN =
  /\b(je vous|vous |remarquez|entrez|asseyez|bonjour|monsieur|madame|instant|réserve|gravure|registre|figurent|colonne|filigrane|amendes|tarifs|demain matin|je peux vous|je suis la bibliothécaire|je note|je consulte|je finis)\b/i;

/** Dynamique de pouvoir — par échange ou défaut compagnon. */
export const POWER_DYNAMIC_IDS = [
  'companion_dominant',
  'companion_invites',
  'mutual',
  'protagonist_invited',
];

/** Choix MC qui reprend le dessus (pénétration / prise) — incohérent si companion_dominant. */
export const MC_DOMINATES_CHOICE =
  /\b(je l'enfonce|je la baise|je la prends fort|je retourne et je l'enfonce|je la retourne et je la prends|je la bascule sur le ventre et je la prends|Je l'enfonce fort|je l'inverse sur le dos et je la baise)\b/i;

/** Choix MC qui cède / suit / laisse mener. */
export const MC_SUBMITS_CHOICE =
  /\b(je la laisse|je cède|je suis (?:le |son |ses |la pression)|je reste (?:contre|immobile|allong|près)|immobile sous|sous son poids|sous elle|m'allonge immobile|sans reprendre|quand elle (?:serre|me le demande|accélère)|j'attends qu'elle|attends qu'elle|jouis (?:seulement )?quand|je bloque sa taille et je la laisse|je me cambre contre|contre sa (?:main|paume)|je la laisse monter|je la laisse frotter|je la laisse guider|je la laisse enfoncer|dès qu'elle (?:serre|me le signale)|agrippe ses hanches et je la laisse|bouche scellée|retenant ma respiration|au rythme de sa|sans couper sa|sans quitter la cadence|je m'arrête|j'arrête net|je ralentis dès|pages qui crissent|rythme lent)\b/i;

/** Comptoir + spectateur — le MC stimule Lyra sous consigne silencieuse. */
export const MC_COUNTER_STIMULATES_CHOICE =
  /\b(je (?:caresse|pousse|glisse|enfonce|avance|presse|repousse|tapote|feins)|doigts sur son|gode en elle|gode plus|un doigt en son|sur le manche|sous le bois|sans prévenir)\b/i;

/** Choix MC actif sur consigne companion_invites (goûter, baiser, commencer…). */
export const MC_ACTS_ON_INVITE_CHOICE =
  /\b(je (?:la |l'|m'|me )?(?:baise|goûte|goûter|léche|lèche|tire|presse|enfonce|pousse|encule|commence|jette|retire|touche|embrasse|serre|rapproche|allonge|m'allonge|frotte|glisse|plaque)|agenouille|bouche entre|doigts|chatte|cuisses|chemise|peau nue)\b/i;

export function inferPowerDynamic(exchange) {
  const tagged = exchange.powerDynamic?.trim();
  if (tagged && POWER_DYNAMIC_IDS.includes(tagged)) return tagged;
  const line = [exchange.companionLine, exchange.companionAction].filter(Boolean).join(' ');
  if (/\b(je mène|laisse-moi mener|tais-toi|ne me retourne|jouis quand je te le dis|ne bouge pas|bouge contre ma main quand)\b/i.test(line)) {
    return 'companion_dominant';
  }
  if (/\b(commence|goûte|en moi|baise-moi|enlève|nu\.|entre|touche|assieds-toi|rapproche)\b/i.test(line)) {
    return 'companion_invites';
  }
  if (/\b(je t'attends|attends|lentement|signale)\b/i.test(line)) {
    return 'protagonist_invited';
  }
  return 'mutual';
}

export function powerDynamicFieldValid(powerDynamic) {
  if (!powerDynamic?.trim()) {
    return { ok: false, reason: 'powerDynamic manquant' };
  }
  if (!POWER_DYNAMIC_IDS.includes(powerDynamic)) {
    return { ok: false, reason: `powerDynamic invalide « ${powerDynamic} »` };
  }
  return { ok: true };
}

export function powerDynamicChoiceAligned(exchange) {
  const dynamic = inferPowerDynamic(exchange);
  const topChoice = exchange.choices?.find((choice) => choice.score === 3)?.text ?? '';
  if (!topChoice.trim()) return { ok: true };

  if (exchangeSpectatorPresent(exchange) && MC_COUNTER_STIMULATES_CHOICE.test(topChoice)) {
    return { ok: true };
  }

  if (dynamic === 'companion_dominant') {
    if (MC_DOMINATES_CHOICE.test(topChoice) && !MC_SUBMITS_CHOICE.test(topChoice)) {
      return {
        ok: false,
        reason:
          'choix +3 incohérent avec companion_dominant — le MC ne doit pas « prendre » ou pénétrer ; céder / suivre / la laisser mener',
      };
    }
    if (!MC_SUBMITS_CHOICE.test(topChoice)) {
      return {
        ok: false,
        reason:
          'choix +3 attendu : céder, suivre le rythme ou la laisser mener (companion_dominant)',
      };
    }
  }

  if (dynamic === 'companion_invites') {
    if (MC_DOMINATES_CHOICE.test(topChoice) && !MC_ACTS_ON_INVITE_CHOICE.test(topChoice)) {
      return {
        ok: false,
        reason:
          'choix +3 sur companion_invites — agir sur consigne (goûter, baiser, commencer), pas reprendre le contrôle arbitrairement',
      };
    }
    if (!MC_ACTS_ON_INVITE_CHOICE.test(topChoice)) {
      return {
        ok: false,
        reason:
          'choix +3 sur companion_invites — verbe d\'action MC attendu (répondre à la consigne)',
      };
    }
  }

  if (dynamic === 'protagonist_invited') {
    if (MC_SUBMITS_CHOICE.test(topChoice) && !MC_ACTS_ON_INVITE_CHOICE.test(topChoice)) {
      return {
        ok: false,
        reason:
          'choix +3 sur protagonist_invited — le MC peut prendre l\'initiative, pas seulement attendre',
      };
    }
  }

  return { ok: true };
}

/** Registre cru réservé à l'aff. 5 — interdit en aff. 4 (suggestif). */
export const AFF4_CRUDE_MC_TERMS =
  /\b(je la baise|baise-moi|chatte|clito|jouis|jouir|à poil|enfourche|pénètre|enfonce en elle|lécher la chatte)\b/i;

export function aff4SuggestiveMcChoiceOk(text = '', fieldLabel = 'texte MC') {
  if (AFF4_CRUDE_MC_TERMS.test(text)) {
    return {
      ok: false,
      reason: `${fieldLabel} trop explicite pour aff. 4 suggestif — garder le registre aff. 5 pour aff. ≥5`,
    };
  }
  return { ok: true };
}

/** Verbe d'action Lyra — 1re personne (legacy) ou réplique directe. */
export const ACTION_LINE_PATTERN =
  /\b(viens|monte|allonge|reste|ferme|ouvre|touche|mets|laisse|passe|approche|tire|pousse|glisse|enlève|baisse|presse|serre|écoute|regarde|prends|note|dis-|avant que|ne bouge|tape mon|ralentis|suis mon|j'ouvre|j'écarte|j'enlève|j'te |je te |je t'|je glisse|je pose|je tire|je pousse|je serre|je monte|je ferme|je laisse|je descends|je mets|je rapproche|je plie|je t'allonge|je t'attire|je t'embrasse|je te |je guide|je ferme|je pousse|je chevauche|je t'attire|je t'enfonces|je te baise|je guide)\b/i;

/** Narration 3e personne — ce que Lyra fait au MC (aff. 4+ format action). */
export const THIRD_PERSON_ACTION_PATTERN =
  /\b(elle |lyra )?(t'|te |ton |ta |tes |toi\b|t'allonge|t'attire|t'embrasse|t'enfonce|t'enfourche|t'allonge|te plaque|te pousse|te retourne|te guide|te tire|te baise|s'assoit|s'allonge|s'écarte|s'enfonce|se frott|monte sur|descend|glisse|presse|serre|enlève|écarte|jette|claque|arrache|chevauche|enfourche|mord|guide)\b/i;

export function companionActionIsThirdPerson(action = '') {
  const trimmed = action.trim();
  if (!trimmed) return false;
  return THIRD_PERSON_ACTION_PATTERN.test(trimmed);
}

/** Didascalie / régie — « Fort. Sans parler. » sans sujet parlé. */
export const UNNATURAL_LINE_OPENER =
  /^(fort|lent|vite|dur|doux|plus fort|sans parler)\.\s/i;

/** Lyra touche ou mène sur le MC (doigts, bouche, frottement…) — le +3 ne doit pas « prendre » Lyra. */
export const LYRA_LEADS_ON_MC_ACTION =
  /doigts entre tes cuisses|presse ses doigts contre|s'agenouille entre tes|glisse ses doigts en toi|bouche sur ta nuque,\s*doigts|frottant sa chatte contre la tienne|presse ta main contre sa chatte|presse ses doigts contre ta chatte|te goûter|lèvres entre tes cuisses/i;

/** Choix MC actif sur Lyra (pénétration / prise) — incohérent si Lyra mène déjà sur le MC. */
export const MC_INITIATES_ON_LYRA_CHOICE =
  /\b(je la prends fort|je la prends maintenant|je l'enfonce fort|je la baise jusqu'|je la retourne et je la prends|Je l'enfonce fort)\b/i;

const SPOKEN_SUBJECT_PATTERN =
  /\b(je |j'|tu |toi\b|tais|mène|moi\b|viens|reste|garde|laisse|dis|commence|bouge|enlève|ferme|ouvre|tape|signale|goûte|embrasse|touche|presse|suis|jouis)\b/i;

export function companionLineLooksLikeThirdPersonNarration(line = '') {
  const trimmed = line.trim();
  if (/^(elle |lyra )/i.test(trimmed)) return true;
  return /\b(elle t'|elle te |elle glisse|elle serre|elle monte|elle s'assoit|elle s'allonge)\b/i.test(
    trimmed,
  );
}

export function companionLineIsSpokenDialogue(line = '', affinity = 1, options = {}) {
  const trimmed = line.trim();
  const visitorFacing = options.visitorFacing === true;
  if (!trimmed) return { ok: false, reason: 'companionLine vide' };
  if (companionLineLooksLikeThirdPersonNarration(trimmed)) {
    return { ok: false, reason: 'companionLine ressemble à une narration 3e personne (utiliser companionAction)' };
  }
  if (UNNATURAL_LINE_OPENER.test(trimmed)) {
    return {
      ok: false,
      reason: 'ouverte par adverbe/régie seule (« Fort. »…) — réplique parlée avec je/tu attendue',
    };
  }
  if (
    isActionOrientedAffinity(affinity) &&
    !SPOKEN_SUBJECT_PATTERN.test(trimmed) &&
    !(visitorFacing && SPOKEN_VISITOR_FACING_PATTERN.test(trimmed))
  ) {
    return {
      ok: false,
      reason: 'companionLine aff. 4+ sans sujet parlé (je/tu/imperatif) — trop télégraphique ou didascalie',
    };
  }
  if (isActionOrientedAffinity(affinity)) {
    for (const part of trimmed.split(/\.\s+/).filter(Boolean)) {
      const word = part.replace(/\.$/, '').trim().split(/\s+/)[0] ?? '';
      if (/^(fort|lent|vite|dur|doux|sans parler)$/i.test(word)) {
        return { ok: false, reason: `fragment de régie « ${part.trim()} » dans companionLine` };
      }
    }
  }
  return { ok: true };
}

export function actionChoiceAgencyAligned(exchange) {
  const action = exchange.companionAction ?? '';
  const topChoice = exchange.choices.find((choice) => choice.score === 3)?.text ?? '';
  if (!action.trim() || !topChoice) return { ok: true };
  if (LYRA_LEADS_ON_MC_ACTION.test(action) && MC_INITIATES_ON_LYRA_CHOICE.test(topChoice)) {
    return {
      ok: false,
      reason:
        'companionAction = Lyra touche/mène le MC ; choix +3 décrit le MC pénétrant ou « prenant » Lyra',
    };
  }
  return { ok: true };
}

/** Lyra retire un vêtement du MC dans companionAction — les choix ne peuvent pas le « garder » ou le « retirer ». */
export const WARDROBE_STRIP_RULES = [
  {
    id: 'culotte_arrachee',
    strip: /\barrache ta culotte\b/i,
    conflict: /\b(garde ma culotte|retire ma culotte|enlève ma culotte|jette ma culotte|glisse ma culotte)\b/i,
  },
  {
    id: 'robe_arrachee',
    strip: /\barrache ta robe\b/i,
    conflict: /\b(garde ma robe|retire ma robe|enlève ma robe|jette ma robe|glisse ma robe)\b/i,
  },
  {
    id: 'chemise_arrachee',
    strip: /\barrache ta chemise\b/i,
    conflict: /\b(garde ma chemise|retire ma chemise|enlève ma chemise|jette ma chemise)\b/i,
  },
  {
    id: 'chemise_arrachee_couches',
    strip: /\barrache ta chemise\b/i,
    conflict: /\bcouche par couche\b/i,
  },
];

/** Couches vestiaires — Lyra arrache le dessus, le MC retire le dessous (aff. 5). */
export const WARDROBE_LAYER_PAIRS = [
  {
    strip: /\barrache ta robe\b/i,
    mcRemoves: /\b(culotte|string|slip|jette ma culotte|glisse ma culotte|jette ma string|glisse ma string|jette mon slip|glisse mon slip)\b/i,
    label: 'robe / dessous',
  },
  {
    strip: /\barrache ta chemise\b/i,
    mcRemoves: /\b(pantalon|caleçon|jette mon pantalon|descends mon pantalon|baisse mon pantalon)\b/i,
    label: 'chemise / pantalon',
  },
];

export function companionActionWardrobeLayerOk(companionAction = '') {
  if (/\barrache ta culotte\b/i.test(companionAction)) {
    return {
      ok: false,
      reason:
        'companionAction — Lyra arrache le dessus (robe/chemise) ; le MC retire culotte/pantalon ensuite',
    };
  }
  return { ok: true };
}

export function actionChoiceWardrobeLayerOk(exchange) {
  const action = exchange.companionAction ?? '';
  const actionLayer = companionActionWardrobeLayerOk(action);
  if (!actionLayer.ok) return actionLayer;

  for (const { strip, mcRemoves, label } of WARDROBE_LAYER_PAIRS) {
    if (!strip.test(action)) continue;
    const romantic = exchange.choices?.find((c) => c.score === 3)?.text ?? '';
    if (romantic && !mcRemoves.test(romantic)) {
      return {
        ok: false,
        reason: `choix +3 incohérent (${label}) — MC retire la couche restante, pas celle que Lyra vient d'arracher`,
      };
    }
  }
  return { ok: true };
}

export function actionChoiceWardrobeAligned(exchange) {
  const action = exchange.companionAction ?? '';
  if (!action.trim()) return { ok: true };
  for (const choice of exchange.choices ?? []) {
    for (const { id, strip, conflict } of WARDROBE_STRIP_RULES) {
      if (strip.test(action) && conflict.test(choice.text)) {
        return {
          ok: false,
          reason: `choix ${choice.tone} incohérent avec companionAction (${id}) — vêtement déjà retiré par Lyra`,
        };
      }
    }
  }
  return { ok: true };
}

/** Termes source de confusion — relecture automatique (S38). */
export const CORPUS_LEXICON_ISSUES = [
  {
    id: 'L1',
    pattern: /\bclaire-voie\b/i,
    hint: 'terme obscure (confondu avec « haute-voix ») — préférer « lit clos » ou « volets du lit »',
  },
  {
    id: 'L2',
    pattern: /\bsent le thé et la peau\b/i,
    hint: 'calque sensoriel — « sent le thé ; une tension électrique flotte dans l\'air »',
  },
  {
    id: 'L5',
    pattern: /\b(chaleur de peau|mêle thé et chaleur|chaleur du corps)\b/i,
    hint: 'calque / canal sensoriel faux — on ne sent pas la chaleur du corps ; tension électrique, air chargé',
  },
  {
    id: 'L6',
    pattern: /\bsent\b[^.]{0,100}\bchaleur\b/i,
    hint: 'odorat (sent) + chaleur dans la même phrase — séparer odeur et atmosphère (« sent le thé ; tension électrique »)',
  },
  {
    id: 'L3',
    pattern: /\benlève le tissu\b/i,
    hint: 'registre administratif — « Enlève ta chemise » / « Jette ta chemise »',
  },
  {
    id: 'L4',
    pattern: /\bcomme si la bibliothèque venait de se refermer\b/i,
    hint: 'métaphore peu claire — « le reste du monde semble s\'effacer » ou « comme si le bruit s\'était tu »',
  },
];

export function corpusLexiconOk(exchange) {
  const blob = [exchange.bridge, exchange.companionAction, exchange.companionLine, exchange.intimateFinale]
    .filter(Boolean)
    .join(' ');
  for (const { id, pattern, hint } of CORPUS_LEXICON_ISSUES) {
    if (pattern.test(blob)) {
      return { ok: false, reason: `${id} : ${hint}` };
    }
  }
  return { ok: true };
}

/** S36 — companionAction pose déjà posée : le choix ne ré-initie pas la même posture. */
export function choicePoseAlignedWithAction(choice, exchange) {
  const action = exchange.companionAction ?? '';
  const text = choice.text ?? '';
  if (
    /\b(pouss[ée]? à genoux|te pousse à genoux|à genoux devant)\b/i.test(action) &&
    /\bje m'agenouille\b/i.test(text) &&
    !/\b(reste debout|seconde|minute|debout.*puis|compte.*debout)\b/i.test(text)
  ) {
    return {
      ok: false,
      reason:
        'companionAction = déjà à genoux — choix ne doit pas dire « je m\'agenouille » (continuer : lèche, langue, presse…)',
    };
  }
  if (
    /\b(te tire sur le lit|t'attire sur le lit|sur ton torse|sur le matelas|allonge sur le lit)\b/i.test(
      action,
    ) &&
    /\b(couloir|reste debout)\b/i.test(text) &&
    !/\bfeins\b/i.test(text)
  ) {
    return {
      ok: false,
      reason:
        'companionAction = déjà sur le lit — choix ne peut pas être au couloir ou debout (feinte sur place OK)',
    };
  }
  return { ok: true };
}

function stripReactionText(reaction = '') {
  return extractReactionSpokenParts(reaction);
}

/** Parties parlées d'une réaction (hors didascalies *…*). */
export function extractReactionSpokenParts(reaction = '') {
  const matches = [...reaction.matchAll(/«([^»]*)»/g)];
  if (matches.length > 0) {
    return matches.map((match) => match[1].trim()).join(' ').trim();
  }
  const withoutDidasc = reaction.replace(/\*[^*]+\*/g, ' ').trim();
  return stripSpeechGuillemets(withoutDidasc).trim();
}

/** Didascalies *…* dans réactions — 3e personne, après la réplique. */
export function reactionDidascalieOk(reaction = '') {
  const trimmed = reaction.trim();
  const blocks = [...trimmed.matchAll(/\*([^*]+)\*/g)];
  if (blocks.length === 0) return { ok: true };
  if (!/«[^»]+»/.test(trimmed)) {
    return { ok: false, reason: 'didascalie *…* sans réplique « … » avant — format : « Bien. » *Elle serre…*' };
  }
  for (const [, body] of blocks) {
    const text = body.trim();
    if (!/^(elle|Elle|Lyra)\b/.test(text)) {
      return {
        ok: false,
        reason: 'didascalie réaction — 3e personne (Elle/Lyra…) attendue, pas je/tu',
      };
    }
    if (/[«»]/.test(text)) {
      return { ok: false, reason: 'didascalie réaction — pas de guillemets à l\'intérieur de *…*' };
    }
  }
  return { ok: true };
}

/** S40a — bridge pose déjà un fait ; companionAction ne le répète pas. */
export function bridgeActionSemanticOverlapOk(exchange) {
  const bridge = exchange.bridge ?? '';
  const action = exchange.companionAction ?? '';
  if (/\bverrou\b/i.test(bridge) && /\btire le verrou\b/i.test(action)) {
    return {
      ok: false,
      reason: 'companionAction répète « tire le verrou » déjà posé dans le bridge',
    };
  }
  return { ok: true };
}

/** S40b — companionLine ne reformule pas la pose déjà dans companionAction. */
export function companionLineActionRedundancyOk(exchange) {
  const action = exchange.companionAction ?? '';
  const line = exchange.companionLine ?? '';
  if (
    /\b(plaque|garde|colle|tire).*(porte|contre toi|contre la porte)\b/i.test(action) &&
    /\b(garde|colle|presse|tiens).*(porte|contre)\b/i.test(line)
  ) {
    return {
      ok: false,
      reason:
        'companionLine répète la pose de companionAction — garder l\'oral (« Ne bouge pas encore. ») et le geste en action/didascalie',
    };
  }
  return { ok: true };
}

/** S40c — réaction parlée ne redit pas l'acte que le choix vient de jouer. */
export function reactionChoiceSemanticRedundancyOk(choice) {
  const text = choice.text ?? '';
  const spoken = extractReactionSpokenParts(choice.reaction ?? '');
  if (
    /\b(serre mes hanches|serre.*hanches|laisse.*coller.*corps)\b/i.test(text) &&
    /\b(je serre plus fort|serre plus fort)\b/i.test(spoken)
  ) {
    return {
      ok: false,
      reason:
        'réaction « je serre plus fort » redondante avec le choix — oral court + didascalie *Elle serre…*',
    };
  }
  return { ok: true };
}

export function exchangeNarrativeEconomyOk(exchange) {
  const bridge = bridgeActionSemanticOverlapOk(exchange);
  if (!bridge.ok) return bridge;
  const phrase = bridgeActionPhraseOverlapOk(exchange);
  if (!phrase.ok) return phrase;
  const line = companionLineActionRedundancyOk(exchange);
  if (!line.ok) return line;
  for (const choice of exchange.choices ?? []) {
    const didasc = reactionDidascalieOk(choice.reaction ?? '');
    if (!didasc.ok) return { ok: false, reason: `choix ${choice.tone} : ${didasc.reason}` };
    const redundant = reactionChoiceSemanticRedundancyOk(choice);
    if (!redundant.ok) return { ok: false, reason: `choix ${choice.tone} : ${redundant.reason}` };
    const flipReaction = reactionMatchesDominanceFlip(choice);
    if (!flipReaction.ok) return { ok: false, reason: `choix ${choice.tone} : ${flipReaction.reason}` };
  }
  return { ok: true };
}

/** S41 + S42 + S39 — vestiaire et dominance (appel unique, pas de doublon). */
export function exchangeVestiaireDominanceOk(exchange) {
  const strip = romanticChoiceObeysStripConsigne(exchange);
  if (!strip.ok) return strip;
  const onTop = romanticChoiceRespectsCompanionOnTop(exchange);
  if (!onTop.ok) return onTop;
  const undress = romanticChoiceRespectsCompanionUndressing(exchange);
  if (!undress.ok) return undress;
  const pinnedLine = companionLineOrdersSelfStripWhilePinned(exchange);
  if (!pinnedLine.ok) return pinnedLine;
  return { ok: true };
}

/** S37 + S44 — réaction Lyra cohérente avec acte en cours (pas d'ordre futur). */
export function choiceReactionCoherenceOk(choice, exchange) {
  const temporal = choiceReactionTemporalCoherence(choice, exchange);
  if (!temporal.ok) return temporal;
  const passive = reactionMcPassiveCoherenceOk(choice, exchange);
  if (!passive.ok) return passive;
  const mount = reactionMatchesPenetrationProgress(choice, exchange);
  if (!mount.ok) return mount;
  const orgasm = reactionMatchesOrgasmGoal(choice);
  if (!orgasm.ok) return orgasm;
  return { ok: true };
}

/** S41 — Lyra déjà au-dessus : le +3 n'inverse pas la position. */
export const COMPANION_ON_TOP_ACTION =
  /\b(s'allonge sur ton torse|s'étale sur toi|à califourchon|califourchon sur tes|califourchon sur ta|monte sur tes hanches|monte sur toi|chevauche|s'assoit à califourchon|genoux de chaque côté)\b/i;

/** S42 — Lyra déshabille le MC (califourchon + laisse faire) : le +3 cède, ne se déshabille pas seul. */
export const COMPANION_UNDRESS_IN_PROGRESS =
  /\b(doigts sur (?:les boutons|la bretelle)|doigts sous|déboutonne ta chemise|ouvre ta chemise|glisse ta chemise|retire ta chemise|glisse ta robe|retire ta robe)\b/i;

export const COMPANION_LET_ME_UNDRESS_LINE =
  /\b(laisse-toi faire|laisse-moi faire|je m'en occupe)\b/i;

export const MC_SELF_STRIP_CHOICE =
  /\b(je jette ma chemise|je descends ma chemise|retire ma chemise|enlève ma chemise|jette ma robe|jette mon pantalon d'un coup|jette ma culotte d'un coup)\b/i;

export function romanticChoiceRespectsCompanionUndressing(exchange) {
  const action = exchange.companionAction ?? '';
  const line = exchange.companionLine ?? '';
  const onTop = COMPANION_ON_TOP_ACTION.test(action);
  const letMeUndress = COMPANION_LET_ME_UNDRESS_LINE.test(line);
  const inProgress = COMPANION_UNDRESS_IN_PROGRESS.test(action);
  const lyraUndresses = onTop && (letMeUndress || inProgress);
  if (!lyraUndresses) return { ok: true };
  const romantic = exchange.choices?.find((choice) => choice.score === 3);
  if (!romantic?.text) return { ok: true };
  if (MC_SELF_STRIP_CHOICE.test(romantic.text)) {
    return {
      ok: false,
      reason:
        'Lyra déshabille le MC (pose ou « laisse-toi faire ») — choix +3 cède / laisse faire, pas « je jette ma chemise »',
    };
  }
  if (!/\b(laisse|immobile|ne bouge|relâche|signale)\b/i.test(romantic.text)) {
    return {
      ok: false,
      reason:
        'Lyra déshabille le MC — choix +3 attend immobilité / laisse faire (la laisse ouvrir, sans rien cacher…)',
    };
  }
  return { ok: true };
}

export function companionLineOrdersSelfStripWhilePinned(exchange) {
  const action = exchange.companionAction ?? '';
  const line = exchange.companionLine ?? '';
  if (!COMPANION_ON_TOP_ACTION.test(action)) return { ok: true };
  if (COMPANION_LET_ME_UNDRESS_LINE.test(line)) return { ok: true };
  if (/\b(enlève ta chemise|enlève ta robe|jette ta chemise|jette ta robe)\b/i.test(line)) {
    return {
      ok: false,
      reason:
        'Lyra au-dessus du MC — companionLine ne peut pas ordonner « enlève ta chemise » (mains bloquées) ; « Laisse-toi faire » + elle déshabille dans l\'action/réaction',
    };
  }
  return { ok: true };
}

/** S44 — réaction incohérente si Lyra est déjà montée / en train de prendre la bite. */
export const COMPANION_PENETRATING_MC_ACTION =
  /\b(prend ta bite en elle|glisse ta bite en elle|monte sur tes hanches|enfourche|bite en elle|chevauche ta bite)\b/i;

export const REACTION_ORDERS_FUTURE_MOUNT =
  /\b(je descends sur toi|descends sur toi|je monte sur toi)\b/i;

export function reactionMatchesPenetrationProgress(choice, exchange) {
  const action = exchange.companionAction ?? '';
  const reaction = choice.reaction ?? '';
  if (!COMPANION_PENETRATING_MC_ACTION.test(action)) return { ok: true };
  if (!REACTION_ORDERS_FUTURE_MOUNT.test(reaction)) return { ok: true };
  return {
    ok: false,
    reason:
      'Lyra est déjà montée / bite en elle dans companionAction — réaction ne peut pas ordonner « je descends sur toi »',
  };
}

/** C1 + S45 — bridge ancré lieu + fil intra-pack (aff. 4–5). Packs 1–4 indépendants. */
export const BRIDGE_PLACE_ANCHOR =
  /\b(bibliothèque|havre|village|refuge|marché|ruines|forêt|couloir|comptoir|porte|registre|atlas|sachet|chambre|lit|couchette|commode|draps|rayons|table|verrière|balcon|toit|jardin|pavillon|matelas|rambarde)\b/i;

export const PACK_BRIDGE_CONTINUITY_HOOK =
  /\b(encore|toujours|de retour|où elle|après|halet|nu|draps|commode|déshabill|oral|langue|chatte|bite|brûl|tremp|deuxième|rayons|table|lit|bibliothèque|chambre|peignoir|verrou|comme tout|relève|retour)\b/i;

/** S45 — ouverture de pack : pas de rappel à un autre pack / session précédente. */
export const PACK_OPENER_ASSUMES_PRIOR =
  /\b(de retour sur|après ses doigts|après vous être|vous êtes déjà nus|vous êtes déjà nues|ta chatte encore brûlante|ta bite encore trempée)\b/i;

/** S45 — continuité intra-pack : pas de ré-entrée chambre + bridge reprend le fil. */
export const PACK_CHAMBER_REENTRY =
  /\b(t'attire dans sa chambre|te mène dans sa chambre|entre dans sa chambre|t'attire dans la chambre)\b/i;

export const PACK_PRIOR_CHAMBER_BED =
  /\b(chambre|draps|lit du havre|sur le lit|déshabill|ôter ta|glisser ta robe|ton pantalon)\b/i;

/** Marqueurs acte précédent par pack aff. 5 — continuité **intra-pack** (échange 2–3). */
export const AFF5_PACK_PRIOR_ACT_HOOKS = {
  'pack-1': /\b(bibliothèque|verrou|rayons|table|genoux|cuisses|clitoris|chatte|oral|langue|toujours|encore)\b/i,
  'pack-2': /\b(draps|lit|chambre|peignoir|chemise|pantalon|nu|califourchon|verge|bite|commode|relève|halet)\b/i,
  'pack-3': /\b(verrière|vitrage|vitrail|buée|montant|matelas|nu|draps|chatte|bite|collées|clitoris|lune)\b/i,
  'pack-4': /\b(toit|aube|nuit|couverture|jouis|halet|encore|deuxième|chevauche|enfourche|semence|dégoulin|chancel|bouche|langue|genoux|quatre pattes|cul|derrière|gode)\b/i,
  'pack-5':
    /\b(bibliothèque|rayons|registre|atlas|pupitre|silence|chut|doigt|lèvres|harnais|sangle|gode|bestiaire|apprenti|réserve|verrou|travées|encore|toujours|midi|soir)\b/i,
};

export function bridgePackOpenerStandaloneOk(exchange, packIndex) {
  if (packIndex !== 0) return { ok: true };
  const bridge = exchange.bridge ?? '';
  if (PACK_OPENER_ASSUMES_PRIOR.test(bridge)) {
    return {
      ok: false,
      reason:
        'bridge d\'ouverture de pack — ne doit pas supposer un pack précédent (de retour, encore brûlante, déjà nus sur le lit…)',
    };
  }
  return { ok: true };
}

export function bridgePlaceAnchored(bridge = '') {
  if (!BRIDGE_PLACE_ANCHOR.test(bridge)) {
    return { ok: false, reason: 'bridge sans lieu concret (bibliothèque, lit, chambre, draps…)' };
  }
  return { ok: true };
}

export function bridgePackHookOk(exchange, priorExchange, packId, packIndex, affinity = 5) {
  const bridge = exchange.bridge ?? '';
  const place = bridgePlaceAnchored(bridge);
  if (!place.ok) return place;
  const opener = bridgePackOpenerStandaloneOk(exchange, packIndex);
  if (!opener.ok) return opener;
  if (packIndex === 0) return { ok: true };
  const priorBlob = [priorExchange?.bridge, priorExchange?.companionAction, priorExchange?.title]
    .filter(Boolean)
    .join(' ');
  if (PACK_PRIOR_CHAMBER_BED.test(priorBlob) && PACK_CHAMBER_REENTRY.test(bridge)) {
    return {
      ok: false,
      reason: `bridge ré-introduit la chambre alors que le pack est déjà sur les draps (après « ${priorExchange?.title} »)`,
    };
  }
  if (PACK_BRIDGE_CONTINUITY_HOOK.test(bridge)) return { ok: true };
  if (affinity >= 5) {
    const packHook = AFF5_PACK_PRIOR_ACT_HOOKS[packId];
    if (packHook?.test(bridge)) return { ok: true };
  }
  if (affinity >= 5) {
    return {
      ok: false,
      reason: `bridge ne reprend pas le fil pack (après « ${priorExchange?.title} ») — marqueur continuité attendu (encore, draps, oral, nu… )`,
    };
  }
  return { ok: true };
}

export function packSessionContinuityOk(data) {
  const affinity = data.meta?.affinity ?? 0;
  if (affinity < 4) return { ok: true };
  for (const pack of data.meta.sessionPacks ?? []) {
    const exchanges = pack.exchangeIds
      .map((id) => data.exchanges.find((entry) => entry.id === id))
      .filter(Boolean);
    for (let index = 0; index < exchanges.length; index += 1) {
      const prior = index > 0 ? exchanges[index - 1] : null;
      const hook = bridgePackHookOk(exchanges[index], prior, pack.id, index, affinity);
      if (!hook.ok) {
        return { ok: false, reason: `${exchanges[index].id} : ${hook.reason}` };
      }
    }
  }
  return { ok: true };
}

export const MC_FLIPS_COMPANION_CHOICE =
  /\b(je la presse contre les draps|je la retourne|je l'inverse|je la bascule|je la plaque sous)\b/i;

export function romanticChoiceRespectsCompanionOnTop(exchange) {
  if (!COMPANION_ON_TOP_ACTION.test(exchange.companionAction ?? '')) return { ok: true };
  const romantic = exchange.choices?.find((choice) => choice.score === 3);
  if (romantic && MC_FLIPS_COMPANION_CHOICE.test(romantic.text ?? '')) {
    return {
      ok: false,
      reason:
        'companionAction = Lyra au-dessus — choix +3 obéit et reste sous elle (retournement réservé au direct/playful)',
    };
  }
  return { ok: true };
}

/** S41b — réaction cohérente si le choix retourne Lyra. */
export function reactionMatchesDominanceFlip(choice) {
  if ((choice.score ?? 0) < 2) return { ok: true };
  const text = choice.text ?? '';
  const spoken = extractReactionSpokenParts(choice.reaction ?? '');
  if (!MC_FLIPS_COMPANION_CHOICE.test(text)) return { ok: true };
  if (/\bpresse-toi contre moi\b/i.test(spoken)) {
    return {
      ok: false,
      reason:
        'choix retourne Lyra — réaction « presse-toi contre moi » incohérente (défi / prends-moi / assume)',
    };
  }
  return { ok: true };
}

/** S48 — repose logique spatio-temporelle, dom/sub, props et réaction vs objectif. */
export const INVITE_MC_TO_START_LINE =
  /\b(commence\.?|goûte|baise-moi|touche-moi|en moi|assieds-toi sur)\b/i;

export const CHOICE_TEMPORAL_FILLER =
  /\b(avant l'aube|aube grise|toute la nuit|jusqu'à l'aube)\b/i;

export function bridgeActionSpatialClashOk(exchange) {
  const bridge = exchange.bridge ?? '';
  const action = exchange.companionAction ?? '';
  if (/\b(déjà nues? sur le lit|déjà sur le lit|déjà allongé)\b/i.test(bridge)) {
    if (
      /\b(claque la porte|pousse la porte|t'attire sur le lit|te pousse sur le matelas|t'allonge sur)\b/i.test(
        action,
      )
    ) {
      return {
        ok: false,
        reason:
          'bridge pose déjà au lit — companionAction ne ré-entre pas (porte, matelas, allonge…)',
      };
    }
  }
  const outdoorBridge = /\b(toit|balcon|verrière|jardin|pavillon)\b/i.test(bridge);
  const indoorAction = /\b(porte de la chambre|matelas|lit du havre|oreiller)\b/i.test(action);
  const bridgeMentionsIndoor = /\b(chambre|lit|matelas|draps)\b/i.test(bridge);
  if (outdoorBridge && indoorAction && !bridgeMentionsIndoor) {
    return {
      ok: false,
      reason:
        'lieu extérieur dans le bridge — companionAction évite porte chambre / matelas / lit sans ancrage',
    };
  }
  return { ok: true };
}

export function companionLineDominanceAligned(exchange) {
  const action = exchange.companionAction ?? '';
  const line = exchange.companionLine ?? '';
  if (!COMPANION_ON_TOP_ACTION.test(action)) return { ok: true };
  if (INVITE_MC_TO_START_LINE.test(line)) {
    return {
      ok: false,
      reason:
        'Lyra au-dessus — companionLine n\'invite pas à « Commence / Goûte » ; ordre dom (Bouge quand…, Ne me repousse pas)',
    };
  }
  return { ok: true };
}

export function choiceTemporalFillerOk(choice, exchange) {
  const bridge = exchange.bridge ?? '';
  const text = choice.text ?? '';
  if (!CHOICE_TEMPORAL_FILLER.test(text)) return { ok: true };
  if (/\b(aube|nuit|minuit|matin)\b/i.test(bridge)) {
    return {
      ok: false,
      reason:
        'filler temporel « aube/nuit » redondant avec le bridge — préférer l\'acte seul',
    };
  }
  return { ok: true };
}

export function choicePropsMatchSettingOk(choice, exchange) {
  const context = [exchange.bridge, exchange.companionAction].filter(Boolean).join(' ');
  const text = choice.text ?? '';
  if (/\boreiller\b/i.test(text) && !/\b(lit|draps|couchette|matelas|couverture|coussin)\b/i.test(context)) {
    return {
      ok: false,
      reason: 'oreiller sans lit/draps/couverture dans bridge ou companionAction',
    };
  }
  return { ok: true };
}

export function choicePoseRespectsCompanionOnTop(choice, exchange) {
  const action = exchange.companionAction ?? '';
  const text = choice.text ?? '';
  if (!COMPANION_ON_TOP_ACTION.test(action)) return { ok: true };
  if (/\b(je la tire sur moi|tire sur moi|tire vers moi)\b/i.test(text)) {
    return {
      ok: false,
      reason: 'Lyra déjà au-dessus — choix ne peut pas « la tirer sur moi »',
    };
  }
  if (/\bsur le dos\b/i.test(text) && !/\b(bascule|retourne|inverse|plaques sous)\b/i.test(text)) {
    return {
      ok: false,
      reason: 'Lyra au-dessus — « sur le dos » exige bascule/retourne dans le même choix',
    };
  }
  return { ok: true };
}

export function reactionMatchesOrgasmGoal(choice) {
  const text = choice.text ?? '';
  const spoken = extractReactionSpokenParts(choice.reaction ?? '');
  if (!/\b(jusqu'à ce qu'elle jouisse|qu'elle jouisse|la faire jouir)\b/i.test(text)) {
    return { ok: true };
  }
  if (
    /\b(presse-toi plus fort|baise-moi plus fort|alors baise-moi)\b/i.test(spoken) &&
    !/\b(jouisse|jouis|continue|là|ne t'arrête)\b/i.test(spoken)
  ) {
    return {
      ok: false,
      reason:
        'choix vise la faire jouir — réaction alignée (Continue / Ne t\'arrête pas avant que je jouisse), pas « presse-toi plus fort » hors sujet',
    };
  }
  return { ok: true };
}

/** S49a — bridge et companionAction ne partagent pas une longue sous-chaîne (≥4 mots). */
export function bridgeActionPhraseOverlapOk(exchange) {
  const bridge = exchange.bridge ?? '';
  const action = exchange.companionAction ?? '';
  const shared = longestSharedWordRun(bridge, action, 4);
  if (shared >= 4) {
    return {
      ok: false,
      reason: `bridge et companionAction partagent ${shared} mots d'affilée — déplacer le détail (ongles, rythme…) d'un seul côté`,
    };
  }
  return { ok: true };
}

/** S49b — « dès qu'elle me le signale » incohérent si Lyra agit déjà sans consigne d'attente. */
export const COMPANION_ACT_IN_PROGRESS =
  /\b(frotte|frottant|frottent|lèche|lèche ta|suce|prend ta bite|chevauche|monte sur|s'assoit sur ta cuisse|s'assoit à califourchon|glisse ses doigts|enfonce sa langue|doigts en toi)\b/i;

export const MC_WAITS_FOR_SIGNAL =
  /\b(dès qu'elle me le signale|quand elle me le signale|attends qu'elle me signale)\b/i;

export const COMPANION_ORDERS_WAIT =
  /\b(quand commencer|quand bouger|quand je serre|quand je te le dis|attends|immobile|ne bouge pas|je te dirai|je te le dirai|serre tes hanches, entre)\b/i;

/** Consigne explicite d'attendre un signal — seule exception à S49b si Lyra agit déjà. */
export const COMPANION_EXPLICIT_SIGNAL_ORDER =
  /\b(quand commencer|quand bouger|quand je serre|quand je te le dis|je te dirai|je te le dirai|serre tes hanches, entre)\b/i;

export function choiceSignalCoherentWithAction(choice, exchange) {
  const text = choice.text ?? '';
  if (!MC_WAITS_FOR_SIGNAL.test(text)) return { ok: true };
  const line = exchange.companionLine ?? '';
  const action = exchange.companionAction ?? '';
  if (COMPANION_EXPLICIT_SIGNAL_ORDER.test(line)) return { ok: true };
  if (COMPANION_ACT_IN_PROGRESS.test(action)) {
    return {
      ok: false,
      reason:
        'Lyra agit déjà — pas « dès qu\'elle me le signale » ; immobile / la laisse frotter / hanches calées / accrochée à ses ordres',
    };
  }
  return { ok: true };
}

/** S49c — Lyra domine le frottement : pas « presse-toi / entre » en réaction au MC passif. */
export function reactionDomActiveCoherenceOk(choice, exchange) {
  const action = exchange.companionAction ?? '';
  const text = choice.text ?? '';
  const spoken = extractReactionSpokenParts(choice.reaction ?? '');
  if (!/\b(frotte|frottant|clitoris contre|chatte contre)\b/i.test(action)) return { ok: true };
  if (!/\b(immobile|la laisse|hanches calées|laisse frotter)\b/i.test(text)) return { ok: true };
  if (/\b(presse-toi|alors entre|alors baise)\b/i.test(spoken)) {
    return {
      ok: false,
      reason:
        'Lyra domine le frottement — réaction « Tu peux jouir. Ne te retiens pas. » + didascalie (*Elle accélère…*), pas « presse-toi / entre »',
    };
  }
  return { ok: true };
}

/** S37b — MC passif + Lyra stimule : pas d'ordre au MC de faire l'acte qu'elle mène déjà. */
export const MC_PASSIVE_CHOICE =
  /\b(immobile|la laisse|sans reprendre|ne bouge pas|dos à la rambarde|cède|hanches calées|retiens ma respiration|retiens mon|laisse sucer|laisse lécher|m'allonge.*la laisse|reste allongé|reste contre|bouche scellée)\b/i;

export const LYRA_STIMULATES_MC =
  /\b(suce|sucer|lèche|lèche ta|frotte|frottant|prend ta bite|doigts en toi|glisse.*doigts|main sur ta braguette|langue sur|enfonce sa langue|bouche ouverte)\b/i;

export const REACTION_ORDERS_MC_ACT =
  /\b(presse-toi|alors entre|alors baise|continue\. avale|avale\.|avale\b|entre en moi|approche|viens sur|alors viens)\b/i;

export const REACTION_LYRA_ORAL_OK =
  /\b(j['']avale|laisse-toi|laisse toi|gorge|langue|tu peux jouir|lâche-toi)\b/i;

export function reactionMcPassiveCoherenceOk(choice, exchange) {
  const text = choice.text ?? '';
  const action = exchange.companionAction ?? '';
  const spoken = extractReactionSpokenParts(choice.reaction ?? '');
  if (!MC_PASSIVE_CHOICE.test(text)) return { ok: true };
  if (!LYRA_STIMULATES_MC.test(action)) return { ok: true };
  if (/\b(suce|prend ta bite|bouche)\b/i.test(action) && REACTION_LYRA_ORAL_OK.test(spoken)) {
    return { ok: true };
  }
  if (REACTION_ORDERS_MC_ACT.test(spoken)) {
    return {
      ok: false,
      reason:
        'MC passif + Lyra stimule — pas « presse-toi / entre / avale » au MC (préférer laisse-toi aller, j\'avale, tu peux jouir…)',
    };
  }
  return { ok: true };
}

/** LQ — quotas de templates récurrents par pack (warn). */
export const CORPUS_TEMPLATE_QUOTAS = [
  { id: 'LQ1', pattern: /poignet,\s*compris/i, maxPerPack: 2, label: '« Poignet, compris. »' },
  { id: 'LQ2', pattern: /pas de th[ée]âtre/i, maxPerPack: 2, label: '« Pas de théâtre. »' },
  { id: 'LQ3', pattern: /ralentis ma respiration/i, maxPerPack: 2, label: '« je ralentis ma respiration »' },
  { id: 'LQ4', pattern: /« bien\./i, maxPerPack: 3, label: '« Bien. » en réaction +3' },
  { id: 'LQ5', pattern: /ne bouge pas/i, maxPerPack: 1, label: '« Ne bouge pas » (companionLine)', field: 'companionLine' },
];

export function corpusTemplateQuotaWarnings(data) {
  const warnings = [];
  const byId = new Map((data.exchanges ?? []).map((ex) => [ex.id, ex]));
  for (const pack of data.meta?.sessionPacks ?? []) {
    const exchangeIds = pack.exchangeIds ?? [];
    for (const quota of CORPUS_TEMPLATE_QUOTAS) {
      const blob =
        quota.field === 'companionLine'
          ? exchangeIds
              .map((id) => byId.get(id)?.companionLine ?? '')
              .filter(Boolean)
              .join('\n')
          : exchangeIds
              .flatMap((id) => {
                const ex = byId.get(id);
                if (!ex) return [];
                return [
                  ex.bridge,
                  ex.companionAction,
                  ex.companionLine,
                  ex.intimateFinale,
                  ex.intimateFinaleLow,
                  ...(ex.choices ?? []).flatMap((c) => [c.text, c.reaction]),
                ];
              })
              .filter(Boolean)
              .join('\n');
      const count = (blob.match(quota.pattern) ?? []).length;
      if (count > quota.maxPerPack) {
        warnings.push({
          code: quota.id,
          message: `${pack.id} : ${quota.label} ×${count} (max ${quota.maxPerPack}/pack)`,
        });
      }
    }
  }
  return warnings;
}

const FINALE_VICTORY_TAUNT = /hâte que tu me refais|encore demain\. même (?:heure|silence)|dommage que ce soit déjà fini/i;

/** S47b — intimateFinaleLow sans taunt « victoire » (contraste score ≤ 1). */
export function intimateFinaleLowCoherenceOk(exchange) {
  const low = exchange.intimateFinaleLow?.trim();
  if (!low) return { ok: true };
  if (FINALE_VICTORY_TAUNT.test(low)) {
    return {
      ok: false,
      reason:
        'intimateFinaleLow — retrait du taunt victoire attendu (ton sec / reprise, pas « Hâte que… »)',
    };
  }
  return { ok: true };
}

const ORAL_SCENE_ACTIVE = /\b(suce|langue|avale|lèche|bouche ouverte|oral)\b/i;
const STACKED_IMPERATIVES = /\b(continue|avale|presse|laisse|fort|plus)\b.*\b(continue|avale|fort|plus|ne t'?arrête)\b/i;
const HACHED_DIDASCALIE = /\*[^*]*(?:…|\.\.\.)[^*]*\*/;

/** S37c — oral actif : réaction +3 hachée si impératifs empilés (warn). */
export function reactionOralDidascalieWarn(exchange) {
  const oralActive = ORAL_SCENE_ACTIVE.test(
    [exchange.companionAction, exchange.companionLine].filter(Boolean).join(' '),
  );
  if (!oralActive) return null;
  const romantic = (exchange.choices ?? []).find((c) => c.tone === 'romantic' && c.score === 3);
  if (!romantic?.reaction) return null;
  const spokenOnly = romantic.reaction.replace(/\*[^*]*\*/g, ' ');
  if (!STACKED_IMPERATIVES.test(spokenOnly)) return null;
  if (HACHED_DIDASCALIE.test(romantic.reaction)) return null;
  return `${exchange.id} : oral actif — réaction +3 empile impératifs sans didascalie hachée (*…*)`;
}

/** S49d — pack libellé « nu » : échanges 2–3 sans re-déshabillage. */
export const PACK_NU_VESTIAIRE_REINTRO =
  /\b(il te reste encore|tu as encore|encore ta robe|encore ta string|encore ton pantalon|encore la chemise|enlève ta string|enlève ton pantalon|jette ma string|au pied du lit)\b/i;

export function packNuLabelVestiaireOk(exchange, packCtx) {
  if (!packCtx?.packLabel || !/\bnu\b/i.test(packCtx.packLabel)) return { ok: true };
  if ((packCtx.packIndex ?? 0) === 0) return { ok: true };
  const blob = [
    exchange.bridge,
    exchange.companionAction,
    exchange.companionLine,
    ...(exchange.choices ?? []).map((c) => c.text),
  ]
    .filter(Boolean)
    .join(' ');
  if (PACK_NU_VESTIAIRE_REINTRO.test(blob)) {
    return {
      ok: false,
      reason: 'pack « nu » — échanges 2–3 déjà nus ; pas de robe/string/chemise restante ni ordre de déshabiller',
    };
  }
  return { ok: true };
}

/** FR14 — « string » est masculin en français. */
export function frenchStringGenderOk(text = '', fieldLabel = 'texte') {
  if (/\b(ta string|ma string)\b/i.test(text)) {
    return { ok: false, reason: `${fieldLabel} — « string » est masculin : ton string / mon string` };
  }
  return { ok: true };
}

export function exchangeSceneLogicOk(exchange) {
  const spatial = bridgeActionSpatialClashOk(exchange);
  if (!spatial.ok) return spatial;
  const domLine = companionLineDominanceAligned(exchange);
  if (!domLine.ok) return domLine;
  for (const choice of exchange.choices ?? []) {
    const filler = choiceTemporalFillerOk(choice, exchange);
    if (!filler.ok) return { ok: false, reason: `choix ${choice.tone} : ${filler.reason}` };
    const props = choicePropsMatchSettingOk(choice, exchange);
    if (!props.ok) return { ok: false, reason: `choix ${choice.tone} : ${props.reason}` };
    const onTop = choicePoseRespectsCompanionOnTop(choice, exchange);
    if (!onTop.ok) return { ok: false, reason: `choix ${choice.tone} : ${onTop.reason}` };
    const orgasm = reactionMatchesOrgasmGoal(choice);
    if (!orgasm.ok) return { ok: false, reason: `choix ${choice.tone} : ${orgasm.reason}` };
    const signal = choiceSignalCoherentWithAction(choice, exchange);
    if (!signal.ok) return { ok: false, reason: `choix ${choice.tone} : ${signal.reason}` };
    const domReact = reactionDomActiveCoherenceOk(choice, exchange);
    if (!domReact.ok) return { ok: false, reason: `choix ${choice.tone} : ${domReact.reason}` };
  }
  return { ok: true };
}

/** S37 — réaction Lyra cohérente avec le choix déjà joué (pas d'ordre redondant). */
export function choiceReactionTemporalCoherence(choice, exchange) {
  const text = choice.text ?? '';
  const reaction = stripReactionText(choice.reaction ?? '');
  const line = exchange.companionLine ?? '';
  const action = exchange.companionAction ?? '';

  if (
    /\b(ne bouge pas|reste immobile)\b/i.test(line) &&
    /\b(alors viens|viens\.|approche)\b/i.test(reaction)
  ) {
    return {
      ok: false,
      reason: '« Ne bouge pas » + réaction « viens » — immobilité et invitation contradictoires',
    };
  }

  if (
    /\balors fais-le\b/i.test(reaction) &&
    /\b(je |j'|glisse|caresse|lèche|presse|touche|frotte|serre|enfonce|baise|m'allonge|langue|doigts)\b/i.test(
      text,
    )
  ) {
    return {
      ok: false,
      reason: 'choix décrit déjà l\'acte — réaction « Alors fais-le » incohérente (préférer « Continue. Tais-toi. »)',
    };
  }

  if (/pas de mots après/i.test(reaction) && /\b(je |j').{8,}/i.test(text)) {
    return {
      ok: false,
      reason:
        '« Pas de mots après » alors que le choix joueur décrit déjà l\'action — préférer « Continue. Tais-toi. »',
    };
  }

  if (
    /\b(pouss[ée]? à genoux|à genoux devant|cuisses ouvertes sur ton visage)\b/i.test(action) &&
    /\b(à genoux|agenouill|commence\.)\b/i.test(reaction) &&
    !/\b(ne t'arrête|continue|guide|lèche)\b/i.test(reaction)
  ) {
    return {
      ok: false,
      reason:
        'déjà à genoux dans companionAction — réaction ne doit pas ordonner de s\'agenouiller ou « commence »',
    };
  }

  return { ok: true };
}

/** Consigne Lyra « enlève / jette vêtement » — le choix +3 doit obéir (S39). */
export const COMPANION_STRIP_CONSIGNE_LINE =
  /\b(enlève|jette|retire)\b.*\b(ta chemise|ton pantalon|ta robe|ta culotte|ta string|ton slip|ton caleçon|le tissu|tout|nu)\b/i;

export const MC_OBEYS_STRIP_CHOICE =
  /\b(jette (?:ma|mon)|retire (?:ma|mon)|enlève (?:ma|mon)|descends (?:ma|mon)|me déshabille|déshabille|chemise.*(?:pantalon|culotte|caleçon)|pantalon.*(?:culotte|caleçon)|(?:culotte|string|slip|caleçon) d'un coup|robe d'un coup|verge contre|bite contre|chatte contre)\b/i;

export function romanticChoiceObeysStripConsigne(exchange) {
  const line = exchange.companionLine ?? '';
  if (!COMPANION_STRIP_CONSIGNE_LINE.test(line)) return { ok: true };
  const romantic = exchange.choices?.find((choice) => choice.score === 3);
  if (!romantic?.text) return { ok: true };
  if (MC_OBEYS_STRIP_CHOICE.test(romantic.text)) return { ok: true };
  return {
    ok: false,
    reason:
      'consigne vestiaire Lyra (enlève/jette) — choix +3 doit se déshabiller, pas seulement toucher Lyra',
  };
}

export function exchangeTemporalCoherenceOk(exchange) {
  for (const choice of exchange.choices ?? []) {
    const pose = choicePoseAlignedWithAction(choice, exchange);
    if (!pose.ok) return pose;
    const temporal = choiceReactionTemporalCoherence(choice, exchange);
    if (!temporal.ok) return temporal;
  }
  return { ok: true };
}

/** Tag comportemental MC — 4 tons doivent diverger (aff. 4+ action). */
export const CHOICE_BEHAVIOR_TAGS = ['immediate', 'slow', 'delay', 'feint'];

export function choiceBehaviorTag(text = '') {
  const lower = text.toLowerCase();
  if (/\bd'abord\b|\bfeins\b|\bfrustr|\bthéâtre\b|\bthéâtre\b/.test(lower)) return 'feint';
  if (/\b(garde|laisse).*(?:seconde|minute|trente|\d+\s*s)|une minute|trente secondes/.test(lower)) {
    return 'delay';
  }
  if (/\blentement\b|\bsignale\b|\bguide\b|\bpoignet\b|\bcouche par couche\b|\bimmobile\b/.test(lower)) {
    return 'slow';
  }
  if (/\bjette\b|\bsans attendre\b|\bd'un coup\b|\bobéis\b|\bobtempère\b/.test(lower)) return 'immediate';
  return 'other';
}

function choiceWords(text = '') {
  return normalizeDisplayText(text)
    .replace(/[.!?…]+$/u, '')
    .split(/\s+/)
    .filter(Boolean);
}

/** Plus longue sous-chaîne de mots consécutifs communs entre deux choix. */
export function longestSharedWordRun(left = '', right = '', minWords = 5) {
  const wa = choiceWords(left);
  const wb = choiceWords(right);
  let best = 0;
  for (let i = 0; i < wa.length; i += 1) {
    for (let j = 0; j < wb.length; j += 1) {
      let run = 0;
      while (i + run < wa.length && j + run < wb.length && wa[i + run] === wb[j + run]) {
        run += 1;
      }
      if (run > best) best = run;
    }
  }
  return best >= minWords ? best : 0;
}

/** Contrat comportemental par ton — aff. 4+ action (suggestif + cru). */
export const TONE_BEHAVIOR_PATTERNS = {
  romantic:
    /\b(jette|sans attendre|d'un coup|presse|enfonce|baise|colle|tire|glisse|serre|suis|touche|embrasse|ferme|rapproche|agrippe|bloque|cède|frotte|offre|tourne|m'allonge|la laisse|reste immobile|reste contre|reste allongé|me cambre|continue jusqu|l'attire|la tire|passe le seuil|lèche|caresse|clito|langue|plonge|doigts|encule)\b/i,
  sincere:
    /\b(lentement|signale|ralentis|poignet|laisse guider|la laisse guider|la laisse mener|tape son poignet|signale d'un geste|ralentis si|ralentis quand|ralentis dès|couche par couche|reste immobile jusqu|reste près.*signale|immobile.*signale|guide.*lentement|retiens ma respiration|retiens mon)\b/i,
  direct:
    /\b(garde|seconde|minute|trente|\d+\s*secondes|debout.*puis|une seconde|reste debout|compte.*secondes|dis stop|retourne.*avant|retire.*seconde|sans attendre qu'elle|sans attendre son signal|d'un pas.*sans parler|avant qu'elle)\b/i,
  playful: /\b(d'abord|feins|feignant|simulant|simule|plaisante|tapote|brandis)\b/i,
};

const SPECTATOR_TONE_BEHAVIOR_PATTERNS = {
  romantic:
    /\b(je (?:caresse|pousse|glisse|enfonce|presse|repousse|m'arrête|arrête)|au rythme|sans couper|dès qu'elle serre|j'arrête net|bouche scellée|retenant ma respiration|la laisse accueillir)\b/i,
  sincere:
    /\b(lentement|ralentis|signale|poignet|cheville|crâne|cadence|pression|immobile|suiv|pages qui crissent|rythme lent|sans bruit|millimètre)\b/i,
  direct:
    /\b(garde|seconde|minute|trente|\d+\s*secondes|quinze|vingt|quarante|compte|immobile sous|sans bouger|une seconde|d'un cran)\b/i,
  playful:
    /\b(d'abord|feins|feignant|simulant|simule|plaisante|tapote|brandis|grincer|oubli)\b/i,
};

export function choicesToneBehaviorContract(exchange) {
  if (exchange.answerRule !== 'action') return { ok: true };
  const tonePatterns = exchangeSpectatorPresent(exchange)
    ? SPECTATOR_TONE_BEHAVIOR_PATTERNS
    : TONE_BEHAVIOR_PATTERNS;
  for (const choice of exchange.choices) {
    const pattern = tonePatterns[choice.tone];
    if (pattern && !pattern.test(choice.text)) {
      const hint =
        choice.tone === 'romantic'
          ? 'obéissance immédiate (jette, presse, sans attendre…)'
          : choice.tone === 'sincere'
            ? 'lent / signale / guide (lentement, poignet, immobile…)'
            : choice.tone === 'direct'
              ? 'retard calculé (garde X secondes, une minute…)'
              : 'feinte (D\'abord je feins…)';
      return {
        ok: false,
        reason: `choix ${choice.tone} — ${hint} attendu pour le différencier des autres tons`,
      };
    }
  }
  return { ok: true };
}

function choiceJaccardSimilarity(left = '', right = '') {
  const tokenize = (text) =>
    new Set(
      normalizeDisplayText(text)
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.replace(/[^a-zàâäéèêëïîôùûüç'-]/gi, ''))
        .filter(Boolean),
    );
  const a = tokenize(left);
  const b = tokenize(right);
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function romanticSincereDistinct(exchange, jaccardThreshold = 0.45, minSharedWords = 4) {
  const romantic = exchange.choices?.find((c) => c.tone === 'romantic')?.text ?? '';
  const sincere = exchange.choices?.find((c) => c.tone === 'sincere')?.text ?? '';
  if (!romantic || !sincere) return { ok: true };
  const similarity = choiceJaccardSimilarity(romantic, sincere);
  if (similarity >= jaccardThreshold) {
    return {
      ok: false,
      reason: `choix romantic/sincere trop proches (Jaccard ${similarity.toFixed(2)} ≥ ${jaccardThreshold})`,
    };
  }
  const shared = longestSharedWordRun(romantic, sincere, minSharedWords);
  if (shared >= minSharedWords) {
    return {
      ok: false,
      reason: `choix romantic/sincere — ${shared} mots identiques d'affilée`,
    };
  }
  return { ok: true };
}

/** @deprecated Préférer choicesToneBehaviorContract */
export function choicesBehaviorDistinct(exchange) {
  return choicesToneBehaviorContract(exchange);
}

export function choicesSharedPhraseAligned(exchange, minWords = 5) {
  for (let left = 0; left < exchange.choices.length; left += 1) {
    for (let right = left + 1; right < exchange.choices.length; right += 1) {
      const shared = longestSharedWordRun(
        exchange.choices[left].text,
        exchange.choices[right].text,
        minWords,
      );
      if (shared >= minWords) {
        const snippet = choiceWords(exchange.choices[left].text)
          .slice(0, shared)
          .join(' ');
        return {
          ok: false,
          reason: `choix ${exchange.choices[left].tone}/${exchange.choices[right].tone} — ${shared} mots identiques d'affilée (« ${snippet}… »)`,
        };
      }
    }
  }
  return { ok: true };
}

export function getJaccardFailThreshold(affinity = 1) {
  if (affinity >= 5) return 0.48;
  if (affinity >= 4) return 0.52;
  return 0.58;
}

export function formatCompanionActionLine(action) {
  return stripSpeechGuillemets(action).trim();
}

/**
 * Euphémismes « polissons » interdits dans les textes MC (choix + intimateFinale) aff. 5.
 * Registre partagé H/F puis spécificités genre.
 */
export const AFF5_MC_SHARED_EUPHEMISM_PATTERNS = [
  { id: 'X1', pattern: /\bpeau nue contre\b/i, hint: 'trop pudique — nommer organe ou zone (verge, bite, chatte, clito…)' },
  { id: 'X2', pattern: /\bpresse ma peau\b/i, hint: 'nommer verge, bite, chatte ou clitoris' },
  { id: 'X3', pattern: /\bentièrement nu\b/i, hint: 'préférer organe explicite ou zone nue nommée' },
  { id: 'X4', pattern: /\bcoller son corps au mien\b/i, hint: 'trop pudique — hanches, chatte, verge, braguette…' },
  { id: 'X5', pattern: /\b(grippe|gripper)\s+(?:ses|sa|mon|ma|tes|ton)\b/i, hint: 'grippe = maladie — agrippe / serre' },
  { id: 'X6', pattern: /\bje la laisse m'enfoncer\b/i, hint: 'préciser qui pénètre qui et avec quel organe/jouet' },
  { id: 'X7', pattern: /\bt'enfonçant dessus\b/i, hint: 'préciser bite/verge en elle ou gode en elle' },
  { id: 'X8', pattern: /\bfaire l'amour\b/i, hint: 'tournure mièvre pour aff. 5' },
  { id: 'X9', pattern: /\bparties intimes\b/i, hint: 'euphémisme administratif' },
  { id: 'X10', pattern: /\bzone intime\b/i, hint: 'euphémisme administratif' },
  { id: 'X11', pattern: /\beffleurer\b/i, hint: 'trop soft pour aff. 5 cru' },
  { id: 'X12', pattern: /\bdélicatement\b/i, hint: 'adverbe mièvre en aff. 5' },
];

export const AFF5_FEMALE_MC_EUPHEMISM_PATTERNS = [
  { id: 'E1', pattern: /\bembrasser entre (?:mes |tes )?cuisses\b/i, hint: 'trop pudique — préférer lécher la chatte / la langue sur…' },
  { id: 'E2', pattern: /\bm'embrasser entre\b/i, hint: 'idem' },
  { id: 'E6', pattern: /\bpetit (?:bisou|calin)\b/i, hint: 'registre enfantin' },
  { id: 'E7', pattern: /\bcâlin(?:er|ade)?\b/i, hint: 'registre enfantin' },
  { id: 'E9', pattern: /\b(?:la |me )goûter\b/i, hint: 'préférer lécher / langue sur la chatte' },
  { id: 'F13', pattern: /\bje l'enfonce\b/i, hint: 'MC femme — gode/strap/doigts explicites, ou Lyra sur toi' },
  ...AFF5_MC_SHARED_EUPHEMISM_PATTERNS,
];

/** Euphémismes interdits dans les textes MC homme (choix + intimateFinale) en aff. 5. */
export const AFF5_MALE_MC_EUPHEMISM_PATTERNS = [
  { id: 'M1', pattern: /\bculotte\b/i, hint: 'MC homme — caleçon ou rien, pas culotte' },
  ...AFF5_MC_SHARED_EUPHEMISM_PATTERNS,
  { id: 'M8', pattern: /\bje l'enfonce\b/i, hint: 'préciser je lui enfonce ma bite / ma verge' },
];

/** Prêt vocabulaire anglais porno courant — toléré en bridge seulement si contextualisé FR. */
export const AFF5_PORN_LOANWORD_HINTS = ['creampie', 'deepthroat', 'facesitting', 'all fours', 'cowgirl'];

/** Profil sémantique exporté pour builder / proc gen (meta.validationProfile). */
export function buildAff5ValidationProfile(protagonistGender = 'male') {
  const isFemale = protagonistGender === 'female';
  return {
    affinity: 5,
    register: 'crude',
    protagonistGender,
    powerDynamicDefault: 'companion_dominant',
    mcAnatomyTerms: isFemale
      ? ['chatte', 'clito', 'clitoris', 'culotte', 'string', 'slip', 'gode', 'doigts en moi']
      : ['verge', 'bite', 'caleçon', 'braguette', 'queue'],
    companionAnatomyTerms: ['chatte', 'clitoris', 'cuisses', 'seins', 'poitrine'],
    forbiddenMcEuphemisms: AFF5_MC_SHARED_EUPHEMISM_PATTERNS.map(({ id }) => id),
    maleOnlyForbidden: isFemale ? [] : ['culotte'],
    femalePenetrationRule:
      'MC femme ne pénètre Lyra que via gode/strap/doigts explicites — pas de « je l\'enfonce » sans jouet',
    pornLoanwordsBridgeOnly: AFF5_PORN_LOANWORD_HINTS,
    domSubVocal: {
      companion_dominant: ['Ne bouge pas', 'Continue', 'Tais-toi', 'Bien'],
      companion_invites: ['Alors fais-le', 'Prends-moi', 'Montre-moi'],
      mutual: ['Ensemble', 'Suis mon rythme'],
    },
  };
}

/** Scène cunnilingus / facesitting — le choix +3 MC femme doit nommer l'acte. */
export const AFF5_FEMALE_ORAL_SCENE =
  /agenouille entre tes cuisses|écarte ta culotte|goûter|chatte.*(?:bouche|visage|langue)|langue.*chatte/i;

export const AFF5_FEMALE_EXPLICIT_MC_TERMS =
  /\b(chatte|clito|lécher|lèche|langue|jouis|jouir|doigts en (?:moi|elle)|frotte.*chatte|chatte contre)\b/i;

export function findAff5FemaleMcEuphemisms(text = '') {
  return AFF5_FEMALE_MC_EUPHEMISM_PATTERNS.filter(({ pattern }) => pattern.test(text));
}

export function findAff5MaleMcEuphemisms(text = '') {
  return AFF5_MALE_MC_EUPHEMISM_PATTERNS.filter(({ pattern }) => pattern.test(text));
}

/** S43 unifié — registre cru textes MC (choix + épilogue), genre-aware. */
export function aff5McPlayerTextRegister(text = '', protagonistGender = 'male', fieldLabel = 'texte MC') {
  const hits =
    protagonistGender === 'female'
      ? findAff5FemaleMcEuphemisms(text)
      : findAff5MaleMcEuphemisms(text);
  if (hits.length > 0) {
    return {
      ok: false,
      reason: `${fieldLabel} trop polisson (${hits.map((h) => h.id).join(', ')}) — ${hits[0].hint}`,
    };
  }
  const enfonce = explicitEnfonceLexiconOk(text, protagonistGender, fieldLabel);
  if (!enfonce.ok) return enfonce;
  return { ok: true };
}

/** Valide le registre cru des textes MC (choix joueur + épilogue), pas Lyra. */
export function aff5FemaleMcPlayerTextRegister(text = '', fieldLabel = 'texte MC') {
  return aff5McPlayerTextRegister(text, 'female', fieldLabel);
}

export function aff5MaleMcPlayerTextRegister(text = '', fieldLabel = 'texte MC') {
  return aff5McPlayerTextRegister(text, 'male', fieldLabel);
}

/** S43/S44 — « enfoncer » exige organe ou jouet explicite (MC + companionAction). */
export const ENFONCE_VERB_PATTERN = /\b(enfonc(?:e|ant|er|ée|ées)|t'enfonç(?:e|ant))\b/i;
export const ENFONCE_ORGAN_PATTERN =
  /\b(bite|verge|queue|gode|strapon|strap-on|doigts? en|chatte|cul|verge en|bite en|gode en|strapon en)\b/i;

export function explicitEnfonceLexiconOk(text = '', protagonistGender = 'male', fieldLabel = 'texte') {
  if (!text.trim() || !ENFONCE_VERB_PATTERN.test(text)) return { ok: true };
  if (ENFONCE_ORGAN_PATTERN.test(text)) return { ok: true };
  if (protagonistGender === 'female' && /\b(je l'enfonce|l'enfonce)\b/i.test(text)) {
    return {
      ok: false,
      reason: `${fieldLabel} — « je l'enfonce » sans gode/strap/doigts (MC femme ne pénètre pas sans jouet explicite)`,
    };
  }
  return {
    ok: false,
    reason: `${fieldLabel} — verbe enfoncer sans organe explicite (bite, verge, gode, doigts en… )`,
  };
}

/** S44 — registre companionAction aff. 5 (miroir S43, 3e personne sur le MC). */
export function aff5CompanionActionRegister(text = '', protagonistGender = 'male', fieldLabel = 'companionAction') {
  const register = aff5McPlayerTextRegister(text, protagonistGender, fieldLabel);
  if (!register.ok) return register;
  return explicitEnfonceLexiconOk(text, protagonistGender, fieldLabel);
}

export function aff5FemaleMcRomanticChoiceExplicitEnough(exchange) {
  const romantic = exchange.choices?.find((choice) => choice.score === 3);
  if (!romantic) return { ok: true };
  const sceneBlob = [exchange.companionAction, exchange.companionLine, exchange.bridge].filter(Boolean).join(' ');
  if (!AFF5_FEMALE_ORAL_SCENE.test(sceneBlob)) return { ok: true };
  if (AFF5_FEMALE_EXPLICIT_MC_TERMS.test(romantic.text)) return { ok: true };
  return {
    ok: false,
    reason:
      'choix +3 (MC) sur scène orale — nommer chatte / lécher / langue (description joueur, pas réplique Lyra)',
  };
}

/** Lyra ne pénètre pas le MC homme (pas de strap / transidentité). — tout texte MC H aff. 5. */
export const AFF5_MALE_MC_LYRA_PENETRATES_MC =
  /\b(t'enfonce dedans|t'enfonce en toi|te pénètre|te baise par derrière en t'enfonçant|glisse sa bite en toi|elle t'enfonce|elle te prend par derrière)\b/i;

/** MC femme : companionAction ne doit pas supposer une bite sur le MC. */
export const AFF5_FEMALE_MC_WRONG_ANATOMY =
  /\b(ta bite|ton sexe dur|enfoncer ta bite|ta queue)\b/i;

export function aff5MaleMcAnatomyOk(text = '', fieldLabel = 'texte') {
  if (!text.trim()) return { ok: true };
  if (AFF5_MALE_MC_LYRA_PENETRATES_MC.test(text)) {
    return {
      ok: false,
      reason: `${fieldLabel} MC homme — Lyra ne pénètre pas le MC (préférer monte sur toi / t'attire en elle / te guide)`,
    };
  }
  return { ok: true };
}

/** @deprecated Préférer aff5MaleMcAnatomyOk */
export function aff5MaleMcActionAnatomyOk(companionAction = '') {
  return aff5MaleMcAnatomyOk(companionAction, 'companionAction');
}

export function aff5FemaleMcActionAnatomyOk(companionAction = '') {
  if (!companionAction.trim()) return { ok: true };
  if (AFF5_FEMALE_MC_WRONG_ANATOMY.test(companionAction)) {
    return {
      ok: false,
      reason: 'companionAction MC femme — anatomie masculine implicite sur le protagoniste',
    };
  }
  return { ok: true };
}

/** Épilogue aff. 5 — narration tu, cohérent avec l'échange. */
export function intimateFinaleIsValid(text = '', affinity = 5) {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, reason: 'intimateFinale vide' };
  if (affinity < 5) return { ok: true };
  if (trimmed.length < 48) {
    return { ok: false, reason: 'intimateFinale trop court pour un épilogue aff. 5' };
  }
  if (trimmed.length > 300) {
    return { ok: false, reason: 'intimateFinale trop long (> 300 car.)' };
  }
  if (!/\b(tu |te |ton |ta |tes |toi\b)\b/i.test(trimmed)) {
    return { ok: false, reason: 'intimateFinale en tu (MC) attendu' };
  }
  if (/\?\s*$/.test(trimmed)) {
    return { ok: false, reason: 'intimateFinale ne doit pas être une question' };
  }
  if (UNNATURAL_LINE_OPENER.test(trimmed)) {
    return { ok: false, reason: 'intimateFinale ouvert par régie (« Fort. »…)' };
  }
  return { ok: true };
}

/** Aff. 5 — épilogue avec réaction Lyra visible (yeux, geste, recul…). */
export const AFF5_FINALE_LYRA_REACTION =
  /\b(yeux amusés|regard amusé|regard sec|regard|te fixe|te toise|te tire|te repousse|recule|se lève|s'écarte|se redresse|se dégage|sourit|sourire|s'essuie|glisse le long|sans un mot|geste calme|te dit|murmure|chuchote|dommage|hâte|fatiguée|chancelante|gémit|serre ton poignet|serre tes cheveux)\b/i;

export function aff5FinaleHasCompanionReaction(text = '') {
  if (!text.trim()) return { ok: false, reason: 'intimateFinale vide' };
  if (AFF5_FINALE_LYRA_REACTION.test(text)) return { ok: true };
  return {
    ok: false,
    reason:
      'intimateFinale aff. 5 — réaction Lyra attendue (yeux amusés, recul, geste sec, regard…)',
  };
}

/** S47 — vecteur acte : Lyra stimule le MC (companionAction + bridge). */
export const SCENE_LYRA_STIMULATES_MC =
  /\b(presse ses doigts contre ta|glisse ses doigts en toi|te lèche|te lécher|lèche ton|lécher ton|écarte ta culotte|doigts entre tes cuisses|contre ta chatte|sur ta chatte|main sous ta robe|main glissée sous ta robe|agenouille entre tes cuisses)\b/i;

/** S47 — MC stimule Lyra (companionAction orienté main/poignet du MC sur Lyra). */
export const SCENE_MC_STIMULATES_LYRA =
  /\b(presse ta main contre sa|écarte les cuisses et presse ta main|serre ton poignet|bouge tes doigts quand je serre ton poignet|cuisses ouvertes sur ton visage)\b/i;

/** Calque H→F : Lyra jouit sur une partie du MC alors que c'est elle qui stimule. */
export const FINALE_LYRA_ORGASM_ON_MC_PARTS =
  /\belle jouit sur (?:tes doigts|ta paume|ta main|ta langue)\b/i;

/**
 * S47 — épilogue aligné sur qui stimule qui (évite calques H/F sur intimateFinale).
 * Heuristique companionAction + bridge ; pas un moteur narratif complet.
 */
export function aff5FinaleAgencyCoherenceOk(exchange, protagonistGender = 'male') {
  const finale = exchange.intimateFinale ?? '';
  if (!finale.trim()) return { ok: true };

  const sceneBlob = [exchange.companionAction, exchange.bridge].filter(Boolean).join(' ');
  const lyraStimulatesMc = SCENE_LYRA_STIMULATES_MC.test(sceneBlob);
  const mcStimulatesLyra = SCENE_MC_STIMULATES_LYRA.test(sceneBlob);

  if (lyraStimulatesMc && !mcStimulatesLyra && FINALE_LYRA_ORGASM_ON_MC_PARTS.test(finale)) {
    return {
      ok: false,
      reason:
        'intimateFinale — « elle jouit sur tes doigts/langue/paume » incohérent : companionAction = Lyra stimule le MC (calque version homme ?)',
    };
  }

  if (
    lyraStimulatesMc &&
    /\b(te lèche|lécher|langue sur|lèche mon|lèche ton clitoris)\b/i.test(sceneBlob) &&
    /\belle jouit sur ta langue\b/i.test(finale)
  ) {
    return {
      ok: false,
      reason:
        'intimateFinale — Lyra lèche le MC ; préférer « tu jouis sur sa langue », pas « elle jouit sur ta langue »',
    };
  }

  if (
    protagonistGender === 'male' &&
    mcStimulatesLyra &&
    !lyraStimulatesMc &&
    /\btu jouis\b/i.test(finale) &&
    !/\belle jouit\b/i.test(finale) &&
    !/\btu jouisses en elle\b/i.test(finale) &&
    !/\btu la remplis\b/i.test(finale)
  ) {
    return {
      ok: false,
      reason:
        'intimateFinale — MC doigte/lèche Lyra dans la scène ; l\'orgasme principal attendu côté Lyra (elle jouit…)',
    };
  }

  return { ok: true };
}

/** FR13 — élision après « que » devant voyelle (je → j'). */
export function frenchElisionAfterQueOk(text = '', fieldLabel = 'texte') {
  if (/\bque je [aeiouhâêéèëï]/i.test(text)) {
    return {
      ok: false,
      reason: `${fieldLabel} — élision après « que » : j'… (ex. jusqu'à ce que j'halète)`,
    };
  }
  return { ok: true };
}

export function companionLineIsAction(exchangeOrLine) {
  if (typeof exchangeOrLine === 'string') {
    const trimmed = exchangeOrLine.trim();
    if (/\?\s*$/.test(trimmed)) return false;
    return ACTION_LINE_PATTERN.test(trimmed);
  }
  const exchange = exchangeOrLine;
  const speech = (exchange.companionLine ?? '').trim();
  const action = (exchange.companionAction ?? '').trim();
  if (speech && /\?\s*$/.test(speech)) return false;
  if (action && companionActionIsThirdPerson(action)) return true;
  if (speech) return ACTION_LINE_PATTERN.test(speech);
  return false;
}

export function choiceRespondsWithAction(text) {
  const lower = text.toLowerCase();
  return (
    text.length >= 10 &&
    /\b(je |j'|j'te |d'accord|lentement|stop|attends|te |tu |m'|t'|plutôt|et si|maintenant|allonge|monte|embrasse|touche|laisse|prends|serre|ouvre|ferme|glisse|enlève|baisse|presse|ralentis|guide|retourne|passe|reste|viens|obéis|suiv|colle|presse|serre|rapproche|m'allonge|m'assois|perds|perdre|signale|tape|fronce|resiste|cède|cede|plaque|enfonce|gémis|gemis|obtempère|obtempere)\b/.test(
      lower,
    )
  );
}

export const JOYFUL_PORTRAIT_EMOTIONS = new Set([
  'happy',
  'playful',
  'romantic',
  'pleased',
  'warm',
  'dry_amused',
  'commanding',
  'heated',
  'dominant',
  'lustful',
]);

/** Cutouts intimes aff. 4–5 — autorisés en réaction même si score 1 (tenue pack). */
export const INTIMATE_PACK_CUTOUT_EMOTIONS = new Set([
  'commanding',
  'heated',
  'dominant',
  'lustful',
]);

export const COMPANION_NAME = 'Lyra';

export function stripSpeechGuillemets(line) {
  return line.replace(/^«\s*/, '').replace(/\s*»$/, '').trim();
}

export function formatSpeech(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('«')) return trimmed;
  const inner = trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
  return `« ${inner} »`;
}

export function formatCompanionPromptLine(companionName, prompt) {
  return `${companionName} : ${stripSpeechGuillemets(prompt)}`;
}

export function formatCompanionReactionLine(companionName, reaction) {
  return `${companionName} : ${stripSpeechGuillemets(reaction)}`;
}

export function companionLineReadsComplete(line) {
  const trimmed = line.trim().replace(/\.$/, '').trim();
  if (!trimmed) return false;

  const sentences = trimmed.split(/\.\s+/).map((part) => part.trim()).filter(Boolean);
  for (let index = 0; index < sentences.length; index += 1) {
    const fragment = sentences[index].replace(/\.$/, '').trim();
    if (/^tout$/i.test(fragment)) return false;
    if (/^maintenant$/i.test(fragment) && index < sentences.length - 1) {
      const previous = sentences[index - 1]?.replace(/\.$/, '').trim() ?? '';
      if (
        /(?:e-moi|e-toi|ons|ez|-moi|-toi|entre|viens|garde|presse|encule|enlève|serre|lèche|suce|bouge|reste|tais|jouis|goûte|dis|tape|continue|accélère|ralentis)$/i.test(
          previous,
        )
      ) {
        continue;
      }
      return false;
    }
  }
  const lastSentence = sentences[sentences.length - 1] ?? trimmed;
  const last = lastSentence.replace(/\.$/, '').trim();
  if (/^maintenant$/i.test(last)) {
    const previous = sentences[sentences.length - 2]?.replace(/\.$/, '').trim() ?? '';
    if (/\b(je |j'|tu |veux|enlève|garde|viens|laisse|dis|note)\b/i.test(previous)) {
      return true;
    }
  }

  if (/^une ligne,\s*demain$/i.test(last)) return false;
  if (/^une ligne$/i.test(last)) return false;
  if (/^je te tiens (?:là|ici)$/i.test(last)) return false;
  if (/^(demain|hier|plus tard|après|ce soir)$/i.test(last)) return false;

  const afterLastComma = last.includes(',') ? (last.split(',').pop()?.trim() ?? '') : '';
  if (afterLastComma && /^(demain|hier|plus tard|après|ce soir)$/i.test(afterLastComma)) return false;

  if (/^ne \S+ pas$/i.test(last)) return true;

  const imperativeVerb =
    /\b(note|trouve|regarde|dis|apporte|rapporte|laisse|viens|dis-moi|écris|observe|garde|lâche|bouge|commence|goûte|enlève|serre|reste|suis|tais|jouis|ferme|tape|presse|touche|mène|assieds|rapproche|embrasse|signale|ferme)\b/i;
  const hasVerbOrQuestion =
    imperativeVerb.test(last) || /\b(tu |vous |est-ce|peux|veux|as-tu)\b/i.test(last) || /\?/.test(last);
  const wordCount = last.split(/\s+/).filter(Boolean).length;
  if (/\btiens (?:là|ici)$/i.test(last) && wordCount <= 4) return false;
  if (wordCount <= 3 && !hasVerbOrQuestion) return false;

  return true;
}

export function reactionPortraitEmotion(choice) {
  const tagged = choice.emotion;
  if (choice.score >= 2) {
    return tagged ?? 'happy';
  }
  if (tagged && INTIMATE_PACK_CUTOUT_EMOTIONS.has(tagged)) {
    return tagged;
  }
  if (tagged && !JOYFUL_PORTRAIT_EMOTIONS.has(tagged)) {
    return tagged;
  }
  return 'annoyed';
}

export function shuffleChoices(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function orderDialogueChoicesDev(choices) {
  return [...choices].sort((left, right) => right.score - left.score);
}

export function normalizeDisplayText(text) {
  return text
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Compare corpus vs doc affichée (formatSpeech retire le point terminal). */
export function normalizeCorpusLine(text) {
  return normalizeDisplayText(text).replace(/[.!?…]+$/u, '');
}

export function fiveWordOpener(text) {
  return text.toLowerCase().split(/\s+/).slice(0, 5).join(' ');
}

export function parseDocExchanges(docText) {
  const exchanges = [];
  const parts = docText.split(/^## (\d{2}) — /m);
  for (let index = 1; index < parts.length; index += 2) {
    const num = parts[index];
    const body = parts[index + 1] ?? '';
    if (num === 'Packs' || body.startsWith('Packs de session')) break;
    const contextMatch = body.match(/\*\*Contexte\*\*\s*\r?\n([^\r\n]+)/);
    const lyraBlock = body.match(/\*\*Lyra\*\*\s*\r?\n([\s\S]+?)(?:\r?\n\r?\n|\r?\n\|)/);
    let companionLine = lyraBlock?.[1]?.trim() ?? null;
    if (companionLine?.startsWith('«') && companionLine.endsWith('»')) {
      companionLine = companionLine.slice(1, -1).trim();
    }
    exchanges.push({
      num,
      bridge: contextMatch?.[1]?.trim() ?? null,
      companionLine,
    });
  }
  return exchanges;
}

export function assertCompanionLineCompleteRegression() {
  const bad =
    "Avant que la file s'allonge : note un endroit au havre où le mana se perd. Une ligne, demain.";
  const ok =
    "Avant que la file s'allonge : note un endroit au havre où le mana se perd. Une ligne, demain matin.";
  if (companionLineReadsComplete(bad)) {
    throw new Error('Régression : consigne fragmentée ne doit pas passer (Une ligne, demain.)');
  }
  if (!companionLineReadsComplete('Encule-moi maintenant — je te veux, je guide.')) {
    throw new Error('Régression : impératif + maintenant (tiret) rejeté à tort');
  }
  if (companionLineReadsComplete('Enlève ta chemise. Tout. Maintenant.')) {
    throw new Error('Régression : « Tout. Maintenant. » doit échouer B7');
  }
  if (!companionLineReadsComplete('Enlève ta chemise. Je veux tout voir. Maintenant.')) {
    throw new Error('Régression : réplique Lyra complète rejetée à tort');
  }
  if (corpusLexiconOk({ bridge: 'mêle thé et chaleur de peau' }).ok) {
    throw new Error('Régression : L5 chaleur de peau doit échouer S38');
  }
  if (corpusLexiconOk({ bridge: 'sa chambre sent le thé et la chaleur du corps' }).ok) {
    throw new Error('Régression : L5/L6 chaleur du corps + sent doit échouer S38');
  }
  if (!corpusLexiconOk({ bridge: 'Sa chambre sent le thé. Une tension électrique flotte dans l\'air.' }).ok) {
    throw new Error('Régression : bridge tension électrique rejeté à tort');
  }
  if (!companionLineReadsComplete(ok)) {
    throw new Error('Régression : consigne complète rejetée à tort (demain matin).');
  }
}

export function assertCompanionLineSpokenRegression() {
  const bad = 'Fort. Sans parler. Jusqu\'à ce que tu jouisses.';
  const ok = 'Tais-toi. Je mène. Toi, tu jouis.';
  if (companionLineIsSpokenDialogue(bad, 5).ok) {
    throw new Error('Régression : didascalie « Fort. » ne doit pas passer S20');
  }
  if (!companionLineIsSpokenDialogue(ok, 5).ok) {
    throw new Error('Régression : réplique parlée « Tais-toi. Je mène. » rejetée à tort');
  }
}

export function assertAff5MaleMcAnatomyRegression() {
  const badAction = 'Elle te retourne contre la commode et t\'enfonce dedans par derrière.';
  const okAction = 'Elle se penche contre la commode et t\'attire en elle par derrière.';
  const badFinale = 'Elle t\'enfonce jusqu\'au fond, hanches brûlantes.';
  const okFinale = 'Tu jouis profondément en elle tandis qu\'elle monte plus fort.';
  if (aff5MaleMcAnatomyOk(badAction).ok) {
    throw new Error('Régression : Lyra pénètre MC homme doit échouer S27');
  }
  if (!aff5MaleMcAnatomyOk(okAction).ok) {
    throw new Error('Régression : MC homme guide en elle rejeté à tort');
  }
  if (aff5MaleMcAnatomyOk(badFinale, 'intimateFinale').ok) {
    throw new Error('Régression : intimateFinale Lyra pénètre MC homme doit échouer S27');
  }
  if (!aff5MaleMcAnatomyOk(okFinale, 'intimateFinale').ok) {
    throw new Error('Régression : intimateFinale MC actif rejeté à tort');
  }
}

export function assertPowerDynamicRegression() {
  const badDom = {
    powerDynamic: 'companion_dominant',
    companionLine: 'Tais-toi. Je mène.',
    choices: [{ score: 3, text: 'Je l\'enfonce fort et je la baise jusqu\'à ce qu\'on soit vidés.' }],
  };
  const okDom = {
    powerDynamic: 'companion_dominant',
    companionLine: 'Tais-toi. Je mène.',
    choices: [{ score: 3, text: 'Je cède à sa main et je la laisse mener jusqu\'à ce qu\'on jouisse.' }],
  };
  const okInvite = {
    powerDynamic: 'companion_invites',
    companionLine: 'Commence.',
    choices: [{ score: 3, text: 'Je la tire sur moi et je la baise jusqu\'à l\'aube.' }],
  };
  if (powerDynamicChoiceAligned(badDom).ok) {
    throw new Error('Régression : +3 MC dom sur companion_dominant doit échouer S29');
  }
  if (!powerDynamicChoiceAligned(okDom).ok) {
    throw new Error('Régression : +3 MC cède sur companion_dominant rejeté à tort');
  }
  if (!powerDynamicChoiceAligned(okInvite).ok) {
    throw new Error('Régression : +3 MC actif sur companion_invites rejeté à tort');
  }
}

export function assertAff5FemaleMcRegisterRegression() {
  const bad = 'Je m\'allonge et je la laisse m\'embrasser entre les cuisses sans attendre.';
  const ok = 'Je m\'allonge et je la laisse me lécher la chatte sans attendre.';
  if (aff5FemaleMcPlayerTextRegister(bad).ok) {
    throw new Error('Régression : euphémisme MC femme aff. 5 doit échouer S43');
  }
  if (!aff5FemaleMcPlayerTextRegister(ok).ok) {
    throw new Error('Régression : choix MC cru légitime rejeté à tort');
  }
  if (aff5FemaleMcPlayerTextRegister('Je presse ma peau nue contre la sienne.').ok) {
    throw new Error('Régression : peau nue contre MC femme doit échouer S43/X1');
  }
  if (explicitEnfonceLexiconOk('Je l\'enfonce sans attendre.', 'male').ok) {
    throw new Error('Régression : je l\'enfonce sans bite/verge doit échouer S43');
  }
  if (!explicitEnfonceLexiconOk('Je lui enfonce ma bite sans attendre.', 'male').ok) {
    throw new Error('Régression : je lui enfonce ma bite rejeté à tort');
  }
}

export function assertAff5MaleMcRegisterRegression() {
  const bad = 'Je jette mon pantalon et ma culotte et je presse ma peau nue contre la sienne.';
  const ok = 'Je jette mon pantalon et mon caleçon et je presse ma verge contre sa peau brûlante.';
  if (aff5MaleMcPlayerTextRegister(bad).ok) {
    throw new Error('Régression : culotte / peau nue MC homme doit échouer S43');
  }
  if (!aff5MaleMcPlayerTextRegister(ok).ok) {
    throw new Error('Régression : registre cru MC homme rejeté à tort');
  }
  const badMountReaction = {
    companionAction: 'Elle prend ta bite en elle, d\'un geste lent puis profond.',
    choices: [{ tone: 'romantic', score: 3, text: 'J\'agrippe ses hanches.', reaction: '« Ne bouge plus. Je descends sur toi. »' }],
  };
  if (reactionMatchesPenetrationProgress(badMountReaction.choices[0], badMountReaction).ok) {
    throw new Error('Régression : je descends sur toi alors qu\'elle est déjà montée doit échouer S44');
  }
}

export function assertAff5FinaleAgencyRegression() {
  const badFmcFinale = {
    companionAction: 'Elle t\'attire contre la table, écarte tes cuisses et presse ses doigts contre ta chatte par-dessus le tissu.',
    bridge: 'Toujours à la bibliothèque…',
    intimateFinale: 'Ta vision se trouble ; elle jouit sur tes doigts, chatte luisante.',
  };
  if (aff5FinaleAgencyCoherenceOk(badFmcFinale, 'female').ok) {
    throw new Error('Régression : elle jouit sur tes doigts en scène Lyra→MC doit échouer S47');
  }
  const okFmcFinale = {
    ...badFmcFinale,
    intimateFinale: 'Rose sous la lampe ; ses doigts sur ta chatte jusqu\'à ce que tu halètes — elle recule, yeux amusés.',
  };
  if (!aff5FinaleAgencyCoherenceOk(okFmcFinale, 'female').ok) {
    throw new Error('Régression : épilogue FMC Lyra→MC rejeté à tort');
  }
  if (frenchElisionAfterQueOk('jusqu\'à ce que je halète').ok) {
    throw new Error('Régression : que je halète doit échouer FR13');
  }
  if (!frenchElisionAfterQueOk('jusqu\'à ce que j\'halète').ok) {
    throw new Error('Régression : que j\'halète rejeté à tort');
  }
}

export function assertActionChoiceAgencyRegression() {
  const bad = {
    companionAction: 'Elle t\'attire contre elle, doigts entre tes cuisses.',
    choices: [{ score: 3, text: 'Je la prends fort maintenant.' }],
  };
  const ok = {
    companionAction: 'Elle t\'attire contre elle, doigts entre tes cuisses.',
    choices: [{ score: 3, text: 'Je me cambre contre sa main et je la laisse mener.' }],
  };
  if (actionChoiceAgencyAligned(bad).ok) {
    throw new Error('Régression : MC prend Lyra alors qu\'elle mène sur le MC');
  }
  if (!actionChoiceAgencyAligned(ok).ok) {
    throw new Error('Régression : MC réactif à la main de Lyra rejeté à tort');
  }
}

export function assertChoiceDifferentiationRegression() {
  const badBehavior = {
    answerRule: 'action',
    choices: [
      { tone: 'romantic', text: 'Je jette ma culotte et je presse contre elle.' },
      { tone: 'sincere', text: 'Je descends ma culotte lentement et je presse contre elle.' },
      { tone: 'direct', text: 'Je glisse ma culotte lentement et je signale si ça brûle.' },
      { tone: 'playful', text: 'D\'abord je feins de garder ma culotte, puis je cède.' },
    ],
  };
  const badShared = {
    answerRule: 'action',
    choices: [
      { tone: 'romantic', text: 'Je presse ma peau nue contre la sienne sans attendre.' },
      { tone: 'sincere', text: 'Je signale puis je presse ma peau nue contre la sienne.' },
      { tone: 'direct', text: 'Je garde ma culotte trente secondes.' },
      { tone: 'playful', text: 'D\'abord je feins de reculer.' },
    ],
  };
  const ok = {
    answerRule: 'action',
    choices: [
      { tone: 'romantic', text: 'Je jette ma culotte d\'un coup et je colle mon corps au sien.' },
      { tone: 'sincere', text: 'Je glisse ma culotte lentement, puis je serre sa taille contre moi.' },
      { tone: 'direct', text: 'Je garde ma culotte trente secondes, puis je la jette au sol.' },
      { tone: 'playful', text: 'D\'abord je feins de garder ma culotte pour la frustrer, puis je cède.' },
    ],
  };
  if (choicesToneBehaviorContract(badBehavior).ok) {
    throw new Error('Régression : choix direct sans marqueur retard doit échouer S35 tone contract');
  }
  if (choicesSharedPhraseAligned(badShared, 4).ok) {
    throw new Error('Régression : phrase partagée 4+ mots doit échouer S35');
  }
  if (!choicesToneBehaviorContract(ok).ok || !choicesSharedPhraseAligned(ok, 4).ok) {
    throw new Error('Régression : choix différenciés rejetés à tort');
  }
  if (!romanticSincereDistinct(ok).ok) {
    throw new Error('Régression : romantic/sincere distinct rejeté à tort');
  }
}

export function assertActionChoiceWardrobeRegression() {
  const badStrip = {
    companionAction: 'Elle arrache ta culotte d\'un geste, presse sa poitrine nue contre la tienne.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je jette ma robe et je presse ma peau nue contre la sienne.' }],
  };
  const badChoice = {
    companionAction: 'Elle arrache ta robe d\'un geste, presse sa poitrine nue contre la tienne.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je jette ma robe et je presse ma peau nue contre la sienne.' }],
  };
  const okWardrobe = {
    companionAction: 'Elle arrache ta robe d\'un geste, presse sa poitrine nue contre la tienne.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je jette ma culotte et je presse ma peau nue contre la sienne.' }],
  };
  if (actionChoiceWardrobeLayerOk(badStrip).ok) {
    throw new Error('Régression : Lyra arrache culotte en premier doit échouer S34');
  }
  if (actionChoiceWardrobeLayerOk(badChoice).ok) {
    throw new Error('Régression : +3 jette robe après arrachage robe doit échouer S34');
  }
  if (!actionChoiceWardrobeLayerOk(okWardrobe).ok) {
    throw new Error('Régression : +3 jette culotte après arrachage robe rejeté à tort');
  }
}

export function assertReactionPortraitRegression() {
  const playfulLow = reactionPortraitEmotion({ score: 1, emotion: 'playful' });
  if (playfulLow !== 'annoyed') {
    throw new Error('Régression : playful + score 1 doit mapper vers annoyed');
  }
  const shyLow = reactionPortraitEmotion({ score: 0, emotion: 'shy' });
  if (shyLow !== 'shy') {
    throw new Error('Régression : shy + score 0 doit conserver shy');
  }
  const happyHigh = reactionPortraitEmotion({ score: 3, emotion: 'happy' });
  if (happyHigh !== 'happy') {
    throw new Error('Régression : score 3 doit conserver happy');
  }
}

export function assertOrderDialogueChoicesRegression() {
  const choices = [
    { tone: 'romantic', score: 0, text: 'a' },
    { tone: 'playful', score: 1, text: 'b' },
    { tone: 'direct', score: 2, text: 'c' },
    { tone: 'sincere', score: 3, text: 'd' },
  ];
  const devOrdered = orderDialogueChoicesDev(choices);
  if (devOrdered.map((c) => c.score).join(',') !== '3,2,1,0') {
    throw new Error('Régression : ordre dev doit être 3,2,1,0');
  }
  let sawDifferentOrder = false;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const shuffled = shuffleChoices(choices);
    if (shuffled.map((c) => c.score).join(',') !== '3,2,1,0') {
      sawDifferentOrder = true;
      break;
    }
  }
  if (!sawDifferentOrder) {
    throw new Error('Régression : shuffle prod doit pouvoir permuter les scores');
  }
}

export function assertTemporalCoherenceRegression() {
  const badKneel = {
    companionAction: 'Elle te pousse à genoux devant elle, cuisses ouvertes sur ton visage.',
    companionLine: 'Goûte. Ne relève pas les yeux.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: "D'un coup je m'agenouille et glisse ma bouche entre ses cuisses.",
        reaction: '« À genoux, alors. Ne t\'arrête pas. »',
      },
    ],
  };
  const badReaction = {
    companionAction: 'Elle presse ta main contre sa chatte mouillée.',
    companionLine: 'Bouge tes doigts quand je serre ton poignet.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je caresse son clitoris jusqu\'à ce qu\'elle tremble.',
        reaction: '« Alors fais-le. Pas de mots après. »',
      },
    ],
  };
  const badImmobility = {
    companionLine: 'Ne bouge pas encore. Je te garde contre la porte.',
    companionAction: 'Elle te plaque contre la porte du fond.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je reste immobile contre la porte sans bouger.',
        reaction: '« Alors viens. J\'ai déjà envie de toi. »',
      },
    ],
  };
  const okOral = {
    companionAction: 'Elle te pousse à genoux devant elle, cuisses ouvertes sur ton visage.',
    companionLine: 'Goûte. Ne relève pas les yeux.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je lèche son clitoris sans relever les yeux.',
        reaction: '« Bien. Continue. Tais-toi. »',
      },
    ],
  };
  if (exchangeTemporalCoherenceOk(badKneel).ok) {
    throw new Error('Régression : choix « je m\'agenouille » après push à genoux doit échouer S36');
  }
  if (exchangeTemporalCoherenceOk(badReaction).ok) {
    throw new Error('Régression : « Alors fais-le » après acte décrit doit échouer S37');
  }
  if (exchangeTemporalCoherenceOk(badImmobility).ok) {
    throw new Error('Régression : « Ne bouge pas » + « Alors viens » doit échouer S37');
  }
  if (!exchangeTemporalCoherenceOk(okOral).ok) {
    throw new Error('Régression : choix oral continu rejeté à tort');
  }
  if (corpusLexiconOk({ bridge: 'Porte du lit à claire-voie.' }).ok) {
    throw new Error('Régression : claire-voie doit échouer S38');
  }
  const badStrip = {
    companionLine: 'Enlève le tissu. Tout. Maintenant.',
    companionAction: 'Elle te tire sur le lit.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je la touche sur la peau nue et je la presse contre les draps.',
        reaction: '« Touche. »',
      },
    ],
  };
  const okStrip = {
    companionLine: 'Enlève ta chemise. Tout. Maintenant.',
    companionAction: 'Elle te tire sur le lit.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je jette ma chemise et mon pantalon, peau nue contre elle.',
        reaction: '« Bien. »',
      },
    ],
  };
  if (romanticChoiceObeysStripConsigne(badStrip).ok) {
    throw new Error('Régression : +3 toucher sans se déshabiller doit échouer S39');
  }
  if (!romanticChoiceObeysStripConsigne(okStrip).ok) {
    throw new Error('Régression : +3 strip légitime rejeté à tort');
  }
}

export function assertNarrativeEconomyRegression() {
  const badBridge = {
    bridge: 'Lyra vient de tirer le verrou.',
    companionAction: 'Elle tire le verrou et te plaque contre la porte.',
    companionLine: 'Ne bouge pas.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je reste immobile.', reaction: '« Bien. »' }],
  };
  const badLine = {
    bridge: 'À la bibliothèque.',
    companionAction: 'Elle te plaque contre la porte du fond.',
    companionLine: 'Je te garde contre la porte.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je reste immobile.', reaction: '« Bien. »' }],
  };
  const badReaction = {
    companionAction: 'Elle te plaque contre la porte.',
    companionLine: 'Ne bouge pas encore.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je reste immobile et je la laisse coller son corps au mien jusqu\'à ce qu\'elle serre mes hanches.',
        reaction: '« Bien. Je serre plus fort. »',
      },
    ],
  };
  const okReaction = {
    companionAction: 'Elle te plaque contre la porte du fond.',
    companionLine: 'Ne bouge pas encore.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je reste immobile contre la porte.',
        reaction: '« Bien. Reste là. » *Elle serre tes hanches contre la porte.*',
      },
    ],
  };
  if (bridgeActionSemanticOverlapOk(badBridge).ok) {
    throw new Error('Régression : verrou bridge+action doit échouer S40a');
  }
  if (companionLineActionRedundancyOk(badLine).ok) {
    throw new Error('Régression : line/action porte doit échouer S40b');
  }
  if (reactionChoiceSemanticRedundancyOk(badReaction.choices[0]).ok) {
    throw new Error('Régression : « je serre plus fort » redondant doit échouer S40c');
  }
  if (!exchangeNarrativeEconomyOk(okReaction).ok) {
    throw new Error('Régression : réaction + didascalie légitime rejetée à tort');
  }
  if (corpusLexiconOk({ intimateFinale: 'comme si la bibliothèque venait de se refermer.' }).ok) {
    throw new Error('Régression : L4 finale bibliothèque doit échouer S38');
  }
  const badFlipOnTop = {
    companionAction: 'Elle jette le peignoir, te tire sur le lit et s\'allonge sur ton torse.',
    companionLine: 'Enlève ta chemise. Je veux tout voir. Maintenant.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je jette ma chemise et je la presse contre les draps.',
        reaction: '« Bien. Presse-toi contre moi. »',
      },
    ],
  };
  if (romanticChoiceRespectsCompanionOnTop(badFlipOnTop).ok) {
    throw new Error('Régression : +3 plaque Lyra alors qu\'elle est au-dessus doit échouer S41');
  }
  const badSelfStripPinned = {
    companionAction: 'Elle s\'assoit à califourchon sur tes hanches, doigts sur les boutons de ta chemise.',
    companionLine: 'Laisse-toi faire. Ne bouge pas — je veux tout voir.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je jette ma chemise et mon pantalon d\'un coup.',
        reaction: '« Bien. »',
      },
    ],
  };
  if (!companionLineOrdersSelfStripWhilePinned(badSelfStripPinned).ok) {
    throw new Error('Régression : laisse-toi faire + califourchon ne doit pas échouer companionLineOrdersSelfStripWhilePinned');
  }
  if (romanticChoiceRespectsCompanionUndressing(badSelfStripPinned).ok) {
    throw new Error('Régression : +3 auto-strip alors que Lyra déshabille doit échouer S42');
  }
  const badPinnedOrderStrip = {
    companionAction: 'Elle s\'allonge sur ton torse, peau nue contre ta chemise.',
    companionLine: 'Enlève ta chemise. Je veux tout voir.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je reste immobile sous elle.', reaction: '« Bien. »' }],
  };
  if (companionLineOrdersSelfStripWhilePinned(badPinnedOrderStrip).ok) {
    throw new Error('Régression : enlève ta chemise alors qu\'elle est au-dessus doit échouer S42');
  }
}

export function assertSceneLogicRegression() {
  const badSpatial = {
    bridge: 'Lyra pousse la porte de la chambre ; vous êtes déjà nues sur le lit.',
    companionAction: 'Elle claque la porte, te pousse sur le matelas et s\'étale sur toi.',
    companionLine: 'Bouge.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je reste immobile sous elle.', reaction: '« Bien. »' }],
  };
  const badDomLine = {
    bridge: 'Sur le toit, avant l\'aube.',
    companionAction: 'Elle s\'étale sur toi, genoux de chaque côté.',
    companionLine: 'Commence. On a toute la nuit devant nous.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je reste immobile sous elle.', reaction: '« Bien. »' }],
  };
  const badEx10 = {
    bridge: 'Sur le toit du havre, avant l\'aube ; Lyra déroule une couverture.',
    companionAction: 'Elle s\'étale sur toi, genoux de chaque côté.',
    companionLine: 'Commence. On a toute la nuit devant nous.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je la tire sur moi jusqu\'à ce qu\'elle jouisse avant l\'aube.',
        reaction: '« Alors presse-toi plus fort. Toute la nuit. »',
      },
      {
        tone: 'direct',
        score: 1,
        text: 'Je la retiens une minute sur le dos.',
        reaction: '« Continue. »',
      },
      {
        tone: 'playful',
        score: 0,
        text: 'D\'abord je feins de lutter pour l\'oreiller, puis je la reprends plus fort.',
        reaction: '« Bien. »',
      },
    ],
  };
  if (bridgeActionSpatialClashOk(badSpatial).ok) {
    throw new Error('Régression : déjà au lit + porte/matelas doit échouer S48');
  }
  if (companionLineDominanceAligned(badDomLine).ok) {
    throw new Error('Régression : Commence + Lyra au-dessus doit échouer S48');
  }
  if (exchangeSceneLogicOk(badEx10).ok) {
    throw new Error('Régression : ex.10 incohérences (tire sur moi, aube, oreiller, réaction) doit échouer S48');
  }
  const okEx10 = {
    bridge: 'Sur le toit du havre, avant l\'aube ; Lyra déroule une couverture.',
    companionAction: 'Elle s\'étale sur toi, genoux de chaque côté.',
    companionLine: 'Bouge quand je te le dis. Ne me repousse pas.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je presse mes hanches contre les siennes et je la laisse mener le rythme jusqu\'à ce qu\'elle jouisse.',
        reaction: '« Continue. Là. Ne t\'arrête pas avant que je jouisse. »',
      },
      {
        tone: 'direct',
        score: 1,
        text: 'Je retiens ses hanches une minute, puis je la bascule sur le dos à côté de moi.',
        reaction: '« Retourne-moi si tu peux. »',
      },
    ],
  };
  if (!exchangeSceneLogicOk(okEx10).ok) {
    throw new Error(`Régression : ex.10 corrigé rejeté à tort — ${exchangeSceneLogicOk(okEx10).reason}`);
  }
  const badBridgeOverlap = {
    bridge: 'Sur le matelas, chattes déjà collées ; elle serre ta taille, ongles légers dans ton dos, rythme qui accélère.',
    companionAction: 'Elle serre ta taille entre ses cuisses, ongles légers dans ton dos, rythme qui accélère.',
    companionLine: 'Tape mon poignet.',
    choices: [{ tone: 'romantic', score: 3, text: 'Je continue.', reaction: '« Bien. »' }],
  };
  if (bridgeActionPhraseOverlapOk(badBridgeOverlap).ok) {
    throw new Error('Régression : bridge/action ongles légers doit échouer S49a');
  }
  const badSignalFrotte = {
    companionAction: 'Elle frotte sa chatte contre la tienne, main enfoncée dans tes cheveux.',
    companionLine: 'Ne bouge pas encore — je mène.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je la laisse frotter dès qu\'elle me le signale.',
        reaction: '« Bien. »',
      },
    ],
  };
  if (choiceSignalCoherentWithAction(badSignalFrotte.choices[0], badSignalFrotte).ok) {
    throw new Error('Régression : signale + frotte doit échouer S49b');
  }
  const badPresseToi = {
    companionAction: 'Elle frotte son clitoris contre le tien.',
    companionLine: 'Ne bouge pas.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je m\'allonge immobile et je la laisse frotter.',
        reaction: '« Alors presse-toi. Ne te retiens pas. »',
      },
    ],
  };
  if (reactionDomActiveCoherenceOk(badPresseToi.choices[0], badPresseToi).ok) {
    throw new Error('Régression : presse-toi + Lyra frotte doit échouer S49c');
  }
  if (frenchStringGenderOk('Enlève ta string.').ok) {
    throw new Error('Régression : ta string doit échouer FR14');
  }
  const okSubmit = {
    powerDynamic: 'companion_dominant',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Je reste allongé, immobile — j\'attends qu\'elle serre mes hanches pour glisser en elle.',
        reaction: '« Bien. »',
      },
    ],
  };
  if (!powerDynamicChoiceAligned(okSubmit).ok) {
    throw new Error('Régression : je reste allongé + j\'attends qu\'elle doit passer S29');
  }
  const badOralOrder = {
    companionAction: 'Elle s\'agenouille et prend ta bite dans sa bouche.',
    companionLine: 'Ne bouge pas.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Dos à la rambarde, immobile, je la laisse sucer ma bite.',
        reaction: '« Continue. Avale. Ne t\'arrête pas. »',
      },
    ],
  };
  if (reactionMcPassiveCoherenceOk(badOralOrder.choices[0], badOralOrder).ok) {
    throw new Error('Régression : Continue. Avale. + Lyra suce doit échouer S37b');
  }
  const okOral = {
    companionAction: 'Elle s\'agenouille et prend ta bite dans sa bouche.',
    companionLine: 'Ne bouge pas.',
    choices: [
      {
        tone: 'romantic',
        score: 3,
        text: 'Immobile, je la laisse sucer ma bite.',
        reaction: '« Laisse-toi… aller. J\'avale. »',
      },
    ],
  };
  if (!reactionMcPassiveCoherenceOk(okOral.choices[0], okOral).ok) {
    throw new Error('Régression : Laisse-toi aller. J\'avale. rejeté à tort');
  }
}

export function runBuiltInRegressions() {
  assertCompanionLineCompleteRegression();
  assertCompanionLineSpokenRegression();
  assertAff5FemaleMcRegisterRegression();
  assertAff5MaleMcRegisterRegression();
  assertAff5FinaleAgencyRegression();
  assertAff5MaleMcAnatomyRegression();
  assertPowerDynamicRegression();
  assertActionChoiceAgencyRegression();
  assertActionChoiceWardrobeRegression();
  assertChoiceDifferentiationRegression();
  assertReactionPortraitRegression();
  assertOrderDialogueChoicesRegression();
  assertTemporalCoherenceRegression();
  assertNarrativeEconomyRegression();
  assertSceneLogicRegression();
}
