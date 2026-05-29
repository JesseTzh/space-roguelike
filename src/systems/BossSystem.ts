import Phaser from 'phaser'
import type { PlayerShip } from '../entities/PlayerShip'
import { Boss } from '../entities/Boss'
import type { BossConfig } from '../game/data/bossTypes'
import { getBossConfig } from '../game/data/bossTypes'
import type { BulletSystem } from './BulletSystem'

interface BossPatternRuntime {
  index: number
  timer: number
  stepInterval: number
}

export class BossSystem {
  boss: Boss | null = null
  private state: BossPatternRuntime | null = null
  enabled = true

  constructor(
    private scene: Phaser.Scene,
    private bullets: BulletSystem,
    private getPlayer: () => PlayerShip,
  ) {}

  spawn(bossId: string = 'boss_01', x?: number, y?: number): Boss | null {
    const cfg = getBossConfig(bossId)
    if (!cfg) return null
    if (this.boss) {
      this.boss.destroy()
      this.boss = null
    }
    const { Boss } = require('../entities/Boss') as typeof import('../entities/Boss')
    const px = x ?? this.scene.scale.width / 2
    const py = y ?? 220
    this.boss = new Boss(this.scene, px, py, cfg)
    this.boss.vx = 60
    this.state = { index: 0, timer: 0, stepInterval: cfg.patternStepInterval }
    return this.boss
  }

  setBossHp(hp: number): void {
    if (!this.boss) return
    this.boss.hp = Math.max(0, Math.min(hp, this.boss.maxHp))
  }

  update(deltaMs: number): void {
    if (!this.enabled) return
    if (!this.boss || !this.boss.active || this.boss.hp <= 0) return
    this.boss.step(deltaMs)
    if (!this.state) return
    this.state.timer += deltaMs
    if (this.state.timer < this.state.stepInterval) return
    this.state.timer -= this.state.stepInterval
    const cfg = this.boss.config
    const pattern = cfg.patternCycle[this.state.index % cfg.patternCycle.length]
    this.state.index = (this.state.index + 1) % cfg.patternCycle.length
    this.fire(pattern, cfg)
  }

  private fire(pattern: BossConfig['patternCycle'][number], _cfg: BossConfig): void {
    if (!this.boss) return
    const player = this.getPlayer()
    const ox = this.boss.x
    const oy = this.boss.y + 60
    const speed = pattern.bulletSpeed
    const damage = pattern.bulletDamage
    switch (pattern.name) {
      case 'straight': {
        const count = pattern.bulletCount
        const total = (count - 1) * 24
        const startX = ox - total / 2
        for (let i = 0; i < count; i++) {
          this.bullets.spawnEnemyBullet(startX + i * 24, oy, 0, speed, damage)
        }
        break
      }
      case 'spread': {
        const count = pattern.bulletCount
        const center = Math.PI / 2
        const totalSpread = (90 * Math.PI) / 180
        const step = totalSpread / Math.max(1, count - 1)
        const start = center - totalSpread / 2
        for (let i = 0; i < count; i++) {
          const a = start + step * i
          this.bullets.spawnEnemyBullet(ox, oy, Math.cos(a) * speed, Math.sin(a) * speed, damage)
        }
        break
      }
      case 'aimed': {
        const a = Phaser.Math.Angle.Between(ox, oy, player.x, player.y)
        const count = pattern.bulletCount
        const offsetDeg = 8
        for (let i = 0; i < count; i++) {
          const da = ((i - (count - 1) / 2) * offsetDeg * Math.PI) / 180
          const ang = a + da
          this.bullets.spawnEnemyBullet(ox, oy, Math.cos(ang) * speed, Math.sin(ang) * speed, damage)
        }
        break
      }
    }
  }

  destroy(): void {
    if (this.boss) {
      this.boss.destroy()
      this.boss = null
    }
    this.state = null
  }
}
