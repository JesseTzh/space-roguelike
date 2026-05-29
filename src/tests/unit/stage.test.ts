import { STAGE_TYPES } from '../../data/stageTypes'
import { advanceStage, getCurrentStage, getStateForStage, shouldSpawnWave } from '../../systems/StageSystem'
import { createRunState } from '../../game/test-support/scenarioBuilder'

describe('StageSystem', () => {
  it('gets current stage', () => {
    expect(getCurrentStage(createRunState()).id).toBe('stage_01')
  })

  it('advances to next stage', () => {
    const run = advanceStage(createRunState())
    expect(run.currentStageIndex).toBe(1)
  })

  it('maps boss stage to BossStage state', () => {
    expect(getStateForStage(STAGE_TYPES[4])).toBe('BossStage')
  })

  it('checks wave spawn window and max alive', () => {
    expect(shouldSpawnWave(STAGE_TYPES[0], 10, 0, 0)).toBe(true)
    expect(shouldSpawnWave(STAGE_TYPES[0], 80, 0, 0)).toBe(false)
  })
})
