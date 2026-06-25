#Requires -Version 5.1
param(
  [Parameter(Mandatory)][string]$Url,
  [Parameter(Mandatory)][string]$UserDataDir,
  [Parameter(Mandatory)][string]$AppName
)
$ErrorActionPreference = 'Stop'

function Find-Browser {
  $candidates = @(
    ${env:ProgramFiles(x86)} + '\Microsoft\Edge\Application\msedge.exe',
    $env:ProgramFiles + '\Microsoft\Edge\Application\msedge.exe',
    ${env:LocalAppData} + '\Google\Chrome\Application\chrome.exe',
    ${env:ProgramFiles(x86)} + '\Google\Chrome\Application\chrome.exe',
    $env:ProgramFiles + '\Google\Chrome\Application\chrome.exe'
  )
  foreach ($path in $candidates) {
    if ($path -and (Test-Path -LiteralPath $path)) { return $path }
  }
  return $null
}

New-Item -ItemType Directory -Force -Path $UserDataDir | Out-Null
$browser = Find-Browser
if (-not $browser) {
  Write-Error 'Navigateur Chromium introuvable (Edge ou Chrome requis).'
}

$args = @(
  "--app=$Url",
  "--user-data-dir=$UserDataDir",
  '--new-window',
  '--disable-extensions',
  '--disable-features=msEdgeSidebar,msEdgeShoppingAssistant',
  '--no-first-run',
  '--no-default-browser-check'
)

$proc = Start-Process -FilePath $browser -ArgumentList $args -PassThru -WindowStyle Normal
Write-Output $proc.Id
