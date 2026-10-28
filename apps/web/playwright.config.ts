import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: './tests/e2e',
  // 截圖基準圖依作業系統分開存放（字型算圖不同）
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: [/browsers\.spec\.ts/, /visual\.spec\.ts/],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testIgnore: [/browsers\.spec\.ts/, /visual\.spec\.ts/],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // SPEC 9：375px 手機版截圖比對。基準圖只有 Linux 版（由 GitHub Actions 產生），
    // 其他系統字型算圖不同，找不到基準圖時自動略過
    {
      name: 'visual',
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // SPEC 8：其他瀏覽器跑主要流程（Edge 與 Chrome 同核心，不另外測）
    {
      name: 'firefox',
      testMatch: /browsers\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit',
      testMatch: /browsers\.spec\.ts/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'webkit-iphone',
      testMatch: /browsers\.spec\.ts/,
      use: { ...devices['iPhone 15'] },
    },
  ],
  webServer: {
    command: `npx astro dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // 表單只模擬送出，不會真的轉送 n8n、寄信（見 src/pages/api/lead.ts）
    env: { LEAD_DRY_RUN: '1' },
    timeout: 120_000,
  },
});
