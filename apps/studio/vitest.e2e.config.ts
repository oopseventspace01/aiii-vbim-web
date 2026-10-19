import { defineConfig } from 'vitest/config';

// 整體流程測試：連到 Sanity（公開讀取 API），確認種子內容已正確寫入並連結中英文版
export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 30_000,
  },
});
