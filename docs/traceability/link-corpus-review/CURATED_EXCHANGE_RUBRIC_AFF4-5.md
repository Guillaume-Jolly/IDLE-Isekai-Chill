# Rubrique sémantique aff. 4–5 — Parler curé (action)

Updated: 2026-07-03 — index **S0–S55** + **FM*** + **LQ6** + **C1** bridge, séparé de la grille **A→G** (aff. 1–2).

Scripts :

- `npm run validate:curated-parler:aff4` / `:aff4-fmc`
- `npm run validate:curated-parler:aff5` / `:aff5-fmc` / `:aff5:both`
- `npm run validate:fmc-mirror:aff5` / `:aff4`
- `node scripts/references/link-corpus/curated/validate-curated-parler-semantics.mjs <json>`

---

## Index unique S0–S55 (+ C1, FM*, LQ6)

| ID | Portée | Règle |
|----|--------|-------|
| **S0** | Toutes aff. | `answerRule` présent et valide |
| **S1** | Toutes aff. | Contenu conforme à `answerRule` |
| **S2** | Toutes aff. | Diversité amorces choix (warn ≥3/4) |
| **S3** | Toutes aff. | Jaccard choix < seuil affinité |
| **S4** | Toutes aff. | Cohérence émotion / réaction / score |
| **S5** | Toutes aff. | Voix Lyra (mièvre interdit) |
| **S5b** | Toutes aff. | Pas de vouvoiement |
| **S6–S14** | Aff. 1–2 surtout | Longueur, subordonnées, calques génériques… |
| **S15** | Aff. 4–5 | `answerRule: action` obligatoire |
| **S16** | Aff. 4–5 | `companionLine` sans `?` final |
| **S17** | Aff. 4–5 | `companionAction` requis |
| **S18** | Aff. 4–5 | Verbe 3e personne dans `companionAction` |
| **S19** | Aff. 4–5 | Format action complet |
| **S20** | Aff. 4–5 | `companionLine` = réplique parlée Lyra |
| **S21** | Aff. 4–5 | Pas de duplication action/line ni narration 3e pers. dans line |
| **S22** | Aff. 4–5 | Agency choix vs qui mène (`actionChoiceAgencyAligned`) |
| **S23–S24** | Aff. 5 | `intimateFinale` requis + valide |
| **S26** | Aff. 5 FMC | Scène orale : choix +3 nomme chatte/lécher |
| **S27** | Aff. 5 MCH | Lyra ne pénètre pas le MC homme |
| **S28** | Aff. 5 FMC | Pas d'anatomie masculine sur le MC femme |
| **S29a** | Aff. 4–5 | Champ `powerDynamic` valide |
| **S29** | Aff. 4–5 | Choix +3 aligné dynamique |
| **S31** | Aff. 4 | Registre suggestif MC (pas cru aff. 5) |
| **S32** | Aff. 5 | Épilogue inclut réaction Lyra |
| **S33** | Aff. 4–5 | Vestiaire vs arrachage Lyra |
| **S34** | Aff. 4–5 | Couches vestiaires (dessus / dessous) |
| **S35** | Aff. 4–5 | Choix différenciés (S35a/b/c) |
| **S36** | Aff. 4–5 | Pose déjà posée — pas de ré-init |
| **S37** | Aff. 4–5 | Réaction temporelle (pas d'ordre sur acte en cours) |
| **S38** | Aff. 4–5 | Lexique source confusion (L6…) |
| **S39** | Aff. 4–5 | Consigne strip → +3 obéit |
| **S40** | Aff. 4–5 | Économie narrative (a/b/c + didascalies) |
| **S41** | Aff. 4–5 | Lyra au-dessus → +3 ne retourne pas |
| **S42** | Aff. 4–5 | Lyra déshabille / mains bloquées — pas auto-strip MC ni ordre impossible |
| **S43** | Aff. 5 H+F | Registre cru MC (choix + épilogue) — **même règle**, vocabulaire genre-aware |
| **S44** | Aff. 5 | `companionAction` registre + réaction vs pénétration en cours |
| **S45** | Aff. 4–5 | Fil **intra-pack** + ouverture standalone (packs indépendants) |
| **S47** | Aff. 5 | `intimateFinale` aligné sur qui stimule qui (companionAction) — anti-calque H/F |
| **S48** | Aff. 4–5 | Logique de scène (lieu, dom/sub, filler, props, orgasme) |
| **S49** | Aff. 4–5 | S49a bridge/action ≥4 mots communs · S49b signale vs acte en cours · S49c presse-toi si Lyra frotte · S49d pack « nu » sans re-déshabillage |
| **S37b** | Aff. 5 | MC passif + Lyra stimule — pas d'ordre « presse-toi / entre / avale » au MC (oral : j'avale / laisse-toi aller OK) |
| **LQ1–LQ5** | Aff. 5 | Quotas templates par pack (warn) : Poignet compris, Pas de théâtre, ralentis ma respiration, « Bien. » |
| **LQ6** | Aff. 5 | Réactions +3 trop similaires dans un pack (Levenshtein guillemets Lyra ≥ **0,68**) |
| **S50** | Aff. 5 pack-5 | Spectateur — `companionLine` orientée visiteur / comptoir |
| **S51** | Aff. 5 pack-5 | Spectateur — pas de line intime adressée au MC |
| **S52** | Aff. 5 pack-5 | Spectateur — réaction cite visiteur si Lyra parle au couloir |
| **S53** | Aff. 5 pack-5 | Règles métier par id ex. **13–21** (`PACK5_EXCHANGE_BUSINESS_RULES` — choix + réaction +3) |
| **S56** | Tous corpus curés avec `intimateFinale*` | Prolepse mid-pack (high + low) — `demain`, `prochaine fois`, etc. |
| **S55** | Aff. 4–5 | Pont / `companionAction` spatio-temporel (`bridgeActionSpatialClashOk` — alias WALK-SPACE) |
| **S57** | Corpus avec `intimateFinale*` | Courbe émotion portrait +3 romantic par pack (`PACK_ROMANTIC_EMOTION_BY_PACK`) |
| **S58** | Corpus avec `intimateFinaleLow` | Ton low = recadrage, pas victoire ; **WALK-LOW** si champ présent (playful/direct) |
| **FM2** | H+F aff. 5 | Anatomie / registre MC — **pas** d'exigence texte différent H/F (FM1/FM3 retirés) |
| **FR14** | Toutes aff. | `ton string` / `mon string` (masculin) |
| **FR13** | Toutes aff. | Élision après « que » : `j'halète` pas `je halète` |
| **C1** | Aff. 4–5 | Bridge ancré lieu concret (dur en sémantique) |
| **B7** | Aff. 4–5 | `companionLine` phrase complète (dur en sémantique, plafond score aff. 1) |

