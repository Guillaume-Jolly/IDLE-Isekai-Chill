# Roric — Précepteur de lames (dominant)

> **Statut :** fiche design · **pas d’assets** · **pas intégré runtime**  
> **ID :** `roric` · **Genre présenté :** masculin · **Dynamic lien :** `companion_dominant`

---

## En une phrase

Un maître d’armes au calme de glace : il ne crie jamais, il **décide** — et chaque geste ressemble à un duel où tu as déjà gagné le droit d’être sur le tapis.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Roric |
| **Nom complet (lore)** | Roric des Trois-Gardes |
| **Âge apparent** | 28–32 |
| **Archétype jeu** | Précepteur de lames |
| **Lieu** | La salle des lames (annexe du havre, près des murailles — tapis de sisal, racks d’armes, bougies sans fumée) |
| **Accent UI** | `#8b2e3a` (grenat fer) |
| **Cadeau favori** | Gantelets de cuir ombre |
| **Talent passif** | +renom après chasse / mini-jeux de combat |
| **Ressource bonus** | `renown` |
| **Systèmes liés** | `hunt`, `village`, `refuge` |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| 6 | 5 | **9** | 5 | 5 |

**Stat primaire :** Vigueur

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| 7 | **2** | **10** | **5** |

**`personalityHint` :** Roric est un précepteur de lames — précis, calme, jamais théâtral ; il commande par le tempo et le regard, pas par le volume. Le consentement est un **protocole** (signaux, pauses), pas une négociation interminable.

---

## Personnalité (haut en couleur)

### Traits forts

- **Velours sur acier** — voix basse, phrases courtes, silences qui pèsent plus que les ordres.
- **Ritualiste** — nomme les étapes (« respire », « présente », « attends ») comme en salle d’armes.
- **Protecteur froid** — te place toujours dos au mur *lui* face à la porte ; vérifie les sorties avant de se détendre.
- **Honneur du havre** — méprise la cruauté gratuite ; domination = cadre, pas humiliation.

### Tics & voix

- Appelle le joueur **« recrue »** jusqu’à affinité 3, puis le prénom — jamais de surnoms mignons.
- Compte les secondes d’immobilité à voix basse quand il te fait attendre (pas gamey en jeu : « un instant », « encore »).
- **Ne sourit qu’avec les yeux** ; un vrai sourire = événement narratif rare (aff. 4+).
- Sent le cuir, l’encens froid et la poudre de pierre après l’entraînement.

### Contraste avec les autres

| vs Kael | vs Finn | vs Lyra |
|---------|---------|---------|
| Masculin assumé, pas androgyne | Dom vs sub | Physique vs intellectuel |
| Direct > playful | Calme vs chaos | Salle d’armes vs bibliothèque |
| Contrôle sobre vs spectacle | Acier vs cuivre | Ordres vs mots |

---

## Apparence (brief assets — à générer)

### Silhouette & palette

- **Corpulence :** grand, épaules larges, posture militaire sans armure lourde.
- **Cheveux :** noir charbon, mèche argentée sur la tempe gauche, court côtés, légèrement long sur le dessus.
- **Yeux :** ambre / noisette, regard fixe, paupières lourdes.
- **Peau :** hâlé clair, **cicatrice fine** sur l’arête du nez, jointures des mains marquées.
- **Tenue aff. 1 :** veste de duel croisée, ceinture à boucles, bottes montantes ; pas de cape inutile.
- **Accessoire signature :** râpe d’entraînement en bois sombre (pas d’épée nue en portrait public).

### Paliers affinité (direction art)

| Niv. | Direction |
|------|-----------|
| 1 | Salle des lames, jour, veste de travail, regard évaluateur |
| 2 | Entraînement au crépuscule, manches retroussées, sueur légère, respect mutuel |
| 3 | Vestiaire du havre, chemise ouverte au col, fatigue contenue, confiance |
| 4 | Chambre austère — bougies, chemise de lin, poignet = signal, cadre dominant explicite mais suggestif |
| 5 | Même lieu, lien max — confiance totale, tenue aff. 4 poussée, regard « tu m’as choisi » |

