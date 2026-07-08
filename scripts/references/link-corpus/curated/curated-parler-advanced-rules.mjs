/**
 * Règles avancées Parler curé — S50+, FM*, LQ6, partagées validate / walk.
 */
import { normalizeCorpusLine, jaccardSimilarity } from './curated-parler-semantics-lib.mjs';
import {
  SPOKEN_VISITOR_FACING_PATTERN,
  exchangeSpectatorPresent,
  extractReactionSpokenParts,
  bridgeActionSpatialClashOk,
  aff5FemaleMcActionAnatomyOk,
  aff5MaleMcAnatomyOk,
  aff5McPlayerTextRegister,
  isActionOrientedAffinity,
} from './curated-parler-lib.mjs';

/** Lyra parle intime au MC devant spectateur (walk WALK-SPEC-INT). */
export const MC_INTIMATE_LINE_WITH_SPECTATOR =
  /\b(je te veux|tu es ma chose|continue\s*[—–-]\s*(?:mais|ce soir)|encule-moi|en mon cul|sers mes|poignet\.?\s*tu|signal au poignet\.?\s*tu)\b/i;

const VISITOR_REACTION_QUOTE =
  /(je vous|vous |remarquez|entrez|asseyez|bonjour|monsieur|madame|instant|réserve|gravure|registre|figurent|colonne|filigrane|amendes|tarifs|demain matin|je peux vous|je suis la bibliothécaire|je suis la marchande|je suis la forgeronne|je note|je consulte|je finis|comme indiqué|voici|section|entendu|pardon|voilà|assieds|oui \?|crédit|comptant|deal|marché|forge|commande|mesure|lame|forgeronne|marchande|colonne quatre|colonne sept)/i;

const REACTION_QUOTE_SIMILARITY_THRESHOLD = 0.68;

/** Prolepse « pack suivant » — interdit mid-pack (OK dernier échange / rôle visiteur). */
const LOW_FINALE_VICTORY_TONE =
  /\b(parfait|magnifique|bravo|comme il faut|bien joué|je suis fière|tu as (?:bien|si bien)|satisfaite|exactement ce que je voulais|magnifiquement)\b/i;

/** S57 — émotion +3 romantic attendue par pack (Lyra aff. 5 — généralisable par compagnon). */
export const PACK_ROMANTIC_EMOTION_BY_PACK = {
  'pack-1': /^(commanding|firm|focused|annoyed|dismissive|warm)$/i,
  'pack-2': /^(heated|warm|pleased|firm|focused|lustful)$/i,
  'pack-3': /^(dominant|commanding|firm|focused|heated|lustful)$/i,
  'pack-4': /^(lustful|heated|dominant|commanding)$/i,
  'pack-5': /^(lustful|heated|warm|firm|annoyed|pleased|dominant)$/i,
};

export function corpusHasIntimateFinales(data) {
  return (data.exchanges ?? []).some(
    (ex) => ex.intimateFinale?.trim() || ex.intimateFinaleLow?.trim(),
  );
}

export function corpusSupportsPackWalk(data) {
  return (data.meta?.sessionPacks?.length ?? 0) > 0 && corpusHasIntimateFinales(data);
}

const FMC_NARRATIVE_FIELDS = [
  'bridge',
  'companionAction',
  'companionLine',
  'intimateFinale',
  'intimateFinaleLow',
];

/** ex. 01–09 aff. 5 — anti-calque narratif FMC (complète FM2 anatomie). */
const FMC_NQ_EXCHANGE_NUMBER_MAX = 9;
const FMC_BRIDGE_CALQUE_FAIL = 0.72;
const FMC_ACTION_CALQUE_FAIL = 0.58;

