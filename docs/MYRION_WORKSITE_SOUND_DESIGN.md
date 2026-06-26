# Chantier Myrion — Sound design MVP 5

> **Date :** 2026-06-26  
> **Implémentation :** `src/audio/worksiteAudio.ts` (Web Audio procédural, **pas de fichiers**)

Le projet n’utilise pas encore de banque `public/assets/audio/` pour les mini-jeux. Le chantier suit le même modèle que la chasse (`huntAudio.ts`) : sons synthétisés légers, bus SFX/musique existants, respect du mute/volume global via `audioEngine`.

---

## Sons intégrés (MVP 5)

| ID | Déclencheur | Durée cible | Volume relatif | Cooldown |
|----|-------------|-------------|----------------|----------|
| `mine-food` | Clic filon vivres | ~0,3 s | 0,038 peak | 72 ms |
| `mine-wood` | Clic filon bois | ~0,3 s | 0,034 peak | 72 ms |
| `mine-stone` | Clic filon pierre | ~0,35 s | 0,032 peak | 72 ms |
| `unlock` | Déblocage biome/spot | ~0,8 s | 0,042 peak | 420 ms |
| `drawer-open` | Ouverture drawer latéral | ~0,06 s | 0,028 peak | 160 ms |
| `ambience-prairie` | Biome prairie affiché | boucle | 0,014 bus musique | — |
| `ambience-forest` | Biome forêt | boucle | idem | — |
| `ambience-mine` | Biome mine | boucle | idem | — |

L’ambiance biome démarre à l’ouverture du chantier et s’arrête à la fermeture. Elle utilise le bus **musique** (coupe si volume musique = 0).

---

## Règles anti-spam

- Minage : cooldown **72 ms** entre sons de clic (spam autorisé visuellement, pas auditif)
- Déblocage : **420 ms** minimum entre chimes
- Drawer : **160 ms** — évite double déclenchement rail
- Pas de son sur production passive auto (déjà silencieuse côté toast)

---

## Prompts génération audio (lot futur fichiers)

Si migration vers fichiers légers (`public/assets/audio/minigames/myrion-worksite/`) :

| Fichier suggéré | Prompt |
|-----------------|--------|
| `mine-food.wav` | short soft harvest click sound, cozy fantasy UI, gentle crop pickup, no harsh transient, 0.3 seconds |
| `mine-wood.wav` | short soft wood gathering tap, cozy fantasy game, small branch and leaf sound, gentle, 0.3 seconds |
| `mine-stone.wav` | short soft stone mining tap, cozy fantasy game, muted pick on stone, not harsh, 0.35 seconds |
| `unlock.wav` | soft magical unlock chime, cozy fantasy game UI, gentle sparkle, 0.8 seconds |
| `ambience-prairie.ogg` | very subtle prairie ambience loop, cozy fantasy field, soft wind, distant birds, seamless loop |
| `ambience-forest.ogg` | very subtle forest ambience loop, soft leaves, distant gentle birds, cozy fantasy, seamless loop |
| `ambience-mine.ogg` | very subtle mine ambience loop, soft cave air, distant water drip, warm lantern atmosphere, seamless loop |

Format cible : **OGG/WAV**, < 100 Ko par SFX, < 500 Ko par boucle ambiante.

---

## API

```ts
playWorksiteMine(resourceId: 'food' | 'wood' | 'stone')
playWorksiteUnlock()
playWorksiteDrawerOpen()
startWorksiteBiomeAmbience(biomeId)
stopWorksiteBiomeAmbience()
```

Branché dans `MyrionWorksiteGame.tsx`.
