@echo off
title DitakNet Cloud - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Cloud Vault on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0cloud-sync.ps1"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred during DitakNet Cloud execution.
    pause
)
