import Phaser from 'phaser'
import type { BossConfig } from '../game/data/bossTypes'

export class Boss extends Phaser.GameObjects.Container {
  uid = 'boss_main'
  configId = ''
  hp = 0
  maxHp = 0
  contactDamage = 0
  money = 0
  radius = 110
  vx = 0
  vy = 0
  patternTimer = 0
  patternIndex = 0
  config!: BossConfig
  createdAt = 0

  private body!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, config: BossConfig) {
    super(scene, x, y)
    this.body = scene.add.image(0, 0, config.texture)
    this.body.setDisplaySize(280, 200)
    this.add(this.body)
    scene.add.existing(this)
    this.config = config
    this.configId = config.id
    this.hp = config.hp
    this.maxHp = config.hp
    this.contactDamage = config.contactDamage
    this.money = config.money
    this.createdAt = performance.now()
    this.setDepth(25)
    this.active = true
  }

  step(deltaMs: number): void {
    if (!this.active) return
    // 简单左右巡航
    const dt = deltaMs / 1000
    if (this.x < 140) this.vx = Math.abs(this.vx) || 60
    if (this.x > this.scene.scale.width - 140) this.vx = -Math.abs(this.vx) || -60
    if (this.vx === 0) this.vx = 60
    this.x += this.vx * dt
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
