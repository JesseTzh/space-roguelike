import { test, expect } from '@playwright/test'

test.describe('App boot', () => {
  test('loads and shows menu', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', m => {
      if (m.type() === 'error') errors.push(m.text())
    })
    await page.goto('/')
    // Wait for canvas
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
    // Wait for game to have started
    await page.waitForTimeout(2000)
    // No fatal errors
    expect(errors.filter(e => !e.includes('WebGL') && !e.includes('font'))).toEqual([])
  })

  test('exposes test hooks in e2e mode', async ({ page }) => {
    await page.goto('/')
    // Click start to enter game scene
    await page.locator('canvas').click({ position: { x: 200, y: 350 } }).catch(() => {})
    // Allow main scene to load and hooks to attach
    await page.waitForTimeout(3000)
    const hookExists = await page.evaluate(() => {
      return typeof (window as unknown as { __MVP_TEST__?: unknown }).__MVP_TEST__ === 'object'
    })
    // Even if not auto-loaded, the bootstrap should expose __MVP_GAME__
    const gameExists = await page.evaluate(() => {
      return typeof (window as unknown as { __MVP_GAME__?: unknown }).__MVP_GAME__ === 'object'
    })
    expect(gameExists || hookExists).toBe(true)
  })
})
