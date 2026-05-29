import type { EnemyConfig } from '../types/EnemyTypes'
import type { PlayerStats } from '../types/PlayerTypes'
import type { StageConfig } from '../types/StageTypes'

export function calculateKillMoney(enemy: Pick<EnemyConfig, 'money'>, stats: Pick<PlayerStats, 'moneyBonus'>): number {
  return Math.floor(enemy.money * (1 + stats.moneyBonus))
}

export function calculateStageReward(stage: Pick<StageConfig, 'baseReward'>, stats: Pick<PlayerStats, 'hp' | 'maxHp' | 'moneyBonus'>): number {
  const hpPercent = stats.maxHp <= 0 ? 0 : stats.hp / stats.maxHp
  const hpBonus = Math.floor(hpPercent * 50)
  return Math.floor((stage.baseReward + hpBonus) * (1 + stats.moneyBonus))
}

export function canSpend(money: number, cost: number): boolean {
  return money >= cost && cost >= 0
}

export function spendMoney(money: number, cost: number): number {
  if (!canSpend(money, cost)) return money
  return Math.max(0, money - cost)
}
