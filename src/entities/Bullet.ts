import type { Poolable } from '../systems/ObjectPool.js'

let bulletSerial = 0

export interface BulletSpawnData {
  owner: 'player' | 'enemy'
  vx: number
  vy: number
  damage: number
  radius?: number
  lifetimeMs?: number
  texture?: string
}

export class Bullet implements Poolable {
  readonly id = `bullet_${++bulletSerial}`
  active = false
  owner: 'player' | 'enemy' = 'player'
  x = 0
  y = 0
  vx = 0
  vy = 0
  damage = 0
  radius = 12
  lifetimeMs = 2000
  ageMs = 0
  texture = 'bullet_player_01'

  spawn(x: number, y: number, data?: unknown): void {
    const bulletData = data as BulletSpawnData
    this.active = true
    this.x = x
    this.y = y
    this.vx = bulletData.vx
    this.vy = bulletData.vy
    this.damage = bulletData.damage
    this.radius = bulletData.radius ?? 12
    this.lifetimeMs = bulletData.lifetimeMs ?? (bulletData.owner === 'player' ? 2000 : 5000)
    this.owner = bulletData.owner
    this.texture = bulletData.texture ?? (bulletData.owner === 'player' ? 'bullet_player_01' : 'bullet_enemy_01')
    this.ageMs = 0
  }

  update(deltaMs: number): void {
    if (!this.active) return
    const deltaSeconds = deltaMs / 1000
    this.x += this.vx * deltaSeconds
    this.y += this.vy * deltaSeconds
    this.ageMs += deltaMs
    if (this.ageMs >= this.lifetimeMs) this.despawn()
  }

  despawn(): void {
    this.active = false
    this.ageMs = 0
  }
}
