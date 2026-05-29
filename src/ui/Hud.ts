import Phaser from 'phaser'
import { HealthBar } from './HealthBar'
import { GAME_WIDTH, HUD_DEPTH } from '../game/constants'

export class Hud extends Phaser.GameObjects.Container {
  private hpBar!: HealthBar
  private shieldBar!: HealthBar
  private moneyText!: Phaser.GameObjects.Text
  private stageText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private bossBar: HealthBar | null = null
  private bossLabel: Phaser.GameObjects.Text | null = null

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0)
    this.setDepth(HUD_DEPTH)
    this.buildTopBars()
    this.buildHud()
    scene.add.existing(this)
  }

  private buildTopBars(): void {
    this.hpBar = new HealthBar(this.scene, {
      x: 16,
      y: 18,
      width: 240,
      height: 16,
      color: 0xff5b6c,
      bgColor: 0x33202c,
    })
    this.shieldBar = new HealthBar(this.scene, {
      x: 16,
      y: 40,
      width: 240,
      height: 12,
      color: 0x5bd1ff,
      bgColor: 0x1a3344,
    })
    this.add([this.hpBar, this.shieldBar])
  }

  private buildHud(): void {
    this.moneyText = this.scene.add
      .text(GAME_WIDTH - 16, 18, '$ 0', {
        fontSize: '20px',
        color: '#ffd34a',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 0.5)
    this.stageText = this.scene.add
      .text(GAME_WIDTH / 2, 18, '', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5, 0.5)
    this.timerText = this.scene.add
      .text(GAME_WIDTH / 2, 42, '', {
        fontSize: '14px',
        color: '#bcd0ff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5, 0.5)
    this.add([this.moneyText, this.stageText, this.timerText])
  }

  setHp(hp: number, maxHp: number): void {
    this.hpBar.setValues(hp, maxHp)
  }

  setShield(shield: number, maxShield: number): void {
    this.shieldBar.setValues(shield, maxShield)
  }

  setMoney(value: number): void {
    this.moneyText.setText(`$ ${value}`)
  }

  setStage(name: string): void {
    this.stageText.setText(name)
  }

  setTimer(seconds: number, total: number): void {
    const remaining = Math.max(0, total - seconds)
    this.timerText.setText(`${Math.ceil(remaining)}s`)
  }

  showBossBar(name: string): void {
    if (this.bossBar) return
    this.bossLabel = this.scene.add
      .text(GAME_WIDTH / 2, 76, name, {
        fontSize: '16px',
        color: '#ff8a8a',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5, 0.5)
    this.bossBar = new HealthBar(this.scene, {
      x: GAME_WIDTH / 2 - 200,
      y: 96,
      width: 400,
      height: 14,
      color: 0xff5b6c,
      bgColor: 0x402030,
    })
    this.add([this.bossLabel, this.bossBar])
  }

  setBossHp(hp: number, maxHp: number): void {
    if (!this.bossBar) return
    this.bossBar.setValues(hp, maxHp)
  }

  hideBossBar(): void {
    if (this.bossBar) {
      this.bossBar.destroy()
      this.bossBar = null
    }
    if (this.bossLabel) {
      this.bossLabel.destroy()
      this.bossLabel = null
    }
  }
}
