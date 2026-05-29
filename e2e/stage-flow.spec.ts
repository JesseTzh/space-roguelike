import { expect, test } from '@playwright/test'

test('stage result, module select and install flow', async ({ page }) => {
  await page.goto('/?e2e=1')
  await page.getByRole('button', { name: '开始游戏' }).click()
  await page.evaluate(() => window.__MVP_TEST__!.forceStageTimer(1))
  await page.waitForTimeout(1300)
  await expect(page.getByText('选择 1 个强化模块')).toBeVisible()
  await page.locator('[data-module-id]').first().click()
  await page.locator('[data-slot-id="slot_1"]').click()
  await expect(page.getByRole('button', { name: '进入下一关' })).toBeEnabled()
})
