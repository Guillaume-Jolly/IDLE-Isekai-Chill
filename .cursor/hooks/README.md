# Cursor hooks — Havre des Brumes

## Hooks actifs

| Event Cursor (fixe) | Script | Libellé `hookName` |
|---------------------|--------|-------------------|
| **`beforeSubmitPrompt`** | `A.B.C.X.Y - X update - prompt indent.mjs` | **A.B.C.X.Y - X update - prompt indent** |
| **`stop`** | `A.B.C.X.Y - Y update - subprompt indent.mjs` | **A.B.C.X.Y - Y update - subprompt indent** |

### Rappel agent DEV_LOG (hooks)

| Hook | Canal vers l'agent |
|------|-------------------|
| **X** | Écrit `.ai/dev-log-pending.md` (lu via `AGENTS.md`) |
| **Y / stop** | `followup_message` avec préfixe `même X` si la section X courante est encore « À COMPLÉTER » (max 3 relances / conversation) |

> **Hook X** : Cursor n'accepte que `continue` / `user_message` en sortie — pas de message agent direct.  
> **Hook stop** : `followup_message` relance l'agent automatiquement ; `même X` évite un double bump X.

> **Limite Cursor** : Settings affiche toujours `beforeSubmitPrompt` / `stop` (events imposés).
> Le **chemin du script** et le JSON **Output** portent les noms parlants.

### Opt-out user

| Message contient | Effet |
|------------------|-------|
| `même X` / `same X` | Pas de bump X |
| `même Y` / `same Y` | Pas de bump Y en fin de tour |

## Journal d'exécution (Output)

Chaque hook renvoie en tête du JSON :

```json
{
  "executionLogLabel": "IDLE Isekai Chill · v2.2.0.22 · bump X",
  "hookName": "A.B.C.X.Y - X update - prompt indent",
  "projectName": "idle-isekai-chill-game",
  "projectFolder": "IDLE Isekai Chill",
  "versionHook": { ... }
}
```

**`executionLogLabel`** = projet + version appliquée + action — à lire en ouvrant l'entrée du log.

> **`windows_temp_file`** dans la liste Cursor (Windows) = stdin passé via fichier temporaire.
> Ce libellé est **interne à Cursor** ; nos scripts ne peuvent pas le remplacer dans la colonne liste.
> Ouvre l'entrée → section **Output** → `executionLogLabel`.

## Après modification de `hooks.json`

1. **Redémarrer Cursor** (ou recharger la fenêtre)
2. Vérifier **Settings → Hooks** : les deux hooks listés
3. Canal **Hooks** (Output) : pas d'erreur au envoi d'un message

## Workspace trusted

Les hooks projet ne tournent que si le workspace est **trusted** (sécurité Cursor).

## Limites

- **Cloud Agents** : `beforeSubmitPrompt` ne tourne pas côté cloud (doc Cursor)
- **Hook Y** : max 1 bump par fin de tour agent ; tâches multiples → `npm run version:task` manuel entre les lots
- **`public/build-info.json`** : gitignoré, non compté dans le diff git

## Fichiers liés

| Fichier | Rôle |
|---------|------|
| `A.B.C.X.Y - X update - prompt indent.mjs` | Hook X |
| `A.B.C.X.Y - Y update - subprompt indent.mjs` | Hook Y |
| `scripts/lib/version-hook-output.mjs` | Libellés + `executionLogLabel` |
| `scripts/lib/version-hook-log.mjs` | Identité projet + `last-run.json` |
| `scripts/bump-prompt.mjs` / `bump-task.mjs` | Bump X / Y |
| `.cursor/rules/02-version-prompt-first.mdc` | Règle agent backup |
