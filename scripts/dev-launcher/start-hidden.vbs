Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
repoRoot = fso.GetParentFolderName(fso.GetParentFolderName(scriptDir))
serverScript = scriptDir & "\server.mjs"
sessionDir = scriptDir & "\.dev-session"
consoleLog = sessionDir & "\console.log"

If Not fso.FolderExists(sessionDir) Then
  fso.CreateFolder(sessionDir)
End If

cmd = "cmd /c cd /d """ & repoRoot & """ && node """ & serverScript & """ >> """ & consoleLog & """ 2>&1"
shell.Run cmd, 0, False

WScript.Sleep 1200
shell.Run "rundll32 url.dll,FileProtocolHandler http://127.0.0.1:9221/", 1, False
