import Phaser from 'phaser'

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene') }

  create(): void {
    const { width, height } = this.scale
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
    this.add.text(width / 2, height * 0.38, '暂停', { fontSize: '56px', color: '#ffffff' }).setOrigin(0.5)
    const resume = this.add.text(width / 2, height * 0.52, '继续游戏', { fontSize: '32px', color: '#7ee8ff', backgroundColor: '#102d3e', padding: { x: 28, y: 18 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true })
    resume.on('pointerup', () => {
      this.scene.stop()
      this.scene.resume('GameScene')
    })
    const menu = this.add.text(width / 2, height * 0.62, '返回首页', { fontSize: '28px', color: '#f5c779', backgroundColor: '#241b11', padding: { x: 24, y: 14 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true })
    menu.on('pointerup', () => {
      this.scene.stop('GameScene')
      this.scene.start('MenuScene')
    })
  }
}
