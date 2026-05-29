import { describe, it, expect } from 'vitest'
import { GameStateMachine } from '../../game/GameStateMachine'

describe('GameStateMachine', () => {
  it('starts in Menu', () => {
    const fsm = new GameStateMachine()
    expect(fsm.getState()).toBe('Menu')
  })

  it('valid transition Menu -> StageStart succeeds', () => {
    const fsm = new GameStateMachine()
    expect(fsm.transitionTo('StageStart')).toBe(true)
    expect(fsm.getState()).toBe('StageStart')
  })

  it('invalid transition rejected', () => {
    const fsm = new GameStateMachine()
    expect(fsm.transitionTo('Victory')).toBe(false)
    expect(fsm.getState()).toBe('Menu')
  })

  it('force bypasses transition table', () => {
    const fsm = new GameStateMachine()
    fsm.force('Victory')
    expect(fsm.getState()).toBe('Victory')
  })

  it('listener fires on transition', () => {
    const fsm = new GameStateMachine()
    let called: { next: string; prev: string } | null = null
    fsm.onChange((next, prev) => { called = { next, prev } })
    fsm.transitionTo('StageStart')
    expect(called).toEqual({ next: 'StageStart', prev: 'Menu' })
  })

  it('listener does not fire on rejected transition', () => {
    const fsm = new GameStateMachine()
    let count = 0
    fsm.onChange(() => { count++ })
    fsm.transitionTo('Victory')
    expect(count).toBe(0)
  })

  it('full happy path: Menu -> StageStart -> Playing -> StageCleared -> StageResult -> ModuleSelect -> SlotInstall -> NextStage -> StageStart', () => {
    const fsm = new GameStateMachine()
    expect(fsm.transitionTo('StageStart')).toBe(true)
    expect(fsm.transitionTo('Playing')).toBe(true)
    expect(fsm.transitionTo('StageCleared')).toBe(true)
    expect(fsm.transitionTo('StageResult')).toBe(true)
    expect(fsm.transitionTo('ModuleSelect')).toBe(true)
    expect(fsm.transitionTo('SlotInstall')).toBe(true)
    expect(fsm.transitionTo('NextStage')).toBe(true)
    expect(fsm.transitionTo('StageStart')).toBe(true)
  })
})
