import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'

export interface BulletSpawnData {
  owner: 'player' | 'enemy'
  vx: number
  vy: number
  damage: number
  ttlMs: number
  targetId?: string
  displaySize?: number
}

let bulletSeq = 0

export class Bullet implements Poolable {
  readonly id = `bullet_${++bulletSeq}`
  readonly sprite: Phaser.GameObjects.Image
  active = false
  owner: 'player' | 'enemy' = 'player'
  vx = 0
  vy = 0
  damage = 0
  ttlMs = 0
  radius = 10
  targetId?: string

  constructor(scene: Phaser.Scene, texture = 'bullet_player_01') {
    this.sprite = scene.add.image(-1000, -1000, texture).setDepth(20).setVisible(false).setActive(false)
  }

  spawn(x: number, y: number, data?: unknown): void {
    const payload = data as BulletSpawnData
    this.active = true
    this.owner = payload.owner
    this.vx = payload.vx
    this.vy = payload.vy
    this.damage = payload.damage
    this.ttlMs = payload.ttlMs
    this.targetId = payload.targetId
    this.radius = payload.displaySize ? payload.displaySize / 2 : 10
    this.sprite.setTexture(payload.owner === 'player' ? 'bullet_player_01' : 'bullet_enemy_01')
    this.sprite.setDisplaySize(payload.owner === 'player' ? 16 : 20, payload.owner === 'player' ? 30 : 20)
    this.sprite.setPosition(x, y).setVisible(true).setActive(true)
    this.sprite.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2
  }

  update(deltaMs: number): void {
    if (!this.active) return
    const dt = deltaMs / 1000
    this.sprite.x += this.vx * dt
    this.sprite.y += this.vy * dt
    this.ttlMs -= deltaMs
    if (this.ttlMs <= 0) this.despawn()
  }

  despawn(): void {
    this.active = false
    this.targetId = undefined
    this.sprite.setPosition(-1000, -1000).setVisible(false).setActive(false)
  }
}
