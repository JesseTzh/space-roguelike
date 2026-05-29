import Phaser from 'phaser'
import { resetRunContext, RunContext } from '../game/RunContext'
import { StorageRepository } from '../systems/StorageRepository'

export class GameResultScene extends Phaser.Scene {
  constructor() { super('GameResultScene') }

  create(): void {
    const ctx = RunContext.current
    const result = ctx.result
    const repo = new StorageRepository()
    if (result) {
      repo.update(save => ({
        ...save,
        clearCount: save.clearCount + (result.result === 'victory' ? 1 : 0),
        deathCount: save.deathCount + (result.result === 'defeat' ? 1 : 0),
        totalRuns: save.totalRuns + 1,
        totalKills: save.totalKills + result.totalKills,
        bestSurvivalTime: Math.max(save.bestSurvivalTime, result.survivalTime),
        bestStageReached: Math.max(save.bestStageReached, result.bestStageReached)
      }))
    }

    const { width, height } = this.scale
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_star_tile_far_01').setDepth(-10).setAlpha(0.7)
    this.add.rectangle(width / 2, height / 2, width * 0.86, height * 0.72, 0x07131d, 0.94).setStrokeStyle(2, result?.result === 'victory' ? 0x7ee8ff : 0xff775f)
    this.add.text(width / 2, height * 0.23, result?.result === 'victory' ? '通关成功' : '任务失败', { fontSize: '58px', color: result?.result === 'victory' ? '#e8fbff' : '#ffd2c9', fontStyle: 'bold' }).setOrigin(0.5)
    const buildText = result?.finalSlots.filter(slot => slot.unlocked).map(slot => `${slot.id}: ${slot.module?.name ?? '空'}`).join('\n') ?? ''
    this.add.text(width / 2, height * 0.42,
      `总击杀：${result?.totalKills ?? 0}\n总获得金钱：${result?.totalMoneyEarned ?? 0}\n存活时间：${Math.floor(result?.survivalTime ?? 0)} 秒\n最远关卡：${result?.bestStageReached ?? 1}\n\n最终构筑\n${buildText}`,
      { fontSize: '23px', color: '#cdeefa', align: 'center', lineSpacing: 8 }
    ).setOrigin(0.5)

    const restart = this.add.text(width / 2 - 130, height * 0.76, '重新开始', { fontSize: '26px', color: '#ffffff', backgroundColor: '#16405a', padding: { x: 24, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true })
    restart.on('pointerup', () => {
      resetRunContext()
      this.scene.start('GameScene')
    })
    const menu = this.add.text(width / 2 + 130, height * 0.76, '返回首页', { fontSize: '26px', color: '#ffffff', backgroundColor: '#312016', padding: { x: 24, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true })
    menu.on('pointerup', () => {
      resetRunContext()
      this.scene.start('MenuScene')
    })
  }
}
