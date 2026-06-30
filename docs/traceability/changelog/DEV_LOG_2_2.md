# Dev log — phase 2.2 (résumé X / Y)

Journal **haut niveau** : une section par prompt (**X**), une ligne par tâche distincte (**Y**).

- **Politique :** [`docs/agent-guide/05-politique-versionnement.md`](../../agent-guide/05-politique-versionnement.md)
- **Détail micro :** [`entries/`](./entries/) (optionnel pour gros lots)
- **Index jalon :** [`VERSION-INDEX.md`](./VERSION-INDEX.md)

## Convention

| Champ | Signification | Commande |
|-------|---------------|----------|
| **X** | Numéro prompt (`build-revision.json` → `revision`) | `npm run version:prompt` en début de prompt |
| **Y** | Sous-incrément tâche (`subRevision`) | `npm run version:task` après chaque tâche |
| **Label UI** | `v2.2.0.{X}` ou `v2.2.0.{X}.{Y}` | Affiché en haut à gauche |

**Commit :** 1 commit principal par **X** (fin de prompt) avec message décrivant le **but** ; commits intermédiaires par **Y** acceptés si lots reviewables.

---

## X=0 — Setup branche 2.2 (prévu)

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | Création `feature/2.2`, bump `2.2.0`, reset revision, docs handoff | *(à faire)* | `v2.2.0.01` |

---

## Entrées (à compléter par l'agent 2.2)

### Template section X

```markdown
### X={N} — YYYY-MM-DD — {titre court du prompt}

**But du prompt :** …

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | (après version:prompt si applicable) | | v2.2.0.{N} |
| 1 | … | abc1234 | v2.2.0.{N}.1 |
| 2 | … | def5678 | v2.2.0.{N}.2 |

**Validations :** build OK / …
**Risques :** aucun / …
```

---

*Aucune entrée 2.2 réelle tant que la branche `feature/2.2` n'est pas ouverte.*
