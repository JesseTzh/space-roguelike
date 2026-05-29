import type { GameState } from '../types/GameTypes'

const ALLOWED_TRANSITIONS: Record<GameState, GameState[]> = {
  Menu: ['Preload', 'StageStart'],
  Preload: ['Menu'],
  StageStart: ['Playing', 'BossStage'],
  Playing: ['Paused', 'StageCleared', 'Defeat'],
  Paused: ['Playing', 'Menu'],
  StageCleared: ['StageResult', 'Victory'],
  StageResult: ['ModuleSelect', 'SlotInstall', 'NextStage', 'Menu'],
  ModuleSelect: ['SlotInstall', 'StageResult'],
  SlotInstall: ['NextStage', 'StageResult'],
  NextStage: ['StageStart'],
  BossStage: ['Paused', 'Victory', 'Defeat'],
  Victory: ['GameResult'],
  Defeat: ['GameResult'],
  GameResult: ['Menu', 'StageStart']
}

export class GameStateMachine {
  private state: GameState

  constructor(initialState: GameState = 'Menu') {
    this.state = initialState
  }

  current(): GameState {
    return this.state
  }

  canTransition(next: GameState): boolean {
    return ALLOWED_TRANSITIONS[this.state].includes(next)
  }

  transition(next: GameState): void {
    if (!this.canTransition(next)) {
      throw new Error(`Invalid game state transition: ${this.state} -> ${next}`)
    }
    this.state = next
  }

  force(next: GameState): void {
    this.state = next
  }
}
