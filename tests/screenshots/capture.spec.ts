import { test, type Page } from '@playwright/test'
import { join } from 'path'

const SCREENSHOT_DIR = join(__dirname, 'captures')

// Wait for fonts + images to settle
async function waitForPage(page: Page) {
  await page.waitForLoadState('networkidle')
  // Give fonts and transitions time to complete
  await page.waitForTimeout(800)
}

test.describe('Public Frontend Screenshots', () => {
  test('Landing — full page', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--landing.png`),
      fullPage: true,
    })
  })

  test('Landing — hero viewport', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--hero.png`),
    })
  })

  test('Archive — Berichte', async ({ page }, testInfo) => {
    await page.goto('/archiv/berichte')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--archive-berichte.png`),
      fullPage: true,
    })
  })

  test('Archive — Projekte', async ({ page }, testInfo) => {
    await page.goto('/archiv/projekte')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--archive-projekte.png`),
      fullPage: true,
    })
  })

  test('Spenden', async ({ page }, testInfo) => {
    await page.goto('/spenden/1')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--spenden.png`),
      fullPage: true,
    })
  })

  test('Impressum', async ({ page }, testInfo) => {
    await page.goto('/impressum_datenschutz/impressum')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--impressum.png`),
      fullPage: true,
    })
  })

  test('Datenschutz', async ({ page }, testInfo) => {
    await page.goto('/impressum_datenschutz/datenschutz')
    await waitForPage(page)
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${testInfo.project.name}--datenschutz.png`),
      fullPage: true,
    })
  })
})
