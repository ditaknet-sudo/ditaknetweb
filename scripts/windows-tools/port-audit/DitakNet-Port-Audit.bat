@echo off
title DitakNet Port Audit & Firewall NAT Check - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Port Audit & Firewall NAT Check on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0port-audit.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Audit completed or interrupted.
    pause
)
