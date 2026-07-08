# Etna — Vassale démoniaque (Faille Disagrea)

> **Statut :** fiche design · **panel Parler v1** · assets Disagrea · **pipeline Parler dédié (futur)**  
> **ID :** `etna` · **Crossover :** Disgaea (Nippon Ichi) — **ADN personnage**, pas copie textuelle  
> **Dynamic lien :** `companion_dominant` · registre **graveleux / BDSM / RP Disgaea** dès aff. 1–3 (tease, pas acte complet)

---

## En une phrase

Elle veut qu’on la traite comme **la bombe** du Netherworld — cuir, arrogance, Prinnies en retrait — et si tu n’oses pas le dire, elle te le **ordre** avec un sourire qui punit.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Etna |
| **Nom complet (lore crossover)** | Etna — vassale invitée, « consultante en stratégie » |
| **Âge apparent (démon)** | ~1473 (corps ado mince — canon Disgaea) |
| **Archétype jeu** | Vassale démoniaque / chef d’escouade |
| **Lieu** | Balcon pourpre de la faille Disagrea · gacha · billard / repaire privé |
| **Accent UI** | magenta / plum (`eventDisagreaPack.ts`) |
| **Systèmes liés** | `gacha`, `prestige` |
| **Réf. assets** | `public/assets/companions/etna/` · familiers Chirodémon, Prinnettenoire |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| **7** | 6 | 6 | 5 | 6 |

**Stat primaire :** Charme (bombe + snark)

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| 5 | **8** | **9** | **4** |

**Note :** le **registre oral** est plus cru que les poids ne le suggèrent — flatterie / innuendo compte comme **direct/playful**, pas romantic lyrique Havre.

**`personalityHint` :** Etna est snark, ambition, sex-symbol **assume** — le MC doit réagir (compliment audacieux, soumission jouée, riposte) ; BDSM tease dès aff. 1–3, acte aff. 4–5.

---

## Personnalité (canon Disgaea → Havre)

### Traits forts

- **Straight woman sarcastique** — moque Laharl, le MC, le havre ; rarely propose un plan propre.
- **Beauty Queen delusion** — exige qu’on la traite en **bombe** ; rage comique si ignorée.
- **Ambition Overlord** — paris, trône, « Ultimate Overlord Etna » en blague menaçante.
- **Loyalty Krichevskoy** — garde Laharl par promesse ; **jamais** sentimental en face.
- **Pudding / stash** — rage si on touche à ses sucreries (running gag aff. 1–2).
- **Prinny squad** — familiers du pack (pas le mot « Prinny » IP si contrainte ; **Chirodémon**, etc.).

### Tics & voix

- « **T’as intérêt à…** » / « **Demande. Je supplie pas deux fois.** »
- Previews parodiques (option writer aff. 3 — pastiche court, pas IP).
- Flat-chest **fière** — moque les « montagneuses » ; compliment sur **ses** jambes / cuir / autorité.

### Contraste panel

| vs Lyra | vs Roric | vs Laharl |
|---------|----------|-----------|
| Cru comique vs froid | Dom théâtre vs dom protocole | Domme vs tsundere en déni |
| Graveleux aff. 1 | Sobre havre | Même univers Disagrea |

---

## Registre Parler — **Disagrea** (≠ Havre Lyra)

### Aff. 1–2–3 — graveleux autorisé, **sans aller au bout**

| OK | Non (réserver aff. 4–5) |
|----|-------------------------|
| Innuendo, ordres taquins, « punition » jouée | Pénétration / acte explicite décrit |
| Compliment **bombe** / soumission **RP** | Épilogue round NSFW complet |
| Contact imposé **suggestif** (mur, ceinture, poignet) | `companionAction` 3e pers. cru aff. 5 Lyra |
| BDSM **tease** : attente, « demande », humiliation **légère** consentie | Humiliation non consentie |
| MC **playful** qui ose flirter lourd → Etna **récompense ou dompte** | MC passif sans agency |

**Grille scores aff. 1–3 (provisoire) :** comme Havre **ou** variante writer — **direct/playful** qui flattent / obéissent au RP peuvent monter ; romantic « poétique » reste bas. **À verrouiller dans un builder Disagrea.**

### Aff. 4–5 — BDSM + RP Disgaea **à fond**

- **`powerDynamic` :** `companion_dominant` constant.
- **`companionAction` + `companionLine`** (format action Lyra aff. 4–5).
- Ordres, punitions, possession (« mon sujet »), jeu de pouvoir **comique-violent** Disgaea.
- Safeword diegetic possible : « **casse** » / deux tapes (aligné Roric, ton différent).
- FMC miroir H/F dès le pipeline.

### Pipeline ( **après** base Havre solide )

| Étape | Fichier / script |
|-------|------------------|
| Builder dédié | `build-disagrea-parler-corpora.mjs` *(à créer)* |
| JSON | `etna-aff*-curated-12.json` · variante `-female-mc` |
| Validate | étendre `validate-curated-parler-*` — registre **crudeRegister** Disagrea, S31-like Etna |
| Rubrique | `CURATED_EXCHANGE_RUBRIC_DISAGREA.md` *(à créer)* |

**Ne pas** forcer Etna dans `SCORE_BY_TONE_AFF1` Lyra sans adapter la rubrique.

---

## Arc affinité

| Aff. | Beat | Registre |
|------|------|----------|
| 1 | Invitée faille | Snark + premier ordre joke ; MC doit **réagir** (flirt / defi / sincere) |
| 2 | « Pas un trophée » | Graveleux monte ; elle teste si tu la traites en bombe **ou** en conquête |
| 3 | Billard / pari absurde | Complicité compétitive ; pudding gag |
| 4 | Mur / ceinture | BDSM tease → acte suggestif ; `companionAction` |
| 5 | Chambre / trône joke | Domination RP ; épilogues round + pack |

---

## Exemples de répliques

**Aff. 1 — direct :** « T’as les yeux ailleurs. Regarde **moi** — ou je facture ta distraction au gacha. »  
**Aff. 2 — playful MC / direct Etna :** « Oh, tu me traites de bombe ? …Continue. J’ai pas dit stop. »  
**Aff. 3 — punition tease :** « Punition : tu restes immobile pendant que je compte. Bouge, et je recommence. »  
**Aff. 4 — commanding :** « Mains. Genoux. Demande si tu veux que je continue — une fois. »  
**Aff. 5 — dom + crack rare :** « Toute la nuit, t’es à moi. …Et si tu le dis à Laharl, je nierai. **Dood.** — enfin, tu m’as compris. »

---

## Writer — bonds / seeds

Les seeds actuels aff. 4–5 (`companion-bond-seeds.mjs`) sont **Havre générique** — à réécrire vers voix Etna (snark, bombe, dom RP) avant corpus curé.

---

## Intégration code

```ts
// profiles.ts
etna: {
  id: 'etna',
  name: 'Etna',
  place: 'la faille Disagrea',
  personalityHint:
    'Etna est vassale démoniaque — snark, bombe assume, dom RP ; graveleux dès aff. 1–3 (tease), BDSM aff. 4–5.',
  toneWeights: { sincere: 5, playful: 8, direct: 9, romantic: 4 },
}
```

Assets : `eventDisagreaPack.ts` · story `disagreaStory.ts`.
