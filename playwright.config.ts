import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/screenshots',
  outputDir: './tests/screenshots/results',
  fullyParallel: true,
  reporter: [['html', { open: 'never', outputFolder: './tests/screenshots/report' }]],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on',
    // Use chromium for all — we care about layout, not browser compat
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
    timeout: 15000,
  },
  projects: [
    {
      name: 'desktop-1440',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'desktop-1024',
      use: { viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'tablet',
      use: { viewport: { width: 768, height: 1024 }, isMobile: true },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
    {
      name: 'mobile-small',
      use: { viewport: { width: 375, height: 667 }, isMobile: true },
    },
  ],
})
