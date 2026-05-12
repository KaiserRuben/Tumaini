import { test } from '@playwright/test';

test('landing full + sections', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('language', 'DE'); } catch {}
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  // Scroll through page to trigger reveal observers
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, (h * i) / steps);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);

  await page.screenshot({ path: 'tests/screenshots/results/landing-full.png', fullPage: true });

  const welcome = page.locator('.landing-welcome');
  await welcome.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await welcome.screenshot({ path: 'tests/screenshots/results/landing-welcome.png' });

  const about = page.locator('.landing-about');
  await about.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await about.screenshot({ path: 'tests/screenshots/results/landing-about.png' });

  const donate = page.locator('.landing-donate');
  await donate.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await donate.screenshot({ path: 'tests/screenshots/results/landing-donate.png' });
});
