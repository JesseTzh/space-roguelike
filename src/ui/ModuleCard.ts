import Phaser from 'phaser'
import type { ShipModule } from '../types/ModuleTypes'

const RARITY_COLORS: Record<string, number> = {
  common: 0x8a98b0,
  rare: 0x4ab8ff,
  epic: 0xc06bff,
}

export interface ModuleCardOptions {
  x: number
  y: number
  width: number
  height: number
  module: ShipModule
  onSelect: () => void
}

export class ModuleCard extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private border: Phaser.GameObjects.Rectangle
  module: ShipModule

  constructor(scene: Phaser.Scene, opts: ModuleCardOptions) {
    super(scene, opts.x, opts.y)
    this.module = opts.module
    const color = RARITY_COLORS[opts.module.rarity] ?? 0x888888
    this.bg = scene.add.rectangle(0, 0, opts.width, opts.height, 0x141826).setOrigin(0.5)
    this.border = scene.add.rectangle(0, 0, opts.width, opts.height, color, 0).setStrokeStyle(2, color).setOrigin(0.5)
    const name = scene.add
      .text(0, -opts.height / 2 + 22, opts.module.name, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5, 0)
    const rarity = scene.add
      .text(0, -opts.height / 2 + 4, `[${opts.module.rarity.toUpperCase()}]`, {
        fontSize: '12px',
        color: Phaser.Display.Color.IntegerToColor(color).rgba,
        fontFamily: 'monospace',
      })
      .setOrigin(0.5, 0)
    const desc = scene.add
      .text(0, 8, opts.module.description, {
        fontSize: '13px',
        color: '#bcd0ff',
        fontFamily: 'monospace',
        wordWrap: { width: opts.width - 24 },
        align: 'center',
      })
      .setOrigin(0.5, 0)
    this.add([this.bg, this.border, name, rarity, desc])
    this.setSize(opts.width, opts.height)
    this.setInteractive(
      new Phaser.Geom.Rectangle(-opts.width / 2, -opts.height / 2, opts.width, opts.height),
      Phaser.Geom.Rectangle.Contains,
    )
    this.on('pointerdown', opts.onSelect)
    this.on('pointerover', () => this.bg.setFillStyle(0x1d2640))
    this.on('pointerout', () => this.bg.setFillStyle(0x141826))
    scene.add.existing(this)
  }
}
