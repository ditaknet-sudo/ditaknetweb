@echo off
title DitakNet Network Explorer - Windows Deep Diagnostics
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Network Explorer on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0network-explorer.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Execution completed or interrupted.
    pause
)
