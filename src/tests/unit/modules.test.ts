import { MODULE_TYPES } from '../../data/moduleTypes'
import { rollModuleChoices } from '../../systems/ModuleSystem'
import { FixedRng } from '../../systems/Rng'

describe('ModuleSystem', () => {
  it('rolls unique module choices', () => {
    const choices = rollModuleChoices(3, new FixedRng([0.1, 0.2, 0.3]))
    expect(new Set(choices.map(item => item.id)).size).toBe(choices.length)
  })

  it('returns only available modules when pool is small', () => {
    const choices = rollModuleChoices(3, new FixedRng([0.1]), MODULE_TYPES.slice(0, 2))
    expect(choices).toHaveLength(2)
  })
})
