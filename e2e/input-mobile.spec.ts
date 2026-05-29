import { expect, test } from '@playwright/test'
import { dragCanvasRatio, startGame } from './helpers'

test('mobile drag from arbitrary point moves player', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only test')
  await startGame(page)
  const before = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  await dragCanvasRatio(page, 0.1, 0.1, 0.5, 0.35)
  const after = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(after.x).toBeGreaterThan(before.x)
})
