import { expect, test } from '@playwright/test'

test('app loads and exposes e2e hooks', async ({ page }) => {
  await page.goto('/?e2e=1')
  await expect(page.locator('canvas')).toBeVisible()
  await page.getByRole('button', { name: '开始游戏' }).click()
  await expect.poll(() => page.evaluate(() => window.__MVP_TEST__?.getStateSnapshot().state)).toMatch(/Playing|BossStage/)
})
