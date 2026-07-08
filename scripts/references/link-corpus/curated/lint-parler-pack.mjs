#!/usr/bin/env node
/**
 * Lint writer ciblé — 1 pack (3 échanges) depuis la source .mjs, sans rebuild 12× ni validate full.
 *
 * Usage :
 *   npm run lint:parler-pack -- --companion maeve --affinity 5 --pack pack-2
 *   npm run lint:parler-pack -- --companion runa --affinity 5 --pack pack-1 --mc female
 *   npm run lint:parler-pack -- --json scripts/.../maeve-aff5-curated-12.json --pack pack-2
 *
 * Pipeline : guards locaux → sémantique (slice) → walk pack → score A→G par échange.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runSemanticsValidation } from './validate-curated-parler-semantics.mjs';
import {
  loadAffModule,
  payloadFromModule,
  toFemaleMcCorpus,
} from './havre-parler/corpus-export.mjs';
import { lintExchangeDraft, writerChecklist, lintPackDraft } from './havre-parler/writer-guards.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

function parseArgs(argv) {
  const out = {
    companion: 'lyra',
    affinity: 5,
    pack: 'pack-1',
    mc: 'male',
    json: null,
    exchange: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--companion' && argv[i + 1]) out.companion = argv[++i];
    else if (arg === '--affinity' && argv[i + 1]) out.affinity = Number(argv[++i]);
    else if (arg === '--pack' && argv[i + 1]) out.pack = argv[++i];
    else if (arg === '--mc' && argv[i + 1]) out.mc = argv[++i];
    else if (arg === '--json' && argv[i + 1]) out.json = argv[++i];
    else if (arg === '--exchange' && argv[i + 1]) out.exchange = argv[++i];
    else if (arg.endsWith('.json')) out.json = arg;
  }
  return out;
}

async function corpusFromSource(companion, affinity, packId, mc) {
  const mod = await loadAffModule(companion, affinity);
  const male = payloadFromModule(mod, companion, affinity);
  let corpus = male;
  if (mc === 'female') {
    corpus = toFemaleMcCorpus(male, companion, affinity);
  }
  const pack = (corpus.meta.sessionPacks ?? []).find((entry) => entry.id === packId);
  if (!pack) {
    throw new Error(`Pack ${packId} introuvable — ${companion} aff. ${affinity}`);
  }
  const byId = new Map(corpus.exchanges.map((ex) => [ex.id, ex]));
  const exchanges = pack.exchangeIds.map((id) => byId.get(id)).filter(Boolean);
  if (exchanges.length === 0) {
    throw new Error(`Aucun échange pour ${packId}`);
  }
  return {
    meta: { ...corpus.meta, sessionPacks: [pack] },
    exchanges,
  };
}

function corpusFromJson(jsonPath, packId, exchangeId) {
  const data = JSON.parse(fs.readFileSync(path.resolve(jsonPath), 'utf8'));
  if (exchangeId) {
    const ex = data.exchanges.find((entry) => entry.id === exchangeId);
    if (!ex) throw new Error(`Échange ${exchangeId} introuvable`);
    const pack =
      (data.meta.sessionPacks ?? []).find((entry) => entry.exchangeIds?.includes(exchangeId)) ??
      { id: 'pack-?', label: '?', exchangeIds: [exchangeId] };
    return { meta: { ...data.meta, sessionPacks: [pack] }, exchanges: [ex] };
  }
  const pack = (data.meta.sessionPacks ?? []).find((entry) => entry.id === packId);
  if (!pack) throw new Error(`Pack ${packId} introuvable dans ${jsonPath}`);
  const byId = new Map(data.exchanges.map((ex) => [ex.id, ex]));
  const exchanges = pack.exchangeIds.map((id) => byId.get(id)).filter(Boolean);
  return { meta: { ...data.meta, sessionPacks: [pack] }, exchanges };
}

function runWalkPack(tempJson, packId) {
  const script = path.join(__dirname, 'walk-pack-coherence.mjs');
  return spawnSync(process.execPath, [script, tempJson, '--pack', packId, '--profile', 'romantic'], {
    encoding: 'utf8',
    cwd: ROOT,
  });
}

function runScoreExchange(tempJson, exchangeId) {
  const script = path.join(__dirname, 'score-curated-exchange.mjs');
  return spawnSync(process.execPath, [script, tempJson], { encoding: 'utf8', cwd: ROOT });
}

async function main() {
  const flags = parseArgs(process.argv);
  let slice;

  if (flags.json) {
    slice = corpusFromJson(flags.json, flags.pack, flags.exchange);
  } else if (flags.companion === 'lyra' && flags.affinity >= 4) {
    const jsonPath = path.join(__dirname, `lyra-aff${flags.affinity}-curated-12.json`);
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Source Lyra : regénérer ${jsonPath} ou utiliser --json`);
    }
    slice = corpusFromJson(jsonPath, flags.pack, flags.exchange);
  } else {
    slice = await corpusFromSource(flags.companion, flags.affinity, flags.pack, flags.mc);
  }

  const { meta, exchanges } = slice;
  const packId = meta.sessionPacks[0]?.id ?? flags.pack;
  const scope = flags.exchange
    ? `échange ${flags.exchange}`
    : `${meta.companionId ?? flags.companion} aff. ${meta.affinity ?? flags.affinity} · ${packId} · MC ${meta.protagonistGender ?? flags.mc}`;

  console.log(`# Lint writer — ${scope}\n`);
  console.log('## Checklist (avant écriture)');
  for (const line of writerChecklist(meta.affinity ?? flags.affinity, meta.companionId ?? flags.companion, meta.phaseB === true || /phase\s+b/i.test(String(meta.purpose ?? '')))) {
    console.log(`- ${line}`);
  }
  console.log('');

  console.log('## Guards locaux (instantané)');
  let guardFail = 0;
  for (const ex of exchanges) {
    const errs = lintExchangeDraft(ex, {
      affinity: meta.affinity,
      companionId: meta.companionId,
      packId,
      phaseB: meta.phaseB === true || /phase\s+b/i.test(String(meta.purpose ?? '')),
    });
    if (errs.length === 0) {
      console.log(`✓ ${ex.id} — ${ex.title}`);
    } else {
      guardFail += errs.length;
      console.log(`✗ ${ex.id} — ${ex.title}`);
      for (const err of errs) {
        console.log(`  [${err.code}] ${err.field}: ${err.hint}`);
      }
    }
  }
  console.log('');

  console.log('## Guards pack (S72–S76)');
  const packGuardErrs = lintPackDraft(slice);
  if (packGuardErrs.length === 0) {
    console.log(`✓ ${packId} — quotas pack OK`);
  } else {
    for (const err of packGuardErrs) {
      if (err.severity !== 'warn') guardFail += 1;
      console.log(`${err.severity === 'warn' ? '⚠' : '✗'} [${err.code}] ${err.hint}`);
    }
  }
  console.log('');

  const semanticsFailures = [];
  runSemanticsValidation(slice, {
    fail: (code, message) => semanticsFailures.push({ code, message }),
    warn: () => {},
  });

  console.log('## Sémantique (slice pack)');
  if (semanticsFailures.length === 0) {
    console.log('✓ Sémantique OK sur le slice.');
  } else {
    for (const entry of semanticsFailures) {
      console.log(`✗ [${entry.code}] ${entry.message}`);
    }
  }
  console.log('');

  const tempJson = path.join(
    os.tmpdir(),
    `parler-lint-${meta.companionId ?? flags.companion}-aff${meta.affinity}-${packId}.json`,
  );
  fs.writeFileSync(tempJson, `${JSON.stringify(slice, null, 2)}\n`, 'utf8');

  if ((meta.affinity ?? flags.affinity) >= 5 && !flags.exchange) {
    console.log('## Walk pack');
    const walk = runWalkPack(tempJson, packId);
    process.stdout.write(walk.stdout);
    if (walk.stderr) process.stderr.write(walk.stderr);
    console.log(walk.status === 0 ? '✓ Walk OK' : '✗ Walk échoué');
    console.log('');
  }

  console.log('## Score A→G (échanges du slice)');
  for (const ex of exchanges) {
    const single = { meta, exchanges: [ex] };
    const singlePath = path.join(os.tmpdir(), `parler-lint-one-${ex.id}.json`);
    fs.writeFileSync(singlePath, `${JSON.stringify(single, null, 2)}\n`, 'utf8');
    const score = runScoreExchange(singlePath, ex.id);
    const headline = score.stdout.split('\n').find((line) => line.includes(ex.id)) ?? score.stdout.split('\n')[2];
    console.log(headline?.trim() ?? ex.id);
  }

  const exitCode =
    guardFail > 0 || semanticsFailures.length > 0
      ? 1
      : 0;
  console.log(`\n${exitCode === 0 ? '✓ Lint pack OK — prêt export / relecteur' : '✗ Corriger avant rebuild JSON'}`);
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
