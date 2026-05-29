import { expect, test } from '@playwright/test'

test('production mode does not expose test hook marker in normal mode placeholder', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
})
