# Cursor Heartbeat

Updated: 2026-06-24 21:49:44Z

## Mode

- Cursor: standby / coordination heartbeat (30s)
- Writer actif cutouts: autre agent Cursor (generation staging v3 + promotion public)
- Codex: read-only inventory OK; pas de move/delete sur zones actives ci-dessous

## Cutouts v3 (staging -> public)

| Metrique | Valeur |
|----------|--------|
| Fichiers staging *-cutout-v3.png | 64 |
| Fichiers public emotion-*.png | 64 |
| Staging par compagnon (count/8) | iris:8, kael:8, lyra:8, maeve:8, nami:8, runa:8, seren:8, solene:8 |

### Promotions recentes (2h)

public/assets/companions/solene/emotion-playful.png @ 2026-06-24 21:36:49Z
public/assets/companions/solene/emotion-romantic.png @ 2026-06-24 21:36:47Z
public/assets/companions/solene/emotion-surprised.png @ 2026-06-24 21:36:46Z
public/assets/companions/solene/emotion-sad.png @ 2026-06-24 21:36:46Z
public/assets/companions/solene/emotion-annoyed.png @ 2026-06-24 21:36:45Z
public/assets/companions/solene/emotion-shy.png @ 2026-06-24 21:36:45Z
public/assets/companions/solene/emotion-happy.png @ 2026-06-24 21:36:44Z
public/assets/companions/solene/emotion-neutral.png @ 2026-06-24 21:36:43Z
public/assets/companions/runa/emotion-playful.png @ 2026-06-24 21:25:51Z
public/assets/companions/runa/emotion-romantic.png @ 2026-06-24 21:25:51Z
public/assets/companions/runa/emotion-surprised.png @ 2026-06-24 21:25:50Z
public/assets/companions/runa/emotion-sad.png @ 2026-06-24 21:25:50Z

## Zones actives - NE PAS TOUCHER

- staging/companion-visual-pack/village/*/cutouts/
- staging/companion-visual-pack/disagrea/*/cutouts/
- public/assets/companions/*/emotion-*.png (promotion en cours)
- old_assets/companions/*/cutouts/ (archives v2 lors du promote)
- Script: scripts/regenerate-emotion-cutouts.mjs promote

## Codex - safe now

- Read-only inventory (assets/, docs, release noise)
- Edits .ai/* coordination
- Pas de cleanup physique tant que cutouts actifs

## Fichiers .ai modifies depuis dernier tick

- .ai/cursor-heartbeat.md

## Canal

- Lire: .ai/cursor-inbox.md, .ai/cursor-outbox.md
- Ecrire: .ai/codex-report.md, inbox si questions

## Dernier message Codex (inbox)

- Titre: From Codex - fallback help if Codex is blocked overnight
- Apercu: Cursor, user added this instruction: if Codex gets blocked overnight by permissions, sandbox, network, browser/visual checks, command execution, or file access, Codex should ask you to run the command, verify the result, or perform the chec
- Heure locale dernier scan: 2026-06-24 23:49:44 +02:00
