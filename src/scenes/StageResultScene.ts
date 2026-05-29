import Phaser from 'phaser'
import { STAGE_TYPES } from '../data/stageTypes'
import { getModuleById } from '../data/moduleTypes'
import { RunContext } from '../game/RunContext'
import { rollModuleChoices } from '../systems/ModuleSystem'
import { Mulberry32Rng } from '../systems/Rng'
import { advanceStage } from '../systems/StageSystem'
import { applyStageEndHealing, calculateFinalStats } from '../systems/StatsCalculator'
import { findFirstEmptyUnlockedSlot, getInstalledModules, getNextUnlockCost, installModule, purchaseNextSlot } from '../systems/ShipSlotSystem'
import type { ShipModule } from '../types/ModuleTypes'

export class StageResultScene extends Phaser.Scene {
  private selectedModule?: ShipModule
  private installed = false
  private infoText?: Phaser.GameObjects.Text
  private nextButton?: Phaser.GameObjects.Text
  private rng = new Mulberry32Rng(2026)

  constructor() { super('StageResultScene') }

  create(): void {
    const ctx = RunContext.current
    ctx.playerStats = applyStageEndHealing(ctx.playerStats, getInstalledModules(ctx.run.shipSlots))
    ctx.moduleChoices = ctx.moduleChoices.length > 0 ? ctx.moduleChoices : rollModuleChoices(3, this.rng)
    this.draw()
    this.attachTestHooks()
  }

