# Grille de validation — échange curé (Parler / Lien)

Updated: 2026-06-30 — **hub** : grille **A→G** (aff. 1–2) vs règles **S0–S46** (aff. 4–5).

| Document | Affinité | Contenu |
|----------|----------|---------|
| **`CURATED_EXCHANGE_RUBRIC_AFF1.md`** | 1–2 | Grille score A→G, seuils, plafonds B7 |
| **`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`** | 4–5 | Index S0–S46, C1 bridge, S43 H/F unifié, S45 fil pack |

Scripts :

- Aff. 1 : `npm run validate:curated-parler`
- Aff. 4–5 : `npm run validate:curated-parler:aff4` / `:aff5` / `:aff5:both`
- Tout : `npm run validate:curated-parler:all` (inclut aff4-fmc + aff5-fmc)

---

## A — Qualité du langage (15 %) — aff. 1–2

| ID | Test |
|----|------|
| A1 | 0 calque liste noire (norme, neutre, peser, familier, mana+gaspillé…) |
| A2 | Choix + réactions ≤ **120** car |
| A3 | `companionLine` ≤ **110** car |
| A4 | 4/4 réactions `« … »` |
| A5 | 0 anglicisme : `stylé`, `cool`, `ok`, `feedback`, `update` |
| A6 | 0 tournure littéraire calquée : `visiblement`, `suffisait comme excuse`, `si je suis honnête` |

---

## B — Naturel / français parlé (20 %)

| ID | Test |
|----|------|
| B1 | 0 lexique administratif |
| B2 | Line Lyra ≤ **22** mots |
| B3 | ≥ **2** élisions dans le dialogue |
| B4 | 0 hit **liste B4** (tournures meta / quest log) |
| B5 | Question Lyra → **`?` en fin de JSON** si interrogative |
| B6 | Choix `sincere` ≥ 12 car, sans calque |
| B7 | **Dernière phrase** de `companionLine` complète — pas de fragment du type `Une ligne, demain.` (cf. script) |

**B7 — échec si :**

- Dernière phrase = `Une ligne, demain` / `Une ligne` seule
- Segment après la **dernière virgule** = seulement `demain`, `hier`, `plus tard`, etc.
- Dernière phrase ≤ **3 mots** sans verbe ni `?` (nominal fragment)

**Plafond dur** : B7 manquant → `hardFail` (note max **8**, même logique que B4/A5).

**Liste B4 — une occurrence = échec :**

`c'est une question` · `en somme` · `demander quelque chose :` · `en une phrase :` · `je voulais te demander si tu retiens` · `seulement tu archives` · `me semble plus clair` · `verdict inconnu` · `phrases jolies` · `note ça` · `choisis ta version` · `une autre conversation` · `compagnons de route`

---

## C — Clarté & cohérence des réponses (15 %)

| ID | Test |
|----|------|
| C1 | Bridge ancré (lieu concret) |
| C2 | Line = question (`?`) ou consigne claire |
| C3 | **4/4 choix répondent** à la dernière réplique (heuristique script + relecture) |
| C4 | Jargon lore ≤ 6 occurrences |
| C5 | Choix = phrase complète (sauf `direct` ≤ 20 car) |

**C3 — règles :**

- Question **A ou B** → chaque choix doit annoncer oui / non / branche A / branche B
- **Rapport mot pour mot** → choix commence par `Qu'` ou cite le message
- **Consigne** → accord / question / taquinerie liée à la tâche

---

## D — Immersion (15 %)

| ID | Test |
|----|------|
| D1 | 0 méta dans choix + réactions (`mini-jeu`, `affinité`, `round`, **`le score`**) |
| D2 | didascalies réaction en *Elle…* (3e pers.) — pas de narration nue hors guillemets |
| D3 | Réactions = réplique parlée |
| D4 | 0 référence jeu (`score`, `points`) dans choix joueur |
| D5 | 0 terme UI (`xp`, `level`) |

