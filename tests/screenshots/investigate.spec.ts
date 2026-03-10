import { test } from '@playwright/test'

const BASE = 'http://localhost:5173'

test('Bericht - all screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${BASE}/bericht/690f67c79b4655053cf5172e`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  for (let i = 0; i < 6; i++) {
    await page.screenshot({ path: `tests/screenshots/captures/inv4-bericht-${i}.png`, fullPage: false })
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(600)
  }
})

test('Project - all screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${BASE}/bericht/65b8d9c96801d5032b334208`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  for (let i = 0; i < 10; i++) {
    await page.screenshot({ path: `tests/screenshots/captures/inv4-project-${i}.png`, fullPage: false })
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(600)
  }
})
