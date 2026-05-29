import { expect, test } from '@playwright/test'
import { clickCanvasRatio, startGame } from './helpers'

test('stage result can select and install module', async ({ page }) => {
  await startGame(page)
  await page.evaluate(() => window.__MVP_TEST__!.forceStageTimer(1))
  await expect.poll(async () => page.evaluate(() => window.__MVP_TEST__?.getStateSnapshot().sceneKey ?? 'StageResultScene'), { timeout: 5000 }).toBe('StageResultScene')
  await page.evaluate(() => {
    window.__MVP_TEST__!.forceModuleChoices(['weapon_laser_1', 'shield_basic_1', 'utility_radar_1'])
    window.__MVP_TEST__!.selectModule('weapon_laser_1')
    window.__MVP_TEST__!.installModule('slot_1')
  })
  await clickCanvasRatio(page, 0.72, 0.91)
  await expect.poll(async () => page.evaluate(() => window.__MVP_TEST__?.getStateSnapshot().currentStageIndex)).toBe(1)
})
