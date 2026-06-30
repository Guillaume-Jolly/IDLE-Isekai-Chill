# Traçabilité projet

Logs, audits, TNR et inventaires assets — **à committer** (historique utile).

Playbooks opérationnels : [`../../staging/playbooks/`](../../staging/playbooks/)  
Guide agents : [`../../docs/agent-guide/README.md`](../../docs/agent-guide/README.md)  
**Index docs (éviter obsolète) :** [`../../docs/DOC_AGENT_INDEX.md`](../../docs/DOC_AGENT_INDEX.md)

---

## Structure

| Dossier | Contenu |
|---------|---------|
| [`changelog/`](./changelog/) | Micro-modifs par version UI (`entries/YYYY-MM-DD.md`) |
| [`tnr/`](./tnr/) | Rapports tests non-régression datés |
| [`audits/`](./audits/) | Readiness 2.0, orphan/dead, backlog pipelines, WebP |
| [`assets/`](./assets/) | Manifest, mapping migration, PHASE0, scans taille |
| [`REFERENCES.md`](./REFERENCES.md) | **Index croisé** — quels docs pointent ici |

---

## Règle agent

Chaque micro-modif significative → [`changelog/entries/`](./changelog/entries/) avec version UI + **intérêt**.

Politique version : [`../../docs/agent-guide/05-politique-versionnement.md`](../../docs/agent-guide/05-politique-versionnement.md)  
Pipeline validation : [`../../docs/agent-guide/06-pipeline-validation.md`](../../docs/agent-guide/06-pipeline-validation.md)  
État projet : [`./project-state.md`](./project-state.md)
