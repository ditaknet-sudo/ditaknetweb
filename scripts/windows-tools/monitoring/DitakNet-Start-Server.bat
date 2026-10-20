@echo off
title DitakNet Monitoring Server - Windows Runner
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Monitoring Server...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0install-monitoring.ps1"
pause
