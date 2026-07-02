# Modop — test complet d'un pack Parler curé (aff. 5)

**Objectif :** dérouler un acte entier (3 ou 9 échanges) et vérifier que la **cohérence narrative se tient au fur et à mesure** — ponts, spectateur, épilogues round + acte, français, UI.

**Corpus :** `lyra-aff5-curated-12.json` (+ variante `…-female-mc.json`)  
**Statut validation :** tout est **en attente de validation in-game** — aucun pack n'est marqué « purement validé » tant que la Phase C n'est pas cochée manuellement.

**Packs aff. 5 (10 déroulés = 5 packs × H + F) :**

| Pack | Label | Échanges | Focus test |
|------|-------|----------|------------|
| `pack-1` | Bibliothèque — verrou | 01–03 | Verrou actif, épilogues **présent** (pas de prolepse « refaire sous le verrou ») |
| `pack-2` | Chambre — peignoir | 04–06 | Transition havre, dernier ex. peut teaser la suite |
| `pack-3` | Verrière — nu | 07–09 | Continuité nuit, pas de « prochaine fois » au milieu |
| `pack-4` | Toit — aube | 10–12 | Continuité nuit → oral → anal → **épilogue d'acte** |
| `pack-5` | Bibliothèque — silence | 13–21 | **Spectateur**, MC mène, craquage ex. 20, libération ex. 21 |

---

## Phase 0 — Prérequis (5 min)

```bash
npm run build:intimate-action-corpora
npm run sync:lyra-aff5-doc
npm run validate:curated-parler:aff5:both
```

- NSFW activé en jeu (options).
- Lyra **affinité 5** (ou dev picker aff. 5).
- Genre MC : tester **les deux** corpus (H / F) pour les packs toit et bibliothèque.

---

## Phase A — Déroulé automatisé (headless)

Script unitaire : `walk-pack-coherence.mjs` · **tous les packs** : `walk-all-aff5-packs.mjs`

### A.0 — Les 5 packs × H + F (romantic, session idéale)

```bash
npm run walk:pack:aff5:all
```

10 déroulés (pack-1 → pack-5, corpus H puis F). Succès = 10/10 sans `✗`.

### A.1 — Toit (pack-4), session idéale

```bash
npm run walk:pack:aff5:pack4
npm run walk:pack:aff5:pack4:fmc
```

Profil **`romantic`** : sincere (+3) à chaque round → épilogues round + épilogue d'acte **high**.

### A.2 — Toit, session faible

```bash
node scripts/references/link-corpus/curated/walk-pack-coherence.mjs scripts/references/link-corpus/curated/lyra-aff5-curated-12.json --pack pack-4 --profile playful -v
```

Profil **`playful`** : +0 partout → épilogues round bas (si présents) + épilogue d'acte **low** (pack-4).

### A.3 — Bibliothèque (pack-5), arc complet

```bash
npm run walk:pack:aff5:pack5
npm run walk:pack:aff5:pack5:fmc
npm run walk:pack:aff5:pack5:mixed
```

Profil **`mixed`** : alternance +3 / +2 — proche d'une partie réelle.

### A.4 — Verbose (relecture texte)

Ajouter `-v` pour imprimer pont / action / ligne / choix / réaction / épilogue **échange par échange**.

### Codes automatiques

| Code | Signification |
|------|----------------|
| `WALK-CONT` | Pont ex. N ne raccroche pas à ex. N−1 |
| `WALK-SPACE` | Pont dit « déjà sur le lit » mais action re-pose sur le lit |
| `WALK-SPEC-LINE` | Visiteur présent mais `companionLine` pas orientée comptoir |
| `WALK-SPEC-INT` | Visiteur présent mais Lyra parle intime au MC (ex. 13–19) |
| `WALK-SPEC-REACT` | Réaction sans citation visiteur alors que Lyra parle au couloir |
| `WALK-DOM` / `WALK-PWR` | Choix +3 incohérent avec `companionAction` / powerDynamic |
| `WALK-THREAD` | Mot-clé fil pack absent (ex. toit, gode, comptoir…) |
| `WALK-FINALE` | Épilogue round proleptique au **milieu** d'un pack (« prochaine fois », « refaire sous le verrou », « dans une heure », « déjà fini ») — sauf dernier ex. des packs 1–4 et hooks pack-5 volontaires |

**Succès Phase A :** zéro `✗` sur `walk:pack:aff5:all` ; épilogue d'acte affiché en fin de log pour pack-4 et pack-5 (aff. 5).

---

## Phase B — Validation complète (regression)

```bash
npm run validate:curated-parler:aff5:both
```

Contrôles déjà couverts : Sémantique S12–S46, golden, simulate M*, scoring A→G.

*(W1 bridge+line désactivé — repoussé.)*

---

## Phase C — Test in-game (manuel, ~20–40 min / pack)

### C.1 — Lancer un pack en dev

1. Ouvrir le mini-jeu **Parler** avec Lyra aff. 5.
2. URL dev : `?pack=pack-4` ou `?pack=pack-5` (voir picker dev in-game si disponible).
3. Vérifier titre session = label du pack (« Toit — aube », « Bibliothèque — silence (journée) »).

### C.2 — Checklist **chaque échange**

Cocher mentalement ou noter dans un fichier lot :

#### Narratif (tous packs)

