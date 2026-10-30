$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $nodePath) { $nodePath = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Node.js was not found.' }
$running = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $running) {
    Start-Process -FilePath $nodePath -ArgumentList 'node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3000' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput '.local-tools/server.log' -RedirectStandardError '.local-tools/server-error.log'
    Start-Sleep -Seconds 3
}
Start-Process 'http://127.0.0.1:3000'
