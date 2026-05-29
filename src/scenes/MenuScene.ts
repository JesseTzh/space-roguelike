import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants'
import { Button } from '../ui/Button'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu')
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#040814')
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bg_star_tile_far_01').setAlpha(0.7)
    this.add
      .text(GAME_WIDTH / 2, 280, '太空 Roguelike', {
        fontSize: '52px',
        color: '#6ee7ff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    this.add
      .text(GAME_WIDTH / 2, 350, 'MVP Demo', {
        fontSize: '20px',
        color: '#bcd0ff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)

    new Button(this, {
      x: GAME_WIDTH / 2,
      y: 700,
      width: 280,
      height: 64,
      label: '开始游戏',
      onClick: () => {
        this.scene.start('Game')
      },
    })

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 80, '拖拽 / WASD 移动 自动开火', {
        fontSize: '14px',
        color: '#677499',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
  }
}
