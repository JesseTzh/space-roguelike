import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, PAUSE_OVERLAY_DEPTH } from '../game/constants'

export class PausePanel extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    onResume: () => void,
    onMenu: () => void,
  ) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2)
    this.setDepth(PAUSE_OVERLAY_DEPTH)
    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65)
    const title = scene.add
      .text(0, -200, '已暂停', {
        fontSize: '40px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const resumeBtn = makeButton(scene, '继续', 0, -40, onResume)
    const menuBtn = makeButton(scene, '退出到菜单', 0, 40, onMenu)
    this.add([bg, title, resumeBtn, menuBtn])
    scene.add.existing(this)
  }
}

function makeButton(
  scene: Phaser.Scene,
  label: string,
  x: number,
  y: number,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const w = 240
  const h = 56
  const bg = scene.add.rectangle(0, 0, w, h, 0x2a78a6).setStrokeStyle(2, 0x6ee7ff)
  const t = scene.add
    .text(0, 0, label, { fontSize: '20px', color: '#ffffff', fontFamily: 'monospace' })
    .setOrigin(0.5)
  const c = scene.add.container(x, y, [bg, t])
  c.setSize(w, h)
  c.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains)
  c.on('pointerdown', onClick)
  c.on('pointerover', () => bg.setFillStyle(0x3a8fc0))
  c.on('pointerout', () => bg.setFillStyle(0x2a78a6))
  return c
}
