import { getModuleById } from '../../data/moduleTypes'
import { createDamageState, applyDamageToPlayer, regenerateShield } from '../../systems/DamageSystem'
import type { PlayerStats } from '../../types/PlayerTypes'

const stats: PlayerStats = {
  maxHp: 100,
  hp: 100,
  maxShield: 40,
  shield: 30,
  shieldRegen: 2,
  moveSpeed: 360,
  damage: 10,
  fireRate: 4,
  bulletSpeed: 700,
  bulletCount: 1,
  bulletSpread: 0,
  critRate: 0,
  critDamage: 1.5,
  moneyBonus: 0
}

describe('DamageSystem', () => {
  it('uses shield before hp', () => {
    const result = applyDamageToPlayer(createDamageState(stats), 50)
    expect(result.shieldDamage).toBe(30)
    expect(result.hpDamage).toBe(20)
    expect(result.state.stats.hp).toBe(80)
  })

  it('ignores damage during invincibility', () => {
    let state = createDamageState(stats)
    state.nowMs = 1000
    state = applyDamageToPlayer(state, 10).state
    state.nowMs = 1200
    const result = applyDamageToPlayer(state, 10)
    expect(result.ignored).toBe(true)
    expect(result.state.stats.hp).toBe(100)
  })

  it('revives once when backup core exists', () => {
    const core = getModuleById('utility_core_1')!
    const low = createDamageState({ ...stats, hp: 1, shield: 0, maxShield: 0 })
    const result = applyDamageToPlayer(low, 10, [core])
    expect(result.revived).toBe(true)
    expect(result.killed).toBe(false)
    expect(result.state.stats.hp).toBe(30)
  })

  it('regenerates shield up to max shield', () => {
    const next = regenerateShield({ ...stats, shield: 38 }, 5)
    expect(next.shield).toBe(40)
  })
})