---

## S43 — Registre MC unifié H / F

Même logique pour homme et femme. Écarts **autorisés par design** :

| Aspect | MC homme | MC femme |
|--------|----------|----------|
| Sous-vêtements | `caleçon`, pas `culotte` | `culotte`, `string`, `slip` (vocabulaire plus large) |
| Pénétration active | `je lui enfonce ma bite` | Gode/strap/doigts **explicites** — pas de « je l'enfonce » nu |
| Scène orale +3 | — | S26 : chatte / lécher obligatoire |
| Épilogues | acte + sémence | couleurs / sensations (rose, ambre, violet…) |

Patterns partagés : `X1–X12` (peau nue, grippe, enfoncer sans organe…).

---

## S45 — Fil pack (intra-pack uniquement)

**Règle produit :** les packs 1–4 sont **indépendants** — une session Parler = un pack tiré au hasard, sans contexte des autres.

| Pack | Lieu (aff. 5) | Ouverture (ex. 01 / 04 / 07 / 10) |
|------|---------------|-----------------------------------|
| pack-1 | Bibliothèque | Cold start — verrou, lampe |
| pack-2 | Chambre | Cold start — peignoir, thé |
| pack-3 | Verrière | Cold start nu — **07** tribbing/dom · **08** stop/poignet · **09** montant/vitrage |
| pack-4 | Toit | Cold start — couverture, aube ; **10** dom/creampie → **11** oral → **12** anal |

**Continuité attendue** seulement entre les échanges **2 et 3 du même pack** (`toujours`, `encore`, `sur le matelas`…).

**Interdit à l'ouverture de pack (ex. 07 seul)** : `de retour sur`, `encore brûlante`, `après ses doigts`, `déjà nus sur le lit`.

