# 最新消息自動翻譯：一次設定好三個密碼＋建立 Sanity 通知（Webhook）
# 執行（在專案根目錄的 PowerShell）：powershell -ExecutionPolicy Bypass -File scripts\set-translate-secrets.ps1
#   - Claude API 金鑰：console.anthropic.com → API Keys → Create Key（需先綁定付款方式）
#   - Sanity 寫入權杖：sanity.io/manage → 專案 → API → Tokens → Add API token（名稱「官網自動翻譯」、權限 Editor）
#   - 通知用的密碼由本腳本隨機產生，同時設定到 Vercel 和 Sanity
# 這個檔案裡沒有任何密碼；輸入時畫面不會顯示。

$ErrorActionPreference = 'Stop'
$ProjectId = 'pg0x5cyw'
$Dataset = 'production'
$HookName = '最新消息自動翻譯英文版'
$HookUrl = 'https://aiii-vbim-web.vercel.app/api/translate-news'

function Read-Secret([string]$prompt) {
  $s = Read-Host $prompt -AsSecureString
  return ([Runtime.InteropServices.Marshal]::PtrToStringAuto(
      [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))).Trim()
}

$anthropic = Read-Secret '請貼上 Claude API 金鑰（sk-ant- 開頭，畫面不會顯示）'
if ($anthropic -notmatch '^sk-ant-[A-Za-z0-9_-]{20,}$') { throw '看起來不是 Claude API 金鑰（應以 sk-ant- 開頭），請重新複製' }
$sanityToken = Read-Secret '請貼上 Sanity 寫入權杖（畫面不會顯示）'
if ($sanityToken.Length -lt 40) { throw 'Sanity 權杖看起來不完整，請重新複製' }

$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$hookSecret = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')

# 1) 三個密碼設定到 Vercel（正式＋預覽）
$ErrorActionPreference = 'Continue'
$values = [ordered]@{
  ANTHROPIC_API_KEY               = $anthropic
  SANITY_WRITE_TOKEN              = $sanityToken
  SANITY_TRANSLATE_WEBHOOK_SECRET = $hookSecret
}
$failed = $false
foreach ($name in $values.Keys) {
  foreach ($target in 'production', 'preview') {
    cmd /c "npx --yes vercel@65.7.0 env add $name --environment $target --sensitive --value `"$($values[$name])`" --force --yes --scope vbim >nul 2>&1"
    if ($LASTEXITCODE -eq 0) { Write-Host "OK  $name ($target)" } else { Write-Host "失敗 $name ($target)" -ForegroundColor Red; $failed = $true }
  }
}
if ($failed) { throw 'Vercel 設定有失敗的項目，請把畫面截圖給 Claude' }
$ErrorActionPreference = 'Stop'

# 2) 建立 Sanity 通知（用你電腦上 Sanity 登入的身分）
$cfg = Get-Content (Join-Path $env:USERPROFILE '.config\sanity\config.json') -Raw | ConvertFrom-Json
$headers = @{ Authorization = "Bearer $($cfg.authToken)" }
$api = "https://api.sanity.io/v2021-10-04/hooks/projects/$ProjectId"
foreach ($h in (Invoke-RestMethod -Uri $api -Headers $headers)) {
  if ($h.name -eq $HookName) {
    Invoke-RestMethod -Method Delete -Uri "$api/$($h.id)" -Headers $headers | Out-Null
    Write-Host '已移除舊的同名通知，重新建立'
  }
}
$hook = @{
  type          = 'document'
  name          = $HookName
  description   = '中文最新消息有變動時，通知官網自動產生／同步英文版'
  url           = $HookUrl
  httpMethod    = 'POST'
  apiVersion    = 'v2025-02-19'
  dataset       = $Dataset
  includeDrafts = $true
  secret        = $hookSecret
  rule          = @{
    on         = @('create', 'update', 'delete')
    filter     = '_type == "news" && language == "zh-Hant"'
    projection = '{_id}'
  }
} | ConvertTo-Json -Depth 5
$created = Invoke-RestMethod -Method Post -Uri $api -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($hook))
Write-Host "OK  Sanity 通知已建立（$($created.id)）"
Write-Host '完成。回到對話跟 Claude 說「好了」，Claude 會重新部署並實測。'
