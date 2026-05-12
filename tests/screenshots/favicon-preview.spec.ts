import { test } from '@playwright/test';

test('favicon preview at multiple sizes', async ({ page }) => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      body { margin: 0; padding: 40px; background: #f5f1ea; font-family: ui-sans-serif; }
      .row { display: flex; align-items: center; gap: 32px; padding: 24px 0; border-bottom: 1px dashed rgba(0,0,0,0.1); }
      .row.dark { background: #0C0D08; color: #fefdf8; padding: 24px; border-radius: 12px; margin-top: 24px; }
      .sz { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; color: #666; }
      .sz.dark { color: #aaa; }
      img { display: block; image-rendering: -webkit-optimize-contrast; }
    </style></head><body>
    <h2>Favicon · light bg</h2>
    <div class="row">
      <div class="sz"><img src="/favicon.svg" width="16" height="16"><span>16px</span></div>
      <div class="sz"><img src="/favicon.svg" width="24" height="24"><span>24px</span></div>
      <div class="sz"><img src="/favicon.svg" width="32" height="32"><span>32px</span></div>
      <div class="sz"><img src="/favicon.svg" width="48" height="48"><span>48px</span></div>
      <div class="sz"><img src="/favicon.svg" width="96" height="96"><span>96px</span></div>
      <div class="sz"><img src="/favicon.svg" width="180" height="180"><span>180px (apple)</span></div>
    </div>
    <div class="row dark">
      <div class="sz dark"><img src="/favicon.svg" width="16" height="16"><span>16px</span></div>
      <div class="sz dark"><img src="/favicon.svg" width="24" height="24"><span>24px</span></div>
      <div class="sz dark"><img src="/favicon.svg" width="32" height="32"><span>32px</span></div>
      <div class="sz dark"><img src="/favicon.svg" width="48" height="48"><span>48px</span></div>
      <div class="sz dark"><img src="/favicon.svg" width="96" height="96"><span>96px</span></div>
    </div>
    <h2>Mono variant (Safari pinned tab)</h2>
    <div class="row">
      <div class="sz"><img src="/favicon-mono.svg" width="16" height="16"><span>16</span></div>
      <div class="sz"><img src="/favicon-mono.svg" width="32" height="32"><span>32</span></div>
      <div class="sz"><img src="/favicon-mono.svg" width="64" height="64"><span>64</span></div>
    </div>
  </body></html>`;
  await page.goto('http://localhost:5173/');
  await page.setContent(html);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'tests/screenshots/results/favicon-preview.png', fullPage: true });
});
