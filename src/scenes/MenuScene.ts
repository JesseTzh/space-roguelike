import Phaser from 'phaser'
import { resetRunContext } from '../game/RunContext'
import { StorageRepository } from '../systems/StorageRepository'

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create(): void {
    const { width, height } = this.scale
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_star_tile_far_01').setDepth(-10).setAlpha(0.9)
    this.add.text(width / 2, height * 0.22, '深空构装', { fontSize: '58px', color: '#e6fbff', fontStyle: 'bold' }).setOrigin(0.5)
    this.add.text(width / 2, height * 0.29, 'Roguelike 飞船弹幕 MVP', { fontSize: '24px', color: '#77dff5' }).setOrigin(0.5)

    const save = new StorageRepository().load()
    this.add.text(width / 2, height * 0.40,
      `通关 ${save.clearCount}  失败 ${save.deathCount}\n总击杀 ${save.totalKills}  最远关卡 ${save.bestStageReached}`,
      { fontSize: '24px', color: '#b8d9e8', align: 'center', lineSpacing: 10 }
    ).setOrigin(0.5)

    const start = this.add.rectangle(width / 2, height * 0.58, 300, 86, 0x0e3448, 0.95)
      .setStrokeStyle(2, 0x7ee8ff)
      .setInteractive({ useHandCursor: true })
      .setName('start-button')
    const startText = this.add.text(width / 2, height * 0.58, '开始游戏', { fontSize: '34px', color: '#ffffff' }).setOrigin(0.5)
    const launch = () => {
      resetRunContext()
      this.scene.start('GameScene')
    }
    start.on('pointerup', launch)
    startText.setInteractive({ useHandCursor: true }).on('pointerup', launch)

    this.add.text(width / 2, height * 0.72, 'PC：WASD / 鼠标拖拽    手机：任意位置拖拽\n飞船自动攻击最近敌人，关卡结束安装模块。',
      { fontSize: '22px', color: '#8bb8c8', align: 'center', lineSpacing: 8 }).setOrigin(0.5)
  }
}
