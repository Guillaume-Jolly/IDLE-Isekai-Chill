# Grille score A→G — aff. 1–2 (Parler curé)

Updated: 2026-06-30 — grille **qualité prose / JSON** ; règles sémantiques action → [`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`](CURATED_EXCHANGE_RUBRIC_AFF4-5.md).

Note **0–10** par échange. Chaque critère = **6 tests objectifs** (0 ou 1) → score critère = `(somme / 6) × 10`.

**Formule globale :**

`note = A×0,15 + B×0,20 + C×0,15 + D×0,15 + E×0,15 + F×0,10 + G×0,10`  
(arrondi au demi-point)

**Seuils :**

| Note | Décision |
|------|----------|
| **> 9** | Validé |
| **> 6 et ≤ 9** | Retravail |
| **≤ 6** | Refonte |

**Plafonds automatiques :**

- Tournure **B4** ou anglicisme **A5** ou question sans **`?`** ou **consigne fragmentée B7** → note globale **max 8**
- Méta dialogue **D1** ou didascalie **D2** → note globale **max 6**

Script : `node scripts/references/link-corpus/curated/score-curated-exchange.mjs`

---

## A — Qualité du langage (15 %)

| ID | Test |
|----|------|
| A1 | 0 calque liste noire |
| A2 | Choix + réactions ≤ **120** car |
| A3 | `companionLine` ≤ **110** car |
| A4 | 4/4 réactions `« … »` |
| A5 | 0 anglicisme |
| A6 | 0 tournure littéraire calquée |

## B — Naturel / français parlé (20 %)

| ID | Test |
|----|------|
| B1 | 0 lexique administratif |
| B2 | Line Lyra ≤ **22** mots |
| B3 | ≥ **2** élisions |
| B4 | 0 hit liste B4 (meta / quest log) |
| B5 | Question Lyra → **`?` en fin de JSON** |
| B6 | Choix `sincere` ≥ 12 car |
| B7 | Dernière phrase `companionLine` complète |

**Aff. 4–5** : B7 est aussi **fail sémantique dur** (pas seulement plafond score).

## C — Clarté & cohérence (15 %)

| ID | Test |
|----|------|
| C1 | Bridge ancré (lieu : bibliothèque, lit, draps, commode…) |
| C2 | Line = question ou consigne |
| C3 | 4/4 choix répondent |
| C4 | Jargon lore ≤ 6 |
| C5 | Choix = phrase complète |

## D — Immersion (15 %)

D1–D5 : pas de méta jeu, didascalies *Elle…*, pas de termes UI.

## E — Cohérence narrative (15 %)

| ID | Aff. 1–2 | Aff. 5 action |
|----|----------|---------------|
| E1 | scores 0,1,2,3 | idem |
| E2 | **sincere = 3** | **romantic = 3**, sincere = 2 |

## F — Voix Lyra (10 %)

Registre aff. 1 : pas mièvre, romantic repoussé cohérent.

## G — Design choix (10 %)

4 tons, 4 amorces, 1 bonne réponse, 4 émotions.

---

Hub : [`CURATED_EXCHANGE_RUBRIC.md`](CURATED_EXCHANGE_RUBRIC.md)
