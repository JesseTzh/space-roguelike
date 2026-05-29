import type { PlayerStats } from '../types/PlayerTypes'
import type { ModuleEffect, ShipModule } from '../types/ModuleTypes'
import { STAT_LIMITS } from '../game/constants'
import { createBasePlayerStats } from '../game/data/playerBaseStats'

export function clampPlayerStats(stats: PlayerStats): void {
  stats.maxHp = Math.max(STAT_LIMITS.maxHpMin, stats.maxHp)
  stats.hp = Math.max(STAT_LIMITS.hpMin, Math.min(stats.hp, stats.maxHp))
  stats.maxShield = Math.max(STAT_LIMITS.maxShieldMin, stats.maxShield)
  stats.shield = Math.max(STAT_LIMITS.shieldMin, Math.min(stats.shield, stats.maxShield))
  stats.shieldRegen = Math.max(0, stats.shieldRegen)
  stats.moveSpeed = Math.max(
    STAT_LIMITS.moveSpeedMin,
    Math.min(STAT_LIMITS.moveSpeedMax, stats.moveSpeed),
  )
  stats.damage = Math.max(0, stats.damage)
  stats.fireRate = Math.max(
    STAT_LIMITS.fireRateMin,
    Math.min(STAT_LIMITS.fireRateMax, stats.fireRate),
  )
  stats.bulletSpeed = Math.max(100, stats.bulletSpeed)
  stats.bulletCount = Math.max(
    STAT_LIMITS.bulletCountMin,
    Math.min(STAT_LIMITS.bulletCountMax, Math.round(stats.bulletCount)),
  )
  stats.bulletSpread = Math.max(
    STAT_LIMITS.bulletSpreadMin,
    Math.min(STAT_LIMITS.bulletSpreadMax, stats.bulletSpread),
  )
  stats.critRate = Math.max(
    STAT_LIMITS.critRateMin,
    Math.min(STAT_LIMITS.critRateMax, stats.critRate),
  )
  stats.critDamage = Math.max(STAT_LIMITS.critDamageMin, stats.critDamage)
  stats.moneyBonus = Math.max(
    STAT_LIMITS.moneyBonusMin,
    Math.min(STAT_LIMITS.moneyBonusMax, stats.moneyBonus),
  )
}

export function applyModuleEffect(stats: PlayerStats, effect: ModuleEffect): void {
  switch (effect.type) {
    case 'damage_percent':
      stats.damage *= 1 + effect.value
      break
    case 'fire_rate_percent':
      stats.fireRate *= 1 + effect.value
      break
    case 'bullet_count_add':
      stats.bulletCount += effect.value
      break
    case 'bullet_speed_percent':
      stats.bulletSpeed *= 1 + effect.value
      break
    case 'bullet_spread_add':
      stats.bulletSpread += effect.value
      break
    case 'max_hp_add':
      stats.maxHp += effect.value
      break
    case 'max_shield_add':
      stats.maxShield += effect.value
      break
    case 'shield_regen_add':
      stats.shieldRegen += effect.value
      break
    case 'move_speed_percent':
      stats.moveSpeed *= 1 + effect.value
      break
    case 'money_bonus_percent':
      stats.moneyBonus += effect.value
      break
    // 事件型不直接影响数值
    case 'on_stage_end_heal':
    case 'on_shield_break_clear_enemy_bullets':
    case 'on_death_revive_once':
      break
  }
}

/**
 * 重新计算最终属性: 以 baseStats 为起点,叠加所有模块效果.
 * currentHp 用于跨关延续, hp 不会超过新的 maxHp.
 * shield 在重新计算后被设为 maxShield(新关开始时恢复).
 */
export function calculateFinalStats(
  baseStats: PlayerStats,
  modules: ShipModule[],
  currentHp: number,
): PlayerStats {
  const finalStats = structuredClone(baseStats)
  for (const m of modules) {
    for (const effect of m.effects) {
      applyModuleEffect(finalStats, effect)
    }
  }
  clampPlayerStats(finalStats)
  finalStats.hp = Math.min(currentHp, finalStats.maxHp)
  finalStats.shield = finalStats.maxShield
  return finalStats
}

export function calculatePreviewStats(
  baseStats: PlayerStats,
  modules: ShipModule[],
): PlayerStats {
  return calculateFinalStats(baseStats, modules, baseStats.maxHp)
}

export function createInitialRunStats(): PlayerStats {
  return createBasePlayerStats()
}
