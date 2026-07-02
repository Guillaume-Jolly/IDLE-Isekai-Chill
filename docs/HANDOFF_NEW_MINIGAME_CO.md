# Passage opérateur (CO) — créer un nouveau mini-jeu

**Date :** 2026-07-03  
**Phase repo :** `feature/2.2` · semver `2.2.0`  
**Public :** agent dev qui ajoute un **nouveau type** ou une **nouvelle activité** mini-jeu

Brief phase générale : [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md)  
Hiérarchie code : [`agent-guide/01-hierarchie-projet.md`](./agent-guide/01-hierarchie-projet.md)

---

## Contexte produit

Le hub **Mini-jeux** (`MinigameHub.tsx`) liste des **activités** (`BuildingActivity`) rattachées à un **bâtiment** et un **compagnon**. Chaque activité a un `minigameType` qui route vers un composant React.

**Mini-jeux existants (types) :**

| `minigameType` | Composant | Usage typique |
|----------------|-----------|---------------|
| `conversation` | `ConversationGame` | Parler / liens (curé ou v2) |
| `familiar-capture` | `FamiliarCaptureGame` | Promenade Myrions / chasse |
| `dressage` | `DressageGame` | Refuge / dressage |
| `myrion-worksite` | `MyrionWorksiteGame` | Chantier Myrion (≠ Chantier du havre) |
| `idle-farm` | `IdleFarmGame` | Ferme lunaire |
| `tap-sequence`, `harvest-rush`, `timing-bar`, … | `*Game.tsx` | Arcade léger par bâtiment |

**Terminologie hub** (ne pas inverser) — voir `docs/traceability/project-state.md` :

- **Chantier du havre** = activité worksite village (`myrion-worksite`)
- **Ferme lunaire** = `idle-farm`
- **Promenade Myrions** = capture

Idées futures (course, papouillage, combat Myrion) : [`BACKLOG.md`](./BACKLOG.md) § Refuge / Dressage.

---

## Flux runtime (à comprendre avant de coder)

```
MinigameHub / quête / village
        ↓ tryLaunchMinigame(activityId)   [App.tsx]
        ↓ setActiveMinigameActivityId
MinigamePlayer
        ↓ GAME_BY_TYPE[minigameType]
*Game.tsx  (ex. BeatTapGame)
        ↓ MinigameFrame + MinigameStage
        ↓ onComplete(miniScore, maxScore, reward, options?)
App.completeMinigame → ressources + quêtes + fermeture overlay
```

**Contrat fin de partie** (`MinigameFrame` / `MinigameProps`) :

- `score` / `maxScore` : entiers affichés et passés à `onComplete`
- `status` : `'playing' | 'won' | 'lost'`
- `onComplete(miniScore, maxScore, scaleReward(activity.baseReward, …), options?)`
- `options.keepOpen` : rare — garder overlay ouvert (ex. conversation multi-round)

**Récompenses** : `activity.baseReward` (`Cost` partiel) · multiplicateur stats compagnon via `App.tsx` (conversation a formule dédiée).

---

## Checklist implémentation (nouveau type)

### 1 — Spécifier (avec Guillaume)

- [ ] Nom hub, bâtiment, compagnon, ressource focus (`ResourceKey`)
- [ ] Durée session (~30 s arcade vs session longue)
- [ ] Score max, condition win/lose
- [ ] Persistance ? (oui → étendre `MinigameSave`)
- [ ] Assets requis (stage, présentation hub, sprites…) — **demande explicite** avant toucher PNG
- [ ] Coût lancement ? (conversation = tickets/mana via `CONVERSATION_LAUNCH_COST`)

### 2 — Type + enregistrement

**Fichier :** `src/data/buildingActivities.ts`

