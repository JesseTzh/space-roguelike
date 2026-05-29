import { GameStateMachine } from '../../game/GameStateMachine'
import { resetRunContext, RunContext } from '../../game/RunContext'

describe('state edge cases', () => {
  it('rejects invalid transition and supports force', () => {
    const machine = new GameStateMachine('Menu')
    expect(machine.canTransition('Victory')).toBe(false)
    expect(() => machine.transition('Victory')).toThrow()
    machine.force('Victory')
    expect(machine.current()).toBe('Victory')
  })

  it('resets run context singleton', () => {
    RunContext.current.run.money = 999
    resetRunContext()
    expect(RunContext.current.run.money).toBe(0)
  })
})