export const FMC_PACK_BUSINESS_RULES = {
  '01': {
    label: 'bibliothèque / verrou',
    bridge: /\b(bibliothèque|verrou|port|rayons)\b/i,
  },
  '02': {
    label: 'table pack-1 — MC assise',
    bridge: /\btable\b/i,
    romantic: /\b(chatte|clitoris|paume|table)\b/i,
    forbid: /\b(bite|braguette|en moi)\b/i,
  },
  '03': {
    label: 'oral sur table pack-1',
    bridge: /\btable\b/i,
    action: /\b(cuisses|clitoris|chatte|culotte|langue|lécher|genoux)\b/i,
    romantic: /\b(lécher|lèche|langue|chatte|clitoris)\b/i,
    forbid: /\b(bite|braguette)\b/i,
  },
  '04': {
    label: 'chambre / peignoir / draps',
    bridge: /\b(chambre|peignoir|draps|havre)\b/i,
    action: /\b(robe|draps|culotte|chatte|genoux)\b/i,
    forbid: /\b(braguette|chemise|bite)\b/i,
  },
  '05': {
    label: 'lit / frottement chatte',
    bridge: /\b(draps|lit)\b/i,
    action: /\b(chatte|frotte|clitoris|cuisse)\b/i,
    romantic: /\b(chatte|frotte|clitoris)\b/i,
    forbid: /\b(bite|braguette)\b/i,
  },
  '06': {
    label: 'lit / doigts FMC',
    bridge: /\blit\b/i,
    action: /\b(doigts|chatte|en toi|lit)\b/i,
    forbid: /\b(bite|braguette)\b/i,
  },
  '07': {
    label: 'verrière / matelas tribbing',
    bridge: /\b(verrière|matelas|vitrage)\b/i,
    action: /\b(clitoris|chatte|frotte|cuisse)\b/i,
    romantic: /\b(chatte|clitoris|frotte)\b/i,
    forbid: /\b(bite|en moi|braguette)\b/i,
  },
  '08': {
    label: 'verrière / frottement',
    bridge: /\b(verrière|vitrage)\b/i,
    action: /\b(clitoris|frotte|chatte|cuisse)\b/i,
    romantic: /\b(chatte|clitoris)\b/i,
    forbid: /\b(bite|braguette)\b/i,
  },
  '09': {
    label: 'montant / doigts sur chatte',
    bridge: /\b(verrière|montant|vitrage)\b/i,
    action: /\b(clitoris|chatte|doigts|montant)\b/i,
    romantic: /\b(chatte|clitoris|montant|jouir)\b/i,
    forbid: /\b(bite|braguette)\b/i,
  },
};

function resolveFmcPackBusinessRule(exchangeId = '') {
  if (!exchangeId.includes('female-mc')) return null;
  const match = exchangeId.match(/-(\d{2})$/);
  if (!match) return null;
  return FMC_PACK_BUSINESS_RULES[match[1]] ?? null;
}

export function fmcPackBusinessRuleOk(exchange) {
  const rule = resolveFmcPackBusinessRule(exchange.id);
  if (!rule) return { ok: true };

  const romantic = exchange.choices?.find((choice) => choice.tone === 'romantic' && choice.score === 3);
  const fieldChecks = [
    { label: 'bridge', text: exchange.bridge ?? '', pattern: rule.bridge },
    { label: 'companionAction', text: exchange.companionAction ?? '', pattern: rule.action },
    { label: 'choix +3', text: romantic?.text ?? '', pattern: rule.romantic },
  ];

  for (const field of fieldChecks) {
    if (!field.pattern || !field.text.trim()) continue;
    if (!field.pattern.test(field.text)) {
      return {
        ok: false,
        reason: `FM-NQ5 — ${field.label} doit ancrer ${rule.label} (${exchange.id})`,
      };
    }
  }

  if (rule.forbid) {
    const blob = [
      exchange.bridge,
      exchange.companionAction,
      exchange.companionLine,
      romantic?.text,
    ]
      .filter(Boolean)
      .join(' ');
    if (rule.forbid.test(blob)) {
      return {
        ok: false,
        reason: `FM-NQ5 — vocabulaire MC homme interdit (${rule.label}) — ${exchange.id}`,
      };
    }
  }

  return { ok: true };
}

