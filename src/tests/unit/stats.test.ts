import { describe, expect, it } from 'vitest'
import { PLAYER_BASE_STATS } from '../../data/playerBaseStats.js'
import { getModuleById } from '../../data/moduleTypes.js'
import { calculateFinalStats } from '../../systems/StatsCalculator.js'

describe('StatsCalculator', () => {
  it('stacks percentage effects additively', () => {
    const stats = calculateFinalStats(PLAYER_BASE_STATS, [getModuleById('weapon_laser_1'), getModuleById('weapon_laser_1')], 100)
    expect(stats.damage).toBe(13)
  })
})
