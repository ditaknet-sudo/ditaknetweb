# ==============================================================================
# DitakNet LAN Scan - Standalone Windows Network Scanner
# Created by DitakNet for Network Engineers and IT Specialists
# ==============================================================================

[CmdletBinding()]
param (
    [string]$Subnet = "",
    [int]$TimeoutMs = 300,
    [switch]$ExportCsv,
    [switch]$ExportJson
)

$Host.UI.RawUI.WindowTitle = "DitakNet LAN Scan v1.0 - Windows Network Discovery"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "           DitakNet LAN Scan - Windows Network Tool v1.0            " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "       Self-hosted Local Network Discovery & Inventory Suite        " -ForegroundColor Gray
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
}

Show-Header

# 1. Detect Local Subnet if not specified
if (-not $Subnet) {
    Write-Host "[*] Auto-detecting active local network interface..." -ForegroundColor Yellow
    $activeIp = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual' -and 
        $_.IPAddress -notmatch '^(169\.254|127\.)' 
    } | Select-Object -First 1

    if ($activeIp) {
        $ipParts = $activeIp.IPAddress.Split('.')
        $Subnet = "$($ipParts[0]).$($ipParts[1]).$($ipParts[2])"
        Write-Host "    Found Active IP : $($activeIp.IPAddress)" -ForegroundColor Green
        Write-Host "    Target Subnet   : $Subnet.0/24" -ForegroundColor Green
    } else {
        $Subnet = "192.168.1"
        Write-Host "    [!] Could not auto-detect. Defaulting to: $Subnet.0/24" -ForegroundColor Yellow
    }
} else {
    Write-Host "[*] Target Subnet: $Subnet.0/24" -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] Initiating fast multithreaded ping sweep (1-254)..." -ForegroundColor Cyan

$ips = 1..254 | ForEach-Object { "$Subnet.$_" }
$results = [System.Collections.Concurrent.ConcurrentBag[PSCustomObject]]::new()
$startTime = Get-Date

# Multithreaded Ping via .NET Tasks
$tasks = foreach ($ip in $ips) {
    [System.Threading.Tasks.Task]::Run([Action]{
        $pinger = [System.Net.NetworkInformation.Ping]::new()
        try {
            $reply = $pinger.Send($ip, $TimeoutMs)
            if ($reply.Status -eq 'Success') {
                $results.Add([PSCustomObject]@{
                    IP = $ip
                    RoundtripTime = $reply.RoundtripTime
                    Status = "Online"
                })
            }
        } catch { }
        finally { $pinger.Dispose() }
    })
}

[System.Threading.Tasks.Task]::WaitAll($tasks)
$scanDuration = ((Get-Date) - $startTime).TotalSeconds

Write-Host "    Sweep completed in $([math]::Round($scanDuration, 2)) seconds." -ForegroundColor Green
Write-Host "    Discovered $($results.Count) active IP address(es)." -ForegroundColor Green
Write-Host ""

# 2. Enrich with ARP table (MAC address), DNS Hostname & Common Ports
Write-Host "[*] Resolving MAC addresses, hostnames, and service ports..." -ForegroundColor Cyan

# Fetch system ARP table
$arpTable = @{}
arp -a | ForEach-Object {
    if ($_ -match '([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\s+([0-9a-fA-F-]+)\s+dynamic') {
        $arpTable[$matches[1]] = $matches[2].ToUpper().Replace('-', ':')
    }
}

function Resolve-Vendor ($mac) {
    if (-not $mac) { return "Unknown" }
    $prefix = $mac.Substring(0, [math]::Min(8, $mac.Length)).ToUpper()
    switch -Wildcard ($prefix) {
        "D8:07:B6*" { "MikroTik" }
        "48:8F:5A*" { "MikroTik" }
        "00:0C:29*" { "VMware" }
        "00:15:5D*" { "Microsoft Hyper-V" }
        "00:11:32*" { "Synology NAS" }
        "BC:5F:F4*" { "Dahua CCTV" }
        "44:19:B6*" { "Hikvision CCTV" }
        "AC:84:C6*" { "TP-Link" }
        "00:1A:2B*" { "Cisco Systems" }
        "B8:27:EB*" { "Raspberry Pi" }
        "DC:A6:32*" { "Raspberry Pi" }
        "F0:18:98*" { "Apple Inc." }
        "3C:06:30*" { "Apple Inc." }
        "00:E0:4C*" { "Realtek" }
        "80:86:F2*" { "Intel Corp." }
        default { "Local Hardware" }
    }
}

