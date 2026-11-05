# 把預約表單需要的 3 個密碼設定到 Vercel（正式＋預覽環境）
# 執行（在專案根目錄的 PowerShell）：powershell -ExecutionPolicy Bypass -File scripts\set-vercel-secrets.ps1
#   - N8N_LEAD_WEBHOOK_URL、N8N_LEAD_SECRET：從本機 .env 讀取
#   - TURNSTILE_SECRET_KEY：執行時請你貼上（Cloudflare → Turnstile → 小工具 → Secret key）
# 這個檔案裡沒有任何密碼；數值不會顯示在畫面上。

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env'
if (-not (Test-Path $envFile)) { throw "找不到 $envFile" }

function Read-DotEnv([string]$name) {
  $line = Get-Content $envFile -Encoding utf8 | Where-Object { $_ -match "^$name=" } | Select-Object -First 1
  if (-not $line) { return '' }
  return ($line -replace "^$name=", '').Trim().Trim('"')
}

$values = [ordered]@{
  N8N_LEAD_WEBHOOK_URL = Read-DotEnv 'N8N_LEAD_WEBHOOK_URL'
  N8N_LEAD_SECRET      = Read-DotEnv 'N8N_LEAD_SECRET'
}
foreach ($k in @($values.Keys)) { if (-not $values[$k]) { throw ".env 裡沒有 $k" } }

$secure = Read-Host '請貼上 Turnstile 的 Secret key（畫面不會顯示）' -AsSecureString
$values['TURNSTILE_SECRET_KEY'] = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
$values['TURNSTILE_SECRET_KEY'] = $values['TURNSTILE_SECRET_KEY'].Trim()
$len = $values['TURNSTILE_SECRET_KEY'].Length
if ($values['TURNSTILE_SECRET_KEY'] -notmatch '^0x[A-Za-z0-9_-]{25,45}$') {
  throw "貼上的內容不像 Secret key（長度 $len；正確的是 0x 開頭、約 35 個字）。請在 Cloudflare 只按一次 Secret key 複製，再重新執行。"
}

# Vercel 指令會把一般訊息寫到錯誤輸出，改用 cmd 執行並只看結束代碼
$ErrorActionPreference = 'Continue'
foreach ($name in $values.Keys) {
  foreach ($target in 'production', 'preview') {
    cmd /c "npx --yes vercel@65.7.0 env add $name --environment $target --sensitive --value `"$($values[$name])`" --force --yes --scope vbim >nul 2>&1"
    if ($LASTEXITCODE -eq 0) { Write-Host "OK  $name ($target)" } else { Write-Host "失敗 $name ($target)" -ForegroundColor Red }
  }
}
Write-Host '完成。回到對話跟 Claude 說「好了」。'
