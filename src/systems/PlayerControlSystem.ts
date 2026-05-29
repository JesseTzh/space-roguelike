import Phaser from 'phaser'
import type { PlayerShip } from '../entities/PlayerShip'
import { DRAG_SENSITIVITY } from '../game/constants'

export interface PlayerControlOptions {
  enabled: boolean
}

/**
 * PC: WASD + 鼠标拖拽; 鼠标拖拽优先.
 * 移动端: 任意位置单指拖拽, 增量控制.
 * 不支持点击移动.
 */
export class PlayerControlSystem {
  private scene: Phaser.Scene
  private ship: PlayerShip
  private keys: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  } | null = null

  private dragging = false
  private lastPointerX = 0
  private lastPointerY = 0
  enabled = true

  constructor(scene: Phaser.Scene, ship: PlayerShip) {
    this.scene = scene
    this.ship = ship
    this.bindKeys()
    this.bindPointer()
  }

  private bindKeys(): void {
    if (!this.scene.input.keyboard) return
    this.keys = this.scene.input.keyboard.addKeys('W,A,S,D') as typeof this.keys
  }

  private bindPointer(): void {
    this.scene.input.on('pointerdown', this.onPointerDown, this)
    this.scene.input.on('pointermove', this.onPointerMove, this)
    this.scene.input.on('pointerup', this.onPointerUp, this)
    this.scene.input.on('pointerupoutside', this.onPointerUp, this)
    this.scene.input.on('pointercancel', this.onPointerUp, this)
  }

  private onPointerDown = (pointer: Phaser.Input.Pointer): void => {
    if (!this.enabled) return
    this.dragging = true
    this.lastPointerX = pointer.x
    this.lastPointerY = pointer.y
  }

  private onPointerMove = (pointer: Phaser.Input.Pointer): void => {
    if (!this.enabled) return
    if (!this.dragging) return
    const dx = pointer.x - this.lastPointerX
    const dy = pointer.y - this.lastPointerY
    this.lastPointerX = pointer.x
    this.lastPointerY = pointer.y
    this.ship.applyDelta(dx * DRAG_SENSITIVITY, dy * DRAG_SENSITIVITY)
  }

  private onPointerUp = (): void => {
    this.dragging = false
  }

  isDragging(): boolean {
    return this.dragging
  }

  update(deltaMs: number): void {
    if (!this.enabled) return
    if (this.dragging) return
    if (!this.keys) return
    const dt = deltaMs / 1000
    let dx = 0
    let dy = 0
    if (this.keys.W?.isDown) dy -= 1
    if (this.keys.S?.isDown) dy += 1
    if (this.keys.A?.isDown) dx -= 1
    if (this.keys.D?.isDown) dx += 1
    if (dx === 0 && dy === 0) return
    const len = Math.sqrt(dx * dx + dy * dy)
    dx /= len
    dy /= len
    const speed = this.ship.stats?.moveSpeed ?? 360
    this.ship.applyDelta(dx * speed * dt, dy * speed * dt)
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.onPointerDown, this)
    this.scene.input.off('pointermove', this.onPointerMove, this)
    this.scene.input.off('pointerup', this.onPointerUp, this)
    this.scene.input.off('pointerupoutside', this.onPointerUp, this)
    this.scene.input.off('pointercancel', this.onPointerUp, this)
  }
}
