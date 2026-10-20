# ====================================================================
# DitakNet Bandwidth & Latency Jitter Tester - Windows Tool
# Copyright (c) DitakNet - Smart Tech & Network Engineering
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         DitakNet Network Bandwidth, Latency & Jitter Tester        " -ForegroundColor Yellow
Write-Host "             Author: DitakNet | Web: https://ditaknet.com            " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Interface link speed
Write-Host "[1/3] Inspecting physical/wireless adapter link speed..." -ForegroundColor White
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1

if ($adapter) {
    Write-Host " -> Active Interface:  $($adapter.Name) ($($adapter.InterfaceDescription))" -ForegroundColor Cyan
    Write-Host " -> Physical Link:     $($adapter.LinkSpeed)" -ForegroundColor Green
    Write-Host " -> Media Type:        $($adapter.MediaType)" -ForegroundColor White
} else {
    Write-Host "[!] No active network adapter found." -ForegroundColor Yellow
}

# 2. Target for latency & jitter test
$defaultGw = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null } | Select-Object -First 1).IPv4DefaultGateway.NextHop
if (-not $defaultGw) { $defaultGw = "1.1.1.1" }

Write-Host ""
Write-Host "Target Host to Benchmark [Press ENTER for Gateway '$defaultGw']: " -NoNewline -ForegroundColor Yellow
$userTarget = Read-Host
$target = if ([string]::IsNullOrWhiteSpace($userTarget)) { $defaultGw } else { $userTarget.Trim() }

Write-Host ""
Write-Host "[2/3] Measuring Latency, Packet Loss & Jitter across 20 samples to $target..." -ForegroundColor Cyan
$pings = [System.Collections.Generic.List[int]]::new()
$lossCount = 0
$totalPackets = 20

for ($i = 1; $i -le $totalPackets; $i++) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $ping = [System.Net.NetworkInformation.Ping]::new()
    try {
        $reply = $ping.Send($target, 300)
        $sw.Stop()
        if ($reply.Status -eq [System.Net.NetworkInformation.IPStatus]::Success) {
            $ms = [int]$reply.RoundtripTime
            $pings.Add($ms)
            Write-Host -NoNewline "." -ForegroundColor Green
        } else {
            $lossCount++
            Write-Host -NoNewline "X" -ForegroundColor Red
        }
    } catch {
        $lossCount++
        Write-Host -NoNewline "X" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 60
}

Write-Host ""
Write-Host ""

# Calculate stats
if ($pings.Count -gt 0) {
    $min = ($pings | Measure-Object -Minimum).Minimum
    $max = ($pings | Measure-Object -Maximum).Maximum
    $avg = ($pings | Measure-Object -Average).Average

    # Jitter calculation (average difference between consecutive packets)
    $jitterSum = 0
    for ($k = 0; $k -lt ($pings.Count - 1); $k++) {
        $jitterSum += [Math]::Abs($pings[$k + 1] - $pings[$k])
    }
    $jitter = [Math]::Round(($jitterSum / ($pings.Count - 1)), 2)
    $packetLoss = [Math]::Round(($lossCount / $totalPackets) * 100, 1)

    Write-Host "[3/3] Benchmark Results:" -ForegroundColor Yellow
    Write-Host " -> Min Latency:    $min ms" -ForegroundColor White
    Write-Host " -> Max Latency:    $max ms" -ForegroundColor White
    Write-Host " -> Avg Latency:    $([Math]::Round($avg, 2)) ms" -ForegroundColor Cyan
    Write-Host " -> Jitter (PDV):   $jitter ms" -ForegroundColor $(if ($jitter -lt 3) { "Green" } elseif ($jitter -lt 10) { "Yellow" } else { "Red" })
    Write-Host " -> Packet Loss:    $packetLoss %" -ForegroundColor $(if ($packetLoss -eq 0) { "Green" } else { "Red" })

    $rating = "EXCELLENT"
    if ($packetLoss -gt 2 -or $jitter -gt 15) { $rating = "DEGRADED (Packet loss / High Jitter detected)" }
    elseif ($jitter -gt 6) { $rating = "FAIR (Minor latency fluctuations)" }
    Write-Host " -> Overall Link:   $rating" -ForegroundColor $(if ($rating.StartsWith("EXCELLENT")) { "Green" } else { "Yellow" })

    $resultObj = [PSCustomObject]@{
        Target = $target
        Adapter = if ($adapter) { $adapter.Name } else { "Unknown" }
        LinkSpeed = if ($adapter) { $adapter.LinkSpeed } else { "N/A" }
        MinLatencyMs = $min
        AvgLatencyMs = [Math]::Round($avg, 2)
        MaxLatencyMs = $max
        JitterMs = $jitter
        PacketLossPercent = $packetLoss
        LinkRating = $rating
        Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }

    $jsonPath = Join-Path $PSScriptRoot "bandwidth-test-report.json"
    $resultObj | ConvertTo-Json | Set-Content -Path $jsonPath -Encoding UTF8
    Write-Host ""
    Write-Host "[OK] Report saved to: $jsonPath" -ForegroundColor Green
} else {
    Write-Host "[!] All benchmark packets timed out or host unreachable." -ForegroundColor Red
}

Write-Host ""
Write-Host "DitakNet IT Tools Suite: https://ditaknet.com" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
