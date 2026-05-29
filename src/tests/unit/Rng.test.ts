import { describe, it, expect } from 'vitest'
import { SeededRng, MathRng } from '../../systems/Rng'

describe('SeededRng', () => {
  it('produces deterministic sequence with same seed', () => {
    const a = new SeededRng(42)
    const b = new SeededRng(42)
    const seqA = [a.nextFloat(), a.nextFloat(), a.nextFloat()]
    const seqB = [b.nextFloat(), b.nextFloat(), b.nextFloat()]
    expect(seqA).toEqual(seqB)
  })

  it('different seeds produce different sequences', () => {
    const a = new SeededRng(1)
    const b = new SeededRng(2)
    expect(a.nextFloat()).not.toBe(b.nextFloat())
  })

  it('nextInt is in range', () => {
    const r = new SeededRng(123)
    for (let i = 0; i < 100; i++) {
      const v = r.nextInt(5, 10)
      expect(v).toBeGreaterThanOrEqual(5)
      expect(v).toBeLessThanOrEqual(10)
    }
  })

  it('pickWeighted respects weights', () => {
    const r = new SeededRng(777)
    const items = ['a', 'b']
    const weights = [100, 0]
    for (let i = 0; i < 50; i++) {
      expect(r.pickWeighted(items, weights)).toBe('a')
    }
  })

  it('pickWeighted handles all-zero weights', () => {
    const r = new SeededRng(1)
    expect(r.pickWeighted(['x', 'y'], [0, 0])).toBe('x')
  })

  it('MathRng nextInt is in range', () => {
    const r = new MathRng()
    for (let i = 0; i < 50; i++) {
      const v = r.nextInt(1, 3)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(3)
    }
  })
})
