# Corpus compagnons V2 clean — import Cursor

Fichiers principaux :

- `companion_link_conversations.v2.clean.jsonl` : format recommandé pour scripts.
- `validate_companion_conversations_v2.py` : validateur bloquant.
- `validation_report_v2.md` : rapport.
- `validation_issues_v2.csv` : ne contient que l'en-tête si tout passe.
- `summary_counts.csv` : couverture par compagnon et niveau.
- `sample_*.json` : échantillons de contrôle.

Commande de validation :

```bash
python validate_companion_conversations_v2.py companion_link_conversations.v2.clean.jsonl validation_issues_v2.csv
```

Intégration recommandée : importer sous un flag `USE_COMPANION_LINK_V2_CLEAN`, tester un compagnon, puis généraliser.

Note : le pack compact ne contient pas les fichiers JSON lisible et TypeScript complets pour éviter un ZIP inutilement lourd. Le JSONL est la source de vérité ; Cursor peut générer un export TS depuis celui-ci si besoin.
