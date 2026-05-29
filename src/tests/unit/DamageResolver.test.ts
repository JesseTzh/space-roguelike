import { describe, it, expect } from 'vitest'
import {
  applyDamageToPlayer,
  rollCrit,
  regenShield,
} from '../../systems/DamageResolver'

function stats(maxHp: number, hp: number, maxShield: number, shield: number, regen = 0) {
  return { maxHp, hp, maxShield, shield, shieldRegen: regen }
}

describe('applyDamageToPlayer', () => {
  it('zero damage does nothing', () => {
    const s = stats(100, 80, 50, 30)
    const r = applyDamageToPlayer(s, 0)
    expect(r.shieldDamage).toBe(0)
    expect(r.hpDamage).toBe(0)
    expect(s.hp).toBe(80)
    expect(s.shield).toBe(30)
  })

  it('damage absorbed by shield first', () => {
    const s = stats(100, 80, 50, 30)
    const r = applyDamageToPlayer(s, 20)
    expect(r.shieldDamage).toBe(20)
    expect(r.hpDamage).toBe(0)
    expect(s.shield).toBe(10)
    expect(s.hp).toBe(80)
    expect(r.shieldBroken).toBe(false)
  })

  it('overflow damage hits hp; shieldBroken true', () => {
    const s = stats(100, 80, 50, 30)
    const r = applyDamageToPlayer(s, 50)
    expect(r.shieldDamage).toBe(30)
    expect(r.hpDamage).toBe(20)
    expect(s.shield).toBe(0)
    expect(s.hp).toBe(60)
    expect(r.shieldBroken).toBe(true)
  })

  it('shieldBroken false when shield was already 0', () => {
    const s = stats(100, 80, 50, 0)
    const r = applyDamageToPlayer(s, 10)
    expect(r.shieldBroken).toBe(false)
    expect(s.hp).toBe(70)
  })

  it('died true when hp drops to 0', () => {
    const s = stats(100, 10, 0, 0)
    const r = applyDamageToPlayer(s, 50)
    expect(r.died).toBe(true)
    expect(s.hp).toBe(0)
  })

  it('hp clamped to 0', () => {
    const s = stats(100, 5, 0, 0)
    applyDamageToPlayer(s, 999)
    expect(s.hp).toBe(0)
  })
})

describe('rollCrit', () => {
  it('crit when roll < critRate', () => {
    const r = rollCrit(10, 0.5, 2, 0.1)
    expect(r.isCrit).toBe(true)
    expect(r.damage).toBe(20)
  })

  it('no crit when roll >= critRate', () => {
    const r = rollCrit(10, 0.5, 2, 0.6)
    expect(r.isCrit).toBe(false)
    expect(r.damage).toBe(10)
  })

  it('zero critRate never crits', () => {
    const r = rollCrit(10, 0, 2, 0)
    expect(r.isCrit).toBe(false)
  })
})

describe('regenShield', () => {
  it('does not regen when hp 0', () => {
    const s = { hp: 0, shield: 0, maxShield: 50, shieldRegen: 5 }
    regenShield(s, 1)
    expect(s.shield).toBe(0)
  })

  it('regenerates by regen * dt up to maxShield', () => {
    const s = { hp: 100, shield: 10, maxShield: 50, shieldRegen: 5 }
    regenShield(s, 1)
    expect(s.shield).toBe(15)
  })

  it('caps at maxShield', () => {
    const s = { hp: 100, shield: 48, maxShield: 50, shieldRegen: 100 }
    regenShield(s, 1)
    expect(s.shield).toBe(50)
  })
})
