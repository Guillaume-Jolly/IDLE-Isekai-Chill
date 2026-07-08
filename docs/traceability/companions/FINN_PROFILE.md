# Finn — Saltimbanque des quais (submissif)

> **Statut :** fiche design · **pas d’assets** · **pas intégré runtime**  
> **ID :** `finn` · **Genre présenté :** masculin · **Dynamic lien :** MC-led / `companion_invites` (il offre, tu mènes)

---

## En une phrase

Un acrobate des quais qui fait le clown pour le port entier — et qui, à deux, **demande la permission** comme d’autres demandent l’heure, les yeux trop brillants, les mains déjà prêtes à obéir.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Finn |
| **Nom complet (lore)** | Finn Éclat-des-Quais |
| **Âge apparent** | 22–26 |
| **Archétype jeu** | Saltimbanque des quais |
| **Lieu** | Les quais des lanternes (arrière du théâtre du voyageur — cordes, caisses, reflets d’eau, rires lointains) |
| **Accent UI** | `#2ab8a8` (cuivre-mer) |
| **Cadeau favori** | Ruban de scène déchiré |
| **Talent passif** | +tickets événement / festivals |
| **Ressource bonus** | `tickets` |
| **Systèmes liés** | `gacha`, `village`, `moon-farm` |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| **8** | 6 | 4 | **7** | 5 |

**Stat primaire :** Charme

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| **9** | 7 | **3** | **8** |

**`personalityHint` :** Finn est saltimbanque — théâtral en public, docile et sincère en privé ; il aime qu’on lui dise quoi faire et **fleurit sous les compliments**. Le direct brut le fait se rétracter ; le sincere et le romantic le font s’ouvrir.

---

## Personnalité (haut en couleur)

### Traits forts

- **Double rideau** — cabotin sur les quais, voix qui tremble dès que la foule disparaît.
- **Plaisir de plaire** — demande « comme ça ? », « encore ? », « tu veux que je… » avec une honnêteté désarmante.
- **Chaos tendre** — jongle quand il stresse ; laisse tomber une balle, rit de lui-même, recommence.
- **Loyauté de dock** — protège les gamins des quais ; sous sa timidité, il sait se battre (mal) pour les siens.

### Tics & voix

- **« Mon étoile »** pour le joueur dès aff. 2 (pas avant — trop vite = creepy).
- Collectionne des **billets d’excuse** qu’il n’envoie jamais — trouvailles aff. 3 (quête ambiance).
- Oreilles en cuivre (bijou) **asymétrique** — un long, un court ; se touche l’oreille quand il ment.
- Rire un peu trop fort, puis s’excuse en murmurant.

### Contraste avec les autres

| vs Kael | vs Roric | vs Nami |
|---------|----------|---------|
| Masculin, pas androgyne | Sub vs dom | Performer vs cuisinière |
| Privé ≠ scène | Quais vs salle d’armes | Demande vs offre (nourriture) |
| Besoin de guidance | Chaos vs protocole | Timide sensuel vs chaleur maternelle |

---

## Apparence (brief assets — à générer)

### Silhouette & palette

- **Corpulence :** élancé, danseur / acrobate, musculature légère, mains expressives.
- **Cheveux :** boucles cuivre-roux, mèches rebelles, souvent en bataille.
- **Yeux :** vert d’eau, cils marqués, regard qui fuit puis revient.
- **Peau :** claire, **taches de rousseur** sur le nez et les épaules (aff. 2+).
- **Tenue aff. 1 :** gilet court, chemise blanche ouverte au cou, ceinture à poches, bottines usées ; écharpe **déchirée** volontairement stylée.
- **Accessoire signature :** trois balles colorées en pochette (ou ruban de scène au poignet).

### Paliers affinité (direction art)

| Niv. | Direction |
|------|-----------|
| 1 | Quais de jour, spectacle interrompu, surprise d’être abordé |
| 2 | Crépuscule sur l’eau, sourire nerveux, première vraie conversation sans public |
| 3 | Loge en désordre, maquillage effacé à moitié, vulnérabilité |
| 4 | Cabane de cordes / niche au chaud, chemise trop grande, soumis choisi, aftercare implicite |
| 5 | Lien max — confiance totale, il ose demander ce qu’il veut *après* t’avoir laissé mener |

