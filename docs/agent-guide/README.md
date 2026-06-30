# Guide agents — IDLE Isekai Chill

Point d'entrée pour **tout nouvel agent** (Cursor, humain, session future).

**Ordre de lecture obligatoire :**

1. [`AGENTS.md`](../../AGENTS.md) — règles dures
2. [`01-hierarchie-projet.md`](./01-hierarchie-projet.md) — où est quoi
3. [`02-guide-agent-general.md`](./02-guide-agent-general.md) — comment travailler
4. [`05-politique-versionnement.md`](./05-politique-versionnement.md) — numéro en haut à gauche
5. [`../../staging/playbooks/00-project-onboarding.md`](../../staging/playbooks/00-project-onboarding.md) — produit + TNR
6. [`.ai/current-state.md`](../../.ai/current-state.md) — initiative en cours
7. [`docs/DOC_AGENT_INDEX.md`](../DOC_AGENT_INDEX.md) — quels docs faire confiance / ignorer
8. [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](../HANDOFF_2_2_AGENT_BRIEF.md) — si phase 2.2

---

## Index

| Fichier | Contenu |
|---------|---------|
| [01-hierarchie-projet.md](./01-hierarchie-projet.md) | Arborescence repo, zones sacrées, flux assets/code |
| [02-guide-agent-general.md](./02-guide-agent-general.md) | Workflow session, validation, communication user |
| [03-projets-ponctuels.md](./03-projets-ponctuels.md) | Imports one-shot, events, packs — sans systématiser |
| [04-fichiers-par-commit.md](./04-fichiers-par-commit.md) | Checklist fichiers à tenir à jour |
| [05-politique-versionnement.md](./05-politique-versionnement.md) | `v2.1.0.X` / `v2.1.0.X.Y` — X=prompt, Y=tâche |
| [06-pipeline-validation.md](./06-pipeline-validation.md) | Ordre validate / tnr / CI |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](../HANDOFF_2_2_AGENT_BRIEF.md) | Brief + prompt agent phase 2.2 |
| [`REFERENCES.md`](../traceability/REFERENCES.md) | Index croisé docs → traçabilité |

---

## Journaux

| Dossier | Granularité | Public |
|---------|-------------|--------|
| [`../traceability/changelog/`](../traceability/changelog/) | **Chaque micro-modif** + version exacte | Agents + user |
| Message de **commit** git | Lot cohérent + *pourquoi* | Historique git |
| [`.ai/current-state.md`](../../.ai/current-state.md) | État initiative | Agent suivant |

---

## Interlocuteur

**Guillaume** — seul décideur. Pas de push `main` sans go explicite.
