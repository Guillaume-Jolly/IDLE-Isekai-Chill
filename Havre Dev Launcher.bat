@echo off
setlocal
cd /d "%~dp0"
title Havre Dev Launcher

where node >nul 2>&1
if errorlevel 1 (
  echo [Erreur] Node.js est requis. Installez-le depuis https://nodejs.org/
  pause
  exit /b 1
)

echo.
echo  Havre des Brumes - Lanceur dev
echo  Tableau de bord : http://127.0.0.1:9221/
echo  Fermez cette fenetre pour arreter Vite et le lanceur.
echo.

node scripts\dev-launcher\server.mjs
if errorlevel 1 (
  echo.
  echo [Erreur] Le lanceur s'est arrete avec une erreur.
  pause
)
