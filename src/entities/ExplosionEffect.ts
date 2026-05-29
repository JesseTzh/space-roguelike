import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'

export class ExplosionEffect implements Poolable {
  readonly sprite: Phaser.GameObjects.Sprite
  active = false
  lifetimeMs = 0

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add.sprite(-1000, -1000, 'effect_explosion_01').setDepth(30).setVisible(false).setActive(false)
  }

  spawn(x: number, y: number): void {
    this.active = true
    this.lifetimeMs = 450
    this.sprite.setPosition(x, y).setDisplaySize(96, 96).setVisible(true).setActive(true)
    if (this.sprite.anims) {
      this.sprite.play('explosion', true)
    }
  }

  update(deltaMs: number): void {
    if (!this.active) return
    this.lifetimeMs -= deltaMs
    this.sprite.setAlpha(Math.max(0, this.lifetimeMs / 450))
    if (this.lifetimeMs <= 0) this.despawn()
  }

  despawn(): void {
    this.active = false
    this.sprite.setAlpha(1).setPosition(-1000, -1000).setVisible(false).setActive(false)
  }
}
