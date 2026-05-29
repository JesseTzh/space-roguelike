import { expect, test } from '@playwright/test'
import { clickCanvasRatio, dragCanvasRatio, startGame } from './helpers'

test('WASD movement and click does not teleport', async ({ page }) => {
  await startGame(page)
  const before = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  await page.keyboard.down('d')
  await page.waitForTimeout(250)
  await page.keyboard.up('d')
  const moved = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(moved.x).toBeGreaterThan(before.x)
  await clickCanvasRatio(page, 0.1, 0.1)
  await page.waitForTimeout(300)
  const afterClick = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(Math.abs(afterClick.x - moved.x)).toBeLessThan(80)
})

test('mouse drag moves player by delta', async ({ page }) => {
  await startGame(page)
  const before = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  await dragCanvasRatio(page, 0.2, 0.2, 0.42, 0.36)
  const after = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(after.x).toBeGreaterThan(before.x)
  expect(after.y).toBeGreaterThan(before.y)
})
