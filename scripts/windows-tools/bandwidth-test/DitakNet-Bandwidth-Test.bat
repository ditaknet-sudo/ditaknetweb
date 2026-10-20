@echo off
title DitakNet Bandwidth & Latency Jitter Tester - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet Bandwidth & Jitter Test on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0bandwidth-test.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Test completed or interrupted.
    pause
)
