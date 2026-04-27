# Start both AIMAD backend and frontend in parallel.
# Run from the project root: .\dev.ps1

$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    & .\.venv\Scripts\uvicorn main:app --reload --port 8000
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    & npm run dev
}

Write-Host "[AIMAD] Backend  → http://localhost:8000" -ForegroundColor Cyan
Write-Host "[AIMAD] Frontend → http://localhost:5173" -ForegroundColor Magenta
Write-Host "[AIMAD] Press Ctrl+C to stop both services." -ForegroundColor Yellow

try {
    while ($true) {
        Receive-Job -Job $backendJob  | ForEach-Object { Write-Host "[BACKEND]  $_" -ForegroundColor Cyan }
        Receive-Job -Job $frontendJob | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor Magenta }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`n[AIMAD] Stopping all services..." -ForegroundColor Yellow
    Stop-Job  -Job $backendJob, $frontendJob
    Remove-Job -Job $backendJob, $frontendJob
}
