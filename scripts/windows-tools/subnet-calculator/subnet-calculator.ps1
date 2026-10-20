# ====================================================================
# DitakNet Subnet Calculator & CIDR Planner - Windows Tool
# Copyright (c) DitakNet - Smart Tech & Network Engineering
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         DitakNet IP Subnet Calculator & CIDR Network Planner        " -ForegroundColor Yellow
Write-Host "             Author: DitakNet | Web: https://ditaknet.com            " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Enter IP with CIDR (e.g. 192.168.10.0/24 or 10.0.0.0/16) [Default: 192.168.1.0/24]: " -NoNewline -ForegroundColor Yellow
$inputCidr = Read-Host
if ([string]::IsNullOrWhiteSpace($inputCidr)) {
    $inputCidr = "192.168.1.0/24"
}

$parts = $inputCidr.Split("/")
$ipStr = $parts[0].Trim()
$prefix = if ($parts.Length -gt 1) { [int]$parts[1] } else { 24 }

# Convert IP to 32-bit uint
function IPToUint([string]$ip) {
    $octets = $ip.Split(".") | ForEach-Object { [uint32]$_ }
    return [uint32](($octets[0] -shl 24) -bor ($octets[1] -shl 16) -bor ($octets[2] -shl 8) -bor $octets[3])
}

function UintToIP([uint32]$uint) {
    $o1 = ($uint -shr 24) -band 255
    $o2 = ($uint -shr 16) -band 255
    $o3 = ($uint -shr 8) -band 255
    $o4 = $uint -band 255
    return "$o1.$o2.$o3.$o4"
}

$ipUint = IPToUint $ipStr
$maskUint = if ($prefix -eq 0) { [uint32]0 } else { [uint32](0xFFFFFFFFL -shl (32 - $prefix)) }
$wildcardUint = [uint32](-bnot $maskUint)

$netUint = $ipUint -band $maskUint
$broadUint = $netUint -bor $wildcardUint

$netIp = UintToIP $netUint
$maskIp = UintToIP $maskUint
$wildcardIp = UintToIP $wildcardUint
$broadIp = UintToIP $broadUint

$totalHosts = [Math]::Pow(2, (32 - $prefix))
$usableHosts = if ($prefix -ge 31) { [int]$totalHosts } else { [int]($totalHosts - 2) }

$firstHost = if ($prefix -ge 31) { $netIp } else { UintToIP ($netUint + 1) }
$lastHost = if ($prefix -ge 31) { $broadIp } else { UintToIP ($broadUint - 1) }

# IP Class
$firstOctet = [int]($ipStr.Split(".")[0])
$ipClass = "Class A"
if ($firstOctet -ge 128 -and $firstOctet -le 191) { $ipClass = "Class B" }
elseif ($firstOctet -ge 192 -and $firstOctet -le 223) { $ipClass = "Class C" }
elseif ($firstOctet -ge 224 -and $firstOctet -le 239) { $ipClass = "Class D (Multicast)" }

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "                      CIDR CALCULATION REPORT                       " -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " -> Target CIDR:         $netIp/$prefix" -ForegroundColor White
Write-Host " -> Subnet Mask:         $maskIp" -ForegroundColor Cyan
Write-Host " -> Wildcard Mask:       $wildcardIp" -ForegroundColor DarkGray
Write-Host " -> Network Address:     $netIp" -ForegroundColor Green
Write-Host " -> Broadcast Address:   $broadIp" -ForegroundColor Magenta
Write-Host " -> Usable Host Range:   $firstHost  --  $lastHost" -ForegroundColor Yellow
Write-Host " -> Total Addresses:     $totalHosts" -ForegroundColor White
Write-Host " -> Usable Hosts:        $usableHosts" -ForegroundColor Green
Write-Host " -> Network Class:       $ipClass" -ForegroundColor White
Write-Host ""

# Subnet Splitting preview (e.g. split into 4 equal subnets)
if ($prefix -le 28) {
    $newPrefix = $prefix + 2
    $subCount = 4
    Write-Host "[*] VLAN Subnet Subdivision Preview (Split into 4 x /$newPrefix):" -ForegroundColor Cyan
    $chunkSize = [uint32]($totalHosts / $subCount)
    
    $vlanPlan = @()
    for ($v = 0; $v -lt $subCount; $v++) {
        $subNet = $netUint + ($v * $chunkSize)
        $subBroad = $subNet + $chunkSize - 1
        $subFirst = $subNet + 1
        $subLast = $subBroad - 1
        $vlanPlan += [PSCustomObject]@{
            VLAN_ID = "VLAN $(10 * ($v + 1))"
            Subnet = "$(UintToIP $subNet)/$newPrefix"
            UsableRange = "$(UintToIP $subFirst) - $(UintToIP $subLast)"
            Hosts = ($chunkSize - 2)
        }
    }
    $vlanPlan | Format-Table -AutoSize
}

$planObj = [PSCustomObject]@{
    Input = $inputCidr
    Network = $netIp
    Prefix = $prefix
    SubnetMask = $maskIp
    WildcardMask = $wildcardIp
    Broadcast = $broadIp
    FirstHost = $firstHost
    LastHost = $lastHost
    UsableHosts = $usableHosts
}

$jsonPath = Join-Path $PSScriptRoot "subnet-calculator-report.json"
$planObj | ConvertTo-Json | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "[OK] Network plan saved to: $jsonPath" -ForegroundColor Green
Write-Host ""
Write-Host "DitakNet Network & IT Tools Suite: https://ditaknet.com" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
