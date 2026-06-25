#Requires -Version 5.1
param(
  [switch]$LocalMachine
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$CaPem = Join-Path $Root "deploy\stable\certs\ca.pem"
$CaMobileCer = Join-Path $Root "deploy\stable\certs\ca-mobile.cer"
$PfxPath = Join-Path $Root "deploy\stable\certs\cert.pfx"
$PfxPass = "stable-local"

if (-not (Test-Path $CaPem) -and -not (Test-Path $PfxPath)) {
  Write-Host "Certificat absent. Lance: npm run tls:stable" -ForegroundColor Red
  exit 1
}

$trustPem = if (Test-Path $CaPem) { $CaPem } else { Join-Path $Root "deploy\stable\certs\cert.pem" }
$mobileCer = if (Test-Path $CaMobileCer) { $CaMobileCer } else { Join-Path $Root "deploy\stable\certs\cert-mobile.cer" }

if (Test-Path $mobileCer) {
  Copy-Item -Path $mobileCer -Destination (Join-Path $Root "deploy\stable\certs\cert.cer") -Force -ErrorAction SilentlyContinue
}

$store = if ($LocalMachine) { "Cert:\LocalMachine\Root" } else { "Cert:\CurrentUser\Root" }

if ($LocalMachine) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
  )
  if (-not $isAdmin) {
    Write-Host "Option -LocalMachine: relance PowerShell en administrateur." -ForegroundColor Yellow
    exit 1
  }
}

$existing = Get-ChildItem $store -ErrorAction SilentlyContinue | Where-Object {
  $_.Subject -match "IDLE Isekai Chill"
}

foreach ($cert in $existing) {
  Remove-Item -Path (Join-Path $store $cert.Thumbprint) -ErrorAction SilentlyContinue
}

Import-Certificate -FilePath $trustPem -CertStoreLocation $store | Out-Null

Write-Host ""
Write-Host "Certificat installe dans $store" -ForegroundColor Green
Write-Host ""
Write-Host "1. Ferme toutes les fenetres du navigateur."
Write-Host "2. Rouvre https://127.0.0.1:8787/"
Write-Host ""
Write-Host "Si l avertissement reste: scripts\trust-stable-tls.ps1 -LocalMachine (admin)."
Write-Host ""
Write-Host "Mobile: Parametres > Installer certificat > Certificat AC"
Write-Host "  Fichier: deploy/stable/certs/ca-mobile.cer"
Write-Host "  URL: https://192.168.x.x:8787/setup/ca-mobile.cer"
Write-Host "  PAS Certif. VPN et utilisateur applis"
Write-Host ""
Write-Host "Avertissement normal: certificat local, pas une attaque."
Write-Host ""
