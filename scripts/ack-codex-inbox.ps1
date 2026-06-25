# Marque le message Codex inbox comme lu/acquitte par Cursor (arrete les re-ticks).
# Usage: pwsh -File scripts/ack-codex-inbox.ps1 [-LastMessage "PING 2/7"]
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$LastMessage = ''
)

$ErrorActionPreference = 'Stop'
$inboxPath = Join-Path $RepoRoot '.ai/cursor-inbox.md'
$ackPath = Join-Path $RepoRoot '.ai/cursor-watch-ack.json'

if (-not (Test-Path $inboxPath)) {
  Write-Error "Missing $inboxPath"
}

$hash = (Get-FileHash -Path $inboxPath -Algorithm SHA256).Hash
$now = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss K')

@{
  inboxHash = $hash
  ackAtLocal = $now
  ackAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss') + 'Z'
  lastMessage = $LastMessage
} | ConvertTo-Json | Set-Content -Path $ackPath -Encoding utf8

Write-Host "Codex inbox acked at $now (hash $($hash.Substring(0, 12))...)"
