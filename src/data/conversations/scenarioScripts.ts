import type { ScenarioScript } from './types'

const S = (
  id: string,
  title: string,
  minAffinity: number,
  maxAffinity: number,
  hints: ScenarioScript['roundToneHints'],
  rounds: ScenarioScript['rounds'],
): ScenarioScript => ({
  id,
  title,
  minAffinity,
  maxAffinity,
  roundToneHints: hints,
  rounds,
})

/** Scénarios cohérents : contexte + question + réponses liées */
export const SCENARIO_SCRIPTS: ScenarioScript[] = [
  S(
    'rain-inn',
    'Pluie sur le toit',
    1,
    5,
    ['sincere', 'sincere', 'romantic'],
    [
      {
        context: [
          'Tu pousses une porte lourde. Dehors, la pluie tambourine sur les tuiles.',
          '{name} est près du feu, un chiffon à la main.',
        ],
        prompt: '« Tu es trempé… Entre, avant que tu attrapes froid. »',
        choices: [
          {
            text: 'Merci. J\'avais justement besoin d\'un endroit calme.',
            tone: 'sincere',
            reaction: '{name} hoche la tête et pousse une chaise vers la flamme.',
          },
          {
            text: 'Alors sers-moi quelque chose de chaud, chef !',
            tone: 'playful',
            reaction: '{name} sourit. « D\'accord, mais tu m\'aides à essuyer la table. »',
          },
          {
            text: 'Je ne reste que le temps de sécher.',
            tone: 'direct',
            reaction: '« Comme tu veux », dit {name}, un peu déçue.',
          },
          {
            text: 'Heureusement que tu étais là… j\'ai pensé à toi en courant.',
            tone: 'romantic',
            reaction: '{name} détourne le regard, mais le feu semble lui aussi rougir.',
          },
        ],
      },
      {
        context: ['La pluie continue. {name} te tend une tasse fumante.'],
        prompt: '« Dis-moi… pourquoi tu es venu me voir, ce soir ? »',
        choices: [
          {
            text: 'Parce que ta compagnie me fait du bien.',
            tone: 'sincere',
            reaction: '« Moi aussi », murmure {name}, les doigts autour de la tasse.',
          },
          {
            text: 'Pour voir si tu chantais sous la pluie. Spoiler : non.',
            tone: 'playful',
            reaction: '{name} éclate de rire. « Tu rates une belle voix, crois-moi. »',
          },
          {
            text: 'J\'avais besoin de réponses, pas de poésie.',
            tone: 'direct',
            reaction: '« Alors parle », dit {name}, plus sérieuse.',
          },
          {
            text: 'Parce que c\'est ici que j\'ai envie d\'être.',
            tone: 'romantic',
            reaction: '{name} reste un instant sans mot, puis sourit doucement.',
          },
        ],
      },
      {
        context: ['La pluie faiblit. Une dernière goutte glisse le long de la vitre.'],
        prompt: '« Elle va s\'arrêter… Tu repars ou tu restes encore un peu ? »',
        choices: [
          {
            text: 'Je reste. La nuit est meilleure avec toi.',
            tone: 'sincere',
            reaction: '{name} soupire, soulagée. « Alors reste. »',
          },
          {
            text: 'Je reste — à condition que tu me doives un dessert.',
            tone: 'playful',
            reaction: '« Marché conclu », rit {name}.',
          },
          {
            text: 'Je dois y aller. Merci pour le secours.',
            tone: 'direct',
            reaction: '« Entendu », dit {name}. Poli, mais plat.',
          },
          {
            text: 'Reste avec moi jusqu\'à ce que le ciel se vide.',
            tone: 'romantic',
            reaction: '{name} incline la tête. « D\'accord… jusqu\'au bout. »',
          },
        ],
      },
    ],
  ),
  S(
    'library-pages',
    'Silence entre les pages',
    1,
    4,
    ['sincere', 'sincere', 'sincere'],
    [
      {
        context: [
          '{place} sent le parchemin et la cire.',
          '{name} lève les yeux d\'un grimoire ouvert.',
        ],
        prompt: '« Tu es là depuis un moment… Tu voulais quelque chose ? »',
        choices: [
          {
            text: 'J\'aimais te voir concentrée. Ça te va bien.',
            tone: 'sincere',
            reaction: 'Un petit sourire timide lui échappe.',
          },
          {
            text: 'Oui : voler ton grimoire. Blague. Parle-moi plutôt.',
            tone: 'playful',
            reaction: '« Malin », dit {name}, mais elle referme le livre pour t\'écouter.',
          },
          {
            text: 'Je passais. Rien d\'important.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, un peu déçue.',
          },
          {
            text: 'Tu es magnifique quand tu lis. Viens plus près.',
            tone: 'romantic',
            reaction: 'Elle détourne le regard, gênée. « Trop tôt pour ça… »',
          },
        ],
      },
      {
        context: ['{name} pose un marque-page. Le silence est confortable.'],
        prompt: '« Parfois je me demande si je parle trop de magie… »',
        choices: [
          {
            text: 'Non. Explique-moi encore. Je t\'écoute vraiment.',
            tone: 'sincere',
            reaction: 'Ses yeux s\'illuminent doucement.',
          },
          {
            text: 'Un peu. Raconte-moi plutôt ton pire sort raté.',
            tone: 'playful',
            reaction: 'Elle rit. « D\'accord, mais tu ne le répètes à personne. »',
          },
          {
            text: 'Oui. Changeons de sujet.',
            tone: 'direct',
            reaction: 'Elle se replie sur elle-même.',
          },
          {
            text: 'Parle-moi de toi, pas seulement des livres.',
            tone: 'romantic',
            reaction: 'Elle reste polie, mais plus distante.',
          },
        ],
      },
      {
        context: ['La bougie crépite. {name} ferme enfin son grimoire.'],
        prompt: '« Merci d\'être resté. Peu de gens le feraient. »',
        choices: [
          {
            text: 'Je reste tant que tu le veux.',
            tone: 'sincere',
            reaction: '{name} rougit légèrement, satisfaite.',
          },
          {
            text: 'Alors offre-moi un chapitre en bonus demain !',
            tone: 'playful',
            reaction: '« Greedy », murmure-t-elle en souriant.',
          },
          {
            text: 'De rien. C\'est normal.',
            tone: 'direct',
            reaction: 'Correct, sans étincelle.',
          },
          {
            text: 'Alors offre-moi un baiser ?',
            tone: 'romantic',
            reaction: 'Trop tôt — elle recule, gênée.',
          },
        ],
      },
    ],
  ),
  S(
    'campfire',
    'Feu de camp',
    1,
    5,
    ['playful', 'playful', 'sincere'],
    [
      {
        context: [
          'La lisière sent le pin et la cendre tiède.',
          '{name} attise les braises d\'un bâton.',
        ],
        prompt: '« Allez, assieds-toi ! J\'ai une histoire à te raconter. »',
        choices: [
          {
            text: 'Je suis fatigué… une autre fois.',
            tone: 'direct',
            reaction: 'Elle fait la moue. « Dommage. »',
          },
          {
            text: 'Vas-y, championne des histoires !',
            tone: 'playful',
            reaction: 'Elle éclate de rire, ravie.',
          },
          {
            text: 'Si c\'est une vraie histoire, je reste.',
            tone: 'sincere',
            reaction: '« Promis », dit {name}, les yeux brillants.',
          },
          {
            text: 'Seulement si tu me tiens la main pendant.',
            tone: 'romantic',
            reaction: '{name} rougit puis rigole. « On verra. »',
          },
        ],
      },
      {
        context: ['Les flammes dansent. {name} baisse la voix, comme pour un secret.'],
        prompt: '« Tu crois aux monstres gentils dans la forêt ? Moi oui. »',
        choices: [
          {
            text: 'Non, c\'est pour les enfants.',
            tone: 'direct',
            reaction: 'Elle boude une seconde.',
          },
          {
            text: 'Seulement s\'ils partagent leurs marshmallows.',
            tone: 'playful',
            reaction: '« Deal ! » dit {name} en tendant un bâton.',
          },
          {
            text: 'Peut-être. Le monde est plus large qu\'on croit.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, sérieuse un instant.',
          },
          {
            text: 'Seulement si tu me tiens la main dans le noir.',
            tone: 'romantic',
            reaction: '{name} rougit puis rigole.',
          },
        ],
      },
      {
        context: ['Le feu crépite. Les étoiles percent la voûte.'],
        prompt: '« Bon… tu restes ce soir ou tu retournes au village ? »',
        choices: [
          {
            text: 'Je dois y aller.',
            tone: 'direct',
            reaction: 'Elle comprend, mais c\'est plat.',
          },
          {
            text: 'Je reste. Ton camp vaut mieux que mon lit.',
            tone: 'sincere',
            reaction: 'Victoire — {name} scintille de joie.',
          },
          {
            text: 'Je reste si tu me promets une autre histoire.',
            tone: 'playful',
            reaction: '« Trois histoires, alors », propose-t-elle.',
          },
          {
            text: 'Ça dépend de ce que tu offres…',
            tone: 'romantic',
            reaction: 'Trop mercantile pour elle.',
          },
        ],
      },
    ],
  ),
  S(
    'spring-mist',
    'Brume de la source',
    2,
    5,
    ['sincere', 'sincere', 'romantic'],
    [
      {
        context: [
          'La brume lève des volutes au-dessus de {place}.',
          '{name} observe l\'eau, immobile.',
        ],
        prompt: '« L\'eau écoute ceux qui savent attendre. »',
        choices: [
          {
            text: 'Bref, tu sors ce soir ?',
            tone: 'direct',
            reaction: 'Le moment se brise.',
          },
          {
            text: 'Alors j\'attends avec toi, en silence.',
            tone: 'sincere',
            reaction: 'Elle sourit comme à un secret partagé.',
          },
          {
            text: 'L\'eau m\'ennuie.',
            tone: 'playful',
            reaction: 'Elle soupire, patiente mais peinée.',
          },
          {
            text: 'Et moi, j\'écoute surtout ta voix.',
            tone: 'romantic',
            reaction: 'Elle préfère la sincérité calme pour l\'instant.',
          },
        ],
      },
      {
        context: ['Un oiseau s\'éloigne. {name} incline la tête vers toi.'],
        prompt: '« Tu portes beaucoup de poids… je le sens. »',
        choices: [
          {
            text: 'Ne fais pas la voyante.',
            tone: 'direct',
            reaction: 'Elle se retire dans sa douceur.',
          },
          {
            text: 'Avec toi, ça semble plus léger.',
            tone: 'sincere',
            reaction: '{name} pose une main rassurante.',
          },
          {
            text: 'Oui, et alors ?',
            tone: 'playful',
            reaction: 'Trop sec pour elle.',
          },
          {
            text: 'Tu peux porter un peu avec moi.',
            tone: 'romantic',
            reaction: 'Elle sourit, touchée.',
          },
        ],
      },
      {
        context: ['La lune se reflète dans la source.'],
        prompt: '« La lune te va bien ce soir. »',
        choices: [
          {
            text: 'Merci.',
            tone: 'direct',
            reaction: 'Poli mais fade.',
          },
          {
            text: 'C\'est toi qui fais briller la nuit.',
            tone: 'romantic',
            reaction: '{name} incline la tête, touchée.',
          },
          {
            text: 'Tu dis ça à tout le monde ?',
            tone: 'playful',
            reaction: 'Elle préfère la sincérité.',
          },
          {
            text: 'Toi aussi tu es belle, ce soir.',
            tone: 'sincere',
            reaction: 'Elle sourit, apaisée.',
          },
        ],
      },
    ],
  ),
  S(
    'theater-curtains',
    'Coulisses du théâtre',
    1,
    5,
    ['playful', 'romantic', 'playful'],
    [
      {
        context: [
          'Derrière le rideau, {place} sent la poussière de velours.',
          '{name} s\'incline théâtralement.',
        ],
        prompt: '« Ma star préférée honore ma loge ! »',
        choices: [
          {
            text: 'Je ne suis pas ta star.',
            tone: 'direct',
            reaction: 'Le charme retombe un peu.',
          },
          {
            text: 'Arrête, tu exagères… continue.',
            tone: 'playful',
            reaction: '{name} applaudit ton sens du jeu.',
          },
          {
            text: 'J\'ai pas le temps.',
            tone: 'sincere',
            reaction: 'Il masque sa déception.',
          },
          {
            text: 'Pour toi, je joue le rôle chaque soir.',
            tone: 'romantic',
            reaction: '{name} s\'illumine, conquis.',
          },
        ],
      },
      {
        context: ['Des pas résonnent sur la scène vide.'],
        prompt: '« Chaque scène est mieux avec un public complice. »',
        choices: [
          {
            text: 'Le public s\'en fiche.',
            tone: 'direct',
            reaction: 'Il fronce les sourcils.',
          },
          {
            text: 'Alors joue pour moi seul ce soir.',
            tone: 'romantic',
            reaction: '{name} s\'illumine, conquis.',
          },
          {
            text: 'Je préfère les répétitions aux premières.',
            tone: 'sincere',
            reaction: '« Honnête », dit-il, un peu déçu du manque de jeu.',
          },
          {
            text: 'Bis — et encore bis !',
            tone: 'playful',
            reaction: 'Standing ovation dans sa tête.',
          },
        ],
      },
      {
        context: ['Le rideau tremble dans un courant d\'air.'],
        prompt: '« Un dernier mot avant le rideau ? »',
        choices: [
          {
            text: 'Non.',
            tone: 'direct',
            reaction: 'Rideau tombe.',
          },
          {
            text: 'Bis — et encore bis.',
            tone: 'playful',
            reaction: 'Standing ovation dans sa tête.',
          },
          {
            text: 'Bonne nuit.',
            tone: 'sincere',
            reaction: 'Correct.',
          },
          {
            text: 'Reviens me voir demain, même hors scène.',
            tone: 'romantic',
            reaction: '{name} incline la tête, ému.',
          },
        ],
      },
    ],
  ),
  S(
    'guard-cold',
    'Garde en armure',
    1,
    4,
    ['direct', 'direct', 'sincere'],
    [
      {
        context: [
          '{name} croise les bras sur {place}.',
          'Son regard est dur, mais pas hostile.',
        ],
        prompt: '« Encore toi. Tu cherches quoi ? »',
        choices: [
          {
            text: 'Relax, je voulais juste discuter.',
            tone: 'playful',
            reaction: 'Son regard se durcit.',
          },
          {
            text: 'Je respecte ce que tu fais pour le village.',
            tone: 'sincere',
            reaction: 'Elle incline légèrement la tête.',
          },
          {
            text: 'Je voulais te parler franchement.',
            tone: 'direct',
            reaction: '« Alors parle », dit-elle.',
          },
          {
            text: 'Tu es mignonne quand tu fais la dure.',
            tone: 'romantic',
            reaction: 'Mauvaise idée.',
          },
        ],
      },
      {
        context: ['Elle tapote la garde de son épée.'],
        prompt: '« Je n\'ai pas besoin de pitié. »',
        choices: [
          {
            text: 'Si tu le dis…',
            tone: 'playful',
            reaction: 'Conversation bloquée.',
          },
          {
            text: 'Ce n\'est pas de la pitié. C\'est de la confiance.',
            tone: 'sincere',
            reaction: 'Un silence, puis un accord discret.',
          },
          {
            text: 'Je sais. Je suis là par choix.',
            tone: 'direct',
            reaction: 'Elle incline la tête, respectueuse.',
          },
          {
            text: 'Personne ne t\'a demandé ton avis.',
            tone: 'romantic',
            reaction: 'Elle se détourne, froide.',
          },
        ],
      },
      {
        context: ['Le vent souffle sur la place. {name} détend les épaules.'],
        prompt: '« …Tu es tenace. Pourquoi ? »',
        choices: [
          {
            text: 'Par habitude.',
            tone: 'direct',
            reaction: 'Elle lève un sourcil, déçue.',
          },
          {
            text: 'Parce que tu vaux la peine qu\'on te connaisse.',
            tone: 'sincere',
            reaction: '{name} laisse échapper un souffle plus doux.',
          },
          {
            text: 'Parce que je m\'en fiche.',
            tone: 'playful',
            reaction: 'Fin de discussion.',
          },
          {
            text: 'Parce que tu me manquerais.',
            tone: 'romantic',
            reaction: 'Elle rougit imperceptiblement sous son armure.',
          },
        ],
      },
    ],
  ),
  S(
    'kitchen-taste',
    'Four chaud',
    1,
    5,
    ['playful', 'sincere', 'playful'],
    [
      {
        context: [
          '{place} sent le cumin et le pain chaud.',
          '{name} sort un plat du four, fière.',
        ],
        prompt: '« Goûte ça — et dis la vérité, hein ! »',
        choices: [
          {
            text: 'C\'est… brûlé. Désolé.',
            tone: 'direct',
            reaction: 'Elle grimace. « Au moins tu es honnête. »',
          },
          {
            text: 'C\'est bon ! Tu m\'apprendras la recette ?',
            tone: 'sincere',
            reaction: '{name} rayonne. « C\'est un deal. »',
          },
          {
            text: 'Encore mieux que la dernière fois — et j\'ai faim.',
            tone: 'playful',
            reaction: 'Elle rit et te sert une double portion.',
          },
          {
            text: 'Bon comme toi, alors.',
            tone: 'romantic',
            reaction: 'Elle rougit, puis te pousse l\'assiette.',
          },
        ],
      },
      {
        context: ['Vous mangez côte à côte sur le plan de travail.'],
        prompt: '« La cuisine réunit les gens… Tu en fais partie, maintenant. »',
        choices: [
          {
            text: 'Je passais juste manger.',
            tone: 'direct',
            reaction: 'Elle fronce les sourcils, blessée.',
          },
          {
            text: 'J\'aime être ici avec toi.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, émue.',
          },
          {
            text: 'Alors je suis officiellement adopté ?',
            tone: 'playful',
            reaction: '« Avec des corvées de plonge », plaisante-t-elle.',
          },
          {
            text: 'Alors garde-moi une place chaque soir.',
            tone: 'romantic',
            reaction: '« Toujours », promet-elle.',
          },
        ],
      },
      {
        context: ['Les assiettes sont vides. {name} essuie ses mains.'],
        prompt: '« Repars le ventre plein, au moins ? »',
        choices: [
          {
            text: 'Oui. Merci pour ce repas.',
            tone: 'sincere',
            reaction: 'Elle te sert un thé en souriant.',
          },
          {
            text: 'Je repars avec un doggy bag — et ton numéro ?',
            tone: 'playful',
            reaction: 'Elle rit. « Le numéro, c\'est « viens demain ». »',
          },
          {
            text: 'Non, j\'ai encore du travail.',
            tone: 'direct',
            reaction: '« À demain, alors », dit-elle.',
          },
          {
            text: 'Seulement si tu m\'embrasses sur la joue.',
            tone: 'romantic',
            reaction: 'Elle rougit et te donne une petite tape.',
          },
        ],
      },
    ],
  ),
  S(
    'market-deal',
    'Comptoir complice',
    1,
    5,
    ['direct', 'playful', 'direct'],
    [
      {
        context: [
          '{place} bourdonne de voix et de pièces.',
          '{name} compte des rubans derrière l\'étal.',
        ],
        prompt: '« Toi ! Tu as l\'air de quelqu\'un qui sait négocier… Un conseil ? »',
        choices: [
          {
            text: 'Ne montre jamais que tu veux vraiment l\'objet.',
            tone: 'direct',
            reaction: '{name} sourit en coin. « Noté. »',
          },
          {
            text: 'Offre la moitié, puis fais semblant de partir.',
            tone: 'playful',
            reaction: '« Tu es dangereux », rit-elle.',
          },
          {
            text: 'Sois honnête. Les gens le sentent.',
            tone: 'sincere',
            reaction: '« Trop mou pour le marché », taquine-t-elle.',
          },
          {
            text: 'Négocie avec un sourire — comme le tien.',
            tone: 'romantic',
            reaction: 'Elle roule des yeux, amusée.',
          },
        ],
      },
      {
        context: ['{name} te montre une pierre qui brille faiblement.'],
        prompt: '« Tu parierais sur moi si j\'ouvrais mon propre étal ? »',
        choices: [
          {
            text: 'Oui. Et je serais ton premier client.',
            tone: 'direct',
            reaction: '« Marché conclu », dit-elle, sérieuse.',
          },
          {
            text: 'Seulement si tu me fais un prix d\'ami.',
            tone: 'playful',
            reaction: '« Greedy », dit-elle en riant.',
          },
          {
            text: 'Je crois en toi, peu importe le risque.',
            tone: 'sincere',
            reaction: 'Elle hoche la tête, touchée.',
          },
          {
            text: 'Je parierais mon cœur.',
            tone: 'romantic',
            reaction: '« Trop tôt pour les métaphores », répond-elle.',
          },
        ],
      },
      {
        context: ['La foule se calme. {name} ferme sa caisse.'],
        prompt: '« Bonne journée… ou tu restes pour compter les pièces avec moi ? »',
        choices: [
          {
            text: 'Je reste. Deux paires d\'yeux comptent mieux.',
            tone: 'direct',
            reaction: 'Elle te tend une plume et un registre.',
          },
          {
            text: 'Je reste si le dîner est inclus.',
            tone: 'playful',
            reaction: '« Tu négocies encore », soupire-t-elle, ravie.',
          },
          {
            text: 'Je dois y aller. À demain.',
            tone: 'sincere',
            reaction: '« À demain, partenaire », dit-elle.',
          },
          {
            text: 'Partout où tu es, j\'ai envie d\'être.',
            tone: 'romantic',
            reaction: 'Elle détourne le regard, souriante.',
          },
        ],
      },
    ],
  ),
  S(
    'garden-dew',
    'Rosée du jardin',
    1,
    4,
    ['sincere', 'romantic', 'sincere'],
    [
      {
        context: [
          'La brume du matin accroche les pétales.',
          '{name} cueille des herbes dans {place}.',
        ],
        prompt: '« Tu entends le jardin respirer ? …Ou c\'est juste moi, bizarre ? »',
        choices: [
          {
            text: 'Je l\'entends aussi. C\'est apaisant.',
            tone: 'sincere',
            reaction: '{name} sourit, soulagée.',
          },
          {
            text: 'C\'est le vent, pas le jardin — mais j\'aime ton idée.',
            tone: 'direct',
            reaction: 'Elle fronce les sourcils, un peu vexée.',
          },
          {
            text: 'Le jardin dit : « Iris est mignonne ».',
            tone: 'playful',
            reaction: 'Elle rit et te lance une pétale.',
          },
          {
            text: 'Tout est plus beau quand tu es là.',
            tone: 'romantic',
            reaction: 'Elle rougit, les joues comme les fleurs.',
          },
        ],
      },
      {
        context: ['{name} te tend une fleur bleu pâle.'],
        prompt: '« Elle fane vite… comme certains moments. Tu la gardes ? »',
        choices: [
          {
            text: 'Oui. Je la mettrai dans un livre.',
            tone: 'sincere',
            reaction: '« Comme un souvenir », murmure-t-elle.',
          },
          {
            text: 'Les fleurs, c\'est du gaspillage.',
            tone: 'direct',
            reaction: 'Elle referme la main, peinée.',
          },
          {
            text: 'Je la garde si tu m\'apprends son nom.',
            tone: 'playful',
            reaction: '« Brume de lune », dit-elle doucement.',
          },
          {
            text: 'Je garderai surtout le moment avec toi.',
            tone: 'romantic',
            reaction: 'Elle incline la tête, touchée.',
          },
        ],
      },
      {
        context: ['Le soleil perce enfin la brume.'],
        prompt: '« On se revoit demain… si tu veux marcher ici encore ? »',
        choices: [
          {
            text: 'Oui. Même heure, même sentier.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, rayonnante.',
          },
          {
            text: 'Seulement si tu prépares une couronne de fleurs.',
            tone: 'playful',
            reaction: '« Exigeant », dit-elle en souriant.',
          },
          {
            text: 'Peut-être. Je ne sais pas encore.',
            tone: 'direct',
            reaction: 'Elle masque sa déception.',
          },
          {
            text: 'Chaque matin avec toi, c\'est un cadeau.',
            tone: 'romantic',
            reaction: 'Elle prend ta main une seconde.',
          },
        ],
      },
    ],
  ),
  S(
    'apology',
    'Faux pas',
    2,
    5,
    ['sincere', 'sincere', 'direct'],
    [
      {
        context: [
          'L\'air est tendu. Tu as dit quelque chose de mal tout à l\'heure.',
          '{name} reste un peu plus loin que d\'habitude.',
        ],
        prompt: '« …J\'ai dit quelque chose de mal tout à l\'heure. Désolée. »',
        choices: [
          {
            text: 'Moi aussi. J\'aurais dû mieux choisir mes mots.',
            tone: 'sincere',
            reaction: '{name} relâche les épaules.',
          },
          {
            text: 'On fait semblant que rien ne s\'est passé ?',
            tone: 'playful',
            reaction: '« Pas si vite », dit-elle, mais elle sourit.',
          },
          {
            text: 'Dis-moi franchement ce qui t\'a blessée.',
            tone: 'direct',
            reaction: 'Elle te regarde enfin dans les yeux.',
          },
          {
            text: 'Tant que tu es là, je pardonne tout.',
            tone: 'romantic',
            reaction: 'Trop rapide — elle préfère la sincérité.',
          },
        ],
      },
      {
        context: ['{name} joue avec un ruban, nerveuse.'],
        prompt: '« Pourquoi tu restes avec moi, après ça ? »',
        choices: [
          {
            text: 'Parce que tu comptes pour moi.',
            tone: 'sincere',
            reaction: 'Sa voix tremble un peu. « Merci. »',
          },
          {
            text: 'Parce que personne n\'est parfait.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, acceptant.',
          },
          {
            text: 'Parce que tu me dois encore une revanche aux cartes.',
            tone: 'playful',
            reaction: 'Elle rit malgré elle.',
          },
          {
            text: 'Parce que je t\'aime bien, tout simplement.',
            tone: 'romantic',
            reaction: 'Elle rougit, puis acquiesce.',
          },
        ],
      },
      {
        context: ['Le silence revient, plus doux cette fois.'],
        prompt: '« On est quittes… et amis, j\'espère ? »',
        choices: [
          {
            text: 'Amis. Et plus si tu le veux un jour.',
            tone: 'romantic',
            reaction: 'Elle sourit sans répondre — c\'est déjà oui.',
          },
          {
            text: 'Amis. C\'est un deal.',
            tone: 'direct',
            reaction: 'Elle te tape l\'épaule, apaisée.',
          },
          {
            text: 'Amis, oui. Merci d\'avoir parlé.',
            tone: 'sincere',
            reaction: '{name} incline la tête, reconnaissante.',
          },
          {
            text: 'Amis — avec droit à un câlin de paix.',
            tone: 'playful',
            reaction: 'Elle te pousse du coude, rieuse.',
          },
        ],
      },
    ],
  ),
  S(
    'night-insomnia',
    'Nuit sans sommeil',
    2,
    5,
    ['sincere', 'playful', 'sincere'],
    [
      {
        context: [
          'Il est tard. Les lanternes du village sont presque éteintes.',
          'Tu croises {name}, encore éveillée.',
        ],
        prompt: '« Insomnie aussi ? …Tu veux t\'asseoir un moment ? »',
        choices: [
          {
            text: 'Oui. J\'ai la tête pleine.',
            tone: 'sincere',
            reaction: '{name} fait de la place sur le banc.',
          },
          {
            text: 'Non, je faisais juste un tour fantôme.',
            tone: 'playful',
            reaction: '« Alors assieds-toi, fantôme », dit-elle.',
          },
          {
            text: 'Je ne peux pas dormir. Point.',
            tone: 'direct',
            reaction: '« Moi non plus », avoue-t-elle.',
          },
          {
            text: 'Seulement si tu me tiens compagnie jusqu\'à l\'aube.',
            tone: 'romantic',
            reaction: 'Elle sourit. « Deal. »',
          },
        ],
      },
      {
        context: ['Vous parlez à voix basse sous les étoiles.'],
        prompt: '« Les nuits blanches… ça creuse des liens bizarres, non ? »',
        choices: [
          {
            text: 'Oui. On dit des choses qu\'on oserait pas le jour.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, pensive.',
          },
          {
            text: 'Surtout qu\'on a faim et qu\'on hallucine.',
            tone: 'playful',
            reaction: 'Elle rit doucement.',
          },
          {
            text: 'Non. C\'est juste fatigue.',
            tone: 'direct',
            reaction: 'Le moment retombe un peu.',
          },
          {
            text: 'Comme maintenant, avec toi.',
            tone: 'romantic',
            reaction: 'Elle détourne le regard, souriante.',
          },
        ],
      },
      {
        context: ['L\'aube commence à griser l\'horizon.'],
        prompt: '« Dors un peu… je veillerai si tu veux. »',
        choices: [
          {
            text: 'Merci. Toi aussi, repose-toi après.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, apaisée.',
          },
          {
            text: 'Seulement si tu me racontes une dernière blague.',
            tone: 'playful',
            reaction: 'Elle en invente une affreuse — parfait.',
          },
          {
            text: 'Non, j\'ai tenu. Je vais bien.',
            tone: 'direct',
            reaction: '« Stubborn », murmure-t-elle, admirative.',
          },
          {
            text: 'Dors avec moi sur l\'épaule — métaphoriquement.',
            tone: 'romantic',
            reaction: 'Elle rougit et pose sa veste sur tes genoux.',
          },
        ],
      },
    ],
  ),
  S(
    'secret-trust',
    'Confiance fragile',
    3,
    5,
    ['sincere', 'direct', 'sincere'],
    [
      {
        context: [
          '{name} t\'a entraîné dans un recoin calme de {place}.',
          'Sa voix est basse.',
        ],
        prompt: '« Promets-moi que ça reste entre nous. »',
        choices: [
          {
            text: 'Je te le promets. Tu peux me faire confiance.',
            tone: 'sincere',
            reaction: '{name} expire, soulagée.',
          },
          {
            text: 'Depends… c\'est un secret juicy ?',
            tone: 'playful',
            reaction: '« Ce n\'est pas un jeu », dit-elle, sévère.',
          },
          {
            text: 'Dis-moi d\'abord de quoi il s\'agit.',
            tone: 'direct',
            reaction: 'Elle hésite, puis commence à parler.',
          },
          {
            text: 'Pour toi, je garderais n\'importe quoi.',
            tone: 'romantic',
            reaction: 'Elle préfère une promesse simple.',
          },
        ],
      },
      {
        context: ['{name} te confie une peur qu\'elle n\'a jamais dite.'],
        prompt: '« Si tu savais ce que je cache… tu partirais ? »',
        choices: [
          {
            text: 'Non. Je reste.',
            tone: 'sincere',
            reaction: 'Ses yeux brillent de gratitude.',
          },
          {
            text: 'Dis tout. Je peux encaisser.',
            tone: 'direct',
            reaction: 'Elle continue, la voix plus ferme.',
          },
          {
            text: 'Seulement si c\'est un secret de super-héros.',
            tone: 'playful',
            reaction: 'Elle ne rit pas — mauvais moment.',
          },
          {
            text: 'Rien ne pourrait me faire partir.',
            tone: 'romantic',
            reaction: 'Elle prend ta main une seconde.',
          },
        ],
      },
      {
        context: ['Le secret est dit. Le poids semble plus léger.'],
        prompt: '« Mon secret est en sécurité avec toi ? »',
        choices: [
          {
            text: 'Oui. Toujours.',
            tone: 'sincere',
            reaction: '{name} incline la tête, reconnaissante.',
          },
          {
            text: 'Tu peux compter sur moi.',
            tone: 'direct',
            reaction: '« Merci », murmure-t-elle.',
          },
          {
            text: 'Tant que tu me dois un favori un jour.',
            tone: 'playful',
            reaction: 'Elle sourit enfin. « Marché conclu. »',
          },
          {
            text: 'Comme mon cœur, s\'il est à toi.',
            tone: 'romantic',
            reaction: 'Elle rougit, émue.',
          },
        ],
      },
    ],
  ),
  S(
    'salon-mask',
    'Salon des secrets',
    2,
    5,
    ['romantic', 'direct', 'romantic'],
    [
      {
        context: [
          '{place} brille de cristaux tamisés.',
          '{name} ajuste un masque demi-retiré.',
        ],
        prompt: '« On me dit que je cache trop… Et vous, que voyez-vous ? »',
        choices: [
          {
            text: 'Une personne qui a peur qu\'on l\'aime vraiment.',
            tone: 'sincere',
            reaction: 'Elle reste un instant sans voix.',
          },
          {
            text: 'Quelqu\'un qui aime les drames en trois actes.',
            tone: 'playful',
            reaction: '« Touché », dit-elle avec un sourire en coin.',
          },
          {
            text: 'Quelqu\'un de fort. Point.',
            tone: 'direct',
            reaction: 'Elle incline la tête, satisfaite.',
          },
          {
            text: 'Quelqu\'un que j\'ai envie de connaître sans masque.',
            tone: 'romantic',
            reaction: 'Elle retire lentement le masque.',
          },
        ],
      },
      {
        context: ['La musique lointaine couvre vos voix.'],
        prompt: '« Un jeu : une vérité, une mensonge. Tu commences. »',
        choices: [
          {
            text: 'Vérité : tu m\'intrigues. Mensonge : je m\'en fiche.',
            tone: 'romantic',
            reaction: '{name} sourit. « Bon choix. »',
          },
          {
            text: 'Vérité : je ne comprends pas les règles. Mensonge : je triche.',
            tone: 'playful',
            reaction: 'Elle rit poliment.',
          },
          {
            text: 'Vérité : je te fais confiance. Mensonge : je pars ce soir.',
            tone: 'sincere',
            reaction: '« Intéressant », murmure-t-elle.',
          },
          {
            text: 'Vérité : ce salon m\'ennuie. Mensonge : tu es banale.',
            tone: 'direct',
            reaction: 'Elle fronce les sourcils — mauvais coup.',
          },
        ],
      },
      {
        context: ['Minuit approche. {name} regarde la porte, puis toi.'],
        prompt: '« Partir en silence… ou rester pour un dernier verre ? »',
        choices: [
          {
            text: 'Un verre. Et ton prénom, sans titre.',
            tone: 'romantic',
            reaction: '« Zélie », dit-elle enfin, simplement.',
          },
          {
            text: 'Je reste si tu enlèves le masque.',
            tone: 'direct',
            reaction: 'Elle obéit, les yeux dans les yeux.',
          },
          {
            text: 'Un verre — et pas de secrets cette fois.',
            tone: 'sincere',
            reaction: 'Elle verse le vin en souriant.',
          },
          {
            text: 'Je partage un verre et trois ragots.',
            tone: 'playful',
            reaction: '« Scandaleux », chuchote-t-elle, ravie.',
          },
        ],
      },
    ],
  ),
  S(
    'farm-dawn',
    'Aube à la ferme',
    1,
    5,
    ['sincere', 'playful', 'sincere'],
    [
      {
        context: [
          'Les familiers dormencore dans {place}.',
          '{name} te tend une gourde de lait chaud.',
        ],
        prompt: '« Debout tôt… tu tiens le rythme de la ferme ? »',
        choices: [
          {
            text: 'Pas encore, mais j\'apprends avec toi.',
            tone: 'sincere',
            reaction: '{name} hoche la tête, encouragée.',
          },
          {
            text: 'Seulement si les poussins me saluent.',
            tone: 'playful',
            reaction: 'Elle rit. « Ils te mordillent les orteils, plutôt. »',
          },
          {
            text: 'Je préfère dormir. Honnêtement.',
            tone: 'direct',
            reaction: '« Dommage », dit-elle, mais sans rancune.',
          },
          {
            text: 'Pour toi, je me lève à l\'aube.',
            tone: 'romantic',
            reaction: 'Elle rougit et te pousse vers l\'étable.',
          },
        ],
      },
      {
        context: ['Un palmon curieux te renifle la main.'],
        prompt: '« Il t\'aime… les animaux sentent les bonnes personnes. Et toi ? »',
        choices: [
          {
            text: 'Je les aime. Et je t\'aime bien aussi.',
            tone: 'sincere',
            reaction: '{name} sourit, les yeux brillants.',
          },
          {
            text: 'Je préfère les animaux aux réveils matinaux.',
            tone: 'playful',
            reaction: 'Elle te lance de la paille.',
          },
          {
            text: 'Je suis plutôt team chat.',
            tone: 'direct',
            reaction: '« Team palmon, ici », répond-elle.',
          },
          {
            text: 'Je t\'aime presque autant que lui.',
            tone: 'romantic',
            reaction: 'Elle rougit violemment.',
          },
        ],
      },
      {
        context: ['Le soleil dore les toits. La journée commence.'],
        prompt: '« Reviens demain aider… ou c\'est trop tôt pour toi ? »',
        choices: [
          {
            text: 'Je reviens. Même heure.',
            tone: 'sincere',
            reaction: '{name} te serre brièvement le bras.',
          },
          {
            text: 'Seulement si tu me prépares le petit-déj.',
            tone: 'playful',
            reaction: '« Deal », promet-elle.',
          },
          {
            text: 'On verra. Pas de promesse.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, un peu triste.',
          },
          {
            text: 'Chaque aube avec toi vaut le coup.',
            tone: 'romantic',
            reaction: 'Elle garde ta main une seconde de trop.',
          },
        ],
      },
    ],
  ),
  S(
    'forge-spark',
    'Étincelles douces',
    1,
    4,
    ['direct', 'sincere', 'direct'],
    [
      {
        context: [
          'L\'odeur du métal chaud flotte dans {place}.',
          '{name} essuie ses mains sur un tablier.',
        ],
        prompt: '« Tu déranges pas… tu voulais quoi ? »',
        choices: [
          {
            text: 'Te voir travailler. C\'est impressionnant.',
            tone: 'sincere',
            reaction: 'Elle détourne le regard, flattée.',
          },
          {
            text: 'Une épée légendaire, s\'il vous plaît !',
            tone: 'playful',
            reaction: '« File d\'attente : trois mois », dit-elle.',
          },
          {
            text: 'Rien d\'urgent. Je repasse plus tard.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, soulagée.',
          },
          {
            text: 'Te voir. Point.',
            tone: 'romantic',
            reaction: 'Elle toussote, gênée.',
          },
        ],
      },
      {
        context: ['{name} te montre une pièce à peine refroidie.'],
        prompt: '« Tu parierais ta vie dessus… ou c\'est juste du métal ? »',
        choices: [
          {
            text: 'Je parierais sur ton travail. Toujours.',
            tone: 'sincere',
            reaction: 'Un sourire rare lui échappe.',
          },
          {
            text: 'Du métal. Mais beau métal.',
            tone: 'direct',
            reaction: '« Honnête », dit-elle, satisfaite.',
          },
          {
            text: 'Je parierais mon dîner contre un mini couteau.',
            tone: 'playful',
            reaction: 'Elle rit. « Petit malin. »',
          },
          {
            text: 'Je parierais mon cœur, si tu veux.',
            tone: 'romantic',
            reaction: 'Trop de drama pour elle.',
          },
        ],
      },
      {
        context: ['La forge se calme. {name} pose son marteau.'],
        prompt: '« Bon travail aujourd\'hui… tu reviens quand ? »',
        choices: [
          {
            text: 'Quand tu auras besoin d\'aide.',
            tone: 'direct',
            reaction: '« Je note », dit-elle.',
          },
          {
            text: 'Demain, si tu me laisses souffler le feu.',
            tone: 'playful',
            reaction: 'Elle hoche la tête, amusée.',
          },
          {
            text: 'Dès que tu veux me voir.',
            tone: 'sincere',
            reaction: 'Elle acquiesce, discrète.',
          },
          {
            text: 'Chaque jour où tu es là.',
            tone: 'romantic',
            reaction: 'Elle rougit sous la suie.',
          },
        ],
      },
    ],
  ),
  S(
    'lab-mischief',
    'Fiole et confidences',
    1,
    5,
    ['playful', 'playful', 'direct'],
    [
      {
        context: [
          '{place} pétille de flacons colorés.',
          '{name} te regarde par-dessus des lunettes fumantes.',
        ],
        prompt: '« Double ou rien : si ça explose pas, tu restes me tenir compagnie ? »',
        choices: [
          {
            text: 'Deal. J\'ai confiance en toi.',
            tone: 'playful',
            reaction: '{name} éclate de rire. « Brave. »',
          },
          {
            text: 'Non. Recule d\'abord.',
            tone: 'direct',
            reaction: '« Buzzkill », dit-elle, mais elle recule.',
          },
          {
            text: 'Je reste si tu m\'expliques après.',
            tone: 'sincere',
            reaction: '« Prof », dit-elle, un peu déçue du manque de jeu.',
          },
          {
            text: 'Je reste si tu me dois un baiser si tu perds.',
            tone: 'romantic',
            reaction: '« Pervers », dit-elle en rigolant.',
          },
        ],
      },
      {
        context: ['La mixture vire au violet. Rien n\'explose.'],
        prompt: '« Tu parierais sur moi pour la prochaine expérience ? »',
        choices: [
          {
            text: 'Évidemment. Tu es géniale.',
            tone: 'playful',
            reaction: 'Elle te high-five avec une main gantée.',
          },
          {
            text: 'Seulement si c\'est moins dangereux.',
            tone: 'direct',
            reaction: '« Spoil sport », soupire-t-elle.',
          },
          {
            text: 'Oui. Je crois en toi.',
            tone: 'sincere',
            reaction: 'Elle sourit, touchée.',
          },
          {
            text: 'Je parierais tout ce que j\'ai.',
            tone: 'romantic',
            reaction: '« Dramatic », dit-elle, amusée.',
          },
        ],
      },
      {
        context: ['{name} nettoie la paillasse, soudain calme.'],
        prompt: '« Dessert pour le perdant… qui a perdu, entre nous ? »',
        choices: [
          {
            text: 'Moi. Je t\'offre un gâteau demain.',
            tone: 'sincere',
            reaction: '« Sweet », dit-elle.',
          },
          {
            text: 'Toi. Tu me dois une potion de bonheur.',
            tone: 'playful',
            reaction: '« En préparation », promet-elle.',
          },
          {
            text: 'Match nul. On recommence.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, satisfaite.',
          },
          {
            text: 'Tu me dois un rendez-vous officieux.',
            tone: 'romantic',
            reaction: 'Elle rougit. « On verra. »',
          },
        ],
      },
    ],
  ),
  S(
    'archive-whisper',
    'Alcôve silencieuse',
    2,
    5,
    ['sincere', 'sincere', 'direct'],
    [
      {
        context: [
          'Les archives sentent le cuir et la poussière sacrée.',
          '{name} chuchote malgré l\'absence de monde.',
        ],
        prompt: '« Tu cherche quelque chose… ou quelqu\'un ? »',
        choices: [
          {
            text: 'Quelqu\'un. Toi, en fait.',
            tone: 'sincere',
            reaction: 'Elle détourne le regard, flattée.',
          },
          {
            text: 'Le grimoire interdit. Tu sais où il est ?',
            tone: 'playful',
            reaction: '« Interdit justement », dit-elle, sévère.',
          },
          {
            text: 'Une réponse. Rien de plus.',
            tone: 'direct',
            reaction: '« Alors écoute », dit-elle.',
          },
          {
            text: 'Le plus beau secret de la bibliothèque.',
            tone: 'romantic',
            reaction: 'Elle roule des yeux, amusée.',
          },
        ],
      },
      {
        context: ['{name} te montre un signet ancien.'],
        prompt: '« J\'ai écrit quelque chose… mais je n\'ose pas le montrer. »',
        choices: [
          {
            text: 'Montre-moi. Je ne jugerai pas.',
            tone: 'sincere',
            reaction: 'Elle te tend un poème tremblant.',
          },
          {
            text: 'C\'est sur moi ? J\'espère.',
            tone: 'playful',
            reaction: 'Elle rit nerveusement.',
          },
          {
            text: 'Garde-le. Ce n\'est pas le moment.',
            tone: 'direct',
            reaction: 'Elle referme le carnet, soulagée.',
          },
          {
            text: 'Tout ce que tu écris me touche.',
            tone: 'romantic',
            reaction: 'Elle finit par le montrer.',
          },
        ],
      },
      {
        context: ['Le silence est plein de mots non dits.'],
        prompt: '« Tu reviendras lire avec moi… un autre soir ? »',
        choices: [
          {
            text: 'Oui. Chaque semaine, si tu veux.',
            tone: 'sincere',
            reaction: 'Elle hoche la tête, rayonnante.',
          },
          {
            text: 'Seulement si tu prépares du thé.',
            tone: 'playful',
            reaction: '« Deal », murmure-t-elle.',
          },
          {
            text: 'Peut-être. Je suis occupé.',
            tone: 'direct',
            reaction: 'Elle masque sa déception.',
          },
          {
            text: 'Chaque nuit, si tu m\'attends.',
            tone: 'romantic',
            reaction: 'Elle prend ta main une seconde.',
          },
        ],
      },
    ],
  ),
  S(
    'cascade-trust',
    'Perles de cascade',
    2,
    5,
    ['direct', 'sincere', 'direct'],
    [
      {
        context: [
          'L\'eau gronde derrière {place}.',
          '{name} te tend la main pour franchir les rochers.',
        ],
        prompt: '« Attention, c\'est glissant… Tu me fais confiance ? »',
        choices: [
          {
            text: 'Oui. Vas-y.',
            tone: 'direct',
            reaction: 'Elle te tire, sûre d\'elle.',
          },
          {
            text: 'Seulement si tu me lâches pas.',
            tone: 'sincere',
            reaction: '« Promis », dit-elle, la poigne ferme.',
          },
          {
            text: 'Je préfère nager. Blague.',
            tone: 'playful',
            reaction: 'Elle roule des yeux en souriant.',
          },
          {
            text: 'Je te fais confiance les yeux fermés.',
            tone: 'romantic',
            reaction: 'Elle serre plus fort ta main.',
          },
        ],
      },
      {
        context: ['Vous êtes de l\'autre côté. {name} observe la cascade.'],
        prompt: '« Peu de gens viennent ici… pourquoi toi ? »',
        choices: [
          {
            text: 'Parce que tu es venue. C\'est assez.',
            tone: 'sincere',
            reaction: 'Elle hoche la tête, touchée.',
          },
          {
            text: 'Pour le loot secret. Évidemment.',
            tone: 'playful',
            reaction: '« Pas de loot », dit-elle, sévère.',
          },
          {
            text: 'Par curiosité. Rien de plus.',
            tone: 'direct',
            reaction: '« Honnête », dit-elle.',
          },
          {
            text: 'Pour être seul au monde avec toi.',
            tone: 'romantic',
            reaction: 'Elle détourne le regard, souriante.',
          },
        ],
      },
      {
        context: ['La brume d\'eau refroidit l\'air.'],
        prompt: '« On retourne au village… ensemble ? »',
        choices: [
          {
            text: 'Ensemble. Devancé par personne.',
            tone: 'direct',
            reaction: 'Elle hoche la tête, satisfaite.',
          },
          {
            text: 'Oui. Et lentement, cette fois.',
            tone: 'sincere',
            reaction: 'Elle ralentit le pas pour toi.',
          },
          {
            text: 'Course ! Dernier arrivé paie à boire.',
            tone: 'playful',
            reaction: 'Elle sprinte en riant.',
          },
          {
            text: 'Main dans la main, si tu oses.',
            tone: 'romantic',
            reaction: 'Elle entrelace ses doigts aux tiens.',
          },
        ],
      },
    ],
  ),
  S(
    'atelier-thread',
    'Fil de confiance',
    2,
    5,
    ['romantic', 'sincere', 'romantic'],
    [
      {
        context: [
          '{place} est un fouillis de soie et de patrons.',
          '{name} coud une fin de ruban, les doigts habiles.',
        ],
        prompt: '« Tu trouves ça vain… ou beau, ce que je fais ? »',
        choices: [
          {
            text: 'Beau. Chaque point compte.',
            tone: 'sincere',
            reaction: '{name} sourit, les yeux doux.',
          },
          {
            text: 'Vain. Sauf sur toi.',
            tone: 'playful',
            reaction: 'Elle rit. « Charmeur. »',
          },
          {
            text: 'Utile ou pas, peu importe.',
            tone: 'direct',
            reaction: 'Elle fronce les sourcils.',
          },
          {
            text: 'Beau comme toi quand tu te concentres.',
            tone: 'romantic',
            reaction: 'Elle rougit et pique son doigt.',
          },
        ],
      },
      {
        context: ['{name} mesure un ruban contre ton épaule — « pour un manteau ».'],
        prompt: '« Tu resterais immobile encore un peu… ou tu as peur qu\'on rapproche trop ? »',
        choices: [
          {
            text: 'Je reste. J\'ai confiance en toi.',
            tone: 'sincere',
            reaction: 'Elle hoche la tête, apaisée.',
          },
          {
            text: 'J\'ai peur que tu me fasses un nœud papillon.',
            tone: 'playful',
            reaction: 'Elle rit doucement.',
          },
          {
            text: 'Rapproche. Je ne bouge pas.',
            tone: 'direct',
            reaction: 'Elle préfère la douceur.',
          },
          {
            text: 'Rapproche autant que tu veux.',
            tone: 'romantic',
            reaction: 'Elle laisse le ruban glisser, les joues roses.',
          },
        ],
      },
      {
        context: ['{name} coupe le fil. L\'œuvre est finie pour ce soir.'],
        prompt: '« Reviens demain… je te montrerai le résultat ? »',
        choices: [
          {
            text: 'Oui. J\'ai hâte.',
            tone: 'sincere',
            reaction: 'Elle emballe déjà le tissu pour toi.',
          },
          {
            text: 'Seulement si c\'est une surprise.',
            tone: 'playful',
            reaction: '« Scellé », promet-elle.',
          },
          {
            text: 'Envoie-moi un message. Je passerai.',
            tone: 'direct',
            reaction: 'Elle hoche la tête.',
          },
          {
            text: 'Reviens plutôt me chercher.',
            tone: 'romantic',
            reaction: 'Elle rougit. « Peut-être. »',
          },
        ],
      },
    ],
  ),
]

export const SCENARIO_COUNT = SCENARIO_SCRIPTS.length
