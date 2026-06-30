# Dev log — phase 2.2 (résumé X / Y)

Journal **haut niveau** : une section par prompt (**X**), une ligne par tâche distincte (**Y**).

- **Politique :** [`docs/agent-guide/05-politique-versionnement.md`](../../agent-guide/05-politique-versionnement.md)
- **Kickoff :** [`docs/agent-guide/07-kickoff-nouvelle-version.md`](../../agent-guide/07-kickoff-nouvelle-version.md)
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

### X=2 — 2026-06-30 — Kickoff phase 2.2 + procédure agents

**But du prompt :** Initialiser officiellement la 2.2 (semver, révision UI, docs) et documenter le kickoff pour les agents futurs.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | Reset revision 1 + `version:prompt` | *(non commité)* | `v2.2.0.02` |
| 1 | Bump `2.2.0`, reset UI, guide `07-kickoff`, stubs `.ai/`, brief handoff | *(non commité)* | `v2.2.0.02.1` |

**Validations :** `npm run build` OK  
**Risques :** aucun (docs + versionnement uniquement)

---

### X=3 — 2026-06-30 — Écran connexion + splash chargement + visuels IA

**But du prompt :** Connexion id/mot de passe, carrousel de présentation, barre de chargement assets, visuels IA splash.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 1 | Warmup cache compagnons + probes parallèles | *(non commité)* | `v2.2.0.03.7` |
| 2 | `GameSessionGate`, login, carousel, 5 PNG IA `public/splash/` | *(non commité)* | `v2.2.0.03.8` |
| 54 | Lot session : warmup, logout, refuge, Chantier du havre, kickoff docs | `7d30383` | `v2.2.0.03.54` |

**Validations :** `npm run build` OK  
**Risques :** auth locale démo uniquement ; PNG IA à valider visuellement

---

## Template section X (futures entrées)

```markdown
### X={N} — YYYY-MM-DD — {titre court du prompt}

**But du prompt :** …

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | (après version:prompt si applicable) | | v2.2.0.{N} |
| 1 | … | abc1234 | v2.2.0.{N}.1 |

**Validations :** build OK / …
**Risques :** aucun / …
```
