import { describe, it, expect } from 'vitest'
import { rollModuleChoices } from '../../systems/ModuleResolver'
import { SeededRng } from '../../systems/Rng'
import { MODULE_TYPES } from '../../game/data/moduleTypes'

describe('rollModuleChoices', () => {
  it('returns 3 unique modules by default', () => {
    const rng = new SeededRng(123)
    const choices = rollModuleChoices(rng)
    expect(choices).toHaveLength(3)
    const ids = new Set(choices.map(m => m.id))
    expect(ids.size).toBe(3)
  })

  it('respects requested count', () => {
    const rng = new SeededRng(456)
    expect(rollModuleChoices(rng, 5)).toHaveLength(5)
  })

  it('caps at pool size when requesting too many', () => {
    const rng = new SeededRng(1)
    const choices = rollModuleChoices(rng, 100)
    expect(choices.length).toBeLessThanOrEqual(MODULE_TYPES.length)
  })

  it('is deterministic with same seed', () => {
    const a = rollModuleChoices(new SeededRng(99), 3)
    const b = rollModuleChoices(new SeededRng(99), 3)
    expect(a.map(m => m.id)).toEqual(b.map(m => m.id))
  })

  it('all returned modules are valid', () => {
    const rng = new SeededRng(7)
    const choices = rollModuleChoices(rng)
    for (const m of choices) {
      expect(MODULE_TYPES.find(x => x.id === m.id)).toBeTruthy()
    }
  })
})
