#!/usr/bin/env node
/** Génère les corpus aff. 4/5 — format companionAction (3e pers.) + companionLine (réplique Lyra). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAff5ValidationProfile } from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

const PACKS = [
  { id: 'pack-1', label: 'Bibliothèque — verrou', nums: ['01', '02', '03'] },
  { id: 'pack-2', label: 'Chambre — peignoir', nums: ['04', '05', '06'] },
  { id: 'pack-3', label: 'Balcon — rapproché', nums: ['07', '08', '09'] },
  { id: 'pack-4', label: 'Jardin — aube', nums: ['10', '11', '12'] },
];

const PACKS_AFF5 = [
  { id: 'pack-1', label: 'Bibliothèque — verrou', nums: ['01', '02', '03'] },
  { id: 'pack-2', label: 'Chambre — peignoir', nums: ['04', '05', '06'] },
  { id: 'pack-3', label: 'Verrière — nu', nums: ['07', '08', '09'] },
  { id: 'pack-4', label: 'Toit — aube', nums: ['10', '11', '12'] },
  { id: 'pack-5', label: 'Bibliothèque — silence (journée)', nums: ['13', '14', '15', '16', '17', '18', '19', '20', '21'] },
];

function choice(tone, text, score, emotion, reaction) {
  return { tone, text, score, emotion, reaction };
}

/** Cutout intime Lyra aff. 4–5 — une tenue par pack session (≠ mage L1–3). */
const PACK_CUTOUT_EMOTIONS = ['commanding', 'heated', 'dominant', 'lustful'];

function packCutoutEmotion(exchangeIndex) {
  if (exchangeIndex >= 12) return 'lustful';
  return PACK_CUTOUT_EMOTIONS[Math.floor(exchangeIndex / 3)] ?? 'commanding';
}

/** Réécrit les tags emotion des choix → cutout pack (+ annoyed si score 0). */
function applyPackCutoutEmotions(exchanges) {
  return exchanges.map((ex, index) => ({
    ...ex,
    choices: ex.choices.map((c) => ({
      ...c,
      emotion: c.score <= 0 ? 'annoyed' : packCutoutEmotion(index),
    })),
  }));
}

/** Attache powerDynamic à chaque échange (ordre = index corpus). */
function withPowerDynamics(exchanges, dynamics) {
  return exchanges.map((exchange, index) => ({
    ...exchange,
    powerDynamic: dynamics[index] ?? 'mutual',
  }));
}

/** Lyra aff. 5 — bibliothèque = dom / invite selon scène. */
const AFF5_POWER_DYNAMICS = [
  'companion_dominant',
  'companion_invites',
  'companion_invites',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'mutual',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'protagonist_invited',
  'companion_invites',
];

const AFF5_FEMALE_POWER_DYNAMICS = [
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'mutual',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'companion_dominant',
  'protagonist_invited',
  'companion_invites',
];

const AFF4_POWER_DYNAMICS = [
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_invites',
  'protagonist_invited',
  'protagonist_invited',
  'companion_invites',
  'mutual',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
  'companion_dominant',
];

function buildCorpus({
  affinity,
  gender,
  idSuffix,
  reviewDoc,
  purpose,
  criteria,
  packs,
  exchanges,
  finalesByIndex,
  finalesLowByIndex,
  packActFinales,
  sessionOutcomesByIndex,
  defaultPowerDynamic,
}) {
  const prefix = `lyra-aff${affinity}-curated${idSuffix}`;
  const maxRoundsPerPack = Math.max(...packs.map((pack) => pack.nums.length), 3);
  return {
    meta: {
      companionId: 'lyra',
      affinity,
      protagonistGender: gender,
      defaultPowerDynamic: defaultPowerDynamic ?? 'mutual',
      purpose,
      reviewDoc,
      roundsPerSession: maxRoundsPerPack,
      sessionPacks: packs.map((pack) => {
        const actFinale = packActFinales?.[pack.id];
        return {
          id: pack.id,
          label: pack.label,
          exchangeIds: pack.nums.map((n) => `${prefix}-${n}`),
          ...(affinity >= 5 && actFinale?.high?.setting
            ? {
                packIntimateFinaleTemplate: {
                  setting: actFinale.high.setting,
                  closing: actFinale.high.closing,
                },
              }
            : {}),
          ...(affinity >= 5 && typeof actFinale?.high === 'string'
            ? { packIntimateFinale: actFinale.high }
            : {}),
          ...(affinity >= 5 && actFinale?.low ? { packIntimateFinaleLow: actFinale.low } : {}),
        };
      }),
      criteria,
      ...(affinity >= 5 ? { validationProfile: buildAff5ValidationProfile(gender) } : {}),
    },
    exchanges: applyPackCutoutEmotions(
      exchanges.map((ex, index) => {
        const intimateFinale =
          ex.intimateFinale ??
          (affinity >= 5 && finalesByIndex?.[index] ? finalesByIndex[index] : undefined);
        const intimateFinaleLow =
          ex.intimateFinaleLow ??
          (affinity >= 5 && finalesLowByIndex?.[index] ? finalesLowByIndex[index] : undefined);
        const sessionOutcome = sessionOutcomesByIndex?.[index];
        return {
          ...ex,
          ...(intimateFinale ? { intimateFinale } : {}),
          ...(intimateFinaleLow ? { intimateFinaleLow } : {}),
          ...(sessionOutcome ? { sessionOutcome } : {}),
          id: `${prefix}-${String(index + 1).padStart(2, '0')}`,
          answerRule: 'action',
        };
      }),
    ),
  };
}

/** Épilogues aff. 5 — narration tu ; segments séparés par « ; » (une bulle UI chacun). */
const AFF5_FINALE_MALE = [
  'Porte du fond tiède dans ton dos, verrou tiré — tu halètes contre les rayons ; elle se redresse, robe froissée, joue rose ; te chuchote : « Tiens bon. Reste là — on n\'en est qu\'au début. »',
  'Sous la lampe, ta main encore mouillée sur elle, registre basculé — elle respire contre ton cou, cuisses tremblantes sur la table ; murmure : « Reste là. Personne ne passe tant que le verrou tient. »',
  'Tu relèves la tête entre ses cuisses — elle s\'appuie au rayonnage, chatte encore trempée, doigts dans tes cheveux ; ajuste sa robe, murmure : « Silence. On sort quand je le dis. »',
  'Peignoir au sol, ta chemise déboutonnée, draps froissés — elle contre ton torse nu, peau chaude, haleine sur ta peau ; te serre la nuque, te fixe : « Ne t\'habille pas trop vite. »',
  'Draps en bordel, elle reste assise sur toi, cuisses molles, chatte trempée — ta bite encore dure contre son ventre ; se redresse, regard amusé : « Tu sais attendre. Dommage que j\'aie craqué avant toi. »',
  'Oreiller mordu déplacé, ta semence le long de ses fesses sur la commode — miroir embué, vêtements au sol, chambre sens dessus dessous ; elle te toise, yeux amusés : « Retrouve-moi sous le bureau dans deux heures. »',
  'Sous la verrière, matelas froissé, sueur sur vos peaux — elle s\'écarte lentement, cuisses encore collées aux tiennes, lune sur le vitrage ; te fixe, yeux amusés : « On n\'a pas fini avec cette nuit. »',
  'Buée sur le vitrage, ta respiration encore haletante — elle vérifie ton poignet, cuisses tremblantes, chatte contre la tienne ; ralentit un instant, regard amusé : « Tu as bien tapé. Garde ce rythme encore un peu. »',
  'Contre le montant, ses doigts mouillés encore en toi, condensation sur la vitraille — elle retire sa main lentement, ton dos encore collé au bois ; s\'essuie la paume, regard sec : « Dommage que personne n\'ait vu ta mine. »',
  'Une fois les tremblements de son orgasme passés et ses petits gémissements terminés, elle s\'écarte — ta bite encore dure à côté de sa chatte ruisselante, couverture froissée ; te fixe, yeux amusés : « Encore debout malgré le froid — on verra si tu tiens la rambarde ensuite. »',
  'Dos à la rambarde, tu jouis enfin — couverture tâchée, elle relève la tête, lèvre mouillée, gorge qui avale ; murmure contre ton ventre : « Mmm… relâche-toi. On n\'a pas fini la nuit. »',
  'Sur la couverture, aube grise dans le dos, fesses encore rouges, haleine coupée — vous venez de jouir ; elle se redresse chancelante ; te fixe, yeux amusés : « Voilà. Redescends avant que le village ouvre un œil. »',
  'Sous le comptoir, tu retiens encore ton souffle — elle replace une mèche, joue rose ; te chuchote à peine audible : « Personne n\'a rien entendu. Dommage. »',
  'Gode contre le tiroir, visiteur encore au couloir — tes doigts sur sa chatte, elle respire par le nez ; chuchote sans te regarder : « Lent. Quand je fais une pause. »',
  'Gode enfoncé, visiteur au couloir — elle serre tes cheveux une seconde ; chuchote sans te regarder : « Lent. Tu attends mon signal pour la suite. »',
  'Comptoir tiède, ta paume sur le manche — elle cite encore les amendes sans trembler ; murmure contre ton oreille : « Comme ça. Pas plus fort sans moi. »',
  'Doigt retiré de son anus, gode toujours en place — masque retrouvé vers la vitrine ; murmure : « Tu m\'as tendue. Ce n\'est pas fini. »',
  'Registre posé ; aux allées, le silence — tes doigts humides, elle lisse sa robe ; te fixe : « Quand la cloche sonne — même tabouret. »',
  'Midi passé, plume renversée, gode encore en place — tu halètes sous le bois ; elle tremble une seconde, masque retrouvé ; yeux amusés : « L\'apprenti n\'a rien vu. Moi, si. »',
  'Comptoir vide, tu as mené sans qu\'elle voie venir — elle mord sa lèvre, cuisses tremblantes ; te chuchote : « Ce soir tu es ma chose. Là, encore. »',
  'Entre les travées, verrou du soir tiré — elle te sort de sous le comptoir, robe relevée, livres de travers ; murmure contre ta nuque, yeux amusés : « Encore ce soir. Même silence. Même comptoir. »',
];

/** Épilogues aff. 5 score ≤ 1 — indices alignés sur AFF5_FINALE_MALE (ex. 8 Stop + pack 5). */
const AFF5_FINALE_LOW_MALE = {
  7: 'Buée sur le vitrage, tu fais encore semblant de taper — elle te lâche le poignet, amusée mais sèche ; regard sec : « Tu mens avec le poignet. Recommence quand tu seras honnête. »',
  9: 'Chevauchée hachée, tu as devancé son signal — elle se redresse, couverture froissée ; te toise : « Ce toit, c\'est mon rythme. Recommence sans prendre les devants. »',
  10: 'Tu t\'es crispé dans sa bouche — elle relève la tête, lèvre humide ; regard sec : « Lâche-toi ou tu recommences debout. »',
  11: 'Entrée trop brusque par derrière — elle se redresse chancelante, fesses pâles ; te fixe, murmure froid : « Lent. Tu demandes avant d\'accélérer. »',
  12: 'Sous le comptoir, tu as failli grincer — elle replace le registre, mâchoire serrée ; te fixe, regard sec : « Pas un bruit. Tu réessayeras quand la porte sera close. »',
  13: 'Trop vite sur sa chatte — le visiteur fronce les sourcils ; elle referme les cuisses ; te fixe : « Maladroit. Tu attends ma pause. »',
  14: 'Tu as enfoncé au mauvais moment — sa voix vacille une seconde ; regard sec : « Pas quand je parle. Recommence. »',
  15: 'Tu as accéléré sans qu\'elle serre — elle claque le registre sous le bois ; te fixe : « Tout le bestiaire — à voix haute, lentement. »',
  16: 'Tu l\'as frôlée trop près du bord — elle te mord la lèvre sous le comptoir ; chuchote : « Pas encore. Tu paies ce soir. »',
  17: 'Registre posé de travers, rythme décalé — elle lisse sa robe d\'un geste sec ; te fixe : « De toute voix. Et lentement. Pas un mot de trop. »',
  18: 'Plume renversée, voix encore un peu tremblante — elle claque le registre ; te toise : « L\'apprenti n\'a rien vu. Toi, tu as failli. »',
  19: 'Comptoir vide, tu as poussé trop fort — elle te repousse vers le bois ; murmure : « Remets le masque. Pas avant le verrou. »',
  20: 'Verrou pas encore tiré, gode encore humide — elle te repousse vers le comptoir ; regard sec : « Pas encore. Remets le masque. »',
};

function finalesLowFromMap(map, length) {
  return Array.from({ length }, (_, index) => map[index]);
}

const AFF5_FINALE_FEMALE = [
  'Porte du fond tiède dans ton dos, verrou tiré — tu halètes contre les rayons, robe froissée ; elle se redresse, joue rose ; te chuchote : « Tiens bon. Reste là — on n\'en est qu\'au début. »',
  'Sous la lampe, ta chatte encore trempée sous sa paume, registre basculé — elle respire contre ton cou, cuisses tremblantes sur la table ; murmure : « Reste là. Personne ne passe tant que le verrou tient. »',
  'Sur la table, ta chatte encore trempée — elle se redresse entre tes cuisses, lèvres humides, doigts sur ta cuisse ; murmure : « Silence. On sort quand je le dis. »',
  'Robe au pied du lit, ta chatte nue contre la sienne — draps froissés, peignoir abandonné, sueur sur vos ventres ; te serre la nuque, te fixe : « Ne te rhabille pas trop vite. »',
  'Draps en bordel, elle reste sur toi, cuisses molles, chatte trempée contre la tienne — doigts crispés dans tes hanches ; se redresse, regard amusé : « Tu sais attendre. Dommage que j\'aie craqué avant toi. »',
  'Draps froissés, ses doigts encore en toi — oreiller déplacé, chambre sens dessus dessous, cuisses tremblantes ; elle retire sa main lentement, te toise, yeux amusés : « Reste. On n\'a pas fini. »',
  'Sous la verrière, matelas froissé, sueur sur vos peaux — elle s\'écarte lentement, clitoris encore brûlant, lune sur le vitrage ; te fixe, yeux amusés : « On n\'a pas fini avec cette nuit. »',
  'Buée sur le vitrage, ta respiration haletante — elle vérifie ton poignet, chatte contre la sienne, cuisses tremblantes ; regard amusé : « Tu as bien tapé. Garde ce rythme. »',
  'Contre le montant, ses doigts mouillés sur ta chatte — condensation sur la vitraille, robe déplacée ; elle retire sa main lentement, ton dos encore collé au bois ; s\'essuie la paume, regard sec : « Dommage que personne n\'ait vu ta mine. »',
  'Une fois les tremblements de son orgasme passés, elle s\'écarte — ta chatte encore brûlante contre la sienne ruisselante, couverture froissée ; te fixe, yeux amusés : « Encore debout malgré le froid — on verra si tu tiens la rambarde ensuite. »',
  'Sur la couverture, tu jouis enfin — elle relève la tête, lèvre mouillée, chatte encore trempée ; murmure : « Mmm… relâche-toi. On n\'a pas fini la nuit. »',
  'Sur la couverture, aube grise dans le dos, cuisses encore tremblantes — vous venez de jouir ; elle se redresse chancelante ; te fixe, yeux amusés : « Voilà. Redescends avant que le village ouvre un œil. »',
  'Sous le comptoir, tu retiens ton souffle — ta robe froissée, elle replace une mèche, joue rose ; te chuchote à peine audible : « Personne n\'a rien entendu. Dommage. »',
  'Gode contre le tiroir, visiteur encore au couloir — tes doigts sur sa chatte, elle respire par le nez ; chuchote sans te regarder : « Lent. Quand je fais une pause. »',
  'Gode enfoncé, visiteur au couloir — elle serre tes cheveux une seconde ; chuchote sans te regarder : « Lent. Tu attends mon signal. »',
  'Comptoir tiède, ta paume sur le manche — elle cite les amendes sans trembler ; murmure contre ton oreille : « Comme ça. Pas plus fort sans moi. »',
  'Doigt retiré, gode toujours en place — masque retrouvé ; murmure : « Tu m\'as tendue. Ce n\'est pas fini. »',
  'Registre posé — tes doigts humides, elle lisse sa robe ; te fixe : « Quand la cloche sonne — même tabouret. »',
  'Midi passé, plume renversée — tu halètes sous le bois ; elle tremble une seconde, masque retrouvé ; yeux amusés : « L\'apprenti n\'a rien vu. Moi, si. »',
  'Comptoir vide, tu as mené sans qu\'elle voie venir — elle mord sa lèvre, cuisses tremblantes ; te chuchote : « Ce soir tu es ma chose. Là, encore. »',
  'Entre les travées, verrou du soir — elle te sort de sous le comptoir, robe relevée ; murmure contre ta nuque, yeux amusés : « Encore ce soir. Même silence. Même comptoir. »',
];

