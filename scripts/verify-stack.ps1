# ==============================================================================
# Enterprise Platform Stack Verification Script (PowerShell)
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Running Enterprise DevOps Stack Verification (Windows)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$endpoints = @(
    @{ Name = "Next.js Frontend UI"; Url = "http://localhost:3000" },
    @{ Name = "Backend Liveness Probe"; Url = "http://localhost:5000/livez" },
    @{ Name = "Backend Health Probe"; Url = "http://localhost:5000/healthz" },
    @{ Name = "Prometheus Metrics"; Url = "http://localhost:5000/metrics" },
    @{ Name = "Prometheus UI"; Url = "http://localhost:9090" },
    @{ Name = "Grafana UI"; Url = "http://localhost:3001" }
)

foreach ($ep in $endpoints) {
    try {
        $res = Invoke-WebRequest -Uri $ep.Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        Write-Host "[PASS] $($ep.Name) - Status Code: $($res.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "[WARN] $($ep.Name) - Could not connect to $($ep.Url) ($($_.Exception.Message))" -ForegroundColor Yellow
    }
}
