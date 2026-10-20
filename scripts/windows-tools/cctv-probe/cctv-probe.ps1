# ====================================================================
# DitakNet CCTV Camera & RTSP Stream Probe - Windows Tool
# Copyright (c) DitakNet - Smart Tech & Security Monitoring
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "      DitakNet CCTV Camera & RTSP Stream Discovery Tool             " -ForegroundColor Yellow
Write-Host "             Author: DitakNet | Web: https://ditaknet.com            " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# Get default network adapter
$adapter = Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null } | Select-Object -First 1
$localIp = if ($adapter) { $adapter.IPv4Address.IPAddress } else { "192.168.1.100" }
$ipParts = $localIp.Split(".")
$defaultSubnet = "$($ipParts[0]).$($ipParts[1]).$($ipParts[2])"

Write-Host "Target Subnet to Scan for Cameras [Press ENTER for '$defaultSubnet']: " -NoNewline -ForegroundColor Yellow
$userSubnet = Read-Host
if ([string]::IsNullOrWhiteSpace($userSubnet)) {
    $targetSubnet = $defaultSubnet
} else {
    $targetSubnet = $userSubnet.TrimEnd(".")
}

Write-Host ""
Write-Host "[*] Probing subnet $targetSubnet.1 - $targetSubnet.254 for CCTV hardware..." -ForegroundColor Cyan
Write-Host "    Scanning ports 554 (RTSP), 80 (Web), 8000 (Hikvision), 37777 (Dahua), 8899 (ONVIF)..." -ForegroundColor DarkGray
Write-Host ""

$cameraPorts = @(554, 80, 8000, 37777, 8899)
$pingJobs = @()

1..254 | ForEach-Object {
    $pingJobs += [System.Net.NetworkInformation.Ping]::new().SendPingAsync("$targetSubnet.$_", 150)
}

[System.Threading.Tasks.Task]::WaitAll($pingJobs)

$activeIps = @()
for ($i = 0; $i -lt $pingJobs.Count; $i++) {
    if ($pingJobs[$i].Result.Status -eq [System.Net.NetworkInformation.IPStatus]::Success) {
        $activeIps += "$targetSubnet.$($i + 1)"
    }
}

Write-Host "Found $($activeIps.Count) reachable network devices. Inspecting camera protocols..." -ForegroundColor Green
Write-Host ""

# Fetch ARP table for MAC
$arpOutput = arp -a
$arpMap = @{}
foreach ($line in ($arpOutput -split "`r`n")) {
    if ($line -match '([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\s+([0-9a-fA-F-]+)\s+(\w+)') {
        $arpMap[$matches[1]] = $matches[2].ToUpper().Replace("-", ":")
    }
}

$cctvDevices = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($ip in $activeIps) {
    $openPorts = @()
    foreach ($port in $cameraPorts) {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect($ip, $port, $null, $null)
        $wh = $iar.AsyncWaitHandle.WaitOne(70, $false)
        if ($wh -and $tcp.Connected) {
            $openPorts += $port
            $tcp.EndConnect($iar)
        }
        $tcp.Close()
    }

    # If RTSP 554 or Dahua 37777 or Hikvision 8000 or ONVIF 8899 are open, this is likely CCTV equipment
    if (554 -in $openPorts -or 37777 -in $openPorts -or 8000 -in $openPorts -or 8899 -in $openPorts) {
        $mac = if ($arpMap.ContainsKey($ip)) { $arpMap[$ip] } else { "N/A" }
        
        $brand = "Generic ONVIF/RTSP Camera"
        $rtspTemplate = "rtsp://admin:password@$ip`:554/live/ch0"
        
        if (37777 -in $openPorts -or $mac -like "BC:5F:F4*" -or $mac -like "4C:11:BF*") {
            $brand = "Dahua Technology (Camera/NVR)"
            $rtspTemplate = "rtsp://admin:password@$ip`:554/cam/realmonitor?channel=1&subtype=0"
        } elseif (8000 -in $openPorts -or $mac -like "C4:2F:90*" -or $mac -like "BC:AD:28*") {
            $brand = "Hikvision Digital (Camera/NVR)"
            $rtspTemplate = "rtsp://admin:password@$ip`:554/Streaming/Channels/101"
        } elseif ($mac -like "00:0F:7C*" -or $mac -like "AC:CC:8E*") {
            $brand = "Axis Communications"
            $rtspTemplate = "rtsp://root:pass@$ip`:554/axis-media/media.amp"
        } elseif ($mac -like "E0:50:8B*") {
            $brand = "Uniview (UNV)"
            $rtspTemplate = "rtsp://admin:123456@$ip`:554/unicast/c1/s0/live"
        }

        $item = [PSCustomObject]@{
            IP = $ip
            Brand = $brand
            MAC = $mac
            OpenPorts = ($openPorts -join ",")
            RTSP_URL = $rtspTemplate
            Status = "Stream Active"
        }
        $cctvDevices.Add($item)

        Write-Host " [CCTV FOUND] $ip -> $brand" -ForegroundColor Green
        Write-Host "              Ports: $($openPorts -join ', ') | MAC: $mac" -ForegroundColor White
        Write-Host "              Sample RTSP: $rtspTemplate" -ForegroundColor Cyan
        Write-Host ""
    }
}

if ($cctvDevices.Count -eq 0) {
    Write-Host "[!] No CCTV cameras detected on default ports on subnet $targetSubnet." -ForegroundColor Yellow
} else {
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "                   DETECTED CCTV DEVICES ($($cctvDevices.Count))                    " -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
    $cctvDevices | Format-Table -AutoSize -Property IP, Brand, OpenPorts, MAC, RTSP_URL

    $jsonPath = Join-Path $PSScriptRoot "cctv-probe-report.json"
    $csvPath = Join-Path $PSScriptRoot "cctv-probe-report.csv"
    $cctvDevices | ConvertTo-Json -Depth 3 | Set-Content -Path $jsonPath -Encoding UTF8
    $cctvDevices | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

    Write-Host "[OK] Report exported to:" -ForegroundColor Green
    Write-Host "  -> JSON: $jsonPath" -ForegroundColor Gray
    Write-Host "  -> CSV:  $csvPath" -ForegroundColor Gray
}

Write-Host ""
Write-Host "DitakNet Security & Network Monitoring: https://ditaknet.com" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
