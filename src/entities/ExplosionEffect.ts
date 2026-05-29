import Phaser from 'phaser'
import type { Poolable } from '../systems/ObjectPool'

export class ExplosionEffect extends Phaser.GameObjects.Container implements Poolable {
  override active = false
  private visual!: Phaser.GameObjects.Arc
  private timer = 0
  private duration = 360

  constructor(scene: Phaser.Scene) {
    super(scene, -1000, -1000)
    this.visual = scene.add.circle(0, 0, 18, 0xffa040, 0.85)
    this.add(this.visual)
    scene.add.existing(this)
    this.setDepth(60)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number): void {
    this.setPosition(x, y)
    this.timer = 0
    this.visual.setRadius(8)
    this.visual.setFillStyle(0xffd060, 0.9)
    this.active = true
    this.setActive(true)
    this.setVisible(true)
    this.setAlpha(1)
  }

  despawn(): void {
    this.active = false
    this.setActive(false)
    this.setVisible(false)
    this.setPosition(-1000, -1000)
  }

  step(deltaMs: number): void {
    if (!this.active) return
    this.timer += deltaMs
    const t = this.timer / this.duration
    if (t >= 1) {
      this.despawn()
      return
    }
    const radius = 8 + t * 36
    this.visual.setRadius(radius)
    this.setAlpha(1 - t)
    const color = t < 0.4 ? 0xffe060 : t < 0.7 ? 0xff8030 : 0xff5020
    this.visual.setFillStyle(color, 0.85 * (1 - t))
  }
}
