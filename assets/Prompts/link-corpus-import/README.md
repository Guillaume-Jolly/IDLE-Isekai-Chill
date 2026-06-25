# Import corpus Lien v2

Déposer ici le fichier :

`wonderland_companion_link_corpus_v2_clean_compact.zip`

Puis :

```bash
npm run validate:link-corpus
node scripts/import-link-corpus-v2.mjs
```

Sortie attendue après import : `src/data/linkCorpusV2.json` (gitignored jusqu'à validation).
