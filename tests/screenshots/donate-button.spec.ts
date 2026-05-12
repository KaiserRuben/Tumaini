import { test, expect } from '@playwright/test';

const urls = [
  { name: 'spenden',  url: '/spenden/1' },
  { name: 'bericht',  url: '/bericht/69f74fd89b4655053cf5308c' },
  { name: 'archiv',   url: '/archiv/berichte' },
  { name: 'landing',  url: '/' },
];

for (const { name, url } of urls) {
  test(`page ${name}`, async ({ page, context }) => {
    await context.addInitScript(() => {
      try { localStorage.setItem('language', 'DE'); } catch {}
    });
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const header = page.locator('.site-header');
    await header.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-header.png` });

    if (name === 'spenden') {
      await page.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-full.png`, fullPage: true });
      const hero = page.locator('.spenden-hero');
      await hero.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-hero.png` });
      const iban = page.locator('.spenden-iban');
      await iban.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-iban.png` });
      const grid = page.locator('.spenden-grid');
      await grid.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-grid.png` });
    } else {
      await page.screenshot({ path: `tests/screenshots/results/${test.info().project.name}-${name}-viewport.png` });
    }

    const isMobile = (test.info().project.name || '').startsWith('mobile');
    if (!isMobile) {
      const btn = page.locator('.site-header__donate');
      await expect(btn).toBeVisible();
      const box = await btn.boundingBox();
      const text = await btn.textContent();
      console.log(`[${name}] donate box:`, box, 'text:', JSON.stringify(text?.trim()));
    }
  });
}
