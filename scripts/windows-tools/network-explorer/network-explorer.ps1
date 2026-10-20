# ====================================================================
# DitakNet Network Explorer - Deep Network Diagnostics for Windows
# Copyright (c) DitakNet - Smart Tech & Network Engineering
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "       DitakNet Network Explorer - Deep Network Diagnostics         " -ForegroundColor Yellow
Write-Host "             Author: DitakNet | Web: https://ditaknet.com            " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Discover Active Interfaces
Write-Host "[*] Discovering network interfaces and routing table..." -ForegroundColor White
$activeAdapters = Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }

if (-not $activeAdapters) {
    Write-Host "[!] No active default gateway detected. Falling back to all connected adapters." -ForegroundColor Yellow
    $activeAdapters = Get-NetIPConfiguration | Where-Object { $_.IPv4Address -ne $null }
}

$chosenAdapter = $activeAdapters | Select-Object -First 1
$localIp = $chosenAdapter.IPv4Address.IPAddress
$gatewayIp = if ($chosenAdapter.IPv4DefaultGateway) { $chosenAdapter.IPv4DefaultGateway.NextHop } else { "N/A" }
$dnsServers = ($chosenAdapter.DNSServer | Select-Object -ExpandProperty ServerAddresses) -join ", "

Write-Host " -> Interface:    " -NoNewline; Write-Host $chosenAdapter.InterfaceAlias -ForegroundColor Cyan
Write-Host " -> Local IPv4:   " -NoNewline; Write-Host $localIp -ForegroundColor Green
Write-Host " -> Gateway:      " -NoNewline; Write-Host $gatewayIp -ForegroundColor Magenta
Write-Host " -> DNS Servers:  " -NoNewline; Write-Host $dnsServers -ForegroundColor Gray
Write-Host ""

# Determine target subnet
$ipParts = $localIp.Split(".")
$defaultSubnet = "$($ipParts[0]).$($ipParts[1]).$($ipParts[2])"

Write-Host "Target Subnet to Explore [Press ENTER for '$defaultSubnet']: " -NoNewline -ForegroundColor Yellow
$userSubnet = Read-Host
if ([string]::IsNullOrWhiteSpace($userSubnet)) {
    $targetSubnet = $defaultSubnet
} else {
    $targetSubnet = $userSubnet.TrimEnd(".")
}

Write-Host "Port Probing Mode (1 = Quick: 80,443,22,8291,554, 2 = Deep: +445,3389,8080,5000) [Default: 1]: " -NoNewline -ForegroundColor Yellow
$modeChoice = Read-Host
if ($modeChoice -eq "2") {
    $portsToTest = @(80, 443, 22, 53, 445, 554, 3389, 5000, 8080, 8291)
} else {
    $portsToTest = @(80, 443, 22, 554, 8291)
}

Write-Host ""
Write-Host "[*] Scanning subnet $targetSubnet.1 - $targetSubnet.254..." -ForegroundColor Cyan
Write-Host "    Pinging and probing service ports with multi-threading..." -ForegroundColor DarkGray
Write-Host ""

$results = [System.Collections.Generic.List[PSCustomObject]]::new()
$pingJobs = @()

1..254 | ForEach-Object {
    $currentHost = "$targetSubnet.$_"
    $pingJobs += [System.Net.NetworkInformation.Ping]::new().SendPingAsync($currentHost, 180)
}

[System.Threading.Tasks.Task]::WaitAll($pingJobs)

$activeHosts = @()
for ($i = 0; $i -lt $pingJobs.Count; $i++) {
    $res = $pingJobs[$i].Result
    if ($res.Status -eq [System.Net.NetworkInformation.IPStatus]::Success) {
        $activeHosts += [PSCustomObject]@{
            IP = "$targetSubnet.$($i + 1)"
            Latency = $res.RoundtripTime
        }
    }
}

Write-Host "Found $($activeHosts.Count) active hosts! Probing services..." -ForegroundColor Green

# Fetch ARP table for MAC addresses
$arpOutput = arp -a
$arpMap = @{}
foreach ($line in ($arpOutput -split "`r`n")) {
    if ($line -match '([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\s+([0-9a-fA-F-]+)\s+(\w+)') {
        $arpMap[$matches[1]] = $matches[2].ToUpper().Replace("-", ":")
    }
}

foreach ($hostItem in $activeHosts) {
    $ip = $hostItem.IP
    $latency = $hostItem.Latency
    $mac = if ($arpMap.ContainsKey($ip)) { $arpMap[$ip] } else { "Local / Dynamic" }
    
    # Try resolving hostname
    $hostname = $ip
    try {
        $entry = [System.Net.Dns]::GetHostEntry($ip)
        if ($entry -and $entry.HostName) { $hostname = $entry.HostName }
    } catch {}

    # Open ports check
    $openPorts = @()
    foreach ($p in $portsToTest) {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect($ip, $p, $null, $null)
        $wh = $iar.AsyncWaitHandle.WaitOne(80, $false)
        if ($wh -and $tcp.Connected) {
            $openPorts += $p
            $tcp.EndConnect($iar)
        }
        $tcp.Close()
    }

    # Guess device type
    $type = "Standard Host"
    if ($ip -eq $gatewayIp -or 8291 -in $openPorts) { $type = "Router / Gateway" }
    elseif (554 -in $openPorts) { $type = "CCTV Camera / NVR" }
    elseif (3389 -in $openPorts -or 445 -in $openPorts) { $type = "Windows Workstation/Server" }
    elseif (5000 -in $openPorts) { $type = "NAS / Storage Node" }
    elseif (22 -in $openPorts -and 80 -in $openPorts) { $type = "Linux Server / Controller" }

    $obj = [PSCustomObject]@{
        IP = $ip
        Hostname = $hostname
        MAC = $mac
        LatencyMs = $latency
        OpenPorts = ($openPorts -join ",")
        DeviceType = $type
    }
    $results.Add($obj)

    $portsDisplay = if ($openPorts.Count -gt 0) { ($openPorts -join ", ") } else { "none detected" }
    Write-Host " [+] $ip - Latency: $($latency)ms | Ports: $portsDisplay | Type: $type" -ForegroundColor White
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "                         SCAN SUMMARY                               " -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
$results | Format-Table -AutoSize -Property IP, LatencyMs, DeviceType, OpenPorts, MAC, Hostname

# Save reports
$jsonPath = Join-Path $PSScriptRoot "network-explorer-report.json"
$csvPath = Join-Path $PSScriptRoot "network-explorer-report.csv"

$results | ConvertTo-Json -Depth 3 | Set-Content -Path $jsonPath -Encoding UTF8
$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

Write-Host ""
Write-Host "[OK] Report saved to:" -ForegroundColor Green
Write-Host "  -> JSON: $jsonPath" -ForegroundColor Gray
Write-Host "  -> CSV:  $csvPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Explore web version & more IT tools: https://ditaknet.com" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