```ts
export type MinigameType =
  | 'tap-sequence'
  | 'mon-nouveau-type'  // ← ajouter ici

export const BUILDING_ACTIVITIES: BuildingActivity[] = [
  {
    id: 'mon-activite-id',           // unique, kebab-case
    buildingId: 'clear-spring',      // id bâtiment existant
    companionId: 'solene',
    focusResource: 'gifts',
    minigameType: 'mon-nouveau-type',
    name: 'Titre hub',
    tagline: '…',
    inspiration: '…',
    description: '…',
    baseReward: { gifts: 20, mana: 30 },
    accent: '#aabbcc',
    icon: '🎮',
  },
]
```

**Fichier :** `src/components/minigames/MinigamePlayer.tsx`

```ts
import { MonNouveauGame } from './MonNouveauGame'

const GAME_BY_TYPE: Record<MinigameType, ComponentType<MinigamePlayerProps>> = {
  // …
  'mon-nouveau-type': MonNouveauGame,
}
```

### 3 — Composant jeu

**Modèle minimal :** copier `BeatTapGame.tsx` ou `TimingBarGame.tsx` (arcade court).

Structure type :

```tsx
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { scaleReward } from '../../data/buildingActivities'

export function MonNouveauGame({
  activity, companionName, buildingName, resourceLabel,
  onComplete, onClose,
}: MinigameProps) {
  const maxScore = 10
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  useEffect(() => {
    if (status === 'won') {
      onComplete(score, maxScore, scaleReward(activity.baseReward, score / maxScore))
    }
  }, [status, score, maxScore, activity.baseReward, onComplete])

  return (
    <MinigameFrame
      activity={activity}
      companionName={companionName}
      buildingName={buildingName}
      resourceLabel={resourceLabel}
      score={score}
      maxScore={maxScore}
      status={status}
      onClose={onClose}
      onRestart={() => { /* reset state */ }}
    >
      {/* zone interactive */}
    </MinigameFrame>
  )
}
```

**Layouts spéciaux :**

- `layoutVariant="conversation"` · `stageBackgroundVariant="companion-art"` — voir `ConversationGame`
- `hideGlobalChrome` · `companionInScene` — jeux plein écran (chasse)
- `endless` — pas d’écran victoire auto

**Scène :** `MinigameStage` fournit fond (`minigameStagePath(activityId)`) + accent CSS `--mg-accent`.

### 4 — Assets (si visuels hub)

**Chemins :** `src/data/minigameAssets.ts`

| Asset | Chemin runtime typique |
|-------|-------------------------|
| Présentation hub | `assets/minigames/hub/presentations/{activityId}.png` |
| Fond scène | `assets/minigames/hub/stages/{activityId}.png` |
| Spécifique mode | `assets/minigames/{mode}/…` |

Servis depuis `assets/` via `vite.repo-assets.ts` — **ne pas** dupliquer dans `public/` sans convention existante.

Fallback : `STAGE_FALLBACK_CSS[buildingId]` si PNG absent.

### 5 — Persistance (optionnel)

**Fichier :** `src/data/minigameSave.ts`

- Étendre le type `MinigameSave` avec une clé dédiée
- Lire/écrire via props `minigameSave` / `onSaveMinigame` (déjà câblées dans `App.tsx`)
- **Migration save** : si nouvelle clé obligatoire, fournir default dans hydrate — pas de champ silencieux perdu

Exemples existants : `farm`, `refuge`, `myrionWorksite`, `capture`.

### 6 — Intégration gameplay

| Besoin | Fichier |
|--------|---------|
| Quête « jouer » | `src/data/infiniteQuests.ts` · kind `play-minigame` + `activityId` |
| Navigation quête | `src/data/questNavigation.ts` (souvent auto si `activityId` set) |
| Tutoriel | `src/data/tutorialObjectives.ts` |
| Multiplicateur récompense | `src/data/companionStats.ts` (pattern existant) |
| Coût lancement spécial | `App.tryLaunchMinigame` (pattern `conversation`) |

### 7 — Styles

- Composant : co-localiser ou `Minigames.css` / `MinigameChrome.css`
- Mobile : tester overlay 9:16 · hub filtre activités conversation

