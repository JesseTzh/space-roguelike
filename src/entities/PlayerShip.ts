import type { PlayerRuntimeState, PlayerStats } from '../types/PlayerTypes.js'
import { PLAYER_COLLISION_RADIUS } from '../game/constants.js'
import { createPlayerRuntimeState } from '../systems/DamageSystem.js'
import { clamp } from '../systems/MathUtils.js'

export class PlayerShip {
  x: number
  y: number
  radius = PLAYER_COLLISION_RADIUS
  runtime: PlayerRuntimeState

  constructor(
    public stats: PlayerStats,
    x: number,
    y: number,
    private readonly worldWidth: number,
    private readonly worldHeight: number,
  ) {
    this.x = x
    this.y = y
    this.runtime = createPlayerRuntimeState(stats)
  }

  setStats(stats: PlayerStats): void {
    this.stats = stats
    this.runtime.shieldWasPositive = stats.shield > 0
  }

  moveBy(dx: number, dy: number): void {
    this.x += dx
    this.y += dy
    this.clampToBounds()
  }

  moveDirection(dx: number, dy: number, deltaSeconds: number): void {
    const length = Math.hypot(dx, dy)
    if (length <= 0) return
    this.moveBy((dx / length) * this.stats.moveSpeed * deltaSeconds, (dy / length) * this.stats.moveSpeed * deltaSeconds)
  }

  clampToBounds(): void {
    this.x = clamp(this.x, this.radius, this.worldWidth - this.radius)
    this.y = clamp(this.y, this.radius + 24, this.worldHeight - this.radius - 24)
  }
}
