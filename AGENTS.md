# IDLE Isekai Chill — Agent Rules (Havre des Brumes)

This repository is a playable idle / incremental / collection game centered on companions, Myrions, biomes, link conversations, training minigames, passive production, and local progression.

## Prime Directive

Keep the project stable, reviewable, and save-compatible. Do not perform broad rewrites. Do not modify assets unless the user explicitly asks for it.

## Before Editing

1. Read this file.
2. Read `docs/agent-guide/README.md` (onboarding + versionnement).
3. Read `.ai/project-context.md` (stub actif ; archive complète : `old_v2.1/ai_work/.ai/`).
4. Read `.ai/current-state.md` if present.
5. Read `.ai/next-task.md` and execute only that task.
6. Check `git status --short`.
7. Inspect existing code before changing APIs or data shapes.
8. New user prompt session → `npm run version:prompt`; log micro-changes in `docs/traceability/changelog/`.

## Hard Rules

- Keep diffs small and scoped.
- Do not mix refactor, feature work, and bugfixes unless explicitly requested.
- Do not rename, delete, move, compress, or replace assets unless explicitly requested.
- Do not change save format without a migration path.
- Do not remove existing save fields silently.
- Do not rename public exports or data IDs without checking call sites.
- Do not mask TypeScript errors without understanding the cause.
- Do not claim completion if `npm run build` fails.
- Do not run Cursor Agent and Codex as writers on the same working tree at the same time.

## Validation

Check `package.json` before running commands. Current known scripts include:

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

There is no known `test` script at the time this file was created.

## Codex Report Format

After a bounded Codex task, write `.ai/codex-report.md` and `.ai/cursor-review-instructions.md` using this shape:

```md
# Codex Report

## Task
Summary of the requested task.

## Files changed
Exact list of changed files.

## What changed
Clear technical summary.

## Validation
Commands run and results.

## Remaining risks
Uncertainties and limits.

## Cursor review instructions
What Cursor should inspect next.
```

## Cursor Role

Cursor is the main cockpit for interactive development, UI review, gameplay judgement, and final integration. Cursor should inspect diffs before accepting agent changes.