### 8 — Validation

```bash
npm run build
npm run tnr:baseline          # si save / quêtes touchées
npm run validate:companion-bonds  # si compagnon / affinité
```

**Smoke manuel** (`docs/HANDOFF_2_2_AGENT_BRIEF.md`) :

1. Hub mini-jeux → carte visible, lancement OK
2. Partie complète → récompense + overlay se ferme
3. Quête associée (si ajoutée) → compteur OK
4. Rechargement page → save intacte
5. Console sans erreur bloquante

---

## Checklist « nouvelle activité » (type existant)

Si le **moteur existe déjà** (ex. second `beat-tap`) :

1. Nouvelle entrée `BUILDING_ACTIVITIES` (id unique)
2. PNG hub `presentations/` + `stages/` si besoin
3. Quêtes / tutoriel si requis
4. **Pas** de changement `MinigamePlayer` si même `minigameType`

---

## Anti-patterns (éviter)

| ❌ | ✅ |
|----|-----|
| Nouveau type sans entrée `MinigameType` TS | Union type + `GAME_BY_TYPE` exhaustif |
| Récompense directe dans le composant sans `onComplete` | Toujours passer par `scaleReward` + handler App |
| Modifier PNG sans accord | Stub CSS / fallback stage d’abord |
| Logique métier lourde dans `App.tsx` | Garder dans `*Game.tsx` ou `src/data/` |
| Mélanger refactor hub + nouveau jeu | PR / commits séparés |
| Supprimer ancien mini-jeu | Archiver / flag dev — règle **no deletion** |

---

## Extension « hub dans un hub » (pattern Dressage)

`DressageGame` lance des sous-activités (nourrir, jouer…) **sans** nouveau `minigameType` global — utile pour **famille** de jeux Myrion (backlog course / papouillage).

Avant d’ajouter un type global, évaluer : sous-écran d’un jeu existant vs type dédié.

---

## Versionnement & trace

1. `npm run version:task` par tâche distincte
2. Ligne Y dans `docs/traceability/changelog/DEV_LOG_2_2.md`
3. Commit atomique si Guillaume demande
4. Note courte dans `.ai/current-state.md` si initiative multi-session

---

## Prompt copier-coller (agent nouveau mini-jeu)

```
Tu dois créer / intégrer un nouveau mini-jeu sur feature/2.2.

Lis d'abord :
- docs/HANDOFF_NEW_MINIGAME_CO.md
- docs/HANDOFF_2_2_AGENT_BRIEF.md
- src/data/buildingActivities.ts
- src/components/minigames/MinigamePlayer.tsx
- Un jeu proche comme référence (BeatTapGame, TimingBarGame, DressageGame)

Avant de coder, confirme avec Guillaume : type (nouveau vs activité existante), bâtiment, compagnon, assets, save.

Implémentation minimale :
1. MinigameType + BuildingActivity
2. *Game.tsx + MinigameFrame
3. Enregistrement MinigamePlayer
4. build + smoke hub

Règles : pas d'assets PNG sans demande ; pas de migration save sans default ; diffs petits ; pas de commit sans demande.

Premier message : récap spec + fichiers que tu vas toucher.
```

---

## Fichiers de référence rapide

| Fichier | Rôle |
|---------|------|
| `src/data/buildingActivities.ts` | Activités + types + récompenses |
| `src/components/minigames/MinigamePlayer.tsx` | Router type → composant |
| `src/components/minigames/MinigameFrame.tsx` | Chrome score / win / close |
| `src/components/minigames/MinigameStage.tsx` | Fond + accent |
| `src/components/minigames/MinigameHub.tsx` | Liste hub |
| `src/App.tsx` | Launch, complete, save, overlay |
| `src/data/minigameSave.ts` | Persistance |
| `src/data/minigameAssets.ts` | URLs assets |
| `docs/BACKLOG.md` | Idées Refuge / course / combat |
