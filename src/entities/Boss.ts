import { getEnemyConfig } from '../data/enemyTypes.js'

let bossSerial = 0

export class Boss {
  readonly id = `boss_${++bossSerial}`
  readonly config = getEnemyConfig('boss_01')
  active = false
  dead = false
  createdAt = 0
  x = 360
  y = 180
  hp = this.config.hp
  maxHp = this.config.hp
  radius = 150
  patternIndex = 0
  patternElapsedMs = 0

  spawn(x: number, y: number, hp = this.config.hp): void {
    this.active = true
    this.dead = false
    this.createdAt = performance.now()
    this.x = x
    this.y = y
    this.hp = hp
    this.maxHp = this.config.hp
    this.patternIndex = 0
    this.patternElapsedMs = 0
  }

  takeDamage(amount: number): boolean {
    if (!this.active || this.dead) return false
    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      this.dead = true
      return true
    }
    return false
  }

  despawn(): void {
    this.active = false
    this.dead = false
  }
}
