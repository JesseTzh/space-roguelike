import { expect, test } from '@playwright/test'
import { startGame } from './helpers'

test('boss can be spawned and defeated', async ({ page }) => {
  await startGame(page)
  await page.evaluate(() => {
    window.__MVP_TEST__!.jumpToStage('stage_05')
    window.__MVP_TEST__!.spawnBoss({ hp: 5 })
  })
  await expect.poll(async () => page.evaluate(() => window.__MVP_TEST__?.getStateSnapshot().sceneKey ?? 'GameResultScene'), { timeout: 15000 }).toBe('GameResultScene')
})
