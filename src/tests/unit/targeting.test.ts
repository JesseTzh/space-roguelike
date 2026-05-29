import { describe, expect, it } from 'vitest'
import { findNearestTarget } from '../../systems/TargetingSystem.js'

describe('TargetingSystem', () => {
  it('chooses the nearest live target', () => {
    const target = findNearestTarget({ x: 0, y: 0 }, [
      { id: 'far', x: 100, y: 0, active: true, dead: false, createdAt: 0 },
      { id: 'near', x: 10, y: 0, active: true, dead: false, createdAt: 1 },
    ])
    expect(target?.id).toBe('near')
  })
})
