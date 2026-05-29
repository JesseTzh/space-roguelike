import { FixedRng, Mulberry32Rng } from '../../systems/Rng'

describe('Rng', () => {
  it('produces deterministic values for same seed', () => {
    const a = new Mulberry32Rng(123)
    const b = new Mulberry32Rng(123)
    expect(a.next()).toBe(b.next())
  })

  it('fixed rng cycles values', () => {
    const rng = new FixedRng([0.5])
    expect(rng.nextInt(0, 10)).toBe(5)
    expect(rng.pick(['a', 'b'])).toBe('b')
  })
})
