import Phaser from 'phaser'
import type { PlayerStats } from '../types/PlayerTypes'
import { PLAYER_INVINCIBLE_DURATION_MS } from '../game/data/playerBaseStats'
import {
  BOTTOM_SAFE_AREA,
  GAME_HEIGHT,
  GAME_WIDTH,
  PLAYER_BODY_HALF,
  PLAYER_SHIP_HALF,
  TOP_SAFE_AREA,
} from '../game/constants'

export class PlayerShip extends Phaser.GameObjects.Container {
  stats!: PlayerStats
  invincibleUntil = 0
  shipHalfWidth = PLAYER_SHIP_HALF
  shipHalfHeight = PLAYER_SHIP_HALF
  bodyRadius = PLAYER_BODY_HALF

  private body!: Phaser.GameObjects.Image
  private flickerTween: Phaser.Tweens.Tween | null = null

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.body = scene.add.image(0, 0, 'player_ship_01')
    this.body.setDisplaySize(72, 72)
    this.add(this.body)
    scene.add.existing(this)
    this.setDepth(30)
  }

  setStats(stats: PlayerStats): void {
    this.stats = stats
  }

  /** 直接设置位置, 同时做边界限制. */
  setShipPosition(x: number, y: number): void {
    const minX = this.shipHalfWidth
    const maxX = GAME_WIDTH - this.shipHalfWidth
    const minY = TOP_SAFE_AREA + this.shipHalfHeight
    const maxY = GAME_HEIGHT - BOTTOM_SAFE_AREA - this.shipHalfHeight
    this.x = Phaser.Math.Clamp(x, minX, maxX)
    this.y = Phaser.Math.Clamp(y, minY, maxY)
  }

  applyDelta(dx: number, dy: number): void {
    this.setShipPosition(this.x + dx, this.y + dy)
  }

  isInvincible(now: number): boolean {
    return now < this.invincibleUntil
  }

  triggerInvincible(now: number): void {
    this.invincibleUntil = now + PLAYER_INVINCIBLE_DURATION_MS
    if (this.flickerTween) {
      this.flickerTween.stop()
      this.flickerTween = null
    }
    this.body.setAlpha(1)
    this.flickerTween = this.scene.tweens.add({
      targets: this.body,
      alpha: 0.3,
      yoyo: true,
      repeat: 4,
      duration: 70,
      onComplete: () => {
        this.body.setAlpha(1)
      },
    })
  }
}
