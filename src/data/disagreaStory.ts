import type { DisagreaCompanionId } from './eventDisagreaPack'

export type DisagreaStoryPage = {
  id: string
  location: string
  /** Fond large (PC) — chemins public/ */
  backgroundWide: string
  /** Fond portrait (mobile) */
  backgroundPortrait: string
  /** Invité mis en avant sur cette page, si pertinent */
  companionId?: DisagreaCompanionId
  paragraphs: readonly string[]
}

export type DisagreaStoryChapter = {
  id: string
  title: string
  subtitle: string
  pages: readonly DisagreaStoryPage[]
}

export const DISAGREA_STORY_CHAPTERS: readonly DisagreaStoryChapter[] = [
  {
    id: 'prologue-faille',
    title: 'Prologue — La faille s\'ouvre',
    subtitle: 'Comment quatre invités ont trouvé le havre',
    pages: [
      {
        id: 'prologue-1',
        location: 'Cour de chasse sous la lune',
        backgroundWide: '/assets/minigames/capture/biomes/disagrea-event.png',
        backgroundPortrait: '/assets/minigames/capture/biomes/disagrea-event-portrait.png',
        paragraphs: [
          'Une nuit sans bruit, le ciel au-dessus du havre s\'est fendu d\'un trait pourpre et doré.',
          'Ce n\'était ni une tempête, ni une attaque : une faille dimensionnelle, calme et lumineuse, comme une porte entrouverte sur un autre royaume.',
          'Les villageois l\'appellent désormais la Faille Disagrea.',
        ],
      },
      {
        id: 'prologue-2',
        location: 'Salle gothique du château démoniaque',
        backgroundWide: '/assets/companions/laharl/background-1-wide.png',
        backgroundPortrait: '/assets/companions/laharl/background-1.png',
        companionId: 'laharl',
        paragraphs: [
          'Le premier à franchir le seuil fut un jeune overlord au regard fier, habitué aux salles de pierre et aux bannières déchirées.',
          'Il jurait régner sur sa propre dimension — mais devant le havre paisible, il haussa seulement les épaules : « Bon. On verra qui commande ici. »',
        ],
      },
      {
        id: 'prologue-3',
        location: 'Balcon lunaire du repaire pourpre',
        backgroundWide: '/assets/companions/etna/background-1-wide.png',
        backgroundPortrait: '/assets/companions/etna/background-1.png',
        companionId: 'etna',
        paragraphs: [
          'Etna arriva ensuite, ailes de chauve-souris pliées, sourire en coin. Vassale démoniaque invitée, dit-on, mais elle préfère « consultante en stratégie ».',
          'Depuis le balcon, elle observe le village : « Pas mal pour un monde sans boss final visible. »',
        ],
      },
      {
        id: 'prologue-4',
        location: 'Chapelle du palais angélique',
        backgroundWide: '/assets/companions/flonne/background-1-wide.png',
        backgroundPortrait: '/assets/companions/flonne/background-1.png',
        companionId: 'flonne',
        paragraphs: [
          'Flonne entra dans un éclat de clochettes et de rubans. Guérisseuse angélique invitée, elle voulait surtout savoir si le havre avait besoin de bandages — et de fleurs.',
          'Son palais pastel brille encore dans la faille, comme un souvenir accroché au ciel.',
        ],
      },
      {
        id: 'prologue-5',
        location: 'Jardin aux lapins silencieux',
        backgroundWide: '/assets/companions/pleinair/background-1-wide.png',
        backgroundPortrait: '/assets/companions/pleinair/background-1.png',
        companionId: 'pleinair',
        paragraphs: [
          'Pleinair ne parla pas. Mascotte silencieuse invitée, elle s\'assit parmi les rubans et les oreilles de lapin brodés, et hocha la tête une seule fois — oui, elle restait.',
          'Son monde pastel semble plus doux que les autres, mais la faille l\'y a tirée comme les trois invités avant elle.',
        ],
      },
      {
        id: 'prologue-6',
        location: 'Arène d\'entraînement enchantée',
        backgroundWide: '/assets/minigames/dressage/enclosures/disagrea-event.png',
        backgroundPortrait: '/assets/minigames/dressage/enclosures/disagrea-event-portrait.png',
        paragraphs: [
          'Les Myrions de la faille — petites créatures magiques liées à chaque invité — apparurent dans la cour d\'entraînement.',
          'Chasse, dressage, fragments à collecter : le havre accueille les invités, mais leur monde laisse encore des éclats dans l\'herbe.',
        ],
      },
      {
        id: 'prologue-7',
        location: 'La faille, encore ouverte',
        backgroundWide: '/assets/minigames/capture/biomes/disagrea-event.png',
        backgroundPortrait: '/assets/minigames/capture/biomes/disagrea-event-portrait.png',
        paragraphs: [
          'La Faille Disagrea reste visible à l\'horizon. Tant qu\'elle brille, les tirages event, la chasse aux Myrions et les liens avec les invités continueront.',
          'Et quelque part, des versions détourées de chaque hôte se préparent déjà — parodies, costumes inattendus, scènes où rien ne se passe comme prévu…',
        ],
      },
    ],
  },
] as const

/** Teaser pour les futures variantes parodiques des invités. */
export const DISAGREA_ALTERNATE_VARIANTS = {
  title: 'Versions détourées (bientôt)',
  description:
    'Chaque invité aura des illustrations parodiques : costumes improbables, situations inversées et scènes bonus hors faille. À venir dans une mise à jour event.',
  companionIds: ['etna', 'flonne', 'laharl', 'pleinair'] as const satisfies readonly DisagreaCompanionId[],
} as const
