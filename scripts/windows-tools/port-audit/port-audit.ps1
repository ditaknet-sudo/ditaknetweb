# ====================================================================
# DitakNet Port Audit & Firewall NAT Check - Windows Tool
# Copyright (c) DitakNet - Smart Tech & Security Engineering
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "        DitakNet Port Audit, Service Reachability & NAT Check       " -ForegroundColor Yellow
Write-Host "             Author: DitakNet | Web: https://ditaknet.com            " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$defaultGw = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null } | Select-Object -First 1).IPv4DefaultGateway.NextHop
if (-not $defaultGw) { $defaultGw = "192.168.1.1" }

Write-Host "Target Host or IP to Audit [Press ENTER for Gateway '$defaultGw']: " -NoNewline -ForegroundColor Yellow
$userTarget = Read-Host
$target = if ([string]::IsNullOrWhiteSpace($userTarget)) { $defaultGw } else { $userTarget.Trim() }

Write-Host ""
Write-Host "[*] Auditing critical network service ports on $target..." -ForegroundColor Cyan
Write-Host ""

$portCatalog = @(
    @{ Port = 22;    Service = "SSH Remote Shell";         Category = "Admin";       Risk = "Medium" },
    @{ Port = 23;    Service = "Telnet (Unencrypted)";     Category = "Insecure";    Risk = "HIGH" },
    @{ Port = 53;    Service = "DNS Service";              Category = "Core";        Risk = "Low" },
    @{ Port = 80;    Service = "HTTP Web Server";          Category = "Web";         Risk = "Low" },
    @{ Port = 443;   Service = "HTTPS Secure Web";         Category = "Web";         Risk = "Low" },
    @{ Port = 445;   Service = "SMB File Sharing";         Category = "Files";       Risk = "HIGH (If exposed to WAN)" },
    @{ Port = 554;   Service = "RTSP Video Stream";        Category = "CCTV";        Risk = "Medium" },
    @{ Port = 1194;  Service = "OpenVPN Gateway";          Category = "VPN";         Risk = "Low" },
    @{ Port = 1433;  Service = "Microsoft SQL Server";     Category = "Database";    Risk = "HIGH (If WAN-exposed)" },
    @{ Port = 3306;  Service = "MySQL / MariaDB";          Category = "Database";    Risk = "HIGH (If WAN-exposed)" },
    @{ Port = 3389;  Service = "Remote Desktop (RDP)";     Category = "Admin";       Risk = "HIGH (Target of brute force)" },
    @{ Port = 5000;  Service = "Synology DSM (HTTP)";      Category = "Storage";     Risk = "Medium" },
    @{ Port = 5001;  Service = "Synology DSM (HTTPS)";     Category = "Storage";     Risk = "Low" },
    @{ Port = 5432;  Service = "PostgreSQL Database";      Category = "Database";    Risk = "HIGH" },
    @{ Port = 5833;  Service = "DitakNet Monitoring";      Category = "DitakNet";    Risk = "Low (Protected)" },
    @{ Port = 8000;  Service = "Hikvision Video Service";  Category = "CCTV";        Risk = "Medium" },
    @{ Port = 8080;  Service = "Alternative Web / Proxy";  Category = "Web";         Risk = "Low" },
    @{ Port = 8291;  Service = "MikroTik WinBox";          Category = "RouterOS";    Risk = "Medium" },
    @{ Port = 8443;  Service = "Secure Web Alt / UniFi";   Category = "Controller";  Risk = "Low" },
    @{ Port = 37777; Service = "Dahua DVR / NVR Media";    Category = "CCTV";        Risk = "Medium" }
)

$results = [System.Collections.Generic.List[PSCustomObject]]::new()
$openCount = 0

foreach ($pItem in $portCatalog) {
    $p = $pItem.Port
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect($target, $p, $null, $null)
    $wh = $iar.AsyncWaitHandle.WaitOne(120, $false)
    $sw.Stop()

    $isOpen = $false
    if ($wh -and $tcp.Connected) {
        $isOpen = $true
        $tcp.EndConnect($iar)
    }
    $tcp.Close()

    if ($isOpen) {
        $openCount++
        $latency = $sw.ElapsedMilliseconds
        Write-Host " [OPEN] Port $p ($($pItem.Service)) - Latency: ${latency}ms | Risk: $($pItem.Risk)" -ForegroundColor $(if ($pItem.Risk -like "*HIGH*") { "Red" } else { "Green" })
        
        $results.Add([PSCustomObject]@{
            Port = $p
            Service = $pItem.Service
            Category = $pItem.Category
            Status = "OPEN"
            LatencyMs = $latency
            SecurityRisk = $pItem.Risk
        })
    }
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "                         AUDIT SUMMARY                              " -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Target Checked: $target" -ForegroundColor White
Write-Host "Total Open Ports Detected: $openCount out of $($portCatalog.Count) critical services" -ForegroundColor $(if ($openCount -gt 0) { "Green" } else { "Yellow" })

if ($results.Count -gt 0) {
    Write-Host ""
    $results | Format-Table -AutoSize -Property Port, Service, Category, LatencyMs, SecurityRisk
    
    $jsonPath = Join-Path $PSScriptRoot "port-audit-report.json"
    $csvPath = Join-Path $PSScriptRoot "port-audit-report.csv"
    $results | ConvertTo-Json -Depth 2 | Set-Content -Path $jsonPath -Encoding UTF8
    $results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
    
    Write-Host "[OK] Report saved to:" -ForegroundColor Green
    Write-Host "  -> JSON: $jsonPath" -ForegroundColor Gray
    Write-Host "  -> CSV:  $csvPath" -ForegroundColor Gray
} else {
    Write-Host "[*] No open ports found in catalog. Target firewall has strong filtering." -ForegroundColor Green
}

Write-Host ""
Write-Host "DitakNet Security Audit Suite: https://ditaknet.com" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