**Émotions cutout prioritaires :** `shy`, `pleased`, `warm`, `embarrassed`, `romantic`, `lustful`, `happy`.

---

## Arc narratif & affinité

| Aff. | Beat | Résumé |
|------|------|--------|
| 1 | **Boule dans l’eau** | Tu le rattrapes après un numéro raté ; il croit que tu vas te moquer. |
| 2 | **Sans public** | Il parle sans costume ; avoue qu’il « joue » même quand personne ne regarde. |
| 3 | **Les billets jamais envoyés** | Il te montre ses excuses écrites — pour des choses minuscules. |
| 4 | **À ton rythme** | Scène adulte : il cède le lead au joueur ; réactions = permission, fierté, frissons. |
| 5 | **Hors scène** | Il demande explicitement ce qu’il veut — première fois sans détour ni numéro. |

**`powerDynamic` intime (aff. 4–5) :** `companion_invites` ou MC dominant narratif — Finn **offre**, le joueur **mène** ; réactions type « Dis-moi », « Oui, comme tu veux », « Encore… si tu veux ».  
**Aftercare :** important dans les épilogues (couverture, eau, « tu es resté »).

---

## Exemples de répliques (ton)

**Aff. 1 — shy :** « Oh — pardon, je… tu voulais quelque chose ? Je peux refaire le tour. Mal, si tu veux. »  
**Aff. 2 — sincere :** « Sans les gens, je ne sais pas où mettre les mains. Toi, tu comptes comme une place au bord du quai. »  
**Aff. 3 — playful :** « Si je tombe encore, tu me rattrapes ? …C’est une question sérieuse. »  
**Aff. 4 — romantic :** « Fais-moi attendre. Je… je tiendrai. Dis-moi quand. »  
**Aff. 5 — warm :** « Reste encore un peu. Pas pour un numéro. Pour que je sente que j’ai bien fait — pour toi. »

---

## Graines bonds (MVP — 2 échanges aff. 1)

```text
Prompt : « Finn, tu jongles même quand personne ne paye ? »
Réponse : « Surtout quand personne ne paye. Sinon je crois que je n’existe que dans les applaudissements. »
Ton : sincere · Tags : quais, théâtre, existence

Prompt : « Tu as perdu une balle dans l’eau hier soir. »
Réponse : « Elle reviendra avec la marée. Moi, je reviens toujours au même quai. »
Ton : playful · Tags : eau, lanternes, habitude
```

---

## Writer — Parler curé (futur aff. 4–5)

- **Registre :** cru possible mais **vulnérable** — hésitations, questions, réactions courtes qui gonflent si le joueur mène bien.
- **Choix MC +3 romantic :** guidance claire (« je te dis quand », « regarde-moi ») — Finn récompense en réactions chaudes.
- **Choix playful :** brat **léger** autorisé (il teste une fois, puis cède) — pas de moquerie cruelle.
- **Choix direct :** il se fige puis obéit — réaction `embarrassed` → `pleased`.
- **À éviter :** le traiter comme enfantin ; humiliation ; oublier l’aftercare en épilogue.

---

## Intégration code (quand assets prêts)

```ts
// profiles.ts (extrait)
finn: {
  id: 'finn',
  name: 'Finn',
  place: 'les quais des lanternes',
  personalityHint: 'Finn est saltimbanque — cabotin en public, timide et docile en privé ; il demande la permission et s\'épanouit sous les compliments.',
  toneWeights: { sincere: 9, playful: 7, direct: 3, romantic: 8 },
}
```

```ts
// App.tsx (extrait)
{
  id: 'finn',
  name: 'Finn',
  archetype: 'Saltimbanque des quais',
  talent: '+tickets evenement',
  favoriteGift: 'Ruban de scene dechire',
  bonusResource: 'tickets',
  scenes: makeScenes('Finn', 'les quais des lanternes', 'reflets sur l eau'),
}
```
