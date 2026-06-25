# scripts/references — données pipeline (non-runtime)

Fichiers texte/JSON utilisés par les scripts d'import, validation et génération. **Pas servis en jeu.**

| Dossier | Rôle | Scripts |
|---------|------|---------|
| `link-corpus/` | Corpus conversations v2 (JSONL, manifest, validation) | `validate-link-corpus.mjs`, `import-link-corpus-v2.mjs` |
| `integrated-portraits/` | `GENERATION_JOBS.json` exporté | `export-integrated-portrait-prompts.mjs` |
| `disagrea/` | `GENERATION_STYLE.md` | génération Disagrea |
| `village-layout/` | `slots.json`, meta import village | `build-village-layout-guide.mjs`, `import-village-user-pack.mjs` |

Sources PNG brutes et imports IA → `old_assets/prompts-archive/` (passer le chemin en argument aux scripts `import:*`).