const AFF5_FINALE_LOW_FEMALE = {
  7: 'Buée sur le vitrage, tu fais encore semblant de taper — elle te lâche le poignet, amusée mais sèche ; regard sec : « Tu mens avec le poignet. Recommence quand tu seras honnête. »',
  9: 'Chevauchée hachée, tu as devancé son signal — elle se redresse, culotte glissée ; te toise : « Ce toit, c\'est mon rythme. Recommence sans prendre les devants. »',
  10: 'Tu t\'es crispée dans sa bouche — elle relève la tête, lèvre humide ; regard sec : « Lâche-toi ou tu recommences debout. »',
  11: 'Entrée trop brusque par derrière — elle se redresse chancelante ; te fixe, murmure froid : « Lent. Tu demandes avant d\'accélérer. »',
  12: 'Sous le comptoir, tu as failli grincer — elle replace le registre ; te fixe, regard sec : « Pas un bruit. Tu réessayeras quand la porte sera close. »',
  13: 'Trop vite sur sa chatte — elle referme les cuisses ; te fixe : « Maladroite. Attends ma pause. »',
  14: 'Tu as enfoncé au mauvais moment — sa voix vacille ; regard sec : « Pas quand je parle. Recommence. »',
  15: 'Tu as accéléré sans qu\'elle serre — elle claque le registre ; te fixe : « Tout le bestiaire — à voix haute, lentement. »',
  16: 'Tu l\'as frôlée trop près du bord — elle te mord la lèvre ; chuchote : « Pas encore. Tu paies ce soir. »',
  17: 'Registre de travers — te fixe, regard sec : « De toute voix. Et lentement. Pas un mot de trop. »',
  18: 'Plume renversée — elle claque le registre ; te toise : « L\'apprenti n\'a rien vu. Toi, tu as failli. »',
  19: 'Comptoir vide, trop fort — elle te repousse ; murmure : « Remets le masque. Pas avant le verrou. »',
  20: 'Verrou pas encore tiré — elle te repousse vers le comptoir ; regard sec : « Pas encore. Remets le masque. »',
};

