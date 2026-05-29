import type { PlayerStats } from '../types/PlayerTypes.js'
import type { Vector2Like } from '../types/GameTypes.js'
import { angleBetween, degToRad } from './MathUtils.js'
import { findNearestTarget, type Targetable } from './TargetingSystem.js'

export interface SpawnBulletCommand {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  owner: 'player'
}

export class PlayerAutoAttackSystem {
  private cooldownMs = 0

  reset(): void {
    this.cooldownMs = 0
  }

  update(deltaMs: number, player: Vector2Like, stats: PlayerStats, targets: readonly Targetable[]): SpawnBulletCommand[] {
    this.cooldownMs -= deltaMs
    const intervalMs = 1000 / stats.fireRate
    if (this.cooldownMs > 0) return []

    const target = findNearestTarget(player, targets)
    if (!target) {
      this.cooldownMs = 0
      return []
    }

    const baseAngle = angleBetween(player, target)
    const spread = degToRad(stats.bulletSpread)
    const count = Math.max(1, Math.floor(stats.bulletCount))
    const commands: SpawnBulletCommand[] = []

    for (let index = 0; index < count; index += 1) {
      const offset = count === 1 ? 0 : -spread / 2 + (spread * index) / (count - 1)
      const angle = baseAngle + offset
      commands.push({
        x: player.x,
        y: player.y - 20,
        vx: Math.cos(angle) * stats.bulletSpeed,
        vy: Math.sin(angle) * stats.bulletSpeed,
        damage: stats.damage,
        owner: 'player',
      })
    }

    this.cooldownMs += intervalMs
    if (this.cooldownMs < 0) this.cooldownMs = intervalMs
    return commands
  }
}
