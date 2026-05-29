import { getModuleById } from '../../data/moduleTypes'
import { PLAYER_BASE_STATS } from '../../data/playerBaseStats'
import { calculateFinalStats } from '../../systems/StatsCalculator'

describe('StatsCalculator', () => {
  it('applies percentage modules and fixed modules', () => {
    const laser = getModuleById('weapon_laser_1')!
    const shield = getModuleById('shield_basic_1')!
    const stats = calculateFinalStats(PLAYER_BASE_STATS, [laser, shield], 100)
    expect(stats.damage).toBeCloseTo(11.5)
    expect(stats.maxShield).toBe(40)
    expect(stats.shield).toBe(40)
  })

  it('clamps capped values', () => {
    const double = getModuleById('weapon_double_1')!
    const stats = calculateFinalStats(PLAYER_BASE_STATS, [double, double, double, double, double, double, double], 100)
    expect(stats.bulletCount).toBe(6)
  })

  it('keeps current hp within new max hp', () => {
    const overload = getModuleById('reactor_overload_1')!
    const stats = calculateFinalStats(PLAYER_BASE_STATS, [overload], 100)
    expect(stats.maxHp).toBe(80)
    expect(stats.hp).toBe(80)
  })
})
