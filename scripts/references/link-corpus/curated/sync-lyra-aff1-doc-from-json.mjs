#!/usr/bin/env node
/** Resynchronise LYRA_AFF1_CURATED_12.md depuis lyra-aff1-curated-12.json (sections 01–12). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatSpeech } from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

const jsonPath = path.join(__dirname, 'lyra-aff1-curated-12.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const reviewDoc = data.meta.reviewDoc;
const docPath = path.resolve(ROOT, reviewDoc);

if (!fs.existsSync(docPath)) {
  console.error(`Doc introuvable : ${reviewDoc}`);
  process.exit(1);
}

function renderExchange(ex, num) {
  const toneCell = (tone) => (tone === 'sincere' ? `✓ ${tone}` : tone);
  const rows = ex.choices
    .map(
      (choice) =>
        `| ${toneCell(choice.tone)} | ${formatSpeech(choice.text)} | ${choice.reaction} | ${choice.emotion} |`,
    )
    .join('\n');

  return `## ${num} — ${ex.title}

**Contexte**  
${ex.bridge}

**Lyra**  
${formatSpeech(ex.companionLine)}

| Ton | Réponse | Réaction | Émotion |
|-----|---------|----------|---------|
${rows}

---
`;
}

function renderPacksSection() {
  const rows = (data.meta.sessionPacks ?? [])
    .map((pack, index) => {
      const nums = pack.exchangeIds
        .map((id) => id.replace('lyra-aff1-curated-', ''))
        .join(' → ');
      return `| pack-${index + 1} | ${pack.label} | ${nums} |`;
    })
    .join('\n');

  return `## Packs de session (3 échanges enchaînés)

| Pack | Label | Échanges |
|------|-------|----------|
${rows}

Une partie Parler = **un pack entier**, tiré au hasard (évite le même pack que la partie précédente si possible).

**Fil pack 4 :** réservation du livre (10) → lecture le matin (11) → mission d'observation mana (12), qui renvoie au fil des échanges 01–03.

---

## Commandes

- Grille seule : \`npm run validate:curated-parler:score\`
- Validation complète : \`npm run validate:curated-parler\`
- Resync doc : \`npm run sync:lyra-aff1-doc\`
- Smoke manuel : \`staging/playbooks/parler-smoke.md\`
`;
}

const docText = fs.readFileSync(docPath, 'utf8');
const headerEnd = docText.indexOf('\n## 01 — ');
if (headerEnd < 0) {
  console.error('Marqueur ## 01 — introuvable dans la doc');
  process.exit(1);
}

const header = docText.slice(0, headerEnd + 1);
const exchangeSections = data.exchanges
  .map((ex, index) => renderExchange(ex, String(index + 1).padStart(2, '0')))
  .join('\n');

const nextDoc = `${header}${exchangeSections}\n${renderPacksSection()}`;
fs.writeFileSync(docPath, nextDoc, 'utf8');
console.log(`Doc resynchronisée : ${reviewDoc} (${data.exchanges.length} échanges)`);
