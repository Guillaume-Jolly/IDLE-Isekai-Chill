/**
 * One-shot patch DEV_LOG stubs X=531–555 (session 2026-07-05).
 * Run: node scripts/patch-dev-log-stubs.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const path = join(root, 'docs/traceability/changelog/DEV_LOG_2_2.md')
let md = readFileSync(path, 'utf8')

const block531_550 = `### X=531 … X=545 — Lanceur dev v1.2.12→v1.2.15 (regroupé)

**Nature :** increments X multiples (messages rapides, screenshots, doublons) pendant l itération lanceur matin — X=532–544 = compteur hook sans section agent distincte.

**But du prompt (regroupé) :** Logs lisibles, version lanceur visible, sync UI, changelog « i », relance .bat.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` (X=531–545) | *(non commité)* | \`v2.2.0.531\` … \`v2.2.0.545\` |
| 1 | v1.2.12–v1.2.13 : changelog relu · logs 2 onglets Utilisateur/Verbose | *(non commité)* | lanceur |
| 2 | v1.2.14–v1.2.15 : verbose brut · user synthèse · sync bandeau rouge/vert | *(non commité)* | lanceur |

**Validations :** \`launcher-changelog.mjs\` · \`node --check scripts/dev-launcher/*.mjs\`  
**Risques :** X=532–544 non détaillés un par un

### X=546 — 2026-07-05 — Lanceur · audit, CMD, API injoignable

**But du prompt :** Audit sans résultat, fenêtre CMD bloquée au relancement, fausses alertes API injoignable pendant monitoring.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.546\` |
| 1 | v1.2.16–v1.2.19 : audit 45s · probe-health 4s · cache inventaire 4s · status stale 45s | *(non commité)* | lanceur |

**Validations :** audit < 45s · monitoring sans blocage status  
**Risques :** métriques Windows-only

### X=547 — 2026-07-05 — Lanceur · faux positif « Audit freeze »

**But du prompt :** Log « Audit freeze » affiché en erreur alors que le serveur répond.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.547\` |
| 1 | Renommage « Audit diagnostic » · exclusion filtres erreur · lanceur v1.2.20 | *(non commité)* | lanceur |

**Validations :** onglet Utilisateur sans faux positif freeze  
**Risques :** aucun

### X=548 — 2026-07-05 — Fix Vite ResourceKey dupliqué

**But du prompt :** Erreur Vite \`ResourceKey has already been declared\` au chargement du jeu.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.548\` |
| 1 | \`RewardToastProvider.tsx\` — import type \`ResourceKey\` en double retiré | *(non commité)* | \`v2.2.0.548.1\` |

**Validations :** \`npm run build\` OK  
**Risques :** aucun

### X=549 — 2026-07-05 — Écran chargement plein écran (stage)

**But du prompt :** Images du carrousel chargement pas en plein écran (régression layout).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.549\` |
| 1 | \`GameSessionGate.css\` — stage absolute inset 0 · footer overlay | *(non commité)* | \`v2.2.0.549.1\` |

**Validations :** \`npm run build\` OK  
**Risques :** recadrage cover sur ultra-larges

### X=550 — 2026-07-05 — Artefact hook (message vide)

**Nature :** bump X sur envoi screenshot sans texte user (11:26).

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.550\` |

**Validations :** —  
**Risques :** compteur hook seulement

`

const start531 = md.indexOf('### X=531 —')
const start551 = md.indexOf('### X=551 —')
if (start531 < 0 || start551 < 0) throw new Error('X=531 or X=551 anchor missing')
md = md.slice(0, start531) + block531_550 + md.slice(start551)

const replacements = {
  552: `### X=552 — 2026-07-05 — Info · chemins loading screen

**But du prompt :** Où sont les images du carrousel de chargement ?

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.552\` |

**Réponse :** \`public/splash/\` + config \`src/data/splashSlides.ts\` — pas de modif code.

**Validations :** —  
**Risques :** aucun`,
  553: `### X=553 — 2026-07-05 — Info · changelog lanceur « non documenté »

**But du prompt :** Pourquoi le lanceur affiche plein de X/Y « à vérifier / non documenté » ?

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.553\` |

**Réponse :** rechargement OK — stubs réels dans DEV_LOG (sections ⚠️ À COMPLÉTER) ; pas de modif code.

**Validations :** —  
**Risques :** aucun`,
  554: `### X=554 — 2026-07-05 — Hooks DEV_LOG · rappel agent auto

**But du prompt :** Modifier hooks X/Y pour dire à l agent de compléter le DEV_LOG.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.554\` |
| 1 | \`scripts/lib/dev-log-hook-reminder.mjs\` · hook X → \`.ai/dev-log-pending.md\` · hook stop → \`followup_message\` (max 3) | *(non commité)* | \`v2.2.0.554.1\` |

**Validations :** \`npm run validate:dev-log-hooks\`  
**Risques :** hook X ne peut pas envoyer follow-up agent (limitation Cursor) — canal = stop + fichier pending`,
  555: `### X=555 — 2026-07-05 — Validation hooks + repasse stubs session

**But du prompt :** Vérifier auto hooks DEV_LOG · compléter stubs avec historique session.

| Y | Résumé | Commit | Label UI |
|---|--------|--------|----------|
| 0 | \`version:prompt\` | *(non commité)* | \`v2.2.0.555\` |
| 1 | \`validate:dev-log-hooks\` dans package.json + validate-stack · DEV_LOG X=521–550,552–555 complétés | *(non commité)* | \`v2.2.0.555.1\` |

**Validations :** \`npm run validate:dev-log-hooks\` · \`npm run validate:stack\`  
**Risques :** ~100 stubs antérieurs (X<521) non traités dans ce lot`,
}

for (const [x, content] of Object.entries(replacements)) {
  const re = new RegExp(
    `### X=${x} —[\\s\\S]*?(?=\\n### X=|$)`,
    'm',
  )
  if (!re.test(md)) throw new Error(`stub X=${x} not found`)
  md = md.replace(re, content + '\n\n')
}

writeFileSync(path, md)
console.log('DEV_LOG patched: X=531–550, 552–555')
