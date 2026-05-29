import Phaser from 'phaser'
import type { PlayerStats } from '../types/PlayerTypes'
import { PLAYER_RADIUS } from '../game/constants'

export class PlayerShip {
  readonly sprite: Phaser.GameObjects.Image
  radius = PLAYER_RADIUS

  constructor(scene: Phaser.Scene, x: number, y: number, public stats: PlayerStats) {
    this.sprite = scene.add.image(x, y, 'player_ship_01').setDepth(10).setDisplaySize(82, 82)
  }

  get x(): number { return this.sprite.x }
  get y(): number { return this.sprite.y }
  set x(value: number) { this.sprite.x = value }
  set y(value: number) { this.sprite.y = value }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y)
  }

  setInvincibleVisual(active: boolean, timeMs: number): void {
    if (!active) {
      this.sprite.setAlpha(1)
      return
    }
    this.sprite.setAlpha(Math.floor(timeMs / 80) % 2 === 0 ? 0.45 : 1)
  }

  destroy(): void {
    this.sprite.destroy()
  }
}
