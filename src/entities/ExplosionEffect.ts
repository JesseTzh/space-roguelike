import type { Poolable } from '../systems/ObjectPool.js'

export class ExplosionEffect implements Poolable {
  active = false
  x = 0
  y = 0
  ageMs = 0
  durationMs = 550
  radius = 12

  spawn(x: number, y: number, data?: unknown): void {
    const options = data as { radius?: number } | undefined
    this.active = true
    this.x = x
    this.y = y
    this.ageMs = 0
    this.radius = options?.radius ?? 32
  }

  update(deltaMs: number): void {
    if (!this.active) return
    this.ageMs += deltaMs
    if (this.ageMs >= this.durationMs) this.despawn()
  }

  despawn(): void {
    this.active = false
  }
}
