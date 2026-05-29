import Phaser from 'phaser'
import { BACKGROUND_LAYERS, type BackgroundLayerConfig } from '../data/backgroundLayers'

interface RuntimeBackgroundLayer {
  config: BackgroundLayerConfig
  sprite: Phaser.GameObjects.TileSprite
}

export class BackgroundSystem {
  private readonly layers: RuntimeBackgroundLayer[] = []
  private lastPlayerX = 0
  private lastPlayerY = 0
  private paused = false

  constructor(private readonly scene: Phaser.Scene) {}

  create(initialPlayerX: number, initialPlayerY: number): void {
    const { width, height } = this.scene.scale
    for (const config of BACKGROUND_LAYERS) {
      const sprite = this.scene.add.tileSprite(width / 2, height / 2, width, height, config.key)
        .setOrigin(0.5, 0.5)
        .setDepth(config.depth)
        .setAlpha(config.alpha)
        .setTileScale(config.tileScale, config.tileScale)
        .setScrollFactor(0)
      this.layers.push({ config, sprite })
    }
    this.lastPlayerX = initialPlayerX
    this.lastPlayerY = initialPlayerY
  }

  update(deltaMs: number, playerX: number, playerY: number): void {
    if (this.paused) return
    const deltaSeconds = deltaMs / 1000
    const playerDeltaX = playerX - this.lastPlayerX
    const playerDeltaY = playerY - this.lastPlayerY
    for (const layer of this.layers) {
      const { sprite, config } = layer
      sprite.tilePositionY -= config.scrollSpeedY * deltaSeconds
      sprite.tilePositionX += playerDeltaX * config.parallaxX
      sprite.tilePositionY += playerDeltaY * config.parallaxY
    }
    this.lastPlayerX = playerX
    this.lastPlayerY = playerY
  }

  resize(width: number, height: number): void {
    for (const layer of this.layers) {
      layer.sprite.setPosition(width / 2, height / 2)
      layer.sprite.setSize(width, height)
    }
  }

  setPaused(paused: boolean): void {
    this.paused = paused
  }

  destroy(): void {
    for (const layer of this.layers) layer.sprite.destroy()
    this.layers.length = 0
  }
}
