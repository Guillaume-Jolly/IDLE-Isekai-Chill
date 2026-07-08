#!/usr/bin/env node
/** Resynchronise la review doc depuis un corpus Parler curé (sections 01–12). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatSpeech } from './curated-parler-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

const jsonPath = path.resolve(process.argv[2] ?? path.join(__dirname, 'lyra-aff1-curated-12.json'));
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const reviewDoc = data.meta.reviewDoc;
const docPath = path.resolve(ROOT, reviewDoc);
const affinity = data.meta?.affinity ?? 1;
const companionId = data.meta?.companionId ?? 'lyra';
const companionLabel = companionId.charAt(0).toUpperCase() + companionId.slice(1);
const sampleId = data.exchanges[0]?.id ?? '';
const idPrefixMatch = sampleId.match(/^([a-z]+-aff\d-curated(?:-[a-z-]+)?-)/);
const idPrefix = idPrefixMatch?.[1] ?? `${companionId}-aff${affinity}-curated-`;

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

  const actionBlock = ex.companionAction
    ? `\n**${companionLabel} (geste)**  \n${ex.companionAction.trim()}\n`
    : '';

  return `## ${num} — ${ex.title}

**Contexte**  
${ex.bridge}
${actionBlock}
**${companionLabel}**  
${formatSpeech(ex.companionLine)}

| Ton | Réponse | Réaction | Émotion |
|-----|---------|----------|---------|
${rows}

---
`;
}

function packThreadNotes(affinity) {
  if (affinity >= 5) {
    return `**Fil pack 1 :** verrou (01) → doigts table (02) → oral rayons (03).
**Fil pack 2 :** déshabille lit (04) → monte sur toi (05) → commode (06) → retour draps (07).
**Fil pack 3 :** pénétration draps (07) → rythme (08) → nu final (09).
**Fil pack 4 :** porte fermée (10) → sur les draps (11) → deuxième vague / aube (12).`;
  }
  if (affinity === 4) {
    return '**Fil pack 4 :** porte du lit (10) → jambe sur toi (11) → suis mon rythme (12).';
  }
  if (affinity === 3) {
    return '**Fil pack 4 :** place gardée (10) → même page / mains (11) → lampe qui faiblit (12).';
  }
  if (affinity === 2) {
    return '**Fil pack 4 :** place gardée (10) → page vingt / chapitre (11) → chiffres fourneaux avant vendredi (12).';
  }
  return '**Fil pack 4 :** réservation du livre (10) → lecture le matin (11) → mission d\'observation mana (12), qui renvoie au fil des échanges 01–03.';
}

function pack4ThreadNote() {
  return packThreadNotes(affinity);
}

function renderPacksSection() {
  const rows = (data.meta.sessionPacks ?? [])
    .map((pack, index) => {
      const nums = pack.exchangeIds.map((id) => id.replace(idPrefix, '')).join(' → ');
      return `| pack-${index + 1} | ${pack.label} | ${nums} |`;
    })
    .join('\n');

  const validateCmd =
    affinity >= 5
      ? 'npm run validate:curated-parler:aff5'
      : affinity === 4
        ? 'npm run validate:curated-parler:aff4'
        : affinity === 3
          ? 'npm run validate:curated-parler:aff3'
          : affinity === 2
            ? 'npm run validate:curated-parler:aff2'
            : 'npm run validate:curated-parler';

  return `## Packs de session (3 échanges enchaînés)

| Pack | Label | Échanges |
|------|-------|----------|
${rows}

Une partie Parler = **un pack entier**, tiré au hasard (évite le même pack que la partie précédente si possible).

${pack4ThreadNote()}

---

## Commandes

- Grille seule : \`npm run validate:curated-parler:score\` (+ chemin JSON si aff. 2)
- Validation complète : \`${validateCmd}\`
- Resync doc : \`npm run sync:lyra-curated-doc -- ${path.relative(ROOT, jsonPath).replace(/\\/g, '/')}\`
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
console.log(`Doc resynchronisée : ${reviewDoc} (${data.exchanges.length} échanges, aff. ${affinity})`);
