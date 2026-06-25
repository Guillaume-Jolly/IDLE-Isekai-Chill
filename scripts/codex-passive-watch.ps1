# Veille passive Codex — check .ai/ toutes les N secondes pendant N heures.
# Usage: pwsh -File scripts/codex-passive-watch.ps1 [-DurationHours 10] [-IntervalSeconds 30]
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$DurationHours = 10,
  [int]$IntervalSeconds = 30
)

$ErrorActionPreference = 'Stop'
Set-Location $RepoRoot

$watchScript = Join-Path $PSScriptRoot 'watch-codex-coordination.ps1'
if (-not (Test-Path $watchScript)) {
  Write-Error "Missing $watchScript"
}

$startedAt = Get-Date
$endsAt = $startedAt.AddHours($DurationHours)
$localStart = $startedAt.ToString('yyyy-MM-dd HH:mm:ss K')
$localEnd = $endsAt.ToString('yyyy-MM-dd HH:mm:ss K')

Write-Host "=== Codex passive watch START ==="
Write-Host "Started : $localStart"
Write-Host "Ends    : $localEnd"
Write-Host "Every   : ${IntervalSeconds}s"
Write-Host "Mode    : review-only, respond in .ai/cursor-outbox.md on Codex inbox changes"
Write-Host "================================="

& $watchScript -RepoRoot $RepoRoot -EmitTick

while ((Get-Date) -lt $endsAt) {
  Start-Sleep -Seconds $IntervalSeconds
  & $watchScript -RepoRoot $RepoRoot -EmitTick
}

$done = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss K')
Write-Host "=== Codex passive watch END ($done) ==="
