import type { GameState } from '../types/GameTypes.js'

const ALLOWED_TRANSITIONS: Record<GameState, GameState[]> = {
  Menu: ['Preload', 'StageStart'],
  Preload: ['Menu'],
  StageStart: ['Playing', 'BossStage'],
  Playing: ['Paused', 'StageCleared', 'Defeat'],
  Paused: ['Playing', 'Menu'],
  StageCleared: ['StageResult', 'Victory', 'Defeat'],
  StageResult: ['ModuleSelect', 'SlotInstall', 'NextStage', 'Menu'],
  ModuleSelect: ['SlotInstall', 'Menu'],
  SlotInstall: ['NextStage', 'Menu'],
  NextStage: ['StageStart'],
  BossStage: ['Paused', 'Victory', 'Defeat'],
  Victory: ['GameResult'],
  Defeat: ['GameResult'],
  GameResult: ['Menu', 'StageStart'],
}

export class GameStateMachine {
  private stateValue: GameState

  constructor(initialState: GameState = 'Menu') {
    this.stateValue = initialState
  }

  get state(): GameState {
    return this.stateValue
  }

  canTransition(next: GameState): boolean {
    return ALLOWED_TRANSITIONS[this.stateValue].includes(next)
  }

  transition(next: GameState): void {
    if (!this.canTransition(next)) {
      throw new Error(`Invalid game state transition: ${this.stateValue} -> ${next}`)
    }
    this.stateValue = next
  }

  force(next: GameState): void {
    this.stateValue = next
  }
}
