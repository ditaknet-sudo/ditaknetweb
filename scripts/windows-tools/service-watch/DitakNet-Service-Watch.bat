@echo off
title DitakNet Service Watch - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Service Watch on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0service-watch.ps1"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred during Service Watch execution.
    pause
)
