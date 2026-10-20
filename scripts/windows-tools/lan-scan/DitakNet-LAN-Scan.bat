@echo off
title DitakNet LAN Scan - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet LAN Scan on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0lan-scan.ps1"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred during scan execution.
    pause
)
