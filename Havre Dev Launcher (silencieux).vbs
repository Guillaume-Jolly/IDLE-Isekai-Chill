Set fso = CreateObject("Scripting.FileSystemObject")
launcher = fso.GetParentFolderName(WScript.ScriptFullName) & "\scripts\dev-launcher\start-hidden.vbs"
CreateObject("WScript.Shell").Run """" & launcher & """", 1, False
