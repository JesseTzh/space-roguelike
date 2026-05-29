import { findNearestTarget, getSpreadAngles } from '../../systems/TargetingSystem'
import type { TargetSnapshot } from '../../types/EnemyTypes'

function target(id: string, x: number, y: number, createdAt = 1): TargetSnapshot {
  return { id, x, y, active: true, dead: false, inBounds: true, createdAt }
}

describe('TargetingSystem', () => {
  it('returns undefined when no target is valid', () => {
    expect(findNearestTarget({ x: 0, y: 0 }, [target('dead', 1, 1)] .map(t => ({ ...t, dead: true })))).toBeUndefined()
  })

  it('selects the nearest active target', () => {
    const selected = findNearestTarget({ x: 0, y: 0 }, [target('far', 100, 0), target('near', 5, 0)])
    expect(selected?.id).toBe('near')
  })

  it('uses y and createdAt to break ties deterministically', () => {
    const selected = findNearestTarget({ x: 0, y: 0 }, [target('a', 3, 4, 2), target('b', -3, 4, 1)])
    expect(selected?.id).toBe('b')
  })

  it('spreads angles around the base angle', () => {
    const angles = getSpreadAngles(-Math.PI / 2, 3, 30)
    expect(angles).toHaveLength(3)
    expect(angles[1]).toBeCloseTo(-Math.PI / 2)
  })
})
