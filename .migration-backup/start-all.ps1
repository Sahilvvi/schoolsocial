# Start Grade Sphere Marketplace with Integrated MySchool ERP
# Run this from the project root: myschool-master\myschool-master

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GradeSphere + MySchool Launcher       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = $PSScriptRoot

# ─── Check package manager ──────────────────────────────────
$pnpmCheck = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmCheck) {
    Write-Host "[WARN] pnpm not found. Trying npm instead..." -ForegroundColor Yellow
    $pkgManager = "npm"
} else {
    $pkgManager = "pnpm"
}

# ─── Start API Server (Port 3001) ─────────────────────────────
Write-Host "[1/2] Starting MySchool API Server (port 3001) for ERP..." -ForegroundColor Yellow

$apiDir = Join-Path $rootDir "artifacts\api-server"
$apiProcess = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$apiDir'; Write-Host '[API Server] Starting...' -ForegroundColor Green; `$env:PORT='3001'; `$env:NODE_ENV='development'; $pkgManager run dev"
) -PassThru

Start-Sleep -Seconds 3

# ─── Start Grade Sphere Marketplace (Port 8080) ───────────────
Write-Host "[2/2] Starting Grade Sphere + ERP (port 8080)..." -ForegroundColor Yellow

$gsDir = Join-Path $rootDir "grade-sphere-now-main"

$gsProcess = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$gsDir'; Write-Host '[Marketplace] Starting on http://localhost:8080' -ForegroundColor Green; npm run dev"
) -PassThru

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services starting!                    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Marketplace + ERP --> http://localhost:8080" -ForegroundColor Cyan
Write-Host "  API Server        --> http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Click 'ERP' in the marketplace navbar to log into the integrated ERP natively." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open the marketplace in your browser..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:8080"
