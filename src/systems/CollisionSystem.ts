import type { Bullet } from '../entities/Bullet'
import type { EnemyBullet } from '../entities/EnemyBullet'
import type { Enemy } from '../entities/Enemy'
import type { Boss } from '../entities/Boss'
import type { PlayerShip } from '../entities/PlayerShip'
import type { BulletSystem } from './BulletSystem'
import type { EnemySpawner } from './EnemySpawner'
import type { BossSystem } from './BossSystem'

export interface BulletHitEnemyEvent {
  enemy: Enemy
  damage: number
  isCrit: boolean
  killed: boolean
  x: number
  y: number
}

export interface BulletHitBossEvent {
  boss: Boss
  damage: number
  isCrit: boolean
  killed: boolean
  x: number
  y: number
}

export interface PlayerHitEvent {
  damage: number
  source: 'enemy_contact' | 'enemy_bullet' | 'boss_contact'
  x: number
  y: number
}

interface CollisionContext {
  bullets: BulletSystem
  enemies: EnemySpawner
  boss: BossSystem
  player: PlayerShip
  isPlayerInvincible: () => boolean
  onBulletHitEnemy: (e: BulletHitEnemyEvent) => void
  onBulletHitBoss: (e: BulletHitBossEvent) => void
  onPlayerHit: (e: PlayerHitEvent) => void
}

export class CollisionSystem {
  enabled = true
  constructor(private ctx: CollisionContext) {}

  update(): void {
    if (!this.enabled) return
    this.checkPlayerBulletsVsEnemies()
    this.checkPlayerBulletsVsBoss()
    this.checkEnemyBulletsVsPlayer()
    this.checkEnemiesVsPlayer()
    this.checkBossVsPlayer()
  }

  private checkPlayerBulletsVsEnemies(): void {
    const enemies = this.ctx.enemies.getActiveEnemies()
    if (enemies.length === 0) return
    this.ctx.bullets.playerBullets.forEachActive((bullet: Bullet) => {
      if (!bullet.active) return
      for (const e of enemies) {
        if (!e.active || e.hp <= 0) continue
        const dx = e.x - bullet.x
        const dy = e.y - bullet.y
        const r = e.radius + bullet.radius
        if (dx * dx + dy * dy <= r * r) {
          const killed = e.takeDamage(bullet.damage)
          this.ctx.onBulletHitEnemy({
            enemy: e,
            damage: bullet.damage,
            isCrit: bullet.isCrit,
            killed,
            x: bullet.x,
            y: bullet.y,
          })
          bullet.despawn()
          break
        }
      }
    })
  }

  private checkPlayerBulletsVsBoss(): void {
    const boss = this.ctx.boss.boss
    if (!boss || !boss.active || boss.hp <= 0) return
    this.ctx.bullets.playerBullets.forEachActive((bullet: Bullet) => {
      if (!bullet.active) return
      const dx = boss.x - bullet.x
      const dy = boss.y - bullet.y
      const r = boss.radius + bullet.radius
      if (dx * dx + dy * dy <= r * r) {
        const killed = boss.takeDamage(bullet.damage)
        this.ctx.onBulletHitBoss({
          boss,
          damage: bullet.damage,
          isCrit: bullet.isCrit,
          killed,
          x: bullet.x,
          y: bullet.y,
        })
        bullet.despawn()
      }
    })
  }

  private checkEnemyBulletsVsPlayer(): void {
    if (this.ctx.isPlayerInvincible()) return
    const player = this.ctx.player
    this.ctx.bullets.enemyBullets.forEachActive((bullet: EnemyBullet) => {
      if (!bullet.active) return
      const dx = player.x - bullet.x
      const dy = player.y - bullet.y
      const r = player.bodyRadius + bullet.radius
      if (dx * dx + dy * dy <= r * r) {
        this.ctx.onPlayerHit({
          damage: bullet.damage,
          source: 'enemy_bullet',
          x: bullet.x,
          y: bullet.y,
        })
        bullet.despawn()
      }
    })
  }

  private checkEnemiesVsPlayer(): void {
    if (this.ctx.isPlayerInvincible()) return
    const player = this.ctx.player
    const enemies = this.ctx.enemies.getActiveEnemies()
    for (const e of enemies) {
      if (!e.active || e.hp <= 0) continue
      const dx = player.x - e.x
      const dy = player.y - e.y
      const r = player.bodyRadius + e.radius
      if (dx * dx + dy * dy <= r * r) {
        this.ctx.onPlayerHit({
          damage: e.contactDamage,
          source: 'enemy_contact',
          x: e.x,
          y: e.y,
        })
        e.takeDamage(9999)
        return
      }
    }
  }

  private checkBossVsPlayer(): void {
    if (this.ctx.isPlayerInvincible()) return
    const boss = this.ctx.boss.boss
    if (!boss || !boss.active || boss.hp <= 0) return
    const player = this.ctx.player
    const dx = player.x - boss.x
    const dy = player.y - boss.y
    const r = player.bodyRadius + boss.radius * 0.6
    if (dx * dx + dy * dy <= r * r) {
      this.ctx.onPlayerHit({
        damage: boss.contactDamage,
        source: 'boss_contact',
        x: boss.x,
        y: boss.y,
      })
    }
  }
}
