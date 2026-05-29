import Phaser from 'phaser'

export interface ButtonOptions {
  x: number
  y: number
  width: number
  height: number
  label: string
  color?: number
  hoverColor?: number
  textColor?: string
  onClick: () => void
}

export class Button extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private text: Phaser.GameObjects.Text
  private color: number
  private hoverColor: number
  private enabled = true

  constructor(scene: Phaser.Scene, opts: ButtonOptions) {
    super(scene, opts.x, opts.y)
    this.color = opts.color ?? 0x2a78a6
    this.hoverColor = opts.hoverColor ?? 0x3a8fc0
    this.bg = scene.add.rectangle(0, 0, opts.width, opts.height, this.color).setStrokeStyle(2, 0x6ee7ff)
    this.text = scene.add
      .text(0, 0, opts.label, {
        fontSize: '20px',
        color: opts.textColor ?? '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    this.add([this.bg, this.text])
    this.setSize(opts.width, opts.height)
    this.setInteractive(
      new Phaser.Geom.Rectangle(-opts.width / 2, -opts.height / 2, opts.width, opts.height),
      Phaser.Geom.Rectangle.Contains,
    )
    this.on('pointerdown', () => {
      if (this.enabled) opts.onClick()
    })
    this.on('pointerover', () => {
      if (this.enabled) this.bg.setFillStyle(this.hoverColor)
    })
    this.on('pointerout', () => this.bg.setFillStyle(this.color))
    scene.add.existing(this)
  }

  setLabel(label: string): void {
    this.text.setText(label)
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.bg.setFillStyle(enabled ? this.color : 0x444444)
    this.text.setColor(enabled ? '#ffffff' : '#888888')
  }
}
