@echo off
chcp 65001 >nul
title IDLE Isekai Chill — Installation et lancement
cd /d "%~dp0"

echo.
echo  IDLE Isekai Chill — installation automatique
echo  Git et Node.js seront installes si necessaire (UAC possible).
echo.
timeout /t 2 /nobreak >nul

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0play-idle-isekai-chill.ps1" %*

if errorlevel 1 (
  echo.
  echo Une erreur est survenue. Lis les messages ci-dessus.
  pause
  exit /b 1
)
