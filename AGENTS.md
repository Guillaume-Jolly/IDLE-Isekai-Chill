# IDLE Isekai Chill — Agent Rules (Havre des Brumes)

This repository is a playable idle / incremental / collection game centered on companions, Myrions, biomes, link conversations, training minigames, passive production, and local progression.

## Prime Directive

Keep the project stable, reviewable, and save-compatible. Do not perform broad rewrites. Do not modify assets unless the user explicitly asks for it.

## Before Editing

1. Read this file.
2. Read `docs/agent-guide/README.md` (onboarding + versionnement).
3. Read `docs/DOC_AGENT_INDEX.md` (éviter docs obsolètes).
4. Read `.ai/project-context.md` if present locally (dossier **gitignoré** ; archive : `old_v2.1/ai_work/.ai/`).
5. Read `.ai/current-state.md` if present locally.
6. Read `.ai/next-task.md` if present locally — sinon `docs/traceability/project-state.md` et `docs/HANDOFF_2_2_AGENT_BRIEF.md`.
7. Check `git status --short`.
8. Inspect existing code before changing APIs or data shapes.
9. New user prompt session → `npm run version:prompt`; each distinct task → `npm run version:task`; log X/Y in `docs/traceability/changelog/DEV_LOG_2_2.md` (phase 2.2+) and micro-changes in `docs/traceability/changelog/`.
10. **Nouvelle phase produit** (ex. 2.2, 2.3) : lire [`docs/agent-guide/07-kickoff-nouvelle-version.md`](docs/agent-guide/07-kickoff-nouvelle-version.md) et **proposer le kickoff dès le premier message** si les signaux indiquent qu'il n'est pas fait.

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
npm run validate:companion-bonds
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
