import Phaser from 'phaser'
import type { PlayerShip } from '../entities/PlayerShip'
import type { ShipModule } from '../types/ModuleTypes'
import { applyDamageToPlayer, regenShield } from './DamageResolver'
import { sumEffectValue } from './ModuleEventResolver'
import type { BulletSystem } from './BulletSystem'

export interface PlayerDamageEvent {
  damage: number
  hpAfter: number
  shieldAfter: number
  shieldBroken: boolean
  died: boolean
}

interface DamageSystemContext {
  ship: PlayerShip
  bullets: BulletSystem
  getInstalledModules: () => ShipModule[]
  onShieldBroken: () => void
  onDied: () => void
  onRevived: () => void
  /** 死亡时如果有可用复活,返回 true 表示已经处理 */
  tryRevive: () => boolean
}

export class DamageSystem {
  enabled = true
  private regenAccumulator = 0
  constructor(private ctx: DamageSystemContext) {}

  update(deltaMs: number): void {
    if (!this.enabled) return
    const stats = this.ctx.ship.stats
    if (!stats) return
    if (stats.hp <= 0) return
    this.regenAccumulator += deltaMs
    if (this.regenAccumulator >= 100) {
      const dt = this.regenAccumulator / 1000
      regenShield(stats, dt)
      this.regenAccumulator = 0
    }
  }

  applyDamage(damage: number, now: number): PlayerDamageEvent {
    const stats = this.ctx.ship.stats
    if (!stats || stats.hp <= 0) {
      return {
        damage: 0,
        hpAfter: stats?.hp ?? 0,
        shieldAfter: stats?.shield ?? 0,
        shieldBroken: false,
        died: true,
      }
    }
    if (this.ctx.ship.isInvincible(now)) {
      return {
        damage: 0,
        hpAfter: stats.hp,
        shieldAfter: stats.shield,
        shieldBroken: false,
        died: false,
      }
    }
    const result = applyDamageToPlayer(stats, damage)

    if (result.shieldBroken) {
      const modules = this.ctx.getInstalledModules()
      let triggerClear = false
      for (const m of modules) {
        for (const eff of m.effects) {
          if (eff.type === 'on_shield_break_clear_enemy_bullets') {
            triggerClear = true
            break
          }
        }
        if (triggerClear) break
      }
      if (triggerClear) this.ctx.bullets.clearEnemyBullets()
      this.ctx.ship.triggerInvincible(now)
      this.ctx.onShieldBroken()
    } else if (result.hpDamage > 0) {
      this.ctx.ship.triggerInvincible(now)
    }

    if (result.died) {
      const revived = this.ctx.tryRevive()
      if (revived) {
        const heal = stats.maxHp * 0.5
        stats.hp = Math.min(stats.maxHp, heal)
        stats.shield = stats.maxShield
        this.ctx.ship.triggerInvincible(now)
        this.ctx.onRevived()
        return {
          damage: result.hpDamage + result.shieldDamage,
          hpAfter: stats.hp,
          shieldAfter: stats.shield,
          shieldBroken: result.shieldBroken,
          died: false,
        }
      }
      this.ctx.onDied()
    }

    return {
      damage: result.hpDamage + result.shieldDamage,
      hpAfter: result.hpAfter,
      shieldAfter: result.shieldAfter,
      shieldBroken: result.shieldBroken,
      died: result.died,
    }
  }
}
