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



:: Lanceur sain deja actif ? Ouvrir le dashboard sans relancer.

node scripts\dev-launcher\probe-health.mjs >nul 2>&1

if %errorlevel%==0 (

  start "" "http://127.0.0.1:9221/"

  exit /b 0

)



:: Zombie ou port bloque — nettoyage puis demarrage propre

if %errorlevel%==2 (

  echo [Info] Ancien lanceur arrete ou bloque — nettoyage...

)

node scripts\dev-launcher\server.mjs --cleanup-ghosts >nul 2>&1



echo.

echo  Havre des Brumes - Lanceur dev

echo  Tableau de bord : http://127.0.0.1:9221/

echo  Fermez CETTE fenetre pour arreter Vite et le lanceur.

echo.

echo  Mode sans fenetre cmd : double-clic sur "Havre Dev Launcher (silencieux).vbs"

echo.



node scripts\dev-launcher\server.mjs

if errorlevel 1 (

  echo.

  echo [Erreur] Le lanceur s'est arrete avec une erreur.

  echo Astuce : node scripts\dev-launcher\server.mjs --cleanup-ghosts

  pause

)

