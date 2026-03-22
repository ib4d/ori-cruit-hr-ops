# Ori-Cruit Windows Flutter Client Packager

Write-Host "Packaging Flutter Windows App..." -ForegroundColor Cyan

$sourcePath = "$PSScriptRoot\..\app\build\windows\runner\Release"
$distDir = "$PSScriptRoot\..\dist"
$zipPath = "$distDir\ori-cruit-win64.zip"

If (!(Test-Path $sourcePath)) {
    Write-Host "Error: Release directory not found. Did you run 'flutter build windows --release'?" -ForegroundColor Red
    exit 1
}

If (!(Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

If (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host "Compressing to $zipPath..."
Compress-Archive -Path "$sourcePath\*" -DestinationPath $zipPath -Force

Write-Host "Done! Distributable is available at $zipPath" -ForegroundColor Green
