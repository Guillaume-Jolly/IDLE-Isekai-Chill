#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$Root = Split-Path $PSScriptRoot -Parent
$ReleaseDir = Join-Path $Root "release"
$PackDir = Join-Path $ReleaseDir "pack-files"
$ZipPath = Join-Path $ReleaseDir "IDLE-Isekai-Chill-Lancer.zip"
$ExePath = Join-Path $ReleaseDir "IDLE-Isekai-Chill-Lancer.exe"
$LauncherCs = Join-Path $ReleaseDir "Launcher.cs"

Write-Host "Build pack ami - $Root"

New-Item -ItemType Directory -Path $PackDir -Force | Out-Null
New-Item -ItemType Directory -Path $ReleaseDir -Force | Out-Null

Copy-Item -Path (Join-Path $Root "scripts\Jouer-IDLE-Isekai-Chill.bat") -Destination $PackDir -Force
Copy-Item -Path (Join-Path $Root "scripts\play-idle-isekai-chill.ps1") -Destination $PackDir -Force

$readmeDst = Join-Path $PackDir "LISEZMOI.txt"
if (-not (Test-Path $readmeDst)) {
  Set-Content -Path $readmeDst -Encoding UTF8 -Value @"
IDLE Isekai Chill
Double-clic sur Jouer-IDLE-Isekai-Chill.bat (ou lance ce pack).
Internet requis. UAC possible pour Git/Node.
"@
}

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path (Join-Path $PackDir "*") -DestinationPath $ZipPath -Force
Write-Host "OK  ZIP : $ZipPath"

$zipBytes = [System.IO.File]::ReadAllBytes($ZipPath)
$byteLiteral = ($zipBytes | ForEach-Object { "0x{0:X2}" -f $_ }) -join ", "

$launcherSource = @"
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Reflection;

public static class IdleIsekaiLauncher
{
    private static readonly byte[] ZipPayload = new byte[] { $byteLiteral };

    public static void Main()
    {
        var extractDir = Path.Combine(Path.GetTempPath(), "idle-isekai-launch");
        try
        {
            if (Directory.Exists(extractDir))
            {
                Directory.Delete(extractDir, true);
            }
            Directory.CreateDirectory(extractDir);

            var zipPath = Path.Combine(extractDir, "pack.zip");
            File.WriteAllBytes(zipPath, ZipPayload);
            ZipFile.ExtractToDirectory(zipPath, extractDir);
            File.Delete(zipPath);

            var batPath = Path.Combine(extractDir, "Jouer-IDLE-Isekai-Chill.bat");
            if (!File.Exists(batPath))
            {
                throw new FileNotFoundException("Lanceur introuvable apres extraction.", batPath);
            }

            var startInfo = new ProcessStartInfo
            {
                FileName = batPath,
                WorkingDirectory = extractDir,
                UseShellExecute = true,
            };
            Process.Start(startInfo);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Erreur lanceur IDLE Isekai Chill:");
            Console.Error.WriteLine(ex.Message);
            Console.WriteLine();
            Console.WriteLine("Appuie sur Entree pour fermer...");
            Console.ReadLine();
            Environment.Exit(1);
        }
    }
}
"@

Set-Content -Path $LauncherCs -Value $launcherSource -Encoding UTF8

$cscCandidates = @(
  (Join-Path ${env:WINDIR} "Microsoft.NET\Framework64\v4.0.30319\csc.exe")
  (Join-Path ${env:WINDIR} "Microsoft.NET\Framework\v4.0.30319\csc.exe")
)
$csc = $cscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $csc) {
  Write-Warning "csc.exe introuvable - seul le ZIP est disponible."
} else {
  if (Test-Path $ExePath) { Remove-Item $ExePath -Force }
  Write-Host "Build EXE (C# launcher)..."
  $args = @(
    "/nologo"
    "/target:exe"
    "/optimize+"
    "/reference:System.IO.Compression.FileSystem.dll"
    "/out:$ExePath"
    $LauncherCs
  )
  & $csc @args
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $ExePath)) {
    throw "Compilation EXE echouee."
  }
  Write-Host "OK  EXE : $ExePath ($((Get-Item $ExePath).Length) octets)"
}

Write-Host ""
Write-Host "A envoyer a ton amie (un seul fichier suffit) :"
if (Test-Path $ExePath) { Write-Host "  $ExePath  (recommande)" }
Write-Host "  $ZipPath  (alternative)"
