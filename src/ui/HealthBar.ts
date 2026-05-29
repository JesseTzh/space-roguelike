import Phaser from 'phaser'

export interface BarOptions {
  x: number
  y: number
  width: number
  height: number
  color: number
  bgColor?: number
  borderColor?: number
}

export class HealthBar extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private fill: Phaser.GameObjects.Rectangle
  private label: Phaser.GameObjects.Text
  private opts: BarOptions
  private current = 1
  private max = 1

  constructor(scene: Phaser.Scene, opts: BarOptions) {
    super(scene, opts.x, opts.y)
    this.opts = opts
    this.bg = scene.add.rectangle(0, 0, opts.width, opts.height, opts.bgColor ?? 0x222232).setOrigin(0, 0.5)
    this.fill = scene.add.rectangle(0, 0, opts.width, opts.height, opts.color).setOrigin(0, 0.5)
    this.label = scene.add
      .text(opts.width / 2, 0, '', { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' })
      .setOrigin(0.5, 0.5)
    this.add([this.bg, this.fill, this.label])
    scene.add.existing(this)
  }

  setValues(current: number, max: number): void {
    this.current = Math.max(0, current)
    this.max = Math.max(1, max)
    const ratio = this.max > 0 ? this.current / this.max : 0
    this.fill.width = this.opts.width * Math.max(0, Math.min(1, ratio))
    this.label.setText(`${Math.ceil(this.current)} / ${Math.ceil(this.max)}`)
  }

  setColor(color: number): void {
    this.fill.fillColor = color
  }
}
