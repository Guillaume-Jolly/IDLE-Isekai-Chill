# Moniteur temporaire : capture les nouveaux processus (cmd, git, node, taskkill, netstat...)
param(
  [int]$Seconds = 20,
  [int]$IntervalMs = 150
)

$watchNames = @('cmd.exe', 'git.exe', 'git.cmd', 'node.exe', 'powershell.exe', 'taskkill.exe', 'netstat.exe', 'where.exe', 'conhost.exe', 'npm.cmd', 'npm.exe', 'vite.exe')
$seen = @{}
Get-CimInstance Win32_Process | ForEach-Object { $seen[$_.ProcessId] = $true }

Write-Host "=== Moniteur spawns ($Seconds s, intervalle ${IntervalMs}ms) ===" -ForegroundColor Cyan
Write-Host "Processus surveilles: $($watchNames -join ', ')"
Write-Host ""

$deadline = (Get-Date).AddSeconds($Seconds)
while ((Get-Date) -lt $deadline) {
  Get-CimInstance Win32_Process | Where-Object { $watchNames -contains $_.Name } | ForEach-Object {
    if (-not $seen.ContainsKey($_.ProcessId)) {
      $seen[$_.ProcessId] = $true
      $parent = Get-CimInstance Win32_Process -Filter "ProcessId=$($_.ParentProcessId)" -ErrorAction SilentlyContinue
      $parentName = if ($parent) { $parent.Name } else { '?' }
      $parentCmd = if ($parent) { $parent.CommandLine } else { '' }
      $ts = Get-Date -Format 'HH:mm:ss.fff'
      Write-Host "[$ts] NEW $($_.Name) PID=$($_.ProcessId) PPID=$($_.ParentProcessId) ($parentName)" -ForegroundColor Yellow
      if ($_.CommandLine) { Write-Host "  CMD: $($_.CommandLine)" }
      if ($parentCmd) { Write-Host "  PARENT: $parentCmd" }
    }
  }
  Start-Sleep -Milliseconds $IntervalMs
}

Write-Host ""
Write-Host "=== Fin moniteur ===" -ForegroundColor Cyan