function Test-Port ($ip, $port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $asyncResult = $client.BeginConnect($ip, $port, $null, $null)
        $waitHandle = $asyncResult.AsyncWaitHandle.WaitOne(150, $false)
        if ($waitHandle -and $client.Connected) {
            $client.EndConnect($asyncResult)
            return $true
        }
        return $false
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

$deviceList = @()
foreach ($item in ($results | Sort-Object { [version]$_.IP })) {
    $ip = $item.IP
    $mac = if ($arpTable.ContainsKey($ip)) { $arpTable[$ip] } else { "N/A (Local/Gateway)" }
    $vendor = Resolve-Vendor $mac
    
    # DNS Name
    $hostname = $ip
    try {
        $dnsEntry = [System.Net.Dns]::GetHostEntry($ip)
        if ($dnsEntry.HostName) { $hostname = $dnsEntry.HostName }
    } catch {
        $hostname = "host-$($ip.Replace('.', '-'))"
    }

    # Common Ports probe (80:HTTP, 443:HTTPS, 554:RTSP CCTV, 22:SSH, 5833:DitakNet)
    $openPorts = @()
    if (Test-Port $ip 80) { $openPorts += "80" }
    if (Test-Port $ip 443) { $openPorts += "443" }
    if (Test-Port $ip 554) { $openPorts += "554(RTSP)" }
    if (Test-Port $ip 22) { $openPorts += "22(SSH)" }
    if (Test-Port $ip 5833) { $openPorts += "5833(DitakNet)" }
    if (Test-Port $ip 3389) { $openPorts += "3389(RDP)" }

    $portsString = if ($openPorts.Count -gt 0) { $openPorts -join ", " } else { "None open" }

    $deviceList += [PSCustomObject]@{
        IP           = $ip
        Hostname     = $hostname
        MAC          = $mac
        Vendor       = $vendor
        Latency      = "$($item.RoundtripTime) ms"
        OpenPorts    = $portsString
        Status       = "ONLINE"
    }
}

# 3. Display Dashboard Table
Write-Host ""
Write-Host "==========================================================================================" -ForegroundColor DarkGray
Write-Host ("{0,-16} {1,-24} {2,-18} {3,-14} {4,-9} {5}" -f "IP ADDRESS", "HOSTNAME", "MAC ADDRESS", "VENDOR", "PING", "OPEN PORTS") -ForegroundColor Yellow
Write-Host "==========================================================================================" -ForegroundColor DarkGray

foreach ($dev in $deviceList) {
    Write-Host ("{0,-16} {1,-24} {2,-18} {3,-14} {4,-9} {5}" -f $dev.IP, $dev.Hostname.PadRight(24).Substring(0, [math]::Min(24, $dev.Hostname.Length)), $dev.MAC, $dev.Vendor, $dev.Latency, $dev.OpenPorts) -ForegroundColor Green
}

Write-Host "==========================================================================================" -ForegroundColor DarkGray
Write-Host "Total Discovered Devices: $($deviceList.Count)" -ForegroundColor Cyan
Write-Host ""

# 4. Auto-export to CSV and JSON
$csvPath = Join-Path $PSScriptRoot "lan-scan-report.csv"
$jsonPath = Join-Path $PSScriptRoot "lan-scan-report.json"

$deviceList | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
$deviceList | ConvertTo-Json -Depth 3 | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "[+] Results saved to:" -ForegroundColor Green
Write-Host "    CSV  : $csvPath" -ForegroundColor White
Write-Host "    JSON : $jsonPath" -ForegroundColor White
Write-Host ""
Write-Host "DitakNet Monitoring Server Integration:" -ForegroundColor Cyan
Write-Host "You can import this JSON file into DitakNet (:5833) for automated device monitoring." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
