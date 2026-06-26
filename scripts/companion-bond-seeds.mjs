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
          prompt: 'Parfois je me sens perdu entre toutes les quêtes du havre.',
          reply: 'Moi aussi, au début. Une récolte, une page, un ami — le reste peut attendre.',
          tone: 'sincere',
          tags: ['conseil', 'havre', 'patience'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Y a-t-il quelque chose que tu n\'as jamais dit au village ?',
          reply: 'J\'ai failli repartir la semaine de mon arrivée. Tu as retardé cette valise.',
          tone: 'romantic',
          tags: ['secret', 'rester', 'gratitude'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'un seul livre ici, lequel serait-ce ?',
          reply: 'Celui où j\'ai griffonné ton nom en marge. Ne le cherche pas, je le cache bien.',
          tone: 'romantic',
          tags: ['livre', 'marge', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu vois quand tu me regardes ?',
          reply: 'Quelqu\'un qui lit entre les lignes du monde, pas seulement des parchemins.',
          tone: 'sincere',
          tags: ['regard', 'compréhension', 'lien'],
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
          prompt: 'As-tu déjà regretté un échange ici ?',
          reply: 'Une fois, j\'ai cédé un fragment rare à quelqu\'un qui est parti trop vite. Depuis, j\'attends qu\'on revienne.',
          tone: 'sincere',
          tags: ['regret', 'fragment', 'attente'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu restes au havre alors que tu connais d\'autres routes ?',
          reply: 'Parce que certaines routes mènent à des comptoirs vides. Ici, il y a des visages que je ne veux pas perdre.',
          tone: 'romantic',
          tags: ['rester', 'routes', 'visages'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu fermais ta boutique demain, que ferais-tu ?',
          reply: 'J\'ouvrirais une table pour deux, sans étiquette de prix. Tu serais invité en premier.',
          tone: 'romantic',
          tags: ['boutique', 'invitation', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Quel trésor du havre tu protèges le plus ?',
          reply: 'Les habitudes qu\'on tisse sans contrat. Elles ne s\'échangent pas, elles se gardent.',
          tone: 'sincere',
          tags: ['trésor', 'habitude', 'lien'],
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
          prompt: 'As-tu déjà douté de ta place ici ?',
          reply: 'Oui. Puis j\'ai vu un enfant du village rire sans peur. C\'est une victoire aussi.',
          tone: 'sincere',
          tags: ['doute', 'village', 'victoire'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Y a-t-il quelqu\'un que tu veux protéger en priorité ?',
          reply: 'Ceux qui reviennent me saluer après une expédition. Toi inclus, si tu m\'écoutes.',
          tone: 'romantic',
          tags: ['protection', 'retour', 'priorité'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si le havre était attaqué, où te placerais-tu ?',
          reply: 'Entre la menace et toi. Ce n\'est pas un serment officiel, c\'est un choix déjà fait.',
          tone: 'romantic',
          tags: ['serment', 'choix', 'garde'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Savoir qu\'on peut baisser la garde sans devenir vulnérable aux yeux de l\'autre.',
          tone: 'sincere',
          tags: ['lien', 'garde', 'confiance'],
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
          prompt: 'On devrait organiser un repas pour les Myrions du chantier ?',
          reply: 'Bonne idée. Des portions légères, des noms gentils sur les bols, et zéro course.',
          tone: 'playful',
          tags: ['myrions', 'chantier', 'repas'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'As-tu peur de ne plus avoir assez à partager un jour ?',
          reply: 'Parfois. Alors je me rappelle pourquoi j\'ai ouvert ma marmite au havre : personne ne mange seul ici.',
          tone: 'sincere',
          tags: ['peur', 'partage', 'havre'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Quel souvenir de cuisine tu gardes en secret ?',
          reply: 'La première fois où tu as dit que ça sentait comme chez toi. J\'ai failli pleurer dans le bouillon.',
          tone: 'romantic',
          tags: ['souvenir', 'odeur', 'bouillon'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne pouvais préparer qu\'un dernier repas ici, ce serait quoi ?',
          reply: 'Ce qu\'on mange assis côte à côte, sans chrono. Le menu importe moins que la main qui reste.',
          tone: 'romantic',
          tags: ['repas', 'main', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu vois en moi, Nami ?',
          reply: 'Quelqu\'un qui revient à table même quand la journée a été dure. C\'est déjà un cadeau rare.',
          tone: 'sincere',
          tags: ['retour', 'table', 'cadeau'],
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
          prompt: 'On pourrait planter quelque chose ensemble au chantier ?',
          reply: 'Un carré discret, loin des pas pressés. Les Myrions aiment les feuilles qui bougent doucement.',
          tone: 'playful',
          tags: ['plantation', 'chantier', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'As-tu déjà perdu une récolte qui comptait pour toi ?',
          reply: 'Une once de rêve bleu, après une nuit sans sommeil. J\'ai appris à demander de l\'aide avant la fonte.',
          tone: 'sincere',
          tags: ['récolte', 'perte', 'aide'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu restes rêveuse alors que le havre travaille dur ?',
          reply: 'Parce que certains rêves deviennent des graines. Tu en as planté un en moi sans le savoir.',
          tone: 'romantic',
          tags: ['rêve', 'graine', 'tendresse'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'une seule fleur ici, laquelle ?',
          reply: 'Celle que tu m\'as aidée à sauver du gel. Elle fleurit encore du côté où tu t\'assieds.',
          tone: 'romantic',
          tags: ['fleur', 'gel', 'souvenir'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que ressens-tu quand on est silencieux ensemble au jardin ?',
          reply: 'Que le havre respire mieux. Comme si nos racines se touchaient sous la terre.',
          tone: 'sincere',
          tags: ['silence', 'racines', 'lien'],
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
          prompt: 'As-tu déjà eu peur de ne plus faire rire personne ?',
          reply: 'Oui, après une soirée vide. Puis tu as applaudi trop fort pour rien — j\'ai retrouvé la scène.',
          tone: 'sincere',
          tags: ['peur', 'applaudir', 'scène'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Derrière le masque, qui es-tu vraiment ?',
          reply: 'Quelqu\'un qui cherche encore la bonne note pour dire merci sans en faire un spectacle.',
          tone: 'romantic',
          tags: ['masque', 'merci', 'vulnérabilité'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne chantais plus qu\'une seule phrase ici, laquelle ?',
          reply: '« Reste encore un peu. » Simple, sincère, et assez fort pour remplir le théâtre.',
          tone: 'romantic',
          tags: ['chant', 'rester', 'sincérité'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu retiens de nous deux ?',
          reply: 'Une improvisation où ni l\'un ni l\'autre n\'a trébuché. C\'est rare, et précieux.',
          tone: 'sincere',
          tags: ['improvisation', 'souvenir', 'précieux'],
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
          prompt: 'Tu conseilles quoi pour les outils du chantier lunaire ?',
          reply: 'Du bon acier, bien affûté, et des pauses. Même la ferme lunaire fatigue les lames.',
          tone: 'sincere',
          tags: ['outils', 'chantier', 'ferme lunaire'],
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
          reply: 'Une cloche douce, pas un coup de tonnerre. Les Myrions du chantier dormiraient mieux.',
          tone: 'playful',
          tags: ['cloche', 'village', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'As-tu déjà brûlé une pièce qui comptait ?',
          reply: 'Une charnière pour un abri du refuge. J\'ai recommencé en silence, puis demandé de l\'aide.',
          tone: 'sincere',
          tags: ['échec', 'refuge', 'aide'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Qu\'est-ce qui te fait rester ici plutôt qu\'ailleurs ?',
          reply: 'Des mains qui reviennent avec leurs outils cassés et leurs histoires intactes. Comme les tiennes.',
          tone: 'romantic',
          tags: ['rester', 'mains', 'histoires'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne forgeais qu\'un dernier objet pour le havre ?',
          reply: 'Une broche discrète pour marquer qu\'on appartient au même feu, sans fanfare.',
          tone: 'romantic',
          tags: ['broche', 'feu', 'appartenance'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Tenir le métal chaud ensemble sans se brûler. La confiance, c\'est aussi de la technique.',
          tone: 'sincere',
          tags: ['lien', 'confiance', 'technique'],
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
          prompt: 'On devrait bénir les nouvelles graines du chantier ?',
          reply: 'Une prière brève, deux gouttes d\'eau, zéro discours. Les Myrions n\'aiment pas les longs sermons.',
          tone: 'playful',
          tags: ['bénédiction', 'graines', 'myrions'],
          intimacyLevel: 3,
        },
      ],
      4: [
        {
          prompt: 'As-tu déjà douté de ta foi dans ce havre ?',
          reply: 'Oui, quand la brume a caché la source. Puis quelqu\'un est venu boire sans rien demander — j\'ai compris.',
          tone: 'sincere',
          tags: ['foi', 'brume', 'compréhension'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Y a-t-il une prière que tu dis pour moi en secret ?',
          reply: 'Une seule : que tu trouves la paix avant la performance. Tu fais déjà assez.',
          tone: 'romantic',
          tags: ['prière', 'paix', 'tendresse'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'un souvenir de la source, lequel ?',
          reply: 'Le jour où tu t\'es assis à mes côtés sans vouloir guérir le monde entier.',
          tone: 'romantic',
          tags: ['souvenir', 'source', 'présence'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que ressens-tu quand nos silences se ressemblent ?',
          reply: 'Que le havre nous reconnaît. Deux gouttes qui tombent au même instant.',
          tone: 'sincere',
          tags: ['silence', 'reconnaissance', 'lien'],
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
          prompt: 'Tu m\'emmènerais voir un coin secret du chantier ?',
          reply: 'Si tu promets de ne pas tout extraire d\'un coup. L\'exploration, c\'est aussi respecter.',
          tone: 'direct',
          tags: ['secret', 'chantier', 'respect'],
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
          prompt: 'As-tu déjà eu peur de te perdre loin du havre ?',
          reply: 'Une fois, oui. Puis j\'ai entendu la cloche du village au loin. J\'ai su que je pouvais revenir.',
          tone: 'sincere',
          tags: ['peur', 'village', 'retour'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu fais confiance à mes cartes improvisées ?',
          reply: 'Parce que tu marques les endroits où tu t\'es arrêté pour m\'attendre. C\'est une carte du cœur.',
          tone: 'romantic',
          tags: ['carte', 'confiance', 'cœur'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne pouvais plus explorer qu\'un seul chemin ici ?',
          reply: 'Celui qui mène vers toi après une longue journée. Même sans trésor au bout.',
          tone: 'romantic',
          tags: ['chemin', 'retour', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que l\'aventure t\'a appris sur nous ?',
          reply: 'Qu\'on avance mieux quand personne ne court devant l\'autre pour briller.',
          tone: 'sincere',
          tags: ['aventure', 'rythme', 'lien'],
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
          reply: 'Pour ceux qui reviennent fatigués du chantier. Un bon tissu console avant les mots.',
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
          prompt: 'As-tu déjà déchiré une œuvre qui te tenait à cœur ?',
          reply: 'Un linceul trop serré pour un Myrion anxieux. J\'ai recommencé en écoutant ses peurs.',
          tone: 'sincere',
          tags: ['œuvre', 'myrion', 'écoute'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Quel fil te relie le plus au havre ?',
          reply: 'Celui que tu m\'as tendu quand j\'hésitais à exposer mes broderies. Tu as cru en elles.',
          tone: 'romantic',
          tags: ['fil', 'broderie', 'croyance'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne tissais qu\'un dernier motif ici, lequel ?',
          reply: 'Deux lignes parallèles qui se croisent une fois, puis continuent ensemble. Simple et vrai.',
          tone: 'romantic',
          tags: ['motif', 'parallèle', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que vois-tu quand tu me regardes travailler ?',
          reply: 'Quelqu\'un qui laisse des traces dignes d\'être brodées. Je n\'ai pas fini le tableau.',
          tone: 'sincere',
          tags: ['regard', 'broderie', 'lien'],
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
          prompt: 'As-tu déjà failli perdre une source ?',
          reply: 'Une fois, un filon trop agressif l\'a troublée. J\'ai appris à négocier avec le prestige, pas le dompter.',
          tone: 'sincere',
          tags: ['source', 'filon', 'prestige'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu me fais confiance près de l\'eau ?',
          reply: 'Parce que tu y mets les mains lentement, comme si tu comprenais ce qui vit dessous.',
          tone: 'romantic',
          tags: ['confiance', 'eau', 'respect'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne protégeais qu\'une chose ici, ce serait quoi ?',
          reply: 'Notre promesse de revenir boire ensemble après les longues journées. C\'est une source aussi.',
          tone: 'romantic',
          tags: ['promesse', 'boire', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Deux courants qui se rejoignent sans noyer l\'autre. Rares, et clairs.',
          tone: 'sincere',
          tags: ['courant', 'lien', 'clarté'],
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
          prompt: 'Y a-t-il une page que tu n\'oses pas classer ?',
          reply: 'Un témoignage sur toi, laissé par un voisin. Je l\'ai lue trois fois avant de trouver le bon tiroir.',
          tone: 'sincere',
          tags: ['témoignage', 'page', 'émotion'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu m\'as confié l\'accès à la réserve ?',
          reply: 'Parce que tu refermes toujours les portes. La confiance, chez moi, se mesure aux petits gestes.',
          tone: 'romantic',
          tags: ['réserve', 'confiance', 'gestes'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'une entrée d\'archive sur nous ?',
          reply: '« Arrivée en paire, départ jamais seul. » Court, exact, suffisant.',
          tone: 'romantic',
          tags: ['archive', 'entrée', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que retiens-tu de moi dans tes registres ?',
          reply: 'Quelqu\'un qui pose des questions justes. C\'est la meilleure forme de respect pour un archiviste.',
          tone: 'sincere',
          tags: ['registre', 'questions', 'respect'],
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
          prompt: 'As-tu déjà eu peur de tes propres mélanges ?',
          reply: 'Une fois. Depuis, je note mes doutes sur le même carnet que mes recettes.',
          tone: 'sincere',
          tags: ['doute', 'carnet', 'recettes'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu me montres tes échecs en alchimie ?',
          reply: 'Parce qu\'avec toi, un raté devient une blague, pas une honte. C\'est rare et précieux.',
          tone: 'romantic',
          tags: ['échec', 'blague', 'confiance'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne créais qu\'une dernière potion ici, ce serait quoi ?',
          reply: 'Une goutte de « reste ce soir ». Sans effet secondaire, juste du cœur.',
          tone: 'romantic',
          tags: ['potion', 'rester', 'cœur'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Qu\'est-ce que tu vois en moi, Noa ?',
          reply: 'Mon partenaire de chaos gentil. Ensemble, on renverse moins de flacons.',
          tone: 'sincere',
          tags: ['partenaire', 'chaos', 'lien'],
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
          reply: 'Oui. Je lie les Myrions au chantier et je veille à ce qu\'ils se sentent accueillis.',
          tone: 'sincere',
          tags: ['ferme lunaire', 'myrions', 'accueil'],
          intimacyLevel: 1,
        },
        {
          prompt: 'Comment tu rends le refuge plus chaleureux ?',
          reply: 'Des noms doux, des pauses régulières, et des couvertures quand la nuit tombe sur le chantier.',
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
          tags: ['assignation', 'rythme', 'chantier'],
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
          prompt: 'As-tu déjà craint de ne pas en faire assez pour eux ?',
          reply: 'Souvent. Puis un Myrion s\'endort sur mes genoux, et je sais que c\'est déjà beaucoup.',
          tone: 'sincere',
          tags: ['doute', 'myrion', 'réconfort'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu me confies tes Myrions fatigués ?',
          reply: 'Parce que tu les poses doucement, comme des promesses. Je n\'oublie pas ce geste.',
          tone: 'romantic',
          tags: ['confiance', 'geste', 'promesse'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'un souvenir de la ferme lunaire ?',
          reply: 'Le jour où tu as attendu avec moi qu\'un petit Myrion fasse ses premiers pas.',
          tone: 'romantic',
          tags: ['souvenir', 'premiers pas', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Partager le silence des créatures qui nous font confiance. Et tenir la main humaine aussi.',
          tone: 'sincere',
          tags: ['silence', 'confiance', 'lien'],
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
          prompt: 'As-tu déjà regretté ton exil ?',
          reply: 'Parfois la nuit. Puis je vois le havre tenir debout sans couronne, et je respire.',
          tone: 'sincere',
          tags: ['exil', 'regret', 'havre'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu baisses la garde avec moi ?',
          reply: 'Parce que tu ne demandes jamais de performance. Tu demandes une personne.',
          tone: 'romantic',
          tags: ['garde', 'personne', 'tendresse'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'un bijou ici, lequel ?',
          reply: 'Une épingle sans armoiries, offerte par toi. Elle vaut plus qu\'un sceptre.',
          tone: 'romantic',
          tags: ['bijou', 'épingle', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Choisir quelqu\'un sans alliance ni contrat. Juste la volonté de revenir.',
          tone: 'sincere',
          tags: ['lien', 'choix', 'revenir'],
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
          prompt: 'As-tu déjà eu peur de redevenir seule ?',
          reply: 'Oui. Même une reine démoniaque a des nuits trop longues. Ne t\'en va pas trop vite.',
          tone: 'sincere',
          tags: ['peur', 'solitude', 'nuit'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu restes quand tu pourrais partir ?',
          reply: 'Parce que tu me traites comme une voisine, pas comme une légende. C\'est neuf, et bon.',
          tone: 'romantic',
          tags: ['rester', 'voisine', 'légende'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne gardais qu\'un souvenir du havre ?',
          reply: 'Le soir où tu as ri de ma blague sans trembler. J\'ai senti un trône différent.',
          tone: 'romantic',
          tags: ['souvenir', 'rire', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Quelqu\'un qui ne fuit pas quand je baisse la voix. Rare, donc précieux.',
          tone: 'sincere',
          tags: ['lien', 'voix', 'précieux'],
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
          prompt: 'As-tu déjà douté de ta bonté ici ?',
          reply: 'Quand j\'ai voulu guérir trop vite. J\'ai appris qu\'écouter vaut parfois mieux qu\'un sort.',
          tone: 'sincere',
          tags: ['doute', 'écoute', 'guérison'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu passes du temps avec moi sans mission ?',
          reply: 'Parce que tu me laisses être simple. Pas seulement l\'ange du refuge.',
          tone: 'romantic',
          tags: ['simplicité', 'présence', 'tendresse'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne pouvais offrir qu\'un dernier réconfort ici ?',
          reply: 'Une étreinte légère et le mot « reste ». Le havre a déjà assez de bruit.',
          tone: 'romantic',
          tags: ['réconfort', 'rester', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que vois-tu en moi, Flonne ?',
          reply: 'Quelqu\'un qui protège les autres et oublie parfois de se protéger. Je veille aussi.',
          tone: 'sincere',
          tags: ['protection', 'veille', 'lien'],
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
          prompt: 'As-tu déjà eu peur de ne pas être à la hauteur ?',
          reply: '…Oui. Même un overlord doute. Toi, tu es resté. Ça compte plus qu\'une victoire.',
          tone: 'sincere',
          tags: ['doute', 'overlord', 'présence'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu reviens me voir après une chasse ?',
          reply: 'Parce que tu m\'accueilles sans courber l\'échine. C\'est rare, et ça me plaît.',
          tone: 'romantic',
          tags: ['retour', 'accueil', 'respect'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne pouvais garder qu\'un trophée du havre ?',
          reply: 'Pas un trophée. Juste le souvenir d\'une chasse où on a ri au lieu de compter les points.',
          tone: 'romantic',
          tags: ['souvenir', 'chasse', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Un rival qui devient allié sans perdre sa fierté. Toi, tu y arrives.',
          tone: 'sincere',
          tags: ['lien', 'fierté', 'allié'],
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
          prompt: 'As-tu déjà eu peur de disparaître dans le bruit du havre ?',
          reply: '…Oui. Puis tu t\'es assis à côté de moi sans demander un mot. J\'ai respiré.',
          tone: 'sincere',
          tags: ['peur', 'présence', 'respiration'],
          intimacyLevel: 4,
        },
        {
          prompt: 'Pourquoi tu me fais confiance sans parler ?',
          reply: 'Parce que tu écoutes aussi le silence. Peu le font. Toi, oui.',
          tone: 'romantic',
          tags: ['confiance', 'silence', 'écoute'],
          intimacyLevel: 4,
        },
      ],
      5: [
        {
          prompt: 'Si tu ne pouvais me laisser qu\'un dernier signe ici ?',
          reply: '…Deux mains jointes, puis un pouce levé. « On reste. » Sans bruit, mais vrai.',
          tone: 'romantic',
          tags: ['signe', 'rester', 'intime'],
          intimacyLevel: 5,
        },
        {
          prompt: 'Que signifie pour toi un lien profond ?',
          reply: 'Être là, même sans voix. Tu l\'es aussi pour moi. C\'est suffisant.',
          tone: 'sincere',
          tags: ['lien', 'présence', 'voix'],
          intimacyLevel: 5,
        },
      ],
    },
  },
}

