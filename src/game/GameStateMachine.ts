import type { GameState } from '../types/GameTypes'

const TRANSITIONS: Record<GameState, GameState[]> = {
  Menu: ['Preload', 'StageStart'],
  Preload: ['Menu', 'StageStart'],
  StageStart: ['Playing'],
  Playing: ['Paused', 'StageCleared', 'BossStage', 'Defeat'],
  Paused: ['Playing', 'Menu'],
  StageCleared: ['StageResult'],
  StageResult: ['ModuleSelect'],
  ModuleSelect: ['SlotInstall', 'StageResult'],
  SlotInstall: ['NextStage', 'ModuleSelect', 'StageResult'],
  NextStage: ['StageStart', 'BossStage'],
  BossStage: ['Paused', 'Victory', 'Defeat'],
  Victory: ['GameResult'],
  Defeat: ['GameResult'],
  GameResult: ['Menu', 'StageStart'],
}

export class GameStateMachine {
  private current: GameState = 'Menu'
  private listeners: Array<(next: GameState, prev: GameState) => void> = []

  getState(): GameState {
    return this.current
  }

  canTransitionTo(next: GameState): boolean {
    if (next === this.current) return true
    return TRANSITIONS[this.current]?.includes(next) ?? false
  }

  transitionTo(next: GameState): boolean {
    if (next === this.current) return true
    if (!this.canTransitionTo(next)) {
      // 允许在测试 Hook 等场景下 force, 但默认拒绝
      return false
    }
    const prev = this.current
    this.current = next
    for (const l of this.listeners) l(next, prev)
    return true
  }

  /** 强制切换状态(用于测试 Hook 与紧急恢复). */
  force(next: GameState): void {
    if (next === this.current) return
    const prev = this.current
    this.current = next
    for (const l of this.listeners) l(next, prev)
  }

  onChange(fn: (next: GameState, prev: GameState) => void): () => void {
    this.listeners.push(fn)
    return () => {
      const idx = this.listeners.indexOf(fn)
      if (idx >= 0) this.listeners.splice(idx, 1)
    }
  }
}
