import type { CompanionScenarioSeed } from './types'

/** Scénarios courts pour nouveaux compagnons (fallback avant corpus V2 complet). */
export const STARTER_CORPUS_PACKS: Record<string, CompanionScenarioSeed[]> = {
  brann: [
    {
      id: 'brann-forge-accueil',
      title: 'Premier marteau partagé',
      minAffinity: 1,
      maxAffinity: 5,
      roundToneHints: ['sincere', 'direct', 'sincere'],
      rounds: [
        {
          context: [
            'La forge vibre doucement. Brann polit une lame sans regarder.',
            'Ses joints de pierre grincent quand il te remarque.',
          ],
          prompt: 'Tu viens pour le métal… ou pour voir si un golem sait écouter ?',
          choices: [
            {
              text: 'Je veux apprendre comment tu travailles, pas te juger.',
              tone: 'sincere',
              reaction: 'Alors observe. Je frappe lentement — la précision vaut mieux que la vitesse.',
            },
            {
              text: 'Un golem qui écoute ? Ça existe vraiment dans ce village ?',
              tone: 'playful',
              reaction: 'Existe. Mais je ne promets pas de sourire à chaque plaisanterie.',
            },
            {
              text: 'Montre-moi la lame. Je verrai si elle tient le havre.',
              tone: 'direct',
              reaction: 'Direct. Bien. Cette arête peut supporter deux fois ton poids — teste si tu doutes.',
            },
            {
              text: 'Ta forge réchauffe le village. Merci pour ça.',
              tone: 'romantic',
              reaction: '…Je ne sais pas répondre à la chaleur. Mais je la garde allumée pour vous.',
            },
          ],
        },
        {
          context: [
            'Il pose le marteau et tend une petite plaque gravée.',
            'Ton nom y est écrit — grossier mais sincère.',
          ],
          prompt: 'Les humains offrent des cadeaux. Je fabrique des preuves. Accepte-la ?',
          choices: [
            {
              text: 'Oui. C’est la plus belle chose qu’on m’a offerte ici.',
              tone: 'sincere',
              reaction: 'Alors je la signe. Brann — artisan du havre. Pas seulement « le golem ».',
            },
            {
              text: 'Tu signes comme un roi. J’adore.',
              tone: 'playful',
              reaction: 'Pas un roi. Un artisan. Mais je note que tu aimes le spectacle.',
            },
            {
              text: 'Si elle tient dans ma poche, je la garde.',
              tone: 'direct',
              reaction: 'Elle tiendra. J’ai testé la chute trois fois.',
            },
            {
              text: 'Ton nom avec le mien… ça sonne comme un lien.',
              tone: 'romantic',
              reaction: '…Les liens chauffent plus que le fer. Je commence à comprendre pourquoi.',
            },
          ],
        },
        {
          context: [
            'Le feu décroît. Brann referme la forge pour la nuit.',
          ],
          prompt: 'Reviens quand tu auras besoin de solidité. Je serai là — immobile, mais présent.',
          choices: [
            {
              text: 'Ta présence calme déjà le village.',
              tone: 'sincere',
              reaction: 'Alors je reste. Le havre mérite des fondations qui ne tremblent pas.',
            },
            {
              text: 'Immobile ? Tu bouges quand on te taquine, quand même.',
              tone: 'playful',
              reaction: '…Peut-être. Ne le répète pas aux autres pierres.',
            },
            {
              text: 'Compté. J’aurai besoin de toi pour le prochain bâtiment.',
              tone: 'direct',
              reaction: 'Prépare les plans. Je prépare l’acier.',
            },
            {
              text: 'Présent… c’est exactement ce que j’espérais entendre.',
              tone: 'romantic',
              reaction: 'Je n’ai pas de cœur battant. Mais quelque chose répond, quand tu dis ça.',
            },
          ],
        },
      ],
    },
  ],
  thorne: [
    {
      id: 'thorne-echelle-savoir',
      title: 'L’échelle du savoir',
      minAffinity: 1,
      maxAffinity: 5,
      roundToneHints: ['sincere', 'playful', 'sincere'],
      rounds: [
        {
          context: [
            'Thorne lit un grimoire ouvert sur trois étagères simultanément.',
            'Ses écailles bronze captent la lueur des chandelles.',
          ],
          prompt: 'Un visiteur ? Parfait — dis-moi : tu préfères les dragons qui brûlent ou ceux qui expliquent ?',
          choices: [
            {
              text: 'Ceux qui expliquent. Le havre n’a pas besoin de flammes.',
              tone: 'sincere',
              reaction: 'Sage réponse. Les flammes fatiguent les parchemins… et les amitiés.',
            },
            {
              text: 'Les deux, si le spectacle est bon.',
              tone: 'playful',
              reaction: 'Théâtre et bibliothèque — Kael serait fier. Moi, je note ton audace.',
            },
            {
              text: 'Montre-moi le livre le plus utile, pas le plus joli.',
              tone: 'direct',
              reaction: 'Ce registre des Myrions locaux. Utile, sec, indispensable.',
            },
            {
              text: 'Un dragonkin bibliothécaire, c’est mon type de légende.',
              tone: 'romantic',
              reaction: 'Légende ? Je suis un érudit fatigué. Mais… merci pour la flatterie.',
            },
          ],
        },
        {
          context: [
            'Il glisse une échelle de lecture vers toi — marques anciennes.',
          ],
          prompt: 'Chaque marque = une question résolue. Veux-tu ajouter la tienne ?',
          choices: [
            {
              text: 'Oui. Ma question : comment garder ce havre paisible ?',
              tone: 'sincere',
              reaction: 'La paix se cultive. Je grave ta question — nous y travaillerons ensemble.',
            },
            {
              text: 'Je signe avec un doodle de Myrion.',
              tone: 'playful',
              reaction: 'Un doodle ! …Bon. Les Myrions apprécient l’humour, apparemment.',
            },
            {
              text: 'Seulement si ça compte vraiment dans l’archive.',
              tone: 'direct',
              reaction: 'Tout compte. Même les questions qui semblent simples.',
            },
            {
              text: 'Avec toi, chaque marque raconte une histoire.',
              tone: 'romantic',
              reaction: 'Les histoires chauffent mieux qu’un feu de camp. Je commence à le croire.',
            },
          ],
        },
        {
          context: [
            'La bibliothèque se tait. Thorne referme le grimoire le plus haut.',
          ],
          prompt: 'Reviens quand tu auras une énigme — ou juste une pause entre deux pages.',
          choices: [
            {
              text: 'Les pauses avec toi valent une quête complète.',
              tone: 'sincere',
              reaction: 'Alors je garde une chaise libre. Et une lampe allumée.',
            },
            {
              text: 'Promis : pas de grimoire interdit cette fois.',
              tone: 'playful',
              reaction: '…Cette fois. Je surveille quand même.',
            },
            {
              text: 'J’aurai une énigme. Prépare la réponse.',
              tone: 'direct',
              reaction: 'Toujours. C’est mon travail — et maintenant, une partie de mon plaisir.',
            },
            {
              text: 'Une pause, une page, et peut-être un sourire.',
              tone: 'romantic',
              reaction: 'Les dragonkins sourient rarement. Mais tu progresses, visiteur.',
            },
          ],
        },
      ],
    },
  ],
  nyx: [
    {
      id: 'nyx-phalene-brume',
      title: 'Phalène dans la brume',
      minAffinity: 1,
      maxAffinity: 5,
      roundToneHints: ['sincere', 'playful', 'romantic'],
      rounds: [
        {
          context: [
            'Des poussières lumineuses flottent entre les fougères.',
            'Nyx descend d’une branche — manteau de phalène, yeux doux.',
          ],
          prompt: 'Tu ne devrais pas marcher seul dans la brume… ou tu cherches quelqu’un qui y voit clair ?',
          choices: [
            {
              text: 'Je cherchais la calme. Tu sembles en être la gardienne.',
              tone: 'sincere',
              reaction: 'La calme… oui. Je la protège comme Iris protège ses racines.',
            },
            {
              text: 'La brume cache les embarrassants. Parfait pour moi.',
              tone: 'playful',
              reaction: 'Tu plaisantes, mais la brume pardonne. Je peux faire pareil.',
            },
            {
              text: 'Guide-moi. Je ne connais pas chaque sentier.',
              tone: 'direct',
              reaction: 'Suis mes lueurs. Elles ne mentent jamais — contrairement aux lucioles vaniteuses.',
            },
            {
              text: 'Quelqu’un qui voit clair dans la brume… c’est rare.',
              tone: 'romantic',
              reaction: 'Rare, oui. Mais pas impossible à trouver, si tu restes.',
            },
          ],
        },
        {
          context: [
            'Elle offre une fleur de nuit — pollen pâle, sans parfum agressif.',
          ],
          prompt: 'Les fées-lunes offrent des fleurs qu’on ne cueille qu’une fois. Tu comprends ?',
          choices: [
            {
              text: 'Je comprends. Je la garderai sans la montrer à tout le village.',
              tone: 'sincere',
              reaction: 'Merci. Certains secrets sont des cadeaux, pas des trophées.',
            },
            {
              text: 'Une fois ? Alors je la mange avant que tu changes d’avis.',
              tone: 'playful',
              reaction: 'Ne la mange pas ! …Mais ton énergie me fait sourire.',
            },
            {
              text: 'Je la plante près du jardin. Elle y sera utile.',
              tone: 'direct',
              reaction: 'Pratique et respectueux. Iris approuvera.',
            },
            {
              text: 'Une fleur unique pour un moment unique avec toi.',
              tone: 'romantic',
              reaction: '…Tu parles comme les contes. Je n’y suis pas opposée.',
            },
          ],
        },
        {
          context: [
            'La brume se lève. Les étoiles percent à travers.',
          ],
          prompt: 'Quand la nuit revient, cherche mes lueurs. Je guiderai — sans bruit.',
          choices: [
            {
              text: 'Sans bruit, sans stress. Exactement ce dont j’avais besoin.',
              tone: 'sincere',
              reaction: 'Le havre grandit quand on y respire. Je t’aiderai à respirer.',
            },
            {
              text: 'Des lueurs qui dansent — comme une fête silencieuse.',
              tone: 'playful',
              reaction: 'Fête silencieuse… j’aime ce nom. Je le garde.',
            },
            {
              text: 'Compté. Je reviendrai avant que la brume épaisse.',
              tone: 'direct',
              reaction: 'Je t’attendrai au premier panneau de mousse.',
            },
            {
              text: 'Guider sans bruit… comme un lien qui se tisse doucement.',
              tone: 'romantic',
              reaction: 'Les liens doux durent. Je crois que le nôtre peut durer.',
            },
          ],
        },
      ],
    },
  ],
  marin: [
    {
      id: 'marin-maree-accueil',
      title: 'Maree d accueil',
      minAffinity: 1,
      maxAffinity: 5,
      roundToneHints: ['sincere', 'playful', 'sincere'],
      rounds: [
        {
          context: [
            'La source claire miroite. Marin sort la tête de l’eau — corail sur les épaules.',
            'Sa voix porte le bruit doux des vagues lointaines.',
          ],
          prompt: 'Terrien ! Tu n’as pas l’air perdu. Tu cherches la source… ou un ami des marées ?',
          choices: [
            {
              text: 'Un havre sans mer avait besoin d’un peu d’océan.',
              tone: 'sincere',
              reaction: 'J’ai entendu. Alors je viens — pas pour conquérir, pour partager.',
            },
            {
              text: 'Perdu ? Je suis un pro de l’exploration… en théorie.',
              tone: 'playful',
              reaction: 'Théorie acceptable. La pratique commence par ne pas glisser sur les algues.',
            },
            {
              text: 'Je veux comprendre comment ta magie nourrit la source.',
              tone: 'direct',
              reaction: 'Simple : respect. L’eau donne si on ne la prend pas en otage.',
            },
            {
              text: 'Un ami des marées avec ce sourire… c’est tentant.',
              tone: 'romantic',
              reaction: 'Tentant et salé. Prépare-toi à des compliments qui mouillent.',
            },
          ],
        },
        {
          context: [
            'Il tend une perle tiède — reflets corail et mana.',
          ],
          prompt: 'Les merfolks offrent des perles aux gens qui écoutent la marée. Tu écoutes ?',
          choices: [
            {
              text: 'Je ferme les yeux. La marée parle doucement.',
              tone: 'sincere',
              reaction: 'Tu entends vraiment. La perle te choisit autant que tu la choisis.',
            },
            {
              text: 'La marée dit : « Marin est cool. »',
              tone: 'playful',
              reaction: 'La marée flatteuse aujourd’hui ! Je transmettrai le message.',
            },
            {
              text: 'Je préfère les preuves utiles aux symboles.',
              tone: 'direct',
              reaction: 'Cette perle stabilise la mana locale. Utile, pas décorative.',
            },
            {
              text: 'J’écoute… et je regarde tes reflets en même temps.',
              tone: 'romantic',
              reaction: 'Double attention. Les marées apprécient — moi aussi.',
            },
          ],
        },
        {
          context: [
            'Le soleil décline. Marin replonge partiellement, sans quitter le bord.',
          ],
          prompt: 'Reviens quand la lune tire l’eau. Je raconterai les havres sous-marins — sans t’y forcer.',
          choices: [
            {
              text: 'Des histoires sans forcer… parfait pour ce village.',
              tone: 'sincere',
              reaction: 'Le havre des Brumes m’a accueilli ainsi. Je rends la pareille.',
            },
            {
              text: 'Sous-marins ? J’apporte un tuba comique.',
              tone: 'playful',
              reaction: 'Apporte plutôt des biscuits. Les poissons ne partagent pas toujours.',
            },
            {
              text: 'À la prochaine marée haute. Compté.',
              tone: 'direct',
              reaction: 'Compté. Je lirai la marée pour ton heure.',
            },
            {
              text: 'Des histoires, la lune, et toi — j’attends déjà.',
              tone: 'romantic',
              reaction: 'Alors la prochaine marée sera plus lumineuse. Promis.',
            },
          ],
        },
      ],
    },
  ],
  korren: [
    {
      id: 'korren-piste-accueil',
      title: 'Première piste au crépuscule',
      minAffinity: 1,
      maxAffinity: 5,
      roundToneHints: ['playful', 'sincere', 'direct'],
      rounds: [
        {
          context: [
            'Korren s appuie contre un chêne — oreilles mobiles, sourire en coin.',
            'La lisière sent la mousse et le pain chaud du village.',
          ],
          prompt: 'Tu as l air perdu… ou tu cherches juste une excuse pour flâner ?',
          choices: [
            {
              text: 'Flâner, oui. J en ai assez des mondes qui me pressent.',
              tone: 'sincere',
              reaction: 'Alors tu es au bon havre. Ici, flâner est une quête valide.',
            },
            {
              text: 'Perdu ? Moi ? Je connais trois raccourcis vers la soupe de Nami.',
              tone: 'playful',
              reaction: 'Trois ? Montre-en un. Le quatrième mène aux Myrions qui font la sieste.',
            },
            {
              text: 'Dis-moi où mène la piste la plus sûre.',
              tone: 'direct',
              reaction: 'Vers le village. Toujours. Les failles Disagrea, elles, ont leurs propres panneaux.',
            },
            {
              text: 'Je cherchais une compagnie honnête sur le sentier.',
              tone: 'romantic',
              reaction: '…Honnête, je peux. Romantique, j apprends encore. Marche à côté.',
            },
          ],
        },
        {
          context: [
            'Un Myrion ouvre un œil, puis se rendort. Korren rit doucement.',
          ],
          prompt: 'Ici, même la chasse finit en câlin. Tu te fais à cette idée ?',
          choices: [
            {
              text: 'Oui. C est pour ça que je suis resté.',
              tone: 'sincere',
              reaction: 'Alors je te prête ma carte des siestes. Trésor du havre.',
            },
            {
              text: 'Je préfère les câlins aux timers.',
              tone: 'playful',
              reaction: 'Build meta. On devrait l enseigner à la bibliothèque.',
            },
            {
              text: 'Montre-moi la règle numéro un du havre.',
              tone: 'direct',
              reaction: 'Personne ne punissons ta lenteur. Même quand tu rates un mini-jeu.',
            },
            {
              text: 'Avec toi, l idée me plaît encore plus.',
              tone: 'romantic',
              reaction: 'Alors reviens demain. Les sentiers sont plus doux à deux.',
            },
          ],
        },
        {
          context: [
            'Le crépuscule teint la lisière. Korren marque un arbre d une griffe légère — repère, pas territoire.',
          ],
          prompt: 'Demain, même heure ? Je connais un Myrion qui partage ses biscuits.',
          choices: [
            {
              text: 'Demain, sans timer. Promis.',
              tone: 'sincere',
              reaction: 'Parfait. Le havre fonctionne ainsi — promesses douces, pas contrats.',
            },
            {
              text: 'Biscuits Myrion ? Je suis soldé.',
              tone: 'playful',
              reaction: 'Apporte du thé. Nami approuvera l alliance culinaire.',
            },
            {
              text: 'Noté. Je serai là.',
              tone: 'direct',
              reaction: 'Je t attends. Pas de stress si tu es en retard.',
            },
            {
              text: 'Avec toi, même un biscuit vaut un festin.',
              tone: 'romantic',
              reaction: '…Tu es dangereux pour mon calme. J aime ça.',
            },
          ],
        },
      ],
    },
  ],
}