export function fmcExchangeNumber(exchangeId) {
  const match = exchangeId.match(/(?:female-mc-)?(\d{2})$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/** FM-NQ* — qualité narrative miroir H/F (packs 1–3). */
export function runFmcNarrativeQualityValidation(maleData, femaleData, hooks) {
  const { fail } = hooks;
  const maleById = new Map(maleData.exchanges.map((ex) => [ex.id, ex]));

  for (const femaleEx of femaleData.exchanges) {
    const num = fmcExchangeNumber(femaleEx.id);
    if (!num || num > FMC_NQ_EXCHANGE_NUMBER_MAX) continue;

    const maleId = femaleEx.id.replace('-female-mc', '');
    const maleEx = maleById.get(maleId);
    if (!maleEx) continue;

    const actionSim = jaccardSimilarity(
      maleEx.companionAction ?? '',
      femaleEx.companionAction ?? '',
    );
    if (actionSim >= FMC_ACTION_CALQUE_FAIL) {
      fail(
        'FM-NQ1',
        `${femaleEx.id} : companionAction calquée sur H (Jaccard ${actionSim.toFixed(2)} ≥ ${FMC_ACTION_CALQUE_FAIL}) — réécrire le beat spatial FMC`,
      );
    }

    const bridgeSim = jaccardSimilarity(maleEx.bridge ?? '', femaleEx.bridge ?? '');
    if (bridgeSim >= FMC_BRIDGE_CALQUE_FAIL) {
      fail(
        'FM-NQ2',
        `${femaleEx.id} : bridge calqué sur H (Jaccard ${bridgeSim.toFixed(2)} ≥ ${FMC_BRIDGE_CALQUE_FAIL}) — réécrire le pont FMC`,
      );
    }

    const business = fmcPackBusinessRuleOk(femaleEx);
    if (!business.ok) fail('FM-NQ5', business.reason);
  }
}

/**
 * S53 — règles métier pack spectateur (suffixe id échange).
 * Lyra aff. 5 aujourd'hui ; même forme pour autres compagnons (config par id suffixe).
 */
export const PACK5_EXCHANGE_BUSINESS_RULES = {
  '-13': {
    label: 'bibliothécaire / registre / accueil visiteur',
    pattern: /\b(bibliothécaire|registre|visiteur|entends|couloir|comptoir)\b/i,
  },
  '-14': {
    label: 'atlas / réserve / section',
    pattern: /\b(atlas|réserve|section|tiroir|registre)\b/i,
  },
  '-15': {
    label: 'gravure / filigrane (pas amendes)',
    pattern: /\b(gravure|filigrane|parchemin|scribe|usure|trait du scribe)\b/i,
    forbid: /\b(amendes|registre b)\b/i,
  },
  '-16': {
    label: 'amendes / registre (pas gravure seule)',
    pattern: /\b(amendes|registre|colonne|retard)\b/i,
    forbid: /\b(gravure|filigrane)\b/i,
  },
  '-17': {
    label: 'réserve / rendez-vous',
    pattern: /\b(réserve|rendez-vous|demain matin|anus|doigt)\b/i,
  },
  '-18': {
    label: 'tarifs / colonne / pages / allées',
    pattern: /\b(tarifs|colonne|pages|allées|registre|litanie)\b/i,
  },
  '-19': {
    label: 'apprenti / entrée / asseyez-vous',
    pattern: /\b(apprenti|entrez|asseyez|page|plume|salue)\b/i,
  },
  '-20': {
    label: 'masque / comptoir / gode (intime sans visiteur)',
    pattern: /\b(gode|masque|comptoir|porte|bois|tabouret)\b/i,
    forbid: /\b(je vous|madame|monsieur|apprenti|entrez|bibliothécaire)\b/i,
  },
  '-21': {
    label: 'verrou / atlas / registre (post-spectateur)',
    pattern: /\b(verrou|atlas|registre|rayonnage|travée|reliure|bestiaire)\b/i,
    forbid: /\b(je vous|visiteur|bibliothécaire|madame|monsieur)\b/i,
  },
};

/** S53 — Maeve aff. 5 pack-5 (gros lot / journée marché — tour 2). */
export const PACK5_EXCHANGE_BUSINESS_RULES_MAEVE = {
  '-13': { label: 'lot / inventaire / contrepartie', pattern: /\b(lot|inventaire|contrepartie|charrette|caisse|faveur)\b/i },
  '-14': { label: 'bâche / allée / contrepartie', pattern: /\b(bâche|allée|contrepartie|silence|étal|rythme)\b/i },
  '-15': { label: 'bluff / goûte / contre-offre', pattern: /\b(bluff|goûte|contre-offre|marchand|faveur|rythme)\b/i },
  '-16': { label: 'stylo / signe / page', pattern: /\b(stylo|signe|page|inventaire|doigts|clitoris|cadence)\b/i },
  '-17': { label: 'stock / midi / chevauchée', pattern: /\b(stock|midi|chevauche|contrepartie|caisse|allée)\b/i },
  '-18': { label: 'rival / allée / contrepartie', pattern: /\b(rival|allée|contrepartie|verge|main|immobile)\b/i },
  '-19': { label: 'étal / bord / marché', pattern: /\b(étal|bord|marché|allée|entre|risque)\b/i },
  '-20': { label: 'prix / lot / envie', pattern: /\b(prix|lot|envie|comptoir|plaque|contrepartie)\b/i, forbid: /\b(je vous|client|acheteur)\b/i },
  '-21': { label: 'deal clos / contrepartie finale', pattern: /\b(deal|clos|contrepartie|comptoir|caisse|lot|tempo)\b/i, forbid: /\b(je vous|visiteur|sous le bois|gode)\b/i },
};

/** S53 — Runa aff. 5 pack-5 (dehors / impulsion — tour 2). */
export const PACK5_EXCHANGE_BUSINESS_RULES_RUNA = {
  '-13': { label: 'passerelle / quai / impulsion', pattern: /\b(passerelle|quai|impulsion|dehors|garde-fou|reste)\b/i },
  '-14': { label: 'garde-fou / rythme / brûlant', pattern: /\b(garde-fou|rythme|brûlant|chevauche|marteau|passerelle)\b/i },
  '-15': { label: 'hayon / charrette / maintenant', pattern: /\b(hayon|charrette|maintenant|verge|hayon|coin)\b/i },
  '-16': { label: 'mur / pluie / touche', pattern: /\b(mur|pluie|touche|clitoris|doigts|remarpt)\b/i },
  '-17': { label: 'rythme lointain / goûte', pattern: /\b(rythme|marteau|goûte|remise|clitoris|langue)\b/i },
  '-18': { label: 'remise / chemin / vu', pattern: /\b(remise|chemin|chevauche|vu|risque|cadence)\b/i },
  '-19': { label: 'apprenti / chemin / immobile', pattern: /\b(apprenti|chemin|immobile|verge|corde|passe)\b/i },
  '-20': { label: 'pudeur / dehors / envie', pattern: /\b(pudeur|dehors|envie|rempart|embrasse|jupe)\b/i, forbid: /\b(je vous|entrez|forge)\b/i },
  '-21': { label: 'retour / seuil / forge choisi', pattern: /\b(retour|seuil|forge|choisi|entre|tempo)\b/i, forbid: /\b(je vous|sous le bois|gode|comptoir)\b/i },
};

function inferCompanionFromExchangeId(exchangeId = '') {
  if (exchangeId.startsWith('maeve-')) return 'maeve';
  if (exchangeId.startsWith('runa-')) return 'runa';
  return 'lyra';
}

function resolvePack5BusinessRule(exchangeId = '', companionId = '') {
  const companion = (companionId || inferCompanionFromExchangeId(exchangeId)).toLowerCase();
  const rulesByCompanion = {
    lyra: PACK5_EXCHANGE_BUSINESS_RULES,
    maeve: PACK5_EXCHANGE_BUSINESS_RULES_MAEVE,
    runa: PACK5_EXCHANGE_BUSINESS_RULES_RUNA,
  };
  const rules = rulesByCompanion[companion] ?? PACK5_EXCHANGE_BUSINESS_RULES;
  for (const [suffix, rule] of Object.entries(rules)) {
    if (exchangeId.endsWith(suffix)) return rule;
  }
  return null;
}

/** S56 — prolepse mid-pack : teaser pack suivant interdit (OK dernier échange du pack). */
export function packLevelProlepsisInText(text = '', { allowRetrouveMoiCloche = false } = {}) {
  if (!text.trim()) return { ok: true };
  if (/\b(refais|refaire|hâte que tu me refasses)\b/i.test(text)) {
    return { ok: false, reason: 'prolepse pack — « refaire » (teaser pack suivant, pas scène suivante)' };
  }
  if (/\bdéjà fini\b/i.test(text)) {
    return { ok: false, reason: 'prolepse pack — « déjà fini »' };
  }
  if (/\bdans (?:une|deux) heures?\b/i.test(text)) {
    return { ok: false, reason: 'prolepse pack — renvoi « dans une/deux heures »' };
  }
  if (/\bprochaine fois\b/i.test(text)) {
    return { ok: false, reason: 'prolepse pack — « prochaine fois »' };
  }
  if (/\bretrouve-moi\b/i.test(text) && !(allowRetrouveMoiCloche && /\bcloche\b/i.test(text))) {
    return { ok: false, reason: 'prolepse pack — « retrouve-moi »' };
  }
  if (/\bdemain\b/i.test(text)) {
    return { ok: false, reason: 'prolepse pack — « demain » (teaser pack/jour suivant, pas la scène suivante)' };
  }
  return { ok: true };
}

/** S56 / WALK-FINALE — épilogue round mid-pack. */
export function roundFinaleProlepsisOk(exchange, roundFinale, packId, packIndex, packLength) {
  const text = roundFinale?.text ?? '';
  if (!text.trim()) return { ok: true };
  const isLastInPack = packIndex === packLength - 1;
  const blob = [exchange.bridge, exchange.title, exchange.companionAction].filter(Boolean).join(' ');

  if (!isLastInPack) {
    const check = packLevelProlepsisInText(text, { allowRetrouveMoiCloche: packId === 'pack-5' });
    if (!check.ok) {
      return { ok: false, reason: `épilogue round — ${check.reason}` };
    }
  }

  if (packId === 'pack-1' && !isLastInPack) {
    if (/\b(refais|hâte que tu me refasses)\b/i.test(text) && /verrou/i.test(blob)) {
      return {
        ok: false,
        reason: 'épilogue round — prolepse « refaire sous le verrou » alors que le verrou est déjà tiré',
      };
    }
  }

  return { ok: true };
}

/** S56 — companionLine intime mid-pack (spectateur exempt : « demain matin » au visiteur OK). */
export function exchangeCompanionLineProlepsisOk(exchange, packIndex, packLength) {
  if (packIndex === packLength - 1) return { ok: true };
  if (exchangeSpectatorPresent(exchange)) return { ok: true };
  const line = exchange.companionLine ?? '';
  const check = packLevelProlepsisInText(line);
  if (!check.ok) {
    return { ok: false, reason: `companionLine — ${check.reason}` };
  }
  return { ok: true };
}

/** S58 — ton épilogue low (correction, pas victoire). */
export function intimateFinaleLowToneOk(text = '') {
  if (!text.trim()) return { ok: true };
  if (LOW_FINALE_VICTORY_TONE.test(text)) {
    return { ok: false, reason: 'épilogue low — ton victoire / félicitation (attendu recadrage)' };
  }
  return { ok: true };
}

/** S58 — score bas → épilogue low cohérent si le champ existe (WALK-LOW). */
export function roundFinaleMatchesScore(exchange, score, roundFinale, affinity) {
  if (affinity < 5) return { ok: true };
  const low = exchange.intimateFinaleLow?.trim();
  const high = exchange.intimateFinale?.trim();
  if (score <= 1) {
    if (!low) return { ok: true };
    if (roundFinale?.tier !== 'low') {
      return { ok: false, reason: 'score ≤ 1 — épilogue round devrait être low' };
    }
    const tone = intimateFinaleLowToneOk(roundFinale.text ?? low);
    if (!tone.ok) return tone;
  } else if (score >= 2 && high && roundFinale?.tier === 'low') {
    return { ok: false, reason: 'score ≥ 2 — épilogue round high attendu, pas low' };
  }
  return { ok: true };
}

function runFinaleProlepsisChecks(data, hooks) {
  const { fail } = hooks;
  if (!corpusHasIntimateFinales(data)) return;
  const byId = new Map((data.exchanges ?? []).map((ex) => [ex.id, ex]));

  for (const pack of data.meta?.sessionPacks ?? []) {
    const exchanges = (pack.exchangeIds ?? []).map((id) => byId.get(id)).filter(Boolean);
    for (let index = 0; index < exchanges.length; index += 1) {
      const exchange = exchanges[index];
      const lineCheck = exchangeCompanionLineProlepsisOk(exchange, index, exchanges.length);
      if (!lineCheck.ok) fail('S56', `${exchange.id} companionLine : ${lineCheck.reason}`);

      for (const [field, tier] of [
        ['intimateFinale', 'high'],
        ['intimateFinaleLow', 'low'],
      ]) {
        const text = exchange[field]?.trim();
        if (!text) continue;
        const check = roundFinaleProlepsisOk(
          exchange,
          { tier, text },
          pack.id,
          index,
          exchanges.length,
        );
        if (!check.ok) fail('S56', `${exchange.id} ${field} : ${check.reason}`);
        if (field === 'intimateFinaleLow') {
          const tone = intimateFinaleLowToneOk(text);
          if (!tone.ok) fail('S58', `${exchange.id} ${field} : ${tone.reason}`);
        }
      }
    }
  }
}

function runPackEmotionCurveChecks(data, hooks) {
  const { fail } = hooks;
  if (!corpusHasIntimateFinales(data)) return;
  const byId = new Map((data.exchanges ?? []).map((ex) => [ex.id, ex]));
  const companionId = String(data.meta?.companionId ?? 'lyra').toLowerCase();
  const havreCutout = companionId === 'maeve' || companionId === 'runa';

  for (const pack of data.meta?.sessionPacks ?? []) {
    const lyraPattern = PACK_ROMANTIC_EMOTION_BY_PACK[pack.id];
    const pattern = havreCutout ? /^(romantic|happy|neutral|playful|shy|annoyed)$/i : lyraPattern;
    if (!pattern) continue;
    for (const id of pack.exchangeIds ?? []) {
      const ex = byId.get(id);
      if (!ex) continue;
      const romantic = ex.choices?.find((choice) => choice.tone === 'romantic' && choice.score === 3);
      if (!romantic?.emotion) continue;
      if (!pattern.test(romantic.emotion)) {
        fail(
          'S57',
          `${ex.id} : émotion romantic +3 « ${romantic.emotion} » hors courbe pack ${pack.id}`,
        );
      }
    }
  }
}
const REACTION_QUOTE_MIN_LEN = 12;

export function resolveFmcMirrorPath(jsonPath) {
  const normalized = jsonPath.replace(/\\/g, '/');
  if (normalized.includes('-female-mc.json')) {
    return normalized.replace('-female-mc.json', '.json');
  }
  if (/-curated-12\.json$/.test(normalized) && !normalized.includes('-female-mc')) {
    return normalized.replace(/\.json$/, '-female-mc.json');
  }
  return null;
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  const rows = b.length + 1;
  const cols = a.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

export function normalizedQuoteSimilarity(left = '', right = '') {
  const a = normalizeCorpusLine(left);
  const b = normalizeCorpusLine(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const dist = levenshteinDistance(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/** S50 — spectateur : companionLine orientée visiteur / comptoir. */
export function spectatorCompanionLineOk(exchange) {
  if (!exchangeSpectatorPresent(exchange)) return { ok: true };
  const line = exchange.companionLine ?? '';
  if (
    SPOKEN_VISITOR_FACING_PATTERN.test(line) ||
    /\b(bibliothécaire|registre|atlas|réserve|gravure|amendes|tarifs|comptoir|visiteur|monsieur|madame|marchande|forgeronne|forge|commande|mesure|crédit|comptant|deal|marché|client|acheteur|lame|apprenti|rival)\b/i.test(line)
  ) {
    return { ok: true };
  }
  return {
    ok: false,
    reason: `spectateur — companionLine ne sonne pas « comptoir / visiteur » : « ${line.slice(0, 60)}… »`,
  };
}

/** S51 — spectateur : companionLine trop intime / adressée au MC. */
export function spectatorCompanionLineIntimateOk(exchange) {
  if (!exchangeSpectatorPresent(exchange)) return { ok: true };
  const line = exchange.companionLine ?? '';
  if (MC_INTIMATE_LINE_WITH_SPECTATOR.test(line)) {
    return { ok: false, reason: 'spectateur — companionLine trop intime / adressée au MC' };
  }
  return { ok: true };
}

/** S52 — spectateur : réaction +3 cite le visiteur si Lyra parle au couloir. */
export function spectatorReactionOk(exchange, choice) {
  if (!exchangeSpectatorPresent(exchange)) return { ok: true };
  const line = exchange.companionLine ?? '';
  if (!SPOKEN_VISITOR_FACING_PATTERN.test(line)) return { ok: true };
  const spokenParts = [...(choice.reaction ?? '').matchAll(/«([^»]*)»/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  if (spokenParts.length === 0) return { ok: true };
  const visitorQuote = spokenParts.find((part) => VISITOR_REACTION_QUOTE.test(part));
  if (!visitorQuote) {
    return {
      ok: false,
      reason:
        'spectateur présent — réaction devrait citer une réplique vers le couloir (guillemets visiteur)',
    };
  }
  return { ok: true };
}

/** S53 — règles métier pack-5 (choix + réaction romantic +3). */
export function pack5BusinessRuleOk(exchange, companionId = '') {
  const rule = resolvePack5BusinessRule(exchange.id, companionId);
  if (!rule) return { ok: true };
  const romantic = exchange.choices?.find((choice) => choice.tone === 'romantic' && choice.score === 3);
  if (!romantic) return { ok: true };

  const fields = [
    { label: 'choix +3', text: romantic.text ?? '' },
    { label: 'réaction +3', text: extractReactionSpokenParts(romantic.reaction ?? '') },
  ];

  for (const field of fields) {
    if (!field.text.trim()) continue;
    if (rule.pattern && !rule.pattern.test(field.text)) {
      return {
        ok: false,
        reason: `pack-5 métier — ${field.label} doit mentionner ${rule.label} (${exchange.id})`,
      };
    }
    if (rule.forbid && rule.forbid.test(field.text)) {
      return {
        ok: false,
        reason: `pack-5 métier — ${field.label} ne doit pas pivoter sur le mauvais fil (${rule.label}) — ${exchange.id}`,
      };
    }
  }
  return { ok: true };
}

/** LQ6 / S54 — réactions Lyra trop similaires dans un pack (guillemets +3). */
export function reactionQuoteSimilarityIssues(data) {
  const issues = [];
  const byId = new Map((data.exchanges ?? []).map((ex) => [ex.id, ex]));

  for (const pack of data.meta?.sessionPacks ?? []) {
    const quotes = [];
    for (const id of pack.exchangeIds ?? []) {
      const ex = byId.get(id);
      if (!ex) continue;
      const romantic = ex.choices?.find((choice) => choice.tone === 'romantic' && choice.score === 3);
      if (!romantic?.reaction) continue;
      const quote = extractReactionSpokenParts(romantic.reaction);
      if (quote.length < REACTION_QUOTE_MIN_LEN) continue;
      quotes.push({ id, quote });
    }

    for (let left = 0; left < quotes.length; left += 1) {
      for (let right = left + 1; right < quotes.length; right += 1) {
        const similarity = normalizedQuoteSimilarity(quotes[left].quote, quotes[right].quote);
        if (similarity >= REACTION_QUOTE_SIMILARITY_THRESHOLD) {
          issues.push({
            code: 'LQ6',
            message: `${pack.id} : réactions +3 trop proches (${quotes[left].id} ↔ ${quotes[right].id}, sim. ${similarity.toFixed(2)}) — « ${quotes[left].quote.slice(0, 40)}… »`,
          });
        }
      }
    }
  }

  return issues;
}

function fmcFieldAnatomyOk(text, protagonistGender, fieldLabel) {
  if (!text?.trim()) return { ok: true };
  if (protagonistGender === 'female') {
    const anatomy = aff5FemaleMcActionAnatomyOk(text);
    if (!anatomy.ok) return { ok: false, reason: `${fieldLabel} : ${anatomy.reason}` };
    const register = aff5McPlayerTextRegister(text, 'female', fieldLabel);
    if (!register.ok) return register;
  }
  if (protagonistGender === 'male') {
    const anatomy = aff5MaleMcAnatomyOk(text, fieldLabel);
    if (!anatomy.ok) return anatomy;
  }
  return { ok: true };
}

/** FM* — miroir H/F : cohérence anatomie / registre (FM2) — pas d'exigence de différenciation texte H/F. */
export function runFmcMirrorValidation(maleData, femaleData, hooks) {
  const { fail } = hooks;
  const maleAffinity = maleData.meta?.affinity ?? 0;
  const femaleAffinity = femaleData.meta?.affinity ?? 0;
  if (maleAffinity !== femaleAffinity) {
    fail('FM0', `affinité H (${maleAffinity}) ≠ FMC (${femaleAffinity})`);
    return;
  }
  if (maleAffinity < 5) return;

  const maleById = new Map(maleData.exchanges.map((ex) => [ex.id, ex]));

  for (const femaleEx of femaleData.exchanges) {
    const maleId = femaleEx.id.replace('-female-mc', '');
    const maleEx = maleById.get(maleId);
    if (!maleEx) {
      fail('FM0', `${femaleEx.id} : échange homologue introuvable (${maleId})`);
      continue;
    }

    for (const field of FMC_NARRATIVE_FIELDS) {
      const check = fmcFieldAnatomyOk(femaleEx[field], 'female', `${femaleEx.id}.${field}`);
      if (!check.ok) fail('FM2', check.reason);
    }
    for (const choice of femaleEx.choices ?? []) {
      const check = fmcFieldAnatomyOk(choice.text, 'female', `${femaleEx.id} / ${choice.tone}`);
      if (!check.ok) fail('FM2', check.reason);
      const reactionCheck = fmcFieldAnatomyOk(choice.reaction, 'female', `${femaleEx.id} / ${choice.tone} reaction`);
      if (!reactionCheck.ok) fail('FM2', reactionCheck.reason);
    }

    for (const field of FMC_NARRATIVE_FIELDS) {
      const check = fmcFieldAnatomyOk(maleEx[field], 'male', `${maleEx.id}.${field}`);
      if (!check.ok) fail('FM2', check.reason);
    }
  }

  runFmcNarrativeQualityValidation(maleData, femaleData, hooks);
}

/** S55 — alias sémantique de WALK-SPACE (bridge ↔ companionAction). */
export function spatialBridgeActionOk(exchange) {
  return bridgeActionSpatialClashOk(exchange);
}

/** Applique S50–S55 sur un corpus (hooks fail/warn). */
export function runAdvancedExchangeRules(data, hooks) {
  const { fail } = hooks;
  const affinity = data.meta?.affinity ?? 1;

  for (const exchange of data.exchanges) {
    if (isActionOrientedAffinity(affinity)) {
      const spatial = spatialBridgeActionOk(exchange);
      if (!spatial.ok) fail('S55', `${exchange.id} : ${spatial.reason}`);
    }

    if (exchangeSpectatorPresent(exchange)) {
      const lineOk = spectatorCompanionLineOk(exchange);
      if (!lineOk.ok) fail('S50', `${exchange.id} : ${lineOk.reason}`);
      const intimateOk = spectatorCompanionLineIntimateOk(exchange);
      if (!intimateOk.ok) fail('S51', `${exchange.id} : ${intimateOk.reason}`);
      for (const choice of exchange.choices ?? []) {
        const reactOk = spectatorReactionOk(exchange, choice);
        if (!reactOk.ok) fail('S52', `${exchange.id} / ${choice.tone} : ${reactOk.reason}`);
      }
    }

    if (corpusHasIntimateFinales(data) && resolvePack5BusinessRule(exchange.id, data.meta?.companionId)) {
      const business = pack5BusinessRuleOk(exchange, data.meta?.companionId);
      if (!business.ok) fail('S53', `${exchange.id} : ${business.reason}`);
    }
  }

  if (corpusHasIntimateFinales(data)) {
    for (const issue of reactionQuoteSimilarityIssues(data)) {
      fail(issue.code, issue.message);
    }
    runFinaleProlepsisChecks(data, hooks);
    runPackEmotionCurveChecks(data, hooks);
  } else if (affinity >= 5) {
    for (const issue of reactionQuoteSimilarityIssues(data)) {
      fail(issue.code, issue.message);
    }
  } else {
    for (const issue of reactionQuoteSimilarityIssues(data)) {
      hooks.warn?.(issue.code, issue.message);
    }
  }
}
