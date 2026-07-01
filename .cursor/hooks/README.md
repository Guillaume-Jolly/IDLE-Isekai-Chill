# Cursor hooks — Havre des Brumes

## `beforeSubmitPrompt` → bump X

À chaque message user, exécute `npm run version:prompt` :

- Incrémente **X**, remet **Y** à 0
- Injecte une section `⚠️ À COMPLÉTER` dans `docs/traceability/changelog/DEV_LOG_2_2.md`

**Opt-out :** écrire `même X` ou `same X` dans le message.

## Vérifier que ça tourne

1. Cursor → Settings → **Hooks** (ou canal output Hooks)
2. Envoyer un message test → `build-revision.json` doit changer
3. Si rien ne se passe : redémarrer Cursor (reload `hooks.json`)

## Fichiers

| Fichier | Rôle |
|---------|------|
| `.cursor/hooks.json` | Déclaration hook |
| `.cursor/hooks/bump-version-on-prompt.mjs` | Script stdin → bump |
| `.cursor/rules/02-version-prompt-first.mdc` | Règle agent backup |
