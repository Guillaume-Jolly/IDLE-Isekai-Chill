@echo off
title IDLE Isekai Chill — Lanceur
cd /d "%~dp0"
node scripts/stable-launcher.mjs
if errorlevel 1 (
  echo.
  echo [Erreur] Le lanceur s'est arrêté avec une erreur.
  pause
)
