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
| **S59** | Aff. 5 cold start pack | Pont ex. 1 interdit référence inter-pack (`nuit du toit` en pack-5, `de retour sur…`) |
| **S60** | Aff. 5 `packIntimateFinaleLow` | Compteur orgasmes figé interdit (`trois fois`, `deux fois`…) — comme S49 sur templates high |
| **S47c** | Aff. 5 `intimateFinale` | Lyra doigte MC → pas « tes doigts mouillés » ; FMC pas calque commode H |
| **S49e** | Aff. 5 `sessionOutcome.acts` | Aligné `companionAction` (ex. `fingering_mc` si doigts Lyra en MC) |
| **S22b** | Aff. 4–5 | Lyra doigte MC → choix sans « guide mes doigts » |
| **S48b** | Aff. 4–5 cowgirl | `companionLine` pas « tu entres » si Lyra monte / ne descend pas encore |
| **LQ7** | Aff. 5 playful | Max 2 choix `/^D'abord je feins/` par pack |
| **LQ8** | Aff. 5 direct | Max 1 choix chrono `\d+ secondes` par pack |
| **LQ9** | Aff. 5 pack-5 playful | Max 2 réactions « Pardon ? » par pack |
| **LQ10** | Aff. 5 pack-5 playful | Max 2 réactions « transperce du regard » par pack |
| **S45b** | Aff. 4–5 intra-pack | Pont table → rayons sans transition (faux « où elle t'a collé ») |
| **S35a** | Aff. 5 hors spectateur | Romantic +3 sans anal abrupt (`dans l'anus`) |
| **S61** | Aff. 5 H | Gode actif → +3 bite/pénétration exige beat pose gode / braguette |
| **FM2** | H+F aff. 5 | Anatomie / registre MC — **pas** d'exigence texte différent H/F (FM1/FM3 retirés) |
| **FM-NQ1** | Aff. 5 ex. 01–09 | `companionAction` FMC calquée sur H (Jaccard ≥ **0,58**) → **fail** |
| **FM-NQ2** | Aff. 5 ex. 01–09 | `bridge` FMC calqué sur H (Jaccard ≥ **0,72**) → **fail** |
| **FM-NQ5** | Aff. 5 FMC ex. 01–09 | Métier spatial par pack (`FMC_PACK_BUSINESS_RULES` — table, chatte, verrière…) |
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

---

## `meta.sceneProfile` (Maeve / Runa aff. 5)

Grille 0–10 : **dom**, **sub**, **mutual**, **transaction** (+ dérivés validateur).

| Compagnon | dom | sub | mutual | transaction | varietyActs min |
|-----------|-----|-----|--------|-------------|-----------------|
| Lyra | 7 | 2 | 4 | 0 | 8 |
| Maeve | 5 | 1 | 6 | 9 | 6 |
| Runa | 3 | 2 | 8 | 0 | 6 |

**CI (aff. 5 Maeve/Runa) :** `companion-scene-profile-rules.mjs`

| Tour | Règles |
|------|--------|
| 1 | S29b, S62, S63, LQ12, LQ7b, LQ13–14, S64 |
| 2 | **S65** naturalité RP · **S66** action physique · **LQ11b/LQ11c** densité + intent · **LQ15b** forge · **PACK5_ORIGINALITY** |
| 3 | **S67** métier→bridge · **S68** PROFILE_STRICT · **S69** fit tiers/inconnus · validateurs `validate:curated-parler:aff5` |
| **Lot 3** | **S71** bridge sans label catalogue · **S72** quota tiède · **S73** quota murmure/halète · **S74** acte explicite · **S75** voix Runa · **S76** pari Maeve branché · **S69** durci L-tier |
| **Lot 5** | **S76b** pari jouable · **S77** duplicate inter-pack · **S78** acts↔Phase A · **S21b** *Elle* reactions Phase B · **S71b** labels bridge étendus · **LQ7b** feint max 2 · **L5-bridge-nuit** · **S69b** props L-tier · **S79** Encore delta |

**Lot 5 (Phase B staging)** — module `parler-lot5-rules.mjs` (appelé via `runLot3ParlerRules`) · **fail** si `meta.phaseB`.

| ID | Logique | Fail | Pass |
|----|---------|------|------|
| **S76b** | Pari beat 5 branches → chemins 7–9 distincts (`pariPaths` / `branchFilter`) | metadata + fil MC perd unique | 3 jeux exchangeIds post-beat-5 |
| **S77** | `companionLine` verbatim inter-pack même compagnon aff.5 | Runa S = Runa M line | lines uniques par pack |
| **S78** | `sessionOutcome.acts` = acte `phaseACatalogIds` | contact→handjob drift | parity ACT_CONTACT↔contact |
| **S21b** | Phase B : pas `*Elle/*Il` en reaction | *Elle serre* ×9 | POV2 *serre ta hanche* · prod warn/skip |
| **S71b** | Labels stage en bridge (tease denial:, edging:, MC relais…) | Lyra M×4 | prose in situ |
| **LQ7b** | Max **2** feint playful/pack Phase B | Runa M 8/8 | max 2 D'abord je feins |
| **L5-bridge-nuit** | warn Toujours/Encore + nuit (max 2/pack) | Lyra M×4 | delta lieu/prop |
| **S69b** | L-tier lieux vs props pitch verrouillés | ruelle vs seuil only | seuil atelier OK |
| **S79** | warn Encore sans nouveau lieu/prop vs N−1 | Runa M×7 | ancrage spatial |

**Consolidation Lot 5 :** S76b durcit S76 · S71b étend S71 · LQ7b durcit LQ7 (Runa-only) · S21b inverse S21 prod (*Elle* requis) en Phase B only · exchangeNarrativeEconomyOk skip didasc prod si phaseB.

| **Lot 6** | **S80** line sans Je te* physique · **S81** finale sans opener vide · **S82** densité acte fenêtre 3 · **S83** Phase A↔contenu · **S81-L** épilogues round L · **scoreGate10** warn score < 10 |

**Lot 6 (Phase B staging + producteur)** — module `parler-lot6-rules.mjs` (appelé via `runLot5ParlerRules`) · retours F-PROD-01→08.

| ID | Logique | Fail | Pass |
|----|---------|------|------|
| **S80** | `companionLine` sans `Je te serre/guide/plaque…` | Maeve « Je te serre au comptoir » | client « Je vous sers » · Runa suggestion S75 |
| **S81** | `intimateFinale` : pas « tu retiens ton souffle » seul (80 car.) | 6/6 packs opener vide | acte nommé ou clause deal conséquence |
| **S82** | Fenêtre 3 échanges : ≥1 acte organe explicite ; M beats 1-2 | Maeve M setup prolongé | verge/bite/clitoris en action ou +3 |
| **S83** | `phaseACatalogIds` acte ↔ companionAction ou +3 | contact→handjob drift | ACT_CONTACT matérialisé |
| **S81-L** | Beat map L — épilogues round pas template pur | impairs/pairs sans acte | ligne acte/conséquence par beat |
| **scoreGate10** | warn Phase B si score A→G < 10 | masque épilogues vides | 10/10 grille relecteur |

**Consolidation Lot 6 :** S82 durcit S74 (organe nommé, pas grinding seul) · S83 complète S78 (acts runtime vs contenu éditorial) · S81 ≠ S73 (opener spécifique) · chaîne Lot 3→5→6 unique point d'entrée lint.

**Lot 3 (Phase B staging)** — module `parler-lot3-rules.mjs` · **fail** si `meta.phaseB` · **warn** corpus prod jusqu'à clôture Writer Lot 3.

| ID | Logique | Fail | Pass |
|----|---------|------|------|
| **S71** | Pas de label catalogue / didascalie en `bridge` | « Contact barre : elle rapproche, MC immobile… » | « Après-midi forge — Runa te fait tenir la barre, soufflet bas. » |
| **S72** | Max **1** « tiède »/pack (2 Runa forge) | setting + 7 finales tiède | 1 occurrence sensorielle justifiée |
| **S73** | Max **2** murmure/chuchote/halète / pack en `intimateFinale` round | 28/28 template halète/murmure | variété lexique épilogue |
| **S74** | `companionAction` = geste explicite (qui touche quoi) | « Elle cadence, regard vers la porte. » | « Elle glisse la main sous ton tablier, sort ta queue… » |
| **S75** | Runa `companionLine` = suggestion, pas ordre Lyra-dom | « Mesure encore — reste contre la barre, pas un pas. » | « Garde tes mains sur la barre — finis ta pièce. » |
| **S76** | Pari Maeve : beat 5 tranche + ≥2 temps tease MC perd + branche Maeve perd | beat 7 triple en 1 scène, pas de branche | choix beat 5 → chemins 7a/b/c documentés |
| **S69** (durci) | Beat map L-tier : ≤30 % enjeu générique · ≤50 % pose unique | « consigne taquine beat N » ×24 | enjeux distincts par beat |

**Consolidation (ne pas dupliquer) :** S71 ≠ S67 (line métier) · S72–S73 ≠ S32 (prolepse) · S74 ≠ S19 (3e personne seule) · S75 ≠ S68 pack (compte texture) · S22 warn +3 immobile sans acte nommé.

**Principe tour 2 :** lexique = **intent**, pas mot forcé par line. LQ11 quota brut **retiré**.

**Principe tour 3 :** pipeline scénario-first — Phase A beat map avant JSON ; catalogue archivé `old_2_2/old_2_2_1/annule/staging/parler-scenarios/ACTS_POSITIONS_CATALOG.md`.

**Writer :** Maeve = deal-dom faveur/contrepartie ; Runa = mutual impulsif dehors ; pack-5 **≠** miroir Lyra sous-comptoir.

---

## meta.validationProfile (aff. 5)

Le builder écrit dans le JSON :

- `mcAnatomyTerms`, `forbiddenMcEuphemisms`, `domSubVocal`
- `femalePenetrationRule`, `pornLoanwordsBridgeOnly`

Pour proc gen / modèles sémantiques futurs.

---

## Qualité éditoriale — pile auto (guidage, pas magie LLM)

| Couche | Outil | Rôle |
|--------|--------|------|
| **1 — Source** | `build-intimate-action-corpora.mjs` | Textes canoniques ; éditer ici, pas le JSON à la main |
| **2 — Grille A→G** | `score-curated-exchange.mjs` | Relecture FR (C1 lieu, A3 longueur line ≤110 car., oralité B*) — **CI fail si global < 10** |
| **3 — Sémantique** | `validate-curated-parler-semantics.mjs` | answerRule, fil pack S45, anti-calque CALQUES, S47 épilogue |
| **4 — Miroir FMC** | `validate-fmc-mirror.mjs` | FM2 anatomie + **FM-NQ1/2/5** calque narratif ex. 01–09 |
| **5 — Walk** | `walk-pack-coherence.mjs` | Cohérence séquentielle WALK-* + S56 prolepse |
| **6 — Humain** | Phase C modop + smoke playbook | Oralité, cutouts, spectateur ressenti |

**Principe FM-NQ :** on n'exige plus un texte H/F différent mot à mot (FM1/FM3 retirés). On **bloque** les calques structurels (action/bridge Jaccard, règles métier pack FMC) — **FM-NQ2 est fail**, plus warn.

**Extension future :** `PACK5_*` métier (S53), quotas LQ*, règles FM-NQ5 par compagnon dans le builder — même pattern.

---

## Liens

- Grille score aff. 1–2 : `CURATED_EXCHANGE_RUBRIC_AFF1.md`
- Hub : `CURATED_EXCHANGE_RUBRIC.md`
- Code : `scripts/references/link-corpus/curated/curated-parler-lib.mjs`
