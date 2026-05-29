import { PLAYER_BASE_STATS } from '../../data/playerBaseStats'
import { applyModuleEffect, applyStageEndHealing, calculateFinalStats, clampPlayerStats } from '../../systems/StatsCalculator'
import type { ModuleEffect, ShipModule } from '../../types/ModuleTypes'

function apply(type: ModuleEffect['type'], value: number) {
  const stats = { ...PLAYER_BASE_STATS }
  applyModuleEffect(stats, { type, value })
  return stats
}

describe('StatsCalculator branch coverage', () => {
  it('applies every numeric effect type', () => {
    expect(apply('bullet_speed_percent', 0.1).bulletSpeed).toBeCloseTo(770)
    expect(apply('bullet_spread_add', 10).bulletSpread).toBe(10)
    expect(apply('shield_regen_add', 2).shieldRegen).toBe(2)
    expect(apply('move_speed_percent', 0.1).moveSpeed).toBeCloseTo(396)
    expect(apply('money_bonus_percent', 0.2).moneyBonus).toBe(0.2)
  })

  it('ignores event-only effects in stat calculation', () => {
    expect(apply('on_shield_break_clear_enemy_bullets', 1).damage).toBe(10)
    expect(apply('on_death_revive_once', 0.3).damage).toBe(10)
  })

  it('clamps low and high values', () => {
    const stats = clampPlayerStats({
      ...PLAYER_BASE_STATS,
      maxHp: -1,
      hp: 999,
      maxShield: -5,
      shield: 999,
      shieldRegen: -1,
      moveSpeed: 9999,
      fireRate: 99,
      bulletCount: 99,
      bulletSpread: 99,
      critRate: 2,
      critDamage: 0,
      moneyBonus: 2
    })
    expect(stats.maxHp).toBe(1)
    expect(stats.hp).toBe(1)
    expect(stats.maxShield).toBe(0)
    expect(stats.moveSpeed).toBe(600)
    expect(stats.fireRate).toBe(12)
    expect(stats.bulletCount).toBe(6)
    expect(stats.bulletSpread).toBe(60)
    expect(stats.critRate).toBe(0.8)
    expect(stats.critDamage).toBe(1)
    expect(stats.moneyBonus).toBe(1)
  })

  it('applies stage-end healing modules', () => {
    const module: ShipModule = { id: 'm', name: 'm', description: '', category: 'utility', rarity: 'rare', icon: '', effects: [{ type: 'on_stage_end_heal', value: 20 }] }
    const healed = applyStageEndHealing({ ...PLAYER_BASE_STATS, hp: 60 }, [module])
    expect(healed.hp).toBe(80)
  })

  it('handles current hp below zero during final stat calculation', () => {
    expect(calculateFinalStats(PLAYER_BASE_STATS, [], -10).hp).toBe(0)
  })
})
