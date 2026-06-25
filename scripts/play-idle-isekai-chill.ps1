#Requires -Version 5.1
<#
.SYNOPSIS
  Installe Git et Node.js si besoin, télécharge IDLE Isekai Chill, lance le jeu.

.USAGE
  Double-clic sur Jouer-IDLE-Isekai-Chill.bat
#>
param(
  [string]$Branch = "main",
  [string]$InstallDir = (Join-Path $env:USERPROFILE "IDLE-Isekai-Chill"),
  [switch]$SkipToolInstall
)

$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/Guillaume-Jolly/IDLE-Isekai-Chill.git"
$DevPort = 5173
$GameUrl = "http://localhost:$DevPort/"
$TempDir = Join-Path $env:TEMP "idle-isekai-chill-setup"

function Write-Step([string]$Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
  Write-Host "OK  $Message" -ForegroundColor Green
}

function Write-Warn([string]$Message) {
  Write-Host "!!  $Message" -ForegroundColor Yellow
}

function Test-IsAdmin {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Refresh-SessionPath {
  $machine = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $user = [Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$machine;$user"
}

function Resolve-ToolPath([string]$Name, [string[]]$FallbackPaths) {
  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if ($command) { return $command.Source }

  foreach ($path in $FallbackPaths) {
    if (Test-Path $path) { return $path }
  }
  return $null
}

function Get-GitExe {
  Resolve-ToolPath "git" @(
    "${env:ProgramFiles}\Git\cmd\git.exe"
    "${env:ProgramFiles(x86)}\Git\cmd\git.exe"
  )
}

function Get-NodeExe {
  Resolve-ToolPath "node" @(
    "${env:ProgramFiles}\nodejs\node.exe"
  )
}

function Get-NpmExe {
  Resolve-ToolPath "npm" @(
    "${env:ProgramFiles}\nodejs\npm.cmd"
  )
}

function Invoke-External([string]$FilePath, [string[]]$ArgumentList) {
  $process = Start-Process -FilePath $FilePath -ArgumentList $ArgumentList -Wait -PassThru -NoNewWindow
  if ($process.ExitCode -ne 0) {
    throw "Commande echouee ($FilePath $($ArgumentList -join ' ')) — code $($process.ExitCode)"
  }
}

function Save-FileWithProgress([string]$Url, [string]$Destination, [string]$Label) {
  if (-not (Test-Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
  }

  Write-Host "Telechargement : $Label"
  Write-Host "  $Url"

  $request = [System.Net.HttpWebRequest]::Create($Url)
  $request.UserAgent = "IDLE-Isekai-Chill-Setup"
  $response = $request.GetResponse()
  $totalBytes = [int64]$response.ContentLength
  $readStream = $response.GetResponseStream()
  $fileStream = [System.IO.File]::Create($Destination)
  $buffer = New-Object byte[] 65536
  $readBytes = 0
  $totalRead = 0L

  try {
    while (($readBytes = $readStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
      $fileStream.Write($buffer, 0, $readBytes)
      $totalRead += $readBytes
      if ($totalBytes -gt 0) {
        $percent = [math]::Min(100, [math]::Round(($totalRead * 100) / $totalBytes))
        Write-Progress -Activity $Label -Status "$percent % ($totalRead / $totalBytes octets)" -PercentComplete $percent
      }
    }
  } finally {
    Write-Progress -Activity $Label -Completed
    $fileStream.Close()
    $readStream.Close()
    $response.Close()
  }

  Write-Ok "$Label telecharge."
}

function Install-WithWinget([string]$PackageId, [string]$Label) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    return $false
  }

  Write-Host "Installation via winget : $Label"
  $process = Start-Process -FilePath "winget" -ArgumentList @(
    "install", $PackageId,
    "-e",
    "--accept-package-agreements",
    "--accept-source-agreements",
    "--silent"
  ) -Wait -PassThru -NoNewWindow

  if ($process.ExitCode -eq 0 -or $process.ExitCode -eq 2316632107 -or $process.ExitCode -eq -1978335189) {
    Refresh-SessionPath
    Write-Ok "$Label installe (winget)."
    return $true
  }

  Write-Warn "winget a echoue pour $Label (code $($process.ExitCode)) — essai direct."
  return $false
}

function Install-Git {
  if (Get-GitExe) { return }

  Write-Step "Installation de Git"

  if (Install-WithWinget "Git.Git" "Git") {
    if (Get-GitExe) { return }
  }

  $release = Invoke-RestMethod -Uri "https://api.github.com/repos/git-for-windows/git/releases/latest"
  $asset = $release.assets | Where-Object { $_.name -match '64-bit\.exe$' -and $_.name -notmatch 'Portable' } | Select-Object -First 1
  if (-not $asset) { throw "Impossible de trouver l'installateur Git." }

  $installer = Join-Path $TempDir $asset.name
  Save-FileWithProgress -Url $asset.browser_download_url -Destination $installer -Label "Git for Windows"

  Write-Host "Installation silencieuse de Git (1-2 min)..."
  Invoke-External -FilePath $installer -ArgumentList @(
    "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-", "/CLOSEAPPLICATIONS", "/RESTARTAPPLICATIONS",
    "/COMPONENTS=icons,ext\reg\shellhere,assoc,assoc_sh"
  )

  Refresh-SessionPath
  if (-not (Get-GitExe)) { throw "Git installe mais introuvable dans le PATH." }
  Write-Ok "Git pret."
}

function Install-Node {
  if (Get-NodeExe) { return }

  Write-Step "Installation de Node.js LTS"

  if (Install-WithWinget "OpenJS.NodeJS.LTS" "Node.js LTS") {
    if (Get-NodeExe) { return }
  }

  $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
  $ltsVersion = ($index | Where-Object { $_.lts -ne $false } | Select-Object -First 1).version
  if (-not $ltsVersion) { throw "Impossible de determiner la version LTS de Node.js." }

  $msiName = "node-$ltsVersion-x64.msi"
  $msiUrl = "https://nodejs.org/dist/$ltsVersion/$msiName"
  $msiPath = Join-Path $TempDir $msiName

  Save-FileWithProgress -Url $msiUrl -Destination $msiPath -Label "Node.js $ltsVersion"

  Write-Host "Installation silencieuse de Node.js (1-2 min)..."
  Invoke-External -FilePath "msiexec.exe" -ArgumentList @("/i", "`"$msiPath`"", "/qn", "/norestart", "ADDLOCAL=ALL")

  Refresh-SessionPath
  if (-not (Get-NodeExe)) { throw "Node.js installe mais introuvable dans le PATH." }
  Write-Ok "Node.js pret."
}

function Ensure-RequiredTools {
  $needGit = -not (Get-GitExe)
  $needNode = -not (Get-NodeExe)

  if (($needGit -or $needNode) -and -not $SkipToolInstall) {
    if (-not (Test-IsAdmin)) {
      Write-Host ""
      Write-Host "Git ou Node.js manquant — elevation administrateur necessaire." -ForegroundColor Yellow
      Write-Host "Accepte la fenetre UAC pour installer automatiquement les outils." -ForegroundColor Yellow
      Start-Sleep -Seconds 2

      $elevateArgs = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", $PSCommandPath,
        "-Branch", $Branch,
        "-InstallDir", $InstallDir
      )
      Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $elevateArgs
      exit 0
    }

    if ($needGit) { Install-Git }
    if ($needNode) { Install-Node }
    Refresh-SessionPath
  }

  if (-not (Get-GitExe)) { throw "Git introuvable apres installation." }
  if (-not (Get-NodeExe)) { throw "Node.js introuvable apres installation." }
  if (-not (Get-NpmExe)) { throw "npm introuvable apres installation de Node.js." }
}

function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  $git = Get-GitExe
  & $git @Args
  if ($LASTEXITCODE -ne 0) { throw "git $($Args -join ' ') a echoue (code $LASTEXITCODE)." }
}

function Invoke-Npm {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  $npm = Get-NpmExe
  & $npm @Args
  if ($LASTEXITCODE -ne 0) { throw "npm $($Args -join ' ') a echoue (code $LASTEXITCODE)." }
}

function Get-CommandVersion([string]$ExePath) {
  try {
    return (& $ExePath --version 2>&1 | Select-Object -First 1).ToString().Trim()
  } catch {
    return "version inconnue"
  }
}

function Wait-ForHttp([string]$Url, [int]$TimeoutSeconds = 90) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
        return $true
      }
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  return $false
}

function Stop-PortListener([int]$Port) {
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object {
      Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Clear-Host
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  IDLE Isekai Chill — setup & lancement" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Depot   : $RepoUrl"
Write-Host "Branche : $Branch"
Write-Host "Dossier : $InstallDir"
Write-Host ""

Write-Step "Outils requis (Git + Node.js)"
Ensure-RequiredTools
Write-Ok "Git  $(Get-CommandVersion (Get-GitExe))"
Write-Ok "Node $(Get-CommandVersion (Get-NodeExe))"
Write-Ok "npm  $(Get-CommandVersion (Get-NpmExe))"

Write-Step "Telechargement / mise a jour du projet"

if (-not (Test-Path $InstallDir)) {
  New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

$gitDir = Join-Path $InstallDir ".git"
if (Test-Path $gitDir) {
  Write-Host "Projet deja present — git pull (progression ci-dessous)..."
  Push-Location $InstallDir
  try {
    $git = Get-GitExe
    & $git fetch origin $Branch --progress
    if ($LASTEXITCODE -ne 0) { throw "git fetch a echoue." }
    & $git checkout $Branch 2>$null
    if ($LASTEXITCODE -ne 0) {
      & $git checkout -b $Branch "origin/$Branch"
      if ($LASTEXITCODE -ne 0) { throw "git checkout $Branch a echoue." }
    }
    & $git pull origin $Branch --progress
    if ($LASTEXITCODE -ne 0) { throw "git pull a echoue." }
  } finally {
    Pop-Location
  }
  Write-Ok "Projet mis a jour."
} else {
  if ((Get-ChildItem -Path $InstallDir -Force | Measure-Object).Count -gt 0) {
    throw "Le dossier existe mais n'est pas un clone Git : $InstallDir"
  }
  Write-Host "Clone en cours (progression ci-dessous)..."
  Invoke-Git clone --progress --branch $Branch $RepoUrl $InstallDir
  Write-Ok "Projet clone."
}

Write-Step "Installation des dependances npm (1-3 min)"
Push-Location $InstallDir
try {
  Invoke-Npm install --progress=true
  Write-Ok "Dependances installees."
} finally {
  Pop-Location
}

Write-Step "Verification du projet"
Push-Location $InstallDir
try {
  if (-not (Test-Path "package.json")) { throw "package.json introuvable." }
  if (-not (Test-Path "node_modules")) { throw "node_modules introuvable." }
  if (-not (Test-Path "src\App.tsx")) { throw "Sources du jeu introuvables." }
  Write-Ok "Structure valide."

  if (Test-Path "src\data\linkCorpusV2.json") {
    Write-Host "Validation corpus Lien v2..."
    try {
      Invoke-Npm run validate:link-corpus
      Write-Ok "Corpus Lien v2 valide."
    } catch {
      Write-Warn "Validation corpus echouee — mode legacy."
    }
  } else {
    Write-Warn "Pas de corpus V2 — dialogues legacy."
  }
} finally {
  Pop-Location
}

Write-Step "Lancement du serveur"
Stop-PortListener -Port $DevPort
Start-Sleep -Seconds 1

$npm = Get-NpmExe
$serverCommand = "Set-Location -LiteralPath '$InstallDir'; & '$npm' run dev -- --host 127.0.0.1 --port $DevPort --strictPort"
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoExit",
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-Command",
  $serverCommand
) -WindowStyle Normal

Write-Host "Attente du demarrage sur $GameUrl ..."
if (-not (Wait-ForHttp -Url $GameUrl -TimeoutSeconds 90)) {
  throw "Le serveur n'a pas repondu. Regarde la fenetre PowerShell du serveur."
}

Write-Ok "Serveur pret."
Start-Process $GameUrl

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Jeu ouvert dans le navigateur !" -ForegroundColor Green
Write-Host "  URL : $GameUrl" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Garde la fenetre du serveur ouverte pendant que tu joues."
Write-Host "Arret : Ctrl+C dans la fenetre serveur."
Write-Host ""
