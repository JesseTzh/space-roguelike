import type { EnemyConfig } from '../types/EnemyTypes.js'
import type { Poolable } from '../systems/ObjectPool.js'

let enemySerial = 0

export interface EnemySpawnData {
  config: EnemyConfig
  vx: number
  vy: number
  hp?: number
  radius?: number
}

export class Enemy implements Poolable {
  readonly id = `enemy_${++enemySerial}`
  active = false
  dead = false
  config!: EnemyConfig
  configId = ''
  createdAt = 0
  x = 0
  y = 0
  vx = 0
  vy = 0
  hp = 1
  radius = 28
  fireCooldownMs = 0

  spawn(x: number, y: number, data?: unknown): void {
    const spawnData = data as EnemySpawnData
    this.config = spawnData.config
    this.configId = spawnData.config.id
    this.active = true
    this.dead = false
    this.createdAt = performance.now()
    this.x = x
    this.y = y
    this.vx = spawnData.vx
    this.vy = spawnData.vy
    this.hp = spawnData.hp ?? spawnData.config.hp
    this.radius = spawnData.radius ?? (spawnData.config.id === 'enemy_heavy' ? 42 : 28)
    this.fireCooldownMs = (spawnData.config.attack?.fireInterval ?? 2) * 1000
  }

  update(deltaMs: number): void {
    if (!this.active) return
    const deltaSeconds = deltaMs / 1000
    this.x += this.vx * deltaSeconds
    this.y += this.vy * deltaSeconds
    this.fireCooldownMs -= deltaMs
  }

  takeDamage(amount: number): boolean {
    if (!this.active || this.dead) return false
    this.hp -= amount
    if (this.hp <= 0) {
      this.dead = true
      return true
    }
    return false
  }

  despawn(): void {
    this.active = false
    this.dead = false
    this.hp = 0
  }
}
