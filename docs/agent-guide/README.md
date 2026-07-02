# Guide agents — IDLE Isekai Chill

Point d'entrée pour **tout nouvel agent** (Cursor, humain, session future).

**Ordre de lecture obligatoire :**

1. [`AGENTS.md`](../../AGENTS.md) — règles dures
2. [`01-hierarchie-projet.md`](./01-hierarchie-projet.md) — où est quoi
3. [`02-guide-agent-general.md`](./02-guide-agent-general.md) — comment travailler
4. [`05-politique-versionnement.md`](./05-politique-versionnement.md) — numéro en haut à gauche
5. [`07-kickoff-nouvelle-version.md`](./07-kickoff-nouvelle-version.md) — **démarrage nouvelle phase** (proposer dès le 1er message)
6. [`../../staging/playbooks/00-project-onboarding.md`](../../staging/playbooks/00-project-onboarding.md) — produit + TNR
6. [`.ai/current-state.md`](../../.ai/current-state.md) — initiative en cours
7. [`docs/DOC_AGENT_INDEX.md`](../DOC_AGENT_INDEX.md) — quels docs faire confiance / ignorer
8. [`docs/HANDOFF_2_2_AGENT_BRIEF.md`](../HANDOFF_2_2_AGENT_BRIEF.md) — si phase 2.2
9. [`docs/HANDOFF_PARLER_CURATED_PISTE_B.md`](../HANDOFF_PARLER_CURATED_PISTE_B.md) — si reprise Parler curé aff. 5
10. [`docs/HANDOFF_NEW_MINIGAME_CO.md`](../HANDOFF_NEW_MINIGAME_CO.md) — si nouveau mini-jeu

---

## Index

| Fichier | Contenu |
|---------|---------|
| [01-hierarchie-projet.md](./01-hierarchie-projet.md) | Arborescence repo, zones sacrées, flux assets/code |
| [02-guide-agent-general.md](./02-guide-agent-general.md) | Workflow session, validation, communication user |
| [03-projets-ponctuels.md](./03-projets-ponctuels.md) | Imports one-shot, events, packs — sans systématiser |
| [04-fichiers-par-commit.md](./04-fichiers-par-commit.md) | Checklist fichiers à tenir à jour |
| [05-politique-versionnement.md](./05-politique-versionnement.md) | X/Y, hook Cursor, DEV_LOG, commits atomiques |
| [08-versionnement-global.md](./08-versionnement-global.md) | **A.B.C.X.Y** — machine à états, git hooks, User Rules |
| [06-pipeline-validation.md](./06-pipeline-validation.md) | Ordre validate / tnr / CI |
| [07-kickoff-nouvelle-version.md](./07-kickoff-nouvelle-version.md) | **Kickoff phase** — checklist + comportement agent |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](../HANDOFF_2_2_AGENT_BRIEF.md) | Brief + prompt agent phase 2.2 |
| [`HANDOFF_PARLER_CURATED_PISTE_B.md`](../HANDOFF_PARLER_CURATED_PISTE_B.md) | Piste B — Parler curé Lyra aff. 5 |
| [`HANDOFF_NEW_MINIGAME_CO.md`](../HANDOFF_NEW_MINIGAME_CO.md) | CO — créer un mini-jeu |
| [`REFERENCES.md`](../traceability/REFERENCES.md) | Index croisé docs → traçabilité |

---

## Journaux

| Dossier | Granularité | Public |
|---------|-------------|--------|
| [`../traceability/changelog/DEV_LOG_2_2.md`](../traceability/changelog/DEV_LOG_2_2.md) | **Résumé X/Y** + guide commits atomiques | Agents + user |
| Message de **commit** git | Lot cohérent + *pourquoi* | Historique git |
| [`.ai/current-state.md`](../../.ai/current-state.md) | État initiative | Agent suivant |

---

## Interlocuteur

**Guillaume** — seul décideur. Pas de push `main` sans go explicite.
