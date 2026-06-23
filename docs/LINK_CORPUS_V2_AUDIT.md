# Audit — Corpus Lien v2

> **Date :** 2026-06-23  
> **Branche :** `feature/link-corpus-v2`  
> **Référence produit :** `wonderland_companion_link_corpus_v2_clean_compact.zip` (docs/GAMEPLAY_LOOP.md)

---

## Décision

**BLOCAGE — corpus introuvable dans le dépôt et le workspace.**

L'intégration gameplay (ConversationGame, données V2, fallback) **n'a pas été démarrée** conformément au plan : pas d'improvisation sans source réelle.

**Prochaine étape utilisateur :** déposer le zip dans `assets/link-corpus-import/` puis relancer :

```bash
npm run validate:link-corpus
node scripts/import-link-corpus-v2.mjs
```

---

## Phase 1 — Localisation du corpus

### Chemins recherchés

| Chemin | Résultat |
|--------|----------|
| `wonderland_companion_link_corpus_v2_clean_compact.zip` (racine repo) | ❌ absent |
| `assets/link-corpus-import/` | ❌ dossier absent |
| `assets/*corpus*` | ❌ |
| `**/*.zip` (repo) | ❌ aucun zip |
| `docs/GAMEPLAY_LOOP.md` | ✅ référence le nom de fichier attendu |

### Contenu zip

Non listé — archive absente.

---

## Résumé quantitatif (corpus V2)

| Métrique | Valeur |
|----------|--------|
| Compagnons couverts (V2) | — |
| Conversations totales (V2) | — |
| Couverture affinité 1–5 | — |

---

## Exemples d'entrées (V2)

*Non disponibles — corpus absent.*

---

## Problèmes détectés

1. **Corpus source manquant** — bloquant pour intégration.
2. Format V2 **non confirmé** sans ouverture du zip (hypothèse : JSON compact par compagnon/scénario).
3. Données legacy déjà présentes : `companionScenarios.generated.ts` (~5 Mo, 200 scénarios × 15 compagnons).

---

## Phase 2 — Moteur actuel du mini-jeu Lien

### Composants

| Fichier | Rôle |
|---------|------|
| `src/components/minigames/ConversationGame.tsx` | UI mini-jeu Lien (3 rounds, 4 choix) |
| `src/components/minigames/MinigamePlayer.tsx` | Route `minigameType: 'conversation'` |
| `src/data/companionDialogues.ts` | Réexport API publique |
| `src/data/conversations/engine.ts` | `pickConversation`, `buildConversation`, scoring |
| `src/data/conversations/types.ts` | Types `CompanionConversation`, `ScenarioScript` |
| `src/data/conversations/profiles.ts` | 15 profils compagnons + `toneWeights` |
| `src/data/conversations/companionScenarios.generated.ts` | **Source actuelle** (legacy généré) |
| `scripts/generate-companion-scenarios.mjs` | Générateur procédural legacy |

### Format attendu par le code (legacy)

```typescript
type ScenarioScript = {
  id: string                    // ex. "lyra-s0"
  title: string
  minAffinity: number           // 1–5
  maxAffinity: number           // 1–5
  roundToneHints: [DialogueTone, DialogueTone, DialogueTone]
  rounds: [ScriptedRound, ScriptedRound, ScriptedRound]
}

type ScriptedRound = {
  context: string[]             // bulles contexte (supports {name}, {place})
  prompt: string                // question du compagnon
  choices: [ScriptedChoice × 4] // exactement 4 choix
}

type ScriptedChoice = {
  text: string
  tone: 'sincere' | 'playful' | 'direct' | 'romantic'
  reaction: string
}
```

Pack runtime : `COMPANION_SCENARIO_PACKS[companionId]: ScenarioScript[]`  
Constante : `SCENARIOS_PER_COMPANION = 200`

### Compagnons valides (`ALL_COMPANION_IDS`)

`lyra`, `maeve`, `seren`, `nami`, `iris`, `kael`, `runa`, `solene`, `talia`, `mira`, `asha`, `elwen`, `noa`, `sora`, `zelie` (15)

### Sélection conversation

- `pickConversation(companionId, affinity, avoidId?)` filtre par `minAffinity` / `maxAffinity`.
- Évite la répétition immédiate via `avoidId` (session restart).
- Score : choix dont le `tone` = ton préféré du round → +1 (max 3 sur 3 rounds).
- Récompenses : inchangées dans `ConversationGame.finish()` selon score.

### Fallback actuel

- Pas de pack pour `companionId` → `pickConversation` retourne `null`.
- UI : *« Pas encore de dialogue pour ce compagnon. »* (`ConversationGame.tsx` L46–61).

### Points d'intégration V2 (prévus, non implémentés)

1. `src/data/conversations/linkCorpusV2.ts` ou JSON importé — pack V2 typé.
2. `pickConversation()` — tenter V2 d'abord, fallback `COMPANION_SCENARIO_PACKS`.
3. `scripts/import-link-corpus-v2.mjs` — conversion zip → JSON/TS.
4. Flag optionnel `USE_LINK_CORPUS_V2` (env/dev) si besoin A/B — **non ajouté** (corpus absent).

---

## Mapping proposé V2 → moteur

| Champ V2 (hypothèse) | Cible moteur |
|----------------------|--------------|
| `companionId` / `companion` | clé pack + validation `ALL_COMPANION_IDS` |
| `affinityMin` / `affinityMax` | `minAffinity`, `maxAffinity` |
| `id` / `scenarioId` | `ScenarioScript.id` (unique global) |
| `title` | `ScenarioScript.title` |
| `rounds[].context` | `string[]` |
| `rounds[].prompt` | `prompt` |
| `rounds[].choices[]` | 4 entrées `{ text, tone, reaction }` |
| `roundToneHints` | déduire ou fournir explicitement |

**Conversion nécessaire** tant que le format zip n'est pas audité.

---

## Données legacy (référence)

| Métrique | Legacy actuel |
|----------|---------------|
| Compagnons | 15 |
| Scénarios / compagnon | 200 |
| Total scénarios | 3 000 |
| Rounds / scénario | 3 |
| Choix / round | 4 |

---

## Intégrabilité

| Critère | Statut |
|---------|--------|
| Corpus localisé | ❌ |
| Format confirmé | ❌ |
| Script validation | ✅ scaffold (`scripts/validate-link-corpus.mjs`) |
| Script import | ✅ scaffold (`scripts/import-link-corpus-v2.mjs`, bloqué sans zip) |
| Branchement ConversationGame | ⏸ reporté |
