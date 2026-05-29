import { describe, expect, it } from 'vitest'
import { StageSystem } from '../../systems/StageSystem.js'
import { STAGE_TYPES } from '../../data/stageTypes.js'

describe('StageSystem flow', () => {
  it('completes and advances a normal stage', () => {
    const system = new StageSystem(STAGE_TYPES)
    system.forceTimer(0)
    expect(system.isNormalStageComplete()).toBe(true)
    system.nextStage()
    expect(system.currentStage.id).toBe('stage_02')
  })
})
