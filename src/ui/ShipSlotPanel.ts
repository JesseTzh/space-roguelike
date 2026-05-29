import Phaser from 'phaser'
import type { ShipSlot } from '../types/ShipTypes'

export interface ShipSlotPanelOptions {
  x: number
  y: number
  slots: ShipSlot[]
  onSlotClick: (slotId: string) => void
  onUnlockClick: () => void
}

const COLS = 3
const CELL = 80
const GAP = 12

export class ShipSlotPanel extends Phaser.GameObjects.Container {
  private slots: ShipSlot[]
  private cells: Phaser.GameObjects.Rectangle[] = []
  private texts: Phaser.GameObjects.Text[] = []
  private onSlotClick: (slotId: string) => void
  private onUnlockClick: () => void
  private unlockButton: Phaser.GameObjects.Container | null = null

  constructor(scene: Phaser.Scene, opts: ShipSlotPanelOptions) {
    super(scene, opts.x, opts.y)
    this.slots = opts.slots
    this.onSlotClick = opts.onSlotClick
    this.onUnlockClick = opts.onUnlockClick
    this.layout()
    scene.add.existing(this)
  }

  private layout(): void {
    for (const c of this.cells) c.destroy()
    for (const t of this.texts) t.destroy()
    this.cells = []
    this.texts = []
    const rows = Math.ceil(this.slots.length / COLS)
    const totalW = COLS * CELL + (COLS - 1) * GAP
    const totalH = rows * CELL + (rows - 1) * GAP
    const startX = -totalW / 2 + CELL / 2
    const startY = -totalH / 2 + CELL / 2
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = startX + col * (CELL + GAP)
      const y = startY + row * (CELL + GAP)
      const fillColor = slot.unlocked ? 0x232940 : 0x101522
      const cell = this.scene.add.rectangle(x, y, CELL, CELL, fillColor)
      cell.setStrokeStyle(2, slot.unlocked ? 0x4ab8ff : 0x444444)
      cell.setInteractive(
        new Phaser.Geom.Rectangle(-CELL / 2, -CELL / 2, CELL, CELL),
        Phaser.Geom.Rectangle.Contains,
      )
      cell.on('pointerdown', () => {
        if (slot.unlocked) this.onSlotClick(slot.id)
        else this.onUnlockClick()
      })
      const label = slot.unlocked
        ? slot.module
          ? slot.module.name
          : '空'
        : '锁定'
      const txt = this.scene.add
        .text(x, y, label, {
          fontSize: '11px',
          color: slot.unlocked ? '#ffffff' : '#666666',
          fontFamily: 'monospace',
          wordWrap: { width: CELL - 8 },
          align: 'center',
        })
        .setOrigin(0.5, 0.5)
      this.add([cell, txt])
      this.cells.push(cell)
      this.texts.push(txt)
    }
  }

  setUnlockButton(price: number | null, canAfford: boolean): void {
    if (this.unlockButton) {
      this.unlockButton.destroy()
      this.unlockButton = null
    }
    if (price === null) return
    const rows = Math.ceil(this.slots.length / COLS)
    const totalH = rows * CELL + (rows - 1) * GAP
    const y = totalH / 2 + 30
    const w = 220
    const h = 36
    const bg = this.scene.add.rectangle(0, 0, w, h, canAfford ? 0x2a78a6 : 0x333333)
    const t = this.scene.add
      .text(0, 0, `解锁下一槽位 $${price}`, {
        fontSize: '14px',
        color: canAfford ? '#ffffff' : '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const c = this.scene.add.container(0, y, [bg, t])
    c.setSize(w, h)
    c.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains)
    c.on('pointerdown', () => {
      if (canAfford) this.onUnlockClick()
    })
    this.add(c)
    this.unlockButton = c
  }

  refresh(slots: ShipSlot[]): void {
    this.slots = slots
    this.layout()
  }
}
