@echo off
title DitakNet CCTV Camera & RTSP Stream Probe - Windows
cd /d "%~dp0"
echo ====================================================================
echo Starting DitakNet CCTV Stream Probe on Windows...
echo ====================================================================
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0cctv-probe.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Execution completed or interrupted.
    pause
)
