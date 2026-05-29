import { expect, type Page } from '@playwright/test'

export async function clickCanvasRatio(page: Page, rx: number, ry: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox()
  if (!box) throw new Error('Canvas not found')
  await page.mouse.click(box.x + box.width * rx, box.y + box.height * ry)
}

export async function dragCanvasRatio(page: Page, fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox()
  if (!box) throw new Error('Canvas not found')
  await page.mouse.move(box.x + box.width * fromX, box.y + box.height * fromY)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * toX, box.y + box.height * toY)
  await page.mouse.up()
}

export async function startGame(page: Page): Promise<void> {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await clickCanvasRatio(page, 0.5, 0.58)
  await expect.poll(async () => page.evaluate(() => Boolean(window.__MVP_TEST__))).toBe(true)
}
