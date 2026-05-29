import Phaser from 'phaser'
import type { Enemy } from '../entities/Enemy'
import type { PlayerShip } from '../entities/PlayerShip'
import type { BulletSystem } from './BulletSystem'

/**
 * 处理普通敌人的开火逻辑(根据 enemy.attackPattern 与计时).
 * Boss 的弹幕由 BossSystem 单独处理.
 */
export class EnemyAttackSystem {
  enabled = true
  constructor(
    private scene: Phaser.Scene,
    private bullets: BulletSystem,
    private getPlayer: () => PlayerShip,
  ) {}

  update(enemies: Enemy[]): void {
    if (!this.enabled) return
    const player = this.getPlayer()
    for (const e of enemies) {
      if (!e.active || e.hp <= 0) continue
      if (e.fireInterval <= 0) continue
      if (e.fireTimer < e.fireInterval) continue
      e.fireTimer = 0
      this.fire(e, player)
    }
  }

  private fire(enemy: Enemy, player: PlayerShip): void {
    const speed = enemy.bulletSpeed
    const damage = enemy.bulletDamage
    switch (enemy.attackPattern) {
      case 'straight': {
        this.bullets.spawnEnemyBullet(enemy.x, enemy.y + 18, 0, speed, damage)
        break
      }
      case 'aimed': {
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y)
        this.bullets.spawnEnemyBullet(
          enemy.x,
          enemy.y + 12,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          damage,
        )
        break
      }
      case 'spread': {
        const center = Math.PI / 2
        const spread = (30 * Math.PI) / 180
        const count = 3
        const start = center - spread
        for (let i = 0; i < count; i++) {
          const a = start + (i * spread * 2) / (count - 1)
          this.bullets.spawnEnemyBullet(
            enemy.x,
            enemy.y + 12,
            Math.cos(a) * speed,
            Math.sin(a) * speed,
            damage,
          )
        }
        break
      }
    }
  }
}
