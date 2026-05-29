import { expect, test } from '@playwright/test'
import { startGame } from './helpers'

test('loads menu and starts game with test hook', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  await startGame(page)
  expect(errors).toEqual([])
})
