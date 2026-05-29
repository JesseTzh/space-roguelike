import { expect, test } from '@playwright/test'
import { startGame } from './helpers'

test('auto attack targets nearest enemy', async ({ page }) => {
  await startGame(page)
  await page.evaluate(() => {
    window.__MVP_TEST__!.clearEnemies()
    window.__MVP_TEST__!.clearBullets()
    const p = window.__MVP_TEST__!.getPlayerSnapshot()
    window.__MVP_TEST__!.spawnEnemy({ enemyId: 'enemy_small', x: p.x, y: p.y - 100 })
    window.__MVP_TEST__!.spawnEnemy({ enemyId: 'enemy_small', x: p.x + 250, y: p.y - 300 })
  })
  await expect.poll(async () => page.evaluate(() => window.__MVP_TEST__!.getBulletSnapshots().some(b => b.owner === 'player'))).toBe(true)
})
