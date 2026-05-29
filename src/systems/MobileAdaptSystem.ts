import Phaser from 'phaser'

/**
 * 检测移动端,处理屏幕方向变化等.
 */
export class MobileAdaptSystem {
  constructor(private scene: Phaser.Scene) {}

  isMobile(): boolean {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    if (/Mobi|Android|iPhone|iPad|iPod|webOS/i.test(ua)) return true
    return 'ontouchstart' in (globalThis as { ontouchstart?: unknown })
  }

  isPortrait(): boolean {
    return this.scene.scale.height > this.scene.scale.width
  }

  enableTouchOnly(): void {
    if (typeof document === 'undefined') return
    const root = document.body
    if (!root) return
    root.style.touchAction = 'none'
    root.style.userSelect = 'none'
  }
}
