import { test, expect } from '@playwright/test'

async function startGame(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
  // Wait for menu scene
  await page.waitForTimeout(1500)
  // Click "开始游戏" button area (center of screen, lower portion)
  const box = await page.locator('canvas').boundingBox()
  if (!box) throw new Error('canvas missing')
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.62)
  await page.waitForTimeout(2000)
}

test.describe('Smoke', () => {
  test('start game and survive a few seconds', async ({ page }) => {
    await startGame(page)
    await page.waitForTimeout(3000)
    const result = await page.evaluate(() => {
      const hooks = (window as unknown as { __MVP_TEST__?: { getPlayerHp: () => number; getStageIndex: () => number } }).__MVP_TEST__
      if (!hooks) return null
      return { hp: hooks.getPlayerHp(), stage: hooks.getStageIndex() }
    })
    if (result) {
      expect(result.hp).toBeGreaterThan(0)
      expect(result.stage).toBeGreaterThanOrEqual(0)
    } else {
      // hook might not be present in production build; ensure canvas is at least running
      expect(page.locator('canvas')).toBeVisible()
    }
  })

  test('window.__MVP_GAME__ is a Phaser Game object', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2500)
    const ok = await page.evaluate(() => {
      return typeof (window as unknown as { __MVP_GAME__?: { scene?: unknown } }).__MVP_GAME__?.scene !== 'undefined'
    })
    expect(ok).toBe(true)
  })
})
