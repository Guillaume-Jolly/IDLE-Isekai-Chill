' Demarrage Havre Dev Launcher — sans fenetre cmd (appele depuis Havre Dev Launcher.bat).
Option Explicit

Dim shell, fso, repoRoot, scriptDir, sessionDir, consoleLog, serverScript, probeScript
Dim nodeCmd, probeExit, cleanupCmd, serverCmd, dashboardUrl

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
repoRoot = fso.GetParentFolderName(scriptDir)
serverScript = scriptDir & "\server.mjs"
probeScript = scriptDir & "\probe-health.mjs"
sessionDir = scriptDir & "\.dev-session"
consoleLog = sessionDir & "\console.log"
dashboardUrl = "http://127.0.0.1:9221/"

If Not fso.FolderExists(sessionDir) Then
  fso.CreateFolder(sessionDir)
End If

' Node present ?
nodeCmd = shell.Run("cmd /c where node >nul 2>&1", 0, True)
If nodeCmd <> 0 Then
  MsgBox "Node.js est requis." & vbCrLf & "Installez-le depuis https://nodejs.org/", 48, "Havre Dev Launcher"
  WScript.Quit 1
End If

' [1/3] Sonde :9221 (4 s max dans probe-health.mjs)
probeExit = shell.Run("cmd /c cd /d """ & repoRoot & """ && node """ & probeScript & """", 0, True)

If probeExit = 0 Then
  shell.Run "rundll32 url.dll,FileProtocolHandler " & dashboardUrl, 1, False
  WScript.Quit 0
End If

' [2/3] Nettoyage fantomes si absent ou obsolete
shell.Run "cmd /c cd /d """ & repoRoot & """ && node """ & serverScript & """ --cleanup-ghosts", 0, True

' [3/3] Lanceur en arriere-plan — logs dans .dev-session\console.log
' Le navigateur est ouvert par server.mjs une fois le port :9221 a l'ecoute (evite double onglet).
serverCmd = "cmd /c cd /d """ & repoRoot & """ && node """ & serverScript & """ >> """ & consoleLog & """ 2>&1"
shell.Run serverCmd, 0, False
