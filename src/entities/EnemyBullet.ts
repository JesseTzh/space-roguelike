import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'
import {
  ENEMY_BULLET_LIFETIME_MS,
  ENEMY_BULLET_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../game/constants'

export interface EnemyBulletSpawnData {
  vx: number
  vy: number
  damage: number
}

export class EnemyBullet extends Phaser.GameObjects.Container implements Poolable {
  override active = false
  vx = 0
  vy = 0
  damage = 0
  lifetime = 0
  radius = ENEMY_BULLET_RADIUS

  private body!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    super(scene, -1000, -1000)
    this.body = scene.add.image(0, 0, 'bullet_enemy_01')
    this.body.setDisplaySize(20, 20)
    this.add(this.body)
    scene.add.existing(this)
    this.setDepth(40)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number, data?: unknown): void {
    const d = data as EnemyBulletSpawnData
    this.setPosition(x, y)
    this.vx = d.vx
    this.vy = d.vy
    this.damage = d.damage
    this.lifetime = 0
    this.active = true
    this.setActive(true)
    this.setVisible(true)
  }

  despawn(): void {
    this.active = false
    this.setActive(false)
    this.setVisible(false)
    this.setPosition(-1000, -1000)
  }

  step(deltaMs: number): void {
    if (!this.active) return
    const dt = deltaMs / 1000
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.lifetime += deltaMs
    if (
      this.lifetime >= ENEMY_BULLET_LIFETIME_MS ||
      this.x < -50 ||
      this.x > GAME_WIDTH + 50 ||
      this.y < -50 ||
      this.y > GAME_HEIGHT + 50
    ) {
      this.despawn()
    }
  }
}
