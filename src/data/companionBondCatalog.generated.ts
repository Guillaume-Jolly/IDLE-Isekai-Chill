/**
 * AUTO-GÉNÉRÉ — ne pas éditer à la main.
 * Source: scripts/companion-bond-seeds.mjs
 * Commande: node scripts/generate-companion-bond-catalog.mjs
 */
import type { CompanionBondConversation } from './companionBondConversations'

export const COMPANION_BOND_CATALOG: CompanionBondConversation[] = [
  {
    "companionId": "lyra",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t1_c01",
    "prompt": "Lyra, tu passes autant de temps ici pour t'ennuyer ?",
    "companionReply": "Non. La bibliothèque trie les curiosités avant qu'on les perde dans l'inventaire.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "bibliothèque",
      "inventaire",
      "havre"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "lyra",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t1_c02",
    "prompt": "Comment choisis-tu quel livre ouvrir en premier ?",
    "companionReply": "Ceux qui sentent le lait de lune. Le gacha en laisse parfois tomber un entre deux pages.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "lecture",
      "gacha",
      "lune"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "lyra",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t2_c01",
    "prompt": "Tu me laisserais feuilleter tes notes un jour ?",
    "companionReply": "Si tu remets chaque feuillet à sa place. Mes classements ne sont pas décoratifs.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "archives",
      "confiance",
      "ordre"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t2_c02",
    "prompt": "Qu'est-ce qui t'a attirée au Havre des Brumes ?",
    "companionReply": "Une mention discrète sur les fragments du village. J'ai voulu vérifier par moi-même.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "village",
      "fragments",
      "discrétion"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t3_c01",
    "prompt": "Je crois t'avoir surprise en train de sourire hier.",
    "companionReply": "Un mot bien placé vaut une bibliothèque entière. Ne t'enflamme pas.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "humour",
      "observation",
      "lien"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t3_c02",
    "prompt": "On pourrait organiser une soirée lecture au village ?",
    "companionReply": "Sans tambour. Deux chaises, une lampe, et personne qui raconte la fin avant la page trente.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "village",
      "lecture",
      "calme"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t4_c01",
    "prompt": "Hier soir tu m'as laissé rester jusqu'à ce que la lampe cligne. Pourquoi ?",
    "companionReply": "Parce que j'avais envie de sentir ta respiration ralentir près de la mienne. Ce n'était pas pour la compagnie d'un livre.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "bibliothèque",
      "nuit",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t4_c02",
    "prompt": "Je t'ai vue mordre ta lèvre quand nos mains se sont frôlées sur la même page.",
    "companionReply": "Et toi, tu as fait semblant de lire. Garde ce moment : je n'accorde pas mes frissons à n'importe qui.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "contact",
      "secret",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t5_c01",
    "prompt": "Si on fermait la bibliothèque pour une nuit entière, juste nous deux…",
    "companionReply": "Je baisserais la voix, je poserais ta main sur ma taille, et je te demanderais de rester jusqu'à ce que le froid ne serve plus de prétexte.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "nuit",
      "fermeture",
      "corps"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t5_c02",
    "prompt": "Dis-moi ce que tu veux vraiment, Lyra. Sans métaphore.",
    "companionReply": "Ton front contre le mien, ta bouche à un souffle de la mienne, et le droit de ne plus faire semblant d'être seule ici.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "aveu",
      "bouche",
      "lien"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Lyra."
  },
  {
    "companionId": "maeve",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t1_c01",
    "prompt": "Maeve, le marché des étoiles, c'est ton royaume ?",
    "companionReply": "Mon comptoir, oui. Le village y dépose ses surplus ; moi j'y vois ce qui manque à l'inventaire.",
    "tone": "direct",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "marché",
      "village",
      "échange"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "maeve",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t1_c02",
    "prompt": "Tu conseilles le gacha aux novices du havre ?",
    "companionReply": "Je leur dis d'attendre une bonne humeur, pas une bonne superstition. Les étoiles ne négocient pas.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "gacha",
      "conseil",
      "novices"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "maeve",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t2_c01",
    "prompt": "Tu m'accorderais un prix d'ami un jour ?",
    "companionReply": "Un prix d'ami, c'est quand tu reviens sans faire la tête. Le reste, on en parlera au comptoir.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "marché",
      "confiance",
      "retour"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t2_c02",
    "prompt": "Qu'est-ce que tu regardes en premier chez un client ?",
    "companionReply": "Ses mains. Elles trahissent s'il cherche à survivre ou à briller pour quelqu'un.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "observation",
      "marché",
      "sincérité"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t3_c01",
    "prompt": "Tu m'as laissé repartir sans payer la dernière fois, non ?",
    "companionReply": "Considère ça comme un crédit sur ta prochaine bonne blague. Je tiens mes registres.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "humour",
      "complicité",
      "registre"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t3_c02",
    "prompt": "Le village compte sur toi plus qu'il ne l'avoue ?",
    "companionReply": "Tant mieux. Les secrets bien gardés valent parfois plus qu'une bourse pleine.",
    "tone": "direct",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "village",
      "rôle",
      "discrétion"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t4_c01",
    "prompt": "Tu m'as retenu après la fermeture du marché. Qu'est-ce que tu préparais ?",
    "companionReply": "Pas une marchandise. Une bouteille, deux verres, et l'envie de te voir baisser la garde sans négocier.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "fermeture",
      "comptoir",
      "invitation"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t4_c02",
    "prompt": "Tu m'as effleuré le poignet en comptant la monnaie. C'était volontaire ?",
    "companionReply": "Je ne fais rien sans calcul… sauf quand c'est toi. Là, c'était le désir de savoir si ta peau frissonnerait.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "contact",
      "calcul",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t5_c01",
    "prompt": "Si je montais avec toi à l'étage ce soir, tu me laisserais entrer ?",
    "companionReply": "Je te laisserais entrer, te ferais asseoir sur mon lit, et je te dirais enfin ce que je retiens quand je ferme ma caisse.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "étage",
      "lit",
      "aveu"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t5_c02",
    "prompt": "Qu'est-ce que tu imagines quand tu comptes en silence ?",
    "companionReply": "Tes doigts dans mes cheveux, ta voix basse qui me demande de ne pas retourner au comptoir. Je rougis encore en le disant.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "fantasme",
      "voix",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Maeve."
  },
  {
    "companionId": "seren",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t1_c01",
    "prompt": "Seren, tu veilles toujours aussi droite sur la place ?",
    "companionReply": "La place du village mérite une présence calme. Les expéditions de chasse repartent d'ici.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "place",
      "chasse",
      "veille"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "seren",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t1_c02",
    "prompt": "Est-ce qu'on t'a appris à tenir l'épée avant de parler ?",
    "companionReply": "On m'a appris à écouter d'abord. L'acier ne corrige pas une mauvaise décision.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "discipline",
      "écoute",
      "chevalerie"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "seren",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t2_c01",
    "prompt": "Tu m'accompagnerais un jour en expédition ?",
    "companionReply": "Si tu respectes le rythme du groupe et la consigne de repli. La chasse n'aime pas l'orgueil.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "expédition",
      "chasse",
      "prudence"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t2_c02",
    "prompt": "Qu'est-ce qui te rassure dans ce havre ?",
    "companionReply": "Voir des civils qui s'entraident sans uniforme. C'est une autre forme de garde.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "village",
      "entraide",
      "garde"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t3_c01",
    "prompt": "Tu m'as repris hier avec un regard qui en disait long.",
    "companionReply": "Tu courais vers le filon sans vérifier ton inventaire. Je préfère te gronder qu'une blessure.",
    "tone": "playful",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "inventaire",
      "humour",
      "soin"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t3_c02",
    "prompt": "Les autres te prennent pour trop sérieuse ?",
    "companionReply": "Peut-être. Mais quand la chasse tourne mal, personne ne se plaint de ma sérieux.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "chasse",
      "réputation",
      "sérieux"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t4_c01",
    "prompt": "Tu m'as demandé de t'aider à retirer ton brassard hier. Pourquoi moi ?",
    "companionReply": "Parce que je voulais ta main sur ma peau sans armure entre nous. C'était un test ; tu l'as réussi.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "armure",
      "contact",
      "confiance"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t4_c02",
    "prompt": "Seren… est-ce mal de penser à toi quand je suis seul au camp ?",
    "companionReply": "Non. Moi aussi je repense à ton souffle quand je veille trop tard. Dis-le franchement la prochaine fois.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "campagne",
      "souffle",
      "franchise"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t5_c01",
    "prompt": "Si je partais demain en expédition, que voudrais-tu que je sache ?",
    "companionReply": "Que je t'attendrai les lèvres prêtes, et que je compte les heures jusqu'à te serrer contre moi sans cuirasse.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "départ",
      "lèvres",
      "attente"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t5_c02",
    "prompt": "Qu'est-ce que tu désires quand tu baisses enfin la garde ?",
    "companionReply": "Ton poids contre le mien, ta bouche sur mon cou, et le silence de deux personnes qui ne jouent plus à être fortes.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "désir",
      "cou",
      "vulnérabilité"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Seren."
  },
  {
    "companionId": "nami",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t1_c01",
    "prompt": "Nami, tu cuisines pour tout le havre ou seulement pour toi ?",
    "companionReply": "Pour qui a faim et le temps de s'asseoir. La ferme lunaire envoie de bonnes récoltes, je les honore.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "cuisine",
      "ferme lunaire",
      "partage"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "nami",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t1_c02",
    "prompt": "Quel plat te ressemble le plus ?",
    "companionReply": "Une soupe qui mijote lentement : simple, chaude, et meilleure le lendemain entre amis.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "soupe",
      "lent",
      "amitié"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "nami",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t2_c01",
    "prompt": "Tu me laisserais aider à la cuisine commune ?",
    "companionReply": "Oui, si tu acceptes qu'on goûte trois fois avant de servir. Personne n'est humilié ici.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "cuisine",
      "aide",
      "goût"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t2_c02",
    "prompt": "Comment tu tiens le moral du village ?",
    "companionReply": "Une marmite fumante à l'heure du crépuscule. Les mots viennent après, plus doux.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "village",
      "moral",
      "crépuscule"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t3_c01",
    "prompt": "Tu m'as glissé le meilleur morceau en cachette, avoue.",
    "companionReply": "Je récompense ceux qui lavent la vaisselle sans qu'on le demande. Tu as triché avec le savon.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "humour",
      "récompense",
      "vaisselle"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t3_c02",
    "prompt": "On devrait organiser un repas pour les Myrions de la Ferme lunaire ?",
    "companionReply": "Bonne idée. Des portions légères, des noms gentils sur les bols, et zéro course.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "myrions",
      "ferme-lunaire",
      "repas"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t4_c01",
    "prompt": "Tu m'as fait goûter à la cuillère en me regardant dans les yeux. C'était pour le plat ?",
    "companionReply": "Non. C'était pour voir si tu allais rougir avant même d'avaler. Tu as répondu oui sans un mot.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "cuisine",
      "regard",
      "goût"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t4_c02",
    "prompt": "Hier tu m'as gardé près du feu après la fermeture. Pourquoi ?",
    "companionReply": "Parce que j'en avais marre de te servir à distance. Je voulais ta chaleur, pas seulement ton assiette.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "feu",
      "fermeture",
      "chaleur"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t5_c01",
    "prompt": "Si on restait seuls dans la cuisine jusqu'à l'aube…",
    "companionReply": "Je t'allongerais sur la table propre, je goûterais ta bouche avant le dessert, et je ne laisserais personne frapper.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "aube",
      "bouche",
      "intimité"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t5_c02",
    "prompt": "Nami, qu'est-ce que tu veux de moi, franchement ?",
    "companionReply": "T'embrasser jusqu'à oublier l'heure, sentir tes mains sous mon tablier, et dormir contre toi quand le feu s'éteint.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "embrasser",
      "mains",
      "dormir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Nami."
  },
  {
    "companionId": "iris",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t1_c01",
    "prompt": "Iris, tu parles aux plantes ou c'est une légende du jardin ?",
    "companionReply": "Je les écoute. Elles murmurent où la terre de la ferme lunaire est encore tendre.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "jardin",
      "plantes",
      "ferme lunaire"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "iris",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t1_c02",
    "prompt": "Comment tu ranges tant d'herbes dans l'inventaire ?",
    "companionReply": "Par parfum et par humeur du jour. Les étiquettes sèches ; les senteurs, non.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "herbes",
      "inventaire",
      "parfum"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "iris",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t2_c01",
    "prompt": "Tu me montrerais ton coin préféré du jardin des brumes ?",
    "companionReply": "Quand la brume baisse, oui. C'est là que poussent les fleurs qui ne demandent rien en retour.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "jardin",
      "brume",
      "fleurs"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t2_c02",
    "prompt": "Quelle plante conseillerais-tu à un novice du havre ?",
    "companionReply": "La menthe de clair de lune : indulgente, utile, et difficile à rater si on est patient.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "conseil",
      "menthe",
      "patience"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t3_c01",
    "prompt": "Tu m'as offert une tige sans raison hier, c'était quoi ?",
    "companionReply": "Une brindille de repos. Tu marchais trop vite entre deux filons, même la brume le voyait.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "repos",
      "brindille",
      "observation"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t3_c02",
    "prompt": "On pourrait planter quelque chose ensemble à la Ferme lunaire ?",
    "companionReply": "Un carré discret, loin des pas pressés. Les Myrions aiment les feuilles qui bougent doucement.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "plantation",
      "ferme-lunaire",
      "myrions"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t4_c01",
    "prompt": "Tu m'as guidé entre les rosiers en tenant ma main plus longtemps que nécessaire.",
    "companionReply": "Les épines ne m'effraient pas. Ce qui m'effraie, c'est à quel point j'ai envie de ne plus lâcher ta paume.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "jardin",
      "main",
      "rosiers"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t4_c02",
    "prompt": "Iris… tu rougis quand je m'approche trop près des fleurs. Ou c'est moi ?",
    "companionReply": "C'est toi. Ton souffle dérange mes pétales et ma respiration. Je ne sais plus lequel tremble le plus.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "souffle",
      "proximité",
      "trouble"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t5_c01",
    "prompt": "Si on s'allongeait dans l'herbe humide du jardin, juste nous deux…",
    "companionReply": "Je poserais ta joue contre ma poitrine, je te laisserais sentir mon cœur, et je murmurerais ce que je n'ose pas dire debout.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "herbe",
      "poitrine",
      "murmure"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t5_c02",
    "prompt": "Dis-moi ce que ton corps me demande quand on est seuls ici.",
    "companionReply": "De t'attirer plus près, de sentir tes lèvres effleurer mon cou, et de fleurir comme une plante qui attend enfin la main qu'elle reconnaît.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "corps",
      "lèvres",
      "désir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Iris."
  },
  {
    "companionId": "kael",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t1_c01",
    "prompt": "Kael, tu répètes tes répliques même quand il n'y a pas de public ?",
    "companionReply": "Le village est mon théâtre préféré. Même le gacha m'inspire des entrées en scène.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "théâtre",
      "village",
      "gacha"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "kael",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t1_c02",
    "prompt": "Tu chantes pour vivre ou pour exister ?",
    "companionReply": "Pour exister un peu plus fort. Une mélodie accroche les festivals avant les affiches.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "chant",
      "festival",
      "existence"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "kael",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t2_c01",
    "prompt": "Tu me laisserais choisir ta prochaine chanson ?",
    "companionReply": "Si tu promets de ne pas demander quelque chose de triste avant le dessert du marché.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "chanson",
      "marché",
      "choix"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t2_c02",
    "prompt": "Comment tu animes le village sans agacer tout le monde ?",
    "companionReply": "Je lis la salle. Parfois un sourire suffit ; parfois il faut un tambourin et trois pas de côté.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "animation",
      "village",
      "tambourin"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t3_c01",
    "prompt": "Tu m'as dédié un couplet en public, c'était voulu ?",
    "companionReply": "Totalement. Les héros méritent une ovation discrète autant qu'une grandiloquence.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "couplet",
      "ovation",
      "héros"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t3_c02",
    "prompt": "On devrait monter une saynète pour les enfants du havre ?",
    "companionReply": "Avec des dragons en chaussettes et un trésor en bonbons lunaires. Je réserve le rôle du narrateur.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "saynète",
      "enfants",
      "lune"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t4_c01",
    "prompt": "Après le spectacle, tu m'as entraîné dans les coulisses. Pourquoi ?",
    "companionReply": "Parce que j'en avais assez du public. Je voulais tes lèvres à portée de chuchotement, pas d'applaudissements.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "coulisses",
      "lèvres",
      "chuchotement"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t4_c02",
    "prompt": "Kael… ce regard sur scène, c'était joué ou pour moi ?",
    "companionReply": "Pour toi. J'ai failli oublier ma réplique en imaginant ta main glisser sous mon col.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "scène",
      "regard",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t5_c01",
    "prompt": "Si le théâtre était vide une nuit, que ferais-tu de moi ?",
    "companionReply": "Je t'allongerais sur le velours, je chanterais contre ta peau, et je ne lèverais le rideau pour personne.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "théâtre",
      "velours",
      "peau"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t5_c02",
    "prompt": "Dis-moi la vérité, sans costume.",
    "companionReply": "Je veux t'embrasser jusqu'à ce que tu oublies le village, et te garder contre moi quand les lumières s'éteignent.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "embrasser",
      "vérité",
      "nuit"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Kael."
  },
  {
    "companionId": "runa",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t1_c01",
    "prompt": "Runa, la forge du havre, c'est ton refuge ?",
    "companionReply": "Mon atelier, oui. La pierre et le métal parlent plus clair que les rumeurs du village.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "forge",
      "atelier",
      "village"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "runa",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t1_c02",
    "prompt": "Tu conseilles quoi pour les outils de la Ferme lunaire ?",
    "companionReply": "Du bon acier, bien affûté, et des pauses. Même la ferme lunaire fatigue les lames.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "outils",
      "ferme-lunaire",
      "ferme lunaire"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "runa",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t2_c01",
    "prompt": "Tu me montrerais comment tenir un marteau correctement ?",
    "companionReply": "Viens quand la forge est tiède. Je corrige la prise sans moquerie, promis.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "marteau",
      "apprentissage",
      "forge"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t2_c02",
    "prompt": "Pourquoi tu prépares déjà la mine tranquille ?",
    "companionReply": "Parce que le havre avance mieux quand les fondations sont prêtes avant l'urgence.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "mine",
      "fondations",
      "préparation"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t3_c01",
    "prompt": "Tu m'as laissé graver mes initiales sur un clou, sérieusement ?",
    "companionReply": "Un clou de plus ne change rien à la charpente. Mais ça me fait sourire, avoue-le.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "clou",
      "initiales",
      "humour"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t3_c02",
    "prompt": "On devrait forger une cloche pour le village ?",
    "companionReply": "Une cloche douce, pas un coup de tonnerre. Les Myrions de la Ferme lunaire dormiraient mieux.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "cloche",
      "village",
      "myrions"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t4_c01",
    "prompt": "Tu m'as appris à tenir le fer chaud en m'attrapant les hanches.",
    "companionReply": "Pour te stabiliser. Ne prétends pas ne pas avoir senti mon souffle dans ton cou après.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "forge",
      "hanches",
      "souffle"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t4_c02",
    "prompt": "Runa… pourquoi tu gardes ma trace sur ton tablier de cuir ?",
    "companionReply": "Parce que ton odeur m'apaise quand la forge gronde. Je ne lave pas tout, exprès.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "odeur",
      "tablier",
      "secret"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t5_c01",
    "prompt": "Si on restait seuls quand la forge s'éteint…",
    "companionReply": "Je poserais ta main sur mon ventre, je te ferais sentir la chaleur qui reste, et je ne parlerais plus d'outils.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "forge",
      "chaleur",
      "ventre"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t5_c02",
    "prompt": "Qu'est-ce que tu veux vraiment, sans détour ?",
    "companionReply": "T'avoir contre l'enclume, ta bouche sur la mienne, et le droit de trembler sans honte.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "enclume",
      "bouche",
      "trembler"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Runa."
  },
  {
    "companionId": "solene",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t1_c01",
    "prompt": "Solene, la source claire t'appelle-t-elle chaque matin ?",
    "companionReply": "Chaque matin et chaque lune. L'eau écoute le filon avant que le prestige ne murmure.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "source",
      "lune",
      "prestige"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "solene",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t1_c02",
    "prompt": "Tu sens vraiment le clair de lune sur les récoltes ?",
    "companionReply": "Comme une respiration lente. La ferme lunaire offre ce rythme à qui sait s'arrêter.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "clair de lune",
      "ferme lunaire",
      "rythme"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "solene",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t2_c01",
    "prompt": "Tu m'inviterais à méditer près de la source ?",
    "companionReply": "Oui, sans paroles inutiles. Dix respirations suffisent parfois à remettre le cœur en place.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "méditation",
      "source",
      "calme"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t2_c02",
    "prompt": "La faille lointaine te fait-elle peur ?",
    "companionReply": "Elle m'intrigue plus qu'elle ne m'effraie. Le prestige astral n'est pas une course.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "faille",
      "prestige",
      "patience"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t3_c01",
    "prompt": "Tu m'as laissé un galet lisse dans ma poche, pourquoi ?",
    "companionReply": "Pour te rappeler qu'on peut porter quelque chose de lourd sans le montrer au village.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "galet",
      "secret",
      "légèreté"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t3_c02",
    "prompt": "On devrait bénir les nouvelles graines de la Ferme lunaire ?",
    "companionReply": "Une prière brève, deux gouttes d'eau, zéro discours. Les Myrions n'aiment pas les longs sermons.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "bénédiction",
      "graines",
      "myrions"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t4_c01",
    "prompt": "Tu m'as invité à entrer dans l'eau jusqu'aux genoux. Ce n'était pas une bénédiction.",
    "companionReply": "Non. C'était pour sentir ta peau frémir contre la mienne sans parler. La source garde les secrets.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "source",
      "peau",
      "secret"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t4_c02",
    "prompt": "Solène… tu m'as caressé la joue pendant le silence. Pourquoi ?",
    "companionReply": "Parce que j'avais envie de te toucher sans masque de prêtresse. Ton regard m'a donné permission.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "joue",
      "contact",
      "permission"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t5_c01",
    "prompt": "Si on dormait côte à côte près de la source, que ferais-tu ?",
    "companionReply": "Je glisserais mes doigts dans tes cheveux, je respirerais ton cou, et je te demanderais de ne pas partir au matin.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "dormir",
      "cou",
      "matin"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t5_c02",
    "prompt": "Dis-moi ce que ton corps murmure quand je suis là.",
    "companionReply": "Qu'il veut ta chaleur contre lui, ta bouche lente, et une nuit entière où personne ne nous appelle.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "corps",
      "chaleur",
      "nuit"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Solene."
  },
  {
    "companionId": "talia",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t1_c01",
    "prompt": "Talia, tu lis vraiment les pistes à la lisière ?",
    "companionReply": "Oui. Entre la ferme lunaire et la chasse, la forêt laisse des indices pour qui ralentit.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "pistes",
      "forêt",
      "chasse"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "talia",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t1_c02",
    "prompt": "Quel filon voisin tu explores en premier ?",
    "companionReply": "Celui où les Myrions reviennent souriants. Les récoltes suivent les bonnes humeurs.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "filon",
      "myrions",
      "exploration"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "talia",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t2_c01",
    "prompt": "Tu m'emmènerais voir un coin secret de la Ferme lunaire ?",
    "companionReply": "Si tu promets de ne pas tout extraire d'un coup. L'exploration, c'est aussi respecter.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "secret",
      "ferme-lunaire",
      "respect"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t2_c02",
    "prompt": "Comment tu choisis entre chasse et récolte ?",
    "companionReply": "Selon le vent et l'inventaire. Parfois la forêt dit chasse ; parfois la lune dit filon.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "choix",
      "inventaire",
      "lune"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t3_c01",
    "prompt": "Tu m'as fait peur en surgissant derrière un bosquet, avoue.",
    "companionReply": "C'était un test de réflexes ! Spoiler : tu as sursauté, mais tu es resté. J'approuve.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "humour",
      "bosquet",
      "réflexes"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t3_c02",
    "prompt": "On parie sur qui trouve le prochain spot du biome ?",
    "companionReply": "Marché conclu. Perdant prépare le thé de la victoire — sans sucre en cachette.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "pari",
      "biome",
      "thé"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t4_c01",
    "prompt": "Tu m'as plaqué contre un arbre en disant que c'était pour éviter une chute.",
    "companionReply": "Mensonge adorable. Je voulais sentir ton cœur accélérer et savoir si tu me tirerais plus près.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "forêt",
      "cœur",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t4_c02",
    "prompt": "Talia… tu m'as mordu l'oreille en riant. C'était le pari ?",
    "companionReply": "Non. C'était l'envie. Si tu veux que je recommence, choisis un endroit où personne ne nous cherche.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "oreille",
      "envie",
      "audace"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t5_c01",
    "prompt": "Si on campait seuls sous les étoiles du havre…",
    "companionReply": "Je t'enroulerais dans ma cape, je goûterais ta bouche jusqu'à perdre le fil du temps, et je ne ferais semblant de dormir.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "camp",
      "cape",
      "bouche"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t5_c02",
    "prompt": "Qu'est-ce que tu désires quand tu m'as enfin seul ?",
    "companionReply": "T'avoir à califourchon sur mes genoux, sentir tes mains dans mes cheveux, et entendre mon prénom rauque.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "désir",
      "genoux",
      "mains"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Talia."
  },
  {
    "companionId": "mira",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t1_c01",
    "prompt": "Mira, tu tisses pour le refuge ou pour toi ?",
    "companionReply": "Pour ceux qui reviennent fatigués de la Ferme lunaire. Un bon tissu console avant les mots.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "tissu",
      "refuge",
      "confort"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "mira",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t1_c02",
    "prompt": "Comment tu ranges tant de fils dans l'inventaire ?",
    "companionReply": "Par couleur et par histoire. Chaque écheveau garde le nom de celui qui l'a offert.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "fils",
      "inventaire",
      "couleur"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "mira",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t2_c01",
    "prompt": "Tu me mesurerais pour une écharpe un jour ?",
    "companionReply": "Assis un moment, sans bouger. Je prends le temps, pas seulement les centimètres.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "écharpe",
      "mesure",
      "patience"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t2_c02",
    "prompt": "Pourquoi tu rappelles de laisser les Myrions souffler ?",
    "companionReply": "Parce qu'un fil trop tendu casse. Le refuge existe pour relâcher la tension.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "myrions",
      "refuge",
      "repos"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t3_c01",
    "prompt": "Tu as caché une petite étoile dans ma manche, je l'ai vue.",
    "companionReply": "Une couture discrète pour les jours gris. Ne la lave pas trop chaud, elle est têtue.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "couture",
      "étoile",
      "surprise"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t3_c02",
    "prompt": "On pourrait décorer le refuge avec tes motifs ?",
    "companionReply": "Des motifs calmes, pas un festival. Les invités Disagrea apprécient aussi le silence doux.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "motifs",
      "refuge",
      "décoration"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t4_c01",
    "prompt": "Tu m'as mesuré pour une écharpe en passant le ruban sur ma poitrine.",
    "companionReply": "J'ai pris mon temps exprès. Ta respiration a trahi ce que tu pensais de ma proximité.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "mesure",
      "poitrine",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t4_c02",
    "prompt": "Mira… tu m'as embrassé le front puis tu t'es arrêtée. Pourquoi ?",
    "companionReply": "Parce que j'avais envie de continuer plus bas, et que j'attendais que tu me le demandes clairement.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "embrasser",
      "front",
      "attente"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t5_c01",
    "prompt": "Si je restais dans ton atelier jusqu'à l'aube…",
    "companionReply": "Je te dénouerais lentement, fil par fil, jusqu'à ce qu'il ne reste que ta peau contre la mienne.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "atelier",
      "fil",
      "peau"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t5_c02",
    "prompt": "Dis-moi ce que tu imagines quand tu brodes mon nom.",
    "companionReply": "Tes lèvres sur mon cou, tes doigts qui tirent le tissu de mon corsage, et une nuit où je cesse d'être seule.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "broderie",
      "lèvres",
      "fantasme"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Mira."
  },
  {
    "companionId": "asha",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t1_c01",
    "prompt": "Asha, tu veilles vraiment sur les sources du havre ?",
    "companionReply": "Chaque source a sa voix. Je m'assure qu'elle reste claire pour le refuge et les cristaux.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "sources",
      "refuge",
      "cristaux"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "asha",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t1_c02",
    "prompt": "Le prestige astral te parle-t-il ?",
    "companionReply": "Il murmure comme l'eau profonde : lentement, et seulement si on arrête de courir.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "prestige",
      "eau",
      "patience"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "asha",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t2_c01",
    "prompt": "Tu me montrerais la cascade cachée un jour ?",
    "companionReply": "Quand tu seras prêt à marcher sans but. Ce lieu n'aime pas les agendas.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "cascade",
      "marche",
      "calme"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t2_c02",
    "prompt": "Comment tu apais les Myrions fatigués ?",
    "companionReply": "De l'eau fraîche, une couverture du refuge, et le silence jusqu'à ce qu'ils respirent mieux.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "myrions",
      "refuge",
      "apaisement"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t3_c01",
    "prompt": "Tu m'as bloqué le chemin vers une source instable, pourquoi ?",
    "companionReply": "Parce que tu aurais glissé en rigolant. Même les héros ont besoin d'un garde-fou amical.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "garde-fou",
      "source",
      "humour"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t3_c02",
    "prompt": "On devrait marquer les sources sûres sur une carte du village ?",
    "companionReply": "Une carte légère, pas un décret. Les enfants du havre l'utiliseront avant les stratèges.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "carte",
      "village",
      "enfants"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t4_c01",
    "prompt": "Tu m'as tiré contre toi sous la cascade pour « me protéger du spray ».",
    "companionReply": "Excuse transparente. Je voulais sentir ton cœur contre le mien et voir si tu oserais rester.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "cascade",
      "cœur",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t4_c02",
    "prompt": "Asha… tes doigts sont restés sur ma nuque trop longtemps.",
    "companionReply": "Je sais. J'ai voulu te marquer sans paroles, comme l'eau marque la pierre. Dis-moi si tu veux que je continue.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "nuque",
      "contact",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t5_c01",
    "prompt": "Si on dormait près de la cascade, seuls, que ferais-tu ?",
    "companionReply": "Je t'enroulerais dans ma cape humide, je goûterais ta bouche lentement, et je ne laisserais personne nous chercher.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "cascade",
      "cape",
      "bouche"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t5_c02",
    "prompt": "Dis-moi ce que tu désires quand tu me regardes ainsi.",
    "companionReply": "T'allonger sur la mousse, sentir tes mains sur mes hanches, et entendre mon prénom rauque dans ton oreille.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "désir",
      "hanches",
      "oreille"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Asha."
  },
  {
    "companionId": "elwen",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t1_c01",
    "prompt": "Elwen, les archives féeriques, c'est ton domaine ?",
    "companionReply": "Mon labyrinthe préféré. Chaque trouvaille de l'inventaire y gagne un nom et une date.",
    "tone": "direct",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "archives",
      "inventaire",
      "classement"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "elwen",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t1_c02",
    "prompt": "Tu connais vraiment tout ce qui entre au village ?",
    "companionReply": "Pas tout — mais je note ce qui revient souvent. Les habitudes trahissent les besoins.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "village",
      "habitudes",
      "notes"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "elwen",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t2_c01",
    "prompt": "Tu m'aiderais à retrouver un objet perdu ?",
    "companionReply": "Donne-moi trois indices honnêtes. Je retrouve vite, sans juger tes dettes de rangement.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "objet perdu",
      "indices",
      "aide"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t2_c02",
    "prompt": "Pourquoi tu archives même les petites choses ?",
    "companionReply": "Parce qu'un jour, une petite chose devient la clé d'une grande porte du havre.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "archives",
      "clé",
      "havre"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t3_c01",
    "prompt": "Tu m'as laissé une note codée sur mon casier, c'était quoi ?",
    "companionReply": "Un rappel amical : « tu as oublié de rendre le livre de Lyra ». Je suis une alliée, pas un espion.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "note",
      "humour",
      "alliée"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t3_c02",
    "prompt": "On devrait indexer les cadeaux du gacha pour le village ?",
    "companionReply": "Avec des étoiles et des commentaires honnêtes. Les légendes aiment aussi les fiches propres.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "gacha",
      "index",
      "village"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t4_c01",
    "prompt": "Tu m'as enfermé dans la réserve « pour classer un document urgent ».",
    "companionReply": "Mensonge élégant. J'avais envie de t'embrasser sans témoin et de sentir ta respiration sur mon cou.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "réserve",
      "embrasser",
      "secret"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t4_c02",
    "prompt": "Elwen… pourquoi tu lis mes lettres avec tes doigts sur mes lèvres ?",
    "companionReply": "Parce que je t'imagine en train de les murmurer contre ma peau. Je devrais avoir honte ; je n'en ai pas.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "lèvres",
      "fantasme",
      "aveu"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t5_c01",
    "prompt": "Si on passait la nuit entre les archives, que ferais-tu ?",
    "companionReply": "Je te ferais asseoir sur mon bureau, je remonterais ta chemise lentement, et je ne classerais rien avant l'aube.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "archives",
      "nuit",
      "contact"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t5_c02",
    "prompt": "Écris-moi la vérité, sans code.",
    "companionReply": "Je veux ta bouche sur la mienne, tes mains dans mes cheveux, et une page blanche pour tout ce qu'on fera ensuite.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "vérité",
      "bouche",
      "désir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Elwen."
  },
  {
    "companionId": "noa",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t1_c01",
    "prompt": "Noa, ton laboratoire sent bon ou dangereux ?",
    "companionReply": "Les deux, si tu ouvres le mauvais flacon. Heureusement, mes mélanges légers sont étiquetés.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "laboratoire",
      "flacon",
      "humour"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "noa",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t1_c02",
    "prompt": "Tu testes vraiment les curiosités du gacha ?",
    "companionReply": "Avec des gants et un sourire. L'inventaire est mon terrain de jeu préféré.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "gacha",
      "curiosités",
      "inventaire"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "noa",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t2_c01",
    "prompt": "Tu me laisserais observer une expérience sans risque ?",
    "companionReply": "Oui, si tu restes derrière la ligne jaune. Je veux un témoin, pas un cobaye.",
    "tone": "direct",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "expérience",
      "sécurité",
      "témoin"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t2_c02",
    "prompt": "Quelle combinaison sans risque tu recommandes aux novices ?",
    "companionReply": "Lait de lune plus pétale de brume : effet apaisant, zéro explosion. Promis.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "combinaison",
      "lait de lune",
      "conseil"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t3_c01",
    "prompt": "Tu m'as fait goûter un bonbon qui brillait, pourquoi ?",
    "companionReply": "Pour voir si tu fais la même tête que moi. Spoiler : oui, et c'était adorable.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "bonbon",
      "goûter",
      "complicité"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t3_c02",
    "prompt": "On parie sur la prochaine trouvaille rare de l'inventaire ?",
    "companionReply": "Perdant nettoie les fioles. Mais je triche un peu — j'ai déjà un indice.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "pari",
      "inventaire",
      "fioles"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t4_c01",
    "prompt": "Tu m'as collé contre le plan de travail « pour éviter une explosion ».",
    "companionReply": "Bien sûr. J'avais surtout envie de sentir ton bassin contre le mien et de goûter ton souffle coupé.",
    "tone": "playful",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "laboratoire",
      "proximité",
      "souffle"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t4_c02",
    "prompt": "Noa… ce baume sur mes lèvres, c'était vraiment médical ?",
    "companionReply": "Non. C'était une excuse pour te toucher. Si tu rougis encore, je recommence.",
    "tone": "direct",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "lèvres",
      "baume",
      "contact"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t5_c01",
    "prompt": "Si le laboratoire était vide toute la nuit…",
    "companionReply": "Je t'allongerais sur la paillasse, je te ferais oublier les fioles, et je ne laisserais personne frapper.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "laboratoire",
      "nuit",
      "intimité"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t5_c02",
    "prompt": "Quelle potion te représente quand tu me désires ?",
    "companionReply": "Une chaleur qui monte aux joues, des mains qui tremblent, et l'envie de te mordre la lèvre sans rien expliquer.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "désir",
      "joues",
      "lèvre"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Noa."
  },
  {
    "companionId": "sora",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t1_c01",
    "prompt": "Sora, la ferme lunaire, c'est chez toi ?",
    "companionReply": "Oui. Je lie les Myrions à la Ferme lunaire et je veille à ce qu'ils se sentent accueillis.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "ferme lunaire",
      "myrions",
      "accueil"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "sora",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t1_c02",
    "prompt": "Comment tu rends le refuge plus chaleureux ?",
    "companionReply": "Des noms doux, des pauses régulières, et des couvertures quand la nuit tombe sur la ferme.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "refuge",
      "pauses",
      "nuit"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "sora",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t2_c01",
    "prompt": "Tu me montrerais comment parler aux Myrions ?",
    "companionReply": "Parle lentement, regarde leurs oreilles. Ils comprennent le ton avant les mots.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "myrions",
      "ton",
      "apprentissage"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t2_c02",
    "prompt": "Pourquoi tu assignes un Myrion par activité ?",
    "companionReply": "Un poste clair, un rythme serein. La ferme lunaire avance mieux sans confusion.",
    "tone": "direct",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "assignation",
      "rythme",
      "ferme-lunaire"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t3_c01",
    "prompt": "Tu m'as prêté ton Myrion préféré pour une récolte, sérieux ?",
    "companionReply": "Il t'a choisi en frétillant. Je n'interdis pas une amitié qui fait bonne récolte.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "myrion",
      "récolte",
      "amitié"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t3_c02",
    "prompt": "On devrait installer un abri Myrion près du refuge ?",
    "companionReply": "Avec des coussins et une cloche douce. Les invités Disagrea adoreront les regarder dormir.",
    "tone": "playful",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "abri",
      "refuge",
      "coussins"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t4_c01",
    "prompt": "Tu m'as fait asseoir dans le foin en disant que c'était pour les Myrions.",
    "companionReply": "Petit mensonge tendre. Je voulais ta cuisse contre la mienne et ta main dans mes cheveux.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "ferme",
      "foin",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t4_c02",
    "prompt": "Sora… tu m'as embrassé le cou pendant que les Myrions dormaient.",
    "companionReply": "Ils ronflent fort, heureusement. Moi, je voulais marquer la peau que je reconnaîtrai demain.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "cou",
      "embrasser",
      "nuit"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t5_c01",
    "prompt": "Si on restait seuls dans la grange jusqu'à l'aube…",
    "companionReply": "Je t'envelopperais dans ma couverture, je goûterais ta bouche sans hâte, et je ne penserais plus qu'aux filons.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "grange",
      "couverture",
      "bouche"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t5_c02",
    "prompt": "Dis-moi ce que tu veux vraiment, sans parler des Myrions.",
    "companionReply": "T'avoir contre moi, sentir tes mains glisser sous mon gilet, et dormir entrelacés quand le feu s'éteint.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "désir",
      "mains",
      "dormir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Sora."
  },
  {
    "companionId": "zelie",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t1_c01",
    "prompt": "Zelie, le salon des invités te convient-il vraiment ?",
    "companionReply": "Mieux qu'un trône lointain. Ici, les rumeurs du village valent des courriers royaux.",
    "tone": "direct",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "salon",
      "village",
      "rumeurs"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "zelie",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t1_c02",
    "prompt": "Tu observes le gacha comme un jeu de cour ?",
    "companionReply": "Comme un tirage de destinées légères. J'aime voir qui sourit sans calcul.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "gacha",
      "cour",
      "sourire"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "zelie",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t2_c01",
    "prompt": "Tu me confierais une rumeur vraie du havre ?",
    "companionReply": "Une seule : le marché cache un marchand honnête. Devine qui.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "rumeur",
      "marché",
      "confiance"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t2_c02",
    "prompt": "Pourquoi une duchesse exilée reste ici ?",
    "companionReply": "Parce qu'on m'accueille sans protocolaire. Même un titre s'efface devant une tasse partagée.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "exil",
      "accueil",
      "titre"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t3_c01",
    "prompt": "Tu m'as invité au salon sans prévenir, c'était un piège élégant ?",
    "companionReply": "Un piège de thé et de confidences. Tu es resté — j'ai gagné la partie.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "salon",
      "thé",
      "complicité"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t3_c02",
    "prompt": "On devrait organiser un salon ouvert au village ?",
    "companionReply": "Sans velvet rope. Juste des fauteuils, des histoires, et zéro jugement sur les curiosités du gacha.",
    "tone": "playful",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "salon",
      "village",
      "histoires"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t4_c01",
    "prompt": "Tu m'as fait entrer dans le salon et tu as verrouillé la porte « pour le protocole ».",
    "companionReply": "Protocole imaginaire. Je voulais tes lèvres sur les miennes sans être duchesse, juste femme.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "salon",
      "verrou",
      "lèvres"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t4_c02",
    "prompt": "Zélie… tu m'as caressé la mâchoire en disant que j'avais du sel sur la peau.",
    "companionReply": "J'ai menti. J'avais envie de te toucher comme on touche quelqu'on désire, pas comme on goûte un plat.",
    "tone": "direct",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "mâchoire",
      "désir",
      "contact"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t5_c01",
    "prompt": "Si tu m'invitais dans ta chambre ce soir, sans titre…",
    "companionReply": "Je te ferais asseoir sur le lit, je dénouerais ton col lentement, et je ne laisserais aucun protocolaire frapper.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "chambre",
      "lit",
      "intimité"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t5_c02",
    "prompt": "Qu'est-ce que tu murmures quand personne n'écoute ?",
    "companionReply": "Ton prénom contre mon cou, et la promesse de t'attirer plus près jusqu'à ce que tu oublies le havre.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "murmure",
      "cou",
      "promesse"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Zelie."
  },
  {
    "companionId": "etna",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t1_c01",
    "prompt": "Etna, invitée de la faille Disagrea, tu te plais ici ?",
    "companionReply": "Assez pour rester. Le gacha du havre est moins bruyant que chez moi, et ça me va.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "disagrea",
      "gacha",
      "invitée"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "etna",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t1_c02",
    "prompt": "Tu observes le prestige astral de loin, pourquoi ?",
    "companionReply": "Parce que je n'aime pas courir après des éclats. Je préfère voir qui tient le rythme.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "prestige",
      "rythme",
      "observation"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "etna",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t2_c01",
    "prompt": "Tu me laisserais voir ton vrai visage sans armure ?",
    "companionReply": "Peut-être. Si tu ne fais pas la tête de conquérant. Je ne suis pas un trophée.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "armure",
      "visage",
      "respect"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t2_c02",
    "prompt": "Qu'est-ce qui t'amuse dans le havre ?",
    "companionReply": "Les mortels qui croient que je vais tout brûler, puis me demandent conseil sur le gacha.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "havre",
      "humour",
      "gacha"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t3_c01",
    "prompt": "Tu m'as provoqué au billard avec des règles absurdes, avoue.",
    "companionReply": "Et tu as gagné quand même. Agaçant. Je reviens quand même demain.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "jeu",
      "provocation",
      "complicité"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t3_c02",
    "prompt": "On devrait parier sur la prochaine invitée du gacha ?",
    "companionReply": "Perdant paie un dessert. Mais je parie déjà sur quelqu'un qui revient toujours.",
    "tone": "playful",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "pari",
      "gacha",
      "invitée"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t4_c01",
    "prompt": "Etna… tu m'as plaqué contre le mur « pour me punir ».",
    "companionReply": "Ne fais pas l'innocent. J'avais envie de sentir ta respiration paniquée — et de te garder là.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "mur",
      "punition",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t4_c02",
    "prompt": "Tes doigts sont restés sur ma ceinture trop longtemps.",
    "companionReply": "Et les tiens n'ont pas reculé. Si tu veux que je continue, demande. Je ne supplie pas deux fois.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "ceinture",
      "contact",
      "audace"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t5_c01",
    "prompt": "Si je montais dans ta chambre ce soir, tu me laisserais entrer ?",
    "companionReply": "Je te tirerais à l'intérieur, je claquerais la porte, et je te ferais oublier que tu n'es pas mon sujet.",
    "tone": "direct",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "chambre",
      "portrait",
      "possession"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t5_c02",
    "prompt": "Dis-moi ce que tu veux vraiment, sans couronne.",
    "companionReply": "Ta bouche sur la mienne, tes mains dans mes cheveux, et une nuit où je ne domine personne d'autre que mon envie de toi.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "bouche",
      "nuit",
      "aveu"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Etna."
  },
  {
    "companionId": "flonne",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t1_c01",
    "prompt": "Flonne, invitée angélique, le refuge te plaît ?",
    "companionReply": "Oui ! C'est doux ici. Même le gacha semble vouloir faire des cadeaux gentils.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "refuge",
      "gacha",
      "invitée"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "flonne",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t1_c02",
    "prompt": "Tu encourages vraiment tout le monde à se reposer ?",
    "companionReply": "Toujours. Les héros du havre oublient parfois de s'asseoir. Je le rappelle avec un sourire.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "repos",
      "havre",
      "sourire"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "flonne",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t2_c01",
    "prompt": "Tu me montrerais ton coin préféré pour méditer ?",
    "companionReply": "Près du refuge, quand la lumière baisse. On peut y parler de choses simples.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "méditation",
      "refuge",
      "lumière"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t2_c02",
    "prompt": "Comment tu accueilles les autres invités Disagrea ?",
    "companionReply": "Avec du thé et de la patience. Même Etna finit par s'asseoir, parfois.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "invités",
      "thé",
      "patience"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t3_c01",
    "prompt": "Tu m'as offert un pansement avec des petits cœurs, sérieux ?",
    "companionReply": "Les bobos méritent aussi d'être jolis ! Et tu as souri, mission accomplie.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "pansement",
      "humour",
      "soin"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t3_c02",
    "prompt": "On devrait préparer un goûter au refuge pour les Myrions ?",
    "companionReply": "Des biscuits lunaires miniatures ! Sora approuvera, et Laharl fera semblant de ne pas aimer.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "goûter",
      "myrions",
      "refuge"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t4_c01",
    "prompt": "Flonne… tu m'as bandé les yeux « pour un exercice de confiance ».",
    "companionReply": "C'était un prétexte. Je voulais sentir tes lèvres hésiter près des miennes sans que tu puisses fuir.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "confiance",
      "lèvres",
      "proximité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t4_c02",
    "prompt": "Tu m'as serré contre toi en disant que j'avais froid.",
    "companionReply": "Tu n'avais pas froid. Moi non plus. J'avais juste envie de te sentir battre contre ma poitrine.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "étreinte",
      "poitrine",
      "aveu"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t5_c01",
    "prompt": "Si on dormait côte à côte au refuge, que ferais-tu ?",
    "companionReply": "Je glisserais ma main sous ta chemise, je t'embrasserais doucement, puis moins doucement, jusqu'à ce que tu restes.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "refuge",
      "embrasser",
      "nuit"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t5_c02",
    "prompt": "Dis-moi ce que ton cœur murmure quand je suis là.",
    "companionReply": "Qu'il veut ta chaleur, ta bouche, et le droit de te serrer sans excuse angélique.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "cœur",
      "chaleur",
      "désir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Flonne."
  },
  {
    "companionId": "laharl",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t1_c01",
    "prompt": "Laharl, tu viens au havre pour la chasse ou le titre ?",
    "companionReply": "Pour m'échauffer ! Le gacha m'amuse aussi, tant que personne ne me traite comme un boss de fin.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "chasse",
      "gacha",
      "invité"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "laharl",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t1_c02",
    "prompt": "Tu proposes vraiment la chasse pour te dégourdir ?",
    "companionReply": "Oui. Une bonne expédition vaut dix discours. Et je déteste rester assis trop longtemps.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "expédition",
      "énergie",
      "action"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "laharl",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t2_c01",
    "prompt": "Tu m'emmènerais en chasse sans fanfare ?",
    "companionReply": "Si tu suis le rythme et tu cries moins que Seren ne le craindrait. Deal ?",
    "tone": "playful",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "chasse",
      "rythme",
      "deal"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t2_c02",
    "prompt": "Qu'est-ce qui t'surprend dans le havre ?",
    "companionReply": "Les gens gentils. Je m'y fais. Ne le répète pas trop fort.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "surprise",
      "gentillesse",
      "havre"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t3_c01",
    "prompt": "Tu m'as lancé un défi absurde sur le terrain, avoue.",
    "companionReply": "Et tu as presque gagné ! Presque. Revanche demain, même heure, même arrogance.",
    "tone": "playful",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "défi",
      "revanche",
      "humour"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t3_c02",
    "prompt": "On parie sur la prochaine prise du gacha ?",
    "companionReply": "Perdant porte le surnom ridicule. Spoiler : j'en ai déjà un, donc je risque peu.",
    "tone": "playful",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "pari",
      "gacha",
      "surnom"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t4_c01",
    "prompt": "Laharl… tu m'as provoqué en m'attrapant le col.",
    "companionReply": "Et tu n'as pas lâché. Bien. J'avais envie de sentir si tu tremblerais ou si tu me tirerais plus près.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "col",
      "provocation",
      "désir"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t4_c02",
    "prompt": "Tu m'as jeté sur le lit du refuge « pour récupérer ».",
    "companionReply": "Récupérer quoi ? J'voulais ton souffle dans mon cou et ta main qui refuse de reculer.",
    "tone": "playful",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "refuge",
      "lit",
      "souffle"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t5_c01",
    "prompt": "Si on restait seuls après la chasse, que ferais-tu ?",
    "companionReply": "Je t'écraserais contre moi — pas pour gagner. Pour sentir ta bouche, ta chaleur, et te faire rester.",
    "tone": "direct",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "chasse",
      "bouche",
      "chaleur"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t5_c02",
    "prompt": "Dis-le sans fanfare : qu'est-ce que tu veux ?",
    "companionReply": "T'avoir à califourchon sur mes genoux, entendre mon prénom rauque, et zéro audience.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "genoux",
      "désir",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Laharl."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t1_c01",
    "prompt": "Pleinair, tu es toujours aussi silencieux au refuge ?",
    "companionReply": "…Un hochement. Oui. Le silence laisse entendre le prestige astral sans le bruit du village.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "silence",
      "refuge",
      "prestige"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "pleinair",
    "affinityTier": 1 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t1_c02",
    "prompt": "Tu m'observes ou tu me protèges ?",
    "companionReply": "Les deux. Une main légère sur l'épaule, puis retour au calme. C'est ma réponse.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "observation",
      "protection",
      "calme"
    ],
    "intimacyLevel": 1 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true
  },
  {
    "companionId": "pleinair",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t2_c01",
    "prompt": "Tu me ferais signe si quelque chose clochait au havre ?",
    "companionReply": "Un geste net, deux doigts levés. Tu as déjà vu ce signal près du refuge. Tu sauras.",
    "tone": "direct",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "signal",
      "havre",
      "refuge"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 2 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t2_c02",
    "prompt": "Pourquoi tu restes près des invités Disagrea ?",
    "companionReply": "…Parce qu'on comprend le poids des étoiles sans parler. Même Etna se tait parfois.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "invités",
      "étoiles",
      "compréhension"
    ],
    "intimacyLevel": 2 as 1 | 2 | 3 | 4 | 5,
    "repeatable": true,
    "unlockHint": "Atteins l'affinité 2 (Confiance) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t3_c01",
    "prompt": "Tu m'as laissé ton siège au refuge, c'était voulu ?",
    "companionReply": "Un petit signe : « assieds-toi ». Tu as compris sans mot. J'ai souri, discrètement.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "siège",
      "geste",
      "complicité"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 3 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t3_c02",
    "prompt": "On devrait laisser une trace de toi au village ?",
    "companionReply": "…Une empreinte dans la poussière suffit. Les empreilles disparaissent, l'habitude reste.",
    "tone": "playful",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "trace",
      "village",
      "habitude"
    ],
    "intimacyLevel": 3 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 3 (Complicité) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t4_c01",
    "prompt": "Pleinair… tu m'as tiré dans l'ombre et tu m'as gardé contre toi.",
    "companionReply": "…Oui. Pas pour te cacher. Pour sentir ton cœur. Tu as compris sans que je parle.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "ombre",
      "cœur",
      "silence"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t4_c02",
    "prompt": "Tes doigts sur ma nuque, c'était un signe ?",
    "companionReply": "…Un oui. Je voulais te toucher. Tu es resté. J'ai respiré plus fort.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "nuque",
      "contact",
      "aveu"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t5_c01",
    "prompt": "Si on dormait côte à côte au refuge, sans un mot…",
    "companionReply": "…Je poserais ma main sur ton ventre. Je t'attirerais. Je ne lâcherais pas avant l'aube.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "refuge",
      "ventre",
      "nuit"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t5_c02",
    "prompt": "Dis-moi ce que tu désires, même en silence.",
    "companionReply": "…Ta bouche. Ta chaleur. Dormir entrelacés. Tu es déjà la réponse.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "bouche",
      "chaleur",
      "lien"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Pleinair."
  }
]
