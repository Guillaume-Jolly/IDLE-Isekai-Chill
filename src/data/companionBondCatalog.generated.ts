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
    "prompt": "Parfois je me sens perdu entre toutes les quêtes du havre.",
    "companionReply": "Moi aussi, au début. Une récolte, une page, un ami — le reste peut attendre.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "conseil",
      "havre",
      "patience"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t4_c02",
    "prompt": "Y a-t-il quelque chose que tu n'as jamais dit au village ?",
    "companionReply": "J'ai failli repartir la semaine de mon arrivée. Tu as retardé cette valise.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "secret",
      "rester",
      "gratitude"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t5_c01",
    "prompt": "Si tu ne gardais qu'un seul livre ici, lequel serait-ce ?",
    "companionReply": "Celui où j'ai griffonné ton nom en marge. Ne le cherche pas, je le cache bien.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "livre",
      "marge",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Lyra."
  },
  {
    "companionId": "lyra",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "lyra_t5_c02",
    "prompt": "Qu'est-ce que tu vois quand tu me regardes ?",
    "companionReply": "Quelqu'un qui lit entre les lignes du monde, pas seulement des parchemins.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "inventory",
      "village"
    ],
    "tags": [
      "regard",
      "compréhension",
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
    "prompt": "As-tu déjà regretté un échange ici ?",
    "companionReply": "Une fois, j'ai cédé un fragment rare à quelqu'un qui est parti trop vite. Depuis, j'attends qu'on revienne.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "regret",
      "fragment",
      "attente"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t4_c02",
    "prompt": "Pourquoi tu restes au havre alors que tu connais d'autres routes ?",
    "companionReply": "Parce que certaines routes mènent à des comptoirs vides. Ici, il y a des visages que je ne veux pas perdre.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "rester",
      "routes",
      "visages"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t5_c01",
    "prompt": "Si tu fermais ta boutique demain, que ferais-tu ?",
    "companionReply": "J'ouvrirais une table pour deux, sans étiquette de prix. Tu serais invité en premier.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "boutique",
      "invitation",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Maeve."
  },
  {
    "companionId": "maeve",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "maeve_t5_c02",
    "prompt": "Quel trésor du havre tu protèges le plus ?",
    "companionReply": "Les habitudes qu'on tisse sans contrat. Elles ne s'échangent pas, elles se gardent.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "inventory",
      "gacha"
    ],
    "tags": [
      "trésor",
      "habitude",
      "lien"
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
    "prompt": "As-tu déjà douté de ta place ici ?",
    "companionReply": "Oui. Puis j'ai vu un enfant du village rire sans peur. C'est une victoire aussi.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "doute",
      "village",
      "victoire"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t4_c02",
    "prompt": "Y a-t-il quelqu'un que tu veux protéger en priorité ?",
    "companionReply": "Ceux qui reviennent me saluer après une expédition. Toi inclus, si tu m'écoutes.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "protection",
      "retour",
      "priorité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t5_c01",
    "prompt": "Si le havre était attaqué, où te placerais-tu ?",
    "companionReply": "Entre la menace et toi. Ce n'est pas un serment officiel, c'est un choix déjà fait.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "serment",
      "choix",
      "garde"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Seren."
  },
  {
    "companionId": "seren",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "seren_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Savoir qu'on peut baisser la garde sans devenir vulnérable aux yeux de l'autre.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "village"
    ],
    "tags": [
      "lien",
      "garde",
      "confiance"
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
    "prompt": "As-tu peur de ne plus avoir assez à partager un jour ?",
    "companionReply": "Parfois. Alors je me rappelle pourquoi j'ai ouvert ma marmite au havre : personne ne mange seul ici.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "peur",
      "partage",
      "havre"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t4_c02",
    "prompt": "Quel souvenir de cuisine tu gardes en secret ?",
    "companionReply": "La première fois où tu as dit que ça sentait comme chez toi. J'ai failli pleurer dans le bouillon.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "souvenir",
      "odeur",
      "bouillon"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t5_c01",
    "prompt": "Si tu ne pouvais préparer qu'un dernier repas ici, ce serait quoi ?",
    "companionReply": "Ce qu'on mange assis côte à côte, sans chrono. Le menu importe moins que la main qui reste.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "repas",
      "main",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Nami."
  },
  {
    "companionId": "nami",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "nami_t5_c02",
    "prompt": "Qu'est-ce que tu vois en moi, Nami ?",
    "companionReply": "Quelqu'un qui revient à table même quand la journée a été dure. C'est déjà un cadeau rare.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "retour",
      "table",
      "cadeau"
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
    "prompt": "As-tu déjà perdu une récolte qui comptait pour toi ?",
    "companionReply": "Une once de rêve bleu, après une nuit sans sommeil. J'ai appris à demander de l'aide avant la fonte.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "récolte",
      "perte",
      "aide"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t4_c02",
    "prompt": "Pourquoi tu restes rêveuse alors que le havre travaille dur ?",
    "companionReply": "Parce que certains rêves deviennent des graines. Tu en as planté un en moi sans le savoir.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "rêve",
      "graine",
      "tendresse"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t5_c01",
    "prompt": "Si tu ne gardais qu'une seule fleur ici, laquelle ?",
    "companionReply": "Celle que tu m'as aidée à sauver du gel. Elle fleurit encore du côté où tu t'assieds.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "fleur",
      "gel",
      "souvenir"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Iris."
  },
  {
    "companionId": "iris",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "iris_t5_c02",
    "prompt": "Que ressens-tu quand on est silencieux ensemble au jardin ?",
    "companionReply": "Que le havre respire mieux. Comme si nos racines se touchaient sous la terre.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "inventory"
    ],
    "tags": [
      "silence",
      "racines",
      "lien"
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
    "prompt": "As-tu déjà eu peur de ne plus faire rire personne ?",
    "companionReply": "Oui, après une soirée vide. Puis tu as applaudi trop fort pour rien — j'ai retrouvé la scène.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "peur",
      "applaudir",
      "scène"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t4_c02",
    "prompt": "Derrière le masque, qui es-tu vraiment ?",
    "companionReply": "Quelqu'un qui cherche encore la bonne note pour dire merci sans en faire un spectacle.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "masque",
      "merci",
      "vulnérabilité"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t5_c01",
    "prompt": "Si tu ne chantais plus qu'une seule phrase ici, laquelle ?",
    "companionReply": "« Reste encore un peu. » Simple, sincère, et assez fort pour remplir le théâtre.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "chant",
      "rester",
      "sincérité"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Kael."
  },
  {
    "companionId": "kael",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "kael_t5_c02",
    "prompt": "Qu'est-ce que tu retiens de nous deux ?",
    "companionReply": "Une improvisation où ni l'un ni l'autre n'a trébuché. C'est rare, et précieux.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "village"
    ],
    "tags": [
      "improvisation",
      "souvenir",
      "précieux"
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
    "prompt": "As-tu déjà brûlé une pièce qui comptait ?",
    "companionReply": "Une charnière pour un abri du refuge. J'ai recommencé en silence, puis demandé de l'aide.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "échec",
      "refuge",
      "aide"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t4_c02",
    "prompt": "Qu'est-ce qui te fait rester ici plutôt qu'ailleurs ?",
    "companionReply": "Des mains qui reviennent avec leurs outils cassés et leurs histoires intactes. Comme les tiennes.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "rester",
      "mains",
      "histoires"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t5_c01",
    "prompt": "Si tu ne forgeais qu'un dernier objet pour le havre ?",
    "companionReply": "Une broche discrète pour marquer qu'on appartient au même feu, sans fanfare.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "broche",
      "feu",
      "appartenance"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Runa."
  },
  {
    "companionId": "runa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "runa_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Tenir le métal chaud ensemble sans se brûler. La confiance, c'est aussi de la technique.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "village"
    ],
    "tags": [
      "lien",
      "confiance",
      "technique"
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
    "prompt": "As-tu déjà douté de ta foi dans ce havre ?",
    "companionReply": "Oui, quand la brume a caché la source. Puis quelqu'un est venu boire sans rien demander — j'ai compris.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "foi",
      "brume",
      "compréhension"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t4_c02",
    "prompt": "Y a-t-il une prière que tu dis pour moi en secret ?",
    "companionReply": "Une seule : que tu trouves la paix avant la performance. Tu fais déjà assez.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "prière",
      "paix",
      "tendresse"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t5_c01",
    "prompt": "Si tu ne gardais qu'un souvenir de la source, lequel ?",
    "companionReply": "Le jour où tu t'es assis à mes côtés sans vouloir guérir le monde entier.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "souvenir",
      "source",
      "présence"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Solene."
  },
  {
    "companionId": "solene",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "solene_t5_c02",
    "prompt": "Que ressens-tu quand nos silences se ressemblent ?",
    "companionReply": "Que le havre nous reconnaît. Deux gouttes qui tombent au même instant.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "prestige"
    ],
    "tags": [
      "silence",
      "reconnaissance",
      "lien"
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
    "prompt": "As-tu déjà eu peur de te perdre loin du havre ?",
    "companionReply": "Une fois, oui. Puis j'ai entendu la cloche du village au loin. J'ai su que je pouvais revenir.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "peur",
      "village",
      "retour"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t4_c02",
    "prompt": "Pourquoi tu fais confiance à mes cartes improvisées ?",
    "companionReply": "Parce que tu marques les endroits où tu t'es arrêté pour m'attendre. C'est une carte du cœur.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "carte",
      "confiance",
      "cœur"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t5_c01",
    "prompt": "Si tu ne pouvais plus explorer qu'un seul chemin ici ?",
    "companionReply": "Celui qui mène vers toi après une longue journée. Même sans trésor au bout.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "chemin",
      "retour",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Talia."
  },
  {
    "companionId": "talia",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "talia_t5_c02",
    "prompt": "Qu'est-ce que l'aventure t'a appris sur nous ?",
    "companionReply": "Qu'on avance mieux quand personne ne court devant l'autre pour briller.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "hunt"
    ],
    "tags": [
      "aventure",
      "rythme",
      "lien"
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
    "prompt": "As-tu déjà déchiré une œuvre qui te tenait à cœur ?",
    "companionReply": "Un linceul trop serré pour un Myrion anxieux. J'ai recommencé en écoutant ses peurs.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "œuvre",
      "myrion",
      "écoute"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t4_c02",
    "prompt": "Quel fil te relie le plus au havre ?",
    "companionReply": "Celui que tu m'as tendu quand j'hésitais à exposer mes broderies. Tu as cru en elles.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "fil",
      "broderie",
      "croyance"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t5_c01",
    "prompt": "Si tu ne tissais qu'un dernier motif ici, lequel ?",
    "companionReply": "Deux lignes parallèles qui se croisent une fois, puis continuent ensemble. Simple et vrai.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "motif",
      "parallèle",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Mira."
  },
  {
    "companionId": "mira",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "mira_t5_c02",
    "prompt": "Que vois-tu quand tu me regardes travailler ?",
    "companionReply": "Quelqu'un qui laisse des traces dignes d'être brodées. Je n'ai pas fini le tableau.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "inventory"
    ],
    "tags": [
      "regard",
      "broderie",
      "lien"
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
    "prompt": "As-tu déjà failli perdre une source ?",
    "companionReply": "Une fois, un filon trop agressif l'a troublée. J'ai appris à négocier avec le prestige, pas le dompter.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "source",
      "filon",
      "prestige"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t4_c02",
    "prompt": "Pourquoi tu me fais confiance près de l'eau ?",
    "companionReply": "Parce que tu y mets les mains lentement, comme si tu comprenais ce qui vit dessous.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "confiance",
      "eau",
      "respect"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t5_c01",
    "prompt": "Si tu ne protégeais qu'une chose ici, ce serait quoi ?",
    "companionReply": "Notre promesse de revenir boire ensemble après les longues journées. C'est une source aussi.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "promesse",
      "boire",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Asha."
  },
  {
    "companionId": "asha",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "asha_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Deux courants qui se rejoignent sans noyer l'autre. Rares, et clairs.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "courant",
      "lien",
      "clarté"
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
    "prompt": "Y a-t-il une page que tu n'oses pas classer ?",
    "companionReply": "Un témoignage sur toi, laissé par un voisin. Je l'ai lue trois fois avant de trouver le bon tiroir.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "témoignage",
      "page",
      "émotion"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t4_c02",
    "prompt": "Pourquoi tu m'as confié l'accès à la réserve ?",
    "companionReply": "Parce que tu refermes toujours les portes. La confiance, chez moi, se mesure aux petits gestes.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "réserve",
      "confiance",
      "gestes"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t5_c01",
    "prompt": "Si tu ne gardais qu'une entrée d'archive sur nous ?",
    "companionReply": "« Arrivée en paire, départ jamais seul. » Court, exact, suffisant.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "archive",
      "entrée",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Elwen."
  },
  {
    "companionId": "elwen",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "elwen_t5_c02",
    "prompt": "Que retiens-tu de moi dans tes registres ?",
    "companionReply": "Quelqu'un qui pose des questions justes. C'est la meilleure forme de respect pour un archiviste.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "village"
    ],
    "tags": [
      "registre",
      "questions",
      "respect"
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
    "prompt": "As-tu déjà eu peur de tes propres mélanges ?",
    "companionReply": "Une fois. Depuis, je note mes doutes sur le même carnet que mes recettes.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "doute",
      "carnet",
      "recettes"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t4_c02",
    "prompt": "Pourquoi tu me montres tes échecs en alchimie ?",
    "companionReply": "Parce qu'avec toi, un raté devient une blague, pas une honte. C'est rare et précieux.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "échec",
      "blague",
      "confiance"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t5_c01",
    "prompt": "Si tu ne créais qu'une dernière potion ici, ce serait quoi ?",
    "companionReply": "Une goutte de « reste ce soir ». Sans effet secondaire, juste du cœur.",
    "tone": "romantic",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "potion",
      "rester",
      "cœur"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Noa."
  },
  {
    "companionId": "noa",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "noa_t5_c02",
    "prompt": "Qu'est-ce que tu vois en moi, Noa ?",
    "companionReply": "Mon partenaire de chaos gentil. Ensemble, on renverse moins de flacons.",
    "tone": "sincere",
    "relatedSystems": [
      "inventory",
      "gacha"
    ],
    "tags": [
      "partenaire",
      "chaos",
      "lien"
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
    "prompt": "As-tu déjà craint de ne pas en faire assez pour eux ?",
    "companionReply": "Souvent. Puis un Myrion s'endort sur mes genoux, et je sais que c'est déjà beaucoup.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "doute",
      "myrion",
      "réconfort"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t4_c02",
    "prompt": "Pourquoi tu me confies tes Myrions fatigués ?",
    "companionReply": "Parce que tu les poses doucement, comme des promesses. Je n'oublie pas ce geste.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "confiance",
      "geste",
      "promesse"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t5_c01",
    "prompt": "Si tu ne gardais qu'un souvenir de la ferme lunaire ?",
    "companionReply": "Le jour où tu as attendu avec moi qu'un petit Myrion fasse ses premiers pas.",
    "tone": "romantic",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "souvenir",
      "premiers pas",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Sora."
  },
  {
    "companionId": "sora",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "sora_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Partager le silence des créatures qui nous font confiance. Et tenir la main humaine aussi.",
    "tone": "sincere",
    "relatedSystems": [
      "moon-farm",
      "refuge"
    ],
    "tags": [
      "silence",
      "confiance",
      "lien"
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
    "prompt": "As-tu déjà regretté ton exil ?",
    "companionReply": "Parfois la nuit. Puis je vois le havre tenir debout sans couronne, et je respire.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "exil",
      "regret",
      "havre"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t4_c02",
    "prompt": "Pourquoi tu baisses la garde avec moi ?",
    "companionReply": "Parce que tu ne demandes jamais de performance. Tu demandes une personne.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "garde",
      "personne",
      "tendresse"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t5_c01",
    "prompt": "Si tu ne gardais qu'un bijou ici, lequel ?",
    "companionReply": "Une épingle sans armoiries, offerte par toi. Elle vaut plus qu'un sceptre.",
    "tone": "romantic",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "bijou",
      "épingle",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Zelie."
  },
  {
    "companionId": "zelie",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "zelie_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Choisir quelqu'un sans alliance ni contrat. Juste la volonté de revenir.",
    "tone": "sincere",
    "relatedSystems": [
      "village",
      "gacha"
    ],
    "tags": [
      "lien",
      "choix",
      "revenir"
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
    "prompt": "As-tu déjà eu peur de redevenir seule ?",
    "companionReply": "Oui. Même une reine démoniaque a des nuits trop longues. Ne t'en va pas trop vite.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "peur",
      "solitude",
      "nuit"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t4_c02",
    "prompt": "Pourquoi tu restes quand tu pourrais partir ?",
    "companionReply": "Parce que tu me traites comme une voisine, pas comme une légende. C'est neuf, et bon.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "rester",
      "voisine",
      "légende"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t5_c01",
    "prompt": "Si tu ne gardais qu'un souvenir du havre ?",
    "companionReply": "Le soir où tu as ri de ma blague sans trembler. J'ai senti un trône différent.",
    "tone": "romantic",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "souvenir",
      "rire",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Etna."
  },
  {
    "companionId": "etna",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "etna_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Quelqu'un qui ne fuit pas quand je baisse la voix. Rare, donc précieux.",
    "tone": "sincere",
    "relatedSystems": [
      "gacha",
      "prestige"
    ],
    "tags": [
      "lien",
      "voix",
      "précieux"
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
    "prompt": "As-tu déjà douté de ta bonté ici ?",
    "companionReply": "Quand j'ai voulu guérir trop vite. J'ai appris qu'écouter vaut parfois mieux qu'un sort.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "doute",
      "écoute",
      "guérison"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t4_c02",
    "prompt": "Pourquoi tu passes du temps avec moi sans mission ?",
    "companionReply": "Parce que tu me laisses être simple. Pas seulement l'ange du refuge.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "simplicité",
      "présence",
      "tendresse"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t5_c01",
    "prompt": "Si tu ne pouvais offrir qu'un dernier réconfort ici ?",
    "companionReply": "Une étreinte légère et le mot « reste ». Le havre a déjà assez de bruit.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "réconfort",
      "rester",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Flonne."
  },
  {
    "companionId": "flonne",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "flonne_t5_c02",
    "prompt": "Que vois-tu en moi, Flonne ?",
    "companionReply": "Quelqu'un qui protège les autres et oublie parfois de se protéger. Je veille aussi.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "gacha"
    ],
    "tags": [
      "protection",
      "veille",
      "lien"
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
    "prompt": "As-tu déjà eu peur de ne pas être à la hauteur ?",
    "companionReply": "…Oui. Même un overlord doute. Toi, tu es resté. Ça compte plus qu'une victoire.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "doute",
      "overlord",
      "présence"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t4_c02",
    "prompt": "Pourquoi tu reviens me voir après une chasse ?",
    "companionReply": "Parce que tu m'accueilles sans courber l'échine. C'est rare, et ça me plaît.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "retour",
      "accueil",
      "respect"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t5_c01",
    "prompt": "Si tu ne pouvais garder qu'un trophée du havre ?",
    "companionReply": "Pas un trophée. Juste le souvenir d'une chasse où on a ri au lieu de compter les points.",
    "tone": "romantic",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "souvenir",
      "chasse",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Laharl."
  },
  {
    "companionId": "laharl",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "laharl_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Un rival qui devient allié sans perdre sa fierté. Toi, tu y arrives.",
    "tone": "sincere",
    "relatedSystems": [
      "hunt",
      "gacha"
    ],
    "tags": [
      "lien",
      "fierté",
      "allié"
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
    "prompt": "As-tu déjà eu peur de disparaître dans le bruit du havre ?",
    "companionReply": "…Oui. Puis tu t'es assis à côté de moi sans demander un mot. J'ai respiré.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "peur",
      "présence",
      "respiration"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 4 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t4_c02",
    "prompt": "Pourquoi tu me fais confiance sans parler ?",
    "companionReply": "Parce que tu écoutes aussi le silence. Peu le font. Toi, oui.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "confiance",
      "silence",
      "écoute"
    ],
    "intimacyLevel": 4 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 4 (Confidence) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t5_c01",
    "prompt": "Si tu ne pouvais me laisser qu'un dernier signe ici ?",
    "companionReply": "…Deux mains jointes, puis un pouce levé. « On reste. » Sans bruit, mais vrai.",
    "tone": "romantic",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "signe",
      "rester",
      "intime"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Pleinair."
  },
  {
    "companionId": "pleinair",
    "affinityTier": 5 as 1 | 2 | 3 | 4 | 5,
    "conversationId": "pleinair_t5_c02",
    "prompt": "Que signifie pour toi un lien profond ?",
    "companionReply": "Être là, même sans voix. Tu l'es aussi pour moi. C'est suffisant.",
    "tone": "sincere",
    "relatedSystems": [
      "refuge",
      "prestige"
    ],
    "tags": [
      "lien",
      "présence",
      "voix"
    ],
    "intimacyLevel": 5 as 1 | 2 | 3 | 4 | 5,
    "repeatable": false,
    "unlockHint": "Atteins l'affinité 5 (Lien profond) avec Pleinair."
  }
]
