import { test, expect } from '@playwright/test'

test.describe('Desktop input', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only')

  test('canvas accepts pointer drag', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
    await page.waitForTimeout(1500)
    const box = await page.locator('canvas').boundingBox()
    if (!box) throw new Error('no canvas')
    // start game
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.62)
    await page.waitForTimeout(2000)
    // Drag in center of canvas
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx + 60, cy + 40, { steps: 6 })
    await page.mouse.up()
    await page.waitForTimeout(300)
  })
})

test.describe('Mobile input', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('touch drag', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
    await page.waitForTimeout(1500)
    const box = await page.locator('canvas').boundingBox()
    if (!box) throw new Error('no canvas')
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.62)
    await page.waitForTimeout(2000)
    // Drag with touch
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    await page.touchscreen.tap(cx, cy)
    await page.waitForTimeout(300)
  })
})
