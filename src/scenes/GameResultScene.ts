import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants'
import { Button } from '../ui/Button'
import type { RunState } from '../game/RunState'

export class GameResultScene extends Phaser.Scene {
  constructor() {
    super('GameResult')
  }

  init(data: { victory: boolean; run: RunState }): void {
    this.data.set('victory', data.victory)
    this.data.set('run', data.run)
  }

  create(): void {
    const victory = this.data.get('victory') as boolean
    const run = this.data.get('run') as RunState
    this.cameras.main.setBackgroundColor('#040814')
    this.add
      .text(GAME_WIDTH / 2, 280, victory ? '胜利' : '失败', {
        fontSize: '64px',
        color: victory ? '#6eff8a' : '#ff5b6c',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const lines = [
      `存活时间: ${run.survivalTime.toFixed(1)}s`,
      `击杀数: ${run.totalKills}`,
      `获得金钱: ${run.totalMoneyEarned}`,
      `到达关卡: ${run.currentStageIndex + 1}`,
    ]
    this.add
      .text(GAME_WIDTH / 2, 420, lines.join('\n'), {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'monospace',
        align: 'center',
      })
      .setOrigin(0.5, 0)

    new Button(this, {
      x: GAME_WIDTH / 2,
      y: 800,
      width: 240,
      height: 56,
      label: '再来一次',
      onClick: () => this.scene.start('Game'),
    })
    new Button(this, {
      x: GAME_WIDTH / 2,
      y: 880,
      width: 240,
      height: 56,
      label: '返回菜单',
      onClick: () => this.scene.start('Menu'),
    })
  }
}
