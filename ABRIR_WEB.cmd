@echo off
setlocal
title PHP2Shell - Abrir la web
cd /d "%~dp0"
if not exist "scripts\preview.mjs" goto missing
if not exist "dist\PhP_Auditoria\browser\index.html" goto missing
where node.exe >nul 2>nul
if errorlevel 1 goto missingnode
echo Abriendo PHP2Shell en tu navegador...
echo No necesitas instalar las dependencias de Angular para esta vista.
echo.
node "scripts\preview.mjs" --open
if errorlevel 1 goto failed
exit /b 0

:missing
echo No se encuentran todos los archivos.
echo Haz clic derecho en el ZIP, elige Extraer todo y abre este archivo
echo desde la carpeta extraida PhP_Auditoria.
pause
exit /b 1

:missingnode
echo No se encuentra Node.js. Es necesario para abrir el servidor local.
echo Consulta LEEME_PRIMERO.txt y vuelve a abrir este archivo despues.
pause
exit /b 1

:failed
echo.
echo No se ha podido abrir la web. Conserva el mensaje de error de arriba.
echo Consulta LEEME_PRIMERO.txt.
pause
exit /b 1
