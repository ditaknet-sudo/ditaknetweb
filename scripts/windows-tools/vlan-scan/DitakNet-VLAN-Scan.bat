@echo off
title DitakNet VLAN Scan - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet VLAN Scan on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0vlan-scan.ps1"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred during VLAN audit execution.
    pause
)
