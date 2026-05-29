import type { EnemyConfig } from '../types/EnemyTypes.js'
import type { PlayerStats } from '../types/PlayerTypes.js'
import type { StageConfig } from '../types/StageTypes.js'

export function calculateKillMoney(enemy: EnemyConfig, playerStats: PlayerStats): number {
  return Math.max(0, Math.floor(enemy.money * (1 + playerStats.moneyBonus)))
}

export function calculateStageReward(stage: StageConfig, playerStats: PlayerStats): number {
  const hpPercent = playerStats.maxHp > 0 ? playerStats.hp / playerStats.maxHp : 0
  const hpBonus = Math.floor(Math.max(0, hpPercent) * 50)
  const stageReward = stage.baseReward + hpBonus
  return Math.max(0, Math.floor(stageReward * (1 + playerStats.moneyBonus)))
}

export function canAfford(money: number, cost: number): boolean {
  return money >= cost
}
