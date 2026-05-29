import { describe, it, expect } from 'vitest'
import { findNearestTarget, type TargetCandidate } from '../../systems/TargetingSystem'

function c(id: string, x: number, y: number, alive = true, createdAt = 0): TargetCandidate {
  return { id, x, y, active: true, alive, createdAt }
}

describe('findNearestTarget', () => {
  it('returns null when empty', () => {
    expect(findNearestTarget(0, 0, [])).toBe(null)
  })

  it('returns null when all dead', () => {
    expect(findNearestTarget(0, 0, [c('a', 10, 10, false)])).toBe(null)
  })

  it('selects nearest by euclidean', () => {
    const t = findNearestTarget(0, 0, [c('far', 100, 0), c('near', 10, 0)])
    expect(t?.id).toBe('near')
  })

  it('tiebreaks by greater y when distances equal', () => {
    // both at y=10 (same distance). 实现:y 更大优先
    const t = findNearestTarget(0, -100, [c('top', 0, 10), c('bottom', 0, 10)])
    expect(['top', 'bottom']).toContain(t?.id)
  })

  it('prefers greater y on tie', () => {
    const t = findNearestTarget(0, 0, [c('lo', 5, -3), c('hi', 5, 3)])
    // |x|=5,|y|=3 → distance same. Prefer larger y.
    expect(t?.id).toBe('hi')
  })

  it('tiebreaks by earlier createdAt when y equal', () => {
    const t = findNearestTarget(0, 0, [
      c('newer', 0, 10, true, 200),
      c('older', 0, 10, true, 100),
    ])
    expect(t?.id).toBe('older')
  })
})
