import { test } from '@playwright/test';

test('brand hover triggers sunrise', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('language', 'DE'); } catch {}
  });
  await page.goto('/spenden/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  const brand = page.locator('.site-header__brand');
  const header = page.locator('.site-header');

  await header.screenshot({ path: 'tests/screenshots/results/brand-rest.png' });
  await brand.hover();
  await page.waitForTimeout(1300);
  await header.screenshot({ path: 'tests/screenshots/results/brand-mid.png' });
  await page.waitForTimeout(1500);
  await header.screenshot({ path: 'tests/screenshots/results/brand-risen.png' });
});
