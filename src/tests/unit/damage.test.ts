import { describe, expect, it } from 'vitest'
import { PLAYER_BASE_STATS } from '../../data/playerBaseStats.js'
import { applyDamageToPlayer, createPlayerRuntimeState } from '../../systems/DamageSystem.js'

describe('DamageSystem', () => {
  it('uses shield before hp', () => {
    const stats = { ...PLAYER_BASE_STATS, maxShield: 20, shield: 20 }
    const runtime = createPlayerRuntimeState(stats)
    applyDamageToPlayer(stats, runtime, 30)
    expect(stats.shield).toBe(0)
    expect(stats.hp).toBe(90)
  })
})
