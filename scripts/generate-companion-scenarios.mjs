/**
 * Génère 200 scénarios cohérents par compagnon (10 arcs × 20 ambiances).
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/data/conversations/companionScenarios.generated.ts')

export const SCENARIOS_PER_COMPANION = 200
const ARC_COUNT = 10

const AMBIANCES = [
  'Par un matin calme',
  'Au crépuscule',
  'Sous une pluie fine',
  'Par une nuit étoilée',
  'Un dimanche paisible',
  'Après le travail du village',
  'Par une brume légère',
  "Avant l'aube",
  'Par une chaleur douce',
  'Quand le vent souffle',
  'Un soir de festival',
  'Entre deux corvées',
  'Quand tout le monde dort',
  'Par un air frais',
  'Sous des lanternes',
  'Après une longue journée',
  'Par un silence rare',
  'Quand la lune se lève',
  'Un instant volé',
  'Sans prévenir',
]

const COMPANIONS = {
  lyra: { name: 'Lyra', place: 'la bibliothèque', vibe: 'calme et studieuse' },
  maeve: { name: 'Maeve', place: 'le marché des étoiles', vibe: 'maline et directe' },
  seren: { name: 'Seren', place: 'la place du village', vibe: 'digne et réservée' },
  nami: { name: 'Nami', place: 'la cuisine commune', vibe: 'chaleureuse et rieuse' },
  iris: { name: 'Iris', place: 'le jardin des brumes', vibe: 'rêveuse et douce' },
  kael: { name: 'Kael', place: 'le théâtre', vibe: 'théâtral et charmant' },
  runa: { name: 'Runa', place: "l'atelier des rubans", vibe: 'patiente et concrète' },
  solene: { name: 'Solene', place: 'la source claire', vibe: 'spirituelle et tendre' },
  talia: { name: 'Talia', place: 'la lisière de la forêt', vibe: 'audacieuse et spontanée' },
  mira: { name: 'Mira', place: "l'atelier textile", vibe: 'artiste et sensible' },
  asha: { name: 'Asha', place: 'la cascade cachée', vibe: 'protectrice et loyale' },
  elwen: { name: 'Elwen', place: 'les archives féeriques', vibe: 'érudite et discrète' },
  noa: { name: 'Noa', place: 'le laboratoire', vibe: 'malicieuse et vive' },
  sora: { name: 'Sora', place: 'la ferme lunaire', vibe: 'bienveillante et simple' },
  zelie: { name: 'Zelie', place: 'le salon des invités', vibe: 'noble et énigmatique' },
}

function buildArc(v, arc) {
  const n = v.name
  const p = v.place
  const arcs = [
    {
      id: 'visite',
      title: 'Visite imprévue',
      hints: ['sincere', 'playful', 'romantic'],
      rounds: [
        {
          context: [`Tu pousses une porte discrète vers ${p}.`, `${n} sursaute légèrement.`],
          prompt: `« Oh… c'est toi. Je ne t'attendais pas ici. »`,
          choices: [
            { tone: 'sincere', text: "Je passais et j'ai pensé à toi.", reaction: `${n} détend les épaules. « Alors entre. »` },
            { tone: 'playful', text: 'Surprise ! Devine qui a faim de compagnie.', reaction: `${n} sourit malgré elle. « Tu es incorrigible. »` },
            { tone: 'direct', text: "J'ai quelque chose à te demander.", reaction: `« D'accord », dit ${n}, plus sérieuse.` },
            { tone: 'romantic', text: "J'avais envie de te voir. Point.", reaction: `${n} détourne le regard, mais reste.` },
          ],
        },
        {
          context: [`${n} te fait de la place. L'air sent ${v.vibe}.`],
          prompt: `« Pourquoi maintenant ? Qu'est-ce qui t'amène ? »`,
          choices: [
            { tone: 'sincere', text: "Parce que j'aime nos moments à deux.", reaction: `« Moi aussi », murmure ${n}.` },
            { tone: 'playful', text: "Le village m'ennuyait. Tu es plus amusant.", reaction: `${n} rit doucement.` },
            { tone: 'direct', text: 'Des réponses. Pas de poésie.', reaction: `« Alors parle clairement. »` },
            { tone: 'romantic', text: "Parce que c'est ici que j'ai envie d'être.", reaction: `${n} reste un instant sans mot.` },
          ],
        },
        {
          context: ['Le moment s\'allonge, paisible.'],
          prompt: `« Tu restes encore un peu… ou tu repars ? »`,
          choices: [
            { tone: 'sincere', text: "Je reste. Avec toi, c'est mieux.", reaction: `${n} hoche la tête, soulagée.` },
            { tone: 'playful', text: 'Je reste si tu me dois un sourire.', reaction: `« Marché conclu », dit ${n}.` },
            { tone: 'direct', text: 'Je dois y aller. Merci.', reaction: `« Comme tu veux », répond ${n}.` },
            { tone: 'romantic', text: 'Encore un instant… s\'il te plaît.', reaction: `${n} acquiesce sans un mot de plus.` },
          ],
        },
      ],
    },
    {
      id: 'partage',
      title: 'Partage du moment',
      hints: ['sincere', 'playful', 'sincere'],
      rounds: [
        {
          context: [`${n} prépare quelque chose près de ${p}.`, 'Une odeur agréable flotte dans l\'air.'],
          prompt: `« Tu arrives au bon moment. Tu goûtes ? »`,
          choices: [
            { tone: 'sincere', text: 'Volontiers. Ça sent bon.', reaction: `${n} s'illumine.` },
            { tone: 'playful', text: "Seulement si c'est pas épicé à en pleurer.", reaction: `${n} fronce les sourcils en plaisantant.` },
            { tone: 'direct', text: 'Juste un peu. Je ne reste pas longtemps.', reaction: `« Comme tu voudras. »` },
            { tone: 'romantic', text: 'Tout ce que tu offres me va.', reaction: `${n} rougit légèrement.` },
          ],
        },
        {
          context: ['Vous êtes assis côte à côte.'],
          prompt: `« Dis-moi… qu'est-ce qui te fait sourire ces jours-ci ? »`,
          choices: [
            { tone: 'sincere', text: 'Les petites choses. Comme maintenant.', reaction: `${n} sourit à son tour.` },
            { tone: 'playful', text: 'Les blagues nulles du marché.', reaction: `${n} éclate de rire.` },
            { tone: 'direct', text: 'Le progrès du village. Pas le romantisme.', reaction: `« Honnête », approuve ${n}.` },
            { tone: 'romantic', text: 'Des personnes. Une en particulier.', reaction: `${n} baisse les yeux vers sa tasse.` },
          ],
        },
        {
          context: ['Le moment touche à sa fin.'],
          prompt: `« Merci d'être venu. Ça me fait du bien. »`,
          choices: [
            { tone: 'sincere', text: 'Moi aussi. On recommencera.', reaction: `${n} hoche la tête avec chaleur.` },
            { tone: 'playful', text: "Prochaine fois, c'est moi qui invite.", reaction: `« J'attendrai », dit ${n}.` },
            { tone: 'direct', text: 'De rien. À bientôt.', reaction: `${n} incline la tête poliment.` },
            { tone: 'romantic', text: 'Pour toi, toujours.', reaction: `${n} murmure un « merci » à peine audible.` },
          ],
        },
      ],
    },
    {
      id: 'secret',
      title: 'Confidence',
      hints: ['sincere', 'direct', 'sincere'],
      rounds: [
        {
          context: [`${n} semble pensif près de ${p}.`, 'Son regard est ailleurs.'],
          prompt: `« …Tu as une minute ? J'ai besoin de parler. »`,
          choices: [
            { tone: 'sincere', text: "Autant qu'il en faut. Je t'écoute.", reaction: `${n} soupire de soulagement.` },
            { tone: 'playful', text: "Un secret ? J'adore les rumeurs.", reaction: `« Ce n'est pas une blague », dit ${n} sévèrement.` },
            { tone: 'direct', text: 'Vas-y. Je ne juge pas.', reaction: `« Bien », répond ${n}.` },
            { tone: 'romantic', text: "Pour toi, je m'arrête tout.", reaction: `${n} te regarde, touchée.` },
          ],
        },
        {
          context: [`${n} baisse la voix.`],
          prompt: `« Parfois je doute… est-ce que je fais assez pour le village ? »`,
          choices: [
            { tone: 'sincere', text: 'Tu fais plus que tu ne crois.', reaction: `${n} serre les poings, émue.` },
            { tone: 'playful', text: 'Le village tient encore debout. Preuve vivante.', reaction: `${n} sourit faiblement.` },
            { tone: 'direct', text: 'Oui. Et voici pourquoi.', reaction: `${n} écoute attentivement.` },
            { tone: 'romantic', text: 'Pour moi, tu es irremplaçable.', reaction: `${n} détourne le visage.` },
          ],
        },
        {
          context: ['Le silence revient, plus léger.'],
          prompt: `« Merci… de ne pas avoir ri. »`,
          choices: [
            { tone: 'sincere', text: 'Jamais. Ta voix compte.', reaction: `${n} pose une main près de la tienne.` },
            { tone: 'playful', text: 'Rire ? Moi ? Jamais. Enfin… presque.', reaction: `${n} pousse ton épaule en riant.` },
            { tone: 'direct', text: "C'était sérieux. Point.", reaction: `« Je sais », dit ${n}.` },
            { tone: 'romantic', text: 'Tes doutes me touchent aussi.', reaction: `${n} reste près de toi un instant.` },
          ],
        },
      ],
    },
    {
      id: 'promenade',
      title: 'Balade à deux',
      hints: ['playful', 'sincere', 'romantic'],
      rounds: [
        {
          context: [`${n} t'attend près de ${p}.`, 'Le chemin est calme.'],
          prompt: `« Tu viens ? J'ai trouvé un endroit sympa. »`,
          choices: [
            { tone: 'sincere', text: 'Avec plaisir. Montre-moi.', reaction: `${n} sourit et part devant.` },
            { tone: 'playful', text: 'Si tu ralentis pour moi, oui.', reaction: `${n} ralentit en ricanant.` },
            { tone: 'direct', text: "Combien de temps ? J'ai des choses à faire.", reaction: `« Une petite heure. Pas plus. »` },
            { tone: 'romantic', text: "N'importe où, si c'est avec toi.", reaction: `${n} rougit et détourne le regard.` },
          ],
        },
        {
          context: ['Vous marchez côte à côte.'],
          prompt: `« Tu entends ça ? Le village semble si loin. »`,
          choices: [
            { tone: 'sincere', text: "C'est reposant. Merci de m'avoir emmené.", reaction: `${n} hoche la tête.` },
            { tone: 'playful', text: 'Parfait. Personne pour nous déranger.', reaction: `${n} rit.` },
            { tone: 'direct', text: 'Profiter maintenant. Travailler après.', reaction: `« Sage », dit ${n}.` },
            { tone: 'romantic', text: "Avec toi, le bruit du monde s'efface.", reaction: `${n} marche un peu plus près.` },
          ],
        },
        {
          context: ['Il est temps de rebrousser chemin.'],
          prompt: `« On refait ça bientôt ? »`,
          choices: [
            { tone: 'sincere', text: "Oui. J'ai adoré.", reaction: `${n} sourit ouvertement.` },
            { tone: 'playful', text: 'Si tu promets de ne pas me faire courir.', reaction: `« Promis », rit ${n}.` },
            { tone: 'direct', text: "Quand j'aurai le temps.", reaction: `${n} incline la tête.` },
            { tone: 'romantic', text: 'Chaque jour, si tu veux.', reaction: `${n} murmure « d'accord ».` },
          ],
        },
      ],
    },
    {
      id: 'rumeur',
      title: 'Rumeurs du village',
      hints: ['direct', 'playful', 'sincere'],
      rounds: [
        {
          context: [`Des voix lointaines résonnent près de ${p}.`, `${n} fronce les sourcils.`],
          prompt: `« On parle de nous… Tu as entendu ? »`,
          choices: [
            { tone: 'sincere', text: "Peu importe ce qu'ils disent.", reaction: `${n} te regarde, surprise.` },
            { tone: 'playful', text: "J'espère qu'ils disent que je suis charmant.", reaction: `${n} rougit et rit.` },
            { tone: 'direct', text: "Oui. Et je m'en moque.", reaction: `« Fort », approuve ${n}.` },
            { tone: 'romantic', text: 'Qu\'ils parlent. Moi je te vois.', reaction: `${n} reste un instant sans voix.` },
          ],
        },
        {
          context: [`${n} croise les bras.`],
          prompt: `« Ça te gêne… ou pas ? »`,
          choices: [
            { tone: 'sincere', text: 'Seule ton avis compte pour moi.', reaction: `${n} détend les épaules.` },
            { tone: 'playful', text: 'Un peu. Mais ça vaut le coup.', reaction: `${n} sourit malicieusement.` },
            { tone: 'direct', text: 'Non. Next question.', reaction: `${n} rit.` },
            { tone: 'romantic', text: 'Gêne-moi encore. Avec toi.', reaction: `${n} détourne le visage, rouge.` },
          ],
        },
        {
          context: ['Les rumeurs s\'éloignent.'],
          prompt: `« …Merci de ne pas fuir. »`,
          choices: [
            { tone: 'sincere', text: 'Je ne fuirai pas.', reaction: `${n} hoche la tête, apaisée.` },
            { tone: 'playful', text: 'Fuir ? Moi ? Je reviens demain.', reaction: `${n} éclate de rire.` },
            { tone: 'direct', text: "Ce n'était pas une option.", reaction: `« Je sais », dit ${n}.` },
            { tone: 'romantic', text: 'Reste avec moi ce soir.', reaction: `${n} acquiesce doucement.` },
          ],
        },
      ],
    },
    {
      id: 'entrainement',
      title: 'Entraînement commun',
      hints: ['direct', 'sincere', 'playful'],
      rounds: [
        {
          context: [`${n} s'échauffe près de ${p}.`, 'Un léger effort colore ses joues.'],
          prompt: `« Tu te joins à moi ? J'ai besoin d'un partenaire. »`,
          choices: [
            { tone: 'sincere', text: 'Bien sûr. Montre-moi.', reaction: `${n} te tend une main.` },
            { tone: 'playful', text: 'Seulement si tu vas doucement.', reaction: `${n} sourit. « On verra. »` },
            { tone: 'direct', text: 'Combien de temps ? Allons-y.', reaction: `« Une demi-heure. »` },
            { tone: 'romantic', text: "N'importe quelle excuse pour te voir.", reaction: `${n} rougit.` },
          ],
        },
        {
          context: ['Vous enchaînez les exercices.'],
          prompt: `« Tu tiens bon… Impressionnant. »`,
          choices: [
            { tone: 'sincere', text: "C'est grâce à toi.", reaction: `${n} sourit.` },
            { tone: 'playful', text: 'Attends ma crampie dans cinq minutes.', reaction: `${n} rit aux éclats.` },
            { tone: 'direct', text: 'Pas encore fini. Encore.', reaction: `« Volontiers », dit ${n}.` },
            { tone: 'romantic', text: 'Tout vaut la peine à tes côtés.', reaction: `${n} détourne le regard.` },
          ],
        },
        {
          context: ['La session se termine.'],
          prompt: `« …On recommence demain ? »`,
          choices: [
            { tone: 'sincere', text: 'Avec plaisir.', reaction: `${n} hoche la tête.` },
            { tone: 'playful', text: 'Si tu prépares la collation.', reaction: `« Marché conclu. »` },
            { tone: 'direct', text: 'Oui. Même heure.', reaction: `${n} incline la tête.` },
            { tone: 'romantic', text: 'Chaque jour avec toi.', reaction: `${n} murmure « d'accord ».` },
          ],
        },
      ],
    },
    {
      id: 'etoiles',
      title: 'Sous les étoiles',
      hints: ['romantic', 'sincere', 'romantic'],
      rounds: [
        {
          context: [`Le ciel est dégagé au-dessus de ${p}.`, `${n} contemple les étoiles.`],
          prompt: `« Tu les vois ? Elles semblent plus près ce soir. »`,
          choices: [
            { tone: 'sincere', text: "Oui. C'est magnifique.", reaction: `${n} sourit doucement.` },
            { tone: 'playful', text: 'Je compte une étoile par secret.', reaction: `${n} rit.` },
            { tone: 'direct', text: 'Belles. Et ensuite ?', reaction: `« Patience », dit ${n}.` },
            { tone: 'romantic', text: 'Moins que toi, pourtant.', reaction: `${n} reste sans voix.` },
          ],
        },
        {
          context: ['Un vent léger passe.'],
          prompt: `« Tu fais un vœu… ou tu gardes tes secrets ? »`,
          choices: [
            { tone: 'sincere', text: 'Je souhaite que le village aille bien.', reaction: `${n} hoche la tête.` },
            { tone: 'playful', text: 'Je souhaite un dessert illimité.', reaction: `${n} éclate de rire.` },
            { tone: 'direct', text: "Les vœux, c'est pour les enfants.", reaction: `« Peut-être », dit ${n}.` },
            { tone: 'romantic', text: 'Mon vœu est déjà là.', reaction: `${n} rougit.` },
          ],
        },
        {
          context: ['Les étoiles scintillent encore.'],
          prompt: `« …Reste encore un peu ? »`,
          choices: [
            { tone: 'sincere', text: 'Oui. Ce moment est précieux.', reaction: `${n} s'assoit près de toi.` },
            { tone: 'playful', text: 'Si tu racontes une histoire.', reaction: `${n} commence à parler doucement.` },
            { tone: 'direct', text: 'Encore cinq minutes.', reaction: `« D'accord. »` },
            { tone: 'romantic', text: 'Toute la nuit, si tu veux.', reaction: `${n} murmure « d'accord ».` },
          ],
        },
      ],
    },
    {
      id: 'malentendu',
      title: 'Malentendu',
      hints: ['sincere', 'direct', 'sincere'],
      rounds: [
        {
          context: [`${n} semble froide près de ${p}.`, 'Le silence pèse.'],
          prompt: `« Hier… tu m'as vexé. Sans le vouloir, peut-être. »`,
          choices: [
            { tone: 'sincere', text: "Pardon. Dis-moi ce que j'ai fait.", reaction: `${n} soupire.` },
            { tone: 'playful', text: "Moi ? Vexer quelqu'un ? Impossible.", reaction: `« Si », dit ${n} sans sourire.` },
            { tone: 'direct', text: 'Explique. Je corrigerai.', reaction: `${n} hoche la tête.` },
            { tone: 'romantic', text: 'Je ne voulais jamais te blesser.', reaction: `${n} détend les épaules.` },
          ],
        },
        {
          context: [`${n} te regarde enfin.`],
          prompt: `« J'avais besoin qu'on m'écoute. Pas qu'on plaisante. »`,
          choices: [
            { tone: 'sincere', text: "Tu as raison. Je t'écoute maintenant.", reaction: `${n} acquiesce.` },
            { tone: 'playful', text: 'D\'accord. Mode sérieux activé.', reaction: `${n} sourit faiblement.` },
            { tone: 'direct', text: 'Compris. Plus de blagues là-dessus.', reaction: `« Merci », dit ${n}.` },
            { tone: 'romantic', text: 'Ta voix compte plus que mes blagues.', reaction: `${n} baisse les yeux.` },
          ],
        },
        {
          context: ['La tension retombe.'],
          prompt: `« …On est toujours amis ? »`,
          choices: [
            { tone: 'sincere', text: 'Plus que jamais.', reaction: `${n} sourit enfin.` },
            { tone: 'playful', text: 'Amis ? Presque trop proches.', reaction: `${n} rougit.` },
            { tone: 'direct', text: 'Oui. Clarté avant tout.', reaction: `${n} incline la tête.` },
            { tone: 'romantic', text: 'Amis… et peut-être plus.', reaction: `${n} reste près de toi.` },
          ],
        },
      ],
    },
    {
      id: 'cadeau',
      title: 'Cadeau inattendu',
      hints: ['romantic', 'playful', 'sincere'],
      rounds: [
        {
          context: [`${n} cache quelque chose derrière son dos près de ${p}.`, 'Un petit sourire trahit son jeu.'],
          prompt: `« Ferme les yeux… et tends la main. »`,
          choices: [
            { tone: 'sincere', text: 'D\'accord. Je te fais confiance.', reaction: `${n} glisse un objet dans ta paume.` },
            { tone: 'playful', text: "Si c'est une grenouille, je crie.", reaction: `${n} rit.` },
            { tone: 'direct', text: "Qu'est-ce que c'est ?", reaction: `« Patience », dit ${n}.` },
            { tone: 'romantic', text: 'Pour toi, les yeux fermés.', reaction: `${n} rougit.` },
          ],
        },
        {
          context: ['C\'est un petit objet soigné, clairement choisi pour toi.'],
          prompt: `« Ça te plaît ? J'y ai pensé en te voyant. »`,
          choices: [
            { tone: 'sincere', text: "C'est parfait. Merci du fond du cœur.", reaction: `${n} sourit.` },
            { tone: 'playful', text: 'Presque aussi beau que moi.', reaction: `${n} éclate de rire.` },
            { tone: 'direct', text: 'Oui. Utile. Merci.', reaction: `« De rien », dit ${n}.` },
            { tone: 'romantic', text: 'Je le garderai toujours.', reaction: `${n} détourne le regard.` },
          ],
        },
        {
          context: ['Le moment reste suspendu.'],
          prompt: `« …Un jour, rends-moi la pareille ? »`,
          choices: [
            { tone: 'sincere', text: 'Compté sur moi.', reaction: `${n} hoche la tête.` },
            { tone: 'playful', text: "Un gâteau géant, c'est promis.", reaction: `${n} rit.` },
            { tone: 'direct', text: "Quand l'occasion se présentera.", reaction: `« Entendu. »` },
            { tone: 'romantic', text: 'Je te le rends chaque jour.', reaction: `${n} murmure « merci ».` },
          ],
        },
      ],
    },
    {
      id: 'au-revoir',
      title: "Jusqu'à demain",
      hints: ['sincere', 'romantic', 'sincere'],
      rounds: [
        {
          context: [`La journée touche à sa fin près de ${p}.`, `${n} range ses affaires.`],
          prompt: `« Il est tard… tu devrais rentrer. »`,
          choices: [
            { tone: 'sincere', text: 'Encore un instant avec toi.', reaction: `${n} s'arrête.` },
            { tone: 'playful', text: 'Chasser le héros ? Quelle cruauté.', reaction: `${n} sourit.` },
            { tone: 'direct', text: "Tu as raison. J'y vais.", reaction: `« Bonne nuit », dit ${n}.` },
            { tone: 'romantic', text: 'Sans toi, la nuit est longue.', reaction: `${n} rougit.` },
          ],
        },
        {
          context: ['Les lanternes s\'allument au loin.'],
          prompt: `« …Ou tu restes encore un peu ? »`,
          choices: [
            { tone: 'sincere', text: 'Je reste. Ce moment compte.', reaction: `${n} s'assoit près de toi.` },
            { tone: 'playful', text: 'Si tu me racontes une histoire.', reaction: `${n} commence à parler.` },
            { tone: 'direct', text: 'Cinq minutes. Pas plus.', reaction: `« D'accord. »` },
            { tone: 'romantic', text: 'Toute la nuit, si tu veux.', reaction: `${n} acquiesce.` },
          ],
        },
        {
          context: ['Il faut vraiment partir.'],
          prompt: `« À demain… promis ? »`,
          choices: [
            { tone: 'sincere', text: `Promis. Bonne nuit, ${n}.`, reaction: `${n} sourit.` },
            { tone: 'playful', text: 'Demain, je reviens avec des blagues.', reaction: `${n} rit.` },
            { tone: 'direct', text: 'Demain. Même heure.', reaction: `${n} incline la tête.` },
            { tone: 'romantic', text: 'Je compterai les heures.', reaction: `${n} murmure « moi aussi ».` },
          ],
        },
      ],
    },
  ]
  return arcs[arc]
}

const SCENARIOS = {}
for (const companionId of Object.keys(COMPANIONS)) {
  SCENARIOS[companionId] = []
  for (let i = 0; i < SCENARIOS_PER_COMPANION; i++) {
    const v = COMPANIONS[companionId]
    const arcIndex = i % ARC_COUNT
    const ambIndex = Math.floor(i / ARC_COUNT) % AMBIANCES.length
    const amb = AMBIANCES[ambIndex]
    const base = buildArc(v, arcIndex)
    const maxAffinity = i % 7 === 0 ? 3 : i % 11 === 0 ? 4 : 5

    SCENARIOS[companionId].push({
      id: `${companionId}-s${i}`,
      title: `${amb} — ${base.title}`,
      minAffinity: 1,
      maxAffinity,
      roundToneHints: base.hints,
      rounds: base.rounds.map((round) => ({
        context: [`${amb}. ${round.context[0]}`, ...round.context.slice(1)].filter(Boolean),
        prompt: round.prompt,
        choices: round.choices.map((c) => ({
          text: c.text,
          tone: c.tone,
          reaction: c.reaction,
        })),
      })),
    })
  }
}

mkdirSync(dirname(OUT), { recursive: true })

const tsContent = `/* eslint-disable */
/** Généré par scripts/generate-companion-scenarios.mjs — ne pas éditer à la main */
import type { CompanionScenarioPack } from './types'

export const SCENARIOS_PER_COMPANION = ${SCENARIOS_PER_COMPANION} as const

export const COMPANION_SCENARIO_PACKS: CompanionScenarioPack = ${JSON.stringify(SCENARIOS)} as CompanionScenarioPack
`

writeFileSync(OUT, tsContent, 'utf8')
console.log(`Generated ${Object.keys(COMPANIONS).length * SCENARIOS_PER_COMPANION} scenarios -> ${OUT}`)
