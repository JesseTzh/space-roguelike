import { defineConfig, devices } from '@playwright/test'

const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
const chromiumLaunchOptions = chromiumExecutablePath
  ? { executablePath: chromiumExecutablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-proxy-server'] }
  : { args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-proxy-server'] }

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'npm run dev:e2e',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, launchOptions: chromiumLaunchOptions }
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'], viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, launchOptions: chromiumLaunchOptions }
    },
    {
      name: 'desktop-webkit-smoke',
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 720 } }
    }
  ]
})