  private draw(): void {
    this.children.removeAll(true)
    const ctx = RunContext.current
    const { width, height } = this.scale
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_star_tile_far_01').setDepth(-10).setAlpha(0.65)
    this.add.rectangle(width / 2, height / 2, width * 0.92, height * 0.86, 0x07131d, 0.92).setStrokeStyle(2, 0x7ee8ff)
    this.add.text(width / 2, 82, '关卡完成', { fontSize: '44px', color: '#e8fbff', fontStyle: 'bold' }).setOrigin(0.5)

    const summary = ctx.lastStageSummary
    this.add.text(70, 135,
      `${summary?.stageName ?? '普通关卡'}\n击杀：${summary?.kills ?? 0}\n击杀金钱：${summary?.killMoney ?? 0}\n关卡奖励：${summary?.stageReward ?? 0}\n当前金钱：${ctx.run.money}\n剩余生命：${Math.ceil(ctx.playerStats.hp)}`,
      { fontSize: '22px', color: '#cdeefa', lineSpacing: 8 }
    )

    this.add.text(width / 2, 185, '选择 1 个强化模块', { fontSize: '26px', color: '#7ee8ff' }).setOrigin(0.5)
    const startX = width / 2 - 220
    ctx.moduleChoices.forEach((module, index) => {
      const x = startX + index * 220
      const y = 330
      const selected = this.selectedModule?.id === module.id
      this.add.rectangle(x, y, 190, 260, selected ? 0x163a4c : 0x0d1d2b, 0.96).setStrokeStyle(2, selected ? 0xf5c779 : 0x407e94)
      this.add.image(x, y - 72, module.icon).setDisplaySize(82, 82)
      this.add.text(x, y + 4, `${module.name}\n${module.rarity}\n${module.description}`, { fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: 166 } }).setOrigin(0.5)
      const btn = this.add.text(x, y + 96, selected ? '已选择' : '选择', { fontSize: '20px', color: '#ffffff', backgroundColor: selected ? '#3b3612' : '#12364a', padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      btn.on('pointerup', () => {
        this.selectedModule = module
        ctx.selectedModule = module
        this.draw()
      })
    })

    this.add.text(width / 2, 500, '飞船通用插槽（点击已解锁插槽安装 / 替换）', { fontSize: '24px', color: '#cdeefa' }).setOrigin(0.5)
    const slotStartX = width / 2 - 270
    ctx.run.shipSlots.forEach((slot, index) => {
      const col = index % 3
      const row = Math.floor(index / 3)
      const x = slotStartX + col * 180
      const y = 590 + row * 118
      const fill = slot.unlocked ? (slot.module ? 0x1c3b51 : 0x112839) : 0x1a1a1a
      this.add.rectangle(x, y, 150, 94, fill, 0.95).setStrokeStyle(2, slot.unlocked ? 0x5fd5e8 : 0x555555)
      const text = this.add.text(x, y, `${slot.id}\n${slot.unlocked ? (slot.module?.name ?? '空槽') : '未解锁'}`, { fontSize: '18px', color: slot.unlocked ? '#ffffff' : '#777777', align: 'center' }).setOrigin(0.5)
      if (slot.unlocked) {
        text.setInteractive({ useHandCursor: true }).on('pointerup', () => this.installSelected(slot.id))
      }
    })

    const nextCost = getNextUnlockCost(ctx.run.shipSlots)
    const buyText = nextCost ? `购买 ${nextCost.slotId}：${nextCost.cost}` : '插槽已满'
    const buy = this.add.text(width / 2 - 120, height - 120, buyText, { fontSize: '22px', color: '#ffffff', backgroundColor: '#25341a', padding: { x: 22, y: 14 } }).setOrigin(0.5).setInteractive({ useHandCursor: true })
    buy.on('pointerup', () => {
      const result = purchaseNextSlot(ctx.run.shipSlots, ctx.run.money)
      ctx.run.shipSlots = result.slots
      ctx.run.money = result.money
      this.draw()
    })

    this.nextButton = this.add.text(width / 2 + 160, height - 120, this.installed ? '进入下一关' : '先安装模块', { fontSize: '24px', color: '#ffffff', backgroundColor: this.installed ? '#16405a' : '#333333', padding: { x: 26, y: 16 } }).setOrigin(0.5).setInteractive({ useHandCursor: true })
    this.nextButton.on('pointerup', () => {
      if (!this.installed) return
      ctx.run = advanceStage(ctx.run, STAGE_TYPES)
      ctx.playerStats = calculateFinalStats(ctx.playerStats, getInstalledModules(ctx.run.shipSlots), ctx.playerStats.hp)
      ctx.moduleChoices = []
      ctx.selectedModule = undefined
      this.scene.start('GameScene')
    })

    this.infoText = this.add.text(width / 2, height - 56, this.getHint(), { fontSize: '18px', color: '#f5c779', align: 'center' }).setOrigin(0.5)
  }

  private getHint(): string {
    if (!this.selectedModule) return '请先选择一个模块。'
    if (!this.installed) return '请选择任意已解锁插槽安装模块。已有模块的插槽会被替换。'
    return '模块已安装，可以进入下一关。'
  }

  private installSelected(slotId: string): void {
    const ctx = RunContext.current
    const module = this.selectedModule ?? ctx.selectedModule
    if (!module) {
      this.infoText?.setText('请先选择一个模块。')
      return
    }
    try {
      ctx.run.shipSlots = installModule(ctx.run.shipSlots, slotId, module)
      this.installed = true
      ctx.playerStats = calculateFinalStats(ctx.playerStats, getInstalledModules(ctx.run.shipSlots), ctx.playerStats.hp)
      this.draw()
    } catch (error) {
      this.infoText?.setText(error instanceof Error ? error.message : '安装失败')
    }
  }

  private attachTestHooks(): void {
    if (typeof window === 'undefined' || import.meta.env.MODE !== 'e2e') return
    window.__MVP_TEST__ = {
      ...(window.__MVP_TEST__ as any),
      forceModuleChoices: (moduleIds: string[]) => {
        RunContext.current.moduleChoices = moduleIds.map(id => getModuleById(id)).filter(Boolean) as ShipModule[]
        this.draw()
      },
      selectModule: (moduleId: string) => {
        const module = RunContext.current.moduleChoices.find(item => item.id === moduleId) ?? getModuleById(moduleId)
        if (module) {
          this.selectedModule = module
          RunContext.current.selectedModule = module
          this.draw()
        }
      },
      installModule: (slotId: string) => this.installSelected(slotId)
    }
  }
}
