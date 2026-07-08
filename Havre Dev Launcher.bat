@echo off
setlocal
cd /d "%~dp0"
title Havre Dev Launcher

:: Point d'entree unique — pas de fenetre cmd (logique dans start-launcher.vbs).
wscript //nologo "%~dp0scripts\dev-launcher\start-launcher.vbs"
exit /b %ERRORLEVEL%
