#Requires -Version 5.1
<#
.SYNOPSIS
  CA locale + certificat serveur pour HTTPS stable.
  Mobile : installer ca-mobile.cer comme Certificat AC (pas VPN/utilisateur).
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$CertDir = Join-Path $Root "deploy\stable\certs"
$CaPemPath = Join-Path $CertDir "ca.pem"
$CertPath = Join-Path $CertDir "cert.pem"
$PfxPath = Join-Path $CertDir "cert.pfx"
$CaMobileCer = Join-Path $CertDir "ca-mobile.cer"
$CertMobileCer = Join-Path $CertDir "cert-mobile.cer"
$PfxPass = "stable-local"

New-Item -ItemType Directory -Force -Path $CertDir | Out-Null

function Read-StableEnvValue($Key) {
  $envFile = Join-Path $Root "deploy\stable\.env.stable.local"
  if (-not (Test-Path $envFile)) { return $null }
  foreach ($line in Get-Content $envFile) {
    $trimmed = $line.Trim()
    if ($trimmed -match "^$Key=(.+)$") {
      return $matches[1].Trim()
    }
  }
  return $null
}

$ips = @("127.0.0.1")
Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | ForEach-Object {
  if ($_.IPAddress -and -not $_.IPAddress.StartsWith("169.254.")) {
    $ips += $_.IPAddress
  }
}
$ips = $ips | Select-Object -Unique

$sanParts = @("DNS=localhost")
foreach ($ip in $ips) {
  $sanParts += "IPAddress=$ip"
}

$publicHost = Read-StableEnvValue "STABLE_PUBLIC_HOST"
if ($publicHost) {
  if ($publicHost -match '^\d{1,3}(\.\d{1,3}){3}$') {
    if ($ips -notcontains $publicHost) { $ips += $publicHost }
    $sanParts += "IPAddress=$publicHost"
  } else {
    $sanParts += "DNS=$publicHost"
  }
}

$san = ($sanParts -join "&")

$ca = New-SelfSignedCertificate `
  -Subject "CN=IDLE Isekai Chill Local CA" `
  -KeyUsage CertSign, CRLSign, DigitalSignature `
  -KeyUsageProperty All `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -HashAlgorithm SHA256 `
  -KeyExportPolicy Exportable `
  -NotAfter (Get-Date).AddDays(825) `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -TextExtension @("2.5.29.19={text}CA=true&pathlength=0")

$server = New-SelfSignedCertificate `
  -Subject "CN=IDLE Isekai Chill Stable" `
  -Signer $ca `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -HashAlgorithm SHA256 `
  -KeyExportPolicy Exportable `
  -NotAfter (Get-Date).AddDays(825) `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1", "2.5.29.17={text}$san")

try {
  foreach ($item in @(
    @{ Cert = $ca; Path = $CaPemPath },
    @{ Cert = $server; Path = $CertPath }
  )) {
    $bytes = $item.Cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    $pem = @(
      "-----BEGIN CERTIFICATE-----"
      [Convert]::ToBase64String($bytes, [Base64FormattingOptions]::InsertLineBreaks)
      "-----END CERTIFICATE-----"
    ) -join "`n"
    [System.IO.File]::WriteAllText($item.Path, $pem + "`n")
  }

  $securePass = ConvertTo-SecureString -String $PfxPass -Force -AsPlainText
  Export-PfxCertificate -Cert $server -FilePath $PfxPath -Password $securePass | Out-Null

  $caDer = $ca.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
  [System.IO.File]::WriteAllBytes($CaMobileCer, $caDer)
  [System.IO.File]::WriteAllBytes($CertMobileCer, $caDer)
}
finally {
  Remove-Item -Path "Cert:\CurrentUser\My\$($ca.Thumbprint)" -ErrorAction SilentlyContinue
  Remove-Item -Path "Cert:\CurrentUser\My\$($server.Thumbprint)" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "[tls] CA + certificat serveur crees" -ForegroundColor Green
Write-Host "  Serveur PC : $PfxPath"
Write-Host "  Mobile CA  : $CaMobileCer"
Write-Host "  SAN        : localhost + $($ips -join ', ')"
if (-not $publicHost) {
  Write-Host ""
  Write-Host "  4G/mobile exterieur : ajoute STABLE_PUBLIC_HOST dans .env.stable.local" -ForegroundColor Yellow
  Write-Host "  (IP publique ou nom DuckDNS) puis relance npm run tls:stable" -ForegroundColor Yellow
} else {
  Write-Host "  Exterieur  : https://${publicHost}:8787/" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Android : Parametres > Installer certificat > Certificat AC (pas VPN)."
Write-Host "Fichier : ca-mobile.cer ou URL /setup/ca-mobile.cer"
Write-Host ""
