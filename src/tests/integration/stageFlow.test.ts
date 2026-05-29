import { describe, it, expect } from 'vitest'
import { createInitialRunState } from '../../game/RunState'
import { GameStateMachine } from '../../game/GameStateMachine'
import { getStageList, isLastStage, isBossStage } from '../../systems/StageResolver'
import { calcStageReward } from '../../systems/MoneyResolver'

describe('Stage flow', () => {
  it('5 stages: 4 normal + 1 boss', () => {
    const stages = getStageList()
    expect(stages).toHaveLength(5)
    expect(stages.filter(s => s.type === 'normal')).toHaveLength(4)
    expect(stages.filter(s => s.type === 'boss')).toHaveLength(1)
  })

  it('boss stage is last', () => {
    expect(isBossStage(4)).toBe(true)
    expect(isLastStage(4)).toBe(true)
  })

  it('full clear path through fsm', () => {
    const fsm = new GameStateMachine()
    fsm.transitionTo('StageStart')
    fsm.transitionTo('Playing')
    fsm.transitionTo('StageCleared')
    fsm.transitionTo('StageResult')
    fsm.transitionTo('ModuleSelect')
    fsm.transitionTo('SlotInstall')
    fsm.transitionTo('NextStage')
    expect(fsm.getState()).toBe('NextStage')
    fsm.transitionTo('BossStage')
    expect(fsm.getState()).toBe('BossStage')
    fsm.transitionTo('Victory')
    fsm.transitionTo('GameResult')
    expect(fsm.getState()).toBe('GameResult')
  })

  it('stage rewards accumulate', () => {
    const run = createInitialRunState()
    const stages = getStageList().filter(s => s.type === 'normal')
    let total = 0
    for (const s of stages) {
      total += calcStageReward(s, { hp: 100, maxHp: 100, moneyBonus: 0 })
    }
    run.money = total
    expect(run.money).toBe(stages.reduce((sum, s) => sum + s.baseReward + 50, 0))
  })
})
