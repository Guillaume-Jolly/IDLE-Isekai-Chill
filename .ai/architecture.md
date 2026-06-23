# Architecture Notes

This file is intentionally lightweight until the repository is audited in a clean task.

## Observed Structure

- `src/`: React/TypeScript application code.
- `src/components/`: UI components, including minigame components.
- `src/data/`: game data and data helpers.
- `src/hooks/`: React hooks.
- `scripts/`: generation, import, validation, asset pipeline, and maintenance scripts.
- `public/`: served assets.
- `assets/`: source or imported asset material.
- `docs/`: project documentation and backlog notes.
- `release/`: release/output material.

## Design Principles

- Keep state logic and rendering reasonably separated.
- Prefer existing local helpers and data patterns.
- Avoid broad module renames.
- Check save compatibility before changing persisted structures.
- Treat generated catalogs as generated unless the task says to edit them directly.
