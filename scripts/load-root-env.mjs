// 讓 apps/web 與 apps/studio 共用根目錄的 .env（只需維護一個檔案）。
// 檔案不存在時（例如 CI）安靜略過，改用系統環境變數。
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootEnv = fileURLToPath(new URL('../.env', import.meta.url));

if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}
