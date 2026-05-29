import { describe, it, expect } from 'vitest'
import { sumEffectValue, countModulesWithEffect } from '../../systems/ModuleEventResolver'
import type { ShipModule } from '../../types/ModuleTypes'

const heal20: ShipModule = {
  id: 'h1', name: 'h1', description: '', category: 'utility', rarity: 'common',
  effects: [{ type: 'on_stage_end_heal', value: 20 }],
}
const revive: ShipModule = {
  id: 'r1', name: 'r1', description: '', category: 'utility', rarity: 'epic',
  effects: [{ type: 'on_death_revive_once', value: 1 }],
}

describe('ModuleEventResolver', () => {
  it('sumEffectValue sums same effects', () => {
    expect(sumEffectValue([heal20, heal20], 'on_stage_end_heal')).toBe(40)
  })
  it('sumEffectValue 0 when none', () => {
    expect(sumEffectValue([revive], 'on_stage_end_heal')).toBe(0)
  })
  it('countModulesWithEffect counts unique modules', () => {
    expect(countModulesWithEffect([heal20, heal20, revive], 'on_stage_end_heal')).toBe(2)
    expect(countModulesWithEffect([revive], 'on_death_revive_once')).toBe(1)
  })
})
