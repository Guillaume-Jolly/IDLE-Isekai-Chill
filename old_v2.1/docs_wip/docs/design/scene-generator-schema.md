# Schéma — Générateur de scènes déclaratif

> **Version :** 1.0  
> **Date :** 2026-06-25  
> **Objectif :** `personnage + humeur + phrase + fond → scène animée` sans animation manuelle par ligne.

---

## 1. Problème résolu

| Aujourd’hui | Cible |
|-------------|-------|
| `ConversationGame` : 3 rounds fixes, émotion dérivée en code | Beats déclaratifs, ≤ 10 par scène |
| `disagreaStory.ts` : pages texte + fond hardcodé | Même schéma, invités Disagrea |
| `linkCorpusV2.json` : 7500 scénarios, pas de FX scène | Import optionnel vers format unifié |
| Cutouts branchés (B4) | Cutout = résolu depuis `mood` / `emotion` du beat |

Le **moteur** applique transitions CSS (`Minigames.css` — classes `mg-conversation-*`) ; l’**auteur** ne décrit que le contenu.

---

## 2. Modèle de données

### 2.1 Identifiants & enums

```yaml
# sceneKind — type de chapitre
- story          # Arc compagnon village (histoire principale)
- disagrea       # Event invités
- liens          # Mini-jeu conversation interactive (choix joueur)
- liens-readonly # Galerie / replay sans choix

# mood — intention narrative (mappe vers CompanionEmotionId)
- neutral | happy | shy | annoyed | sad | surprised | romantic | playful
- sincere   # alias → neutral puis happy si succès
- direct    # alias → neutral / annoyed

# speakerRole
- companion | player | narrator

# backgroundRef — résolution par le moteur
- buildingId  # ex. arcane-library → BUILDING_SCENE_BACKGROUNDS
- place       # ex. "la bibliothèque" → PLACE_SCENE_BACKGROUNDS
- assetPath   # chemin relatif explicite (Disagrea staging/prod)
- biomeId     # ex. foret-ancienne → capture-portrait.png
```

### 2.2 `SceneBackground`

```typescript
type SceneBackground =
  | { kind: 'building'; buildingId: string }
  | { kind: 'place'; place: string }
  | { kind: 'biome'; biomeId: string; variant?: 'capture-portrait' | 'dressage-portrait' | 'capture-wide' }
  | { kind: 'asset'; path: string }  // relatif repo assets/
```

### 2.3 `SceneBeat` — unité atomique

```typescript
type SceneBeat = {
  id: string
  /** Qui parle — player = choix ou pensée affichée */
  speaker: 'companion' | 'player' | 'narrator'
  /** Compagnon affiché (cutout). Ignoré si speaker=narrator seul */
  characterId?: string
  /** Humeur explicite OU dérivée du tone en mode liens */
  mood?: CompanionEmotionId | 'sincere' | 'direct'
  /** Texte principal (1–3 phrases max) */
  text: string
  /** Surcharge fond pour ce beat uniquement */
  background?: SceneBackground
  /** FX auto — le moteur mappe vers classes CSS existantes */
  fx?: 'none' | 'success' | 'fail' | 'emphasis' | 'soft-enter'
  /** Durée min affichage ms (auto-advance si readonly) */
  dwellMs?: number
}
```

### 2.4 `SceneChoice` — branche interactive (mode `liens`)

```typescript
type SceneChoice = {
  id: string
  text: string
  tone: DialogueTone  // sincere | playful | direct | romantic
  /** Score 0|1 — compat corpus V2 */
  score: 0 | 1
  /** Beat de réaction joué après sélection */
  reaction: SceneBeat
}
```

### 2.5 `SceneExchange` — un tour joueur (≤ 10 par chapitre)

Regroupe contexte + prompt + choix (mode interactif) ou séquence de beats (mode readonly).

```typescript
type SceneExchange =
  | {
      kind: 'dialogue'
      id: string
      /** Bulles contexte avant la question */
      context: SceneBeat[]
      prompt: SceneBeat
      choices: [SceneChoice, SceneChoice, SceneChoice, SceneChoice]
      /** Hint ton préféré — compat getPreferredTone */
      toneHint?: DialogueTone
    }
  | {
      kind: 'sequence'
      id: string
      beats: SceneBeat[]
    }
```

### 2.6 `SceneChapter` — document racine

```typescript
type SceneChapter = {
  schemaVersion: 1
  id: string
  kind: 'story' | 'disagrea' | 'liens' | 'liens-readonly'
  title: string
  subtitle?: string
  /** Compagnon principal */
  companionId: string
  /** Gate affinité (Liens / story) */
  minAffinity?: number
  maxAffinity?: number
  /** Fond par défaut toute la scène */
  background: SceneBackground
  /** 1–10 exchanges */
  exchanges: SceneExchange[]
  /** Métadonnées prod */
  tags?: string[]
  locale?: 'fr'
}
```

---

## 3. Pipeline moteur

