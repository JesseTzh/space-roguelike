import Phaser from 'phaser'
import { ENEMY_TYPES } from '../data/enemyTypes'

let bossSeq = 0

export class Boss {
  readonly id = `boss_${++bossSeq}`
  readonly sprite: Phaser.GameObjects.Image
  readonly radius = 130
  active = false
  dead = false
  hp = ENEMY_TYPES.boss_01.hp
  maxHp = ENEMY_TYPES.boss_01.hp
  contactDamage = ENEMY_TYPES.boss_01.contactDamage
  patternIndex = 0
  patternElapsed = 0
  createdAt = 999999

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.image(x, y, 'boss_carrier_01').setDepth(11).setDisplaySize(320, 220).setVisible(false)
  }

  spawn(x: number, y: number, hp = ENEMY_TYPES.boss_01.hp): void {
    this.active = true
    this.dead = false
    this.hp = hp
    this.maxHp = hp
    this.patternIndex = 0
    this.patternElapsed = 0
    this.sprite.setPosition(x, y).setVisible(true)
  }

  update(deltaMs: number): void {
    if (!this.active) return
    this.patternElapsed += deltaMs
  }

  takeDamage(amount: number): boolean {
    if (!this.active || this.dead) return false
    this.hp -= amount
    this.sprite.setTint(0xffffff)
    if (this.hp <= 0) {
      this.dead = true
      this.active = false
      this.sprite.setVisible(false)
      return true
    }
    return false
  }

  destroy(): void { this.sprite.destroy() }
}
