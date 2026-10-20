# DitakNet Local IP Messenger Daemon (Windows 10/11)
# Zero-Cloud, Pure LAN Peer-to-Peer HTTP Receiver on Port 5834
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$port = 5834
$historyFile = Join-Path $PSScriptRoot "LAN_Messenger_History.txt"

# Get Local IPv4 addresses
$localIps = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notlike '169.254*' }).IPAddress
$primaryIp = if ($localIps) { $localIps[0] } else { "127.0.0.1" }

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "       DitakNet Local IP Messenger (LAN Standalone Daemon)       " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " [*] Local Workstation IP : $primaryIp" -ForegroundColor Green
Write-Host " [*] Listening Port       : $port (HTTP REST / CORS enabled)" -ForegroundColor Green
Write-Host " [*] History Log File     : $historyFile" -ForegroundColor Gray
Write-Host " [*] Web PWA URL          : http://${primaryIp}:3000/tools/ip-messenger" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Ready to receive direct messages from any IP on this LAN..." -ForegroundColor Green
Write-Host " Commands:" -ForegroundColor White
Write-Host "   - Type 'send <IP> <Message>' to send a message to another machine" -ForegroundColor Gray
Write-Host "   - Type 'history' to view recent chat log" -ForegroundColor Gray
Write-Host "   - Type 'quit' to exit" -ForegroundColor Gray
Write-Host "-----------------------------------------------------------------" -ForegroundColor Cyan

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$prefix = "http://+:$port/"

try {
    $listener.Prefixes.Add($prefix)
    $listener.Start()
} catch {
    Write-Host "[!] Note: Binding http://+:$port/ failed (may need Admin). Trying http://localhost:$port/..." -ForegroundColor Yellow
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "[OK] Listener active and running. Waiting for incoming LAN messages..." -ForegroundColor Green

# Background async listener loop
$script:running = $true

$asyncTask = [System.Threading.Tasks.Task]::Run([System.Action]{
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            # Enable CORS for browser PWA
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            $senderIp = $request.RemoteEndPoint.Address.ToString()
            $body = ""

            if ($request.HasEntityBody) {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd()
                $reader.Close()
            }

            $timeStr = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            $logEntry = "[$timeStr] FROM: $senderIp | DATA: $body"
            Add-Content -Path $historyFile -Value $logEntry -Encoding UTF8

            Write-Host ""
            Write-Host "-----------------------------------------------------------------" -ForegroundColor Magenta
            Write-Host " [!] INCOMING MESSAGE RECEIVED AT $timeStr" -ForegroundColor Yellow
            Write-Host " [>] Sender IP : $senderIp" -ForegroundColor Cyan
            Write-Host " [>] Content   : $body" -ForegroundColor White
            Write-Host "-----------------------------------------------------------------" -ForegroundColor Magenta
            [Console]::Beep(880, 150)

            # Respond to sender
            $replyJson = "{`"status`":`"delivered`",`"receiver`":`"$primaryIp`",`"time`":`"$timeStr`"}"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($replyJson)
            $response.ContentType = "application/json"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
        } catch {
            if (-not $listener.IsListening) { break }
        }
    }
})

# Interactive Console Input Loop
while ($true) {
    Write-Host "DitakNet-LAN> " -NoNewline -ForegroundColor Green
    $inputCmd = Read-Host

    if ([string]::IsNullOrWhiteSpace($inputCmd)) { continue }

    if ($inputCmd -eq "quit" -or $inputCmd -eq "exit") {
        Write-Host "Stopping listener..." -ForegroundColor Yellow
        $listener.Stop()
        $listener.Close()
        break
    }
    elseif ($inputCmd -eq "history") {
        if (Test-Path $historyFile) {
            Get-Content $historyFile -Tail 20
        } else {
            Write-Host "No history logged yet." -ForegroundColor Gray
        }
    }
    elseif ($inputCmd -eq "myip" -or $inputCmd -eq "ip") {
        Write-Host "=================================================" -ForegroundColor Cyan
        Write-Host " Current Device Network Configuration (Windows)  " -ForegroundColor Yellow
        Write-Host "=================================================" -ForegroundColor Cyan
        Get-NetIPConfiguration | ForEach-Object {
            Write-Host " Interface : $($_.InterfaceAlias)" -ForegroundColor Green
            Write-Host " IPv4      : $($_.IPv4Address.IPAddress)" -ForegroundColor White
            Write-Host " Gateway   : $($_.IPv4DefaultGateway.NextHop)" -ForegroundColor White
            Write-Host " DNS       : $($_.DNSServer.ServerAddresses -join ', ')" -ForegroundColor White
        }
        Write-Host "=================================================" -ForegroundColor Cyan
    }
    elseif ($inputCmd.StartsWith("scan")) {
        $scanParts = $inputCmd.Split(" ")
        $subnetBase = if ($scanParts.Length -gt 1) { $scanParts[1] } else {
            $parts = $primaryIp.Split(".")
            "$($parts[0]).$($parts[1]).$($parts[2])"
        }
        Write-Host "Scanning subnet ${subnetBase}.1 to ${subnetBase}.254 for active hosts..." -ForegroundColor Cyan
        1..254 | ForEach-Object -Parallel {
            $ip = "$using:subnetBase.$_"
            $ping = Test-Connection -ComputerName $ip -Count 1 -Quiet -TimeoutSeconds 1 -ErrorAction SilentlyContinue
            if ($ping) {
                Write-Host " [+] Online Host : $ip" -ForegroundColor Green
            }
        } -ThrottleLimit 32
        Write-Host "Scan completed." -ForegroundColor Cyan
    }
    elseif ($inputCmd.StartsWith("ping ")) {
        $target = $inputCmd.Substring(5).Trim()
        Test-Connection -ComputerName $target -Count 4
    }
    elseif ($inputCmd.StartsWith("send ")) {
        $parts = $inputCmd.Substring(5).Split(" ", 2)
        if ($parts.Length -lt 2) {
            Write-Host "Usage: send <Target-IP> <Message>" -ForegroundColor Red
            continue
        }
        $targetIp = $parts[0].Trim()
        $msgText = $parts[1].Trim()

        Write-Host "Sending to $targetIp on port $port..." -ForegroundColor Yellow
        try {
            $uri = "http://${targetIp}:${port}/"
            $resp = Invoke-RestMethod -Uri $uri -Method Post -Body $msgText -TimeoutSec 3 -ContentType "text/plain"
            Write-Host "[OK] Delivered to $targetIp!" -ForegroundColor Green
        } catch {
            Write-Host "[FAIL] Could not deliver to $targetIp : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Commands: 'send <IP> <Msg>', 'myip', 'scan [subnet]', 'ping <IP>', 'history', 'quit'." -ForegroundColor Gray
    }
}

