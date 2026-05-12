import { test } from '@playwright/test';

test('partner + projects sections', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('language', 'DE'); } catch {}
  });
  await page.goto('/spenden/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(900);

  await page.locator('.spenden-partner').screenshot({ path: 'tests/screenshots/results/partner.png' });
  await page.locator('.spenden-projects').screenshot({ path: 'tests/screenshots/results/projects.png' });

  // Hover over a row to capture hover hint
  const row = page.locator('.spenden-ticket__row-btn').first();
  await row.hover();
  await page.waitForTimeout(150);
  await page.locator('.spenden-ticket').screenshot({ path: 'tests/screenshots/results/ticket-hover.png' });

  await row.click();
  await page.waitForTimeout(150);
  await page.locator('.spenden-ticket').screenshot({ path: 'tests/screenshots/results/ticket-copied.png' });
});