- [ ] **Bulles pont** : segments `;` = bulles séparées, ordre logique (action déjà commencée si le pont le dit).
- [ ] **companionAction** puis **companionLine** : pas de contradiction (ex. « elle bouge déjà » ↔ pont).
- [ ] **Choix +3 (sincere)** : même geste / même registre que l'action Lyra.
- [ ] **Réaction** : citation Lyra + didascalie MC ; portrait cohérent (happy vs annoyed).
- [ ] **Épilogue round** (si score ≥ 2) : au passé / présent immédiat, pas de prolepse (« demain tu feras » alors que la scène vient de se passer).
- [ ] **Suite** : bouton « Épilogue » puis « Suite » / « Fin de l'acte » au bon moment.

#### Pack 1 — Bibliothèque verrou (01 → 03)

- [ ] Ex. **01–03** : verrou **déjà tiré** ; épilogues round au **présent** (« reste là », « le verrou tient »).
- [ ] Pas de « refaire sous le verrou », « déjà fini », « dans une heure » au milieu du pack.
- [ ] **FMC ex. 02–03** : MC sur la table, Lyra face / entre les cuisses — pas de calque MC homme.

#### Pack 2 — Chambre (04 → 06)

- [ ] Peignoir → lit ; continuité havre.
- [ ] Ex. **06** (dernier) : teaser « dans deux heures » **OK** en clôture de pack.

#### Pack 3 — Verrière (07 → 09)

- [ ] Nu, matelas, vitrage ; pas de « prochaine fois » aux ex. **07–08** (milieu).
- [ ] Ex. **09** : clôture verrière avant le toit.

#### Pack 4 — Toit (10 → 11 → 12)

- [ ] Ex. **10** : chevauchée / signal poignet ; pas de « rien n'est commencé ».
- [ ] Ex. **11** : enchaînement depuis ex. 10 (pas de « tu t'empales » / semence forcée si tu n'as pas joui).
- [ ] Ex. **12** : aube, anal ; épilogue round = **après** l'acte, pas « avant le lever du soleil ».
- [ ] **Fin de l'acte** : écran « Épilogue — Toit — aube » (trappe, descente, secret) **avant** l'écran résultat.
- [ ] Écran **résultat** : épilogues round + épilogue d'acte repris.

#### Pack 5 — Bibliothèque (13 → 21)

- [ ] Ex. **13–19** : `companionLine` = Lyra → **visiteur** ; MC reçoit consignes via **companionAction** / didascalies réaction.
- [ ] Lyra **ne parle pas au MC** devant spectateur (sauf murmure/chuchot implied sous le bois).
- [ ] Ex. **15** : réaction +3 sur la **gravure**, pas les amendes.
- [ ] Ex. **20** : bibliothèque vide — Lyra **peut** parler au MC ; ligne désir / « ma chose ».
- [ ] Ex. **21** : plus de spectateur ; libération entre les rayonnages.
- [ ] **Fin de l'acte** : écran « Épilogue — Bibliothèque — silence (journée) » **avant** l'écran résultat (high si moyenne ≥ 2/échange, low sinon).
- [ ] Parcours **playful (+0)** : épilogues round **bas** (`intimateFinaleLow`) + épilogue d'acte **low**.

### C.3 — Deux parcours de score (toit)

| Parcours | Choix | Attendu |
|--------|-------|---------|
| **A — Réussite** | sincere (+3) × 3 | 3 épilogues round + épilogue acte **high** + score ≥ 6/9 |
| **B — Raté** | playful (+0) × 3 | épilogues round bas/absents + épilogue acte **low** si pack-4 |

### C.4 — MC femme

Rejouer **pack-1 → pack-5** avec corpus FMC + genre **female** en settings : anatomie (chatte, gode, frottement), pas de calque MC homme.

---

## Phase D — Relecture française (échantillon)

Sur le log `-v` ou le MD sync :

- Pas de « tension électrique », pas de calque FMC/H.
- Tirets cadratins cohérents ; elisions (`j'`, `l'`, `qu'`).
- Registre cru aff. 5 uniforme ; pas de didascalie seule en `companionLine` (« Fort. »).

---

## Phase E — Trace bug / OK

| Résultat | Action |
|----------|--------|
| OK pack | Noter date + profil dans ce fichier ou lot review |
| Échec auto | Corriger `build-intimate-action-corpora.mjs` → rebuild → Phase 0 |
| Échec in-game seul | UI (`ConversationGame`, split pont) — ticket séparé |
| Régression golden | `npm run validate:curated-parler:aff5:update-golden` après revue diff |

---

## Commandes rapides (copier-coller)

```bash
# Regression + déroulé complet aff. 5 (10 packs H+F)
npm run validate:curated-parler:aff5:both
npm run walk:pack:aff5:all

# Ciblés
npm run walk:pack:aff5:pack4
npm run walk:pack:aff5:pack5:mixed

# FMC
npm run walk:pack:aff5:pack4:fmc
npm run walk:pack:aff5:pack5:fmc

# Verbose relecture toit raté
node scripts/references/link-corpus/curated/walk-pack-coherence.mjs scripts/references/link-corpus/curated/lyra-aff5-curated-12.json --pack pack-4 --profile playful -v
```

**In-game :** Parler Lyra aff. 5 · `?pack=pack-1` … `?pack=pack-5` (Phase C obligatoire avant validation)

---

## Références

- Rubrique qualité : [`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`](./CURATED_EXCHANGE_RUBRIC_AFF4-5.md)
- Corpus H : [`LYRA_AFF5_CURATED_12.md`](./LYRA_AFF5_CURATED_12.md)
- Corpus FMC : [`LYRA_AFF5_CURATED_12_FEMALE_MC.md`](./LYRA_AFF5_CURATED_12_FEMALE_MC.md)
