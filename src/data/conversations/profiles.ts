import type { CompanionDialogueProfile } from './types'

/** Poids par ton — plus c'est haut, plus le compagnon préfère ce type de réponse. */
export const COMPANION_DIALOGUE_PROFILES: Record<string, CompanionDialogueProfile> = {
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    place: 'la bibliothèque',
    personalityHint: 'Lyra est réservée et intellectuelle — écoute, patience, pas de flirts lourds.',
    toneWeights: { sincere: 10, playful: 2, direct: 4, romantic: 4 },
  },
  maeve: {
    id: 'maeve',
    name: 'Maeve',
    place: 'le marché des étoiles',
    personalityHint: 'Maeve est négociante — directe, maline, apprécie l\'audace mesurée.',
    toneWeights: { sincere: 5, playful: 6, direct: 9, romantic: 5 },
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
    place: "l'atelier des rubans",
    personalityHint: 'Runa est calme et travailleuse — concret, fiable, peu de grands gestes.',
    toneWeights: { sincere: 9, playful: 3, direct: 8, romantic: 4 },
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
    personalityHint: 'Talia est rieuse et audacieuse — humour, spontanéité, complicité.',
    toneWeights: { sincere: 5, playful: 10, direct: 7, romantic: 5 },
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
    personalityHint: 'Noa est malicieuse — taquineries, surprises, esprit vif.',
    toneWeights: { sincere: 4, playful: 10, direct: 7, romantic: 6 },
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
}

export const ALL_COMPANION_IDS = Object.keys(COMPANION_DIALOGUE_PROFILES)
