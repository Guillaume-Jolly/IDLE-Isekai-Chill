import type { CompanionDialogueProfile } from './types'

/** Poids par ton — plus c'est haut, plus le compagnon préfère ce type de réponse. */
export const COMPANION_DIALOGUE_PROFILES: Record<string, CompanionDialogueProfile> = {
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    place: 'la bibliothèque',
    personalityHint:
      'Lyra est réservée et intellectuelle — écoute, patience, pas de flirts lourds (aff. 1–2).',
    toneWeights: { sincere: 10, playful: 2, direct: 4, romantic: 4 },
  },
  maeve: {
    id: 'maeve',
    name: 'Maeve',
    place: 'le marché des étoiles',
    personalityHint:
      'Maeve négocie au comptoir — directe, maline, audace mesurée ; aff. 4+ = deal / invitation, pas romance fleurie.',
    toneWeights: { sincere: 6, playful: 7, direct: 9, romantic: 3 },
  },
  seren: {
    id: 'seren',
    name: 'Seren',
    place: 'la place du village',
    personalityHint: 'Seren est digne et froide — respect, fierté, jamais de moquerie.',
    toneWeights: { sincere: 7, playful: 2, direct: 10, romantic: 3 },
  },
  nami: {
    id: 'nami',
    name: 'Nami',
    place: 'la cuisine commune',
    personalityHint: 'Nami est chaleureuse — partage, humour doux, convivialité.',
    toneWeights: { sincere: 8, playful: 9, direct: 5, romantic: 6 },
  },
  iris: {
    id: 'iris',
    name: 'Iris',
    place: 'le jardin des brumes',
    personalityHint: 'Iris est rêveuse — métaphores, nature, tendresse discrète.',
    toneWeights: { sincere: 9, playful: 4, direct: 3, romantic: 8 },
  },
  kael: {
    id: 'kael',
    name: 'Kael',
    place: 'le théâtre',
    personalityHint: 'Kael est théâtral — joue le jeu, charme, compliments avec style.',
    toneWeights: { sincere: 4, playful: 10, direct: 3, romantic: 9 },
  },
  runa: {
    id: 'runa',
    name: 'Runa',
    place: 'la forge du havre',
    personalityHint:
      'Runa est forgeronne — calme, concrète, fiable ; romantic quasi absent, complicité par le geste et l\'outil.',
    toneWeights: { sincere: 10, playful: 3, direct: 8, romantic: 2 },
  },
  solene: {
    id: 'solene',
    name: 'Solene',
    place: 'la source claire',
    personalityHint: 'Solène est spirituelle — silence, douceur, pas de brusquerie.',
    toneWeights: { sincere: 10, playful: 3, direct: 2, romantic: 8 },
  },
  talia: {
    id: 'talia',
    name: 'Talia',
    place: 'la lisière de la forêt',
    personalityHint:
      'Talia est éclaireuse — humour terrain, paris et audace ; complicité sans déclaration.',
    toneWeights: { sincere: 6, playful: 9, direct: 8, romantic: 4 },
  },
  mira: {
    id: 'mira',
    name: 'Mira',
    place: "l'atelier textile",
    personalityHint: 'Mira est artiste — sensibilité, élégance, mots choisis avec soin.',
    toneWeights: { sincere: 8, playful: 5, direct: 4, romantic: 9 },
  },
  asha: {
    id: 'asha',
    name: 'Asha',
    place: 'la cascade cachée',
    personalityHint: 'Asha est protectrice — loyauté, franchise, confiance gagnée.',
    toneWeights: { sincere: 9, playful: 4, direct: 8, romantic: 5 },
  },
  elwen: {
    id: 'elwen',
    name: 'Elwen',
    place: 'les archives féeriques',
    personalityHint: 'Elwen est érudite — curiosité, respect des secrets, pas de vulgarité.',
    toneWeights: { sincere: 10, playful: 2, direct: 6, romantic: 4 },
  },
  noa: {
    id: 'noa',
    name: 'Noa',
    place: 'le laboratoire',
    personalityHint:
      'Noa est alchimiste farceuse — taquineries, prétextes labo, esprit vif ; contact = excuse technique.',
    toneWeights: { sincere: 5, playful: 10, direct: 8, romantic: 4 },
  },
  sora: {
    id: 'sora',
    name: 'Sora',
    place: 'la ferme lunaire',
    personalityHint: 'Sora est bienveillante — animaux, simplicité, chaleur sans chichi.',
    toneWeights: { sincere: 9, playful: 7, direct: 4, romantic: 6 },
  },
  zelie: {
    id: 'zelie',
    name: 'Zelie',
    place: 'le salon des invités',
    personalityHint: 'Zélie est noble et masquée — politesse, intrigue, romance raffinée.',
    toneWeights: { sincere: 5, playful: 4, direct: 5, romantic: 10 },
  },
  etna: {
    id: 'etna',
    name: 'Etna',
    place: 'la faille Disagrea',
    personalityHint:
      'Etna est vassale démoniaque — snark, bombe assumée, dom RP Disagrea ; graveleux dès aff. 1–3 (tease), BDSM aff. 4–5.',
    toneWeights: { sincere: 5, playful: 8, direct: 9, romantic: 4 },
  },
  laharl: {
    id: 'laharl',
    name: 'Laharl',
    place: 'la faille Disagrea',
    personalityHint:
      'Laharl est overlord tsundere — bluster, chasse, panique devant « amour » ; graveleux compétitif aff. 1–3, RP aff. 4–5.',
    toneWeights: { sincere: 6, playful: 9, direct: 8, romantic: 2 },
  },
  roric: {
    id: 'roric',
    name: 'Roric',
    place: 'la salle des lames',
    personalityHint:
      'Roric est précepteur de lames — calme, direct, cadre et signaux ; domination sobre Havre, jamais cruelle.',
    toneWeights: { sincere: 7, playful: 2, direct: 10, romantic: 5 },
  },
  finn: {
    id: 'finn',
    name: 'Finn',
    place: 'les quais des lanternes',
    personalityHint:
      'Finn est saltimbanque — cabotin en public, docile en privé ; demande la permission, fleurit sous les compliments.',
    toneWeights: { sincere: 9, playful: 7, direct: 3, romantic: 8 },
  },
}

export const ALL_COMPANION_IDS = Object.keys(COMPANION_DIALOGUE_PROFILES)
