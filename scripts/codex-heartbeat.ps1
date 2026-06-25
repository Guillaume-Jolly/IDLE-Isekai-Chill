# Heartbeat Codex - coordination status + cutout v3 progress (staging -> public).
# Usage: pwsh -File scripts/codex-heartbeat.ps1 [-RepoRoot path] [-EmitTick]
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [switch]$EmitTick
)

$ErrorActionPreference = 'Stop'
Set-Location $RepoRoot

$watchFiles = @(
  '.ai/cursor-inbox.md',
  '.ai/codex-report.md',
  '.ai/cursor-review-instructions.md',
  '.ai/next-task.md',
  '.ai/current-state.md',
  '.ai/cursor-outbox.md',
  '.ai/cursor-heartbeat.md'
)

$statePath = Join-Path $RepoRoot '.ai/cursor-heartbeat-state.json'
$heartbeatPath = Join-Path $RepoRoot '.ai/cursor-heartbeat.md'

function Get-LatestCodexInboxMessage {
  $inboxPath = Join-Path $RepoRoot '.ai/cursor-inbox.md'
  if (-not (Test-Path $inboxPath)) {
    return $null
  }
  $lines = Get-Content -Path $inboxPath -Encoding UTF8
  $headers = @()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^## From Codex - (.+)$') {
      $headers += @{
        title = $Matches[1].Trim()
        line = $i + 1
        id = ('codex-inbox:' + $Matches[1].Trim().ToLower())
      }
    }
  }
  if ($headers.Count -eq 0) { return $null }
  $last = $headers[$headers.Count - 1]
  $preview = @()
  for ($j = $last.line; $j -lt [Math]::Min($last.line + 6, $lines.Count); $j++) {
    if ($j -gt $last.line -and $lines[$j] -match '^## From Codex - ') { break }
    if ($lines[$j].Trim().Length -gt 0) { $preview += $lines[$j].Trim() }
  }
  return @{
    title = $last.title
    line = $last.line
    id = $last.id
    preview = ($preview -join ' ').Substring(0, [Math]::Min(240, ($preview -join ' ').Length))
  }
}

function Get-FileFingerprint {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    return @{ exists = $false; length = 0; mtime = $null; hash = $null }
  }
  $item = Get-Item $Path
  $hash = (Get-FileHash -Path $Path -Algorithm SHA256).Hash
  return @{
    exists = $true
    length = $item.Length
    mtime = $item.LastWriteTimeUtc.ToString('o')
    hash = $hash
  }
}

