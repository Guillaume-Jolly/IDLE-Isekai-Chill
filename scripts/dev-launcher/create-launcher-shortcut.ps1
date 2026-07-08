# Cree un raccourci Windows Havre Dev Launcher (icone Lyra + DEV) - epinglable a la barre des taches.
param(
  [string]$Destination = "",
  [switch]$Desktop,
  [switch]$InRepoRoot,
  [switch]$PinHint
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoPath = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path
$LauncherVbs = Join-Path $RepoPath "scripts\dev-launcher\start-launcher.vbs"
$IconPath = Join-Path $RepoPath "scripts\dev-launcher\launcher-icon.ico"
$BuildIcon = Join-Path $RepoPath "scripts\dev-launcher\build-launcher-icon.mjs"

if (-not (Test-Path $IconPath)) {
  Write-Host "Generation de l'icone..."
  Push-Location $RepoPath
  node $BuildIcon
  Pop-Location
}

if (-not (Test-Path $IconPath)) {
  throw "Icone introuvable : $IconPath"
}

if (-not (Test-Path $LauncherVbs)) {
  throw "Script lanceur introuvable : $LauncherVbs"
}

function New-HavreLauncherShortcut([string]$LinkPath) {
  $parent = Split-Path -Parent $LinkPath
  if (-not (Test-Path $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  $Wsh = New-Object -ComObject WScript.Shell
  $Shortcut = $Wsh.CreateShortcut($LinkPath)
  $Shortcut.TargetPath = "$env:SystemRoot\System32\wscript.exe"
  $Shortcut.Arguments = "//nologo `"$LauncherVbs`""
  $Shortcut.WorkingDirectory = $RepoPath
  $Shortcut.IconLocation = "$IconPath,0"
  $Shortcut.WindowStyle = 7
  $Shortcut.Description = "Havre Dev Launcher - IDLE Isekai Chill (dashboard :9221)"
  $Shortcut.Save()
  Write-Host "Raccourci cree : $LinkPath"
}

$created = @()

if ($Destination) {
  $dest = $Destination
  if (-not $dest.EndsWith(".lnk", [System.StringComparison]::OrdinalIgnoreCase)) {
    $dest = Join-Path $dest "Havre Dev Launcher.lnk"
  }
  New-HavreLauncherShortcut $dest
  $created += $dest
}

if ($Desktop -or (-not $Destination -and -not $InRepoRoot)) {
  $desk = [Environment]::GetFolderPath("Desktop")
  $deskLink = Join-Path $desk "Havre Dev Launcher.lnk"
  New-HavreLauncherShortcut $deskLink
  $created += $deskLink
}

if ($InRepoRoot) {
  $rootLink = Join-Path $RepoPath "Havre Dev Launcher.lnk"
  New-HavreLauncherShortcut $rootLink
  $created += $rootLink
}

if ($PinHint -or $created.Count -gt 0) {
  Write-Host ""
  Write-Host "Epingler a la barre des taches :"
  Write-Host "  1. Clic droit sur le raccourci Havre Dev Launcher"
  Write-Host "  2. Epingler a la barre des taches"
  Write-Host ""
  Write-Host "(Windows n'autorise pas l'epinglage automatique - le .lnk avec icone est requis.)"
}
