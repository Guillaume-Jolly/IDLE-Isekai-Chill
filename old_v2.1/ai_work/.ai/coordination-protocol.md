# AI Coordination Protocol

## Goal

Use repository files as the shared communication layer between the user, Cursor, and Codex.

## Files

- `.ai/next-task.md`: the single active bounded task.
- `.ai/cursor-inbox.md`: instructions/questions from Codex or the user to Cursor.
- `.ai/cursor-outbox.md`: answers, blockers, or review notes from Cursor back to Codex/user.
- `.ai/codex-report.md`: report from the latest Codex pass.
- `.ai/cursor-review-instructions.md`: checklist for Cursor review after Codex changes.

## Writer Rule

Only one agent should write code in the working tree at a time.

Suggested flow:

1. Cursor works interactively, then stops.
2. Cursor writes status/questions in `.ai/cursor-outbox.md`.
3. Codex reads the repo and `.ai/*`.
4. Codex performs one bounded task from `.ai/next-task.md`.
5. Codex writes `.ai/codex-report.md` and `.ai/cursor-review-instructions.md`.
6. Cursor reviews the diff and either fixes surgically or asks a question in `.ai/cursor-outbox.md`.

## Safety Rule

If the working tree is heavily dirty, do not start a new feature. First clarify whether changes are intentional, then commit, stash, or split them.