`mini-jeu` autorisé **uniquement** dans `bridge` (nom d'activité du monde).

---

## E — Cohérence narrative (15 %)

| ID | Test |
|----|------|
| E1 | Exactement 1× `score: 3` et scores **0,1,2,3** distincts |
| E2 | `sincere` = score **3** |
| E3 | 4× `emotion` renseignée |
| E4 | Réaction **logique** vs ton + score (romantic repoussé contient `pas` / `non` / `rien`…) |
| E5 | Pas de contradiction pack (relecture manuelle) |

---

## F — Voix Lyra aff. 1 (10 %)

| ID | Test |
|----|------|
| F1 | Pas mièvre |
| F2 | Romantic repoussé |
| F3 | Sincere récompensé |
| F4 | Line Lyra directe |
| F5 | Registre aff. 1 |

---

## G — Design des choix (10 %)

| ID | Test |
|----|------|
| G1 | 4 tons JSON |
| G2 | 4 amorces (5 mots) distinctes |
| G3 | 1 seule bonne réponse |
| G4 | Mauvaises réponses ≥ 10 car |
| G5 | 4 émotions |

---

## Palier sémantique — voir doc dédiée

**Aff. 4–5** : index complet **S0–S46** + **C1** dans [`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`](CURATED_EXCHANGE_RUBRIC_AFF4-5.md).

Résumé affinités :

| Affinité | Règles actives |
|----------|----------------|
| **1–2** | S0–S14, voix Lyra — grille A→G |
| **4** | S15–S22, S31, S35–S45, C1, B7 dur |
| **5** | S15–S45, S26–S28, S43 H+F unifié, S44 companionAction |

*(S46 fusionné en S45 — continuité pack.)*

**E2 aff. 5 action** : `romantic = score 3`, `sincere = score 2` (pas la règle aff. 1 « sincere = 3 »).

---

| Pack | Échanges | Cutout |
|------|----------|--------|
| pack-1 | 01–03 | `commanding` |
| pack-2 | 04–06 | `heated` |
| pack-3 | 07–09 | `dominant` |
| pack-4 | 10–12 | `lustful` |

Score ≥ 1 → émotion pack ; score 0 (playful) → `annoyed`. Appliqué par `applyPackCutoutEmotions` dans le builder aff. 4/5.

---

## Scores Lyra aff. 1 — relecture v2 (2026-07-01)

| # | Titre | Global | Décision |
|---|-------|--------|----------|
| 01 | Page interrompue | **10** | Validé |
| 02 | Glyphe en double | **10** | Validé |
| 03 | Mana qui baisse | **10** | Validé |
| 04 | Thé étoile | **10** | Validé |
| 05 | Myrion curieux | **10** | Validé |
| 06 | Carte des Ruines | **10** | Validé |
| 07 | Pages partagées | **10** | Validé |
| 08 | Faveur de chasse | **10** | Validé |
| 09 | Après un échec visible | **10** | Validé |
| 10 | Fermeture du soir | **10** | Validé |
| 11 | Le livre de côté | **10** | Validé |
| 12 | Une consigne simple | **10** | Validé |

**12/12 validés** après relecture v2 + corrections corpus.

### Pourquoi la v1 laissait passer des erreurs

1. Grille centrée **calques / longueur / JSON**, pas **oralité des choix joueur**
2. **`formatSpeech`** retirait les `?` à l'écran (corrigé)
3. Pas de liste **B4** ni détection **anglicismes**
4. **C3** non testé (choix hors-sujet ou meta acceptés)
5. Relecture humaine non obligatoire avant score 10

### Pourquoi l'échange 12 passait malgré une consigne « coupée » (2026-07-01)

1. **C2** acceptait toute consigne avec `note ` ou `avant que` — sans exiger une **dernière phrase autonome**
2. **C5** exige des phrases complètes pour les **choix joueur**, pas pour **`companionLine`**
3. **A3 / B2** : longueur OK (107 car, ~19 mots) — le fragment `Une ligne, demain.` est court mais valide en métrique
4. **C3** : les 4 choix répondaient quand même à l'intention (noter / pourquoi moi / taquinerie / romantique)
5. Aucun test **sémantique de clôture** — corrigé par **B7** + régression intégrée au script

---

## Liens

- Détail textes : `LYRA_AFF1_CURATED_12.md`
- Corpus : `scripts/references/link-corpus/curated/lyra-aff1-curated-12.json`
