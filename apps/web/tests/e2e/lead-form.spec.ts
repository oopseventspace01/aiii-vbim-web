// P5 表單 E2E：三種身分各送一筆、錯誤提示、送出失敗、手機寬度、無障礙
// 測試伺服器設定 LEAD_DRY_RUN=1，只模擬送出，不會真的轉送 n8n 或寄信
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const CODE = /^L-\d{6}-[A-HJ-NP-Z2-9]{4}$/;

async function expectSuccess(page: Page, message: string) {
  const form = page.locator('form[data-lead-form]');
  await expect(form.locator('[data-success] [role="status"]')).toHaveText(message);
  await expect(form.locator('[data-form-body]')).toBeHidden();
  const code = (await form.locator('[data-lead-code]').textContent()) ?? '';
  expect(code).toMatch(CODE);
  return code;
}

test('聯絡我們：業主送出後顯示預約編號，需求表連結帶入編號', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('form[data-lead-form]');
  await expect(form.locator('[data-role-button="owner"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(form.locator('[data-message-suffix]')).toHaveText('（選填）');
  await form.locator('[name="company"]').fill('測試公司');
  await form.locator('[name="name"]').fill('王小明');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="siteType"]').selectOption('hospital');
  await form.locator('[name="consent"]').check();
  await form.getByRole('button', { name: '送出' }).click();
  const code = await expectSuccess(page, '已收到！我們會盡快與你聯繫，並寄一封確認信到你的信箱。');

  // 有設定需求表網址時（本機 .env）才會出現按鈕；CI 沒有設定則不顯示
  const checklist = form.locator('[data-checklist]');
  if (await checklist.isVisible()) {
    await expect(form.locator('[data-checklist-link]')).toHaveAttribute(
      'href',
      new RegExp(`${code}$`),
    );
    await expect(form.locator('[data-checklist-link]')).toHaveAttribute('target', '_blank');
  }
});

test('聯絡我們：切換成夥伴，訊息改為必填，空白送出會提示並停在第一個錯誤欄位', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('form[data-lead-form]');
  await form.locator('[data-role-button="partner"]').click();
  await expect(form.locator('[data-field="partnerType"]')).toBeVisible();
  await expect(form.locator('[data-field="siteType"]')).toBeHidden();
  await expect(form.locator('[data-message-label]')).toHaveText('想接入的產品或技術');
  await expect(form.locator('[data-message-suffix]')).toHaveText(' *');

  await form.getByRole('button', { name: '送出' }).click();
  await expect(form.locator('[data-form-error]')).toBeVisible();
  await expect(form.locator('[data-error-for="message"]')).toHaveText('這一欄必填');
  await expect(form.locator('[name="company"]')).toBeFocused();
  await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');

  // 人才不需要公司名稱
  await form.locator('[data-role-button="talent"]').click();
  await expect(form.locator('[data-field="company"]')).toBeHidden();
  await expect(form.locator('[data-field="module"]')).toBeVisible();
});

test('生態夥伴：申請送出成功', async ({ page }) => {
  await page.goto('/partners');
  const form = page.locator('form[data-lead-form]');
  await form.locator('[name="company"]').fill('測試空調');
  await form.locator('[name="partnerType"]').selectOption('hvac');
  await form.locator('[name="name"]').fill('李小華');
  await form.locator('[name="email"]').fill('partner@example.com');
  await form.locator('[name="website"]').fill('https://example.com');
  await form.locator('[name="message"]').fill('空調控制器，支援 BACnet');
  await form.locator('[name="consent"]').check();
  await form.getByRole('button', { name: '送出申請' }).click();
  await expectSuccess(page, '申請已送出，我們會盡快與你聯繫。');
  await expect(form.locator('[data-checklist]')).toBeHidden();
});

test('認證學院（英文）：登記送出成功', async ({ page }) => {
  await page.goto('/en/academy');
  const form = page.locator('form[data-lead-form]');
  await form.locator('[name="name"]').fill('Chen Test');
  await form.locator('[name="email"]').fill('talent@example.com');
  await form.locator('[name="organization"]').fill('Test Studio');
  await form.locator('[name="jobRole"]').selectOption('architect');
  await form.locator('input[name="modules"][value="bim"]').check();
  await form.locator('input[name="modules"][value="edge-ai"]').check();
  await form.locator('[name="consent"]').check();
  await form.getByRole('button', { name: 'Register' }).click();
  await expectSuccess(page, 'You’re registered — we’ll let you know when enrollment opens.');
});

test('送出失敗時顯示錯誤與備用 Email，不會顯示成功', async ({ page }) => {
  await page.route('**/api/lead', (route) =>
    route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: '{"ok":false,"error":"upstream"}',
    }),
  );
  await page.goto('/partners');
  const form = page.locator('form[data-lead-form]');
  await form.locator('[name="company"]').fill('測試');
  await form.locator('[name="partnerType"]').selectOption('si');
  await form.locator('[name="name"]').fill('測試');
  await form.locator('[name="email"]').fill('x@example.com');
  await form.locator('[name="message"]').fill('測試');
  await form.locator('[name="consent"]').check();
  await form.getByRole('button', { name: '送出申請' }).click();
  await expect(form.locator('[data-form-error]')).toContainText('目前無法送出');
  await expect(form.locator('[data-form-error]')).toContainText('@');
  await expect(form.locator('[data-success]')).toBeHidden();
  await expect(form.getByRole('button', { name: '送出申請' })).toBeEnabled();
});

test('API：欄位錯誤回 400', async ({ request }) => {
  const res = await request.post('/api/lead', { data: { variant: 'contact', role: 'owner' } });
  expect(res.status()).toBe(400);
  expect((await res.json()).ok).toBe(false);
});

test('表單頁沒有橫向捲動，且無障礙沒有嚴重問題', async ({ page }) => {
  for (const path of ['/contact', '/partners', '/en/academy']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow, path).toBe(false);
    const results = await new AxeBuilder({ page })
      .include('form[data-lead-form]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      serious.map((v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([]);
  }
});
