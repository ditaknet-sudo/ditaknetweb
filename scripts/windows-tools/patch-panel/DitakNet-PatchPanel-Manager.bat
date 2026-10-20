@echo off
title DitakNet Patch Panel Manager
cd /d "%~dp0"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0patch-panel.ps1"
pause