Marqueurs par pack (échanges 2–3) :

- **pack-1** : bibliothèque, verrou, rayons, oral…
- **pack-2** : draps, lit, peignoir, commode…
- **pack-3** : verrière, matelas, nu, à poil…
- **pack-4** : toit, aube, couverture, chevauche…

Interdit : `t'attire dans sa chambre` si l'échange précédent **du même pack** est déjà sur les draps.

---

## S37 + S44 — Réactions Lyra

Fusionnées en `choiceReactionCoherenceOk` :

- Pas « Alors fais-le » si le choix décrit déjà l'acte
- Pas « je descends sur toi » si `companionAction` = déjà montée / bite en elle (**fail S44**, plus S40)

---

## S48 — Logique de scène

Couvre les retours terrain type ex. 10 (pack 4 toit) :

- Bridge « déjà au lit » + action « porte / matelas / allonge »
- Lieu extérieur (toit, balcon…) + props chambre sans ancrage
- Lyra au-dessus + `Commence` / `Goûte` (dom/sub)
- Filler `avant l'aube`, `toute la nuit`, `aube grise` si le bridge pose déjà aube/nuit
- `oreiller` sans lit/draps/couverture
- « sur le dos » sans bascule quand Lyra est on-top
- Réaction « presse-toi plus fort » quand le choix vise **faire jouir Lyra**

**Couleurs Lyra (FMC épilogues)** : sensations traduites en teintes — rose = excitation/chaleur, ambre = lumière/contact, rouge = orgasme, violet = intimité chambre, bleu = nuit/froid toit. Pattern : `[Couleur] + lieu/sensation ; doigts/lèvres + acte`.

---

## Tensions acceptables (by design)

| Tension | Résolution |
|---------|------------|
| S35a romantic immédiat vs sincere lent | Divergence +3/+2 via S35b/c |
| S41 pas flip +3 vs direct flip +1 | Scopes différents |
| S42 auto-strip interdit vs S39 strip ordonné | S42 = Lyra déshabille ; S39 = Lyra ordonne au MC |

---

## Templates — quotas et modèles (aff. 5)

**Référence qualité épilogue / réaction** : pack 4 toit ex. 10–12 (elle jouit d'abord → taunt endurance ; oral haché ; demande naturelle anal).

| Template | Max / pack | Alternative |
|----------|------------|-------------|
| « Poignet, compris. » | 2 | Serre si ça brûle / Signale / Garde ma voix stable |
| « Pas de théâtre. » | 2 | Pas de jeu / Trop raide / Vertige ou pas / situé au lieu |
| « je ralentis ma respiration » | 2 | retiens ma respiration / tape son poignet |
| « Bien. » en réaction +3 | 3 | état + taunt / urgence / admiration dom |
| « Ne bouge pas » (companionLine) | 1 | menace registre / signal poignet / taquinerie |

**LQ1–LQ5 aff. 5** : warn → **fail CI** (quota dépassé).

**intimateFinaleLow** (score ≤ 1) : ex. 8 Stop + pack 5 — ton sec, pas de taunt « Hâte que… » (S47b).

**Golden diff PR** : si un JSON curé change, lancer \`npm run validate:curated-parler:aff5:update-golden\` (ou \`:aff5:both\`) après relecture. Le fichier \`.golden.json\` est un snapshot de référence ; le diff signale toute dérive non voulue avant merge.

**Dev QA pack** : \`?pack=pack-5\` en dev force le pack 5 au picker Parler.

**Couleurs FMC épilogues** (rubrique doc) : teintes sensorielles dans le texte (rose, ambre, buée…) — **pas** un code couleur UI lié au score. Le score choisit \`intimateFinale\` vs \`intimateFinaleLow\`.

---

## meta.validationProfile (aff. 5)

Le builder écrit dans le JSON :

- `mcAnatomyTerms`, `forbiddenMcEuphemisms`, `domSubVocal`
- `femalePenetrationRule`, `pornLoanwordsBridgeOnly`

Pour proc gen / modèles sémantiques futurs.

---

## Liens

- Grille score aff. 1–2 : `CURATED_EXCHANGE_RUBRIC_AFF1.md`
- Hub : `CURATED_EXCHANGE_RUBRIC.md`
- Code : `scripts/references/link-corpus/curated/curated-parler-lib.mjs`
