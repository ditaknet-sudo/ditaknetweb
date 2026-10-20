# ==============================================================================
# DitakNet Patch Panel & Rack Mapping Tool (Windows)
# Created by DitakNet for Network Engineers and IT Specialists
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "DitakNet Patch Panel Manager v1.0"

Clear-Host
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         DitakNet 24-Port Patch Panel & Rack Visualizer v1.0         " -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "                Created by DitakNet for IT Professionals            " -ForegroundColor Gray
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$ports = @(
    @{ Id = 1;  Role = "Core Switch Trunk"; Status = "Uplink"; Color = "Blue"; PoE = "No" },
    @{ Id = 2;  Role = "Firewall Gateway";  Status = "Uplink"; Color = "Blue"; PoE = "No" },
    @{ Id = 3;  Role = "DitakNet Host 01";  Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 4;  Role = "Backup NAS Synology";Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 5;  Role = "CCTV NVR Main";     Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 6;  Role = "Camera Front Gate"; Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 7;  Role = "Camera Lobby";      Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 8;  Role = "Camera Parking";    Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 9;  Role = "Wi-Fi AP Floor 1";  Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 10; Role = "Wi-Fi AP Floor 2";  Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 11; Role = "IT Admin PC";       Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 12; Role = "Tech Bench Port";   Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 13; Role = "Hotel POS Terminal";Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 14; Role = "VoIP PBX Station";  Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 15; Role = "Barrier Gate Auto"; Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 16; Role = "Intercom Video Unit";Status = "PoE";   Color = "Yellow";PoE = "Yes" },
    @{ Id = 17; Role = "Office Switch Trunk";Status = "Active"; Color = "Green"; PoE = "No" },
    @{ Id = 18; Role = "Guest Lounge AP";   Status = "PoE";    Color = "Yellow";PoE = "Yes" },
    @{ Id = 19; Role = "Spare Port A";      Status = "Idle";   Color = "DarkGray";PoE = "No" },
    @{ Id = 20; Role = "Spare Port B";      Status = "Idle";   Color = "DarkGray";PoE = "No" },
    @{ Id = 21; Role = "Reserved Fiber Box";Status = "Idle";   Color = "DarkGray";PoE = "No" },
    @{ Id = 22; Role = "Reserved CCTV Exp"; Status = "Idle";   Color = "DarkGray";PoE = "No" },
    @{ Id = 23; Role = "Maintenance Jack";  Status = "Idle";   Color = "DarkGray";PoE = "No" },
    @{ Id = 24; Role = "Emergency Uplink";  Status = "Uplink"; Color = "Blue"; PoE = "No" }
)

Write-Host "Rack Elevation: Rack Unit #1 (1U Cat6A 24-Port Patch Panel)" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("{0,-6} {1,-28} {2,-12} {3,-8} {4}" -f "PORT", "DESTINATION / DEVICE", "STATUS", "POE", "CABLE COLOR") -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray

foreach ($p in $ports) {
    $c = switch ($p.Status) {
        "Active" { "Green" }
        "PoE"    { "Yellow" }
        "Uplink" { "Cyan" }
        default  { "Gray" }
    }
    Write-Host ("{0,-6} {1,-28} {2,-12} {3,-8} {4}" -f "[$($p.Id)]", $p.Role, $p.Status, $p.PoE, $p.Color) -ForegroundColor $c
}
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "Active: 8 | PoE: 6 | Uplink: 3 | Reserved/Idle: 7" -ForegroundColor Green
Write-Host ""

$jsonPath = Join-Path $PSScriptRoot "patch-panel-mapping.json"
$ports | ConvertTo-Json -Depth 3 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "[+] Patch Panel configuration exported to: $jsonPath" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
