import type { EnemyConfig } from '../types/EnemyTypes'
import type { PlayerStats } from '../types/PlayerTypes'
import type { StageConfig } from '../types/StageTypes'
import { calcKillMoney, calcStageReward } from './MoneyResolver'

export interface MoneyChangeEvent {
  delta: number
  total: number
  reason: 'kill' | 'stage_reward' | 'spend' | 'reset' | 'add'
}

export class MoneySystem {
  private money = 0
  private listeners: Array<(e: MoneyChangeEvent) => void> = []

  get total(): number {
    return this.money
  }

  reset(initial = 0): void {
    this.money = initial
    this.emit({ delta: 0, total: this.money, reason: 'reset' })
  }

  awardKill(enemyCfg: EnemyConfig, stats: Pick<PlayerStats, 'moneyBonus'>): number {
    const m = calcKillMoney(enemyCfg, stats)
    if (m <= 0) return 0
    this.money += m
    this.emit({ delta: m, total: this.money, reason: 'kill' })
    return m
  }

  awardStageReward(stage: StageConfig, stats: Pick<PlayerStats, 'hp' | 'maxHp' | 'moneyBonus'>): number {
    const m = calcStageReward(stage, stats)
    if (m <= 0) return 0
    this.money += m
    this.emit({ delta: m, total: this.money, reason: 'stage_reward' })
    return m
  }

  spend(amount: number): boolean {
    if (amount <= 0) return true
    if (this.money < amount) return false
    this.money -= amount
    this.emit({ delta: -amount, total: this.money, reason: 'spend' })
    return true
  }

  addRaw(amount: number): void {
    this.money += amount
    this.emit({ delta: amount, total: this.money, reason: 'add' })
  }

  onChange(fn: (e: MoneyChangeEvent) => void): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn)
    }
  }

  private emit(e: MoneyChangeEvent): void {
    for (const l of this.listeners) l(e)
  }
}