```
SceneChapter (JSON/YAML)
        │
        ▼
  validateSceneChapter()  ── erreurs schema
        │
        ▼
  resolveSceneBackground(bg) → URL (companionConversationVisuals)
        │
        ▼
  resolveBeatEmotion(beat) → CompanionEmotionId
        │    mood explicite ?
        │    sinon toneHint + score (Liens)
        │    sinon emotionFromConversationBeat()
        ▼
  resolveBeatFx(beat) → classes CSS mg-conversation-*
        │
        ▼
  SceneRuntimeState { cutoutUrl, bgUrl, text, fxClass, phase }
        │
        ▼
  ConversationGame | StoryReader | DisagreaReader
```

### 3.1 Résolution émotion (priorité)

1. `beat.mood` si valeur `CompanionEmotionId`
2. Alias `sincere` → `neutral` (setup) / `happy` (après succès)
3. Alias `direct` → `neutral` / `annoyed` (échec)
4. Mode dialogue : `emotionFromConversationBeat({ tone, affinity, success, roundIndex })`
5. Fallback : `neutral`

### 3.2 Résolution fond

Réutilise `conversationSceneBackgroundUrl(buildingId, place)` :

```typescript
// src/data/sceneGenerator/resolveScene.ts
resolveSceneBackground(bg: SceneBackground): string | undefined
```

Ordre : beat.background ?? chapter.background → URL publique.

### 3.3 Animations (sans keyframe manuel)

| `fx` | Comportement CSS |
|------|------------------|
| `none` | Cutout swap + fade 200ms |
| `soft-enter` | Dock slide-up existant |
| `success` | `mg-conversation-viewport--success` + toast tier |
| `fail` | `mg-conversation-viewport--fail` |
| `emphasis` | Pulse portrait `--t1` |

Pas de timeline par réplique : **une transition par beat** lors du changement d’index.

---

## 4. Compatibilité systèmes existants

### 4.1 Corpus Liens V2 (`linkCorpusV2.json`)

Mapping 1:1 partiel :

| Corpus V2 | SceneChapter |
|-----------|--------------|
| `rounds[n].context[]` | `exchange.context[].text` (beats narrator) |
| `rounds[n].prompt` | `exchange.prompt.text` |
| `choices[]` | `SceneChoice[]` + `reaction.text` |
| `roundToneHints[n]` | `exchange.toneHint` |
| `minAffinity / maxAffinity` | idem |

Script futur : `scripts/convert-link-corpus-to-scene.mjs` (non implémenté).

### 4.2 `disagreaStory.ts`

Migration :

```typescript
// Avant
DisagreaStoryPage { paragraphs[], backgroundWide, companionId? }

// Après (équivalent)
SceneExchange { kind:'sequence', beats: paragraphs.map → SceneBeat }
```

Champ `emotion` staging (`story-chapters.json`) → `mood` sur beat companion.

### 4.3 `ConversationGame.tsx`

Phase actuelle : `intro | round | reaction | result`

Extension proposée :

- `round` affiche `SceneExchange` kind=`dialogue` via adaptateur
- `reaction` = beat `choice.reaction`
- Lecteur readonly pour `kind: story | liens-readonly`

Fichier adaptateur : `src/data/sceneGenerator/adaptToConversation.ts` (futur).

---

## 5. Validation & contraintes

| Règle | Limite |
|-------|--------|
| `exchanges.length` | 1–10 |
| `beat.text` | ≤ 280 caractères recommandé |
| `choices.length` | 4 (Liens) ou 0 (sequence) |
| `characterId` | Doit exister dans `ALL_COMPANION_IDS` ou invités Disagrea |
| `mood` | Doit être résolvable vers cutout existant |

Validation runtime légère : `validateSceneChapter(chapter): string[]` (erreurs).

---

## 6. Emplacement fichiers

| Emplacement | Usage |
|-------------|-------|
| `staging/story/samples/*.json` | Brouillons chapitres |
| `staging/story/chapters/` | Pack validé pre-prod |
| `src/data/sceneChapters/` | Chapitres shippés (futur) |
| `src/data/sceneGenerator/` | Types + resolve (runtime) |

**Règle :** pas de promote auto staging → prod.

---

## 7. Exemple minimal

```json
{
  "schemaVersion": 1,
  "id": "lyra-story-page-partagee",
  "kind": "story",
  "title": "La page qu'on ne partage qu'une fois",
  "companionId": "lyra",
  "minAffinity": 3,
  "background": { "kind": "building", "buildingId": "arcane-library" },
  "exchanges": [
    {
      "kind": "sequence",
      "id": "ex-1",
      "beats": [
        {
          "id": "b1",
          "speaker": "narrator",
          "text": "Lyra surprend son carnet ouvert entre deux rayons."
        },
        {
          "id": "b2",
          "speaker": "companion",
          "characterId": "lyra",
          "mood": "shy",
          "text": "Tu n'étais pas censé voir cette page…",
          "fx": "soft-enter"
        }
      ]
    }
  ]
}
```

Échantillons complets : `staging/story/samples/`.

---

## 8. Roadmap implémentation

| Étape | Livrable | Statut |
|-------|----------|--------|
| 1 | Types TS + `resolveSceneBackground` / `resolveBeatEmotion` | ✅ fondations |
| 2 | 2 chapitres JSON staging | ✅ samples |
| 3 | `StoryReader` composant readonly | ⏳ |
| 4 | Brancher 1 chapitre Disagrea event UI | ⏳ |
| 5 | Adaptateur corpus V2 | ⏳ |
| 6 | Choix interactifs via SceneExchange | ⏳ |
