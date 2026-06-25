#Requires -Version 5.1
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$UiRoot = Join-Path $Root 'deploy\stable\launcher-ui'
$Ico = Join-Path $UiRoot 'app.ico'
$Cmd = Join-Path $Root 'Launch IDLE Isekai Chill.cmd'
$Lnk = Join-Path $Root 'Launch IDLE Isekai Chill.lnk'
if (-not (Test-Path $Ico) -or -not (Test-Path $Cmd)) { exit 1 }
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($Lnk)
$Shortcut.TargetPath = $Cmd
$Shortcut.WorkingDirectory = $Root
$Shortcut.IconLocation = "$Ico,0"
$Shortcut.Description = 'IDLE Isekai Chill — serveur stable'
$Shortcut.Save()
