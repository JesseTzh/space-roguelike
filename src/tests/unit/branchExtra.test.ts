import { getBossPattern, resolveBossAngles } from '../../systems/BossPatternResolver'
import { FixedRng, Mulberry32Rng } from '../../systems/Rng'
import { getCurrentStage, isFinalStage, shouldSpawnWave } from '../../systems/StageSystem'
import { StorageRepository } from '../../systems/StorageRepository'
import { createRunState } from '../../game/test-support/scenarioBuilder'
import { PLAYER_BASE_STATS } from '../../data/playerBaseStats'
import { clampPlayerStats } from '../../systems/StatsCalculator'

describe('additional branch coverage', () => {
  it('covers rng bounds and empty pick errors', () => {
    const rng = new Mulberry32Rng(1)
    expect(rng.nextInt(5, 5)).toBe(5)
    expect(() => rng.pick([])).toThrow()
    const fixed = new FixedRng([])
    expect(fixed.next()).toBe(0)
    expect(fixed.nextInt(4, 2)).toBe(4)
    expect(() => fixed.pick([])).toThrow()
  })

  it('covers boss single angle branch', () => {
    const pattern = { ...getBossPattern(0), bulletCount: 1 }
    expect(resolveBossAngles(pattern, 1.2)).toEqual([1.2])
  })

  it('covers stage edge cases', () => {
    expect(isFinalStage(createRunState({ currentStageIndex: 4 }))).toBe(true)
    expect(getCurrentStage(createRunState({ currentStageIndex: 999 })).id).toBe('stage_05')
    expect(shouldSpawnWave(getCurrentStage(createRunState()), 1, 99, 0)).toBe(false)
    expect(shouldSpawnWave(getCurrentStage(createRunState()), 1, 0, 999)).toBe(false)
  })

  it('covers storage without storage and version mismatch', () => {
    expect(new StorageRepository(undefined).load().version).toBe(1)
    const storage = window.localStorage
    storage.clear()
    storage.setItem('space_roguelike_save_v1', JSON.stringify({ version: 999 }))
    expect(new StorageRepository(storage).load().version).toBe(1)
  })

  it('covers low clamp branches', () => {
    const stats = clampPlayerStats({
      ...PLAYER_BASE_STATS,
      hp: -2,
      shield: -1,
      moveSpeed: 1,
      fireRate: 0,
      bulletCount: 0,
      bulletSpread: -1,
      critRate: -1,
      moneyBonus: -1
    })
    expect(stats.hp).toBe(0)
    expect(stats.shield).toBe(0)
    expect(stats.moveSpeed).toBe(180)
    expect(stats.fireRate).toBe(1)
    expect(stats.bulletCount).toBe(1)
    expect(stats.bulletSpread).toBe(0)
    expect(stats.critRate).toBe(0)
    expect(stats.moneyBonus).toBe(0)
  })
})
