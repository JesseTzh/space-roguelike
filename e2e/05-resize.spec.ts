import { test, expect } from '@playwright/test'

test('canvas resizes to viewport (Phaser FIT)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
  await page.setViewportSize({ width: 800, height: 600 })
  await page.waitForTimeout(500)
  const size1 = await page.locator('canvas').boundingBox()
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.waitForTimeout(500)
  const size2 = await page.locator('canvas').boundingBox()
  expect(size1).toBeTruthy()
  expect(size2).toBeTruthy()
  expect(size1!.width).not.toBe(size2!.width)
})
