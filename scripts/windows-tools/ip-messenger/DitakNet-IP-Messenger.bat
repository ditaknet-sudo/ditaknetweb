@echo off
title DitakNet Local IP Messenger Daemon (Port 5834)
color 0b
echo ===============================================================================
echo            DitakNet Local IP Messenger - Windows Standalone Daemon
echo          Direct LAN Peer-to-Peer Messaging By IP (Port 5834 / PWA)
echo ===============================================================================
echo.
echo [*] Checking Windows PowerShell environment...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ip-messenger.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Process exited or requires Administrator privileges to open port 5834.
    echo [*] Right-click this file and choose 'Run as administrator' if port binding was denied.
    pause
)
