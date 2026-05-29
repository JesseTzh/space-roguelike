import { expect, test } from '@playwright/test'
import { startGame } from './helpers'

test('local storage save key is available', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await startGame(page)
  await page.evaluate(() => window.__MVP_TEST__!.setPlayerHp(0))
  await page.waitForTimeout(300)
  const keys = await page.evaluate(() => Object.keys(localStorage))
  expect(keys.some(key => key.includes('space_roguelike_save'))).toBeTruthy()
})
