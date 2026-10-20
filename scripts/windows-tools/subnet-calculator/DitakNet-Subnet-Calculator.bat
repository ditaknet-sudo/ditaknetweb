@echo off
title DitakNet Subnet Calculator & CIDR Planner - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Subnet Calculator on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0subnet-calculator.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Execution completed.
    pause
)
