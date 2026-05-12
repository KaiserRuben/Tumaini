import { test } from '@playwright/test';

test('brand mark zoomed', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('language', 'DE'); } catch {}
  });
  await page.goto('/spenden/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    const el = document.querySelector('.site-header__mark') as HTMLElement | null;
    if (el) { el.style.width = '240px'; el.style.height = '240px'; }
  });
  const brand = page.locator('.site-header__brand');
  await brand.screenshot({ path: 'tests/screenshots/results/brand-zoom-rest.png' });

  await brand.hover();
  await page.waitForTimeout(3000);
  await brand.screenshot({ path: 'tests/screenshots/results/brand-zoom-risen.png' });
});
