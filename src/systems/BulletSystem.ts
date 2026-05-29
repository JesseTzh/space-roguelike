import Phaser from 'phaser'
import { Bullet } from '../entities/Bullet'
import { EnemyBullet } from '../entities/EnemyBullet'
import { ExplosionEffect } from '../entities/ExplosionEffect'
import { ObjectPool } from './ObjectPool'
import {
  POOL_INITIAL_ENEMY_BULLETS,
  POOL_INITIAL_EXPLOSIONS,
  POOL_INITIAL_PLAYER_BULLETS,
} from '../game/constants'

export class BulletSystem {
  readonly playerBullets: ObjectPool<Bullet>
  readonly enemyBullets: ObjectPool<EnemyBullet>
  readonly explosions: ObjectPool<ExplosionEffect>

  constructor(private scene: Phaser.Scene) {
    this.playerBullets = new ObjectPool<Bullet>(
      () => new Bullet(scene),
      POOL_INITIAL_PLAYER_BULLETS,
    )
    this.enemyBullets = new ObjectPool<EnemyBullet>(
      () => new EnemyBullet(scene),
      POOL_INITIAL_ENEMY_BULLETS,
    )
    this.explosions = new ObjectPool<ExplosionEffect>(
      () => new ExplosionEffect(scene),
      POOL_INITIAL_EXPLOSIONS,
    )
  }

  spawnPlayerBullet(x: number, y: number, vx: number, vy: number, damage: number, isCrit: boolean): void {
    const b = this.playerBullets.get()
    b.spawn(x, y, { vx, vy, damage, isCrit })
  }

  spawnEnemyBullet(x: number, y: number, vx: number, vy: number, damage: number): void {
    const b = this.enemyBullets.get()
    b.spawn(x, y, { vx, vy, damage })
  }

  spawnExplosion(x: number, y: number): void {
    const e = this.explosions.get()
    e.spawn(x, y)
  }

  update(deltaMs: number): void {
    this.playerBullets.forEachActive(b => b.step(deltaMs))
    this.enemyBullets.forEachActive(b => b.step(deltaMs))
    this.explosions.forEachActive(e => e.step(deltaMs))
  }

  clearAll(): void {
    this.playerBullets.releaseAll()
    this.enemyBullets.releaseAll()
    this.explosions.releaseAll()
  }

  clearEnemyBullets(): void {
    this.enemyBullets.releaseAll()
  }
}
