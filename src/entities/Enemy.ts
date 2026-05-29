import Phaser from 'phaser'
import type { EnemyConfig } from '../types/EnemyTypes'
import type { Poolable } from '../systems/ObjectPool'

export interface EnemySpawnData {
  config: EnemyConfig
  vx?: number
  vy?: number
  createdAt: number
}

let enemySeq = 0

export class Enemy implements Poolable {
  readonly id = `enemy_${++enemySeq}`
  readonly sprite: Phaser.GameObjects.Image
  active = false
  dead = false
  hp = 1
  maxHp = 1
  radius = 22
  contactDamage = 10
  money = 0
  type = 'enemy_small'
  vx = 0
  vy = 0
  createdAt = 0
  attackElapsed = 0
  attackInterval = 0
  bulletDamage = 0
  bulletSpeed = 0

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add.image(-1000, -1000, 'enemy_small_01').setDepth(12).setVisible(false).setActive(false)
  }

  spawn(x: number, y: number, data?: unknown): void {
    const payload = data as EnemySpawnData
    const config = payload.config
    this.active = true
    this.dead = false
    this.hp = config.hp
    this.maxHp = config.hp
    this.radius = config.radius
    this.contactDamage = config.contactDamage
    this.money = config.money
    this.type = config.id
    this.vx = payload.vx ?? 0
    this.vy = payload.vy ?? config.moveSpeed
    this.createdAt = payload.createdAt
    this.attackElapsed = 0
    this.attackInterval = config.attack?.fireInterval ?? 0
    this.bulletDamage = config.attack?.bulletDamage ?? 0
    this.bulletSpeed = config.attack?.bulletSpeed ?? 0
    this.sprite.setTexture(config.texture).setPosition(x, y).setVisible(true).setActive(true)
    if (config.id === 'enemy_heavy') this.sprite.setDisplaySize(82, 82)
    else this.sprite.setDisplaySize(52, 52)
  }

  update(deltaMs: number): void {
    if (!this.active) return
    const dt = deltaMs / 1000
    this.sprite.x += this.vx * dt
    this.sprite.y += this.vy * dt
    this.attackElapsed += deltaMs
  }

  takeDamage(amount: number): boolean {
    if (!this.active || this.dead) return false
    this.hp -= amount
    this.sprite.setTint(0xffffff)
    if (this.hp <= 0) {
      this.dead = true
      return true
    }
    return false
  }

  despawn(): void {
    this.active = false
    this.dead = false
    this.sprite.clearTint()
    this.sprite.setPosition(-1000, -1000).setVisible(false).setActive(false)
  }
}
