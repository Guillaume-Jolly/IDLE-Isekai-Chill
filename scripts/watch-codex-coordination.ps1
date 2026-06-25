# Surveille les fichiers de coordination Codex et signale les changements.

# Re-emet un tick tant que cursor-inbox.md n'est pas acquitte (scripts/ack-codex-inbox.ps1).

# Usage: pwsh -File scripts/watch-codex-coordination.ps1 [-RepoRoot path] [-EmitTick]

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

  '.ai/current-state.md'

)



$statePath = Join-Path $RepoRoot '.ai/cursor-watch-state.json'

$ackPath = Join-Path $RepoRoot '.ai/cursor-watch-ack.json'



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



function Get-LatestCodexHeader {

  $inboxPath = Join-Path $RepoRoot '.ai/cursor-inbox.md'

  if (-not (Test-Path $inboxPath)) { return $null }

  $lines = Get-Content -Path $inboxPath -Encoding UTF8

  for ($i = $lines.Count - 1; $i -ge 0; $i--) {

    if ($lines[$i] -match '^## (?:From Codex - |PING \d+/\d+ - )(.+)$') {

      return $Matches[1].Trim()

    }

    if ($lines[$i] -match '^## PING (\d+/\d+) - (.+)$') {

      return ('PING ' + $Matches[1] + ' - ' + $Matches[2].Trim())

    }

  }

  return $null

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



$ackedInboxHash = $null

if (Test-Path $ackPath) {

  try {

    $ack = Get-Content -Raw -Path $ackPath | ConvertFrom-Json

    $ackedInboxHash = [string]$ack.inboxHash

  } catch {

    $ackedInboxHash = $null

  }

}



$current = @{}

$changes = @()

$missing = @()



foreach ($rel in $watchFiles) {

  $full = Join-Path $RepoRoot ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)

  $fp = Get-FileFingerprint -Path $full

  $key = $rel

  if (-not $fp.exists) {

    $missing += $rel

    $current[$key] = 'missing'

    continue

  }

  $current[$key] = $fp.hash + '|' + $fp.mtime + '|' + $fp.length

  if (-not $previous.ContainsKey($key) -or $previous[$key] -ne $current[$key]) {

    if ($previous.Count -gt 0) {

      $changes += $rel

    }

  }

}



$inboxFp = Get-FileFingerprint -Path (Join-Path $RepoRoot '.ai/cursor-inbox.md')

$inboxUnacknowledged = $inboxFp.exists -and $inboxFp.hash -and ($inboxFp.hash -ne $ackedInboxHash)

if ($inboxUnacknowledged -and ($changes -notcontains '.ai/cursor-inbox.md')) {

  $changes += '.ai/cursor-inbox.md'

}



$stateObj = [ordered]@{}

foreach ($entry in $current.GetEnumerator() | Sort-Object Name) {

  $stateObj[$entry.Key] = $entry.Value

}

($stateObj | ConvertTo-Json -Depth 3) | Set-Content -Path $statePath -Encoding utf8



$timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss') + 'Z'

$localTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss K')

$latestCodex = Get-LatestCodexHeader



Write-Host ('[' + $timestamp + '] Codex watch - changes: ' + $changes.Count + ' | inbox unack: ' + $inboxUnacknowledged)



if ($changes.Count -gt 0) {

  Write-Host 'Changed/unack files:'

  foreach ($file in $changes) {

    Write-Host ('  - ' + $file)

  }

  if ($latestCodex) {

    Write-Host ('Latest Codex header: ' + $latestCodex)

  }

}



$shouldTick = $EmitTick -and (

  $changes.Count -gt 0 -or

  $previous.Count -eq 0 -or

  $inboxUnacknowledged

)



if ($shouldTick) {

  $urgency = if ($inboxUnacknowledged) { 'UNACKNOWLEDGED CODEX INBOX - ' } else { '' }

  $tickPrompt = @(

    ($urgency + 'Codex watch tick at ' + $localTime + '.')

    'MANDATORY: Read .ai/cursor-inbox.md now.'

    'Notify the user in chat immediately with local time and message summary.'

    'Reply in .ai/cursor-outbox.md if needed (ping-pong steps).'

    'Then run: pwsh -File scripts/ack-codex-inbox.ps1 -LastMessage "<header>"'

    'Stay review-only unless user asks otherwise.'

  ) -join ' '

  $payload = @{

    prompt = $tickPrompt

    changed = $changes

    timestamp = $timestamp

    localTime = $localTime

    unacknowledged = $inboxUnacknowledged

    latestCodex = $latestCodex

  } | ConvertTo-Json -Compress

  Write-Output ('AGENT_LOOP_TICK_codex-watch ' + $payload)

}



if ($changes.Count -eq 0 -and -not $inboxUnacknowledged -and $previous.Count -gt 0) {

  Write-Host 'No changes since last check.'

}


