import { GameStateMachine } from '../../game/GameStateMachine'
import { createNewRunContext } from '../../game/RunContext'

describe('Run state integration', () => {
  it('starts with initial slots and zero money', () => {
    const ctx = createNewRunContext()
    expect(ctx.run.money).toBe(0)
    expect(ctx.run.shipSlots.filter(slot => slot.unlocked)).toHaveLength(4)
  })

  it('allows regular state transitions', () => {
    const machine = new GameStateMachine('Menu')
    machine.transition('StageStart')
    machine.transition('Playing')
    machine.transition('StageCleared')
    machine.transition('StageResult')
    expect(machine.current()).toBe('StageResult')
  })
})
