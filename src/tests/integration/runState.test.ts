import { describe, it, expect } from 'vitest'
import { createInitialRunState } from '../../game/RunState'
import { calculateFinalStats } from '../../systems/StatsCalculator'
import { createBasePlayerStats } from '../../game/data/playerBaseStats'
import { installModule, getInstalledModules, unlockNextSlot } from '../../systems/SlotResolver'
import { getModuleById } from '../../game/data/moduleTypes'
import { calcKillMoney, calcStageReward } from '../../systems/MoneyResolver'
import { getEnemyConfig } from '../../game/data/enemyTypes'
import { getStage } from '../../systems/StageResolver'

describe('RunState integration', () => {
  it('initial run has 4 unlocked slots and base stats', () => {
    const run = createInitialRunState()
    expect(run.shipSlots.filter(s => s.unlocked)).toHaveLength(4)
    const stats = calculateFinalStats(createBasePlayerStats(), [], 100)
    expect(stats.maxHp).toBe(100)
  })

  it('install weapon module increases damage and recalculates final stats', () => {
    const run = createInitialRunState()
    const m = getModuleById('weapon_railgun_1')!
    installModule(run.shipSlots, 'slot_1', m)
    const mods = getInstalledModules(run.shipSlots)
    const stats = calculateFinalStats(createBasePlayerStats(), mods, 100)
    expect(stats.damage).toBeGreaterThan(createBasePlayerStats().damage)
  })

  it('completing normal stage at full hp grants 150 (100 base + 50 bonus)', () => {
    const stage = getStage(0)!
    const reward = calcStageReward(stage, { hp: 100, maxHp: 100, moneyBonus: 0 })
    expect(reward).toBe(stage.baseReward + 50)
  })

  it('killing enemies accumulates money', () => {
    const run = createInitialRunState()
    const enemy = getEnemyConfig('enemy_small')!
    const stats = { moneyBonus: 0 }
    let earned = 0
    for (let i = 0; i < 5; i++) {
      earned += calcKillMoney(enemy, stats)
    }
    run.money = earned
    expect(run.money).toBe(15)
  })

  it('unlocking 5th slot costs 100 money', () => {
    const run = createInitialRunState()
    run.money = 100
    const r = unlockNextSlot(run.shipSlots)
    expect(r?.price).toBe(100)
  })
})