function Get-CutoutProgress {
  $stagingRoot = Join-Path $RepoRoot 'staging/companion-visual-pack'
  $publicRoot = Join-Path $RepoRoot 'public/assets/companions'
  $stagingV3 = @()
  $publicEmotions = @()
  $recentPromotions = @()

  foreach ($pack in @('village', 'disagrea')) {
    $packDir = Join-Path $stagingRoot $pack
    if (-not (Test-Path $packDir)) { continue }
    $stagingV3 += Get-ChildItem -Path $packDir -Recurse -Filter '*-cutout-v3.png' -File -ErrorAction SilentlyContinue
  }

  if (Test-Path $publicRoot) {
    $publicEmotions = Get-ChildItem -Path $publicRoot -Recurse -Filter 'emotion-*.png' -File -ErrorAction SilentlyContinue
    $cutoff = (Get-Date).AddHours(-2).ToUniversalTime()
    $recentPromotions = $publicEmotions | Where-Object { $_.LastWriteTimeUtc -ge $cutoff } |
      Sort-Object LastWriteTimeUtc -Descending |
      Select-Object -First 12
  }

  $byCompanion = @{}
  foreach ($file in $stagingV3) {
    if ($file.Name -match '^companion-([a-z]+)-emotion-') {
      $id = $Matches[1]
      if (-not $byCompanion.ContainsKey($id)) { $byCompanion[$id] = 0 }
      $byCompanion[$id] += 1
    }
  }

  $recentLines = @()
  foreach ($item in $recentPromotions) {
    $rel = $item.FullName.Replace($RepoRoot, '').TrimStart('\', '/').Replace('\', '/')
    $recentLines += ($rel + ' @ ' + $item.LastWriteTimeUtc.ToString('yyyy-MM-dd HH:mm:ss') + 'Z')
  }

  return @{
    stagingV3Count = $stagingV3.Count
    publicEmotionCount = $publicEmotions.Count
    stagingByCompanion = ($byCompanion.GetEnumerator() | Sort-Object Name | ForEach-Object { $_.Name + ':' + $_.Value }) -join ', '
    recentLines = $recentLines
  }
}

$previous = @{}
if (Test-Path $statePath) {
  try {
    $raw = Get-Content -Raw -Path $statePath | ConvertFrom-Json
    foreach ($prop in $raw.PSObject.Properties) {
      $previous[$prop.Name] = [string]$prop.Value
    }
  } catch {
    $previous = @{}
  }
}

$current = @{}
$changes = @()
$missing = @()

foreach ($rel in $watchFiles) {
  $full = Join-Path $RepoRoot ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
  $fp = Get-FileFingerprint -Path $full
  if (-not $fp.exists) {
    $missing += $rel
    $current[$rel] = 'missing'
    continue
  }
  $current[$rel] = $fp.hash + '|' + $fp.mtime + '|' + $fp.length
  if (-not $previous.ContainsKey($rel) -or $previous[$rel] -ne $current[$rel]) {
    if ($previous.Count -gt 0) {
      $changes += $rel
    }
  }
}

$timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss') + 'Z'
$localTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss K')
$cutouts = Get-CutoutProgress
$latestCodex = Get-LatestCodexInboxMessage
$lastCodexId = $null
if ($previous.ContainsKey('_lastCodexInboxId')) {
  $lastCodexId = $previous['_lastCodexInboxId']
}
$newCodexMessage = $false
if ($latestCodex -and $latestCodex.id -ne $lastCodexId) {
  if ($previous.Count -gt 0) {
    $newCodexMessage = $true
  }
  $current['_lastCodexInboxId'] = $latestCodex.id
}

$stateObj = [ordered]@{}
foreach ($entry in $current.GetEnumerator() | Sort-Object Name) {
  $stateObj[$entry.Key] = $entry.Value
}
($stateObj | ConvertTo-Json -Depth 3) | Set-Content -Path $statePath -Encoding utf8

$recentBlock = '_aucune_'
if ($cutouts.recentLines.Count -gt 0) {
  $recentBlock = ($cutouts.recentLines -join [Environment]::NewLine)
}

$changesBlock = '_aucun_'
if ($changes.Count -gt 0) {
  $changesBlock = (($changes | ForEach-Object { '- ' + $_ }) -join [Environment]::NewLine)
}

$lines = @(
  '# Cursor Heartbeat',
  '',
  ('Updated: ' + $timestamp),
  '',
  '## Mode',
  '',
  '- Cursor: standby / coordination heartbeat (30s)',
  '- Writer actif cutouts: autre agent Cursor (generation staging v3 + promotion public)',
  '- Codex: read-only inventory OK; pas de move/delete sur zones actives ci-dessous',
  '',
  '## Cutouts v3 (staging -> public)',
  '',
  '| Metrique | Valeur |',
  '|----------|--------|',
  ('| Fichiers staging *-cutout-v3.png | ' + $cutouts.stagingV3Count + ' |'),
  ('| Fichiers public emotion-*.png | ' + $cutouts.publicEmotionCount + ' |'),
  ('| Staging par compagnon (count/8) | ' + $cutouts.stagingByCompanion + ' |'),
  '',
  '### Promotions recentes (2h)',
  '',
  $recentBlock,
  '',
  '## Zones actives - NE PAS TOUCHER',
  '',
  '- staging/companion-visual-pack/village/*/cutouts/',
  '- staging/companion-visual-pack/disagrea/*/cutouts/',
  '- public/assets/companions/*/emotion-*.png (promotion en cours)',
  '- old_assets/companions/*/cutouts/ (archives v2 lors du promote)',
  '- Script: scripts/regenerate-emotion-cutouts.mjs promote',
  '',
  '## Codex - safe now',
  '',
  '- Read-only inventory (assets/, docs, release noise)',
  '- Edits .ai/* coordination',
  '- Pas de cleanup physique tant que cutouts actifs',
  '',
  '## Fichiers .ai modifies depuis dernier tick',
  '',
  $changesBlock,
  '',
  '## Canal',
  '',
  '- Lire: .ai/cursor-inbox.md, .ai/cursor-outbox.md',
  '- Ecrire: .ai/codex-report.md, inbox si questions',
  '',
  '## Dernier message Codex (inbox)',
  '',
  $(if ($latestCodex) { '- Titre: From Codex - ' + $latestCodex.title } else { '_aucun_' }),
  $(if ($latestCodex) { '- Apercu: ' + $latestCodex.preview } else { '' }),
  ('- Heure locale dernier scan: ' + $localTime)
)

$lines | Set-Content -Path $heartbeatPath -Encoding utf8

Write-Host ('[' + $timestamp + '] Codex heartbeat - staging v3: ' + $cutouts.stagingV3Count + ', public emotions: ' + $cutouts.publicEmotionCount + ', .ai changes: ' + $changes.Count)

if ($changes.Count -gt 0) {
  Write-Host 'Changed .ai files:'
  foreach ($file in $changes) {
    Write-Host ('  - ' + $file)
  }
}

if ($EmitTick) {
  if ($newCodexMessage -and $latestCodex) {
    $notifyPrompt = @(
      ('NOTIFY USER IN CHAT: new Codex inbox message at ' + $localTime + '.')
      ('Subject: From Codex - ' + $latestCodex.title + '.')
      ('Preview: ' + $latestCodex.preview + '.')
      'Read full message in .ai/cursor-inbox.md and respond in .ai/cursor-outbox.md if needed.'
    ) -join ' '
    $notifyPayload = @{
      prompt = $notifyPrompt
      type = 'codex-inbox-new'
      localTime = $localTime
      utcTime = $timestamp
      codexTitle = $latestCodex.title
      codexPreview = $latestCodex.preview
    } | ConvertTo-Json -Compress
    Write-Output ('AGENT_LOOP_TICK_codex-inbox ' + $notifyPayload)
  }

  $tickPrompt = @(
    'Codex heartbeat (30s). Read .ai/cursor-heartbeat.md and .ai/cursor-outbox.md first.'
    'If AGENT_LOOP_TICK_codex-inbox fired, tell the user the exact local time and Codex message summary in chat.'
    'Another Cursor agent is generating emotion cutouts v3 in staging and promoting to public/assets/companions.'
    'Do NOT move/delete/rename staging/companion-visual-pack/*/cutouts or public emotion-*.png while cutout agent is active.'
    'Read-only inventory and .ai coordination edits are OK.'
    'If .ai/cursor-inbox.md changed, respond via cursor-outbox or wait for user.'
    'Stay review-only unless next-task assigns you as writer for a non-cutout bounded task.'
  ) -join ' '
  $payload = @{
    prompt = $tickPrompt
    timestamp = $timestamp
    changed = $changes
    cutouts = @{
      stagingV3 = $cutouts.stagingV3Count
      publicEmotions = $cutouts.publicEmotionCount
    }
  } | ConvertTo-Json -Compress
  Write-Output ('AGENT_LOOP_TICK_codex-heartbeat ' + $payload)
}
