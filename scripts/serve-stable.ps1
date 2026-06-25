#Requires -Version 5.1
<#
.SYNOPSIS
  Serveur stable isolé — LAN téléphone/PC, auth Basic.
  Ne rebuild jamais la PROD automatiquement.

.USAGE
  powershell -ExecutionPolicy Bypass -File scripts/serve-stable.ps1
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$StableRoot = Join-Path $Root "deploy\stable"
$DistIndex = Join-Path $StableRoot "dist\index.html"
$EnvExample = Join-Path $StableRoot "env.example"
$EnvLocal = Join-Path $StableRoot ".env.stable.local"

Set-Location $Root

if (-not (Test-Path $EnvLocal)) {
  Copy-Item $EnvExample $EnvLocal
  Write-Host ""
  Write-Host "Fichier cree : deploy/stable/.env.stable.local" -ForegroundColor Yellow
  Write-Host "Edite STABLE_AUTH_PASS avant un acces Internet." -ForegroundColor Yellow
  Write-Host ""
}

if (-not (Test-Path $DistIndex)) {
  Write-Host ""
  Write-Host "Build PROD absente." -ForegroundColor Red
  Write-Host "  1. commit + git push"
  Write-Host "  2. npm run build:stable:prod"
  Write-Host "  3. relance ce script"
  Write-Host ""
  exit 1
}

$PfxFile = Join-Path $StableRoot "certs\cert.pfx"
if (-not (Test-Path $PfxFile)) {
  Write-Host "Certificats HTTPS absents — generation…" -ForegroundColor Cyan
  & (Join-Path $Root "scripts\generate-stable-tls.ps1")
}

Write-Host "Demarrage serveur stable…" -ForegroundColor Cyan
node (Join-Path $StableRoot "server.mjs")
