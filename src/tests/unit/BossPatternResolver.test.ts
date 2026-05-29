import { describe, it, expect } from 'vitest'
import { createInitialPatternState, tickBossPattern, spreadAngles } from '../../systems/BossPatternResolver'
import { getBossConfig } from '../../game/data/bossTypes'

describe('BossPatternResolver', () => {
  it('tickBossPattern returns null until interval reached', () => {
    const state = createInitialPatternState()
    const cfg = getBossConfig('boss_01')!
    const r1 = tickBossPattern(state, cfg, 100)
    expect(r1).toBe(null)
  })

  it('tickBossPattern returns pattern when interval reached and advances index', () => {
    const state = createInitialPatternState()
    const cfg = getBossConfig('boss_01')!
    const firstInterval = cfg.patternCycle[0].interval
    const r = tickBossPattern(state, cfg, firstInterval + 50)
    expect(r).not.toBe(null)
    expect(r?.name).toBe(cfg.patternCycle[0].name)
    expect(state.cycleIndex).toBe(1)
  })

  it('tickBossPattern wraps around', () => {
    const state = createInitialPatternState()
    state.cycleIndex = 3
    const cfg = getBossConfig('boss_01')!
    const interval = cfg.patternCycle[3].interval
    tickBossPattern(state, cfg, interval + 1)
    expect(state.cycleIndex).toBe(0)
  })
})

describe('spreadAngles', () => {
  it('count 0 returns empty', () => {
    expect(spreadAngles(0, 0, 90)).toEqual([])
  })

  it('count 1 returns center only', () => {
    const a = spreadAngles(Math.PI / 2, 1, 90)
    expect(a).toHaveLength(1)
    expect(a[0]).toBeCloseTo(Math.PI / 2)
  })

  it('count 3 evenly distributes around center', () => {
    const a = spreadAngles(0, 3, 90)
    expect(a).toHaveLength(3)
    expect(a[1]).toBeCloseTo(0)
    expect(a[0]).toBeCloseTo(-Math.PI / 4)
    expect(a[2]).toBeCloseTo(Math.PI / 4)
  })
})