/** Bilan attendu par échange (aff. 5) — alimente épilogue pack + écran résultat. */
const SESSION_OUTCOME_MALE = [
  { acts: ['grinding'], beatLabel: 'Verrou tiré' },
  { acts: ['fingering_companion'], companionClimaxOnSuccess: true, beatLabel: 'Mouillée' },
  { acts: ['oral_on_companion'], companionClimaxOnSuccess: true, beatLabel: 'Entre les cuisses' },
  { acts: ['grinding'], beatLabel: 'Rien dessous' },
  { acts: ['riding', 'penetration'], companionClimaxOnSuccess: true, beatLabel: 'Elle monte' },
  { acts: ['anal'], companionClimaxOnSuccess: true, beatLabel: 'Sans détour' },
  { acts: ['penetration'], beatLabel: 'Entre en moi' },
  { acts: ['riding'], companionClimaxOnSuccess: true, beatLabel: 'Stop' },
  { acts: ['fingering_mc'], mcClimaxOnSuccess: true, beatLabel: 'Contre le montant' },
  { acts: ['riding'], companionClimaxOnSuccess: true, beatLabel: 'Avant le matin' },
  { acts: ['oral_on_mc'], mcClimaxOnSuccess: true, beatLabel: 'Sa bouche' },
  { acts: ['anal'], mcClimaxOnSuccess: true, companionClimaxOnSuccess: true, beatLabel: "Avant l'aube" },
  { acts: ['grinding'], beatLabel: 'Pas de pas' },
  { acts: ['fingering_companion'], beatLabel: 'Tiroir secret' },
  { acts: ['toy'], beatLabel: 'Sans prévenir' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Voix posée' },
  { acts: ['toy', 'anal'], beatLabel: 'Deux doigts' },
  { acts: ['toy'], beatLabel: 'Deux allées plus loin' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Plume immobile' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Masque qui craque' },
  { acts: ['penetration'], companionClimaxOnSuccess: true, beatLabel: 'Verrou du soir' },
];

const SESSION_OUTCOME_FEMALE = [
  { acts: ['fingering_mc'], beatLabel: 'Verrou tiré' },
  { acts: ['fingering_mc'], mcClimaxOnSuccess: true, beatLabel: 'Mouillée' },
  { acts: ['oral_on_mc'], mcClimaxOnSuccess: true, beatLabel: 'Entre les cuisses' },
  { acts: ['grinding'], beatLabel: 'Peignoir ouvert' },
  { acts: ['mutual_grinding'], mcClimaxOnSuccess: true, companionClimaxOnSuccess: true, beatLabel: 'Elle monte' },
  { acts: ['fingering_mc'], mcClimaxOnSuccess: true, beatLabel: 'Doigts' },
  { acts: ['penetration'], beatLabel: 'Face à face' },
  { acts: ['riding'], companionClimaxOnSuccess: true, beatLabel: 'Stop' },
  { acts: ['fingering_mc'], mcClimaxOnSuccess: true, beatLabel: 'Vitrage embué' },
  { acts: ['riding'], companionClimaxOnSuccess: true, beatLabel: 'Avant le matin' },
  { acts: ['oral_on_mc'], mcClimaxOnSuccess: true, beatLabel: 'Sa langue' },
  { acts: ['anal'], mcClimaxOnSuccess: true, companionClimaxOnSuccess: true, beatLabel: "Avant l'aube" },
  { acts: ['grinding'], beatLabel: 'Pas de pas' },
  { acts: ['fingering_companion'], beatLabel: 'Tiroir secret' },
  { acts: ['toy'], beatLabel: 'Sans prévenir' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Voix posée' },
  { acts: ['toy', 'anal'], beatLabel: 'Deux doigts' },
  { acts: ['toy'], beatLabel: 'Deux allées plus loin' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Plume immobile' },
  { acts: ['toy'], companionClimaxOnSuccess: true, beatLabel: 'Masque qui craque' },
  { acts: ['penetration'], companionClimaxOnSuccess: true, beatLabel: 'Verrou du soir' },
];

/** Épilogue de clôture d'acte (pack entier) — aff. 5, après le dernier échange. */
const PACK_ACT_FINALE_MALE = {
  'pack-1': {
    high: {
      setting:
        'Verrou du fond, travées noires — registre basculé, tableau déplacé, cuisses et doigts encore gluants',
      closing:
        'elle redresse sa robe, cheveux en bordel ; elle te retient contre les rayons, puis murmure : « Personne n\'est passé. Remets les volumes. Silence jusqu\'à l\'aube. »',
    },
    low:
      'Verrou tiré trop tôt — registre ouvert, tableau effleuré, braguette refermée en catastrophe ; elle te repousse du rayon, joue froide ; te toise sous la lampe, regard sec : « Trop vite. Le verrou tient — reprends quand tu sauras rester. »',
  },
  'pack-2': {
    high: {
      setting:
        'Chambre au havre, bougie morte — peignoir au sol, draps froissés, miroir embué, ta semence sur la commode',
      closing:
        'elle remonte les draps, chemise retrouvée ; verrouille la porte, joue rose ; te chuchote : « Rien n\'a filtré. Garde ce silence. »',
    },
    low:
      'Tu t\'habilles en hâte, peignoir jeté, draps à peine remontés — elle croise les bras sur le lit, regard sec ; te toise : « Partir comme ça manque de respect. Reviens quand tu sauras rester. »',
  },
  'pack-3': {
    high: {
      setting:
        'Verrière vacillante, lune basse — matelas froissé, vitrage embué, condensation sur vos fronts',
      closing:
        'elle replie le matelas, essuie la vitre d\'un revers ; te tend la main ; murmure : « Pas un bruit en bas. Redescends quand je le dis. »',
    },
    low:
      'Tu boucles ta veste trop vite, matelas à peine replié — elle reste seule sur la verrière, cuisses tremblantes ; regard sec : « Ce n\'était pas une fuite autorisée. Reviens quand tu sauras rester nu. »',
  },
  'pack-4': {
    high: {
      setting: 'Première lueur sur les tuiles — couverture tachée, braguette refermée, village endormi',
      closing:
        'Lyra verrouille la trappe, cheveux en désordre ; te retient sur la première marche, yeux amusés : « Entre le toit et nous. Demain, comme si de rien n\'était. »',
    },
    low:
      'L\'aube monte — tu boucles ta braguette trop vite, couverture mal repliée ; Lyra verrouille la trappe, regard sec ; te toise : « Vertige oui. Pas encore le reste. Reviens sur le toit. »',
  },
  'pack-5': {
    high: {
      setting:
        'Registres clos, lampe éteinte — atlas déplacés, gode essuyé sur une reliure, comptoir collant sous vos doigts',
      closing:
        'Lyra redresse sa robe, essuie tes paumes sur le cuir ; te retient la nuque, yeux amusés : « Le masque toute la journée. Ce soir, silence. Demain, même tabouret. »',
    },
    low:
      'Verrou du soir tiré trop tôt — atlas mal refermé, registre realigné, gode encore humide ; elle te repousse vers le comptoir ; te toise sous les travées, regard sec : « À chaque pause tu as failli. Demain, le bestiaire debout — à voix haute, lentement. »',
  },
};

const PACK_ACT_FINALE_FEMALE = {
  'pack-1': {
    high: {
      setting:
        'Verrou du fond, lampe basse — registre renversé, table souillée, ta chatte et ses doigts encore mouillés',
      closing:
        'elle remonte sa robe, cheveux décoiffés ; elle te retient contre les rayons, puis murmure : « Personne n\'est passée. On remet tout en ordre avant l\'aube. »',
    },
    low:
      'Verrou tiré trop tôt — registre ouvert, table effleurée, robe remontée en catastrophe ; elle te repousse du rayon, joue froide ; te toise sous la lampe, regard sec : « Trop vite. Le verrou tient — reprends quand tu sauras rester. »',
  },
  'pack-2': {
    high: {
      setting:
        'Chambre au havre, bougie morte — peignoir abandonné, draps en bordel, miroir embué, cuisses encore tremblantes',
      closing:
        'elle remonte ta robe, lisse les draps ; verrouille la porte, joue rose ; te chuchote : « Rien n\'a filtré. Garde ce silence. »',
    },
    low:
      'Tu remontes ta robe en hâte, peignoir jeté, draps à peine remontés — elle croise les bras sur le lit, regard sec ; te toise : « Partir comme ça manque de respect. Reviens quand tu sauras rester. »',
  },
  'pack-3': {
    high: {
      setting: 'Verrière vacillante, lune basse — matelas froissé, vitrage embué, ta chatte collante à la sienne',
      closing:
        'elle replie le matelas, robe remontée ; te tend la main ; murmure : « Pas un bruit en bas. Redescends quand je le dis. »',
    },
    low:
      'Tu remontes ta robe trop vite, matelas à peine replié — elle reste seule sur la verrière, cuisses tremblantes ; regard sec : « Ce n\'était pas une fuite autorisée. Reviens quand tu sauras rester nue. »',
  },
  'pack-4': {
    high: {
      setting: 'Première lueur — culotte remontée, couverture tachée, robe froissée, vitrage encore embué',
      closing:
        'Lyra verrouille la trappe, joue rose ; te retient la main sur l\'escalier, yeux amusés : « Entre le toit et nous. Demain, même silence au comptoir. »',
    },
    low:
      'L\'aube grise — tu remontes ta robe trop vite, couverture mal repliée ; Lyra verrouille la trappe d\'un geste sec ; te toise : « Vertige oui. Pas encore le reste. Reviens sur le toit. »',
  },
  'pack-5': {
    high: {
      setting:
        'Registres clos, comptoir éteint — atlas déplacés, gode sur une reliure, doigts encore mouillés',
      closing:
        'Lyra remonte sa robe, essuie tes paumes sur le cuir ; te retient la nuque, yeux amusés : « Le masque toute la journée. Ce soir, silence. Demain, même tabouret. »',
    },
    low:
      'Verrou du soir trop bruyant — atlas mal refermé, registre realigné, gode encore humide ; elle te repousse vers le comptoir ; te toise sous les travées, regard sec : « À chaque pause tu as failli. Demain, le bestiaire debout — à voix haute, lentement. »',
  },
};

/** ——— Aff. 5 — MC homme ——— */
const AFF5_MALE = [
  {
    title: 'Verrou tiré',
    bridge: 'À la bibliothèque, Lyra vient de tirer le verrou. Sa robe de nuit ne cache presque rien sous la lampe.',
    companionAction: 'Elle te plaque contre la porte du fond, une cuisse glissée entre tes jambes.',
    companionLine: 'Reste contre la porte — je décide quand tu bouges.',
    choices: [
      choice('romantic', 'Je reste immobile contre la porte et je la laisse serrer mes hanches, main sur ma braguette.', 3, 'romantic', '« Tiens bon. » *Elle serre tes hanches contre la porte.*'),
      choice('sincere', 'Je reste près d\'elle et je signale si elle va trop vite contre la porte.', 2, 'warm', '« Signale. Mais ne t\'éloigne pas. »'),
      choice('direct', 'Je garde mes hanches immobiles une minute, puis je presse la sienne plus fort contre moi.', 1, 'firm', '« Une minute. Puis presse-toi contre moi. »'),
      choice('playful', 'D\'abord je feins de partir, puis je la retourne contre les rayons du fond.', 0, 'annoyed', '« Pas de fuite. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Mouillée',
    bridge: 'Toujours à la bibliothèque, elle s\'assoit au bord de la table de travail, cuisses entrouvertes sous la robe.',
    companionAction: 'Elle t\'attire contre la table, écarte les cuisses et presse ta main contre sa chatte mouillée.',
    companionLine: 'Bouge tes doigts quand je serre ton poignet.',
    choices: [
      choice('romantic', 'Je caresse son clitoris, puis je lui glisse deux doigts en elle lentement jusqu\'à ce qu\'elle tremble.', 3, 'romantic', '« Encore. » *Elle serre ton poignet.* « Tais-toi. »'),
      choice('sincere', 'Je sens sa main sur mon poignet et je ralentis dès qu\'elle serre.', 2, 'warm', '« Serre quand tu veux. Continue lentement. »'),
      choice('direct', 'Je retire ma main une seconde, puis je repose deux doigts plus fermement sur son clitoris.', 1, 'focused', '« Repose. Je veux sentir ta pression. »'),
      choice('playful', 'Feignant lecture du registre, je presse ma paume contre son clitoris quand même.', 0, 'dismissive', '« Oublie le registre. Mets ta main ici. »'),
    ],
  },
  {
    title: 'Entre les cuisses',
    bridge: 'Toujours à la bibliothèque — au bord de la table où tu l\'as fait mouiller, Lyra te tire entre les rayons du fond ; la chaleur monte, ses cuisses ouvertes au niveau de ton visage.',
    companionAction: 'Elle te pousse à genoux devant elle, doigts entrelacés dans tes cheveux, cuisses ouvertes sur ton visage.',
    companionLine: 'Goûte. Ne relève pas les yeux sans ma permission.',
    choices: [
      choice('romantic', 'Je lèche son clitoris sans relever les yeux, langue entre ses cuisses.', 3, 'romantic', '« Ne t\'arrête pas. » *Elle tire tes cheveux.* « Pas trop tôt. »'),
      choice('sincere', 'Je la laisse guider ma nuque et je ralentis dès qu\'elle serre mes cheveux.', 2, 'warm', '« Main dans tes cheveux. Garde ce rythme. »'),
      choice('direct', 'Je retiens ma langue une seconde, puis je reprends sur son clitoris, plus fort.', 1, 'firm', '« Une seconde. Puis ne t\'arrête pas. »'),
      choice('playful', 'Simulant recul du visage, je lèche sa chatte quand elle tire mes cheveux.', 0, 'annoyed', '« Langue sur ma chatte. Lèche. »'),
    ],
  },
  {
    title: 'Rien dessous',
    bridge: 'Au havre, tard ; sa chambre sent le thé et la cire. Le peignoir glisse, entrouvert sur sa poitrine nue.',
    companionAction: 'Elle jette le peignoir, te jette sur le lit et s\'assoit à califourchon sur tes hanches, doigts sur les boutons de ta chemise.',
    companionLine: 'Laisse-moi déshabiller. Tu restes à ma merci, sans protester.',
    choices: [
      choice('romantic', 'Je reste immobile sous elle et je la laisse ouvrir ma chemise, puis mon pantalon, sans rien cacher.', 3, 'romantic', '« Parfait. » *Elle finit de t\'ôter la chemise et ton pantalon, ta verge dure contre son ventre nu.*'),
      choice('sincere', 'Immobilisé sous Lyra, je signale d\'un geste si elle va trop vite.', 2, 'warm', '« Signale. Je continue. »'),
      choice('direct', 'Immobilisé une seconde sous elle, puis je la retourne et la presse contre les draps.', 1, 'focused', '« Si tu veux jouer, assume. Je veux que tu me prennes toute la nuit. » *Elle écarte les cuisses et te lance un regard de défi.*'),
      choice('playful', 'Feignant de croiser les bras sur ma poitrine, je les relâche quand elle fronce les sourcils.', 0, 'annoyed', '« Pas de jeu. Laisse-moi faire. »'),
    ],
  },
  {
    title: 'Elle monte',
    bridge: 'Nu sur les draps où elle vient de t\'ôter ta chemise, Lyra s\'agenouille sur tes hanches — un genou de chaque côté.',
    companionAction: 'Elle te plaque sur le dos et prend ta bite en elle, d\'un geste lent puis profond, gémissant contre ton cou.',
    companionLine: 'Garde les mains sur ma taille. Ne lâche pas.',
    choices: [
      choice('romantic', 'J\'agrippe ses hanches et je la laisse enfoncer ma bite jusqu\'au fond.', 3, 'romantic', '« Oui. » *Elle descend d\'un coup.* « Ne lâche pas mes hanches. »'),
      choice('sincere', 'Je reste allongé et je guide ses hanches lentement d\'abord.', 2, 'pleased', '« Lent d\'abord. Puis plus fort. »'),
      choice('direct', 'Je laisse mes mains immobiles une seconde, puis je retourne la position et je lui enfonce ma bite par-dessus.', 1, 'firm', '« Retourne-moi. Prends-moi par-dessus. »'),
      choice('playful', 'Feignant recul, je la tire plus fort sur ma bite.', 0, 'dismissive', '« Pas de jeu. Laisse-moi monter. »'),
    ],
  },
  {
    title: 'Sans détour',
    bridge: 'Elle te relève du lit, haletante ; contre la commode du havre, Lyra te fixe, une main entre tes cuisses.',
    companionAction: 'Elle se penche sur la commode, fesses offertes, et te guide en elle par derrière en serrant ta taille.',
    companionLine: 'Serre ma taille plus fort quand je te le demande.',
    choices: [
      choice('romantic', 'Contre la commode, je l\'encule jusqu\'à ce qu\'elle gémisse.', 3, 'romantic', '« Encore. Plus fort. Ne retiens rien. » *Elle serre la commode, voix basse.*'),
      choice('sincere', 'Contre le bois, je serre sa taille et je ralentis dès qu\'elle fronce les sourcils.', 2, 'warm', '« Ralentis si tu veux. Ne t\'arrête pas. »'),
      choice('direct', 'Je garde ma prise une seconde, puis je la retourne sur le lit.', 1, 'focused', '« Sur le lit. Puis encore plus fort. »'),
      choice('playful', 'Feignant un faible relâchement, je resserre ma prise sur sa taille.', 0, 'annoyed', '« Pas de lâcher. Serre plus fort. »'),
    ],
  },
  {
    title: 'Entre en moi',
    bridge: 'Sous la verrière, lune sur les vitrages ; matelas bas, draps froissés, peaux collées et chaudes.',
    companionAction: 'Elle s\'assoit à califourchon sur tes hanches, chatte ouverte au-dessus de ta bite, mains sur ton torse — elle tient, ne descend pas encore.',
    companionLine: 'Attends mon signal sur tes hanches — après, je descends.',
    choices: [
      choice('romantic', 'Je reste immobile allongé — je la laisse serrer mes hanches avant de glisser en elle.', 3, 'romantic', '« Alors viens. » *Elle serre tes hanches.* « Ne te retiens pas. »'),
      choice('sincere', 'Je reste immobile et j\'enfonce ma bite lentement quand elle serre mes hanches.', 2, 'warm', '« Lent, puis fort. Je te demanderai. »'),
      choice('direct', 'Je la retourne et je lui enfonce ma bite avant qu\'elle ait fini de parler.', 1, 'focused', '« Retourne-moi. En moi, maintenant. »'),
      choice('playful', 'Simulant immobilité, je la prends d\'un coup.', 0, 'annoyed', '« Moins de théâtre. En moi, maintenant. »'),
    ],
  },
  {
    title: 'Stop',
    bridge: 'Toujours sous la verrière — bite en elle, buée sur le vitrage ; elle serre ta taille, rythme qui accélère.',
    companionAction: 'À califourchon, elle monte plus fort sur ta bite et te tend le poignet à taper si ça brûle.',
    companionLine: 'Tape mon poignet si c\'est trop.',
    choices: [
      choice('romantic', 'Je serre ses hanches et je continue jusqu\'à ce qu\'elle halète mon nom.', 3, 'romantic', '« Alors baise-moi jusqu\'à ce que j\'oublie ce mot. »'),
      choice('sincere', 'Je tape son poignet dès que ça brûle et je ralentis tout de suite.', 2, 'pleased', '« Tape si ça brûle. Ralentis sans t\'arrêter. »'),
      choice('direct', 'Je dis stop d\'une voix basse si elle serre trop fort.', 1, 'firm', '« Stop entendu. Dis-le si ça pique. »'),
      choice('playful', 'Feignant un tapotage à vide sur son poignet, je la presse plus fort.', 0, 'dismissive', '« Pas de faux signal. Tape pour de vrai. »'),
    ],
  },
  {
    title: 'Contre le montant',
    bridge: 'Toujours sous la verrière — condensation sur la vitraille ; Lyra te plaque dos contre le montant de bois, chatte encore trempée, souffle chaud dans ta nuque.',
    companionAction: 'Par derrière, elle glisse trois doigts en toi par-dessus l\'épaule, lèvres sur ta nuque, autre main sur ton ventre.',
    companionLine: 'Arche le dos. Presse-toi contre ma main.',
    choices: [
      choice('romantic', 'Je me cambre contre le montant et je cède à ses doigts jusqu\'à ce que je jouisse.', 3, 'romantic', '« Presse le montant. » *Elle accélère, buée sur le vitrage.* « Laisse-toi jouir. »'),
      choice('sincere', 'Contre le montant, je retiens ma respiration et je tape son poignet si ça brûle trop.', 2, 'warm', '« Serre le montant. Tape si ça brûle trop. »'),
      choice('direct', 'Une seconde immobile contre le bois, puis je pousse mes hanches sur sa paume.', 1, 'focused', '« Maintenant. Plus fort. »'),
      choice('playful', 'Simulant recul du montant, je cambre le bassin contre sa paume quand elle m\'attrape par la taille.', 0, 'annoyed', '« Cambre-toi. Contre ma main. »'),
    ],
  },
  {
    title: 'Avant le matin',
    bridge: 'Sur le toit du havre, avant l\'aube — air froid, village endormi en contrebas ; Lyra déroule une couverture et t\'allonge sur le dos ; elle ouvre ta braguette, s\'empale sur ta bite — genoux de chaque côté, robe relevée sur les cuisses.',
    companionAction: 'Elle bouge déjà sur toi, paume sur ton poignet — elle accélère quand tu obéis au signal, ralentit quand tu devances.',
    companionLine: 'Signal au poignet. Tu pousses seulement quand je serre.',
    choices: [
      choice('romantic', 'Je presse mes hanches contre les siennes et je la laisse mener le rythme jusqu\'à ce qu\'elle jouisse.', 3, 'romantic', '« Là. Ne t\'arrête pas avant que je jouisse. »'),
      choice('sincere', 'Quand elle serre mes hanches, je ralentis sans reprendre le tempo.', 2, 'warm', '« Mes hanches te guident. Suis mon rythme. »'),
      choice('direct', 'Je retiens ses hanches une minute, puis je la bascule sur le dos à côté de moi.', 1, 'firm', '« Retourne-moi si tu peux. Puis reprends. »'),
      choice('playful', 'D\'abord je reste raide sous elle, puis je la serre plus fort contre moi.', 0, 'annoyed', '« Trop raide. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Sa bouche',
    bridge: 'Toujours sur le toit — elle se relève à peine, cuisses encore tremblantes, ta bite encore raide ; Lyra te plaque dos à la rambarde et descend entre tes jambes.',
    companionAction: 'Elle s\'agenouille sur la couverture entre tes jambes et prend ta bite dans sa bouche, paume sur ta hanche.',
    companionLine: 'Tiens la rambarde. Ne te retiens pas — je m\'occupe du reste.',
    choices: [
      choice('romantic', 'Dos à la rambarde, immobile, je la laisse sucer ma bite jusqu\'à ce que je jouisse.', 3, 'romantic', '« Laisse-toi… aller. J\'avale. » *Elle hache chaque mot entre deux va-et-vient dans sa bouche.*'),
      choice('sincere', 'Quand elle serre ma hanche, je retiens ma respiration sans reprendre le contrôle.', 2, 'warm', '« Poignet sur ma hanche. Laisse-toi aller — je mène. »'),
      choice('direct', 'Je retiens ses cheveux une seconde, puis je la laisse reprendre la profondeur qu\'elle veut.', 1, 'firm', '« Reprends. Plus profond si tu veux. »'),
      choice('playful', 'D\'abord je plaisante sur le vertige du toit, puis je me cambre contre sa bouche.', 0, 'annoyed', '« Vertige ou pas. Suce ma bite. »'),
    ],
  },
  {
    title: 'Avant l\'aube',
    bridge: 'L\'aube grise sur le toit — Lyra à quatre pattes, haletante, cuisses chancelantes ; elle te regarde par-dessus l\'épaule.',
    companionAction: 'Elle écarte les fesses d\'une main, coude sur la couverture, et te fait signe d\'approcher par derrière.',
    companionLine: 'Encule-moi maintenant — je te veux, je guide.',
    choices: [
      choice('romantic', 'Je glisse ma bite en son cul et je la laisse fixer le rythme jusqu\'à ce qu\'on jouisse tous les deux.', 3, 'romantic', '« Viens vite. Je suis à deux doigts de jouir. »'),
      choice('sincere', 'Je pénètre son cul lentement et je ralentis dès qu\'elle serre mes hanches.', 2, 'warm', '« Lent. Serre quand j\'accélère. »'),
      choice('direct', 'Je retiens le geste une seconde en elle, puis je la prends fort par derrière.', 1, 'firm', '« Maintenant. Puis encore, fort. »'),
      choice('playful', 'Feignant hésitation à l\'entrée, je la pénètre par derrière jusqu\'au fond.', 0, 'annoyed', '« Pas d\'hésitation. En mon cul, fort. »'),
    ],
  },
  {
    title: 'Pas de pas',
    bridge: 'Bibliothèque du havre, matin de cire et de papier — Lyra tourne encore une page au comptoir quand tu entres ; rien n\'était prévu entre vous ; dans le couloir de pierre, un chuchotement, puis des pas — on demande la bibliothécaire.',
    companionAction: 'Sans te laisser le temps, elle t\'attrape le poignet et te fourre sous le comptoir — index sur tes lèvres, genou qui te cloue au planches. Pas un ordre, juste ce geste sec. De face, elle se redresse comme si de rien n\'était ; le visiteur ne doit voir qu\'une employée posée.',
    companionLine: 'Bonjour — je suis la bibliothécaire. Un instant, je termine cette ligne du registre.',
    choices: [
      choice('romantic', 'Bouche scellée, je la laisse accueillir le visiteur d\'une voix posée tandis que sa jambe me cache sous le comptoir.', 3, 'romantic', '« Oui, bien sûr — je vous entends. » *Elle termine sa phrase vers le couloir sans trembler — genou qui te plaque, index sur tes lèvres.*'),
      choice('sincere', 'Retenant ma respiration, je n\'avance d\'un millimètre que si sa main le permet sur mon poignet.', 2, 'warm', '« Un instant, je consulte le registre. » *Elle serre ton poignet une seconde — reste dans son ombre, pas un bruit.*'),
      choice('direct', 'Un instant sans bouger sous le bois, puis je presse ma joue contre sa cheville.', 1, 'focused', '« Je reviens vers vous dans un moment. » *Elle presse ta nuque sous le bois — attend le claquement de porte.*'),
      choice('playful', 'Feignant un oubli de volume, je fais grincer une planche — puis je me fige quand son index se presse plus fort.', 0, 'annoyed', '« …Pardon ? Je n\'ai pas entendu. » *Elle te transperce d\'un regard sous le comptoir — index plus fort, puis reprend vers le couloir.*'),
    ],
  },
  {
    title: 'Tiroir secret',
    bridge: 'Toujours sous le bois — le visiteur attend son atlas depuis deux minutes ; Lyra cite des numéros de réserve d\'une voix posée ; tu n\'as encore rien touché ; le tiroir secret s\'entrebâille sous sa jupe : un gode qu\'elle n\'a pas sorti — elle ignore encore que tu l\'as vu.',
    companionAction: 'Index sur tes lèvres. Vers le couloir elle feint de feuilleter ; de ton angle, cuisses à peine entrouvertes — hasard ou impatience, pas une invitation qu\'elle oserait nommer. Un regard sous le bois, urgent et honteux ; elle ne peut ni te guider ni chuchoter.',
    companionLine: 'Les atlas du nord sont en réserve deux — je vous les sortirai dans un instant.',
    choices: [
      choice('romantic', 'Doigts sur son clitoris, je caresse au rythme de sa citation d\'atlas — elle retient un frisson sans couper sa phrase.', 3, 'romantic', '« Section trois… oui, tout à l\'heure. » *Elle mord l\'intérieur de la joue — serre tes cheveux une seconde, puis relâche.*'),
      choice('sincere', 'Je reste immobile jusqu\'à ce que sa cheville cède d\'un millimètre — puis je caresse, plus lent quand elle serre.', 2, 'warm', '« Je note votre demande, monsieur. » *Elle serre ta cheville quand ça brûle — voix toujours posée vers le couloir.*'),
      choice('direct', 'Sans bouger sous le bois, je retiens le geste puis je caresse son clitoris quand le visiteur marque une pause.', 1, 'focused', '« …Comme vous dites. » *Elle marque une pause vers le visiteur — te fixe une seconde sous le bois, mâchoire serrée.*'),
      choice('playful', 'D\'abord je retire ma main une seconde, puis je caresse sa chatte quand son regard me transperce sous le bois.', 0, 'annoyed', '« Vous disiez ? » *Elle te mord la cheville sous le bois — genou qui te bloque, puis reprend sa citation.*'),
    ],
  },
  {
    title: 'Sans prévenir',
    bridge: 'Le visiteur feuillette un registre ; Lyra commente une gravure pour le couloir ; le gode au creux de ta main — elle ne l\'a pas vu entrer, rien n\'a encore pénétré ; c\'est toi qui choisis le premier cran.',
    companionAction: 'Voix claire sur la gravure ; sous le bois, cuisses qui se contractent autour de rien. Quand le visiteur marque une pause, elle serre tes cheveux une fraction — pas pour mener, pour ne pas crier. Dehors, une bibliothécaire distraite, joues roses.',
    companionLine: 'Je vous montre cette gravure — remarquez le trait du scribe, second siècle, ici.',
    choices: [
      choice('romantic', 'Sans prévenir, je glisse le gode en elle à sa pause — sa voix reprend sur la gravure sans faillir.', 3, 'romantic', '« …Remarquez, ici, l\'usure du parchemin. » *Elle serre le manche via ta main — frisson retenu, voix qui reprend aussitôt.*'),
      choice('sincere', 'Lentement, je pousse le gode d\'un cran — je m\'arrête dès qu\'elle retient un gémissement, sans bruit contre le bois.', 2, 'warm', '« Ici, le filigrane… » *Elle serre tes cheveux quand ça brûle — lent, sans bruit.*'),
      choice('direct', 'Un instant à caler le gode, puis j\'enfonce d\'un cran quand elle fait une pause vers le couloir.', 1, 'firm', '« …Un instant. » *Elle marque une pause vers le visiteur — mâchoire serrée, yeux qui supplient sous le bois.*'),
      choice('playful', 'Feignant de poser le gode au sol, puis j\'enfonce le gode quand son index se presse plus fort sur mes lèvres.', 0, 'dismissive', '« Je vous écoute. » *Elle appuie son index sur tes lèvres — puis reprend sur la gravure.*'),
    ],
  },
  {
    title: 'Voix posée',
    bridge: 'Une heure plus tard au comptoir : gode en elle depuis que tu l\'as enfoncé sans prévenir — elle n\'a jamais choisi le moment ; le visiteur tourne une page ; Lyra énumère les amendes d\'une voix trop régulière ; ce n\'est plus son rythme, c\'est le tien.',
    companionAction: 'Elle serre la mâchoire vers le visiteur, retient un frisson — regard sous le comptoir qui supplie sans ordonner. Quand tu bouges le manche, ses cuisses tremblent ; dehors, une plume immobile sur le registre.',
    companionLine: 'Les amendes de retard figurent au registre B — je vous les indique tout de suite.',
    choices: [
      choice('romantic', 'Je pousse le gode plus profond à mon tempo — j\'arrête net avant qu\'elle vacille, voix claire sur les amendes.', 3, 'romantic', '« …Colonne quatre. » *Elle mord sa lèvre — frisson retenu, puis reprend vers le couloir.*'),
      choice('sincere', 'Quand elle serre mes cheveux, je ralentis ; quand elle relâche, je reprends — sans quitter la cadence de sa citation.', 2, 'warm', '« …Colonne quatre, oui. » *Elle serre sans bruit — voix stable vers le visiteur.*'),
      choice('direct', 'Je retiens le manche une seconde, puis je presse plus fort quand elle frôle un gémissement retenu.', 1, 'focused', '« …Comme indiqué. » *Elle serre tes cheveux une seconde — panique étouffée, pas un ordre.*'),
      choice('playful', 'D\'abord je ralentis une seconde sur le manche pour la taquiner, puis je repousse là où ses hanches cherchent.', 0, 'annoyed', '« Pardon ? » *Elle te fixe sous le bois — genou qui te bloque une seconde, puis reprend sa litanie.*'),
    ],
  },
  {
    title: 'Deux doigts',
    bridge: 'Le visiteur feuillette encore au comptoir — Lyra recommande une réserve à voix basse, gode toujours en elle, fesses serrées sur le tabouret.',
    companionAction: 'Sans couper sa phrase elle cambre d\'un millimètre — de ton côté, accès à son anus ; elle n\'a pas ouvert la bouche. Le visiteur fronce les sourcils : bibliothécaire distraite, joues de plus en plus roses.',
    companionLine: 'La réserve fermée s\'ouvre sur rendez-vous — je peux vous noter demain matin.',
    choices: [
      choice('romantic', 'Je glisse un doigt en son anus pendant qu\'elle conclut sur la réserve — je ralentis dès que sa voix frôle la faille.', 3, 'romantic', '« …Demain matin, oui. » *Elle serre ton poignet une seconde — presque un gémissement retenu, voix qui tient.*'),
      choice('sincere', 'Un doigt lent en son anus ; je ralentis dès qu\'elle serre mes doigts contre le bois — gode immobile entre deux phrases.', 2, 'warm', '« Je note votre nom… » *Elle serre tes doigts — garde la voix posée.*'),
      choice('direct', 'Un instant sans bouger, puis un doigt anal quand elle serre mon poignet — deux seulement si sa voix reste stable.', 1, 'firm', '« …Entendu. » *Elle serre ton poignet — une seconde, puis relâche.*'),
      choice('playful', 'Feignant maladresse sur sa cuisse, je presse un doigt contre son anus quand le visiteur baisse les yeux sur le registre.', 0, 'dismissive', '« Je vous écoute. » *Elle te fixe sous le bois — cuisses qui se contractent, pas un geste vers ta main.*'),
    ],
  },
  {
    title: 'Deux allées plus loin',
    bridge: 'Fin de matinée — le visiteur s\'est perdu dans les travées ; gode enfoncé depuis le matin, tu mènes ; Lyra feuillette un registre, mais deux allées plus loin on entend encore des pages.',
    companionAction: 'Elle entend des pages crisser au loin, jette un regard sous le bois : lèvres serrées, hanches qui cherchent plus — sans pouvoir demander à voix basse — puis retourne au registre d\'une voix trop posée.',
    companionLine: 'Les tarifs de retard n\'ont pas changé depuis l\'hiver — je vous indique la colonne.',
    choices: [
      choice('romantic', 'Je pousse le gode à mon tempo — je m\'arrête avant qu\'elle halète, sa voix toujours posée sur les tarifs.', 3, 'romantic', '« …Colonne sept. » *Elle serre tes cheveux d\'un cran — tremblement retenu, plume immobile.*'),
      choice('sincere', 'Pages qui crissent deux allées plus loin — je ralentis dès qu\'elle serre mes cheveux, sans couper sa litanie sur les tarifs.', 2, 'warm', '« …Comme indiqué ici. » *Elle serre tes cheveux — voix stable malgré le frisson.*'),
      choice('direct', 'Je reste muet une seconde sous le bois, puis je pousse d\'un cran quand elle tourne une page du registre.', 1, 'focused', '« …Voilà la ligne. » *Elle te fixe une seconde sous le comptoir — yeux humides, pas un mot.*'),
      choice('playful', 'Simulant lâcher le manche, je repousse quand elle m\'attrape la nuque — deux allées plus loin, rien ne bouge.', 0, 'annoyed', '« …Colonne sept. » *Elle te repousse la main sur le manche — puis reprend vers les travées.*'),
    ],
  },
  {
    title: 'Plume immobile',
    bridge: 'Midi vient de sonner ; gode en place depuis des heures, chaque cran mené par toi ; Lyra penchée au comptoir, plume sur le papier, masque intact — la salle basse est quasi vide.',
    companionAction: 'Elle s\'assoit raide sur le tabouret, sourire professionnel vers la porte vitrée — il vacille quand tu bouges le manche sans qu\'elle l\'ait permis. L\'apprenti ne voit qu\'une bibliothécaire un peu tendue.',
    companionLine: 'Oui ? Entrez — asseyez-vous, je finis cette page.',
    choices: [
      choice('romantic', 'Pendant qu\'elle salue l\'apprenti, j\'avance le gode d\'un cran — j\'arrête net quand sa voix frôle la faille, sans la laisser basculer.', 3, 'romantic', '« …Asseyez-vous. Je finis cette page. » *Elle garde la voix stable vers la porte — mord sa lèvre d\'un millimètre.*'),
      choice('sincere', 'Rythme lent sur le manche ; je ralentis dès qu\'elle serre mes doigts contre le bois.', 2, 'warm', '« Un instant… » *Elle serre tes doigts — voix posée vers l\'apprenti.*'),
      choice('direct', 'Immobilisé une seconde sous le comptoir, puis je pousse d\'un cran au moment où elle dit entre.', 1, 'firm', '« …Entrez. » *Elle marque une pause vers la porte — retient un frisson, plume immobile.*'),
      choice('playful', 'D\'abord je tapote le tiroir comme distrait, puis j\'enfonce le gode quand l\'apprenti baisse les yeux sur ses notes.', 0, 'dismissive', '« Oui ? » *Elle te cloue du regard — mâchoire serrée, puis reprend vers l\'apprenti.*'),
    ],
  },
  {
    title: 'Masque qui craque',
    bridge: 'Fin d\'après-midi — bibliothèque vide, porte du couloir fermée ; sous le comptoir, le gode depuis des heures, impossible à retirer sans risquer un bruit. Assise raide, joues roses : le contrôle lâche.',
    companionAction: 'Elle ne te guide plus : mains blanches sur le bois, regard qui fuit le tien puis revient brûlant. Vers la porte close, elle feint encore le masque ; sous le bois, hanches qui demandent sans pouvoir commander.',
    companionLine: 'J\'ai envie de toi — continue. Ce soir, tu es ma chose.',
    choices: [
      choice('romantic', 'Sans attendre, je pousse le gode jusqu\'à frôler sa limite et je m\'arrête net — elle n\'a rien vu venir, seulement senti.', 3, 'romantic', '« …Oui. Continue sous le bois. » *Elle mord sa lèvre — masque qui craque, yeux vers la porte close.*'),
      choice('sincere', 'Lentement sur le manche, je ralentis quand ses doigts se crispent sur le tabouret — elle retient chaque souffle comme s\'il restait du monde dehors.', 2, 'warm', '« J\'ai envie… » *Elle retient un frisson — doigts blancs sur le bois, pas sur ton poignet.*'),
      choice('direct', 'Je retiens le gode une seconde, puis j\'enfonce d\'un cran sans attendre — je m\'arrête quand ses cuisses tremblent.', 1, 'firm', '« …Encore. » *Elle fronce les sourcils vers la porte — honte et envie, sans te freiner.*'),
      choice('playful', 'D\'abord je fais semblant de lâcher le manche, puis je repousse quand elle cherche ta main — je chuchote qu\'elle déteste vouloir autant.', 0, 'annoyed', '« …Tu le sais. » *Elle détourne les yeux — mâchoire serrée, joues qui brûlent.*'),
    ],
  },
  {
    title: 'Verrou du soir',
    bridge: 'Le soir tombe ; Lyra tire le verrou principal, éteint la lampe du comptoir — seules les hautes travées restent dans la pénombre ambrée, odeur de cuir et de cire.',
    companionAction: 'Elle te tire de sous le comptoir entre deux rayonnages, robe relevée, gode encore humide entre tes doigts — plus personne ne passera avant l\'aube.',
    companionLine: 'J\'ai tenu le masque toute la journée. Plus personne — prends-moi jusqu\'à ce que j\'oublie les registres.',
    choices: [
      choice('romantic', 'Je pose le gode, j\'ouvre ma braguette, je glisse en elle et la plaque contre les atlas.', 3, 'romantic', '« Oui. Là, entre les atlas. Ne te retiens pas — personne n\'écoute. » *Elle serre tes hanches, chatte chaude contre ta bite.*'),
      choice('sincere', 'Entre les travées, je suis son tempo et je ralentis quand elle serre mes hanches plus fort.', 2, 'warm', '« Suis mon tempo. Presse-toi quand je serre. »'),
      choice('direct', 'Une minute debout entre les rayons, puis je la retourne contre un atlas et je la prends jusqu\'au bruit des reliures.', 1, 'firm', '« Maintenant. Fort. Fais grincer le bois. »'),
      choice('playful', 'D\'abord je chuchote une citation du bestiaire pour la taquiner, puis je la plaque contre le rayonnage le plus bruyant.', 0, 'annoyed', '« Pas de citation. Plaque-moi. Fort. »'),
    ],
  },
];

/** ——— Aff. 4 — MC homme (suggestif) ——— */
const AFF4_MALE = [
  {
    title: 'Verrou tiré',
    bridge: 'À la bibliothèque, Lyra pose sa main sur le verrou ; la porte de fond coupe déjà le bruit des rayons.',
    companionAction: 'Elle te tire dans le couloir du fond, épaule contre épaule.',
    companionLine: 'Suis mon pas. Reste près de moi.',
    choices: [
      choice('romantic', 'Je serre sa main et je la suis jusqu\'à la porte du fond.', 3, 'romantic', '« Bien. Reste contre moi dans le couloir. »'),
      choice('sincere', 'Je reste près d\'elle et je ralentis si elle hésite un instant.', 2, 'warm', '« Je n\'hésite pas. Suis mon pas. »'),
      choice('direct', 'Je la suis d\'un pas, sans parler avant le fond.', 1, 'focused', '« Moins de mots. Plus de proximité. »'),
      choice('playful', 'Simulant une hésitation au couloir, je recule d\'un pas puis je la rattrape au coin.', 0, 'annoyed', '« Pas de recul. Viens. »'),
    ],
  },
  {
    title: 'Contre le mur',
    bridge: 'Dans le couloir du fond, Lyra te plaque contre le mur ; sa respiration chauffe ta nuque.',
    companionAction: 'Elle rapproche son corps du tien et te serre contre le mur, mains sur ta taille.',
    companionLine: 'Ne recule pas. Garde tes mains sur moi.',
    choices: [
      choice('romantic', 'Je glisse mes mains sur sa taille et je la rapproche encore.', 3, 'romantic', '« Encore. Je veux sentir ton souffle sur mon cou. »'),
      choice('sincere', 'Je reste immobile une seconde, puis je la serre lentement contre le mur.', 2, 'warm', '« Doucement suffit. Ne lâche pas. »'),
      choice('direct', 'Je compte deux secondes front contre front, puis je presse mon front contre le sien sans la lâcher.', 1, 'firm', '« Garde ce contact. On avance. »'),
      choice('playful', 'D\'abord je retourne la pression et je la plaque à mon tour.', 0, 'dismissive', '« Retourne-moi plus tard. Là, suis. »'),
    ],
  },
  {
    title: 'Porte de chambre',
    bridge: 'Lyra ouvre la porte de sa chambre au havre ; la lumière baisse d\'un geste sur la peau.',
    companionAction: 'Elle ouvre la porte de sa chambre et te tire à l\'intérieur, doigt sur tes lèvres.',
    companionLine: 'Je veux le silence. Ferme derrière toi.',
    choices: [
      choice('romantic', 'Je passe le seuil avec elle et je ferme la porte derrière nous.', 3, 'romantic', '« Bien. On est seuls dans ma chambre. »'),
      choice('sincere', 'Je la suis pas à pas et je ralentis si elle hésite un instant.', 2, 'pleased', '« Je la ferme. Reste là. »'),
      choice('direct', 'Je m\'assois au bord du lit sans attendre qu\'elle parle.', 1, 'focused', '« Assieds-toi. Je viens à côté. »'),
      choice('playful', 'D\'abord je m\'allonge sur le lit avant qu\'elle ait fini d\'allumer.', 0, 'annoyed', '« Pas si vite. Viens près de moi d\'abord. »'),
    ],
  },
  {
    title: 'Peignoir entrouvert',
    bridge: 'Sa chambre sent le thé ; une tension électrique flotte dans l\'air. Le peignoir glisse sur son épaule nue.',
    companionAction: 'Elle écarte son peignoir sur l\'épaule et te guide vers le lit d\'un geste sur ta main.',
    companionLine: 'Je te laisse toucher, lentement — sans brusquer.',
    choices: [
      choice('romantic', 'Je touche sa peau à l\'épaule et je la suis jusqu\'au lit.', 3, 'romantic', '« Touche. Je suis prête à t\'avoir près. »'),
      choice('sincere', 'Je la laisse guider ma main, lentement, sans brusquer.', 2, 'warm', '« Lentement. Je te montre où poser tes doigts. »'),
      choice('direct', 'Je garde ma place debout trente secondes, puis je m\'assois au bord du lit.', 1, 'focused', '« Attends. Je viens contre toi. »'),
      choice('playful', 'D\'abord je tire le peignoir un peu plus, puis je recule d\'un pas.', 0, 'dismissive', '« Pas de jeu. Guide-toi vers moi. »'),
    ],
  },
  {
    title: 'Bord du lit',
    bridge: 'Lyra s\'assoit au bord du lit, peignoir entrouvert sur sa poitrine.',
    companionAction: 'Elle s\'assoit sur le lit et te fait signe de la rejoindre, patte invitant sur les draps.',
    companionLine: 'Je t\'attends. Assieds-toi, puis rapproche-toi.',
    choices: [
      choice('romantic', 'Je m\'assois à côté d\'elle et je glisse ma main dans la sienne.', 3, 'romantic', '« Reste. Je veux ton poids contre le mien. »'),
      choice('sincere', 'Je la rejoins et je reste immobile jusqu\'à ce qu\'elle bouge.', 2, 'warm', '« Immobile, oui. Puis rapproche-toi. »'),
      choice('direct', 'Je m\'allonge à côté d\'elle sans attendre son signal.', 1, 'firm', '« Allonge-toi. Je viens sur ton torse. »'),
      choice('playful', 'D\'abord je m\'assois de l\'autre côté du lit pour la faire venir.', 0, 'annoyed', '« Pas l\'autre côté. Rejoins-moi ici. »'),
    ],
  },
  {
    title: 'Baiser fort',
    bridge: 'Sur le balcon du havre, la nuit ; Lyra te fixe, lèvres déjà proches des tiennes.',
    companionAction: 'Elle t\'embrasse plus fort et presse ses lèvres contre ton cou, main dans tes cheveux.',
    companionLine: 'Embrasse-moi en retour. Ne t\'arrête pas au cou.',
    choices: [
      choice('romantic', 'Je l\'embrasse en retour et je serre sa taille contre moi.', 3, 'romantic', '« Encore. Ne t\'arrête pas au cou. »'),
      choice('sincere', 'Je cède au baiser et je signale d\'un geste si c\'est trop fort.', 2, 'warm', '« Signale. Sinon je continue. »'),
      choice('direct', 'Je garde nos fronts collés une seconde, puis je l\'embrasse sur la bouche.', 1, 'focused', '« Bouche, oui. Garde tes mains sur moi. »'),
      choice('playful', 'D\'abord je détourne la tête une seconde, puis je la rattrape.', 0, 'dismissive', '« Pas de fuite. Embrasse-moi. »'),
    ],
  },
  {
    title: 'Dos nu',
    bridge: 'Sur le balcon, Lyra glisse ses doigts le long de ton dos ; la ville bruit en contrebas.',
    companionAction: 'Elle glisse ses doigts le long de ton dos, ongles légers sous ta chemise.',
    companionLine: 'Je continue. Signale d\'un geste si ça va trop loin.',
    choices: [
      choice('romantic', 'Je presse mon corps contre le sien et je la laisse continuer.', 3, 'romantic', '« Continue. Je sens que tu veux plus. »'),
      choice('sincere', 'Je reste immobile et je signale d\'un geste si ça va trop loin.', 2, 'warm', '« Geste suffit. Je ralentis tout de suite. »'),
      choice('direct', 'Je compte trois secondes sans bouger, puis je guide sa main plus bas.', 1, 'focused', '« Plus bas. Je te suis. »'),
      choice('playful', 'D\'abord je fronce les sourcils exprès, puis je l\'attire plus près.', 0, 'annoyed', '« Pas de grimace. Dis-moi ou montre. »'),
    ],
  },
  {
    title: 'Signaler stop',
    bridge: 'Sur le balcon, vos corps déjà rapprochés contre la rambarde ; le vent glisse sous votre peignoir.',
    companionAction: 'Elle serre ta taille contre la rambarde, rythme qui accélère sous le peignoir entrouvert.',
    companionLine: 'Tape mon poignet si c\'est trop.',
    choices: [
      choice('romantic', 'Je prends sa main et je la presse contre mon torse, sans rien cacher.', 3, 'romantic', '« Bien. Je reste à ton rythme ce soir. »'),
      choice('sincere', 'Je pose ma main sur son poignet — signe clair si ça brûle.', 2, 'pleased', '« Signale. Je ralentis. »'),
      choice('direct', 'Je dis stop d\'une voix basse si elle serre trop fort.', 1, 'firm', '« Stop entendu. Je lâche un peu. »'),
      choice('playful', 'D\'abord je feins de froncer les sourcils, puis je l\'attire contre moi.', 0, 'dismissive', '« Pas de faux signal. Sois honnête. »'),
    ],
  },
  {
    title: 'Le long du cou',
    bridge: 'Dans le jardin du havre, à l\'aube ; Lyra incline la tête, sa peau chaude contre ton cou.',
    companionAction: 'Elle descend un baiser le long de ton cou, lèvres chaudes sur ta peau.',
    companionLine: 'Ne détourne pas la tête. Reste.',
    choices: [
      choice('romantic', 'Je tourne la tête pour lui offrir plus de peau et je serre sa taille.', 3, 'romantic', '« Encore. Je veux te sentir frissonner. »'),
      choice('sincere', 'Je m\'immobilise contre elle et je signale d\'un geste si ça brûle.', 2, 'warm', '« Immobile. Je descends encore. »'),
      choice('direct', 'Je garde mon cou offert une seconde de plus, puis je presse son épaule vers ma bouche.', 1, 'focused', '« Monte. Je t\'embrasse là. »'),
      choice('playful', 'D\'abord je pivote le visage une seconde, puis je lui offre mon cou.', 0, 'annoyed', '« Pas de détour. Reste. »'),
    ],
  },
  {
    title: 'Porte du lit',
    bridge: 'Dans le pavillon du jardin, Lyra ferme la porte ; le bruit du village s\'éteint dehors.',
    companionAction: 'Elle ferme la porte du pavillon et te serre contre elle, corps entier collé au tien.',
    companionLine: 'Reste collé. Ne lâche pas.',
    choices: [
      choice('romantic', 'Je m\'allonge contre elle sur les draps et je la serre contre moi.', 3, 'romantic', '« Reste collé. Je veux sentir ton souffle. »'),
      choice('sincere', 'Je reste contre ses draps et je signale d\'un geste si elle serre trop fort.', 2, 'warm', '« Près suffit. Rapproche encore. »'),
      choice('direct', 'Je compte trois secondes debout, puis je passe une jambe sur le lit et je la tire à côté de moi.', 1, 'focused', '« À côté. Je m\'allonge sur ton torse. »'),
      choice('playful', 'D\'abord je m\'allonge de l\'autre côté du lit pour la faire venir.', 0, 'dismissive', '« Pas l\'autre côté. Contre moi. »'),
    ],
  },
  {
    title: 'Jambe sur toi',
    bridge: 'Dans le pavillon, Lyra passe une jambe sur tes hanches ; le matelas creuse sous vous.',
    companionAction: 'Elle passe une jambe sur toi et te presse contre le matelas, hanches lourdes sur les tiennes.',
    companionLine: 'Serre ma taille. Suis mon rythme.',
    choices: [
      choice('romantic', 'Je serre sa taille et je la rapproche jusqu\'à ce qu\'on respire pareil.', 3, 'romantic', '« Encore. Je veux ton poids sous le mien. »'),
      choice('sincere', 'Je reste allongé et je ralentis quand elle ajuste la pression de sa jambe.', 2, 'warm', '« Ajuste. Dis-moi si c\'est lourd. »'),
      choice('direct', 'Je compte trente secondes sans bouger, puis je retourne la position et je la presse contre les draps.', 1, 'firm', '« Retourne-moi. Garde tes mains sur ma taille. »'),
      choice('playful', 'D\'abord je bouge la jambe pour la faire glisser, puis je la rattrape.', 0, 'annoyed', '« Pas de jeu. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Suis mon rythme',
    bridge: 'Dans le pavillon, Lyra t\'embrasse déjà ; ses doigts s\'enfoncent dans la couverture.',
    companionAction: 'Elle t\'embrasse jusqu\'à ce que tu perdes le fil, lèvres insistantes sur ta bouche.',
    companionLine: 'Garde mon rythme. Ne lâche pas mes hanches.',
    choices: [
      choice('romantic', 'Je suis son rythme et je l\'embrasse jusqu\'à ce qu\'elle tremble.', 3, 'romantic', '« Encore. Ne lâche pas mes hanches. »'),
      choice('sincere', 'Je ralentis quand elle halète et je reprends quand elle serre ma main.', 2, 'warm', '« Ralentis bien. Reprends quand je serre. »'),
      choice('direct', 'Je garde son rythme trente secondes, puis je l\'allonge sur le dos, doucement.', 1, 'focused', '« Allonge-moi. Suis ton envie. »'),
      choice('playful', 'D\'abord je fais semblant de perdre le fil, puis je la rattrape au cou.', 0, 'dismissive', '« Pas de faux rythme. Suis le mien. »'),
    ],
  },
];

/** ——— Aff. 5 — MC femme ——— */
const AFF5_FEMALE = [
  {
    title: 'Verrou tiré',
    bridge: 'À la bibliothèque, Lyra vient de tirer le verrou. Sa robe de nuit laisse voir la courbe de ses hanches sous la lampe.',
    companionAction: 'Elle te plaque contre la porte du fond, main glissée sous ta robe, doigts sur ta culotte.',
    companionLine: 'Reste contre la porte — mes doigts décident quand tu bouges.',
    choices: [
      choice('romantic', 'Je reste immobile contre la porte et je la laisse glisser sa main plus loin sans bouger.', 3, 'romantic', '« Tiens bon. » *Elle serre tes hanches contre la porte.*'),
      choice('sincere', 'Je reste près d\'elle et je signale si sa main va trop vite.', 2, 'warm', '« Signale. Mais ne t\'éloigne pas. »'),
      choice('direct', 'Je garde ses mains sur moi une seconde, puis je la retourne contre les étagères.', 1, 'firm', '« Retourne-moi. Touche-moi ici. »'),
      choice('playful', 'D\'abord je feins de partir, puis je la rattrape au couloir.', 0, 'annoyed', '« Pas de fuite. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Mouillée',
    bridge: 'Toujours à la bibliothèque — Lyra te tire sur la table de travail ; tu t\'assois au bord, cuisses entrouvertes, regard fixé sur elle.',
    companionAction: 'Elle se place face à toi, écarte un peu plus tes cuisses et presse ses doigts contre ta chatte par-dessus le tissu.',
    companionLine: 'Bouge contre ma main quand je te le dis.',
    choices: [
      choice('romantic', 'Je presse ma chatte contre sa paume et je bouge au rythme qu\'elle impose, jusqu\'à ce que j\'halète.', 3, 'romantic', '« Encore. » *Elle serre tes hanches.* « Tais-toi. »'),
      choice('sincere', 'Je la laisse mener et je ralentis dès qu\'elle resserre sa prise sur mes hanches.', 2, 'warm', '« Plus lent. Garde ce rythme. »'),
      choice('direct', 'Je bloque sa paume une seconde, puis je la fais glisser plus bas vers mon anus.', 1, 'focused', '« … Là ? Non. Clitoris. Bouge quand je te le dis. » *Elle serre tes hanches pour te remettre en place.*'),
      choice('playful', 'Feignant lecture du registre, je me presse contre sa main.', 0, 'dismissive', '« Oublie le registre. Mouille ma paume. »'),
    ],
  },
  {
    title: 'Entre les cuisses',
    bridge: 'Encore à la bibliothèque — ta chatte encore brûlante sur la table ; sa bouche descend déjà vers ton ventre.',
    companionAction: 'Elle s\'agenouille entre tes cuisses sur la table et écarte ta culotte d\'un geste.',
    companionLine: 'Laisse-moi te lécher. Ne te redresse pas.',
    choices: [
      choice('romantic', 'Je m\'allonge sur la table et je la laisse lécher mon clitoris sans attendre.', 3, 'romantic', '« Ne t\'arrête pas. » *Elle tire tes cuisses.* « Pas trop tôt. »'),
      choice('sincere', 'Je guide sa tête vers mon clitoris et je signale si c\'est trop.', 2, 'warm', '« Main sur ma nuque. Garde ce rythme. »'),
      choice('direct', 'Je retiens mes hanches une seconde, puis je presse ma chatte contre sa langue.', 1, 'firm', '« Une seconde. Puis ne t\'arrête pas. »'),
      choice('playful', 'Simulant recul, j\'écarte les cuisses quand elle m\'attire.', 0, 'annoyed', '« Écarte les cuisses. Maintenant. »'),
    ],
  },
  {
    title: 'Peignoir ouvert',
    bridge: 'Au havre, tard ; sa chambre sent le thé et la cire. Le peignoir glisse sur ses épaules nues.',
    companionAction: 'Elle laisse tomber le peignoir, te pousse sur le dos contre les draps et dégrafe ta robe d\'un geste — genoux qui encadrent ta taille.',
    companionLine: 'Laisse-moi t\'ôter la robe. Tu ne protestes pas.',
    choices: [
      choice('romantic', 'Je reste immobile sous elle et je la laisse glisser ma robe, puis mon slip, sans rien cacher.', 3, 'romantic', '« Parfait. » *Elle finit de t\'ôter la robe et ton slip, ta chatte nue contre la sienne.*'),
      choice('sincere', 'Immobilisée sous Lyra, je signale d\'un geste si elle va trop vite.', 2, 'warm', '« Signale. Je continue. »'),
      choice('direct', 'Immobilisé une seconde sous elle, puis je la retourne et la presse contre les draps.', 1, 'focused', '« Si tu veux jouer, assume. Je veux que tu me prennes toute la nuit. » *Elle écarte les cuisses et te lance un regard de défi.*'),
      choice('playful', 'Feignant de croiser les bras sur ma poitrine, je les relâche quand elle fronce les sourcils.', 0, 'annoyed', '« Pas de jeu. Laisse-moi faire. »'),
    ],
  },
  {
    title: 'Elle monte',
    bridge: 'Nu sur les draps où elle vient de glisser ta robe, Lyra se met à califourchon — un genou de chaque côté.',
    companionAction: 'Elle te plaque sur le dos et frotte sa chatte contre la tienne, hanches déjà en mouvement, souffle court.',
    companionLine: 'Garde tes mains sur mes hanches. Ne lâche pas.',
    choices: [
      choice('romantic', 'Je serre sa taille et je la laisse frotter sa chatte contre la mienne jusqu\'à ce qu\'on jouisse.', 3, 'romantic', '« Oui. » *Elle accélère.* « Ne lâche pas mes hanches. »'),
      choice('sincere', 'Je reste allongée et je guide ses hanches lentement d\'abord.', 2, 'pleased', '« Lent d\'abord. Puis plus fort. »'),
      choice('direct', 'Immobilisé une seconde, puis je la bascule sur le dos.', 1, 'firm', '« Bascule-moi. Prends-moi par-dessus. »'),
      choice('playful', 'Feignant recul, je la tire plus fort sur moi.', 0, 'dismissive', '« Pas de jeu. Laisse-moi monter. »'),
    ],
  },
  {
    title: 'Doigts',
    bridge: 'Elle te relève du lit, haletante ; debout près du lit, Lyra te fixe, deux doigts déjà humides entre ses cuisses.',
    companionAction: 'Elle te pousse sur le lit, glisse ses doigts en toi et te retient par le poignet.',
    companionLine: 'Serre ma main plus fort quand je te le demande.',
    choices: [
      choice('romantic', 'Contre la commode, je me cambre contre sa paume jusqu\'à ce qu\'elle gémit.', 3, 'romantic', '« Alors reste. Ne te retiens pas. »'),
      choice('sincere', 'Contre le bois, je retiens ma respiration et je serre sa main quand elle accélère — je ralentis dès qu\'elle fronce.', 2, 'warm', '« Ralentis si tu veux. Ne t\'arrête pas. »'),
      choice('direct', 'Je garde ma prise une seconde, puis je retourne la position à mon tour.', 1, 'focused', '« Mon tour. Puis encore le tien. »'),
      choice('playful', 'Feignant un faible relâchement, je resserre ma prise sur sa main.', 0, 'annoyed', '« Pas de lâcher. Serre plus fort. »'),
    ],
  },
  {
    title: 'Face à face',
    bridge: 'Sur le matelas sous la verrière, lune sur les vitrages ; vos chattes déjà humides, draps froissés collés aux cuisses.',
    companionAction: 'Elle t\'allonge sur le dos, s\'assoit à califourchon sur ta cuisse et frotte son clitoris contre le tien, main crispée dans tes cheveux.',
    companionLine: 'Attends mon signal — je mène le rythme.',
    choices: [
      choice('romantic', 'Je m\'allonge immobile, hanches calées sous les siennes, et je la laisse frotter sa chatte contre la mienne.', 3, 'romantic', '« Tu peux jouir. Ne te retiens pas. » *Elle accélère et glisse un doigt entre vos clitoris.*'),
      choice('sincere', 'Je ralentis ma respiration et je monte le rythme seulement quand elle serre mes hanches.', 2, 'warm', '« Lent, puis fort. Suis mon tempo. »'),
      choice('direct', 'Je retiens sa taille une seconde, puis je la retourne avant qu\'elle ait fini de parler.', 1, 'focused', '« Retourne-moi. Contre moi, maintenant. »'),
      choice('playful', 'Simulant raideur, je presse ma chatte plus fort contre la sienne.', 0, 'annoyed', '« Moins de théâtre. Contre moi, maintenant. »'),
    ],
  },
  {
    title: 'Stop',
    bridge: 'Toujours sous la verrière — chattes collées, buée sur le vitrage ; Lyra serre ta taille, rythme qui monte.',
    companionAction: 'À califourchon sur ta cuisse, elle accélère le frottement clitoris contre clitoris et te tend le poignet.',
    companionLine: 'Tape ma main si ça brûle trop.',
    choices: [
      choice('romantic', 'Je serre ses hanches et je presse ma chatte contre la sienne jusqu\'à ce qu\'elle halète mon nom.', 3, 'romantic', '« Alors jouis. Ne retiens pas ce mot. »'),
      choice('sincere', 'Je tape son poignet dès que le frottement brûle et je ralentis tout de suite.', 2, 'pleased', '« Tape si ça brûle. Ralentis sans t\'arrêter. »'),
      choice('direct', 'Je dis stop d\'une voix basse si elle serre trop fort contre mon clitoris.', 1, 'firm', '« Stop entendu. Dis-le si ça pique. »'),
      choice('playful', 'Simulant détente des cuisses, je la presse plus fort contre moi.', 0, 'dismissive', '« Pas de faux signal. Presse-toi pour de vrai. »'),
    ],
  },
  {
    title: 'Vitrage embué',
    bridge: 'Toujours sous la verrière — condensation sur la vitraille ; Lyra te plaque dos contre le montant, ta chatte trempée, clitoris pulsant sous sa paume.',
    companionAction: 'Bouche dans ta nuque, dos au montant — elle enroule un bras, paume sur ton clitoris, trois doigts enfoncés en ta chatte.',
    companionLine: 'Arche le dos. Presse ta chatte contre ma main.',
    choices: [
      choice('romantic', 'Je me cambre contre le montant et je cède à ses doigts sur mon clitoris jusqu\'à ce que je jouisse.', 3, 'romantic', '« Presse le montant. » *Elle accélère, buée sur le vitrage.* « Laisse-toi jouir. »'),
      choice('sincere', 'Contre le montant, je retiens ma respiration et je tape son poignet si mes cuisses brûlent trop.', 2, 'warm', '« Serre le montant. Tape si ça brûle trop. »'),
      choice('direct', 'Une seconde immobile contre le bois, puis je pousse ma chatte sur sa paume.', 1, 'focused', '« Maintenant. Plus fort. »'),
      choice('playful', 'Simulant recul du montant, je cambre le bassin quand elle m\'attrape par la taille.', 0, 'annoyed', '« Cambre-toi. Contre ma main. »'),
    ],
  },
  {
    title: 'Avant le matin',
    bridge: 'Sur le toit du havre, avant l\'aube — air froid, village endormi en contrebas ; Lyra déroule une couverture et t\'allonge sur le dos ; elle écarte vos robes et s\'assoit sur toi, chatte contre chatte — cuisses qui serrent tes hanches.',
    companionAction: 'Elle frotte déjà contre toi, paume sur ton poignet — elle accélère quand tu obéis au signal, ralentit quand tu devances.',
    companionLine: 'Signal au poignet — tu frottes seulement quand je serre tes hanches.',
    choices: [
      choice('romantic', 'Je presse mes hanches contre les siennes, je frotte ma chatte contre la sienne et je la laisse mener le rythme jusqu\'à ce qu\'elle jouisse.', 3, 'romantic', '« Là. Ne t\'arrête pas avant que je jouisse. »'),
      choice('sincere', 'Quand elle serre mes hanches, je ralentis sans reprendre le rythme.', 2, 'warm', '« Mes hanches te guident. Suis mon tempo. »'),
      choice('direct', 'Je retiens ses hanches une minute, puis je la bascule sur le dos à côté de moi.', 1, 'firm', '« Retourne-moi si tu peux. Puis presse-toi contre moi. »'),
      choice('playful', 'D\'abord je reste raide sous elle, puis je la serre plus fort contre ma chatte.', 0, 'annoyed', '« Trop raide. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Sa langue',
    bridge: 'Toujours sur le toit — à peine relevées l\'une de l\'autre, cuisses encore tremblantes ; Lyra haletante repousse tes jambes et s\'installe entre tes cuisses.',
    companionAction: 'Elle écarte tes cuisses sur la couverture et enfonce sa langue dans ta chatte, paume sur ton ventre.',
    companionLine: 'Ne ferme pas les cuisses — laisse-moi finir, je m\'occupe de ton clitoris.',
    choices: [
      choice('romantic', 'Je m\'allonge sur la couverture et je la laisse lécher ma chatte jusqu\'à ce que je jouisse.', 3, 'romantic', '« Laisse-toi… aller. Continue. » *Elle hache chaque mot entre deux va-et-vient de sa langue.*'),
      choice('sincere', 'Quand elle serre mon ventre, je retiens ma respiration sans fermer les cuisses.', 2, 'warm', '« Main sur mon ventre. Laisse-toi aller — je mène. »'),
      choice('direct', 'Je compte trente secondes main sur sa nuque, puis je la laisse reprendre sur mon clitoris.', 1, 'firm', '« Reprends. Plus fort si tu veux. »'),
      choice('playful', 'D\'abord je retiens mes cuisses une seconde, puis je les écarte contre sa langue.', 0, 'annoyed', '« Écarte. Lèche ma chatte. »'),
    ],
  },
  {
    title: 'Avant l\'aube',
    bridge: 'L\'aube grise sur le toit — Lyra à quatre pattes, haletante, chatte qui dégouline ; elle pose ton gode sur la couverture.',
    companionAction: 'Elle écarte les fesses d\'une main, coude sur la couverture, et te tend le gode d\'un geste sec.',
    companionLine: 'En mon cul maintenant — je te veux, guide le gode.',
    choices: [
      choice('romantic', 'Je glisse le gode en son cul et je la laisse fixer le rythme jusqu\'à ce qu\'on jouisse toutes les deux.', 3, 'romantic', '« Viens vite. Je suis à deux doigts de jouir. »'),
      choice('sincere', 'Je pénètre son cul avec le gode lentement et je ralentis dès qu\'elle serre mes doigts.', 2, 'warm', '« Lent. Serre quand j\'accélère. »'),
      choice('direct', 'Je retiens le geste une seconde en elle, puis je pousse le gode plus fort par derrière.', 1, 'firm', '« Maintenant. Puis encore, fort. »'),
      choice('playful', 'D\'abord je brandis le gode une seconde, puis je le pousse en son cul d\'un coup.', 0, 'annoyed', '« Pas d\'hésitation. En mon cul, fort. »'),
    ],
  },
  {
    title: 'Pas de pas',
    bridge: 'Bibliothèque du havre, matin de cire et de papier — Lyra tourne encore une page au comptoir quand tu entres ; rien n\'était prévu entre vous ; dans le couloir de pierre, un chuchotement, puis des pas — on demande la bibliothécaire.',
    companionAction: 'Sans te laisser le temps, elle t\'attrape le poignet et te fourre sous le comptoir — index sur tes lèvres, genou qui te cloue au planches. Pas un ordre, juste ce geste sec. De face, elle se redresse comme si de rien n\'était ; le visiteur ne doit voir qu\'une employée posée.',
    companionLine: 'Bonjour — je suis la bibliothécaire. Un instant, je termine cette ligne du registre.',
    choices: [
      choice('romantic', 'Bouche scellée, je la laisse accueillir le visiteur d\'une voix posée tandis que sa jambe me cache sous le comptoir.', 3, 'romantic', '« Oui, bien sûr — je vous entends. » *Elle termine sa phrase vers le couloir sans trembler — genou qui te plaque, index sur tes lèvres.*'),
      choice('sincere', 'Retenant ma respiration, je n\'avance d\'un millimètre que si sa main le permet sur mon poignet.', 2, 'warm', '« Un instant, je consulte le registre. » *Elle serre ton poignet une seconde — reste dans son ombre, pas un bruit.*'),
      choice('direct', 'Un instant sans bouger sous le bois, puis je presse ma joue contre sa cheville.', 1, 'focused', '« Je reviens vers vous dans un moment. » *Elle presse ta nuque sous le bois — attend le claquement de porte.*'),
      choice('playful', 'Feignant un oubli de volume, je fais grincer une planche — puis je me fige quand son index se presse plus fort.', 0, 'annoyed', '« …Pardon ? Je n\'ai pas entendu. » *Elle te transperce d\'un regard sous le comptoir — index plus fort, puis reprend vers le couloir.*'),
    ],
  },
  {
    title: 'Tiroir secret',
    bridge: 'Toujours sous le bois — le visiteur attend son atlas depuis deux minutes ; Lyra cite des numéros de réserve d\'une voix posée ; tu n\'as encore rien touché ; le tiroir secret s\'entrebâille sous sa jupe : un gode qu\'elle n\'a pas sorti — elle ignore encore que tu l\'as vu.',
    companionAction: 'Index sur tes lèvres. Vers le couloir elle feint de feuilleter ; de ton angle, cuisses à peine entrouvertes — hasard ou impatience, pas une invitation qu\'elle oserait nommer. Un regard sous le bois, urgent et honteux ; elle ne peut ni te guider ni chuchoter.',
    companionLine: 'Les atlas du nord sont en réserve deux — je vous les sortirai dans un instant.',
    choices: [
      choice('romantic', 'Doigts sur son clitoris, je caresse au rythme de sa citation d\'atlas — elle retient un frisson sans couper sa phrase.', 3, 'romantic', '« Section trois… oui, tout à l\'heure. » *Elle mord l\'intérieur de la joue — serre tes cheveux une seconde, puis relâche.*'),
      choice('sincere', 'Je reste immobile jusqu\'à ce que sa cheville cède d\'un millimètre — puis je caresse, plus lent quand elle serre.', 2, 'warm', '« Je note votre demande, monsieur. » *Elle serre ta cheville quand ça brûle — voix toujours posée vers le couloir.*'),
      choice('direct', 'Sans bouger sous le bois, je retiens le geste puis je caresse son clitoris quand le visiteur marque une pause.', 1, 'focused', '« …Comme vous dites. » *Elle marque une pause vers le visiteur — te fixe une seconde sous le bois, mâchoire serrée.*'),
      choice('playful', 'D\'abord je retire ma main une seconde, puis je caresse sa chatte quand son regard me transperce sous le bois.', 0, 'annoyed', '« Vous disiez ? » *Elle te mord la cheville sous le bois — genou qui te bloque, puis reprend sa citation.*'),
    ],
  },
  {
    title: 'Sans prévenir',
    bridge: 'Le visiteur feuillette un registre ; Lyra commente une gravure pour le couloir ; le gode au creux de ta main — elle ne l\'a pas vu entrer, rien n\'a encore pénétré ; c\'est toi qui choisis le premier cran.',
    companionAction: 'Voix claire sur la gravure ; sous le bois, cuisses qui se contractent autour de rien. Quand le visiteur marque une pause, elle serre tes cheveux une fraction — pas pour mener, pour ne pas crier. Dehors, une bibliothécaire distraite, joues roses.',
    companionLine: 'Je vous montre cette gravure — remarquez le trait du scribe, second siècle, ici.',
    choices: [
      choice('romantic', 'Sans prévenir, je glisse le gode en elle à sa pause — sa voix reprend sur la gravure sans faillir.', 3, 'romantic', '« …Remarquez, ici, l\'usure du parchemin. » *Elle serre le manche via ta main — frisson retenu, voix qui reprend aussitôt.*'),
      choice('sincere', 'Lentement, je pousse le gode d\'un cran — je m\'arrête dès qu\'elle retient un gémissement, sans bruit contre le bois.', 2, 'warm', '« Ici, le filigrane… » *Elle serre tes cheveux quand ça brûle — lent, sans bruit.*'),
      choice('direct', 'Un instant à caler le gode, puis j\'enfonce d\'un cran quand elle fait une pause vers le couloir.', 1, 'firm', '« …Un instant. » *Elle marque une pause vers le visiteur — mâchoire serrée, yeux qui supplient sous le bois.*'),
      choice('playful', 'Feignant de poser le gode au sol, puis j\'enfonce le gode quand son index se presse plus fort sur mes lèvres.', 0, 'dismissive', '« Je vous écoute. » *Elle appuie son index sur tes lèvres — puis reprend sur la gravure.*'),
    ],
  },
  {
    title: 'Voix posée',
    bridge: 'Une heure plus tard au comptoir : gode en elle depuis que tu l\'as enfoncé sans prévenir — elle n\'a jamais choisi le moment ; le visiteur tourne une page ; Lyra énumère les amendes d\'une voix trop régulière ; ce n\'est plus son rythme, c\'est le tien.',
    companionAction: 'Elle serre la mâchoire vers le visiteur, retient un frisson — regard sous le comptoir qui supplie sans ordonner. Quand tu bouges le manche, ses cuisses tremblent ; dehors, une plume immobile sur le registre.',
    companionLine: 'Les amendes de retard figurent au registre B — je vous les indique tout de suite.',
    choices: [
      choice('romantic', 'Je pousse le gode plus profond à mon tempo — j\'arrête net avant qu\'elle vacille, voix claire sur les amendes.', 3, 'romantic', '« …Colonne quatre. » *Elle mord sa lèvre — frisson retenu, puis reprend vers le couloir.*'),
      choice('sincere', 'Quand elle serre mes cheveux, je ralentis ; quand elle relâche, je reprends — sans quitter la cadence de sa citation.', 2, 'warm', '« …Colonne quatre, oui. » *Elle serre sans bruit — voix stable vers le visiteur.*'),
      choice('direct', 'Je retiens le manche une seconde, puis je presse plus fort quand elle frôle un gémissement retenu.', 1, 'focused', '« …Comme indiqué. » *Elle serre tes cheveux une seconde — panique étouffée, pas un ordre.*'),
      choice('playful', 'D\'abord je ralentis une seconde sur le manche pour la taquiner, puis je repousse là où ses hanches cherchent.', 0, 'annoyed', '« Pardon ? » *Elle te fixe sous le bois — genou qui te bloque une seconde, puis reprend sa litanie.*'),
    ],
  },
  {
    title: 'Deux doigts',
    bridge: 'Le visiteur feuillette encore au comptoir — Lyra recommande une réserve à voix basse, gode toujours en elle, fesses serrées sur le tabouret.',
    companionAction: 'Sans couper sa phrase elle cambre d\'un millimètre — de ton côté, accès à son anus ; elle n\'a pas ouvert la bouche. Le visiteur fronce les sourcils : bibliothécaire distraite, joues de plus en plus roses.',
    companionLine: 'La réserve fermée s\'ouvre sur rendez-vous — je peux vous noter demain matin.',
    choices: [
      choice('romantic', 'Je glisse un doigt en son anus pendant qu\'elle conclut sur la réserve — je ralentis dès que sa voix frôle la faille.', 3, 'romantic', '« …Demain matin, oui. » *Elle serre ton poignet une seconde — presque un gémissement retenu, voix qui tient.*'),
      choice('sincere', 'Un doigt lent en son anus ; je ralentis dès qu\'elle serre mes doigts contre le bois — gode immobile entre deux phrases.', 2, 'warm', '« Je note votre nom… » *Elle serre tes doigts — garde la voix posée.*'),
      choice('direct', 'Un instant sans bouger, puis un doigt anal quand elle serre mon poignet — deux seulement si sa voix reste stable.', 1, 'firm', '« …Entendu. » *Elle serre ton poignet — une seconde, puis relâche.*'),
      choice('playful', 'Feignant maladresse sur sa cuisse, je presse un doigt contre son anus quand le visiteur baisse les yeux sur le registre.', 0, 'dismissive', '« Je vous écoute. » *Elle te fixe sous le bois — cuisses qui se contractent, pas un geste vers ta main.*'),
    ],
  },
  {
    title: 'Deux allées plus loin',
    bridge: 'Fin de matinée — le visiteur s\'est perdu dans les travées ; gode enfoncé depuis le matin, tu mènes ; Lyra feuillette un registre, mais deux allées plus loin on entend encore des pages.',
    companionAction: 'Elle entend des pages crisser au loin, jette un regard sous le bois : lèvres serrées, hanches qui cherchent plus — sans pouvoir demander à voix basse — puis retourne au registre d\'une voix trop posée.',
    companionLine: 'Les tarifs de retard n\'ont pas changé depuis l\'hiver — je vous indique la colonne.',
    choices: [
      choice('romantic', 'Je pousse le gode à mon tempo — je m\'arrête avant qu\'elle halète, sa voix toujours posée sur les tarifs.', 3, 'romantic', '« …Colonne sept. » *Elle serre tes cheveux d\'un cran — tremblement retenu, plume immobile.*'),
      choice('sincere', 'Pages qui crissent deux allées plus loin — je ralentis dès qu\'elle serre mes cheveux, sans couper sa litanie sur les tarifs.', 2, 'warm', '« …Comme indiqué ici. » *Elle serre tes cheveux — voix stable malgré le frisson.*'),
      choice('direct', 'Je reste muet une seconde sous le bois, puis je pousse d\'un cran quand elle tourne une page du registre.', 1, 'focused', '« …Voilà la ligne. » *Elle te fixe une seconde sous le comptoir — yeux humides, pas un mot.*'),
      choice('playful', 'Simulant lâcher le manche, je repousse quand elle m\'attrape la nuque — deux allées plus loin, rien ne bouge.', 0, 'annoyed', '« …Colonne sept. » *Elle te repousse la main sur le manche — puis reprend vers les travées.*'),
    ],
  },
  {
    title: 'Plume immobile',
    bridge: 'Midi vient de sonner ; gode en place depuis des heures, chaque cran mené par toi ; Lyra penchée au comptoir, plume sur le papier, masque intact — la salle basse est quasi vide.',
    companionAction: 'Elle s\'assoit raide sur le tabouret, sourire professionnel vers la porte vitrée — il vacille quand tu bouges le manche sans qu\'elle l\'ait permis. L\'apprenti ne voit qu\'une bibliothécaire un peu tendue.',
    companionLine: 'Oui ? Entrez — asseyez-vous, je finis cette page.',
    choices: [
      choice('romantic', 'Pendant qu\'elle salue l\'apprenti, j\'avance le gode d\'un cran — j\'arrête net quand sa voix frôle la faille, sans la laisser basculer.', 3, 'romantic', '« …Asseyez-vous. Je finis cette page. » *Elle garde la voix stable vers la porte — mord sa lèvre d\'un millimètre.*'),
      choice('sincere', 'Rythme lent sur le manche ; je ralentis dès qu\'elle serre mes doigts contre le bois.', 2, 'warm', '« Un instant… » *Elle serre tes doigts — voix posée vers l\'apprenti.*'),
      choice('direct', 'Immobilisé une seconde sous le comptoir, puis je pousse d\'un cran au moment où elle dit entre.', 1, 'firm', '« …Entrez. » *Elle marque une pause vers la porte — retient un frisson, plume immobile.*'),
      choice('playful', 'D\'abord je tapote le tiroir comme distraite, puis j\'enfonce le gode quand l\'apprenti baisse les yeux sur ses notes.', 0, 'dismissive', '« Oui ? » *Elle te cloue du regard — mâchoire serrée, puis reprend vers l\'apprenti.*'),
    ],
  },
  {
    title: 'Masque qui craque',
    bridge: 'Fin d\'après-midi — bibliothèque vide, porte du couloir fermée ; sous le comptoir, le gode depuis des heures, impossible à retirer sans risquer un bruit. Assise raide, joues roses : le contrôle lâche.',
    companionAction: 'Elle ne te guide plus : mains blanches sur le bois, regard qui fuit le tien puis revient brûlant. Vers la porte close, elle feint encore le masque ; sous le bois, hanches qui demandent sans pouvoir commander.',
    companionLine: 'J\'ai envie de toi — continue. Ce soir, tu es ma chose.',
    choices: [
      choice('romantic', 'Sans attendre, je pousse le gode jusqu\'à frôler sa limite et je m\'arrête net — elle n\'a rien vu venir, seulement senti.', 3, 'romantic', '« …Oui. Continue sous le bois. » *Elle mord sa lèvre — masque qui craque, yeux vers la porte close.*'),
      choice('sincere', 'Lentement sur le manche, je ralentis quand ses doigts se crispent sur le tabouret — elle retient chaque souffle comme s\'il restait du monde dehors.', 2, 'warm', '« J\'ai envie… » *Elle retient un frisson — doigts blancs sur le bois, pas sur ton poignet.*'),
      choice('direct', 'Je retiens le gode une seconde, puis j\'enfonce d\'un cran sans attendre — je m\'arrête quand ses cuisses tremblent.', 1, 'firm', '« …Encore. » *Elle fronce les sourcils vers la porte — honte et envie, sans te freiner.*'),
      choice('playful', 'D\'abord je fais semblant de lâcher le manche, puis je repousse quand elle cherche ta main — je chuchote qu\'elle déteste vouloir autant.', 0, 'annoyed', '« …Tu le sais. » *Elle détourne les yeux — mâchoire serrée, joues qui brûlent.*'),
    ],
  },
  {
    title: 'Verrou du soir',
    bridge: 'Le soir tombe ; Lyra tire le verrou principal, éteint la lampe du comptoir — seules les hautes travées restent dans la pénombre ambrée, odeur de cuir et de cire.',
    companionAction: 'Elle te tire de sous le comptoir entre deux rayonnages, robe relevée, gode encore humide entre tes doigts — plus personne ne passera avant l\'aube.',
    companionLine: 'J\'ai tenu le masque toute la journée. Plus personne — prends-moi jusqu\'à ce que j\'oublie les registres.',
    choices: [
      choice('romantic', 'Entre les atlas, je glisse le gode en elle et je presse ma chatte contre la sienne — enfin libres de faire du bruit.', 3, 'romantic', '« Oui. Là, entre les atlas. Ne te retiens pas — personne n\'écoute. » *Elle serre tes hanches, chatte chaude contre la tienne.*'),
      choice('sincere', 'Entre les travées, je suis son tempo et je ralentis quand elle serre mes hanches plus fort.', 2, 'warm', '« Suis mon tempo. Presse-toi quand je serre. »'),
      choice('direct', 'Une minute debout entre les rayons, puis je la retourne contre un atlas et je pousse le gode jusqu\'au bruit des reliures.', 1, 'firm', '« Maintenant. Fort. Fais grincer le bois. »'),
      choice('playful', 'D\'abord je chuchote une citation du bestiaire pour la taquiner, puis je me plaque contre le rayonnage le plus bruyant.', 0, 'annoyed', '« Pas de citation. Plaque-toi. Fort. »'),
    ],
  },
];

/** ——— Aff. 4 — MC femme (suggestif) ——— */
const AFF4_FEMALE = [
  {
    title: 'Verrou tiré',
    bridge: 'À la bibliothèque, Lyra pose sa main sur le verrou ; la porte de fond coupe le bruit des rayons.',
    companionAction: 'Elle te tire dans le couloir du fond, épaule contre épaule.',
    companionLine: 'Suis mon pas. Reste près de moi.',
    choices: [
      choice('romantic', 'Je serre sa main et je la suis jusqu\'à la porte du fond.', 3, 'romantic', '« Bien. Reste contre moi dans le couloir. »'),
      choice('sincere', 'Je reste près d\'elle et je ralentis si elle hésite un instant.', 2, 'warm', '« Je n\'hésite pas. Suis mon pas. »'),
      choice('direct', 'Je la suis d\'un pas, sans parler avant le fond.', 1, 'focused', '« Moins de mots. Plus de proximité. »'),
      choice('playful', 'Simulant une hésitation au couloir, je recule d\'un pas puis je la rattrape au coin.', 0, 'annoyed', '« Pas de recul. Viens. »'),
    ],
  },
  {
    title: 'Contre le mur',
    bridge: 'Dans le couloir du fond, Lyra te plaque contre le mur ; sa respiration chauffe ta nuque.',
    companionAction: 'Elle rapproche son corps du tien et te serre contre le mur, main sur ta taille.',
    companionLine: 'Ne recule pas. Garde tes mains sur moi.',
    choices: [
      choice('romantic', 'Je glisse mes mains sur sa taille et je la rapproche encore.', 3, 'romantic', '« Encore. Je veux sentir ton souffle sur mon cou. »'),
      choice('sincere', 'Je reste immobile une seconde, puis je la serre lentement contre le mur.', 2, 'warm', '« Doucement suffit. Ne lâche pas. »'),
      choice('direct', 'Je compte deux secondes front contre front, puis je presse mon front contre le sien sans la lâcher.', 1, 'firm', '« Garde ce contact. On avance. »'),
      choice('playful', 'D\'abord je retourne la pression et je la plaque à mon tour.', 0, 'dismissive', '« Retourne-moi plus tard. Là, suis. »'),
    ],
  },
  {
    title: 'Porte de chambre',
    bridge: 'Lyra ouvre la porte de sa chambre au havre ; la lumière baisse d\'un geste.',
    companionAction: 'Elle ouvre la porte de sa chambre et te tire à l\'intérieur, doigt sur tes lèvres.',
    companionLine: 'Je veux le silence. Ferme derrière toi.',
    choices: [
      choice('romantic', 'Je passe le seuil avec elle et je ferme la porte derrière nous.', 3, 'romantic', '« Bien. On est seules dans ma chambre. »'),
      choice('sincere', 'Je la suis pas à pas et je ralentis si elle hésite un instant.', 2, 'pleased', '« Je la ferme. Reste là. »'),
      choice('direct', 'Je m\'assois au bord du lit sans attendre qu\'elle parle.', 1, 'focused', '« Assieds-toi. Je viens à côté. »'),
      choice('playful', 'D\'abord je m\'allonge sur le lit avant qu\'elle ait fini d\'allumer.', 0, 'annoyed', '« Pas si vite. Viens près de moi d\'abord. »'),
    ],
  },
  {
    title: 'Peignoir entrouvert',
    bridge: 'Sa chambre sent le thé ; une tension électrique flotte dans l\'air. Le peignoir glisse sur son épaule nue.',
    companionAction: 'Elle écarte son peignoir sur l\'épaule et te guide vers le lit d\'un geste sur ta main.',
    companionLine: 'Je te laisse toucher, lentement — sans brusquer.',
    choices: [
      choice('romantic', 'Je touche sa peau à l\'épaule et je la suis jusqu\'au lit.', 3, 'romantic', '« Touche. Je suis prête à t\'avoir près. »'),
      choice('sincere', 'Je la laisse guider ma main, lentement, sans brusquer.', 2, 'warm', '« Lentement. Je te montre où poser tes doigts. »'),
      choice('direct', 'Je garde ma place debout trente secondes, puis je m\'assois au bord du lit.', 1, 'focused', '« Attends. Je viens contre toi. »'),
      choice('playful', 'D\'abord je tire le peignoir un peu plus, puis je recule d\'un pas.', 0, 'dismissive', '« Pas de jeu. Guide-toi vers moi. »'),
    ],
  },
  {
    title: 'Bord du lit',
    bridge: 'Lyra s\'assoit au bord du lit, peignoir entrouvert sur sa poitrine.',
    companionAction: 'Elle s\'assoit sur le lit et te fait signe de la rejoindre, paume invitante sur les draps.',
    companionLine: 'Je t\'attends. Assieds-toi, puis rapproche-toi.',
    choices: [
      choice('romantic', 'Je m\'assois à côté d\'elle et je glisse ma main dans la sienne.', 3, 'romantic', '« Reste. Je veux ton poids contre le mien. »'),
      choice('sincere', 'Je la rejoins et je reste immobile jusqu\'à ce qu\'elle bouge.', 2, 'warm', '« Immobile, oui. Puis rapproche-toi. »'),
      choice('direct', 'Je m\'allonge à côté d\'elle sans attendre son signal.', 1, 'firm', '« Allonge-toi. Je viens sur ton torse. »'),
      choice('playful', 'D\'abord je m\'assois de l\'autre côté du lit pour la faire venir.', 0, 'annoyed', '« Pas l\'autre côté. Rejoins-moi ici. »'),
    ],
  },
  {
    title: 'Baiser fort',
    bridge: 'Sur le balcon du havre, la nuit ; Lyra te fixe, lèvres déjà proches des tiennes.',
    companionAction: 'Elle t\'embrasse plus fort et presse ses lèvres contre ton cou, main dans tes cheveux.',
    companionLine: 'Embrasse-moi en retour. Ne t\'arrête pas au cou.',
    choices: [
      choice('romantic', 'Je l\'embrasse en retour et je serre sa taille contre moi.', 3, 'romantic', '« Encore. Ne t\'arrête pas au cou. »'),
      choice('sincere', 'Je cède au baiser et je signale d\'un geste si c\'est trop fort.', 2, 'warm', '« Signale. Sinon je continue. »'),
      choice('direct', 'Je garde nos fronts collés une seconde, puis je l\'embrasse sur la bouche.', 1, 'focused', '« Bouche, oui. Garde tes mains sur moi. »'),
      choice('playful', 'D\'abord je détourne la tête une seconde, puis je la rattrape.', 0, 'dismissive', '« Pas de fuite. Embrasse-moi. »'),
    ],
  },
  {
    title: 'Dos nu',
    bridge: 'Sur le balcon, Lyra glisse ses doigts le long de ton dos ; la ville bruit en contrebas.',
    companionAction: 'Elle glisse ses doigts le long de ton dos, ongles légers sous ta robe.',
    companionLine: 'Je continue. Signale d\'un geste si ça va trop loin.',
    choices: [
      choice('romantic', 'Je presse mon corps contre le sien et je la laisse continuer.', 3, 'romantic', '« Continue. Je sens que tu veux plus. »'),
      choice('sincere', 'Je reste immobile et je signale d\'un geste si ça va trop loin.', 2, 'warm', '« Geste suffit. Je ralentis tout de suite. »'),
      choice('direct', 'Je compte trois secondes sans bouger, puis je guide sa main plus bas.', 1, 'focused', '« Plus bas. Je te suis. »'),
      choice('playful', 'D\'abord je fronce les sourcils exprès, puis je l\'attire plus près.', 0, 'annoyed', '« Pas de grimace. Dis-moi ou montre. »'),
    ],
  },
  {
    title: 'Signaler stop',
    bridge: 'Sur le balcon, vos corps déjà rapprochés contre la rambarde ; le vent glisse sous votre peignoir.',
    companionAction: 'Elle serre ta taille contre la rambarde, rythme qui accélère sous le peignoir entrouvert.',
    companionLine: 'Tape mon poignet si c\'est trop.',
    choices: [
      choice('romantic', 'Je prends sa main et je la presse contre mon torse, sans rien cacher.', 3, 'romantic', '« Bien. Je reste à ton rythme ce soir. »'),
      choice('sincere', 'Je pose ma main sur son poignet — signe clair si ça brûle.', 2, 'pleased', '« Signale. Je ralentis. »'),
      choice('direct', 'Je dis stop d\'une voix basse si elle serre trop fort.', 1, 'firm', '« Stop entendu. Je lâche un peu. »'),
      choice('playful', 'D\'abord je feins de froncer les sourcils, puis je l\'attire contre moi.', 0, 'dismissive', '« Pas de faux signal. Sois honnête. »'),
    ],
  },
  {
    title: 'Le long du cou',
    bridge: 'Dans le jardin du havre, à l\'aube ; Lyra incline la tête, sa peau chaude contre ton cou.',
    companionAction: 'Elle descend un baiser le long de ton cou, lèvres chaudes sur ta peau.',
    companionLine: 'Ne détourne pas la tête. Reste.',
    choices: [
      choice('romantic', 'Je tourne la tête pour lui offrir plus de peau et je serre sa taille.', 3, 'romantic', '« Encore. Je veux te sentir frissonner. »'),
      choice('sincere', 'Je m\'immobilise contre elle et je signale d\'un geste si ça brûle.', 2, 'warm', '« Immobile. Je descends encore. »'),
      choice('direct', 'Je garde mon cou offert une seconde de plus, puis je presse son épaule vers ma bouche.', 1, 'focused', '« Monte. Je t\'embrasse là. »'),
      choice('playful', 'D\'abord je pivote le visage une seconde, puis je lui offre mon cou.', 0, 'annoyed', '« Pas de détour. Reste. »'),
    ],
  },
  {
    title: 'Porte du lit',
    bridge: 'Dans le pavillon du jardin, Lyra ferme la porte ; le bruit du village s\'éteint dehors.',
    companionAction: 'Elle ferme la porte du pavillon et te serre contre toi, corps entier collé au tien.',
    companionLine: 'Reste collée. Ne lâche pas.',
    choices: [
      choice('romantic', 'Je m\'allonge contre elle sur les draps et je la serre contre moi.', 3, 'romantic', '« Reste collée. Je veux sentir ton souffle. »'),
      choice('sincere', 'Je reste contre ses draps et je signale d\'un geste si elle serre trop fort.', 2, 'warm', '« Près suffit. Rapproche encore. »'),
      choice('direct', 'Je compte trois secondes debout, puis je passe une jambe sur le lit et je la tire à côté de moi.', 1, 'focused', '« À côté. Je m\'allonge sur ton torse. »'),
      choice('playful', 'D\'abord je m\'allonge de l\'autre côté du lit pour la faire venir.', 0, 'dismissive', '« Pas l\'autre côté. Contre moi. »'),
    ],
  },
  {
    title: 'Jambe sur toi',
    bridge: 'Dans le pavillon, Lyra passe une jambe sur tes hanches ; le matelas creuse sous vous.',
    companionAction: 'Elle passe une jambe sur toi et te presse contre le matelas, hanches lourdes sur les tiennes.',
    companionLine: 'Serre ma taille. Suis mon rythme.',
    choices: [
      choice('romantic', 'Je serre sa taille et je la rapproche jusqu\'à ce qu\'on respire pareil.', 3, 'romantic', '« Encore. Je veux ton poids sous le mien. »'),
      choice('sincere', 'Je reste allongée et je ralentis quand elle ajuste la pression de sa jambe.', 2, 'warm', '« Ajuste. Dis-moi si c\'est lourd. »'),
      choice('direct', 'Je compte trente secondes sans bouger, puis je retourne la position et je la presse contre les draps.', 1, 'firm', '« Retourne-moi. Garde tes mains sur ma taille. »'),
      choice('playful', 'D\'abord je bouge la jambe pour la faire glisser, puis je la rattrape.', 0, 'annoyed', '« Pas de jeu. Presse-toi contre moi. »'),
    ],
  },
  {
    title: 'Suis mon rythme',
    bridge: 'Dans le pavillon, Lyra t\'embrasse déjà ; ses doigts s\'enfoncent dans la couverture.',
    companionAction: 'Elle t\'embrasse jusqu\'à ce que tu perdes le fil, lèvres insistantes sur ta bouche.',
    companionLine: 'Garde mon rythme. Ne lâche pas mes hanches.',
    choices: [
      choice('romantic', 'Je suis son rythme et je l\'embrasse jusqu\'à ce qu\'elle tremble.', 3, 'romantic', '« Encore. Ne lâche pas mes hanches. »'),
      choice('sincere', 'Je ralentis quand elle halète et je reprends quand elle serre ma main.', 2, 'warm', '« Ralentis bien. Reprends quand je serre. »'),
      choice('direct', 'Je garde son rythme trente secondes, puis je l\'allonge sur le dos, doucement.', 1, 'focused', '« Allonge-moi. Suis ton envie. »'),
      choice('playful', 'D\'abord je fais semblant de perdre le fil, puis je la rattrape au cou.', 0, 'dismissive', '« Pas de faux rythme. Suis le mien. »'),
    ],
  },
];

const OUTPUTS = [
  {
    file: 'lyra-aff5-curated-12.json',
    corpus: buildCorpus({
      affinity: 5,
      gender: 'male',
      idSuffix: '',
      reviewDoc: 'docs/traceability/link-corpus-review/LYRA_AFF5_CURATED_12.md',
      purpose: 'Modèle qualité — 12 échanges curés aff. 5 — registre cru, MC homme, format action 3e pers.',
      criteria: [
        'companionAction (3e personne) + companionLine (réplique Lyra)',
        'answerRule « action » — choix joueur = actes',
        'registre aff. 5 : cru, consentement stop conservé',
        'protagonistGender: male',
        'S20 réplique parlée (je/tu) — pas didascalie « Fort. »',
        'S22 alignement geste Lyra ↔ choix +3',
        'S23 intimateFinale (épilogue tu) sur chaque échange',
        'S29 powerDynamic + alignement choix +3',
        'cutouts intimes pack : commanding / heated / dominant / lustful (01–03 / 04–06 / 07–09 / 10–12)',
      ],
      packs: PACKS_AFF5,
      exchanges: withPowerDynamics(AFF5_MALE, AFF5_POWER_DYNAMICS),
      finalesByIndex: AFF5_FINALE_MALE,
      finalesLowByIndex: finalesLowFromMap(AFF5_FINALE_LOW_MALE, AFF5_FINALE_MALE.length),
      packActFinales: PACK_ACT_FINALE_MALE,
      sessionOutcomesByIndex: SESSION_OUTCOME_MALE,
      defaultPowerDynamic: 'companion_dominant',
    }),
  },
  {
    file: 'lyra-aff4-curated-12.json',
    corpus: buildCorpus({
      affinity: 4,
      gender: 'male',
      idSuffix: '',
      reviewDoc: 'docs/traceability/link-corpus-review/LYRA_AFF4_CURATED_12.md',
      purpose: 'Modèle qualité — 12 échanges curés aff. 4 — suggestif, MC homme, format action 3e pers.',
      criteria: [
        'companionAction (3e personne) + companionLine (réplique Lyra)',
        'answerRule « action » — choix joueur = actes',
        'registre aff. 4 : suggestif (≠ aff. 5 cru)',
        'protagonistGender: male',
        'S31 pas de registre cru aff. 5 en aff. 4',
        'cutouts intimes pack : commanding / heated / dominant / lustful (01–03 / 04–06 / 07–09 / 10–12)',
      ],
      packs: PACKS,
      exchanges: withPowerDynamics(AFF4_MALE, AFF4_POWER_DYNAMICS),
      defaultPowerDynamic: 'companion_dominant',
    }),
  },
  {
    file: 'lyra-aff5-curated-12-female-mc.json',
    corpus: buildCorpus({
      affinity: 5,
      gender: 'female',
      idSuffix: '-female-mc',
      reviewDoc: 'docs/traceability/link-corpus-review/LYRA_AFF5_CURATED_12_FEMALE_MC.md',
      purpose: 'Modèle qualité — 12 échanges curés aff. 5 — registre cru, MC femme, format action 3e pers.',
      criteria: [
        'companionAction (3e personne) + companionLine (réplique Lyra)',
        'MC femme — anatomie et choix adaptés',
        'protagonistGender: female',
        'S20 réplique parlée (je/tu) — pas didascalie « Fort. »',
        'S22 alignement geste Lyra ↔ choix +3',
        'S23 intimateFinale (épilogue tu) sur chaque échange',
        'S25–S26 registre cru choix MC femme (pas répliques Lyra)',
        'S29 powerDynamic + alignement choix +3',
        'cutouts intimes pack : commanding / heated / dominant / lustful (01–03 / 04–06 / 07–09 / 10–12)',
      ],
      packs: PACKS_AFF5,
      exchanges: withPowerDynamics(AFF5_FEMALE, AFF5_FEMALE_POWER_DYNAMICS),
      finalesByIndex: AFF5_FINALE_FEMALE,
      finalesLowByIndex: finalesLowFromMap(AFF5_FINALE_LOW_FEMALE, AFF5_FINALE_FEMALE.length),
      packActFinales: PACK_ACT_FINALE_FEMALE,
      sessionOutcomesByIndex: SESSION_OUTCOME_FEMALE,
      defaultPowerDynamic: 'companion_dominant',
    }),
  },
  {
    file: 'lyra-aff4-curated-12-female-mc.json',
    corpus: buildCorpus({
      affinity: 4,
      gender: 'female',
      idSuffix: '-female-mc',
      reviewDoc: 'docs/traceability/link-corpus-review/LYRA_AFF4_CURATED_12_FEMALE_MC.md',
      purpose: 'Modèle qualité — 12 échanges curés aff. 4 — suggestif, MC femme, format action 3e pers.',
      criteria: [
        'companionAction (3e personne) + companionLine (réplique Lyra)',
        'MC femme — anatomie et choix adaptés',
        'protagonistGender: female',
        'S31 pas de registre cru aff. 5 en aff. 4',
        'cutouts intimes pack : commanding / heated / dominant / lustful (01–03 / 04–06 / 07–09 / 10–12)',
      ],
      packs: PACKS,
      exchanges: withPowerDynamics(AFF4_FEMALE, AFF4_POWER_DYNAMICS),
      defaultPowerDynamic: 'companion_dominant',
    }),
  },
];

for (const { file, corpus } of OUTPUTS) {
  const outPath = path.join(__dirname, file);
  fs.writeFileSync(outPath, `${JSON.stringify(corpus, null, 2)}\n`, 'utf8');
  console.log(`Écrit : ${file} (${corpus.exchanges.length} échanges, MC ${corpus.meta.protagonistGender})`);
}

function writeAff5GenPrompts() {
  for (const gender of ['male', 'female']) {
    const profile = buildAff5ValidationProfile(gender);
    const mc = gender === 'female' ? 'MC femme' : 'MC homme';
    const body = `# Prompt gen — Lyra aff. 5 (${mc})

System prompt de référence pour régénération d'échanges curés (exporté depuis \`meta.validationProfile\`).

## Registre
- Affinité ${profile.affinity}, registre **${profile.register}**
- \`powerDynamic\` par défaut : **${profile.powerDynamicDefault}**
- Protagoniste : **${profile.protagonistGender}**

## Anatomie MC (obligatoire dans choix +3)
${profile.mcAnatomyTerms.map((t) => `- ${t}`).join('\n')}

## Interdits euphémismes MC
${profile.forbiddenMcEuphemisms.join(', ')}

## Règle pénétration MC femme
${profile.femalePenetrationRule}

## Prêt vocabulaire (bridge seulement)
${profile.pornLoanwordsBridgeOnly.join(', ')}

## Vocal dom/sub (éviter calques répétitifs)
- companion_dominant : ${profile.domSubVocal.companion_dominant.join(' / ')}
- companion_invites : ${profile.domSubVocal.companion_invites.join(' / ')}
- mutual : ${profile.domSubVocal.mutual.join(' / ')}

## Format
- \`companionAction\` : 3e personne
- \`companionLine\` : réplique Lyra (je/tu), pas didascalie sèche
- Choix MC : 1re personne, actes explicites
- \`intimateFinale\` : narration tu, segments séparés par « ; »
- \`intimateFinaleLow\` (optionnel) : score ≤ 1, ton sec sans taunt victoire
`;
    const docPath = path.join(
      ROOT,
      'docs/traceability/link-corpus-review',
      gender === 'female' ? 'LYRA_AFF5_GEN_PROMPT_FEMALE_MC.md' : 'LYRA_AFF5_GEN_PROMPT.md',
    );
    fs.writeFileSync(docPath, `${body}\n`, 'utf8');
    console.log(`Écrit : ${path.relative(ROOT, docPath)}`);
  }
}

writeAff5GenPrompts();
