import { expect, test } from '@playwright/test'

test('WASD moves the player and click does not teleport', async ({ page }) => {
  await page.goto('/?e2e=1')
  await page.getByRole('button', { name: '开始游戏' }).click()
  const before = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  await page.keyboard.down('KeyD')
  await page.waitForTimeout(250)
  await page.keyboard.up('KeyD')
  const after = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(after.x).toBeGreaterThan(before.x)
  await page.mouse.click(80, 80)
  const clicked = await page.evaluate(() => window.__MVP_TEST__!.getPlayerSnapshot())
  expect(Math.abs(clicked.x - after.x)).toBeLessThan(15)
})
