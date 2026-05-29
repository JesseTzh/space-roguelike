import { describe, it, expect } from 'vitest'
import { MoneySystem } from '../../systems/MoneySystem'
import { getEnemyConfig } from '../../game/data/enemyTypes'
import { getStage } from '../../systems/StageResolver'

describe('MoneySystem', () => {
  it('starts at 0', () => {
    const m = new MoneySystem()
    expect(m.total).toBe(0)
  })

  it('reset sets to initial', () => {
    const m = new MoneySystem()
    m.addRaw(50)
    m.reset(10)
    expect(m.total).toBe(10)
  })

  it('awardKill adds money based on enemy', () => {
    const m = new MoneySystem()
    const enemy = getEnemyConfig('enemy_small')!
    const got = m.awardKill(enemy, { moneyBonus: 0 })
    expect(got).toBe(enemy.money)
    expect(m.total).toBe(enemy.money)
  })

  it('awardStageReward adds based on stage', () => {
    const m = new MoneySystem()
    const stage = getStage(0)!
    const r = m.awardStageReward(stage, { hp: 100, maxHp: 100, moneyBonus: 0 })
    expect(r).toBeGreaterThan(0)
    expect(m.total).toBe(r)
  })

  it('spend succeeds when enough', () => {
    const m = new MoneySystem()
    m.addRaw(100)
    expect(m.spend(60)).toBe(true)
    expect(m.total).toBe(40)
  })

  it('spend fails when not enough', () => {
    const m = new MoneySystem()
    m.addRaw(20)
    expect(m.spend(50)).toBe(false)
    expect(m.total).toBe(20)
  })

  it('onChange listener fires', () => {
    const m = new MoneySystem()
    const events: number[] = []
    m.onChange(e => events.push(e.delta))
    m.addRaw(10)
    m.spend(5)
    expect(events).toEqual([10, -5])
  })

  it('onChange unsubscribe works', () => {
    const m = new MoneySystem()
    let count = 0
    const off = m.onChange(() => count++)
    m.addRaw(1)
    off()
    m.addRaw(1)
    expect(count).toBe(1)
  })
})
