import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'
import type { EnemyConfig } from '../types/EnemyTypes'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants'

export interface EnemySpawnData {
  config: EnemyConfig
  pattern: 'top' | 'side' | 'diagonal' | 'random'
  vxOverride?: number
  vyOverride?: number
}

let enemyIdCounter = 0

export class Enemy extends Phaser.GameObjects.Container implements Poolable {
  override active = false
  uid = ''
  configId = ''
  hp = 0
  maxHp = 0
  contactDamage = 0
  money = 0
  vx = 0
  vy = 0
  radius = 28
  fireTimer = 0
  fireInterval = 0
  bulletDamage = 0
  bulletSpeed = 0
  attackPattern: 'straight' | 'aimed' | 'spread' | 'none' = 'none'
  createdAt = 0

  private body!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    super(scene, -1000, -1000)
    this.body = scene.add.image(0, 0, 'enemy_small_01')
    this.body.setDisplaySize(56, 56)
    this.add(this.body)
    scene.add.existing(this)
    this.setDepth(20)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number, data?: unknown): void {
    const d = data as EnemySpawnData
    this.uid = `enemy_${++enemyIdCounter}`
    this.configId = d.config.id
    this.hp = d.config.hp
    this.maxHp = d.config.hp
    this.contactDamage = d.config.contactDamage
    this.money = d.config.money
    this.createdAt = performance.now()
    this.body.setTexture(d.config.texture)
    let displaySize = 56
    if (d.config.id === 'enemy_heavy') displaySize = 80
    if (d.config.id === 'enemy_fast') displaySize = 48
    this.body.setDisplaySize(displaySize, displaySize)
    this.radius = displaySize * 0.35

    if (d.config.attack) {
      this.fireTimer = 0
      this.fireInterval = d.config.attack.fireInterval
      this.bulletDamage = d.config.attack.bulletDamage
      this.bulletSpeed = d.config.attack.bulletSpeed
      this.attackPattern = d.config.attack.pattern
    } else {
      this.fireInterval = 0
      this.attackPattern = 'none'
    }

    // 速度由 pattern 决定
    const speed = d.config.moveSpeed
    switch (d.pattern) {
      case 'top':
        this.vx = 0
        this.vy = speed
        break
      case 'side':
        this.vx = (x < GAME_WIDTH / 2 ? 1 : -1) * speed * 0.6
        this.vy = speed * 0.7
        break
      case 'diagonal':
        this.vx = (Math.random() < 0.5 ? -1 : 1) * speed * 0.5
        this.vy = speed * 0.85
        break
      case 'random':
      default:
        this.vx = (Math.random() - 0.5) * speed * 0.6
        this.vy = speed * (0.6 + Math.random() * 0.4)
    }
    if (d.vxOverride !== undefined) this.vx = d.vxOverride
    if (d.vyOverride !== undefined) this.vy = d.vyOverride

    this.setPosition(x, y)
    this.body.clearTint()
    this.setAlpha(1)
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
    if (this.fireInterval > 0) {
      this.fireTimer += deltaMs
    }
    if (this.y > GAME_HEIGHT + 100 || this.x < -100 || this.x > GAME_WIDTH + 100) {
      this.despawn()
    }
  }

  takeDamage(dmg: number): boolean {
    this.hp -= dmg
    this.body.setTint(0xffaaaa)
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.body.clearTint()
    })
    return this.hp <= 0
  }

  isAlive(): boolean {
    return this.active && this.hp > 0
  }
}
