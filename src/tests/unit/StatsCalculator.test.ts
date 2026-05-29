import { describe, it, expect } from 'vitest'
import { calculateFinalStats, applyModuleEffect, clampPlayerStats } from '../../systems/StatsCalculator'
import { createBasePlayerStats } from '../../game/data/playerBaseStats'
import type { ShipModule } from '../../types/ModuleTypes'

function module(id: string, effects: ShipModule['effects']): ShipModule {
  return { id, name: id, description: '', category: 'weapon', rarity: 'common', effects }
}

describe('calculateFinalStats', () => {
  it('returns base stats when no modules', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(base, [], 100)
    expect(r.maxHp).toBe(base.maxHp)
    expect(r.damage).toBe(base.damage)
  })

  it('does not mutate baseStats', () => {
    const base = createBasePlayerStats()
    const before = base.damage
    calculateFinalStats(base, [module('m', [{ type: 'damage_percent', value: 1 }])], 100)
    expect(base.damage).toBe(before)
  })

  it('damage_percent applies multiplicatively', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(
      base,
      [module('m', [{ type: 'damage_percent', value: 0.5 }])],
      base.maxHp,
    )
    expect(r.damage).toBeCloseTo(base.damage * 1.5)
  })

  it('multiple modules stack', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(
      base,
      [
        module('a', [{ type: 'damage_percent', value: 0.5 }]),
        module('b', [{ type: 'damage_percent', value: 0.5 }]),
      ],
      base.maxHp,
    )
    // (1+0.5)*(1+0.5) = 2.25
    expect(r.damage).toBeCloseTo(base.damage * 2.25)
  })

  it('bullet_count_add increments and clamps', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(
      base,
      [module('m', [{ type: 'bullet_count_add', value: 100 }])],
      base.maxHp,
    )
    expect(r.bulletCount).toBeLessThanOrEqual(6)
  })

  it('hp clamped to maxHp', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(base, [], 9999)
    expect(r.hp).toBe(base.maxHp)
  })

  it('hp preserved when below maxHp', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(base, [], 30)
    expect(r.hp).toBe(30)
  })

  it('shield reset to maxShield', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(
      base,
      [module('m', [{ type: 'max_shield_add', value: 50 }])],
      base.maxHp,
    )
    expect(r.shield).toBe(50)
  })

  it('event-only effects do not change values', () => {
    const base = createBasePlayerStats()
    const r = calculateFinalStats(
      base,
      [module('m', [{ type: 'on_death_revive_once', value: 1 }])],
      base.maxHp,
    )
    expect(r.maxHp).toBe(base.maxHp)
    expect(r.damage).toBe(base.damage)
  })
})

describe('clampPlayerStats', () => {
  it('clamps fireRate', () => {
    const s = { ...createBasePlayerStats(), fireRate: 1000 }
    clampPlayerStats(s)
    expect(s.fireRate).toBe(12)
  })

  it('clamps moneyBonus', () => {
    const s = { ...createBasePlayerStats(), moneyBonus: 5 }
    clampPlayerStats(s)
    expect(s.moneyBonus).toBe(1)
  })

  it('rounds bulletCount', () => {
    const s = { ...createBasePlayerStats(), bulletCount: 2.7 }
    clampPlayerStats(s)
    expect(s.bulletCount).toBe(3)
  })
})
