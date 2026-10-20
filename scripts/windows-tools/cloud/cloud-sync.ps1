# ==============================================================================
# DitakNet Cloud - Standalone Windows Private Vault & Backup Sync Tool
# Created by DitakNet for Network Engineers and IT Specialists
# ==============================================================================

[CmdletBinding()]
param (
    [string]$SourceFolder = "MyVault",
    [string]$ServerEndpoint = "http://localhost:5833/api/vault"
)

$Host.UI.RawUI.WindowTitle = "DitakNet Cloud Vault & Sync v1.0"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "       DitakNet Cloud - Windows Private Vault & Backup Sync v1.0    " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "        Zero-Cloud Private Backup & SHA256 Integrity Verification   " -ForegroundColor Gray
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
}

Show-Header

$vaultDir = Join-Path $PSScriptRoot $SourceFolder
if (-not (Test-Path $vaultDir)) {
    New-Item -ItemType Directory -Path $vaultDir -Force | Out-Null
    # Create sample files if newly created
    Set-Content -Path (Join-Path $vaultDir "team-credentials-sample.txt") -Value "DitakNet Vault Sample Document`nCreated for secure private storage." -Encoding UTF8
    Set-Content -Path (Join-Path $vaultDir "network-topology-notes.txt") -Value "Core Switch: 192.168.1.2`nVLAN 10: Server Cluster`nVLAN 20: Dahua CCTV" -Encoding UTF8
}

Write-Host "[*] Auditing Private Vault Directory: $vaultDir" -ForegroundColor Yellow
$files = Get-ChildItem -Path $vaultDir -File -Recurse

if ($files.Count -eq 0) {
    Write-Host "    Vault is currently empty. Place files or backups in: $vaultDir" -ForegroundColor Yellow
} else {
    Write-Host "    Found $($files.Count) file(s) in vault." -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] Generating SHA256 Integrity Checksums & Manifest..." -ForegroundColor Cyan

$manifest = @()
foreach ($file in $files) {
    $hash = Get-FileHash -Path $file.FullName -Algorithm SHA256
    $manifest += [PSCustomObject]@{
        RelativePath = $file.FullName.Replace($vaultDir, "").TrimStart('\')
        SizeBytes    = $file.Length
        SizeKB       = [math]::Round($file.Length / 1KB, 2)
        LastModified = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        SHA256Hash   = $hash.Hash.Substring(0, 16) + "..."
    }
}

Write-Host ""
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("{0,-35} {1,-12} {2,-20} {3}" -f "VAULT FILE", "SIZE (KB)", "MODIFIED", "SHA256 CHECKSUM") -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray

foreach ($m in $manifest) {
    Write-Host ("{0,-35} {1,-12} {2,-20} {3}" -f $m.RelativePath, "$($m.SizeKB) KB", $m.LastModified, $m.SHA256Hash) -ForegroundColor Green
}
Write-Host "----------------------------------------------------------------------------------------------------" -ForegroundColor DarkGray

# Create backup archive
$backupZip = Join-Path $PSScriptRoot "vault-backup-$((Get-Date).ToString('yyyyMMdd-HHmmss')).zip"
if ($files.Count -gt 0) {
    Compress-Archive -Path "$vaultDir\*" -DestinationPath $backupZip -Force
    Write-Host ""
    Write-Host "[+] Local Snapshot Archive created:" -ForegroundColor Green
    Write-Host "    Archive Path: $backupZip" -ForegroundColor White
}

# Export manifest
$manifestPath = Join-Path $PSScriptRoot "cloud-manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Set-Content -Path $manifestPath -Encoding UTF8
Write-Host "    Manifest JSON: $manifestPath" -ForegroundColor White

Write-Host ""
Write-Host "DitakNet Server Status:" -ForegroundColor Cyan
Write-Host "You can sync this backup snapshot directly into your DitakNet Server (:5833)." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
