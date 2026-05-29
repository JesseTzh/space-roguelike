import { describe, it, expect } from 'vitest'
import { calcKillMoney, calcStageReward, addMoney, spendMoney, canAfford } from '../../systems/MoneyResolver'
import type { EnemyConfig } from '../../types/EnemyTypes'
import type { StageConfig } from '../../types/StageTypes'

const enemy: EnemyConfig = {
  id: 'e',
  name: 'e',
  hp: 1,
  contactDamage: 0,
  moveSpeed: 0,
  money: 10,
  texture: 'x',
}

describe('calcKillMoney', () => {
  it('returns base money when bonus 0', () => {
    expect(calcKillMoney(enemy, { moneyBonus: 0 })).toBe(10)
  })
  it('applies bonus and floors', () => {
    expect(calcKillMoney(enemy, { moneyBonus: 0.25 })).toBe(12) // floor(12.5)
  })
})

describe('calcStageReward', () => {
  const stage: StageConfig = {
    id: 's',
    name: 's',
    type: 'normal',
    duration: 60,
    baseReward: 100,
    waves: [],
  }

  it('boss stage returns 0', () => {
    const r = calcStageReward(
      { ...stage, type: 'boss' },
      { hp: 100, maxHp: 100, moneyBonus: 0 },
    )
    expect(r).toBe(0)
  })

  it('full hp gets full bonus', () => {
    const r = calcStageReward(stage, { hp: 100, maxHp: 100, moneyBonus: 0 })
    expect(r).toBe(150) // 100 base + 50 max bonus
  })

  it('half hp gets half bonus', () => {
    const r = calcStageReward(stage, { hp: 50, maxHp: 100, moneyBonus: 0 })
    expect(r).toBe(125)
  })

  it('zero hp gets only base', () => {
    const r = calcStageReward(stage, { hp: 0, maxHp: 100, moneyBonus: 0 })
    expect(r).toBe(100)
  })

  it('applies money bonus on top', () => {
    const r = calcStageReward(stage, { hp: 100, maxHp: 100, moneyBonus: 0.5 })
    expect(r).toBe(225) // floor((100+50)*1.5)
  })
})

describe('addMoney/spendMoney/canAfford', () => {
  it('addMoney sums', () => {
    expect(addMoney(50, 25)).toBe(75)
  })
  it('addMoney clamps at 0', () => {
    expect(addMoney(10, -50)).toBe(0)
  })
  it('spendMoney returns unchanged when not enough', () => {
    expect(spendMoney(10, 50)).toBe(10)
  })
  it('spendMoney subtracts when enough', () => {
    expect(spendMoney(50, 30)).toBe(20)
  })
  it('canAfford true when enough', () => {
    expect(canAfford(50, 30)).toBe(true)
  })
  it('canAfford false when not enough', () => {
    expect(canAfford(10, 30)).toBe(false)
  })
})
