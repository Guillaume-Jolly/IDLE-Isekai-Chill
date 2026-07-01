# Git hooks projet

Install : `npm run hooks:install` (configure `core.hooksPath=.githooks`).

| Hook | Déclencheur | Script npm | Segment |
|------|-------------|------------|---------|
| `pre-push` | `git push` | `version:branch-push` ou `version:main-push` | **C** ou **B** |

**MEP (A)** : jamais auto — `npm run version:mep` (option `--dry-run`).

Doc : [`docs/agent-guide/08-versionnement-global.md`](../docs/agent-guide/08-versionnement-global.md)
