# ==============================================================================
# DitakNet VLAN Scan - Standalone Windows Network Segmentation Tool
# Created by DitakNet for Network Engineers and IT Specialists
# ==============================================================================

[CmdletBinding()]
param (
    [string[]]$CustomVlanGateways = @(),
    [int]$TimeoutMs = 350
)

$Host.UI.RawUI.WindowTitle = "DitakNet VLAN Scan v1.0 - Windows Network Tool"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "          DitakNet VLAN Scan - Windows Segmentation Tool v1.0       " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "         VLAN Mapping, Isolation Checks & Gateway Inspector         " -ForegroundColor Gray
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
}

Show-Header

# 1. Discover Local Adapters and 802.1Q VLAN properties
Write-Host "[*] Auditing Windows Network Adapters & 802.1Q VLAN Configuration..." -ForegroundColor Yellow

$adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
$adapterDetails = @()

foreach ($nic in $adapters) {
    # Check advanced properties for VLAN ID (Intel, Realtek, Broadcom)
    $vlanProperty = Get-NetAdapterAdvancedProperty -Name $nic.Name -ErrorAction SilentlyContinue | 
        Where-Object { $_.DisplayName -match 'VLAN ID|VLAN Tag|Priority & VLAN' } | Select-Object -First 1

    $vlanId = if ($vlanProperty) { $vlanProperty.DisplayValue } else { "Untagged (VLAN 1 Default)" }
    $ipConfig = Get-NetIPAddress -InterfaceIndex $nic.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object -First 1

    $adapterDetails += [PSCustomObject]@{
        InterfaceName = $nic.Name
        Description   = $nic.InterfaceDescription
        LinkSpeed     = $nic.LinkSpeed
        MACAddress    = $nic.MacAddress
        IPAddress     = if ($ipConfig) { $ipConfig.IPAddress } else { "None" }
        VlanSetting   = $vlanId
    }
}

Write-Host ""
Write-Host "Active Physical & Virtual Network Interfaces:" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("{0,-20} {1,-18} {2,-16} {3,-12} {4}" -f "INTERFACE", "IP ADDRESS", "MAC ADDRESS", "SPEED", "VLAN SETTING") -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray

foreach ($ad in $adapterDetails) {
    Write-Host ("{0,-20} {1,-18} {2,-16} {3,-12} {4}" -f $ad.InterfaceName, $ad.IPAddress, $ad.MACAddress, $ad.LinkSpeed, $ad.VlanSetting) -ForegroundColor Green
}
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray

# 2. Inspect Routes & Subnets
Write-Host ""
Write-Host "[*] Analyzing Routing Table & Discovered Subnets..." -ForegroundColor Yellow

$routes = Get-NetRoute -AddressFamily IPv4 | Where-Object { 
    $_.DestinationPrefix -notmatch '^(0\.0\.0\.0/0|127\.|224\.|255\.)' 
} | Select-Object DestinationPrefix, NextHop, RouteMetric, InterfaceAlias | Sort-Object DestinationPrefix -Unique

Write-Host "Configured Subnet Routes:" -ForegroundColor Cyan
foreach ($r in $routes) {
    Write-Host "  -> Subnet: $($r.DestinationPrefix) via $($r.InterfaceAlias) (NextHop: $($r.NextHop))" -ForegroundColor White
}

# 3. Test Common VLAN Segments & Gateway Isolation
Write-Host ""
Write-Host "[*] Probing Standard Infrastructure VLAN Gateways & Isolation..." -ForegroundColor Cyan

$standardVlans = @(
    [PSCustomObject]@{ VlanId = 1;  Name = "Default LAN / Admin"; Gateway = "192.168.1.1";  Subnet = "192.168.1.0/24"; ExpectedRole = "Management & Core" },
    [PSCustomObject]@{ VlanId = 10; Name = "Server Rack / Hosts";  Gateway = "192.168.10.1"; Subnet = "192.168.10.0/24"; ExpectedRole = "DitakNet Host / NAS" },
    [PSCustomObject]@{ VlanId = 20; Name = "CCTV Surveillance";   Gateway = "192.168.20.1"; Subnet = "192.168.20.0/24"; ExpectedRole = "IP Cameras & NVR" },
    [PSCustomObject]@{ VlanId = 30; Name = "Guest Wi-Fi / Hotspot"; Gateway = "172.16.30.1";   Subnet = "172.16.30.0/24"; ExpectedRole = "Client Isolated" },
    [PSCustomObject]@{ VlanId = 40; Name = "Office Workstations";  Gateway = "192.168.40.1"; Subnet = "192.168.40.0/24"; ExpectedRole = "Staff Desktops & POS" },
    [PSCustomObject]@{ VlanId = 50; Name = "VoIP Telephony";       Gateway = "192.168.50.1"; Subnet = "192.168.50.0/24"; ExpectedRole = "SIP PBX & IP Phones" }
)

$pinger = [System.Net.NetworkInformation.Ping]::new()
$vlanResults = @()

foreach ($v in $standardVlans) {
    $isReachable = $false
    $latency = "Timeout"
    
    try {
        $reply = $pinger.Send($v.Gateway, $TimeoutMs)
        if ($reply.Status -eq 'Success') {
            $isReachable = $true
            $latency = "$($reply.RoundtripTime) ms"
        }
    } catch { }

    $vlanResults += [PSCustomObject]@{
        VlanID        = "VLAN $($v.VlanId)"
        SegmentName   = $v.Name
        Subnet        = $v.Subnet
        Gateway       = $v.Gateway
        Reachable     = if ($isReachable) { "REACHABLE" } else { "ISOLATED/ABSENT" }
        Latency       = $latency
        IsolationNote = if ($isReachable) { "Cross-routing active" } else { "Properly isolated or inactive" }
    }
}
$pinger.Dispose()

Write-Host ""
Write-Host "VLAN Segment Reachability & Isolation Matrix:" -ForegroundColor Cyan
Write-Host "====================================================================================================" -ForegroundColor DarkGray
Write-Host ("{0,-9} {1,-26} {2,-18} {3,-15} {4,-18} {5}" -f "VLAN", "SEGMENT ROLE", "SUBNET", "GATEWAY", "STATUS", "LATENCY") -ForegroundColor Yellow
Write-Host "====================================================================================================" -ForegroundColor DarkGray

foreach ($res in $vlanResults) {
    $color = if ($res.Reachable -eq "REACHABLE") { "Green" } else { "Gray" }
    Write-Host ("{0,-9} {1,-26} {2,-18} {3,-15} {4,-18} {5}" -f $res.VlanID, $res.SegmentName, $res.Subnet, $res.Gateway, $res.Reachable, $res.Latency) -ForegroundColor $color
}
Write-Host "====================================================================================================" -ForegroundColor DarkGray
Write-Host ""

# 4. Export Report
$csvPath = Join-Path $PSScriptRoot "vlan-scan-report.csv"
$jsonPath = Join-Path $PSScriptRoot "vlan-scan-report.json"

$vlanResults | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
$finalReport = @{
    Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    Adapters  = $adapterDetails
    Subnets   = $routes
    VlanAudit = $vlanResults
}
$finalReport | ConvertTo-Json -Depth 4 | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "[+] VLAN Audit Report saved to:" -ForegroundColor Green
Write-Host "    CSV  : $csvPath" -ForegroundColor White
Write-Host "    JSON : $jsonPath" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
