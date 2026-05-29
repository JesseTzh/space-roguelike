import { expect, test } from '@playwright/test'

test('canvas stays visible after resize', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page.setViewportSize({ width: 900, height: 600 })
  await expect(page.locator('canvas')).toBeVisible()
})
