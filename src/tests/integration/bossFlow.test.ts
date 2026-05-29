import { getBossPattern, resolveBossAngles } from '../../systems/BossPatternResolver'

describe('Boss flow', () => {
  it('loops through configured boss pattern sequence', () => {
    expect(getBossPattern(0).kind).toBe('line')
    expect(getBossPattern(2).kind).toBe('spread')
    expect(getBossPattern(4).kind).toBe('line')
  })

  it('resolves spread angles', () => {
    expect(resolveBossAngles(getBossPattern(2), Math.PI / 2)).toHaveLength(9)
  })
})
