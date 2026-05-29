import Phaser from 'phaser'
import type { PlayerShip } from '../entities/PlayerShip'
import type { Enemy } from '../entities/Enemy'
import type { Boss } from '../entities/Boss'
import type { BulletSystem } from './BulletSystem'
import { findNearestTarget, type TargetCandidate } from './TargetingSystem'
import { rollCrit } from './DamageResolver'

interface AutoAttackContext {
  getEnemies(): Enemy[]
  getBoss(): Boss | null
}

export class PlayerAutoAttackSystem {
  private timer = 0
  enabled = true

  constructor(
    private scene: Phaser.Scene,
    private ship: PlayerShip,
    private bullets: BulletSystem,
    private ctx: AutoAttackContext,
  ) {}

  update(deltaMs: number): void {
    if (!this.enabled) return
    const stats = this.ship.stats
    if (!stats) return
    if (stats.fireRate <= 0) return
    const interval = 1000 / stats.fireRate
    this.timer += deltaMs
    if (this.timer < interval) return

    const target = this.findTarget()
    if (!target) {
      // 保持就绪: 不消费冷却
      this.timer = interval
      return
    }
    this.timer -= interval

    this.fireAtTarget(target.x, target.y)
  }

  private findTarget(): { x: number; y: number } | null {
    const enemies = this.ctx.getEnemies()
    const boss = this.ctx.getBoss()
    const candidates: TargetCandidate[] = []
    for (const e of enemies) {
      if (!e.active) continue
      candidates.push({
        id: e.uid,
        x: e.x,
        y: e.y,
        active: e.active,
        alive: e.hp > 0,
        createdAt: e.createdAt,
      })
    }
    if (boss && boss.active && boss.hp > 0) {
      candidates.push({
        id: boss.uid,
        x: boss.x,
        y: boss.y,
        active: true,
        alive: true,
        createdAt: boss.createdAt,
      })
    }
    return findNearestTarget(this.ship.x, this.ship.y, candidates)
  }

  private fireAtTarget(tx: number, ty: number): void {
    const stats = this.ship.stats
    const angle = Phaser.Math.Angle.Between(this.ship.x, this.ship.y, tx, ty)
    const count = Math.max(1, stats.bulletCount)
    const spreadDeg = stats.bulletSpread
    const spreadRad = (spreadDeg * Math.PI) / 180

    let angles: number[]
    if (count === 1) {
      angles = [angle]
    } else if (count === 2) {
      angles = [angle - spreadRad / 2, angle + spreadRad / 2]
    } else {
      angles = []
      const step = spreadRad / (count - 1)
      const start = angle - spreadRad / 2
      for (let i = 0; i < count; i++) {
        angles.push(start + step * i)
      }
    }

    const damageRoll = rollCrit(stats.damage, stats.critRate, stats.critDamage, Math.random())
    for (const a of angles) {
      const vx = Math.cos(a) * stats.bulletSpeed
      const vy = Math.sin(a) * stats.bulletSpeed
      this.bullets.spawnPlayerBullet(this.ship.x, this.ship.y, vx, vy, damageRoll.damage, damageRoll.isCrit)
    }
  }

  reset(): void {
    this.timer = 0
  }
}