**Émotions cutout prioritaires :** `commanding`, `firm`, `focused`, `heated`, `pleased`, `dominant` (pack intime futur).

---

## Arc narratif & affinité

| Aff. | Beat | Résumé |
|------|------|--------|
| 1 | **Première passe d’armes** | Il te teste sans prévenir — pas pour humilier, pour voir si tu tiens le tempo. |
| 2 | **Contrat informel** | Il t’apprend un signal d’arrêt ; respecte-le à la lettre une fois. |
| 3 | **Hors du tapis** | Une conversation sans râpe ; il admet que le havre l’a « rendu trop vigilant ». |
| 4 | **Protocole du soir** | Cadre adulte : il mène, tu signales ; tension dans les pauses, pas dans les cris. |
| 5 | **Lame rangée** | Il cède *une* vulnérabilité choisie (fatigue, insomnie, confiance) — toujours dans le cadre. |

**`powerDynamic` intime (aff. 4–5) :** `companion_dominant` constant.  
**Safeword diegetic :** deux tapes sur le poignet ou mot « **casse** » (à réserver échange Stop dédié si besoin).

---

## Exemples de répliques (ton)

**Aff. 1 — direct :** « Encore une fois. Cette fois, tu attends mon signal avant de bouger. »  
**Aff. 2 — sincere :** « Tu as bien tapé. Je m’arrête. C’est ça que je voulais vérifier. »  
**Aff. 3 — romantic :** « Reste. Pas pour l’entraînement — pour que je sente que tu ne pars pas. »  
**Aff. 4 — commanding :** « Mains sur le bois. Tu ne relèves les yeux que quand je te le dis. »  
**Aff. 5 — firm + tendresse :** « Je te garde ce rythme toute la nuit si tu le demandes. Sans bruit. Sans public. »

---

## Graines bonds (MVP — 2 échanges aff. 1)

```text
Prompt : « Roric, tu comptes vraiment les pas quand on traverse le havre ? »
Réponse : « Je compte les sorties. Le reste, c’est du bruit. »
Ton : direct · Tags : havre, vigilance, salle-des-lames

Prompt : « Pourquoi tu entraînes des recrues gratos ? »
Réponse : « Parce que quelqu’un m’a appris à tenir debout. Je rends la dette, pas la morale. »
Ton : sincere · Tags : dette, entraînement, village
```

---

## Writer — Parler curé (futur aff. 4–5)

- **Registre :** cru mais **sobre** — pas de lyrisme fleuri ; verbes d’action, tempo, contact.
- **Choix MC +3 romantic :** obéissance *choisie*, pas passivité paresseuse.
- **Choix playful :** il borne vite (« Pas de jeu. Reprends la position. ») — LQ7 playful rare.
- **Spectateur :** peu d’échanges publics ; si présent, chuchoté + contrôle du rythme.
- **À éviter :** humiliation, violence non consentie, confusion avec Seren (chevalière *paisible*).

---

## Intégration code (quand assets prêts)

```ts
// profiles.ts (extrait)
roric: {
  id: 'roric',
  name: 'Roric',
  place: 'la salle des lames',
  personalityHint: 'Roric est précepteur de lames — calme, direct, cadre et signaux ; domination sobre, jamais cruelle.',
  toneWeights: { sincere: 7, playful: 2, direct: 10, romantic: 5 },
}
```

```ts
// App.tsx (extrait)
{
  id: 'roric',
  name: 'Roric',
  archetype: 'Precepteur de lames',
  talent: '+renom apres la chasse',
  favoriteGift: 'Gantelets de cuir ombre',
  bonusResource: 'renown',
  scenes: makeScenes('Roric', 'la salle des lames', 'cour de nuit'),
}
```
