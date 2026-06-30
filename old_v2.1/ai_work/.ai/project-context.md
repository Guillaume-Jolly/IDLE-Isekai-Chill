# IDLE Isekai Chill — Project Context (Havre des Brumes)

> **Nom produit :** Havre des Brumes · **Repo :** `IDLE-Isekai-Chill`  
> L’ancien nom « Wonderland » et le dépôt Godot homonyme (`C:\Dev\Project\Wonderland`) sont **obsolètes** — ne plus les utiliser dans la doc ou les prompts.

## Product Goal

IDLE Isekai Chill is an idle / incremental / collection game. It combines companions, collectible creatures called Myrions, biomes, link conversations, hunting/capture, training minigames, passive production, and local progression.

The goal is a stable, playable, extensible base, not a throwaway prototype.

## Technical Context

Observed stack:

- React
- TypeScript
- Vite
- npm package lock
- local TypeScript and data files
- local client-side save behavior
- PNG/SVG assets for companions, Myrions, minigames, and backgrounds

Known package scripts:

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

Always verify `package.json` before running commands.

## Product Areas

### Companions

Companions have names, roles, affinity/intimacy levels, conversations, visual assets, and possible links to Myrions. Do not rename or move companion assets without explicit instruction.

### Link Conversations

The conversation system is central. The target direction is a large structured corpus with coherent companion-specific answers across affinity levels.

Constraints:

- Keep companion personalities coherent.
- Avoid absurd or contextless prompts.
- Avoid unjustified weather, biome, or character references.
- Preserve fallback behavior for legacy corpus where present.
- Validate corpus changes when scripts exist.

### Myrions

Myrions are collectible creatures tied to biomes, capture, rarity, variants, shiny tracking, refuge, nursery, release, resources, buffs, companion links, and passive production.

Important checks:

- Release must grant correct resources.
- Release must update biome favor correctly.
- `releasedCount` must not double-increment.
- Companion-Myrion links must not become orphaned after release or replacement.
- Species objectives and variant objectives must remain separate.
- Shiny tracking must remain distinct from variant tracking.
- Buff active/inactive states must be clear.

### Minigames

Planned or partial systems include hunting, training, passive production, papouillage, racing, combat, dungeon/exploration, and biome backgrounds. Treat large new minigames as backlog/prototype work unless a bounded task says otherwise.

## Development Policy

Priority order:

1. Build stability.
2. Save compatibility.
3. Small reviewable diffs.
4. Clear documentation of assumptions.
5. No asset changes unless explicitly requested.
6. No gameplay changes unless requested.

When a task is too large, reduce scope, complete a stable subpart, and document the rest in backlog instead of creating a broad unstable diff.
