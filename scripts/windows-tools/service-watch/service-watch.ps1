# ==============================================================================
# DitakNet Service Watch - Standalone Windows Service & Uptime Monitor
# Created by DitakNet for Network Engineers and IT Specialists
# ==============================================================================

[CmdletBinding()]
param (
    [int]$IntervalSeconds = 10,
    [string]$ConfigFile = "services-to-watch.json"
)

$Host.UI.RawUI.WindowTitle = "DitakNet Service Watch v1.0 - Windows Monitor"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "       DitakNet Service Watch - Windows Service Uptime Tool v1.0    " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "        Continuous HTTP, HTTPS, TCP & Ping Availability Monitor     " -ForegroundColor Gray
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
}

$defaultServices = @(
    @{ Name = "DitakNet Monitoring Server"; Target = "http://localhost:5833"; Type = "HTTP"; ExpectedPort = 5833 },
    @{ Name = "DitakNet Hotel Platform"; Target = "https://hotel.ditaknet.com"; Type = "HTTP"; ExpectedPort = 443 },
    @{ Name = "Local Router Gateway"; Target = "192.168.1.1"; Type = "PING"; ExpectedPort = 80 },
    @{ Name = "CCTV NVR RTSP Stream"; Target = "192.168.1.50"; Type = "TCP"; ExpectedPort = 554 },
    @{ Name = "DNS Server (Cloudflare)"; Target = "1.1.1.1"; Type = "PING"; ExpectedPort = 53 },
    @{ Name = "Google Public DNS"; Target = "8.8.8.8"; Type = "PING"; ExpectedPort = 53 }
)

$configPath = Join-Path $PSScriptRoot $ConfigFile
if (-not (Test-Path $configPath)) {
    $defaultServices | ConvertTo-Json -Depth 3 | Set-Content -Path $configPath -Encoding UTF8
}

$services = Get-Content -Path $configPath -Raw | ConvertFrom-Json

function Test-HttpEndpoint ($url) {
    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $request = [System.Net.WebRequest]::Create($url)
        $request.Timeout = 3000
        $request.Method = "GET"
        $response = $request.GetResponse()
        $sw.Stop()
        $code = [int]$response.StatusCode
        $response.Close()
        return @{ Status = "ONLINE"; Latency = "$($sw.ElapsedMilliseconds) ms"; Code = $code }
    } catch [System.Net.WebException] {
        if ($_.Response) {
            $code = [int]$_.Response.StatusCode
            return @{ Status = "WARNING"; Latency = "Error"; Code = $code }
        }
        return @{ Status = "OFFLINE"; Latency = "Timeout"; Code = 0 }
    } catch {
        return @{ Status = "OFFLINE"; Latency = "Error"; Code = 0 }
    }
}

function Test-TcpPort ($hostOrIp, $port) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $asyncResult = $client.BeginConnect($hostOrIp, $port, $null, $null)
        $waitHandle = $asyncResult.AsyncWaitHandle.WaitOne(2000, $false)
        $sw.Stop()
        if ($waitHandle -and $client.Connected) {
            $client.EndConnect($asyncResult)
            return @{ Status = "ONLINE"; Latency = "$($sw.ElapsedMilliseconds) ms"; Code = "PORT OPEN" }
        }
        return @{ Status = "OFFLINE"; Latency = "Closed"; Code = "PORT CLOSED" }
    } catch {
        return @{ Status = "OFFLINE"; Latency = "Timeout"; Code = "UNREACHABLE" }
    } finally {
        $client.Dispose()
    }
}

function Test-PingHost ($ip) {
    $pinger = [System.Net.NetworkInformation.Ping]::new()
    try {
        $reply = $pinger.Send($ip, 2000)
        if ($reply.Status -eq 'Success') {
            return @{ Status = "ONLINE"; Latency = "$($reply.RoundtripTime) ms"; Code = "ICMP OK" }
        }
        return @{ Status = "OFFLINE"; Latency = "Timeout"; Code = "$($reply.Status)" }
    } catch {
        return @{ Status = "OFFLINE"; Latency = "Error"; Code = "FAILED" }
    } finally {
        $pinger.Dispose()
    }
}

# Run loop
$checkCount = 0
while ($true) {
    $checkCount++
    Show-Header
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "Live Status as of: $timestamp (Check #$checkCount) - Refresh every $($IntervalSeconds)s" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop monitoring." -ForegroundColor Gray
    Write-Host ""
    Write-Host "====================================================================================================" -ForegroundColor DarkGray
    Write-Host ("{0,-30} {1,-32} {2,-10} {3,-12} {4}" -f "SERVICE NAME", "TARGET / ENDPOINT", "STATUS", "LATENCY", "CODE / DETAILS") -ForegroundColor Yellow
    Write-Host "====================================================================================================" -ForegroundColor DarkGray

    $reportEntries = @()
    foreach ($svc in $services) {
        $result = $null
        if ($svc.Type -eq "HTTP") {
            $result = Test-HttpEndpoint $svc.Target
        } elseif ($svc.Type -eq "TCP") {
            $result = Test-TcpPort $svc.Target $svc.ExpectedPort
        } else {
            $result = Test-PingHost $svc.Target
        }

        $color = switch ($result.Status) {
            "ONLINE" { "Green" }
            "WARNING" { "Yellow" }
            default { "Red" }
        }

        Write-Host ("{0,-30} {1,-32} {2,-10} {3,-12} {4}" -f $svc.Name, $svc.Target, $result.Status, $result.Latency, $result.Code) -ForegroundColor $color
        $reportEntries += [PSCustomObject]@{
            Timestamp = $timestamp
            Name      = $svc.Name
            Target    = $svc.Target
            Status    = $result.Status
            Latency   = $result.Latency
            Code      = $result.Code
        }
    }
    Write-Host "====================================================================================================" -ForegroundColor DarkGray

    $csvLog = Join-Path $PSScriptRoot "service-watch-log.csv"
    $reportEntries | Export-Csv -Path $csvLog -Append -NoTypeInformation -Encoding UTF8

    Start-Sleep -Seconds $IntervalSeconds
}
