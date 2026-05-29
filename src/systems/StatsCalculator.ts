import type { ModuleEffect, ShipModule } from '../types/ModuleTypes'
import type { PlayerStats } from '../types/PlayerTypes'

export function cloneStats(stats: PlayerStats): PlayerStats {
  return { ...stats }
}

export function applyModuleEffect(stats: PlayerStats, effect: ModuleEffect): void {
  switch (effect.type) {
    case 'damage_percent':
      stats.damage += stats.damage * effect.value
      break
    case 'fire_rate_percent':
      stats.fireRate += stats.fireRate * effect.value
      break
    case 'bullet_count_add':
      stats.bulletCount += effect.value
      break
    case 'bullet_speed_percent':
      stats.bulletSpeed += stats.bulletSpeed * effect.value
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
      stats.moveSpeed += stats.moveSpeed * effect.value
      break
    case 'money_bonus_percent':
      stats.moneyBonus += effect.value
      break
    case 'on_stage_end_heal':
    case 'on_shield_break_clear_enemy_bullets':
    case 'on_death_revive_once':
      break
    default: {
      const exhaustive: never = effect.type
      throw new Error(`Unknown module effect: ${exhaustive}`)
    }
  }
}

export function clampPlayerStats(stats: PlayerStats): PlayerStats {
  stats.maxHp = Math.max(1, stats.maxHp)
  stats.hp = Math.max(0, Math.min(stats.hp, stats.maxHp))
  stats.maxShield = Math.max(0, stats.maxShield)
  stats.shield = Math.max(0, Math.min(stats.shield, stats.maxShield))
  stats.shieldRegen = Math.max(0, stats.shieldRegen)
  stats.moveSpeed = Math.max(180, Math.min(600, stats.moveSpeed))
  stats.fireRate = Math.max(1, Math.min(12, stats.fireRate))
  stats.bulletCount = Math.max(1, Math.min(6, Math.round(stats.bulletCount)))
  stats.bulletSpread = Math.max(0, Math.min(60, stats.bulletSpread))
  stats.critRate = Math.max(0, Math.min(0.8, stats.critRate))
  stats.critDamage = Math.max(1, stats.critDamage)
  stats.moneyBonus = Math.max(0, Math.min(1, stats.moneyBonus))
  return stats
}

export function calculateFinalStats(
  baseStats: PlayerStats,
  modules: ShipModule[],
  currentHp: number
): PlayerStats {
  const finalStats = cloneStats(baseStats)
  finalStats.hp = currentHp

  for (const module of modules) {
    for (const effect of module.effects) {
      applyModuleEffect(finalStats, effect)
    }
  }

  clampPlayerStats(finalStats)
  finalStats.hp = Math.min(Math.max(0, currentHp), finalStats.maxHp)
  finalStats.shield = finalStats.maxShield
  return finalStats
}

export function applyStageEndHealing(stats: PlayerStats, modules: ShipModule[]): PlayerStats {
  const healed = cloneStats(stats)
  const totalHeal = modules.flatMap(module => module.effects)
    .filter(effect => effect.type === 'on_stage_end_heal')
    .reduce((sum, effect) => sum + effect.value, 0)
  healed.hp = Math.min(healed.maxHp, healed.hp + totalHeal)
  return healed
}
