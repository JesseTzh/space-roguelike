import type { PlayerStats } from '../types/PlayerTypes'
import type { StageConfig } from '../types/StageTypes'
import type { EnemyConfig } from '../types/EnemyTypes'
import { STAGE_HP_BONUS_MAX } from '../game/constants'

/** 击杀单个敌人获得的金钱 */
export function calcKillMoney(enemy: EnemyConfig, stats: Pick<PlayerStats, 'moneyBonus'>): number {
  return Math.floor(enemy.money * (1 + stats.moneyBonus))
}

/** 普通关卡完成奖励 */
export function calcStageReward(
  stage: StageConfig,
  stats: Pick<PlayerStats, 'hp' | 'maxHp' | 'moneyBonus'>,
): number {
  if (stage.type !== 'normal') return 0
  const hpPercent = stats.maxHp > 0 ? stats.hp / stats.maxHp : 0
  const hpBonus = Math.floor(Math.max(0, Math.min(1, hpPercent)) * STAGE_HP_BONUS_MAX)
  const stageReward = stage.baseReward + hpBonus
  return Math.floor(stageReward * (1 + stats.moneyBonus))
}

export function addMoney(current: number, delta: number): number {
  return Math.max(0, current + delta)
}

export function spendMoney(current: number, cost: number): number {
  if (cost <= 0) return current
  if (current < cost) return current
  return current - cost
}

export function canAfford(current: number, cost: number): boolean {
  return current >= cost
}
