import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'
import {
  PLAYER_BULLET_LIFETIME_MS,
  PLAYER_BULLET_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../game/constants'

export interface PlayerBulletSpawnData {
  vx: number
  vy: number
  damage: number
  isCrit: boolean
}

export class Bullet extends Phaser.GameObjects.Container implements Poolable {
  override active = false
  vx = 0
  vy = 0
  damage = 0
  isCrit = false
  lifetime = 0
  radius = PLAYER_BULLET_RADIUS

  private visual!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    super(scene, -1000, -1000)
    this.visual = scene.add.image(0, 0, 'bullet_player_01')
    this.visual.setDisplaySize(14, 28)
    this.add(this.visual)
    scene.add.existing(this)
    this.setDepth(50)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number, data?: unknown): void {
    const d = data as PlayerBulletSpawnData
    this.setPosition(x, y)
    this.vx = d.vx
    this.vy = d.vy
    this.damage = d.damage
    this.isCrit = d.isCrit
    this.lifetime = 0
    this.radius = PLAYER_BULLET_RADIUS
    this.active = true
    this.setActive(true)
    this.setVisible(true)
    if (this.isCrit) {
      this.visual.setTint(0xfff36b)
      this.visual.setDisplaySize(16, 32)
    } else {
      this.visual.clearTint()
      this.visual.setDisplaySize(14, 28)
    }
    const angle = Math.atan2(this.vy, this.vx)
    this.setRotation(angle + Math.PI / 2)
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
      this.lifetime >= PLAYER_BULLET_LIFETIME_MS ||
      this.x < -50 ||
      this.x > GAME_WIDTH + 50 ||
      this.y < -50 ||
      this.y > GAME_HEIGHT + 50
    ) {
      this.despawn()
    }
  }
}
