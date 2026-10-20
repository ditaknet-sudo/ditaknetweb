# ==============================================================================
# DitakNet Monitoring Server - Windows Docker Quick Runner
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "       DitakNet Monitoring Server - Windows Deployment v1.0         " -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "                Self-hosted on Docker or Linux                      " -ForegroundColor Gray
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker availability
$docker = Get-Command docker -ErrorAction SilentlyContinue

if (-not $docker) {
    Write-Host "[!] Docker Desktop was not found in your PATH." -ForegroundColor Yellow
    Write-Host "    DitakNet runs inside a light Docker container on port 5833." -ForegroundColor White
    Write-Host "    Please ensure Docker Desktop is installed and running." -ForegroundColor Gray
    Write-Host ""
    Write-Host "    Alternative: Run on Ubuntu / Debian / TrueNAS SCALE:" -ForegroundColor Cyan
    Write-Host "    docker compose up -d" -ForegroundColor Green
    Write-Host ""
    Write-Host "    Documentation: https://www.ditaknet.com/docs" -ForegroundColor White
} else {
    Write-Host "[*] Docker detected. Launching DitakNet server..." -ForegroundColor Green
    docker compose up -d
    Write-Host ""
    Write-Host "[+] DitakNet Server is starting on: http://localhost:5833" -ForegroundColor Green
    Start-Process "http://localhost:5833"
}
