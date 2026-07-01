/**
 * Graines de conversations Lien par palier d'intimité (MVP compagnons).
 * 19 compagnons × 5 paliers × 2 échanges = 190 conversations.
 * Ton : Havre des Brumes, cozy fantasy, français.
 */

export const COMPANION_BOND_IDS = [
  'lyra', 'maeve', 'seren', 'nami', 'iris', 'kael', 'runa', 'solene', 'talia',
  'mira', 'asha', 'elwen', 'noa', 'sora', 'zelie', 'etna', 'flonne', 'laharl', 'pleinair',
]

/** @typedef {'sincere' | 'playful' | 'direct' | 'romantic'} BondTone */

/**
 * @typedef {Object} BondExchange
 * @property {string} prompt
 * @property {string} reply
 * @property {BondTone} tone
 * @property {string[]} tags
 * @property {1 | 2 | 3 | 4 | 5} intimacyLevel
 */

/**
 * @typedef {Object} CompanionBondSeed
 * @property {string} displayName
 * @property {string[]} relatedSystems
 * @property {Record<1 | 2 | 3 | 4 | 5, BondExchange[]>} tiers
 */

/** @type {Record<string, CompanionBondSeed>} */
export const COMPANION_BOND_SEEDS = {
  lyra: {
    displayName: 'Lyra',
    relatedSystems: ['gacha', 'inventory', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Lyra, tu passes autant de temps ici pour t\'ennuyer ?',
          reply: 'Non. La bibliothèque trie les curiosités avant qu\'on les perde dans l\'inventaire.',
          tone: 'direct',
          tags: ['bibliothèque', 'inventaire', 'havre'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Comment choisis-tu quel livre ouvrir en premier ?',
          reply: 'Ceux qui sentent le lait de lune. Le gacha en laisse parfois tomber un entre deux pages.',
          tone: 'sincere',
          tags: ['lecture', 'gacha', 'lune'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me laisserais feuilleter tes notes un jour ?',
          reply: 'Si tu remets chaque feuillet à sa place. Mes classements ne sont pas décoratifs.',
          tone: 'direct',
          tags: ['archives', 'confiance', 'ordre'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Qu\'est-ce qui t\'a attirée au Havre des Brumes ?',
          reply: 'Une mention discrète sur les fragments du village. J\'ai voulu vérifier par moi-même.',
          tone: 'sincere',
          tags: ['village', 'fragments', 'discrétion'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Je crois t\'avoir surprise en train de sourire hier.',
          reply: 'Un mot bien placé vaut une bibliothèque entière. Ne t\'enflamme pas.',
          tone: 'playful',
          tags: ['humour', 'observation', 'lien'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On pourrait organiser une soirée lecture au village ?',
          reply: 'Sans tambour. Deux chaises, une lampe, et personne qui raconte la fin avant la page trente.',
          tone: 'playful',
          tags: ['village', 'lecture', 'calme'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Hier soir tu m\'as laissé rester jusqu\'à ce que la lampe cligne. Pourquoi ?',
          reply: 'Parce que j\'avais envie de sentir ta respiration ralentir près de la mienne. Ce n\'était pas pour la compagnie d\'un livre.',
          tone: 'romantic',
          tags: ['bibliothèque', 'nuit', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Je t\'ai vue mordre ta lèvre quand nos mains se sont frôlées sur la même page.',
          reply: 'Et toi, tu as fait semblant de lire. Garde ce moment : je n\'accorde pas mes frissons à n\'importe qui.',
          tone: 'direct',
          tags: ['contact', 'secret', 'désir'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on fermait la bibliothèque pour une nuit entière, juste nous deux…',
          reply: 'Je baisserais la voix, je poserais ta main sur ma taille, et je te demanderais de rester jusqu\'à ce que le froid ne serve plus de prétexte.',
          tone: 'romantic',
          tags: ['nuit', 'fermeture', 'corps'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu veux vraiment, Lyra. Sans métaphore.',
          reply: 'Ton front contre le mien, ta bouche à un souffle de la mienne, et le droit de ne plus faire semblant d\'être seule ici.',
          tone: 'sincere',
          tags: ['aveu', 'bouche', 'lien'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  maeve: {
    displayName: 'Maeve',
    relatedSystems: ['village', 'inventory', 'gacha'],
    tiers: {
      1: [
        {
          prompt: 'Maeve, le marché des étoiles, c\'est ton royaume ?',
          reply: 'Mon comptoir, oui. Le village y dépose ses surplus ; moi j\'y vois ce qui manque à l\'inventaire.',
          tone: 'direct',
          tags: ['marché', 'village', 'échange'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu conseilles le gacha aux novices du havre ?',
          reply: 'Je leur dis d\'attendre une bonne humeur, pas une bonne superstition. Les étoiles ne négocient pas.',
          tone: 'playful',
          tags: ['gacha', 'conseil', 'novices'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'accorderais un prix d\'ami un jour ?',
          reply: 'Un prix d\'ami, c\'est quand tu reviens sans faire la tête. Le reste, on en parlera au comptoir.',
          tone: 'playful',
          tags: ['marché', 'confiance', 'retour'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Qu\'est-ce que tu regardes en premier chez un client ?',
          reply: 'Ses mains. Elles trahissent s\'il cherche à survivre ou à briller pour quelqu\'un.',
          tone: 'sincere',
          tags: ['observation', 'marché', 'sincérité'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as laissé repartir sans payer la dernière fois, non ?',
          reply: 'Considère ça comme un crédit sur ta prochaine bonne blague. Je tiens mes registres.',
          tone: 'playful',
          tags: ['humour', 'complicité', 'registre'],
          intimacyLevel: 3,
        },
        {
          prompt: 'Le village compte sur toi plus qu\'il ne l\'avoue ?',
          reply: 'Tant mieux. Les secrets bien gardés valent parfois plus qu\'une bourse pleine.',
          tone: 'direct',
          tags: ['village', 'rôle', 'discrétion'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as retenu après la fermeture du marché. Qu\'est-ce que tu préparais ?',
          reply: 'Pas une marchandise. Une bouteille, deux verres, et l\'envie de te voir baisser la garde sans négocier.',
          tone: 'playful',
          tags: ['fermeture', 'comptoir', 'invitation'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Tu m\'as effleuré le poignet en comptant la monnaie. C\'était volontaire ?',
          reply: 'Je ne fais rien sans calcul… sauf quand c\'est toi. Là, c\'était le désir de savoir si ta peau frissonnerait.',
          tone: 'romantic',
          tags: ['contact', 'calcul', 'désir'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si je montais avec toi à l\'étage ce soir, tu me laisserais entrer ?',
          reply: 'Je te laisserais entrer, te ferais asseoir sur mon lit, et je te dirais enfin ce que je retiens quand je ferme ma caisse.',
          tone: 'romantic',
          tags: ['étage', 'lit', 'aveu'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu imagines quand tu comptes en silence ?',
          reply: 'Tes doigts dans mes cheveux, ta voix basse qui me demande de ne pas retourner au comptoir. Je rougis encore en le disant.',
          tone: 'sincere',
          tags: ['fantasme', 'voix', 'intime'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  seren: {
    displayName: 'Seren',
    relatedSystems: ['hunt', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Seren, tu veilles toujours aussi droite sur la place ?',
          reply: 'La place du village mérite une présence calme. Les expéditions de chasse repartent d\'ici.',
          tone: 'direct',
          tags: ['place', 'chasse', 'veille'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Est-ce qu\'on t\'a appris à tenir l\'épée avant de parler ?',
          reply: 'On m\'a appris à écouter d\'abord. L\'acier ne corrige pas une mauvaise décision.',
          tone: 'sincere',
          tags: ['discipline', 'écoute', 'chevalerie'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'accompagnerais un jour en expédition ?',
          reply: 'Si tu respectes le rythme du groupe et la consigne de repli. La chasse n\'aime pas l\'orgueil.',
          tone: 'direct',
          tags: ['expédition', 'chasse', 'prudence'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Qu\'est-ce qui te rassure dans ce havre ?',
          reply: 'Voir des civils qui s\'entraident sans uniforme. C\'est une autre forme de garde.',
          tone: 'sincere',
          tags: ['village', 'entraide', 'garde'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as repris hier avec un regard qui en disait long.',
          reply: 'Tu courais vers le filon sans vérifier ton inventaire. Je préfère te gronder qu\'une blessure.',
          tone: 'playful',
          tags: ['inventaire', 'humour', 'soin'],
          intimacyLevel: 3,
        },
        {
          prompt: 'Les autres te prennent pour trop sérieuse ?',
          reply: 'Peut-être. Mais quand la chasse tourne mal, personne ne se plaint de ma sérieux.',
          tone: 'direct',
          tags: ['chasse', 'réputation', 'sérieux'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as demandé de t\'aider à retirer ton brassard hier. Pourquoi moi ?',
          reply: 'Parce que je voulais ta main sur ma peau sans armure entre nous. C\'était un test ; tu l\'as réussi.',
          tone: 'romantic',
          tags: ['armure', 'contact', 'confiance'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Seren… est-ce mal de penser à toi quand je suis seul au camp ?',
          reply: 'Non. Moi aussi je repense à ton souffle quand je veille trop tard. Dis-le franchement la prochaine fois.',
          tone: 'direct',
          tags: ['campagne', 'souffle', 'franchise'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si je partais demain en expédition, que voudrais-tu que je sache ?',
          reply: 'Que je t\'attendrai les lèvres prêtes, et que je compte les heures jusqu\'à te serrer contre moi sans cuirasse.',
          tone: 'romantic',
          tags: ['départ', 'lèvres', 'attente'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu désires quand tu baisses enfin la garde ?',
          reply: 'Ton poids contre le mien, ta bouche sur mon cou, et le silence de deux personnes qui ne jouent plus à être fortes.',
          tone: 'sincere',
          tags: ['désir', 'cou', 'vulnérabilité'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  nami: {
    displayName: 'Nami',
    relatedSystems: ['moon-farm', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Nami, tu cuisines pour tout le havre ou seulement pour toi ?',
          reply: 'Pour qui a faim et le temps de s\'asseoir. La ferme lunaire envoie de bonnes récoltes, je les honore.',
          tone: 'sincere',
          tags: ['cuisine', 'ferme lunaire', 'partage'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Quel plat te ressemble le plus ?',
          reply: 'Une soupe qui mijote lentement : simple, chaude, et meilleure le lendemain entre amis.',
          tone: 'playful',
          tags: ['soupe', 'lent', 'amitié'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me laisserais aider à la cuisine commune ?',
          reply: 'Oui, si tu acceptes qu\'on goûte trois fois avant de servir. Personne n\'est humilié ici.',
          tone: 'playful',
          tags: ['cuisine', 'aide', 'goût'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Comment tu tiens le moral du village ?',
          reply: 'Une marmite fumante à l\'heure du crépuscule. Les mots viennent après, plus doux.',
          tone: 'sincere',
          tags: ['village', 'moral', 'crépuscule'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as glissé le meilleur morceau en cachette, avoue.',
          reply: 'Je récompense ceux qui lavent la vaisselle sans qu\'on le demande. Tu as triché avec le savon.',
          tone: 'playful',
          tags: ['humour', 'récompense', 'vaisselle'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait organiser un repas pour les Myrions de la Ferme lunaire ?',
          reply: 'Bonne idée. Des portions légères, des noms gentils sur les bols, et zéro course.',
          tone: 'playful',
          tags: ['myrions', 'ferme-lunaire', 'repas'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as fait goûter à la cuillère en me regardant dans les yeux. C\'était pour le plat ?',
          reply: 'Non. C\'était pour voir si tu allais rougir avant même d\'avaler. Tu as répondu oui sans un mot.',
          tone: 'playful',
          tags: ['cuisine', 'regard', 'goût'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Hier tu m\'as gardé près du feu après la fermeture. Pourquoi ?',
          reply: 'Parce que j\'en avais marre de te servir à distance. Je voulais ta chaleur, pas seulement ton assiette.',
          tone: 'romantic',
          tags: ['feu', 'fermeture', 'chaleur'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on restait seuls dans la cuisine jusqu\'à l\'aube…',
          reply: 'Je t\'allongerais sur la table propre, je goûterais ta bouche avant le dessert, et je ne laisserais personne frapper.',
          tone: 'romantic',
          tags: ['aube', 'bouche', 'intimité'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Nami, qu\'est-ce que tu veux de moi, franchement ?',
          reply: 'T\'embrasser jusqu\'à oublier l\'heure, sentir tes mains sous mon tablier, et dormir contre toi quand le feu s\'éteint.',
          tone: 'sincere',
          tags: ['embrasser', 'mains', 'dormir'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  iris: {
    displayName: 'Iris',
    relatedSystems: ['moon-farm', 'inventory'],
    tiers: {
      1: [
        {
          prompt: 'Iris, tu parles aux plantes ou c\'est une légende du jardin ?',
          reply: 'Je les écoute. Elles murmurent où la terre de la ferme lunaire est encore tendre.',
          tone: 'sincere',
          tags: ['jardin', 'plantes', 'ferme lunaire'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Comment tu ranges tant d\'herbes dans l\'inventaire ?',
          reply: 'Par parfum et par humeur du jour. Les étiquettes sèches ; les senteurs, non.',
          tone: 'playful',
          tags: ['herbes', 'inventaire', 'parfum'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me montrerais ton coin préféré du jardin des brumes ?',
          reply: 'Quand la brume baisse, oui. C\'est là que poussent les fleurs qui ne demandent rien en retour.',
          tone: 'sincere',
          tags: ['jardin', 'brume', 'fleurs'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Quelle plante conseillerais-tu à un novice du havre ?',
          reply: 'La menthe de clair de lune : indulgente, utile, et difficile à rater si on est patient.',
          tone: 'direct',
          tags: ['conseil', 'menthe', 'patience'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as offert une tige sans raison hier, c\'était quoi ?',
          reply: 'Une brindille de repos. Tu marchais trop vite entre deux filons, même la brume le voyait.',
          tone: 'playful',
          tags: ['repos', 'brindille', 'observation'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On pourrait planter quelque chose ensemble à la Ferme lunaire ?',
          reply: 'Un carré discret, loin des pas pressés. Les Myrions aiment les feuilles qui bougent doucement.',
          tone: 'playful',
          tags: ['plantation', 'ferme-lunaire', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as guidé entre les rosiers en tenant ma main plus longtemps que nécessaire.',
          reply: 'Les épines ne m\'effraient pas. Ce qui m\'effraie, c\'est à quel point j\'ai envie de ne plus lâcher ta paume.',
          tone: 'romantic',
          tags: ['jardin', 'main', 'rosiers'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Iris… tu rougis quand je m\'approche trop près des fleurs. Ou c\'est moi ?',
          reply: 'C\'est toi. Ton souffle dérange mes pétales et ma respiration. Je ne sais plus lequel tremble le plus.',
          tone: 'sincere',
          tags: ['souffle', 'proximité', 'trouble'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on s\'allongeait dans l\'herbe humide du jardin, juste nous deux…',
          reply: 'Je poserais ta joue contre ma poitrine, je te laisserais sentir mon cœur, et je murmurerais ce que je n\'ose pas dire debout.',
          tone: 'romantic',
          tags: ['herbe', 'poitrine', 'murmure'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que ton corps me demande quand on est seuls ici.',
          reply: 'De t\'attirer plus près, de sentir tes lèvres effleurer mon cou, et de fleurir comme une plante qui attend enfin la main qu\'elle reconnaît.',
          tone: 'sincere',
          tags: ['corps', 'lèvres', 'désir'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  kael: {
    displayName: 'Kael',
    relatedSystems: ['gacha', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Kael, tu répètes tes répliques même quand il n\'y a pas de public ?',
          reply: 'Le village est mon théâtre préféré. Même le gacha m\'inspire des entrées en scène.',
          tone: 'playful',
          tags: ['théâtre', 'village', 'gacha'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu chantes pour vivre ou pour exister ?',
          reply: 'Pour exister un peu plus fort. Une mélodie accroche les festivals avant les affiches.',
          tone: 'sincere',
          tags: ['chant', 'festival', 'existence'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me laisserais choisir ta prochaine chanson ?',
          reply: 'Si tu promets de ne pas demander quelque chose de triste avant le dessert du marché.',
          tone: 'playful',
          tags: ['chanson', 'marché', 'choix'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Comment tu animes le village sans agacer tout le monde ?',
          reply: 'Je lis la salle. Parfois un sourire suffit ; parfois il faut un tambourin et trois pas de côté.',
          tone: 'direct',
          tags: ['animation', 'village', 'tambourin'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as dédié un couplet en public, c\'était voulu ?',
          reply: 'Totalement. Les héros méritent une ovation discrète autant qu\'une grandiloquence.',
          tone: 'playful',
          tags: ['couplet', 'ovation', 'héros'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait monter une saynète pour les enfants du havre ?',
          reply: 'Avec des dragons en chaussettes et un trésor en bonbons lunaires. Je réserve le rôle du narrateur.',
          tone: 'playful',
          tags: ['saynète', 'enfants', 'lune'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Après le spectacle, tu m\'as entraîné dans les coulisses. Pourquoi ?',
          reply: 'Parce que j\'en avais assez du public. Je voulais tes lèvres à portée de chuchotement, pas d\'applaudissements.',
          tone: 'romantic',
          tags: ['coulisses', 'lèvres', 'chuchotement'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Kael… ce regard sur scène, c\'était joué ou pour moi ?',
          reply: 'Pour toi. J\'ai failli oublier ma réplique en imaginant ta main glisser sous mon col.',
          tone: 'playful',
          tags: ['scène', 'regard', 'désir'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si le théâtre était vide une nuit, que ferais-tu de moi ?',
          reply: 'Je t\'allongerais sur le velours, je chanterais contre ta peau, et je ne lèverais le rideau pour personne.',
          tone: 'romantic',
          tags: ['théâtre', 'velours', 'peau'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi la vérité, sans costume.',
          reply: 'Je veux t\'embrasser jusqu\'à ce que tu oublies le village, et te garder contre moi quand les lumières s\'éteignent.',
          tone: 'sincere',
          tags: ['embrasser', 'vérité', 'nuit'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  runa: {
    displayName: 'Runa',
    relatedSystems: ['moon-farm', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Runa, la forge du havre, c\'est ton refuge ?',
          reply: 'Mon atelier, oui. La pierre et le métal parlent plus clair que les rumeurs du village.',
          tone: 'direct',
          tags: ['forge', 'atelier', 'village'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu conseilles quoi pour les outils de la Ferme lunaire ?',
          reply: 'Du bon acier, bien affûté, et des pauses. Même la ferme lunaire fatigue les lames.',
          tone: 'sincere',
          tags: ['outils', 'ferme-lunaire', 'ferme lunaire'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me montrerais comment tenir un marteau correctement ?',
          reply: 'Viens quand la forge est tiède. Je corrige la prise sans moquerie, promis.',
          tone: 'sincere',
          tags: ['marteau', 'apprentissage', 'forge'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi tu prépares déjà la mine tranquille ?',
          reply: 'Parce que le havre avance mieux quand les fondations sont prêtes avant l\'urgence.',
          tone: 'direct',
          tags: ['mine', 'fondations', 'préparation'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as laissé graver mes initiales sur un clou, sérieusement ?',
          reply: 'Un clou de plus ne change rien à la charpente. Mais ça me fait sourire, avoue-le.',
          tone: 'playful',
          tags: ['clou', 'initiales', 'humour'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait forger une cloche pour le village ?',
          reply: 'Une cloche douce, pas un coup de tonnerre. Les Myrions de la Ferme lunaire dormiraient mieux.',
          tone: 'playful',
          tags: ['cloche', 'village', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as appris à tenir le fer chaud en m\'attrapant les hanches.',
          reply: 'Pour te stabiliser. Ne prétends pas ne pas avoir senti mon souffle dans ton cou après.',
          tone: 'direct',
          tags: ['forge', 'hanches', 'souffle'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Runa… pourquoi tu gardes ma trace sur ton tablier de cuir ?',
          reply: 'Parce que ton odeur m\'apaise quand la forge gronde. Je ne lave pas tout, exprès.',
          tone: 'romantic',
          tags: ['odeur', 'tablier', 'secret'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on restait seuls quand la forge s\'éteint…',
          reply: 'Je poserais ta main sur mon ventre, je te ferais sentir la chaleur qui reste, et je ne parlerais plus d\'outils.',
          tone: 'romantic',
          tags: ['forge', 'chaleur', 'ventre'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu veux vraiment, sans détour ?',
          reply: 'T\'avoir contre l\'enclume, ta bouche sur la mienne, et le droit de trembler sans honte.',
          tone: 'sincere',
          tags: ['enclume', 'bouche', 'trembler'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  solene: {
    displayName: 'Solene',
    relatedSystems: ['moon-farm', 'prestige'],
    tiers: {
      1: [
        {
          prompt: 'Solene, la source claire t\'appelle-t-elle chaque matin ?',
          reply: 'Chaque matin et chaque lune. L\'eau écoute le filon avant que le prestige ne murmure.',
          tone: 'sincere',
          tags: ['source', 'lune', 'prestige'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu sens vraiment le clair de lune sur les récoltes ?',
          reply: 'Comme une respiration lente. La ferme lunaire offre ce rythme à qui sait s\'arrêter.',
          tone: 'sincere',
          tags: ['clair de lune', 'ferme lunaire', 'rythme'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'inviterais à méditer près de la source ?',
          reply: 'Oui, sans paroles inutiles. Dix respirations suffisent parfois à remettre le cœur en place.',
          tone: 'sincere',
          tags: ['méditation', 'source', 'calme'],
          intimacyLevel: 2,
        },
        {
          prompt: 'La faille lointaine te fait-elle peur ?',
          reply: 'Elle m\'intrigue plus qu\'elle ne m\'effraie. Le prestige astral n\'est pas une course.',
          tone: 'direct',
          tags: ['faille', 'prestige', 'patience'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as laissé un galet lisse dans ma poche, pourquoi ?',
          reply: 'Pour te rappeler qu\'on peut porter quelque chose de lourd sans le montrer au village.',
          tone: 'playful',
          tags: ['galet', 'secret', 'légèreté'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait bénir les nouvelles graines de la Ferme lunaire ?',
          reply: 'Une prière brève, deux gouttes d\'eau, zéro discours. Les Myrions n\'aiment pas les longs sermons.',
          tone: 'playful',
          tags: ['bénédiction', 'graines', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as invité à entrer dans l\'eau jusqu\'aux genoux. Ce n\'était pas une bénédiction.',
          reply: 'Non. C\'était pour sentir ta peau frémir contre la mienne sans parler. La source garde les secrets.',
          tone: 'romantic',
          tags: ['source', 'peau', 'secret'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Solène… tu m\'as caressé la joue pendant le silence. Pourquoi ?',
          reply: 'Parce que j\'avais envie de te toucher sans masque de prêtresse. Ton regard m\'a donné permission.',
          tone: 'sincere',
          tags: ['joue', 'contact', 'permission'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on dormait côte à côte près de la source, que ferais-tu ?',
          reply: 'Je glisserais mes doigts dans tes cheveux, je respirerais ton cou, et je te demanderais de ne pas partir au matin.',
          tone: 'romantic',
          tags: ['dormir', 'cou', 'matin'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que ton corps murmure quand je suis là.',
          reply: 'Qu\'il veut ta chaleur contre lui, ta bouche lente, et une nuit entière où personne ne nous appelle.',
          tone: 'sincere',
          tags: ['corps', 'chaleur', 'nuit'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  talia: {
    displayName: 'Talia',
    relatedSystems: ['moon-farm', 'hunt'],
    tiers: {
      1: [
        {
          prompt: 'Talia, tu lis vraiment les pistes à la lisière ?',
          reply: 'Oui. Entre la ferme lunaire et la chasse, la forêt laisse des indices pour qui ralentit.',
          tone: 'direct',
          tags: ['pistes', 'forêt', 'chasse'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Quel filon voisin tu explores en premier ?',
          reply: 'Celui où les Myrions reviennent souriants. Les récoltes suivent les bonnes humeurs.',
          tone: 'playful',
          tags: ['filon', 'myrions', 'exploration'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'emmènerais voir un coin secret de la Ferme lunaire ?',
          reply: 'Si tu promets de ne pas tout extraire d\'un coup. L\'exploration, c\'est aussi respecter.',
          tone: 'direct',
          tags: ['secret', 'ferme-lunaire', 'respect'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Comment tu choisis entre chasse et récolte ?',
          reply: 'Selon le vent et l\'inventaire. Parfois la forêt dit chasse ; parfois la lune dit filon.',
          tone: 'sincere',
          tags: ['choix', 'inventaire', 'lune'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as fait peur en surgissant derrière un bosquet, avoue.',
          reply: 'C\'était un test de réflexes ! Spoiler : tu as sursauté, mais tu es resté. J\'approuve.',
          tone: 'playful',
          tags: ['humour', 'bosquet', 'réflexes'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On parie sur qui trouve le prochain spot du biome ?',
          reply: 'Marché conclu. Perdant prépare le thé de la victoire — sans sucre en cachette.',
          tone: 'playful',
          tags: ['pari', 'biome', 'thé'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as plaqué contre un arbre en disant que c\'était pour éviter une chute.',
          reply: 'Mensonge adorable. Je voulais sentir ton cœur accélérer et savoir si tu me tirerais plus près.',
          tone: 'playful',
          tags: ['forêt', 'cœur', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Talia… tu m\'as mordu l\'oreille en riant. C\'était le pari ?',
          reply: 'Non. C\'était l\'envie. Si tu veux que je recommence, choisis un endroit où personne ne nous cherche.',
          tone: 'direct',
          tags: ['oreille', 'envie', 'audace'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on campait seuls sous les étoiles du havre…',
          reply: 'Je t\'enroulerais dans ma cape, je goûterais ta bouche jusqu\'à perdre le fil du temps, et je ne ferais semblant de dormir.',
          tone: 'romantic',
          tags: ['camp', 'cape', 'bouche'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu désires quand tu m\'as enfin seul ?',
          reply: 'T\'avoir à califourchon sur mes genoux, sentir tes mains dans mes cheveux, et entendre mon prénom rauque.',
          tone: 'sincere',
          tags: ['désir', 'genoux', 'mains'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  mira: {
    displayName: 'Mira',
    relatedSystems: ['refuge', 'inventory'],
    tiers: {
      1: [
        {
          prompt: 'Mira, tu tisses pour le refuge ou pour toi ?',
          reply: 'Pour ceux qui reviennent fatigués de la Ferme lunaire. Un bon tissu console avant les mots.',
          tone: 'sincere',
          tags: ['tissu', 'refuge', 'confort'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Comment tu ranges tant de fils dans l\'inventaire ?',
          reply: 'Par couleur et par histoire. Chaque écheveau garde le nom de celui qui l\'a offert.',
          tone: 'sincere',
          tags: ['fils', 'inventaire', 'couleur'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me mesurerais pour une écharpe un jour ?',
          reply: 'Assis un moment, sans bouger. Je prends le temps, pas seulement les centimètres.',
          tone: 'sincere',
          tags: ['écharpe', 'mesure', 'patience'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi tu rappelles de laisser les Myrions souffler ?',
          reply: 'Parce qu\'un fil trop tendu casse. Le refuge existe pour relâcher la tension.',
          tone: 'direct',
          tags: ['myrions', 'refuge', 'repos'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu as caché une petite étoile dans ma manche, je l\'ai vue.',
          reply: 'Une couture discrète pour les jours gris. Ne la lave pas trop chaud, elle est têtue.',
          tone: 'playful',
          tags: ['couture', 'étoile', 'surprise'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On pourrait décorer le refuge avec tes motifs ?',
          reply: 'Des motifs calmes, pas un festival. Les invités Disagrea apprécient aussi le silence doux.',
          tone: 'playful',
          tags: ['motifs', 'refuge', 'décoration'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as mesuré pour une écharpe en passant le ruban sur ma poitrine.',
          reply: 'J\'ai pris mon temps exprès. Ta respiration a trahi ce que tu pensais de ma proximité.',
          tone: 'romantic',
          tags: ['mesure', 'poitrine', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Mira… tu m\'as embrassé le front puis tu t\'es arrêtée. Pourquoi ?',
          reply: 'Parce que j\'avais envie de continuer plus bas, et que j\'attendais que tu me le demandes clairement.',
          tone: 'sincere',
          tags: ['embrasser', 'front', 'attente'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si je restais dans ton atelier jusqu\'à l\'aube…',
          reply: 'Je te dénouerais lentement, fil par fil, jusqu\'à ce qu\'il ne reste que ta peau contre la mienne.',
          tone: 'romantic',
          tags: ['atelier', 'fil', 'peau'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu imagines quand tu brodes mon nom.',
          reply: 'Tes lèvres sur mon cou, tes doigts qui tirent le tissu de mon corsage, et une nuit où je cesse d\'être seule.',
          tone: 'sincere',
          tags: ['broderie', 'lèvres', 'fantasme'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  asha: {
    displayName: 'Asha',
    relatedSystems: ['refuge', 'prestige'],
    tiers: {
      1: [
        {
          prompt: 'Asha, tu veilles vraiment sur les sources du havre ?',
          reply: 'Chaque source a sa voix. Je m\'assure qu\'elle reste claire pour le refuge et les cristaux.',
          tone: 'direct',
          tags: ['sources', 'refuge', 'cristaux'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Le prestige astral te parle-t-il ?',
          reply: 'Il murmure comme l\'eau profonde : lentement, et seulement si on arrête de courir.',
          tone: 'sincere',
          tags: ['prestige', 'eau', 'patience'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me montrerais la cascade cachée un jour ?',
          reply: 'Quand tu seras prêt à marcher sans but. Ce lieu n\'aime pas les agendas.',
          tone: 'sincere',
          tags: ['cascade', 'marche', 'calme'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Comment tu apais les Myrions fatigués ?',
          reply: 'De l\'eau fraîche, une couverture du refuge, et le silence jusqu\'à ce qu\'ils respirent mieux.',
          tone: 'direct',
          tags: ['myrions', 'refuge', 'apaisement'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as bloqué le chemin vers une source instable, pourquoi ?',
          reply: 'Parce que tu aurais glissé en rigolant. Même les héros ont besoin d\'un garde-fou amical.',
          tone: 'playful',
          tags: ['garde-fou', 'source', 'humour'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait marquer les sources sûres sur une carte du village ?',
          reply: 'Une carte légère, pas un décret. Les enfants du havre l\'utiliseront avant les stratèges.',
          tone: 'playful',
          tags: ['carte', 'village', 'enfants'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as tiré contre toi sous la cascade pour « me protéger du spray ».',
          reply: 'Excuse transparente. Je voulais sentir ton cœur contre le mien et voir si tu oserais rester.',
          tone: 'romantic',
          tags: ['cascade', 'cœur', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Asha… tes doigts sont restés sur ma nuque trop longtemps.',
          reply: 'Je sais. J\'ai voulu te marquer sans paroles, comme l\'eau marque la pierre. Dis-moi si tu veux que je continue.',
          tone: 'direct',
          tags: ['nuque', 'contact', 'désir'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on dormait près de la cascade, seuls, que ferais-tu ?',
          reply: 'Je t\'enroulerais dans ma cape humide, je goûterais ta bouche lentement, et je ne laisserais personne nous chercher.',
          tone: 'romantic',
          tags: ['cascade', 'cape', 'bouche'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu désires quand tu me regardes ainsi.',
          reply: 'T\'allonger sur la mousse, sentir tes mains sur mes hanches, et entendre mon prénom rauque dans ton oreille.',
          tone: 'sincere',
          tags: ['désir', 'hanches', 'oreille'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  elwen: {
    displayName: 'Elwen',
    relatedSystems: ['inventory', 'village'],
    tiers: {
      1: [
        {
          prompt: 'Elwen, les archives féeriques, c\'est ton domaine ?',
          reply: 'Mon labyrinthe préféré. Chaque trouvaille de l\'inventaire y gagne un nom et une date.',
          tone: 'direct',
          tags: ['archives', 'inventaire', 'classement'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu connais vraiment tout ce qui entre au village ?',
          reply: 'Pas tout — mais je note ce qui revient souvent. Les habitudes trahissent les besoins.',
          tone: 'sincere',
          tags: ['village', 'habitudes', 'notes'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'aiderais à retrouver un objet perdu ?',
          reply: 'Donne-moi trois indices honnêtes. Je retrouve vite, sans juger tes dettes de rangement.',
          tone: 'playful',
          tags: ['objet perdu', 'indices', 'aide'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi tu archives même les petites choses ?',
          reply: 'Parce qu\'un jour, une petite chose devient la clé d\'une grande porte du havre.',
          tone: 'sincere',
          tags: ['archives', 'clé', 'havre'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as laissé une note codée sur mon casier, c\'était quoi ?',
          reply: 'Un rappel amical : « tu as oublié de rendre le livre de Lyra ». Je suis une alliée, pas un espion.',
          tone: 'playful',
          tags: ['note', 'humour', 'alliée'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait indexer les cadeaux du gacha pour le village ?',
          reply: 'Avec des étoiles et des commentaires honnêtes. Les légendes aiment aussi les fiches propres.',
          tone: 'playful',
          tags: ['gacha', 'index', 'village'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as enfermé dans la réserve « pour classer un document urgent ».',
          reply: 'Mensonge élégant. J\'avais envie de t\'embrasser sans témoin et de sentir ta respiration sur mon cou.',
          tone: 'playful',
          tags: ['réserve', 'embrasser', 'secret'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Elwen… pourquoi tu lis mes lettres avec tes doigts sur mes lèvres ?',
          reply: 'Parce que je t\'imagine en train de les murmurer contre ma peau. Je devrais avoir honte ; je n\'en ai pas.',
          tone: 'romantic',
          tags: ['lèvres', 'fantasme', 'aveu'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on passait la nuit entre les archives, que ferais-tu ?',
          reply: 'Je te ferais asseoir sur mon bureau, je remonterais ta chemise lentement, et je ne classerais rien avant l\'aube.',
          tone: 'romantic',
          tags: ['archives', 'nuit', 'contact'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Écris-moi la vérité, sans code.',
          reply: 'Je veux ta bouche sur la mienne, tes mains dans mes cheveux, et une page blanche pour tout ce qu\'on fera ensuite.',
          tone: 'sincere',
          tags: ['vérité', 'bouche', 'désir'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  noa: {
    displayName: 'Noa',
    relatedSystems: ['inventory', 'gacha'],
    tiers: {
      1: [
        {
          prompt: 'Noa, ton laboratoire sent bon ou dangereux ?',
          reply: 'Les deux, si tu ouvres le mauvais flacon. Heureusement, mes mélanges légers sont étiquetés.',
          tone: 'playful',
          tags: ['laboratoire', 'flacon', 'humour'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu testes vraiment les curiosités du gacha ?',
          reply: 'Avec des gants et un sourire. L\'inventaire est mon terrain de jeu préféré.',
          tone: 'playful',
          tags: ['gacha', 'curiosités', 'inventaire'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me laisserais observer une expérience sans risque ?',
          reply: 'Oui, si tu restes derrière la ligne jaune. Je veux un témoin, pas un cobaye.',
          tone: 'direct',
          tags: ['expérience', 'sécurité', 'témoin'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Quelle combinaison sans risque tu recommandes aux novices ?',
          reply: 'Lait de lune plus pétale de brume : effet apaisant, zéro explosion. Promis.',
          tone: 'sincere',
          tags: ['combinaison', 'lait de lune', 'conseil'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as fait goûter un bonbon qui brillait, pourquoi ?',
          reply: 'Pour voir si tu fais la même tête que moi. Spoiler : oui, et c\'était adorable.',
          tone: 'playful',
          tags: ['bonbon', 'goûter', 'complicité'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On parie sur la prochaine trouvaille rare de l\'inventaire ?',
          reply: 'Perdant nettoie les fioles. Mais je triche un peu — j\'ai déjà un indice.',
          tone: 'playful',
          tags: ['pari', 'inventaire', 'fioles'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as collé contre le plan de travail « pour éviter une explosion ».',
          reply: 'Bien sûr. J\'avais surtout envie de sentir ton bassin contre le mien et de goûter ton souffle coupé.',
          tone: 'playful',
          tags: ['laboratoire', 'proximité', 'souffle'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Noa… ce baume sur mes lèvres, c\'était vraiment médical ?',
          reply: 'Non. C\'était une excuse pour te toucher. Si tu rougis encore, je recommence.',
          tone: 'direct',
          tags: ['lèvres', 'baume', 'contact'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si le laboratoire était vide toute la nuit…',
          reply: 'Je t\'allongerais sur la paillasse, je te ferais oublier les fioles, et je ne laisserais personne frapper.',
          tone: 'romantic',
          tags: ['laboratoire', 'nuit', 'intimité'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Quelle potion te représente quand tu me désires ?',
          reply: 'Une chaleur qui monte aux joues, des mains qui tremblent, et l\'envie de te mordre la lèvre sans rien expliquer.',
          tone: 'sincere',
          tags: ['désir', 'joues', 'lèvre'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  sora: {
    displayName: 'Sora',
    relatedSystems: ['moon-farm', 'refuge'],
    tiers: {
      1: [
        {
          prompt: 'Sora, la ferme lunaire, c\'est chez toi ?',
          reply: 'Oui. Je lie les Myrions à la Ferme lunaire et je veille à ce qu\'ils se sentent accueillis.',
          tone: 'sincere',
          tags: ['ferme lunaire', 'myrions', 'accueil'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Comment tu rends le refuge plus chaleureux ?',
          reply: 'Des noms doux, des pauses régulières, et des couvertures quand la nuit tombe sur la ferme.',
          tone: 'sincere',
          tags: ['refuge', 'pauses', 'nuit'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me montrerais comment parler aux Myrions ?',
          reply: 'Parle lentement, regarde leurs oreilles. Ils comprennent le ton avant les mots.',
          tone: 'direct',
          tags: ['myrions', 'ton', 'apprentissage'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi tu assignes un Myrion par activité ?',
          reply: 'Un poste clair, un rythme serein. La ferme lunaire avance mieux sans confusion.',
          tone: 'direct',
          tags: ['assignation', 'rythme', 'ferme-lunaire'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as prêté ton Myrion préféré pour une récolte, sérieux ?',
          reply: 'Il t\'a choisi en frétillant. Je n\'interdis pas une amitié qui fait bonne récolte.',
          tone: 'playful',
          tags: ['myrion', 'récolte', 'amitié'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait installer un abri Myrion près du refuge ?',
          reply: 'Avec des coussins et une cloche douce. Les invités Disagrea adoreront les regarder dormir.',
          tone: 'playful',
          tags: ['abri', 'refuge', 'coussins'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as fait asseoir dans le foin en disant que c\'était pour les Myrions.',
          reply: 'Petit mensonge tendre. Je voulais ta cuisse contre la mienne et ta main dans mes cheveux.',
          tone: 'romantic',
          tags: ['ferme', 'foin', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Sora… tu m\'as embrassé le cou pendant que les Myrions dormaient.',
          reply: 'Ils ronflent fort, heureusement. Moi, je voulais marquer la peau que je reconnaîtrai demain.',
          tone: 'sincere',
          tags: ['cou', 'embrasser', 'nuit'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on restait seuls dans la grange jusqu\'à l\'aube…',
          reply: 'Je t\'envelopperais dans ma couverture, je goûterais ta bouche sans hâte, et je ne penserais plus qu\'aux filons.',
          tone: 'romantic',
          tags: ['grange', 'couverture', 'bouche'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu veux vraiment, sans parler des Myrions.',
          reply: 'T\'avoir contre moi, sentir tes mains glisser sous mon gilet, et dormir entrelacés quand le feu s\'éteint.',
          tone: 'sincere',
          tags: ['désir', 'mains', 'dormir'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  zelie: {
    displayName: 'Zelie',
    relatedSystems: ['village', 'gacha'],
    tiers: {
      1: [
        {
          prompt: 'Zelie, le salon des invités te convient-il vraiment ?',
          reply: 'Mieux qu\'un trône lointain. Ici, les rumeurs du village valent des courriers royaux.',
          tone: 'direct',
          tags: ['salon', 'village', 'rumeurs'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu observes le gacha comme un jeu de cour ?',
          reply: 'Comme un tirage de destinées légères. J\'aime voir qui sourit sans calcul.',
          tone: 'playful',
          tags: ['gacha', 'cour', 'sourire'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me confierais une rumeur vraie du havre ?',
          reply: 'Une seule : le marché cache un marchand honnête. Devine qui.',
          tone: 'playful',
          tags: ['rumeur', 'marché', 'confiance'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi une duchesse exilée reste ici ?',
          reply: 'Parce qu\'on m\'accueille sans protocolaire. Même un titre s\'efface devant une tasse partagée.',
          tone: 'sincere',
          tags: ['exil', 'accueil', 'titre'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as invité au salon sans prévenir, c\'était un piège élégant ?',
          reply: 'Un piège de thé et de confidences. Tu es resté — j\'ai gagné la partie.',
          tone: 'playful',
          tags: ['salon', 'thé', 'complicité'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait organiser un salon ouvert au village ?',
          reply: 'Sans velvet rope. Juste des fauteuils, des histoires, et zéro jugement sur les curiosités du gacha.',
          tone: 'playful',
          tags: ['salon', 'village', 'histoires'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Tu m\'as fait entrer dans le salon et tu as verrouillé la porte « pour le protocole ».',
          reply: 'Protocole imaginaire. Je voulais tes lèvres sur les miennes sans être duchesse, juste femme.',
          tone: 'romantic',
          tags: ['salon', 'verrou', 'lèvres'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Zélie… tu m\'as caressé la mâchoire en disant que j\'avais du sel sur la peau.',
          reply: 'J\'ai menti. J\'avais envie de te toucher comme on touche quelqu\'on désire, pas comme on goûte un plat.',
          tone: 'direct',
          tags: ['mâchoire', 'désir', 'contact'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu m\'invitais dans ta chambre ce soir, sans titre…',
          reply: 'Je te ferais asseoir sur le lit, je dénouerais ton col lentement, et je ne laisserais aucun protocolaire frapper.',
          tone: 'romantic',
          tags: ['chambre', 'lit', 'intimité'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu murmures quand personne n\'écoute ?',
          reply: 'Ton prénom contre mon cou, et la promesse de t\'attirer plus près jusqu\'à ce que tu oublies le havre.',
          tone: 'sincere',
          tags: ['murmure', 'cou', 'promesse'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  etna: {
    displayName: 'Etna',
    relatedSystems: ['gacha', 'prestige'],
    tiers: {
      1: [
        {
          prompt: 'Etna, invitée de la faille Disagrea, tu te plais ici ?',
          reply: 'Assez pour rester. Le gacha du havre est moins bruyant que chez moi, et ça me va.',
          tone: 'direct',
          tags: ['disagrea', 'gacha', 'invitée'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu observes le prestige astral de loin, pourquoi ?',
          reply: 'Parce que je n\'aime pas courir après des éclats. Je préfère voir qui tient le rythme.',
          tone: 'direct',
          tags: ['prestige', 'rythme', 'observation'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me laisserais voir ton vrai visage sans armure ?',
          reply: 'Peut-être. Si tu ne fais pas la tête de conquérant. Je ne suis pas un trophée.',
          tone: 'direct',
          tags: ['armure', 'visage', 'respect'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Qu\'est-ce qui t\'amuse dans le havre ?',
          reply: 'Les mortels qui croient que je vais tout brûler, puis me demandent conseil sur le gacha.',
          tone: 'playful',
          tags: ['havre', 'humour', 'gacha'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as provoqué au billard avec des règles absurdes, avoue.',
          reply: 'Et tu as gagné quand même. Agaçant. Je reviens quand même demain.',
          tone: 'playful',
          tags: ['jeu', 'provocation', 'complicité'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait parier sur la prochaine invitée du gacha ?',
          reply: 'Perdant paie un dessert. Mais je parie déjà sur quelqu\'un qui revient toujours.',
          tone: 'playful',
          tags: ['pari', 'gacha', 'invitée'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Etna… tu m\'as plaqué contre le mur « pour me punir ».',
          reply: 'Ne fais pas l\'innocent. J\'avais envie de sentir ta respiration paniquée — et de te garder là.',
          tone: 'direct',
          tags: ['mur', 'punition', 'désir'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Tes doigts sont restés sur ma ceinture trop longtemps.',
          reply: 'Et les tiens n\'ont pas reculé. Si tu veux que je continue, demande. Je ne supplie pas deux fois.',
          tone: 'romantic',
          tags: ['ceinture', 'contact', 'audace'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si je montais dans ta chambre ce soir, tu me laisserais entrer ?',
          reply: 'Je te tirerais à l\'intérieur, je claquerais la porte, et je te ferais oublier que tu n\'es pas mon sujet.',
          tone: 'direct',
          tags: ['chambre', 'portrait', 'possession'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu veux vraiment, sans couronne.',
          reply: 'Ta bouche sur la mienne, tes mains dans mes cheveux, et une nuit où je ne domine personne d\'autre que mon envie de toi.',
          tone: 'sincere',
          tags: ['bouche', 'nuit', 'aveu'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  flonne: {
    displayName: 'Flonne',
    relatedSystems: ['refuge', 'gacha'],
    tiers: {
      1: [
        {
          prompt: 'Flonne, invitée angélique, le refuge te plaît ?',
          reply: 'Oui ! C\'est doux ici. Même le gacha semble vouloir faire des cadeaux gentils.',
          tone: 'sincere',
          tags: ['refuge', 'gacha', 'invitée'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu encourages vraiment tout le monde à se reposer ?',
          reply: 'Toujours. Les héros du havre oublient parfois de s\'asseoir. Je le rappelle avec un sourire.',
          tone: 'sincere',
          tags: ['repos', 'havre', 'sourire'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me montrerais ton coin préféré pour méditer ?',
          reply: 'Près du refuge, quand la lumière baisse. On peut y parler de choses simples.',
          tone: 'sincere',
          tags: ['méditation', 'refuge', 'lumière'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Comment tu accueilles les autres invités Disagrea ?',
          reply: 'Avec du thé et de la patience. Même Etna finit par s\'asseoir, parfois.',
          tone: 'playful',
          tags: ['invités', 'thé', 'patience'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as offert un pansement avec des petits cœurs, sérieux ?',
          reply: 'Les bobos méritent aussi d\'être jolis ! Et tu as souri, mission accomplie.',
          tone: 'playful',
          tags: ['pansement', 'humour', 'soin'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait préparer un goûter au refuge pour les Myrions ?',
          reply: 'Des biscuits lunaires miniatures ! Sora approuvera, et Laharl fera semblant de ne pas aimer.',
          tone: 'playful',
          tags: ['goûter', 'myrions', 'refuge'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Flonne… tu m\'as bandé les yeux « pour un exercice de confiance ».',
          reply: 'C\'était un prétexte. Je voulais sentir tes lèvres hésiter près des miennes sans que tu puisses fuir.',
          tone: 'playful',
          tags: ['confiance', 'lèvres', 'proximité'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Tu m\'as serré contre toi en disant que j\'avais froid.',
          reply: 'Tu n\'avais pas froid. Moi non plus. J\'avais juste envie de te sentir battre contre ma poitrine.',
          tone: 'romantic',
          tags: ['étreinte', 'poitrine', 'aveu'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on dormait côte à côte au refuge, que ferais-tu ?',
          reply: 'Je glisserais ma main sous ta chemise, je t\'embrasserais doucement, puis moins doucement, jusqu\'à ce que tu restes.',
          tone: 'romantic',
          tags: ['refuge', 'embrasser', 'nuit'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que ton cœur murmure quand je suis là.',
          reply: 'Qu\'il veut ta chaleur, ta bouche, et le droit de te serrer sans excuse angélique.',
          tone: 'sincere',
          tags: ['cœur', 'chaleur', 'désir'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  laharl: {
    displayName: 'Laharl',
    relatedSystems: ['hunt', 'gacha'],
    tiers: {
      1: [
        {
          prompt: 'Laharl, tu viens au havre pour la chasse ou le titre ?',
          reply: 'Pour m\'échauffer ! Le gacha m\'amuse aussi, tant que personne ne me traite comme un boss de fin.',
          tone: 'direct',
          tags: ['chasse', 'gacha', 'invité'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu proposes vraiment la chasse pour te dégourdir ?',
          reply: 'Oui. Une bonne expédition vaut dix discours. Et je déteste rester assis trop longtemps.',
          tone: 'direct',
          tags: ['expédition', 'énergie', 'action'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu m\'emmènerais en chasse sans fanfare ?',
          reply: 'Si tu suis le rythme et tu cries moins que Seren ne le craindrait. Deal ?',
          tone: 'playful',
          tags: ['chasse', 'rythme', 'deal'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Qu\'est-ce qui t\'surprend dans le havre ?',
          reply: 'Les gens gentils. Je m\'y fais. Ne le répète pas trop fort.',
          tone: 'sincere',
          tags: ['surprise', 'gentillesse', 'havre'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as lancé un défi absurde sur le terrain, avoue.',
          reply: 'Et tu as presque gagné ! Presque. Revanche demain, même heure, même arrogance.',
          tone: 'playful',
          tags: ['défi', 'revanche', 'humour'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On parie sur la prochaine prise du gacha ?',
          reply: 'Perdant porte le surnom ridicule. Spoiler : j\'en ai déjà un, donc je risque peu.',
          tone: 'playful',
          tags: ['pari', 'gacha', 'surnom'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Laharl… tu m\'as provoqué en m\'attrapant le col.',
          reply: 'Et tu n\'as pas lâché. Bien. J\'avais envie de sentir si tu tremblerais ou si tu me tirerais plus près.',
          tone: 'direct',
          tags: ['col', 'provocation', 'désir'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Tu m\'as jeté sur le lit du refuge « pour récupérer ».',
          reply: 'Récupérer quoi ? J\'voulais ton souffle dans mon cou et ta main qui refuse de reculer.',
          tone: 'playful',
          tags: ['refuge', 'lit', 'souffle'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on restait seuls après la chasse, que ferais-tu ?',
          reply: 'Je t\'écraserais contre moi — pas pour gagner. Pour sentir ta bouche, ta chaleur, et te faire rester.',
          tone: 'direct',
          tags: ['chasse', 'bouche', 'chaleur'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-le sans fanfare : qu\'est-ce que tu veux ?',
          reply: 'T\'avoir à califourchon sur mes genoux, entendre mon prénom rauque, et zéro audience.',
          tone: 'sincere',
          tags: ['genoux', 'désir', 'intime'],
          intimacyLevel: 5,
        },
      ],
    },
  },

  pleinair: {
    displayName: 'Pleinair',
    relatedSystems: ['refuge', 'prestige'],
    tiers: {
      1: [
        {
          prompt: 'Pleinair, tu es toujours aussi silencieux au refuge ?',
          reply: '…Un hochement. Oui. Le silence laisse entendre le prestige astral sans le bruit du village.',
          tone: 'sincere',
          tags: ['silence', 'refuge', 'prestige'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Tu m\'observes ou tu me protèges ?',
          reply: 'Les deux. Une main légère sur l\'épaule, puis retour au calme. C\'est ma réponse.',
          tone: 'direct',
          tags: ['observation', 'protection', 'calme'],
          intimacyLevel: 1,
        },
      ],
      2: [
        {
          prompt: 'Tu me ferais signe si quelque chose clochait au havre ?',
          reply: 'Un geste net, deux doigts levés. Tu as déjà vu ce signal près du refuge. Tu sauras.',
          tone: 'direct',
          tags: ['signal', 'havre', 'refuge'],
          intimacyLevel: 2,
        },
        {
          prompt: 'Pourquoi tu restes près des invités Disagrea ?',
          reply: '…Parce qu\'on comprend le poids des étoiles sans parler. Même Etna se tait parfois.',
          tone: 'sincere',
          tags: ['invités', 'étoiles', 'compréhension'],
          intimacyLevel: 2,
        },
      ],
      3: [
        {
          prompt: 'Tu m\'as laissé ton siège au refuge, c\'était voulu ?',
          reply: 'Un petit signe : « assieds-toi ». Tu as compris sans mot. J\'ai souri, discrètement.',
          tone: 'playful',
          tags: ['siège', 'geste', 'complicité'],
          intimacyLevel: 3,
        },
        {
          prompt: 'On devrait laisser une trace de toi au village ?',
          reply: '…Une empreinte dans la poussière suffit. Les empreilles disparaissent, l\'habitude reste.',
          tone: 'playful',
          tags: ['trace', 'village', 'habitude'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'Pleinair… tu m\'as tiré dans l\'ombre et tu m\'as gardé contre toi.',
          reply: '…Oui. Pas pour te cacher. Pour sentir ton cœur. Tu as compris sans que je parle.',
          tone: 'romantic',
          tags: ['ombre', 'cœur', 'silence'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Tes doigts sur ma nuque, c\'était un signe ?',
          reply: '…Un oui. Je voulais te toucher. Tu es resté. J\'ai respiré plus fort.',
          tone: 'sincere',
          tags: ['nuque', 'contact', 'aveu'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si on dormait côte à côte au refuge, sans un mot…',
          reply: '…Je poserais ma main sur ton ventre. Je t\'attirerais. Je ne lâcherais pas avant l\'aube.',
          tone: 'romantic',
          tags: ['refuge', 'ventre', 'nuit'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Dis-moi ce que tu désires, même en silence.',
          reply: '…Ta bouche. Ta chaleur. Dormir entrelacés. Tu es déjà la réponse.',
          tone: 'sincere',
          tags: ['bouche', 'chaleur', 'lien'],
          intimacyLevel: 5,
        },
      ],
    },
  },
}

