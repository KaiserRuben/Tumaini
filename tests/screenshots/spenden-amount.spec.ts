import { test, expect } from '@playwright/test';

const cases = [
  { name: 'preset-50',       url: '/spenden/1?amount=50',  expectActive: '€50',  expectQuery: '50' },
  { name: 'preset-100',      url: '/spenden/2?amount=100', expectActive: '€100', expectQuery: '100' },
  { name: 'option1-default', url: '/spenden/1',            expectActive: 'Frei', expectQuery: null },
  { name: 'option2-default', url: '/spenden/2',            expectActive: '€25',  expectQuery: null },
  { name: 'option3-default', url: '/spenden/3',            expectActive: '€100', expectQuery: null },
];

for (const c of cases) {
  test(`amount preselect ${c.name}`, async ({ page, context }) => {
    await context.addInitScript(() => {
      try { localStorage.setItem('language', 'DE'); } catch {}
    });
    await page.goto(c.url);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const active = page.locator('.spenden-qr__chip.is-active');
    await expect(active).toHaveText(c.expectActive);

    if (c.expectQuery) {
      const url = page.url();
      expect(url).toContain(`amount=${c.expectQuery}`);
    }

    await page.locator('.spenden-qr').screenshot({ path: `tests/screenshots/results/amount-${c.name}.png` });
  });
}

test('click chip updates URL', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('language', 'DE'); } catch {}
  });
  await page.goto('/spenden/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  await page.locator('.spenden-qr__chip', { hasText: '€100' }).click();
  await page.waitForTimeout(200);
  expect(page.url()).toContain('amount=100');

  await page.locator('.spenden-qr__chip', { hasText: 'Frei' }).click();
  await page.waitForTimeout(200);
  expect(page.url()).not.toContain('amount=');
});
