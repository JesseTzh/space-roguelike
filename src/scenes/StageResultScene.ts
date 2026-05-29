import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants'
import { Button } from '../ui/Button'
import { ModuleCard } from '../ui/ModuleCard'
import { ShipSlotPanel } from '../ui/ShipSlotPanel'
import { rollModuleChoices } from '../systems/ModuleResolver'
import { MathRng } from '../systems/Rng'
import type { ShipModule } from '../types/ModuleTypes'
import type { GameScene } from './GameScene'
import { nextUnlockPrice } from '../systems/SlotResolver'

type Phase = 'summary' | 'module' | 'install' | 'shop'

export class StageResultScene extends Phaser.Scene {
  private gameScene!: GameScene
  private phase: Phase = 'summary'
  private chosenModule: ShipModule | null = null
  private rolledModules: ShipModule[] = []
  private contentContainer!: Phaser.GameObjects.Container

  constructor() {
    super('StageResult')
  }

  init(data: { gameScene: GameScene }): void {
    this.gameScene = data.gameScene
  }

  create(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x040814, 0.92)
    this.contentContainer = this.add.container(0, 0)
    this.showSummary()
  }

  private clearContent(): void {
    this.contentContainer.removeAll(true)
  }

  private showSummary(): void {
    this.phase = 'summary'
    this.clearContent()
    const r = this.gameScene.lastStageResult
    const lines = [
      '关卡结算',
      '',
      `击杀: ${r?.kills ?? 0}`,
      `击杀金钱: $${r?.killMoney ?? 0}`,
      `关卡奖励: $${r?.stageReward ?? 0}`,
      `当前金钱: $${this.gameScene.money.total}`,
    ]
    const title = this.add
      .text(GAME_WIDTH / 2, 200, lines[0], {
        fontSize: '40px',
        color: '#6ee7ff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const body = this.add
      .text(GAME_WIDTH / 2, 320, lines.slice(2).join('\n'), {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        align: 'center',
      })
      .setOrigin(0.5, 0)
    const btn = new Button(this, {
      x: GAME_WIDTH / 2,
      y: 720,
      width: 280,
      height: 56,
      label: '继续 - 选择模块',
      onClick: () => this.showModuleSelect(),
    })
    this.contentContainer.add([title, body, btn])
  }

  private showModuleSelect(): void {
    this.phase = 'module'
    this.clearContent()
    const rng = new MathRng()
    this.rolledModules = rollModuleChoices(rng, 3)
    const title = this.add
      .text(GAME_WIDTH / 2, 140, '选择一个模块', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    this.contentContainer.add(title)
    const cardW = 200
    const gap = 20
    const totalW = this.rolledModules.length * cardW + (this.rolledModules.length - 1) * gap
    const startX = GAME_WIDTH / 2 - totalW / 2 + cardW / 2
    for (let i = 0; i < this.rolledModules.length; i++) {
      const m = this.rolledModules[i]
      const x = startX + i * (cardW + gap)
      const card = new ModuleCard(this, {
        x,
        y: 380,
        width: cardW,
        height: 220,
        module: m,
        onSelect: () => {
          this.chosenModule = m
          this.showInstallSelect()
        },
      })
      this.contentContainer.add(card)
    }
    const skip = new Button(this, {
      x: GAME_WIDTH / 2,
      y: 720,
      width: 200,
      height: 50,
      label: '跳过',
      onClick: () => this.showShop(),
    })
    this.contentContainer.add(skip)
  }

  private showInstallSelect(): void {
    this.phase = 'install'
    this.clearContent()
    if (!this.chosenModule) {
      this.showSummary()
      return
    }
    const title = this.add
      .text(GAME_WIDTH / 2, 140, `安装到哪个槽位? (${this.chosenModule.name})`, {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const panel = new ShipSlotPanel(this, {
      x: GAME_WIDTH / 2,
      y: 460,
      slots: this.gameScene.run.shipSlots,
      onSlotClick: slotId => {
        if (!this.chosenModule) return
        const ok = this.gameScene.build.installToSlot(slotId, this.chosenModule)
        if (ok) {
          this.chosenModule = null
          this.showShop()
        }
      },
      onUnlockClick: () => {
        const price = nextUnlockPrice(this.gameScene.run.shipSlots)
        if (price === null) return
        if (!this.gameScene.money.spend(price)) return
        this.gameScene.run.money = this.gameScene.money.total
        this.gameScene.build.unlockNext()
        this.showInstallSelect()
      },
    })
    const price = nextUnlockPrice(this.gameScene.run.shipSlots)
    panel.setUnlockButton(price, price !== null && this.gameScene.money.total >= price)
    const back = new Button(this, {
      x: GAME_WIDTH / 2,
      y: 720,
      width: 200,
      height: 50,
      label: '返回选模块',
      onClick: () => this.showModuleSelect(),
    })
    this.contentContainer.add([title, panel, back])
  }

  private showShop(): void {
    this.phase = 'shop'
    this.clearContent()
    const title = this.add
      .text(GAME_WIDTH / 2, 140, '舰船改装', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const moneyTxt = this.add
      .text(GAME_WIDTH / 2, 200, `当前金钱: $${this.gameScene.money.total}`, {
        fontSize: '18px',
        color: '#ffd34a',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
    const panel = new ShipSlotPanel(this, {
      x: GAME_WIDTH / 2,
      y: 480,
      slots: this.gameScene.run.shipSlots,
      onSlotClick: slotId => {
        const slot = this.gameScene.run.shipSlots.find(s => s.id === slotId)
        if (!slot) return
        if (slot.module) {
          this.gameScene.build.removeFromSlot(slotId)
          this.showShop()
        }
      },
      onUnlockClick: () => {
        const price = nextUnlockPrice(this.gameScene.run.shipSlots)
        if (price === null) return
        if (!this.gameScene.money.spend(price)) return
        this.gameScene.run.money = this.gameScene.money.total
        this.gameScene.build.unlockNext()
        this.showShop()
      },
    })
    const price = nextUnlockPrice(this.gameScene.run.shipSlots)
    panel.setUnlockButton(price, price !== null && this.gameScene.money.total >= price)
    const next = new Button(this, {
      x: GAME_WIDTH / 2,
      y: 720,
      width: 280,
      height: 56,
      label: '下一关',
      onClick: () => this.confirmNextStage(),
    })
    this.contentContainer.add([title, moneyTxt, panel, next])
  }

  private confirmNextStage(): void {
    const game = this.gameScene
    this.scene.stop()
    game.scene.resume()
    game.applyChosenModuleAndAdvance()
  }
}
